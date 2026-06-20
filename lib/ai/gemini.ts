// ============================================================
// Gemini 2.5 Flash Provider — lib/ai/gemini.ts
// Implements the AIProvider interface using Google Generative AI.
// ============================================================

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import type { AIProvider, AIMessage } from "./types";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export class GeminiProvider implements AIProvider {
  private model: GenerativeModel;
  private fastModel: GenerativeModel;

  constructor() {
    // Primary model — higher creativity for chat & generation
    this.model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 8192,
      },
    });

    // Fast model — low temperature for structured JSON output
    this.fastModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.3,
        topP: 0.9,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });
  }

  async generate(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  async generateJSON<T>(prompt: string): Promise<T> {
    const result = await this.fastModel.generateContent(prompt);
    const text = result.response.text().trim();
    // Strip any accidental markdown code fences
    const cleaned = text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "");
    return JSON.parse(cleaned) as T;
  }

  async *generateStream(
    messages: AIMessage[],
    systemPrompt: string
  ): AsyncGenerator<string> {
    const chat = this.model.startChat({
      history: messages.slice(0, -1),
      systemInstruction: systemPrompt,
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessageStream(lastMessage.parts[0].text);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  }
}

// Singleton — shared across the application
export const geminiService = new GeminiProvider();
