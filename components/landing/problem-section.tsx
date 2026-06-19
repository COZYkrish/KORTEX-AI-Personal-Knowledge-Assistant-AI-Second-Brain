"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, Brain, Layers, Archive } from "lucide-react";

const chaosItems = [
  "ResearchPaper_v3_FINAL.pdf",
  "notes_from_meeting_last_week.docx",
  "TODO_someday.txt",
  "Lecture_Recording_Transcript.pdf",
  "bookmarks_export_2024.html",
  "Ideas_brainstorm.md",
];

export function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Background border top */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Story text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-sm font-medium text-[#71717a] uppercase tracking-widest mb-4 block">
              The Problem
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-white">
              We consume more information
              <br />
              <span className="text-[#a1a1aa]">than ever before.</span>
            </h2>

            <div className="space-y-6 text-lg text-[#a1a1aa]">
              <p>
                The average knowledge worker reads{" "}
                <span className="text-white font-semibold">hundreds of pages</span> per
                week. Research papers, textbooks, meeting notes, articles.
              </p>
              <p>
                But our minds were{" "}
                <span className="text-white font-semibold">
                  never designed to manage thousands of ideas
                </span>
                . The knowledge disappears as fast as we consume it.
              </p>
              <p>
                The result?{" "}
                <span className="text-white font-semibold">
                  Scattered documents. Forgotten insights. Lost connections.
                </span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { icon: Layers, label: "Too Many Files", value: "500+" },
                { icon: Archive, label: "Lost Insights", value: "73%" },
                { icon: AlertTriangle, label: "Wasted Hours", value: "8h/wk" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="glass p-4 text-center group">
                    <Icon className="w-6 h-6 text-[#a1a1aa] mx-auto mb-2 group-hover:text-white transition-colors" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-[#71717a] font-medium uppercase tracking-wider">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right — Chaos visualization */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
          >
            {/* Chaos before */}
            <div className="relative mb-8">
              <div className="text-xs font-bold text-[#71717a] uppercase tracking-widest mb-4 text-center">
                Before Kortex AI
              </div>
              <div className="space-y-2">
                {chaosItems.map((item, i) => (
                  <motion.div
                    key={item}
                    animate={{
                      x: [0, (i % 2 === 0 ? 6 : -6), 0],
                      rotate: [(i - 3) * 2, (i - 3) * 2 + 1, (i - 3) * 2],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4 + i * 0.5,
                      ease: "easeInOut",
                    }}
                    className="glass px-4 py-3 flex items-center gap-3 text-sm text-[#a1a1aa] overflow-hidden"
                    style={{ transform: `rotate(${(i - 3) * 2}deg)` }}
                  >
                    <AlertTriangle className="w-4 h-4 text-[#71717a] shrink-0" />
                    <span className="truncate">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center my-6 relative z-10">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="flex flex-col items-center gap-2 bg-black py-2 px-4 rounded-full border border-[#222]"
              >
                <Brain className="w-6 h-6 text-white animate-pulse-glow rounded-full" />
                <div className="text-[#a1a1aa] text-xs font-medium uppercase tracking-widest">Transforms Into</div>
              </motion.div>
            </div>

            {/* Order after */}
            <div className="glass-bright p-6 relative z-0 -mt-10 pt-16">
              <div className="text-xs font-bold text-white uppercase tracking-widest mb-4 text-center">
                After Kortex AI
              </div>
              <div className="space-y-3">
                {["Unified Knowledge Base", "AI Knowledge Graph", "Instant Answers", "Auto-generated Flashcards"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-[#e4e4e7] font-medium bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-3 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
