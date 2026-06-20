import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/db/session";
import { db } from "@/lib/db/client";
import { enqueueGraphExtraction } from "@/lib/queue";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const concepts = await db.concept.findMany({
      where: { workspaceId: session.workspace.id },
      include: {
        outgoingRelations: true,
      },
    });

    // Fetch relationships
    const relationships = await db.relationship.findMany({
      where: {
        source: { workspaceId: session.workspace.id },
      },
    });

    // Formulate React Flow Nodes
    // If node positions (x, y) are not saved, compute a layout in a circular pattern
    const nodes = concepts.map((concept, idx) => {
      let x = concept.x;
      let y = concept.y;

      if (x === null || y === null) {
        const angle = (idx / concepts.length) * 2 * Math.PI;
        const radius = 220 + Math.random() * 30; // slight variance to look organic
        x = 400 + Math.cos(angle) * radius;
        y = 250 + Math.sin(angle) * radius;
      }

      return {
        id: concept.id,
        position: { x, y },
        data: {
          label: concept.name,
          type: concept.type,
          description: concept.description || "No description available",
        },
        type: "default",
      };
    });

    // Formulate React Flow Edges
    const edges = relationships.map((rel) => ({
      id: rel.id,
      source: rel.sourceConceptId,
      target: rel.targetConceptId,
      label: rel.label || rel.type,
      animated: ["enables", "uses", "requires"].includes(rel.type),
    }));

    return NextResponse.json({ nodes, edges });
  } catch (err) {
    console.error("[KnowledgeGraphAPI GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find documents in the workspace that are ready
    const documents = await db.document.findMany({
      where: { workspaceId: session.workspace.id, status: "READY" },
      include: { versions: { take: 1, orderBy: { versionNumber: "desc" } } },
    });

    // Enqueue graph extraction for each document
    for (const doc of documents) {
      const extractedText = doc.versions[0]?.extractedText;
      if (extractedText) {
        await enqueueGraphExtraction({
          documentId: doc.id,
          workspaceId: session.workspace.id,
          extractedText: extractedText.slice(0, 15000),
        });
      }
    }

    return NextResponse.json({ success: true, count: documents.length });
  } catch (err) {
    console.error("[KnowledgeGraphAPI POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
