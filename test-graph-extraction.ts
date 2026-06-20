import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { db } from "@/lib/db/client";
import { agents } from "@/lib/agents";

async function run() {
  const documentId = "cmqlyhcxp0009ga2cdvngefjb";
  const version = await db.documentVersion.findFirst({
    where: { documentId },
    orderBy: { versionNumber: "desc" },
  });

  if (!version) {
    console.error("No document version found!");
    return;
  }

  const textToExtract = version.extractedText.slice(0, 15000);
  console.log("Calling agents.graph.extractGraph with text length:", textToExtract.length);
  
  try {
    const result = await agents.graph.extractGraph(textToExtract);
    console.log("Extraction result:");
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Extraction failed:", err);
  }
}

run()
  .catch(console.error)
  .finally(() => db.$disconnect());
