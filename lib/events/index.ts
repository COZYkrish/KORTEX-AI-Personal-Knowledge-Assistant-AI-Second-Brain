import { db } from "@/lib/db/client";
import type { EventType } from "@prisma/client";

export async function trackEvent(params: {
  workspaceId: string;
  userId: string;
  type: EventType;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await db.event.create({
      data: {
        workspaceId: params.workspaceId,
        userId: params.userId,
        type: params.type,
        metadata: (params.metadata ?? {}) as Record<string, never>,
      },
    });
  } catch {
    // Event tracking must never crash the main flow
    console.error("[EventService] Failed to track event:", params.type);
  }
}

export async function getWorkspaceStats(
  workspaceId: string,
  days = 30
): Promise<{
  documentsUploaded: number;
  chatMessages: number;
  flashcardsGenerated: number;
  quizzesCompleted: number;
  searchesExecuted: number;
  dailyActivity: Array<{ date: string; count: number }>;
}> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const events = await db.event.groupBy({
    by: ["type"],
    where: { workspaceId, createdAt: { gte: since } },
    _count: { id: true },
  });

  const getCount = (type: EventType) =>
    events.find((e: any) => e.type === type)?._count.id ?? 0;

  const dailyRaw = await db.$queryRaw<Array<{ date: string; count: bigint }>>`
    SELECT
      DATE("createdAt")::text AS date,
      COUNT(*) AS count
    FROM events
    WHERE "workspaceId" = ${workspaceId}
      AND "createdAt" >= ${since}
    GROUP BY DATE("createdAt")
    ORDER BY DATE("createdAt")
  `;

  return {
    documentsUploaded: getCount("DOCUMENT_UPLOADED"),
    chatMessages: getCount("CHAT_MESSAGE_SENT"),
    flashcardsGenerated: getCount("FLASHCARD_GENERATED"),
    quizzesCompleted: getCount("QUIZ_COMPLETED"),
    searchesExecuted: getCount("SEARCH_EXECUTED"),
    dailyActivity: dailyRaw.map((r: any) => ({
      date: r.date,
      count: Number(r.count),
    })),
  };
}
