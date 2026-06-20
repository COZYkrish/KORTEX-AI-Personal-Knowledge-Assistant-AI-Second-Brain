import { db } from "@/lib/db/client";
import { embeddingProvider } from "@/lib/embeddings";
import { vectorStore } from "@/lib/vector-store/pgvector-provider";
import { aiProvider } from "@/lib/ai";
import type { VectorSearchResult } from "@/lib/vector-store/types";

export interface HybridSearchResult {
  id: string;
  documentId: string;
  documentTitle: string;
  content: string;
  score: number;
  pageNumber?: number;
  metadata: Record<string, unknown>;
}

export interface Citation {
  index: number;
  documentId: string;
  documentTitle: string;
  pageNumber?: number;
  excerpt: string;
}

// -------------------------------------------------------
// CHUNKING
// -------------------------------------------------------
export function chunkText(
  text: string,
  chunkSize = 800,
  overlap = 150
): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    chunks.push(chunk);
    i += chunkSize - overlap;
  }

  return chunks.filter((c) => c.trim().length > 50);
}

// -------------------------------------------------------
// HYBRID RETRIEVAL — BM25 (FTS) + PgVector
// -------------------------------------------------------
export async function hybridSearch(
  query: string,
  workspaceId: string,
  topK = 8
): Promise<HybridSearchResult[]> {
  const [vectorResults, ftsResults] = await Promise.all([
    // Vector search
    (async (): Promise<VectorSearchResult[]> => {
      const embedding = await embeddingProvider.embed(query);
      return vectorStore.search({ embedding, workspaceId, topK: topK * 2 });
    })(),
    // BM25 / Full-Text Search via Postgres
    db.$queryRaw<
      Array<{
        id: string;
        documentId: string;
        content: string;
        pageNumber: number | null;
        metadata: Record<string, unknown>;
        rank: number;
      }>
    >`
      SELECT
        dc.id,
        dc."documentId",
        dc.content,
        dc."pageNumber",
        dc.metadata,
        ts_rank(to_tsvector('english', dc.content), plainto_tsquery('english', ${query})) AS rank
      FROM document_chunks dc
      JOIN documents d ON d.id = dc."documentId"
      WHERE d."workspaceId" = ${workspaceId}
        AND to_tsvector('english', dc.content) @@ plainto_tsquery('english', ${query})
      ORDER BY rank DESC
      LIMIT ${topK * 2}
    `,
  ]);

  // Reciprocal Rank Fusion (RRF)
  const scoreMap = new Map<string, { score: number; result: HybridSearchResult }>();

  vectorResults.forEach((r: VectorSearchResult, idx: number) => {
    const rrf = 1 / (60 + idx + 1);
    scoreMap.set(r.id, {
      score: rrf,
      result: {
        id: r.id,
        documentId: r.documentId,
        documentTitle: "",
        content: r.content,
        score: rrf,
        metadata: r.metadata,
      },
    });
  });

  ftsResults.forEach((r: any, idx: number) => {
    const rrf = 1 / (60 + idx + 1);
    const existing = scoreMap.get(r.id);
    if (existing) {
      existing.score += rrf;
    } else {
      scoreMap.set(r.id, {
        score: rrf,
        result: {
          id: r.id,
          documentId: r.documentId,
          documentTitle: "",
          content: r.content,
          score: rrf,
          pageNumber: r.pageNumber ?? undefined,
          metadata: r.metadata ?? {},
        },
      });
    }
  });

  // Enrich with document titles
  const uniqueDocIds = [...new Set([...scoreMap.values()].map((v) => v.result.documentId))];
  const docs = await db.document.findMany({
    where: { id: { in: uniqueDocIds } },
    select: { id: true, title: true },
  });
  const docMap = new Map<string, string>(docs.map((d: any) => [d.id, d.title]));

  return [...scoreMap.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((v) => ({
      ...v.result,
      documentTitle: docMap.get(v.result.documentId) ?? "Unknown",
      score: v.score,
    }));
}

// -------------------------------------------------------
// CITATION ENGINE
// -------------------------------------------------------
export function buildCitations(results: HybridSearchResult[]): Citation[] {
  return results.map((r, idx) => ({
    index: idx + 1,
    documentId: r.documentId,
    documentTitle: r.documentTitle,
    pageNumber: r.pageNumber,
    excerpt: r.content.slice(0, 200),
  }));
}

// -------------------------------------------------------
// RAG GENERATION
// -------------------------------------------------------
export async function* ragGenerate(
  query: string,
  workspaceId: string,
  systemPrompt: string,
  previousMessages: Array<{ role: "user" | "model"; content: string }> = []
): AsyncGenerator<{ type: "chunk" | "citations"; value: string | Citation[] }> {
  const results = await hybridSearch(query, workspaceId);
  const citations = buildCitations(results);

  const context = results
    .map(
      (r, i) =>
        `[${i + 1}] (${r.documentTitle}${r.pageNumber ? `, p.${r.pageNumber}` : ""})\n${r.content}`
    )
    .join("\n\n---\n\n");

  const fullSystemPrompt = `${systemPrompt}

## Knowledge Base Context
Use only the information below to answer. Always cite sources using [N] notation.

${context}

## Citation Rules
- Always reference sources with [N] markers inline
- If context doesn't contain the answer, say so honestly
- Never fabricate information`;

  const messages = [
    ...previousMessages.map((m) => ({
      role: m.role as "user" | "model",
      parts: [{ text: m.content }],
    })),
    {
      role: "user" as const,
      parts: [{ text: query }],
    },
  ];

  for await (const chunk of aiProvider.generateStream(messages, fullSystemPrompt)) {
    yield { type: "chunk", value: chunk };
  }

  yield { type: "citations", value: citations };
}
