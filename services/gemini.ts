
import { GoogleGenAI, Type } from "@google/genai";
import { UserChoice, FeedbackData, AIAnalysisReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateJourneyAnalysis(
  username: string,
  choices: UserChoice[],
  feedback: FeedbackData
): Promise<AIAnalysisReport> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the interactive narrative journey of user "${username}".
    Journey details:
    ${choices.map((c, i) => `Step ${i + 1}: Chose "${c.choiceText}" (Path: ${c.path})`).join('\n')}
    
    User feedback:
    Agency Score: ${feedback.agency}/5
    Emotion Score: ${feedback.emotion}/5
    Comments: "${feedback.comment}"

    Please provide a psychological and poetic analysis of their choices.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING, description: "A poetic overview of the journey." },
          persona: {
            type: Type.OBJECT,
            properties: {
              tag: { type: Type.STRING, description: "A 4-word tag for the user." },
              description: { type: Type.STRING, description: "Detailed personality analysis based on choices." },
              matchRate: { type: Type.NUMBER, description: "Percentage match (0-100)." }
            },
            required: ["tag", "description", "matchRate"]
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 book/movie recommendations based on their path."
          },
          message: { type: Type.STRING, description: "A personalized inspirational message." }
        },
        required: ["overview", "persona", "recommendations", "message"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
