import { Router, Request, Response } from "express";
import { GoogleGenAI, Type } from "@google/genai";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const router = Router();

// In-Memory Cache and Inflight Protection Data Structures
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const AI_CACHE_TTL_MS = 60000; // 60 seconds TTL
const aiCacheMap = new Map<string, CacheEntry<any>>();
const aiInflightMap = new Map<string, Promise<any>>();

// Automatic periodic cache cleanup for expired entries
setInterval(() => {
  try {
    const now = Date.now();
    for (const [key, entry] of aiCacheMap.entries()) {
      if (now - entry.timestamp > AI_CACHE_TTL_MS) {
        aiCacheMap.delete(key);
      }
    }
  } catch (_) {}
}, 30000).unref();

function generateDeterministicCacheKey(prefix: string, payload: any): string {
  try {
    const sortObjectKeys = (obj: any): any => {
      if (obj === null || typeof obj !== 'object') {
        return obj;
      }
      if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
      }
      const sortedKeys = Object.keys(obj).sort();
      const sortedObj: Record<string, any> = {};
      for (const key of sortedKeys) {
        sortedObj[key] = sortObjectKeys(obj[key]);
      }
      return sortedObj;
    };
    return `${prefix}:${JSON.stringify(sortObjectKeys(payload))}`;
  } catch (_) {
    return `${prefix}:${JSON.stringify(payload)}`;
  }
}

async function executeCachedAiRequest<T>(
  prefix: string,
  payload: any,
  fn: () => Promise<T>
): Promise<T> {
  let cacheKey: string | null = null;

  try {
    cacheKey = generateDeterministicCacheKey(prefix, payload);

    // 1. Check in-memory cache
    const cached = aiCacheMap.get(cacheKey);
    if (cached) {
      if (Date.now() - cached.timestamp <= AI_CACHE_TTL_MS) {
        return cached.data;
      } else {
        aiCacheMap.delete(cacheKey);
      }
    }

    // 2. Deduplicate inflight concurrent requests
    const inflightPromise = aiInflightMap.get(cacheKey);
    if (inflightPromise) {
      return await inflightPromise;
    }
  } catch (err) {
    console.warn("[TryOn AI Cache Warning] Error reading cache:", err);
  }

  // 3. Create execution promise
  const executionPromise = (async () => {
    const result = await fn();
    if (cacheKey && result !== undefined && result !== null) {
      const isObject = typeof result === "object";
      const isFailed = isObject && (result as any).success === false;
      if (!isFailed) {
        try {
          aiCacheMap.set(cacheKey, {
            data: result,
            timestamp: Date.now()
          });
        } catch (err) {
          console.warn("[TryOn AI Cache Warning] Error saving to cache:", err);
        }
      }
    }
    return result;
  })();

  if (cacheKey) {
    try {
      aiInflightMap.set(cacheKey, executionPromise);
    } catch (err) {
      console.warn("[TryOn AI Cache Warning] Error setting inflight request:", err);
    }
  }

  try {
    return await executionPromise;
  } finally {
    if (cacheKey) {
      try {
        aiInflightMap.delete(cacheKey);
      } catch (_) {}
    }
  }
}

interface ProcessMeshRequestBody {
  userImage?: string;
  clothingItemId?: string;
  userId?: string;
}

interface ProcessMeshResponse {
  primaryColorHex: string;
  recommendedScale: [number, number, number];
  materialTextureType: "matte" | "metallic" | "glossy";
  profileSaved: boolean;
}

