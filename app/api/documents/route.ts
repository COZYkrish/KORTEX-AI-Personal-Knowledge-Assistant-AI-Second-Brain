import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/db/session";
import { db } from "@/lib/db/client";
import { enqueueDocumentIngestion } from "@/lib/queue";
import { trackEvent } from "@/lib/events";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await db.document.findMany({
      where: { workspaceId: session.workspace.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (err) {
    console.error("[DocumentsAPI GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Validate size and file format
    const validMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to local public/uploads directory
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const filePath = path.join(uploadDir, safeFileName);
    await writeFile(filePath, buffer);

    const fileUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/uploads/${safeFileName}`;

    // Create Document record in DB
    const document = await db.document.create({
      data: {
        workspaceId: session.workspace.id,
        title: file.name.replace(/\.[^/.]+$/, ""), // Strip extension for title
        fileName: file.name,
        fileUrl,
        mimeType: file.type,
        fileSize: file.size,
        status: "PENDING",
      },
    });

    // Enqueue document background ingestion
    await enqueueDocumentIngestion({
      documentId: document.id,
      workspaceId: session.workspace.id,
      fileUrl,
      mimeType: file.type,
    });

    // Track document upload event
    await trackEvent({
      workspaceId: session.workspace.id,
      userId: session.user.id,
      type: "DOCUMENT_UPLOADED",
      metadata: { documentId: document.id, title: document.title },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (err) {
    console.error("[DocumentsAPI POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
