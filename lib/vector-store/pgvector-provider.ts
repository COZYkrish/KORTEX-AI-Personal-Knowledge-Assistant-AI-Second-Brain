import { db } from "@/lib/db/client";
import type { VectorStore, VectorSearchResult } from "./types";

// Matches text-embedding-004 from Gemini (free tier)
const EMBEDDING_DIMENSIONS = 768;

export class PgVectorProvider implements VectorStore {
  async upsert(params: {
    id: string;
    embedding: number[];
    documentId: string;
    workspaceId: string;
    content: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const embeddingStr = `[${params.embedding.join(",")}]`;

    await db.$executeRaw`
      UPDATE document_chunks
      SET embedding = ${embeddingStr}::vector
      WHERE id = ${params.id}
    `;
  }

  async search(params: {
    embedding: number[];
    workspaceId: string;
    topK?: number;
    threshold?: number;
  }): Promise<VectorSearchResult[]> {
    const topK = params.topK ?? 8;
    const threshold = params.threshold ?? 0.5;
    const embeddingStr = `[${params.embedding.join(",")}]`;

    const results = await db.$queryRaw<
      Array<{
        id: string;
        documentId: string;
        content: string;
        score: number;
        metadata: Record<string, unknown>;
      }>
    >`
      SELECT
        dc.id,
        dc."documentId",
        dc.content,
        dc.metadata,
        1 - (dc.embedding <=> ${embeddingStr}::vector) AS score
      FROM document_chunks dc
      JOIN documents d ON d.id = dc."documentId"
      WHERE d."workspaceId" = ${params.workspaceId}
        AND dc.embedding IS NOT NULL
        AND 1 - (dc.embedding <=> ${embeddingStr}::vector) > ${threshold}
      ORDER BY dc.embedding <=> ${embeddingStr}::vector
      LIMIT ${topK}
    `;

    return results.map((r: any) => ({
      id: r.id,
      documentId: r.documentId,
      content: r.content,
      score: Number(r.score),
      metadata: r.metadata ?? {},
    }));
  }

  async delete(chunkId: string): Promise<void> {
    await db.documentChunk.delete({ where: { id: chunkId } });
  }

  async deleteByDocument(documentId: string): Promise<void> {
    await db.documentChunk.deleteMany({ where: { documentId } });
  }
}

// Default export is the PgVector provider
export const vectorStore: VectorStore = new PgVectorProvider();
