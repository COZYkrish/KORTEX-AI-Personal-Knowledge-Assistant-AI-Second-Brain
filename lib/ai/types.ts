// ============================================================
// AI Provider Abstraction — types.ts
// ============================================================

export type AIMessage = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

export interface AIProvider {
  /**
   * Generate a single text response given a plain prompt.
   */
  generate(prompt: string): Promise<string>;

  /**
   * Generate a structured JSON response given a prompt.
   * The implementation should handle stripping markdown code fences.
   */
  generateJSON<T>(prompt: string): Promise<T>;

  /**
   * Stream a response token-by-token given a conversation history.
   * @param messages Full conversation history (user + model turns)
   * @param systemPrompt System-level instruction for the model
   */
  generateStream(
    messages: AIMessage[],
    systemPrompt: string
  ): AsyncGenerator<string>;
}
