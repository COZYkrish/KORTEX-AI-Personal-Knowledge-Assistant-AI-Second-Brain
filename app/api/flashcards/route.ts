import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/db/session";
import { db } from "@/lib/db/client";
import { agents } from "@/lib/agents";
import { trackEvent } from "@/lib/events";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const flashcards = await db.flashcard.findMany({
      where: { workspaceId: session.workspace.id },
      include: { concept: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(flashcards);
  } catch (err) {
    console.error("[FlashcardsAPI GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find ready document
    const doc = await db.document.findFirst({
      where: { workspaceId: session.workspace.id, status: "READY" },
      include: { versions: { take: 1, orderBy: { versionNumber: "desc" } } },
    });

    if (!doc) {
      return NextResponse.json(
        { error: "No documents ready in workspace. Please upload a PDF/DOCX/TXT first!" },
        { status: 400 }
      );
    }

    const content = doc.versions[0]?.extractedText || "";
    if (!content) {
      return NextResponse.json({ error: "Document text is empty." }, { status: 400 });
    }

    // Generate flashcards from content
    const prompt = `Generate a set of 5-8 spaced-repetition flashcards based on this content:
${content.slice(0, 6000)}

Return JSON with format:
{
  "flashcards": [
    { "front": "question", "back": "answer", "concept": "key concept name" }
  ]
}`;

    const generated = await agents.study.generateJSON<{
      flashcards: Array<{ front: string; back: string; concept: string }>;
    }>(prompt);

    if (!generated.flashcards?.length) {
      return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
    }

    // Create cards in DB
    const cards = await Promise.all(
      generated.flashcards.map(async (card) => {
        // Find or create concept if it matches name
        let conceptId = null;
        if (card.concept) {
          const concept = await db.concept.findUnique({
            where: { workspaceId_name: { workspaceId: session.workspace.id, name: card.concept } },
          });
          if (concept) {
            conceptId = concept.id;
          }
        }

        return db.flashcard.create({
          data: {
            workspaceId: session.workspace.id,
            conceptId,
            front: card.front,
            back: card.back,
            difficulty: "MEDIUM",
            easeFactor: 2.5,
            interval: 1,
            repetitions: 0,
            masteryScore: 0.0,
          },
        });
      })
    );

    // Track event
    await trackEvent({
      workspaceId: session.workspace.id,
      userId: session.user.id,
      type: "FLASHCARD_GENERATED",
      metadata: { count: cards.length },
    });

    return NextResponse.json(cards, { status: 201 });
  } catch (err) {
    console.error("[FlashcardsAPI POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
