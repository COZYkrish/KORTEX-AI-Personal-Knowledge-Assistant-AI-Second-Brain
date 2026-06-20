"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, Brain } from "lucide-react";
import { B } from "@/lib/bauhaus";

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
    <section
      ref={ref}
      className="landing-section"
      style={{ background: B.RED }}
    >
      {/* Dot grid overlay */}
      <div className="absolute inset-0 bg-dot-grid-white opacity-10 pointer-events-none" />
      {/* Decorative bg shapes */}
      <div style={{ position: "absolute", right: -100, top: -100, width: 300, height: 300, borderRadius: "50%", border: "4px solid rgba(255,255,255,0.12)" }} />
      <div style={{ position: "absolute", left: -60, bottom: -60, width: 200, height: 200, border: "4px solid rgba(255,255,255,0.12)", transform: "rotate(45deg)" }} />

      <div className="site-shell relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">

          {/* LEFT — story */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="section-label" style={{ color: "rgba(255,255,255,0.72)", marginBottom: 16 }}>The Problem</p>
            <h2 className="section-heading" style={{ color: "white", marginBottom: 28 }}>
              Knowledge
              <br />
              <span style={{ color: B.YELLOW }}>Chaos</span>
              <br />
              Is Real.
            </h2>

            <div className="space-y-4 mb-8" style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "clamp(0.98rem, 1.6vw, 1.08rem)", color: "white", lineHeight: 1.7 }}>
              <p>
                The average knowledge worker reads{" "}
                <span style={{ fontWeight: 900, background: "white", color: B.RED, padding: "0 6px" }}>
                  hundreds of pages
                </span>{" "}
                per week. Research papers, textbooks, meeting notes, articles.
              </p>
              <p>
                But our minds were never designed to manage{" "}
                <span style={{ fontWeight: 900, background: "white", color: B.RED, padding: "0 6px" }}>
                  thousands of ideas
                </span>
                . Knowledge disappears as fast as we consume it.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3" style={{ border: "2px solid white" }}>
              {[
                { value: "500+", label: "Too Many Files" },
                { value: "73%",  label: "Lost Insights"  },
                { value: "8h/wk", label: "Wasted Time"  },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="py-4 text-center"
                  style={{ borderRight: i < 2 ? "2px solid white" : "none" }}
                >
                  <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, fontSize: "1.75rem", color: "white", textTransform: "uppercase" }}>
                    {stat.value}
                  </div>
                  <div style={{ ...B.labelStyle, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — before/after */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="flex flex-col gap-4 min-w-0"
          >
            {/* BEFORE */}
            <div className="bau-card" style={{ background: "white", boxShadow: B.shadowWhiteMd, padding: "1.25rem" }}>
              <div className="flex items-center gap-2 mb-4" style={{ ...B.labelStyle, color: B.RED }}>
                <AlertTriangle size={14} />
                Before Kortex AI
              </div>
              <div className="space-y-2">
                {chaosItems.map((item, i) => (
                  <motion.div
                    key={item}
                    animate={{ x: [0, (i % 2 === 0 ? 3 : -3), 0], rotate: [(i - 3) * 1.2, (i - 3) * 1.2 + 0.6, (i - 3) * 1.2] }}
                    transition={{ repeat: Infinity, duration: 4 + i * 0.3, ease: "easeInOut" }}
                    className="flex items-center gap-3"
                    style={{
                      fontFamily: "'Outfit', system-ui, sans-serif",
                      fontWeight: 500,
                      fontSize: "0.82rem",
                      color: "#555",
                      border: "2px solid #e0e0e0",
                      padding: "8px 12px",
                      background: B.CANVAS,
                      transform: `rotate(${(i - 3) * 1.2}deg)`,
                    }}
                  >
                    <AlertTriangle size={12} color={B.RED} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div
                className="flex items-center gap-3 px-5 py-3"
                style={{ background: B.BLACK, border: "4px solid white" }}
              >
                <Brain size={18} color={B.YELLOW} />
                <span style={{ ...B.labelStyle, color: "white" }}>Kortex AI Transforms Into</span>
              </div>
            </div>

            {/* AFTER */}
            <div className="bau-card" style={{ background: B.BLACK, borderColor: "white", boxShadow: B.shadowWhiteMd, padding: "1.25rem" }}>
              <div style={{ ...B.labelStyle, color: B.YELLOW, marginBottom: 16 }}>After Kortex AI</div>
              <div className="space-y-3">
                {[
                  { label: "Unified Knowledge Base",      color: B.RED    },
                  { label: "AI Knowledge Graph",          color: B.BLUE   },
                  { label: "Instant Answers",             color: B.YELLOW },
                  { label: "Auto-generated Flashcards",   color: B.RED    },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "white", border: "2px solid #333", padding: "10px 14px" }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid white", background: item.color, flexShrink: 0 }} />
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
