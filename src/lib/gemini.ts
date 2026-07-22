import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

export async function analyzeFashionImage(imageDataBase64: string) {
  try {
    const prompt = "Analyze this fashion outfit or garment photo. Provide a high-fidelity summary of the clothing items, identify the fabric textures and color palette, and classify the style vibe (e.g., Cyberpunk Streetwear, Eco-Thrift, Corporate Layering, Heritage Tailored). Format as a concise JSON-like summary.";
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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
    const prompt = `You are a Professional Fashion Director and Style Consultant. Create a tactical aesthetic strategy for a wardrobe set titled "${styleIdentity}" in the category "${category}". 
    Description: "${description}".
    
    Provide:
    1. AESTHETIC HUNT LIST: 3-5 critical styling guidelines, fabrics, or accessories to curate for this collection.
    2. COMBINATORIAL TECH: Suggest one innovative layering technique or silhouette proportion to accelerate the wear coherence of this outfit.
    3. DESIGN RISK: One potential styling mismatch or durability issue to mitigate.
    
    Format with bold headers and concise bullet points.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      config: { maxOutputTokens: 4096 },
      contents: { parts: [{ text: prompt }] }
    });

    return response.text || "Styling strategy generation offline.";
  } catch (error) {
    console.error("Strategy generation failed:", error);
    return "Failed to initialize tactical styling advisor.";
  }
}

