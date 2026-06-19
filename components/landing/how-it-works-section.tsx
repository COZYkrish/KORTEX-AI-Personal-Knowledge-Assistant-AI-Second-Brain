"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { B } from "@/lib/bauhaus";

const COLORS = [B.RED, B.BLUE, B.YELLOW, B.RED, B.BLUE] as const;

const steps = [
  { number: "01", title: "Upload",               description: "Drag & drop any PDF, DOCX, or TXT file. Our system accepts up to 500MB." },
  { number: "02", title: "AI Processing",        description: "Automated pipeline extracts text, generates embeddings, and indexes your knowledge." },
  { number: "03", title: "Knowledge Extraction", description: "The Graph Agent identifies concepts, entities, and their relationships automatically." },
  { number: "04", title: "Ask Questions",        description: "Chat with your entire knowledge base using Hybrid RAG with exact source citations." },
  { number: "05", title: "Learn Faster",         description: "Flashcards, quizzes, learning paths, and daily digests accelerate your retention." },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-24 px-8"
      style={{ background: B.CANVAS, borderBottom: B.border4 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="pb-10 mb-16" style={{ borderBottom: B.border4 }}>
          <p style={{ ...B.labelStyle, color: B.BLUE, marginBottom: 12 }}>How It Works</p>
          <h2 style={{ ...B.displayStyle, fontSize: "clamp(2.5rem, 6vw, 5rem)", color: B.BLACK }}>
            From Upload
            <br />
            to <span style={{ color: B.BLUE }}>Mastery.</span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
          style={{ borderLeft: B.border4, borderTop: B.border4 }}
        >
          {steps.map((step, i) => {
            const color = COLORS[i];
            const numTextColor = color === B.YELLOW ? B.BLACK : "#fff";
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
                className="flex flex-col"
                style={{
                  background: "white",
                  borderRight: B.border4,
                  borderBottom: B.border4,
                  transition: "transform 0.2s ease-out",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
              >
                {/* Colored step header with rotated number */}
                <div
                  className="flex items-center justify-center py-6"
                  style={{ background: color, borderBottom: B.border4 }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 56,
                      height: 56,
                      border: "4px solid rgba(255,255,255,0.9)",
                      transform: "rotate(45deg)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Outfit', system-ui, sans-serif",
                        fontWeight: 900,
                        fontSize: "1.1rem",
                        color: numTextColor,
                        transform: "rotate(-45deg)",
                        display: "block",
                      }}
                    >
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "1.5rem", flex: 1 }}>
                  <h3 style={{ ...B.labelStyle, color: B.BLACK, marginBottom: 10, fontSize: "0.85rem" }}>
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.82rem", color: "#555", lineHeight: 1.6 }}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
