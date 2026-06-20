import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/db/session";
import { db } from "@/lib/db/client";
import { vectorStore } from "@/lib/vector-store/pgvector-provider";
import { unlink } from "fs/promises";
import path from "path";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const document = await db.document.findUnique({
      where: { id, workspaceId: session.workspace.id },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Delete pgvector embeddings
    await vectorStore.deleteByDocument(id);

    // Delete local file
    const fileName = document.fileUrl.split("/uploads/")[1];
    if (fileName) {
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      await unlink(filePath).catch(() => {});
    }

    // Cascade delete Document record (cascades chunk entries automatically)
    await db.document.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DocumentActions DELETE] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
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

    const document = await db.document.findUnique({
      where: { id, workspaceId: session.workspace.id },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const updated = await db.document.update({
      where: { id },
      data: {
        isFavorite: body.isFavorite !== undefined ? body.isFavorite : !document.isFavorite,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[DocumentActions PATCH] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
