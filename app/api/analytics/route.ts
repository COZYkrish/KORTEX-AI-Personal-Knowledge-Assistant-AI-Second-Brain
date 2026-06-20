import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/db/session";
import { db } from "@/lib/db/client";
import { getWorkspaceStats } from "@/lib/events";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get actual database counts for precision
    const [
      documentsCount,
      chatsCount,
      flashcardsCount,
      quizzesCount,
      conceptsCount,
    ] = await Promise.all([
      db.document.count({ where: { workspaceId: session.workspace.id } }),
      db.chat.count({ where: { workspaceId: session.workspace.id } }),
      db.flashcard.count({ where: { workspaceId: session.workspace.id } }),
      db.quiz.count({ where: { workspaceId: session.workspace.id } }),
      db.concept.count({ where: { workspaceId: session.workspace.id } }),
    ]);

    // Get event-sourced metrics (e.g. daily activity, delta searches)
    const eventStats = await getWorkspaceStats(session.workspace.id, 7);

    return NextResponse.json({
      counts: {
        documents: documentsCount,
        chats: chatsCount,
        flashcards: flashcardsCount,
        quizzes: quizzesCount,
        concepts: conceptsCount,
      },
      activity: eventStats.dailyActivity,
    });
  } catch (err) {
    console.error("[AnalyticsAPI GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
