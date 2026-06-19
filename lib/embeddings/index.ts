// ============================================================
// Embeddings — lib/embeddings/index.ts
//
// Active provider: Gemini text-embedding-004 (free, 768-dim)
// To swap providers, change only the import below.
// ============================================================

export { GeminiEmbeddingProvider, geminiEmbeddingProvider } from "./gemini-embeddings";
export type { EmbeddingProvider } from "./types";

// Default provider singleton
import { geminiEmbeddingProvider } from "./gemini-embeddings";
export const embeddingProvider = geminiEmbeddingProvider;

// Backward compat alias for any legacy code
export const embeddingsService = geminiEmbeddingProvider;
