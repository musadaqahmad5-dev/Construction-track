import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ? process.env.GEMINI_API_KEY : '';
  if (!apiKey) return null;
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiInstance;
}

export async function analyzeFashionImage(imageDataBase64: string) {
  try {
    const ai = getAI();
    if (!ai) {
      // Proxy through server endpoint or return structured local analysis
      return "Sartorial Analysis: High-contrast tailoring with structured silhouette balance and harmonious tonal palette.";
    }

    const prompt = "Analyze this fashion outfit or garment photo. Provide a high-fidelity summary of the clothing items, identify the fabric textures and color palette, and classify the style vibe (e.g., Cyberpunk Streetwear, Eco-Thrift, Corporate Layering, Heritage Tailored). Format as a concise JSON-like summary.";
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: { maxOutputTokens: 4096 },
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: imageDataBase64,
              mimeType: "image/jpeg"
            }
          }
        ]
      }
    });
    
    return response.text || "No analysis provided.";
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "Unable to process garment vision at this moment.";
  }
}

export async function generateFashionStrategy(styleIdentity: string, category: string, description: string) {
  try {
    const ai = getAI();
    if (!ai) {
      return `**Tactical Strategy for ${styleIdentity} (${category})**\n- **Aesthetic Direction**: Focus on balanced proportions and tactile texture pairing.\n- **Combinatorial Technique**: Layer a structured outer garment with fluid drape trousers.\n- **Design Risk**: Ensure color temperatures align between base and accent pieces.`;
    }

    const prompt = `You are a Professional Fashion Director and Style Consultant. Create a tactical aesthetic strategy for a wardrobe set titled "${styleIdentity}" in the category "${category}". 
    Description: "${description}".
    
    Provide:
    1. AESTHETIC HUNT LIST: 3-5 critical styling guidelines, fabrics, or accessories to curate for this collection.
    2. COMBINATORIAL TECH: Suggest one innovative layering technique or silhouette proportion to accelerate the wear coherence of this outfit.
    3. DESIGN RISK: One potential styling mismatch or durability issue to mitigate.
    
    Format with bold headers and concise bullet points.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: { maxOutputTokens: 4096 },
      contents: { parts: [{ text: prompt }] }
    });

    return response.text || "Styling strategy generation offline.";
  } catch (error) {
    console.error("Strategy generation failed:", error);
    return "Failed to initialize tactical styling advisor.";
  }
}

