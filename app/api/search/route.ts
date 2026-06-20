import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/db/session";
import { hybridSearch } from "@/lib/rag/pipeline";
import { trackEvent } from "@/lib/events";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Run hybrid search
    const results = await hybridSearch(query, session.workspace.id);

    // Track analytics event
    await trackEvent({
      workspaceId: session.workspace.id,
      userId: session.user.id,
      type: "SEARCH_EXECUTED",
      metadata: { query, resultsCount: results.length },
    });

    return NextResponse.json(results);
  } catch (err) {
    console.error("[SearchAPI GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
