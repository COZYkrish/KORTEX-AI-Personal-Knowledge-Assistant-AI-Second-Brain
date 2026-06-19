// ============================================================
// Embedding Provider Abstraction — lib/embeddings/types.ts
// ============================================================

export interface EmbeddingProvider {
  /**
   * Embed a single piece of text.
   * @returns A numeric vector of length `dimensions`.
   */
  embed(text: string): Promise<number[]>;

  /**
   * Embed multiple texts in an optimised batch.
   * @returns An array of numeric vectors, in the same order as input.
   */
  embedBatch(texts: string[]): Promise<number[][]>;

  /**
   * The dimensionality of vectors this provider outputs.
   * e.g. 384 for bge-small, 1536 for OpenAI text-embedding-3-small
   */
  readonly dimensions: number;
}