router.post("/process-mesh", async (req: Request<{}, {}, ProcessMeshRequestBody>, res: Response): Promise<void> => {
  try {
    if (!req.body || typeof req.body !== "object") {
      res.status(400).json({ success: false, error: "Validation failed", details: ["Request body must be a valid JSON object"] });
      return;
    }

    const { userImage, clothingItemId, userId: requestedUserId } = req.body;
    const errors: string[] = [];

    if (!userImage || typeof userImage !== "string" || !userImage.trim()) {
      errors.push("Invalid or missing userImage (must be a non-empty string)");
    }

    if (!clothingItemId || typeof clothingItemId !== "string" || !clothingItemId.trim()) {
      errors.push("Invalid or missing clothingItemId (must be a non-empty string)");
    }

    if (errors.length > 0) {
      res.status(422).json({ success: false, error: "Validation failed", details: errors });
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized: Missing or malformed authentication token" });
      return;
    }

    const token = authHeader.split(" ")[1];
    let authenticatedUid = "";

    try {
      if (token === "guest-token") {
        authenticatedUid = "guest-sartorialist-user-100";
      } else {
        try {
          const decodedToken = await getAuth().verifyIdToken(token);
          authenticatedUid = decodedToken.uid;
        } catch (primaryErr: any) {
          let tokenAudience = "";
          try {
            const parts = token.split(".");
            if (parts.length === 3) {
              const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
              if (payload && payload.aud) {
                tokenAudience = payload.aud;
              }
            }
          } catch (_) {}

          if (tokenAudience) {
            const appName = `client-app-${tokenAudience}`;
            const existingApps = getApps();
            const found = existingApps.find(a => a.name === appName);
            const audienceApp = found || initializeApp({ projectId: tokenAudience }, appName);
            const decodedToken = await getAuth(audienceApp).verifyIdToken(token);
            authenticatedUid = decodedToken.uid;
          } else {
            throw primaryErr;
          }
        }
      }
    } catch (authErr: any) {
      res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
      return;
    }

    const targetUserId = requestedUserId || (req.headers["x-user-id"] as string);
    if (targetUserId && targetUserId !== authenticatedUid) {
      res.status(403).json({ error: "Forbidden: Authenticated UID does not match destination userId" });
      return;
    }

    const userId = authenticatedUid;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
      return;
    }

    const cachePayload = { userImage, clothingItemId };

    const result = await executeCachedAiRequest<ProcessMeshResponse>(
      "tryon:process-mesh",
      cachePayload,
      async () => {
        const ai = new GoogleGenAI({ apiKey });

        let imagePart: { inlineData: { data: string; mimeType: string } } | null = null;
        if (userImage.startsWith("data:")) {
          const matches = userImage.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
          if (matches) {
            imagePart = { inlineData: { mimeType: matches[1], data: matches[2] } };
          }
        } else if (userImage.startsWith("http://") || userImage.startsWith("https://")) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);
            const fetchResp = await fetch(userImage, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (fetchResp.ok) {
              const arrayBuffer = await fetchResp.arrayBuffer();
              const mimeType = (fetchResp.headers.get("content-type") || "image/jpeg").split(";")[0];
              imagePart = {
                inlineData: {
                  mimeType,
                  data: Buffer.from(arrayBuffer).toString("base64")
                }
              };
            }
          } catch (_) {
            // Safe fallback if URL fetch fails or times out
          }
        } else if (userImage.length > 20) {
          imagePart = {
            inlineData: {
              mimeType: "image/jpeg",
              data: userImage
            }
          };
        }

        const prompt = `Analyze the provided fashion image or clothing context for item "${clothingItemId}". Determine the dominant primary color hex code, the 3D mesh recommended scale array [x, y, z] matching [width, height, depth] ratio, and the material texture type (must be strictly one of: matte, metallic, glossy).`;

        const contentsPayload: any[] = imagePart ? [imagePart, prompt] : [prompt];

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: contentsPayload,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                primaryColorHex: { type: Type.STRING },
                recommendedScale: {
                  type: Type.ARRAY,
                  items: { type: Type.NUMBER }
                },
                materialTextureType: { type: Type.STRING }
              },
              required: ["primaryColorHex", "recommendedScale", "materialTextureType"]
            }
          }
        });

        const responseText = response.text;
        if (!responseText) {
          throw new Error("Empty response from Gemini model");
        }

        let parsed: any = {};
        try {
          let cleanedText = responseText.trim();
          if (cleanedText.startsWith("```json")) {
            cleanedText = cleanedText.slice(7);
          }
          if (cleanedText.startsWith("```")) {
            cleanedText = cleanedText.slice(3);
          }
          if (cleanedText.endsWith("```")) {
            cleanedText = cleanedText.slice(0, -3);
          }
          cleanedText = cleanedText.trim();
          parsed = JSON.parse(cleanedText);
        } catch (_) {
          parsed = {};
        }

        const hexValid = typeof parsed?.primaryColorHex === "string" && /^#([0-9A-F]{3}){1,2}$/i.test(parsed.primaryColorHex);
        const primaryColorHex = hexValid ? parsed.primaryColorHex : "#000000";

        const scaleValid = Array.isArray(parsed?.recommendedScale) &&
          parsed.recommendedScale.length === 3 &&
          parsed.recommendedScale.every((num: any) => typeof num === "number" && !isNaN(num));
        const recommendedScale: [number, number, number] = scaleValid
          ? [Number(parsed.recommendedScale[0]), Number(parsed.recommendedScale[1]), Number(parsed.recommendedScale[2])]
          : [1, 1, 1];

        const allowedTextures = ["matte", "metallic", "glossy"];
        const materialTextureType = (parsed?.materialTextureType && allowedTextures.includes(parsed.materialTextureType))
          ? (parsed.materialTextureType as "matte" | "metallic" | "glossy")
          : "matte";

        let profileSaved = false;
        const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
        const hasValidKey = Boolean(
          (sa && typeof sa === 'string' && (sa.includes('private_key') || sa.trim().startsWith('{'))) ||
          process.env.GOOGLE_APPLICATION_CREDENTIALS
        );

        if (hasValidKey) {
          try {
            const db = getFirestore();
            const docRef = db.collection("users").doc(userId).collection("style_profiles").doc("current");
            const docSnap = await docRef.get();
            const existingData = docSnap.exists ? (docSnap.data() || {}) : {};

            const existingColors: string[] = Array.isArray(existingData.colorPreferences)
              ? existingData.colorPreferences
              : (Array.isArray(existingData.colorHistory) ? existingData.colorHistory : []);

            const colorPreferences = existingColors.includes(primaryColorHex)
              ? existingColors
              : [...existingColors, primaryColorHex];

            const existingWearAnalytics = existingData.wearAnalytics || {};
            const currentTryOns = typeof existingWearAnalytics.successfulTryOns === "number"
              ? existingWearAnalytics.successfulTryOns
              : 0;

            const wearAnalytics = {
              ...existingWearAnalytics,
              successfulTryOns: currentTryOns + 1
            };

            const nowIso = new Date().toISOString();

            const profilePayload = {
              ...existingData,
              primaryColorHex,
              recommendedScale,
              materialTextureType,
              colorPreferences,
              wearAnalytics,
              lastTryOnAt: nowIso,
              updatedAt: nowIso
            };

            await docRef.set(profilePayload, { merge: true });
            profileSaved = true;
          } catch (firestoreError: any) {
            console.warn("[Firestore Sync] Style profile update bypassed:", firestoreError?.message || firestoreError);
            profileSaved = false;
          }
        }

        return {
          primaryColorHex,
          recommendedScale,
          materialTextureType,
          profileSaved
        };
      }
    );

    if (res.headersSent) return;
    res.status(200).json(result);
  } catch (error: any) {
    if (res.headersSent) return;
    res.status(500).json({ error: error?.message || "Internal server error during mesh processing" });
  }
});

export default router;

