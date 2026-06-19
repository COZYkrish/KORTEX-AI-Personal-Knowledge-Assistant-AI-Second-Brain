"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MessageSquare, Search, BookOpen, Brain, BarChart3,
  Mic, GitBranch, Zap, FileText, PenTool
} from "lucide-react";
import { B } from "@/lib/bauhaus";

const COLORS = [B.RED, B.BLUE, B.YELLOW];
const GEO = ["circle", "square", "triangle"] as const;

const features = [
  { icon: MessageSquare, title: "AI Chat With Documents",    description: "Chat with your entire knowledge base. Get answers with exact source citations, like NotebookLM but more powerful." },
  { icon: Search,        title: "Hybrid Semantic Search",    description: "BM25 keyword search combined with vector similarity search for unmatched precision. Find anything instantly." },
  { icon: GitBranch,     title: "AI Knowledge Graph",        description: "Automatically extract concepts and relationships from your documents. Watch your knowledge universe grow." },
  { icon: BookOpen,      title: "Spaced Repetition",         description: "AI-generated flashcards with Anki-style SM-2 algorithm. Remember more with scientifically proven intervals." },
  { icon: Zap,           title: "Quiz Generator",            description: "Generate MCQ, True/False, and Short Answer quizzes from any document. Test your knowledge depth." },
  { icon: Brain,         title: "Learning Paths",            description: "AI creates personalized learning roadmaps from your uploaded content. From novice to expert, step by step." },
  { icon: FileText,      title: "AI Summarizer",             description: "Generate brief, detailed, bullet-point or study-note summaries. Four formats for any learning style." },
  { icon: PenTool,       title: "AI Workspace",              description: "Your personal Notion AI + ChatGPT Canvas. Write, brainstorm, research and generate content, all in one place." },
  { icon: Mic,           title: "Voice AI Assistant",        description: "Ask questions with your voice, get spoken answers. Powered by Whisper and TTS for natural conversations." },
  { icon: BarChart3,     title: "Learning Analytics",        description: "Track your learning journey with event-sourced analytics. Daily digests, streaks, and retention scores." },
];

function GeoShape({ type, color }: { type: typeof GEO[number]; color: string }) {
  const base: React.CSSProperties = { width: 12, height: 12, background: color, border: B.border2, flexShrink: 0 };
  if (type === "circle") return <div style={{ ...base, borderRadius: "50%" }} />;
  if (type === "triangle") return <div style={{ ...base, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", border: "none" }} />;
  return <div style={base} />;
}

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      ref={ref}
      style={{ background: B.CANVAS, borderBottom: B.border4 }}
      className="py-24 px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-10"
          style={{ borderBottom: B.border4 }}
        >
          <div>
            <p style={{ ...B.labelStyle, color: B.RED, marginBottom: 12 }}>Everything You Need</p>
            <h2 style={{ ...B.displayStyle, fontSize: "clamp(2.5rem, 6vw, 5rem)", color: B.BLACK }}>
              Your
              <br />
              <span style={{ color: B.BLUE }}>Entire</span>
              <br />
              Stack.
            </h2>
          </div>
          <p
            className="max-w-sm md:text-right"
            style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "1rem", color: B.BLACK, lineHeight: 1.6 }}
          >
            10 powerful AI features working together to transform how you learn, research, and remember.
          </p>
        </div>

        {/* ── Feature Grid ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
          style={{ borderLeft: B.border4, borderTop: B.border4 }}
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const accentColor = COLORS[i % 3];
            const geo = GEO[i % 3];
            const iconTextColor = accentColor === B.YELLOW ? B.BLACK : "#fff";
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                className="relative group"
                style={{
                  background: "white",
                  borderRight: B.border4,
                  borderBottom: B.border4,
                  padding: "1.5rem",
                  cursor: "pointer",
                  transition: "transform 0.2s ease-out",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translate(-2px, -2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translate(0, 0)"; }}
              >
                {/* Geo corner decoration */}
                <div style={{ position: "absolute", top: 14, right: 14 }}>
                  <GeoShape type={geo} color={accentColor} />
                </div>

                {/* Icon */}
                <div
                  className="flex items-center justify-center mb-4"
                  style={{ width: 44, height: 44, background: accentColor, border: B.border2 }}
                >
                  <Icon size={18} color={iconTextColor} />
                </div>

                <h3 style={{ ...B.labelStyle, color: B.BLACK, marginBottom: 8 }}>
                  {feature.title}
                </h3>
                <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontSize: "0.78rem", fontWeight: 500, color: "#555", lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
