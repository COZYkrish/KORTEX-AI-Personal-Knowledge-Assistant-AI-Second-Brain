"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, Brain } from "lucide-react";

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
    <section ref={ref} className="relative bg-[#D02020] border-b-4 border-[#121212] py-24 px-6 overflow-hidden">
      {/* Background dot grid on red */}
      <div className="absolute inset-0 bg-dot-grid-white opacity-10" />

      {/* Large decorative circle */}
      <div className="absolute -right-32 -top-32 w-80 h-80 rounded-full border-4 border-white opacity-10" />
      <div className="absolute -left-16 -bottom-16 w-48 h-48 border-4 border-white opacity-10 rotate-45" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Story text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="font-label text-white opacity-70 mb-4 block">The Problem</span>
            <h2
              className="font-display text-5xl sm:text-6xl lg:text-7xl text-white mb-8"
              style={{ lineHeight: "0.92" }}
            >
              Knowledge
              <br />
              <span className="text-[#F0C020]">Chaos</span>
              <br />
              Is Real.
            </h2>

            <div className="space-y-5 text-lg text-white font-medium">
              <p>
                The average knowledge worker reads{" "}
                <span className="font-black bg-white text-[#D02020] px-2">hundreds of pages</span>{" "}
                per week. Research papers, textbooks, meeting notes, articles.
              </p>
              <p>
                But our minds were never designed to manage{" "}
                <span className="font-black bg-white text-[#D02020] px-2">thousands of ideas</span>.
                Knowledge disappears as fast as we consume it.
              </p>
            </div>

            {/* Stats — Bauhaus bordered blocks */}
            <div className="grid grid-cols-3 gap-0 mt-10 border-2 border-white">
              {[
                { value: "500+", label: "Too Many Files" },
                { value: "73%", label: "Lost Insights" },
                { value: "8h/wk", label: "Wasted Time" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`p-5 text-center ${i < 2 ? "border-r-2 border-white" : ""}`}
                >
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="font-label text-white opacity-70 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Before/After visualization */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {/* BEFORE — Chaos */}
            <div className="bg-white border-4 border-[#121212] shadow-hard-white-lg p-6">
              <div className="font-label text-[#D02020] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Before Kortex AI
              </div>
              <div className="space-y-2">
                {chaosItems.map((item, i) => (
                  <motion.div
                    key={item}
                    animate={{
                      x: [0, (i % 2 === 0 ? 4 : -4), 0],
                      rotate: [(i - 3) * 1.5, (i - 3) * 1.5 + 0.8, (i - 3) * 1.5],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4 + i * 0.3,
                      ease: "easeInOut",
                    }}
                    className="flex items-center gap-3 text-sm font-medium text-[#555] border-2 border-[#e0e0e0] px-3 py-2 bg-[#F0F0F0]"
                    style={{ transform: `rotate(${(i - 3) * 1.5}deg)` }}
                  >
                    <AlertTriangle className="w-3 h-3 text-[#D02020] shrink-0" />
                    <span className="truncate">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3 bg-[#121212] border-4 border-white px-5 py-3">
                <Brain className="w-5 h-5 text-[#F0C020]" />
                <span className="font-label text-white">Kortex AI Transforms Into</span>
              </div>
            </div>

            {/* AFTER — Order */}
            <div className="bg-[#121212] border-4 border-white shadow-hard-white-lg p-6">
              <div className="font-label text-[#F0C020] mb-4">After Kortex AI</div>
              <div className="space-y-3">
                {[
                  { label: "Unified Knowledge Base", color: "#D02020" },
                  { label: "AI Knowledge Graph", color: "#1040C0" },
                  { label: "Instant Answers", color: "#F0C020" },
                  { label: "Auto-generated Flashcards", color: "#D02020" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 text-sm font-bold text-white border-2 border-[#333] px-4 py-3"
                  >
                    <div
                      className="w-3 h-3 rounded-full border-2 border-white shrink-0"
                      style={{ background: item.color }}
                    />
                    {item.label}
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
