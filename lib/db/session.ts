import { currentUser } from "@clerk/nextjs/server";
import { db } from "./client";

export async function getSession() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "Explorer";
  const avatarUrl = clerkUser.imageUrl;

  // Find or create user
  let dbUser = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      workspaceMembers: {
        include: { workspace: true },
      },
    },
  });

  if (!dbUser) {
    dbUser = await db.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
        name,
        avatarUrl,
        settings: {
          create: {
            theme: "dark",
            emailDigest: true,
            voiceEnabled: false,
            defaultLanguage: "en",
          },
        },
      },
      include: {
        workspaceMembers: {
          include: { workspace: true },
        },
      },
    });
  }

  // Ensure user has at least one workspace
  let workspaceMember = dbUser.workspaceMembers[0];
  let workspace = workspaceMember?.workspace;

  if (!workspace) {
    // Generate a unique slug
    const slug = `workspace-${clerkUser.id.toLowerCase()}`;
    
    workspace = await db.workspace.create({
      data: {
        name: `${dbUser.name || "My"}'s Space`,
        slug,
        description: "My personal AI Second Brain workspace",
      },
    });

    // Add user as OWNER of the workspace
    await db.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: dbUser.id,
        role: "OWNER",
      },
    });
  }

  return { user: dbUser, workspace };
}
