// ============================================================
// Gemini Embedding Provider — lib/embeddings/gemini-embeddings.ts
//
// Uses Google's text-embedding-004 model via the Gemini API.
// ✅ 100% Free (Gemini free tier)
// ✅ No extra packages — uses @google/generative-ai already installed
// ✅ No API key beyond GEMINI_API_KEY
// Output dimensions: 768
// ============================================================

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { EmbeddingProvider } from "./types";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required for embeddings");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// gemini-embedding-001 is the active, stable embedding model
const EMBEDDING_MODEL = "gemini-embedding-001";

export class GeminiEmbeddingProvider implements EmbeddingProvider {
  readonly dimensions = 768;

  async embed(text: string): Promise<number[]> {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const result = await model.embedContent({
      content: { role: "user", parts: [{ text: text.slice(0, 2048) }] },
      outputDimensionality: 768,
    } as any);
    return result.embedding.values;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const results: number[][] = [];

    // Process in batches of 20 to be respectful of rate limits
    const BATCH_SIZE = 20;
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);

      // Gemini doesn't have a native batch embed endpoint — run concurrently
      const embeddings = await Promise.all(
        batch.map(async (text) => {
          const result = await model.embedContent({
            content: { role: "user", parts: [{ text: text.slice(0, 2048) }] },
            outputDimensionality: 768,
          } as any);
          return result.embedding.values;
        })
      );

      results.push(...embeddings);

      // Brief pause between batches to avoid rate limiting
      if (i + BATCH_SIZE < texts.length) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    return results;
  }
}

// Singleton instance
export const geminiEmbeddingProvider = new GeminiEmbeddingProvider();
