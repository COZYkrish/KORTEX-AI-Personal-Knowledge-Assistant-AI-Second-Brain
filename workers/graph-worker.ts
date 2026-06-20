import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { Worker } from "bullmq";
import { redisConnection, QUEUE_NAMES } from "@/lib/queue";
import { db } from "@/lib/db/client";
import { agents } from "@/lib/agents";
import type { GraphExtractionPayload } from "@/lib/queue";

const graphWorker = new Worker<GraphExtractionPayload>(
  QUEUE_NAMES.GRAPH_EXTRACTION,
  async (job) => {
    const { documentId, workspaceId, extractedText } = job.data;
    console.log(`[GraphWorker] Extracting graph for document: ${documentId}`);

    const { concepts, relationships } =
      await agents.graph.extractGraph(extractedText);

    // Upsert concepts
    const conceptMap = new Map<string, string>(); // name -> id

    for (const concept of concepts) {
      try {
        const existing = await db.concept.findUnique({
          where: { workspaceId_name: { workspaceId, name: concept.name } },
        });

        if (existing) {
          conceptMap.set(concept.name, existing.id);
        } else {
          const created = await db.concept.create({
            data: {
              workspaceId,
              documentId,
              name: concept.name,
              description: concept.description,
              type: concept.type,
            },
          });
          conceptMap.set(concept.name, created.id);
        }
      } catch {
        console.warn(`[GraphWorker] Skipping concept: ${concept.name}`);
      }
    }

    // Create relationships
    for (const rel of relationships) {
      const sourceId = conceptMap.get(rel.source);
      const targetId = conceptMap.get(rel.target);

      if (!sourceId || !targetId) continue;

      try {
        await db.relationship.upsert({
          where: {
            sourceConceptId_targetConceptId_type: {
              sourceConceptId: sourceId,
              targetConceptId: targetId,
              type: rel.type,
            },
          },
          update: { label: rel.label },
          create: {
            sourceConceptId: sourceId,
            targetConceptId: targetId,
            type: rel.type,
            label: rel.label,
          },
        });
      } catch {
        console.warn(`[GraphWorker] Skipping relationship: ${rel.source} -> ${rel.target}`);
      }
    }

    // Mark document as READY
    await db.document.update({
      where: { id: documentId },
      data: { status: "READY" },
    });

    console.log(
      `[GraphWorker] Extracted ${concepts.length} concepts and ${relationships.length} relationships`
    );
  },
  {
    connection: redisConnection as any,
    concurrency: 2,
  }
);

graphWorker.on("completed", (job) => {
  console.log(`[GraphWorker] Completed: ${job.id}`);
});

graphWorker.on("failed", async (job, err) => {
  console.error(`[GraphWorker] Failed: ${job?.id}`, err);
  // Don't block document access if graph fails — just mark READY anyway
  if (job?.data.documentId) {
    await db.document
      .update({
        where: { id: job.data.documentId },
        data: { status: "READY" },
      })
      .catch(() => {});
  }
});

console.log("[GraphWorker] Started and listening for jobs...");
