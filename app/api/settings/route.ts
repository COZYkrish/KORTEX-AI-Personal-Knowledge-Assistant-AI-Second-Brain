import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/db/session";
import { db } from "@/lib/db/client";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await db.userSettings.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      name: session.user.name,
      settings,
    });
  } catch (err) {
    console.error("[SettingsAPI GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, theme, emailDigest, defaultLanguage, voiceEnabled } = body;

    // Update User Name if provided
    if (name !== undefined) {
      await db.user.update({
        where: { id: session.user.id },
        data: { name },
      });
    }

    // Update UserSettings
    const updatedSettings = await db.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        ...(theme !== undefined && { theme }),
        ...(emailDigest !== undefined && { emailDigest }),
        ...(defaultLanguage !== undefined && { defaultLanguage }),
        ...(voiceEnabled !== undefined && { voiceEnabled }),
      },
      create: {
        userId: session.user.id,
        theme: theme ?? "dark",
        emailDigest: emailDigest ?? true,
        defaultLanguage: defaultLanguage ?? "en",
        voiceEnabled: voiceEnabled ?? false,
      },
    });

    return NextResponse.json({
      name: name ?? session.user.name,
      settings: updatedSettings,
    });
  } catch (err) {
    console.error("[SettingsAPI PATCH] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
