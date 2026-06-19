"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MessageSquare, Search, BookOpen, Brain, BarChart3,
  Mic, GitBranch, Zap, FileText, PenTool
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Chat With Documents",
    description: "Chat with your entire knowledge base. Get answers with exact source citations, like NotebookLM but more powerful.",
  },
  {
    icon: Search,
    title: "Hybrid Semantic Search",
    description: "BM25 keyword search combined with vector similarity search for unmatched precision. Find anything instantly.",
  },
  {
    icon: GitBranch,
    title: "AI Knowledge Graph",
    description: "Automatically extract concepts and relationships from your documents. Watch your knowledge universe grow.",
  },
  {
    icon: BookOpen,
    title: "Spaced Repetition Flashcards",
    description: "AI-generated flashcards with Anki-style SM-2 algorithm. Remember more with scientifically proven intervals.",
  },
  {
    icon: Zap,
    title: "Quiz Generator",
    description: "Generate MCQ, True/False, and Short Answer quizzes from any document. Test your knowledge depth.",
  },
  {
    icon: Brain,
    title: "Learning Paths",
    description: "AI creates personalized learning roadmaps from your uploaded content. From novice to expert, step by step.",
  },
  {
    icon: FileText,
    title: "AI Summarizer",
    description: "Generate brief, detailed, bullet-point or study-note summaries. Four formats for any learning style.",
  },
  {
    icon: PenTool,
    title: "AI Workspace",
    description: "Your personal Notion AI + ChatGPT Canvas. Write, brainstorm, research and generate content, all in one place.",
  },
  {
    icon: Mic,
    title: "Voice AI Assistant",
    description: "Ask questions with your voice, get spoken answers. Powered by OpenAI Whisper and TTS for natural conversations.",
  },
  {
    icon: BarChart3,
    title: "Learning Analytics",
    description: "Track your learning journey with event-sourced analytics. Daily digests, streaks, and retention scores.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Background border top */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium text-[#71717a] uppercase tracking-widest mb-4 block">
            Everything You Need
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 text-white">
            Your Entire Knowledge Stack,
            <br />
            <span className="text-[#a1a1aa]">In One Platform</span>
          </h2>
          <p className="text-xl text-[#a1a1aa] max-w-2xl mx-auto">
            10 powerful AI features working together to transform how you learn,
            research, and remember.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                  transition: { duration: 0.2 },
                }}
                className="bg-[#0a0a0a] border border-[#222] p-6 cursor-pointer group relative overflow-hidden rounded-xl hover:border-[#444]"
              >
                {/* Hover subtle glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-[#111] border border-[#333] group-hover:bg-white group-hover:border-white transition-colors duration-300">
                    <Icon className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" />
                  </div>

                  <h3 className="font-semibold text-base mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#71717a] leading-relaxed group-hover:text-[#a1a1aa] transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
