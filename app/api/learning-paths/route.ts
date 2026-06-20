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

    const paths = await db.learningPath.findMany({
      where: { workspaceId: session.workspace.id },
      include: {
        nodes: { orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(paths);
  } catch (err) {
    console.error("[LearningPaths GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { topic } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Get summaries of documents to pass context to study agent
    const docs = await db.document.findMany({
      where: { workspaceId: session.workspace.id, status: "READY" },
      include: { versions: { take: 1, orderBy: { versionNumber: "desc" } } },
    });

    const docSummaries = docs.map((d) => {
      const textSample = d.versions[0]?.extractedText.slice(0, 600) || "";
      return `Document Title: ${d.title}\nExcerpt/Summary: ${d.summary || textSample}`;
    });

    if (docSummaries.length === 0) {
      return NextResponse.json(
        { error: "Please upload at least one document first to build learning paths!" },
        { status: 400 }
      );
    }

    // Generate learning path using StudyAgent
    const generated = await agents.study.generateLearningPath(topic, docSummaries);

    // Save learning path and nodes in database
    const path = await db.learningPath.create({
      data: {
        workspaceId: session.workspace.id,
        topic: generated.title || topic,
        description: generated.description || "AI-generated curriculum",
        masteryScore: 0.0,
        nodes: {
          create: generated.nodes.map((n) => ({
            title: n.title,
            description: n.description,
            status: n.order === 1 ? "IN_PROGRESS" : "PENDING", // Start the first node
            order: n.order,
            resources: docs.map((d) => d.title), // Link upload files
          })),
        },
      },
      include: {
        nodes: { orderBy: { order: "asc" } },
      },
    });

    // Track analytics event
    await trackEvent({
      workspaceId: session.workspace.id,
      userId: session.user.id,
      type: "LEARNING_PATH_CREATED",
      metadata: { topic: path.topic, nodeId: path.id },
    });

    return NextResponse.json(path, { status: 201 });
  } catch (err) {
    console.error("[LearningPaths POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
