import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/db/session";
import { db } from "@/lib/db/client";
import { trackEvent } from "@/lib/events";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: quizId } = await context.params;
    const body = await req.json();
    const { score, timeTaken, answers } = body;

    if (score === undefined || timeTaken === undefined || !answers) {
      return NextResponse.json({ error: "score, timeTaken, and answers are required" }, { status: 400 });
    }

    // Save result
    const result = await db.quizResult.create({
      data: {
        quizId,
        userId: session.user.id,
        score: Number(score),
        timeTaken: Number(timeTaken),
        answers: answers,
      },
    });

    // Track analytics event
    await trackEvent({
      workspaceId: session.workspace.id,
      userId: session.user.id,
      type: "QUIZ_COMPLETED",
      metadata: { quizId, score: Number(score) },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("[QuizResults POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
