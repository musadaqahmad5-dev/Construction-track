import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

export async function analyzeSiteImage(imageDataBase64: string) {
  try {
    const prompt = "Analyze this construction site photo. Provide a technical summary of the progress, identify key milestones visible, and guess the current project status (Planning, In Progress, or Near Completion). Format as a concise JSON-like summary.";
    
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
    return "Unable to process site vision at this moment.";
  }
}

export async function generateProjectStrategy(title: string, category: string, description: string) {
  try {
    const prompt = `You are a Technical Construction Advisor. Create a tactical strategy for a project titled "${title}" in the category "${category}". 
    Description: "${description}".
    
    Provide:
    1. TACTICAL HUNT LIST: 3-5 critical items to watch or "hunt" for during this phase.
    2. MOVEMENT TECH: Suggest one innovative technology or technique to accelerate this specific project.
    3. RISK SCAN: One major technical risk to mitigate.
    
    Format with bold headers and concise bullet points.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: { maxOutputTokens: 4096 },
      contents: { parts: [{ text: prompt }] }
    });

    return response.text || "Strategy generation offline.";
  } catch (error) {
    console.error("Strategy generation failed:", error);
    return "Failed to initialize tactical advisor.";
  }
}
