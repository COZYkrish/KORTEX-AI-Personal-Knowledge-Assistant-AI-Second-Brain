import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/db/session";
import { db } from "@/lib/db/client";
import { agents } from "@/lib/agents";
import { hybridSearch } from "@/lib/rag/pipeline";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quizzes = await db.quiz.findMany({
      where: { workspaceId: session.workspace.id },
      include: {
        questions: { orderBy: { order: "asc" } },
        results: { where: { userId: session.user.id } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(quizzes);
  } catch (err) {
    console.error("[QuizzesAPI GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { topic } = body;

    let content = "";
    let sourceTitle = "";

    if (topic) {
      // Find matching document using hybrid search
      const searchResults = await hybridSearch(topic, session.workspace.id, 1);
      if (searchResults.length > 0) {
        const doc = await db.document.findUnique({
          where: { id: searchResults[0].documentId },
          include: { versions: { take: 1, orderBy: { versionNumber: "desc" } } },
        });
        if (doc?.versions[0]?.extractedText) {
          content = doc.versions[0].extractedText;
          sourceTitle = doc.title;
        }
      }
    }

    // Fallback to any ready document if no topic match or no topic provided
    if (!content) {
      const doc = await db.document.findFirst({
        where: { workspaceId: session.workspace.id, status: "READY" },
        include: { versions: { take: 1, orderBy: { versionNumber: "desc" } } },
      });
      if (doc?.versions[0]?.extractedText) {
        content = doc.versions[0].extractedText;
        sourceTitle = doc.title;
      }
    }

    if (!content) {
      return NextResponse.json(
        { error: "No documents ready in workspace. Please upload a PDF/DOCX/TXT first!" },
        { status: 400 }
      );
    }

    // Generate questions using the QuizAgent
    const generated = await agents.quiz.generateQuiz(content, {
      questionCount: 4,
      types: ["MCQ", "TRUE_FALSE"],
    });

    // Save quiz in database
    const quiz = await db.quiz.create({
      data: {
        workspaceId: session.workspace.id,
        title: generated.title || `${sourceTitle} Quiz`,
        questions: {
          create: generated.questions.map((q) => ({
            type: q.type as any,
            content: q.content,
            options: q.options || [],
            correctAnswer: String(q.correctAnswer),
            explanation: q.explanation,
            order: q.order,
          })),
        },
      },
      include: {
        questions: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (err) {
    console.error("[QuizzesAPI POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
