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

    const { id } = await context.params;
    const body = await req.json();
    const { difficulty } = body; // EASY | MEDIUM | HARD

    if (!difficulty || !["EASY", "MEDIUM", "HARD"].includes(difficulty)) {
      return NextResponse.json({ error: "Valid difficulty is required" }, { status: 400 });
    }

    const card = await db.flashcard.findUnique({
      where: { id, workspaceId: session.workspace.id },
    });

    if (!card) {
      return NextResponse.json({ error: "Flashcard not found" }, { status: 404 });
    }

    // SM-2 Spaced Repetition Algorithm
    // Map rating to SM-2 response score q (0-5)
    // EASY -> 5 (perfect recall)
    // MEDIUM -> 3 (correct but with hesitation)
    // HARD -> 1 (incorrect response)
    let q = 3;
    if (difficulty === "EASY") q = 5;
    if (difficulty === "HARD") q = 1;

    let repetitions = card.repetitions;
    let easeFactor = card.easeFactor;
    let interval = card.interval;

    if (q >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions++;
    } else {
      repetitions = 0;
      interval = 1;
    }

    // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + interval);

    // Compute simple mastery score based on repetitions
    const masteryScore = Math.min(1.0, repetitions / 6);

    const updatedCard = await db.flashcard.update({
      where: { id },
      data: {
        difficulty,
        repetitions,
        easeFactor,
        interval,
        nextReviewAt,
        masteryScore,
      },
    });

    // Track review event
    await trackEvent({
      workspaceId: session.workspace.id,
      userId: session.user.id,
      type: "FLASHCARD_REVIEWED",
      metadata: { flashcardId: card.id, difficulty, repetitions },
    });

    return NextResponse.json(updatedCard);
  } catch (err) {
    console.error("[FlashcardReview POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
