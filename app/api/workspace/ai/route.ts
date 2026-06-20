import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/db/session";
import { aiProvider } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, action } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    let prompt = "";
    switch (action) {
      case "improve":
        prompt = `Improve the writing of the following text. Enhance its clarity, grammar, vocabulary, and sentence flow, while keeping the original context and meaning intact:\n\n${content}`;
        break;
      case "summarize":
        prompt = `Provide a concise and comprehensive summary of the following text, capturing all the key concepts and major takeaways:\n\n${content}`;
        break;
      case "expand":
        prompt = `Expand on the following text naturally. Add more depth, details, descriptive prose, and context while maintaining the original tone and intent:\n\n${content}`;
        break;
      case "bullets":
        prompt = `Extract the most important points from the following text and present them as a clean, structured bulleted list:\n\n${content}`;
        break;
      case "quiz":
        prompt = `Generate a 3-question quiz in markdown format based on the following text. For each question, provide 4 options (A, B, C, D) if MCQ, the correct answer, and a brief explanation of the correct choice:\n\n${content}`;
        break;
      case "chat":
        prompt = `Analyze the following text and provide constructive feedback, key insights, and 2-3 suggestions on how the author could improve or continue their writing:\n\n${content}`;
        break;
      default:
        return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
    }

    const response = await aiProvider.generate(prompt);

    return NextResponse.json({ response });
  } catch (err) {
    console.error("[WorkspaceAI POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
