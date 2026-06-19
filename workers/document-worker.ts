import { Worker } from "bullmq";
import { redisConnection, QUEUE_NAMES } from "@/lib/queue";
import { db } from "@/lib/db/client";
import { embeddingProvider } from "@/lib/embeddings";
import { vectorStore } from "@/lib/vector-store/pgvector-provider";
import { enqueueGraphExtraction } from "@/lib/queue";
import { chunkText } from "@/lib/rag/pipeline";
import type { DocumentIngestionPayload } from "@/lib/queue";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
import * as mammoth from "mammoth";

async function extractText(fileUrl: string, mimeType: string): Promise<string> {
  const response = await fetch(fileUrl);
  const buffer = Buffer.from(await response.arrayBuffer());

  if (mimeType === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (mimeType === "text/plain") {
    return buffer.toString("utf-8");
  }

  throw new Error(`Unsupported MIME type: ${mimeType}`);
}

const documentWorker = new Worker<DocumentIngestionPayload>(
  QUEUE_NAMES.DOCUMENT_INGESTION,
  async (job) => {
    const { documentId, workspaceId, fileUrl, mimeType } = job.data;

    console.log(`[DocumentWorker] Processing document: ${documentId}`);

    // Step 1: Update status to EXTRACTING
    await db.document.update({
      where: { id: documentId },
      data: { status: "EXTRACTING" },
    });

    // Step 2: Extract text
    await job.updateProgress(10);
    let extractedText: string;
    try {
      extractedText = await extractText(fileUrl, mimeType);
    } catch (err) {
      await db.document.update({
        where: { id: documentId },
        data: {
          status: "ERROR",
          errorMessage: `Text extraction failed: ${(err as Error).message}`,
        },
      });
      throw err;
    }

    // Step 3: Store as DocumentVersion
    await db.documentVersion.create({
      data: {
        documentId,
        versionNumber: 1,
        extractedText,
        changeNote: "Initial extraction",
      },
    });

    // Step 4: Chunk text
    await job.updateProgress(30);
    await db.document.update({
      where: { id: documentId },
      data: { status: "EMBEDDING" },
    });

    const chunks = chunkText(extractedText);
    console.log(`[DocumentWorker] Created ${chunks.length} chunks`);

    // Step 5: Store chunks + generate embeddings
    const BATCH_SIZE = 10;
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);

      // Create chunks in DB first
      const createdChunks = await Promise.all(
        batch.map((content: string, batchIdx: number) =>
          db.documentChunk.create({
            data: {
              documentId,
              content,
              chunkIndex: i + batchIdx,
            },
          })
        )
      );

      // Generate embeddings using local BGE model (free, no API key)
      const embeddings = await embeddingProvider.embedBatch(batch);

      // Store embeddings in PgVector
      await Promise.all(
        createdChunks.map((chunk: any, idx: number) =>
          vectorStore.upsert({
            id: chunk.id,
            embedding: embeddings[idx],
            documentId,
            workspaceId,
            content: batch[idx],
          })
        )
      );

      const progress = 30 + Math.floor((i / chunks.length) * 50);
      await job.updateProgress(progress);
    }

    // Step 6: Mark as ready & trigger graph extraction
    await db.document.update({
      where: { id: documentId },
      data: { status: "GRAPHING" },
    });

    await enqueueGraphExtraction({
      documentId,
      workspaceId,
      extractedText: extractedText.slice(0, 15000), // First 15K chars for graph
    });

    console.log(`[DocumentWorker] Document ${documentId} embedded successfully`);
  },
  {
    connection: redisConnection as any,
    concurrency: 3,
  }
);

documentWorker.on("completed", async (job) => {
  console.log(`[DocumentWorker] Job completed: ${job.id}`);
});

documentWorker.on("failed", async (job, err) => {
  console.error(`[DocumentWorker] Job failed: ${job?.id}`, err);
  if (job?.data.documentId) {
    await db.document.update({
      where: { id: job.data.documentId },
      data: { status: "ERROR", errorMessage: err.message },
    });
  }
});

console.log("[DocumentWorker] Started and listening for jobs...");
