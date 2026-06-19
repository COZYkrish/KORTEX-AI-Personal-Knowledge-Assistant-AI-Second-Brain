import { Queue, Worker, type Job } from "bullmq";
import IORedis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL environment variable is required");
}

export const redisConnection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Queue names
export const QUEUE_NAMES = {
  DOCUMENT_INGESTION: "document-ingestion",
  GRAPH_EXTRACTION: "graph-extraction",
  DAILY_DIGEST: "daily-digest",
} as const;

// Document ingestion queue
export const documentIngestionQueue = new Queue(
  QUEUE_NAMES.DOCUMENT_INGESTION,
  {
    connection: redisConnection as any,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: 100,
      removeOnFail: 50,
    },
  }
);

// Graph extraction queue
export const graphExtractionQueue = new Queue(QUEUE_NAMES.GRAPH_EXTRACTION, {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: 50,
  },
});

// Daily digest queue (scheduled)
export const dailyDigestQueue = new Queue(QUEUE_NAMES.DAILY_DIGEST, {
  connection: redisConnection as any,
});

// -------------------------------------------------------
// Job Payloads
// -------------------------------------------------------
export interface DocumentIngestionPayload {
  documentId: string;
  workspaceId: string;
  fileUrl: string;
  mimeType: string;
}

export interface GraphExtractionPayload {
  documentId: string;
  workspaceId: string;
  extractedText: string;
}

export interface DailyDigestPayload {
  workspaceId: string;
}

// -------------------------------------------------------
// Queue Publisher Functions
// -------------------------------------------------------
export async function enqueueDocumentIngestion(
  payload: DocumentIngestionPayload
): Promise<void> {
  await documentIngestionQueue.add("process-document", payload, {
    jobId: `doc-${payload.documentId}`,
  });
}

export async function enqueueGraphExtraction(
  payload: GraphExtractionPayload
): Promise<void> {
  await graphExtractionQueue.add("extract-graph", payload, {
    jobId: `graph-${payload.documentId}`,
    delay: 2000, // Wait for embedding to complete first
  });
}

export async function scheduleDailyDigests(): Promise<void> {
  // Run every night at 11 PM
  await dailyDigestQueue.add("generate-digest", {}, {
    repeat: { pattern: "0 23 * * *" },
    jobId: "nightly-digest",
  });
}
