import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GenerateContentResult } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function callGemini(prompt: string, systemPrompt = ""): Promise<GenerateContentResult> {
  const fullPrompt = `${systemPrompt}\n\n${prompt}`;

  const result = await model.generateContent(fullPrompt);
  return result;
}
