import { aiProvider } from "@/lib/ai";
import { ragGenerate } from "@/lib/rag/pipeline";
import type { Citation } from "@/lib/rag/pipeline";

// -------------------------------------------------------
// BASE AGENT
// -------------------------------------------------------
export abstract class BaseAgent {
  abstract readonly name: string;
  abstract readonly systemPrompt: string;

  async *chat(
    query: string,
    workspaceId: string,
    history: Array<{ role: "user" | "model"; content: string }> = []
  ): AsyncGenerator<{ type: "chunk" | "citations"; value: string | Citation[] }> {
    yield* ragGenerate(query, workspaceId, this.systemPrompt, history);
  }

  async generate(prompt: string): Promise<string> {
    return aiProvider.generate(`${this.systemPrompt}\n\n${prompt}`);
  }

  async generateJSON<T>(prompt: string): Promise<T> {
    return aiProvider.generateJSON<T>(`${this.systemPrompt}\n\n${prompt}`);
  }
}

// -------------------------------------------------------
// RESEARCH AGENT
// -------------------------------------------------------
export class ResearchAgent extends BaseAgent {
  readonly name = "Research Agent";
  readonly systemPrompt = `You are an expert research assistant and academic analyst.

Your capabilities:
- Compare and contrast multiple documents to find similarities and contradictions
- Extract key insights and themes from research literature
- Generate comprehensive literature reviews
- Identify research gaps and opportunities
- Provide structured, citation-backed analysis

Always structure responses with clear headings, use [N] citation markers, and maintain academic rigor.`;

  async compareDocuments(
    documentContents: Array<{ title: string; content: string }>
  ): Promise<{
    similarities: string[];
    contradictions: string[];
    insights: string[];
    literatureReview: string;
  }> {
    const prompt = `Compare these documents and extract comprehensive analysis:

${documentContents.map((d, i) => `## Document ${i + 1}: ${d.title}\n${d.content.slice(0, 3000)}`).join("\n\n---\n\n")}

Return JSON with keys: similarities (string[]), contradictions (string[]), insights (string[]), literatureReview (string)`;

    return this.generateJSON(prompt);
  }
}

// -------------------------------------------------------
// STUDY AGENT
// -------------------------------------------------------
export class StudyAgent extends BaseAgent {
  readonly name = "Study Agent";
  readonly systemPrompt = `You are an expert learning coach and curriculum designer.

Your capabilities:
- Create personalized learning paths based on document content
- Generate structured study plans with clear milestones
- Identify prerequisite knowledge and dependencies between topics
- Create engaging flashcards that promote retention
- Design effective quiz questions at appropriate difficulty levels

Always prioritize active recall, spaced repetition principles, and scaffolded learning.`;

  async generateLearningPath(
    topic: string,
    documentSummaries: string[]
  ): Promise<{
    title: string;
    description: string;
    nodes: Array<{
      title: string;
      description: string;
      order: number;
      estimatedMinutes: number;
    }>;
  }> {
    const prompt = `Create a comprehensive learning path for: "${topic}"

Available knowledge sources:
${documentSummaries.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Return JSON with: title, description, nodes (array of {title, description, order, estimatedMinutes})`;

    return this.generateJSON(prompt);
  }
}

// -------------------------------------------------------
// QUIZ AGENT
// -------------------------------------------------------
export class QuizAgent extends BaseAgent {
  readonly name = "Quiz Agent";
  readonly systemPrompt = `You are an expert assessment designer specializing in knowledge testing.

Your capabilities:
- Generate diverse question types: MCQ, True/False, Short Answer
- Create questions at varying difficulty levels (Easy, Medium, Hard)
- Write clear, unambiguous questions with plausible distractors
- Provide detailed explanations for correct answers
- Ensure questions test genuine understanding, not just memorization

Questions should promote deep learning and critical thinking.`;

  async generateQuiz(
    content: string,
    config: {
      questionCount: number;
      types: ("MCQ" | "TRUE_FALSE" | "SHORT_ANSWER")[];
    }
  ): Promise<{
    title: string;
    questions: Array<{
      type: string;
      content: string;
      options?: string[];
      correctAnswer: string;
      explanation: string;
      order: number;
    }>;
  }> {
    const prompt = `Generate a quiz based on this content:

${content.slice(0, 5000)}

Config: ${config.questionCount} questions, types: ${config.types.join(", ")}

Return JSON: { title: string, questions: Array<{ type, content, options (for MCQ), correctAnswer, explanation, order }> }`;

    return this.generateJSON(prompt);
  }
}

// -------------------------------------------------------
// KNOWLEDGE GRAPH AGENT
// -------------------------------------------------------
export class KnowledgeGraphAgent extends BaseAgent {
  readonly name = "Knowledge Graph Agent";
  readonly systemPrompt = `You are an expert knowledge extraction specialist.

Your capabilities:
- Extract key concepts and entities from text
- Identify and classify relationships between concepts
- Generate descriptive labels for relationships
- Build comprehensive, navigable knowledge representations

Focus on meaningful, non-trivial relationships that reveal genuine conceptual connections.`;

  async extractGraph(content: string): Promise<{
    concepts: Array<{
      name: string;
      description: string;
      type: string;
    }>;
    relationships: Array<{
      source: string;
      target: string;
      type: string;
      label: string;
    }>;
  }> {
    const prompt = `Extract a knowledge graph from this content:

${content.slice(0, 6000)}

Return JSON with:
- concepts: Array<{ name, description, type (concept|entity|topic|technology) }>
- relationships: Array<{ source (concept name), target (concept name), type (includes|uses|related_to|contradicts|enables|requires), label }>

Extract 10-30 concepts and their most meaningful relationships.`;

    return this.generateJSON(prompt);
  }
}

// -------------------------------------------------------
// SUMMARIZATION AGENT
// -------------------------------------------------------
export class SummarizationAgent extends BaseAgent {
  readonly name = "Summarization Agent";
  readonly systemPrompt = `You are an expert content summarizer with a gift for clarity.

Your capabilities:
- Generate multi-level summaries (brief, detailed, bullet points)
- Extract key takeaways and actionable insights
- Create study notes optimized for learning
- Highlight critical information and novel findings

Always preserve accuracy while maximizing clarity and retention.`;

  async summarize(
    content: string,
    type: "brief" | "detailed" | "bullets" | "study_notes"
  ): Promise<string> {
    const prompts = {
      brief: `Write a concise 2-3 paragraph summary:\n\n${content.slice(0, 8000)}`,
      detailed: `Write a comprehensive, detailed summary with sections:\n\n${content.slice(0, 8000)}`,
      bullets: `Extract the 10-15 most important bullet points:\n\n${content.slice(0, 8000)}`,
      study_notes: `Create structured study notes with: Key Concepts, Important Details, Common Misconceptions, Memory Aids:\n\n${content.slice(0, 8000)}`,
    };

    return this.generate(prompts[type]);
  }
}

// -------------------------------------------------------
// AGENT REGISTRY
// -------------------------------------------------------
export const agents = {
  research: new ResearchAgent(),
  study: new StudyAgent(),
  quiz: new QuizAgent(),
  graph: new KnowledgeGraphAgent(),
  summarize: new SummarizationAgent(),
} as const;

export type AgentType = keyof typeof agents;
