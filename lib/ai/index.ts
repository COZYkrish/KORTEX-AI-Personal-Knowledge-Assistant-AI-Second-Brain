// ============================================================
// AI Provider — lib/ai/index.ts
// Re-exports the active AI provider.
// To swap providers in the future, change only this file.
// ============================================================

export { GeminiProvider, geminiService } from "./gemini";
export type { AIProvider, AIMessage } from "./types";

// Default provider singleton for use across the application
import { geminiService } from "./gemini";
export const aiProvider = geminiService;
