import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/db/session";
import { db } from "@/lib/db/client";

type RouteContext = { params: Promise<{ id: string; nodeId: string }> };

export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: pathId, nodeId } = await context.params;
    const body = await req.json();
    const { status } = body; // COMPLETED | IN_PROGRESS | PENDING

    if (!status || !["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status)) {
      return NextResponse.json({ error: "Valid status is required" }, { status: 400 });
    }

    const path = await db.learningPath.findUnique({
      where: { id: pathId, workspaceId: session.workspace.id },
      include: { nodes: true },
    });

    if (!path) {
      return NextResponse.json({ error: "Learning path not found" }, { status: 404 });
    }

    const node = path.nodes.find((n) => n.id === nodeId);
    if (!node) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 });
    }

    // Update the node
    await db.pathNode.update({
      where: { id: nodeId },
      data: {
        status: status as any,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
    });

    // If node is completed, automatically set the next node (by order) to IN_PROGRESS if it is currently PENDING
    if (status === "COMPLETED") {
      const nextNode = path.nodes.find((n) => n.order === node.order + 1);
      if (nextNode && nextNode.status === "PENDING") {
        await db.pathNode.update({
          where: { id: nextNode.id },
          data: { status: "IN_PROGRESS" },
        });
      }
    }

    // Recalculate mastery score
    const updatedNodes = await db.pathNode.findMany({
      where: { learningPathId: pathId },
    });
    const completedCount = updatedNodes.filter((n) => n.status === "COMPLETED").length;
    const masteryScore = completedCount / updatedNodes.length;

    const updatedPath = await db.learningPath.update({
      where: { id: pathId },
      data: { masteryScore },
      include: { nodes: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(updatedPath);
  } catch (err) {
    console.error("[PathNode PATCH] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
