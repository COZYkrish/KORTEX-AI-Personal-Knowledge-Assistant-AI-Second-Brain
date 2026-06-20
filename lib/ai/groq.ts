// ============================================================
// Groq Provider — lib/ai/groq.ts
// Implements the AIProvider interface using Groq's API.
// ============================================================

import type { AIProvider, AIMessage } from "./types";

export class GroqProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || "";
    // Default to llama-3.3-70b-versatile, which is highly capable and extremely fast on Groq
    this.model = "llama-3.3-70b-versatile";
  }

  async generate(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("GROQ_API_KEY environment variable is required");
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  async generateJSON<T>(prompt: string): Promise<T> {
    if (!this.apiKey) {
      throw new Error("GROQ_API_KEY environment variable is required");
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || "{}";
    return JSON.parse(text) as T;
  }

  async *generateStream(
    messages: AIMessage[],
    systemPrompt: string
  ): AsyncGenerator<string> {
    if (!this.apiKey) {
      throw new Error("GROQ_API_KEY environment variable is required");
    }

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role === "model" ? ("assistant" as const) : ("user" as const),
        content: m.parts[0].text,
      })),
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: formattedMessages,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API streaming error: ${response.status} - ${err}`);
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const cleanLine = line.trim();
          if (!cleanLine) continue;
          if (cleanLine === "data: [DONE]") break;

          if (cleanLine.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(cleanLine.slice(6));
              const chunk = parsed.choices[0]?.delta?.content;
              if (chunk) {
                yield chunk;
              }
            } catch (e) {
              // Ignore malformed JSON lines
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export const groqService = new GroqProvider();
