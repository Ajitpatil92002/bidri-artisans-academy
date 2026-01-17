
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getArtCritique = async (lessonTitle: string, userQuery: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As an expert Bidri art historian and master craftsman, answer this student query about ${lessonTitle}: ${userQuery}. Provide historical context and technical advice.`,
    config: {
      temperature: 0.7,
      maxOutputTokens: 500,
    }
  });
  return response.text;
};

export const generateQuiz = async (lessonTitle: string, content: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a 3-question multiple choice quiz about ${lessonTitle} based on this content: ${content}. Return only valid JSON.`,
    config: {
      responseMimeType: "application/json",
    }
  });
  return response.text;
};
