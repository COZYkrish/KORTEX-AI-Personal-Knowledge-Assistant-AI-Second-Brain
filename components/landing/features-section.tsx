"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MessageSquare, Search, BookOpen, Brain, BarChart3,
  Mic, GitBranch, Zap, FileText, PenTool
} from "lucide-react";

const features = [
  { icon: MessageSquare, title: "AI Chat With Documents", description: "Chat with your entire knowledge base. Get answers with exact source citations, like NotebookLM but more powerful.", color: "#D02020", geo: "circle" },
  { icon: Search, title: "Hybrid Semantic Search", description: "BM25 keyword search combined with vector similarity search for unmatched precision. Find anything instantly.", color: "#1040C0", geo: "square" },
  { icon: GitBranch, title: "AI Knowledge Graph", description: "Automatically extract concepts and relationships from your documents. Watch your knowledge universe grow.", color: "#F0C020", geo: "triangle" },
  { icon: BookOpen, title: "Spaced Repetition", description: "AI-generated flashcards with Anki-style SM-2 algorithm. Remember more with scientifically proven intervals.", color: "#D02020", geo: "circle" },
  { icon: Zap, title: "Quiz Generator", description: "Generate MCQ, True/False, and Short Answer quizzes from any document. Test your knowledge depth.", color: "#1040C0", geo: "square" },
  { icon: Brain, title: "Learning Paths", description: "AI creates personalized learning roadmaps from your uploaded content. From novice to expert, step by step.", color: "#F0C020", geo: "triangle" },
  { icon: FileText, title: "AI Summarizer", description: "Generate brief, detailed, bullet-point or study-note summaries. Four formats for any learning style.", color: "#D02020", geo: "circle" },
  { icon: PenTool, title: "AI Workspace", description: "Your personal Notion AI + ChatGPT Canvas. Write, brainstorm, research and generate content, all in one place.", color: "#1040C0", geo: "square" },
  { icon: Mic, title: "Voice AI Assistant", description: "Ask questions with your voice, get spoken answers. Powered by Whisper and TTS for natural conversations.", color: "#F0C020", geo: "triangle" },
  { icon: BarChart3, title: "Learning Analytics", description: "Track your learning journey with event-sourced analytics. Daily digests, streaks, and retention scores.", color: "#D02020", geo: "circle" },
];

function GeoDecoration({ type, color }: { type: string; color: string }) {
  if (type === "circle") return (
    <div className="w-4 h-4 rounded-full border-2 border-[#121212] flex-shrink-0" style={{ background: color }} />
  );
  if (type === "triangle") return (
    <div className="w-4 h-4 border-2 border-[#121212] flex-shrink-0" style={{ background: color, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
  );
  return (
    <div className="w-4 h-4 border-2 border-[#121212] flex-shrink-0" style={{ background: color }} />
  );
}

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="relative bg-[#F0F0F0] border-b-4 border-[#121212] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b-4 border-[#121212] pb-10">
          <div>
            <span className="font-label text-[#D02020] mb-3 block">Everything You Need</span>
            <h2
              className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#121212]"
              style={{ lineHeight: "0.92" }}
            >
              Your
              <br />
              <span className="text-[#1040C0]">Entire</span>
              <br />
              Stack.
            </h2>
          </div>
          <p className="text-lg text-[#121212] font-medium max-w-sm leading-relaxed md:text-right md:pb-2">
            10 powerful AI features working together to transform how you learn,
            research, and remember.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-0 border-l-4 border-t-4 border-[#121212]">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                className="bg-white border-r-4 border-b-4 border-[#121212] p-6 cursor-pointer group hover:-translate-y-1 hover:translate-x-[-1px] transition-transform duration-200 relative overflow-hidden"
              >
                {/* Top-right geometric decoration */}
                <div className="absolute top-4 right-4">
                  <GeoDecoration type={feature.geo} color={feature.color} />
                </div>

                {/* Icon Container */}
                <div
                  className="w-12 h-12 border-2 border-[#121212] flex items-center justify-center mb-4 group-hover:shadow-hard transition-all duration-200"
                  style={{ background: feature.color }}
                >
                  <Icon className="w-5 h-5 text-white" style={{ color: feature.color === "#F0C020" ? "#121212" : "white" }} />
                </div>

                <h3
                  className="text-sm mb-2 text-[#121212] leading-tight uppercase"
                  style={{ fontWeight: 700, letterSpacing: "0.03em" }}
                >
                  {feature.title}
                </h3>
                <p className="text-xs text-[#555] leading-relaxed font-medium">
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
