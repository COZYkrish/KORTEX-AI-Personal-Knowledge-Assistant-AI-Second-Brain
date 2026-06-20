import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/db/session";
import { ragGenerate } from "@/lib/rag/pipeline";
import { agents } from "@/lib/agents";
import { trackEvent } from "@/lib/events";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query, history = [], agent = "general" } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Determine the system prompt based on agent
    let systemPrompt = "You are Kortex AI, a helpful personal knowledge assistant. Answer questions based on the provided documents.";
    if (agent === "research") {
      systemPrompt = agents.research.systemPrompt;
    } else if (agent === "study") {
      systemPrompt = agents.study.systemPrompt;
    } else if (agent === "summarize") {
      systemPrompt = agents.summarize.systemPrompt;
    } else if (agent === "quiz") {
      systemPrompt = agents.quiz.systemPrompt;
    }

    // Log tracking events
    await trackEvent({
      workspaceId: session.workspace.id,
      userId: session.user.id,
      type: "CHAT_MESSAGE_SENT",
      metadata: { agent, queryLength: query.length },
    });
    
    await trackEvent({
      workspaceId: session.workspace.id,
      userId: session.user.id,
      type: "SEARCH_EXECUTED",
      metadata: { query },
    });

    const generator = ragGenerate(query, session.workspace.id, systemPrompt, history);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of generator) {
            // Write each chunk as a JSON string followed by a newline
            controller.enqueue(encoder.encode(JSON.stringify(chunk) + "\n"));
          }
          controller.close();
        } catch (err) {
          console.error("[ChatAPI Stream] Error in stream generation:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    console.error("[ChatAPI POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
