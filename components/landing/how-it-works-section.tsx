"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Upload",
    description: "Drag & drop any PDF, DOCX, or TXT file. Our system accepts up to 500MB.",
    color: "#D02020",
  },
  {
    number: "02",
    title: "AI Processing",
    description: "Automated pipeline extracts text, generates embeddings, and indexes your knowledge.",
    color: "#1040C0",
  },
  {
    number: "03",
    title: "Knowledge Extraction",
    description: "The Graph Agent identifies concepts, entities, and their relationships automatically.",
    color: "#F0C020",
  },
  {
    number: "04",
    title: "Ask Questions",
    description: "Chat with your entire knowledge base using Hybrid RAG with exact source citations.",
    color: "#D02020",
  },
  {
    number: "05",
    title: "Learn Faster",
    description: "Flashcards, quizzes, learning paths, and daily digests accelerate your retention.",
    color: "#1040C0",
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative bg-[#F0F0F0] border-b-4 border-[#121212] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="border-b-4 border-[#121212] pb-10 mb-16">
          <span className="font-label text-[#1040C0] mb-3 block">How It Works</span>
          <h2
            className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#121212]"
            style={{ lineHeight: "0.92" }}
          >
            From Upload
            <br />
            to <span className="text-[#1040C0]">Mastery.</span>
          </h2>
        </div>

        {/* Steps — Bauhaus grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 border-l-4 border-t-4 border-[#121212]">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
              className="border-r-4 border-b-4 border-[#121212] bg-white group hover:-translate-y-1 transition-transform duration-200 flex flex-col"
            >
              {/* Step number — 45 degree rotated container */}
              <div
                className="flex items-center justify-center p-5 border-b-4 border-[#121212]"
                style={{ background: step.color }}
              >
                <div
                  className="w-14 h-14 border-4 border-white flex items-center justify-center"
                  style={{ transform: "rotate(45deg)" }}
                >
                  <span
                    className="text-white font-black text-lg"
                    style={{ transform: "rotate(-45deg)", fontFamily: "var(--font-outfit)" }}
                  >
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1">
                <h3
                  className="text-[#121212] text-base uppercase mb-3"
                  style={{ fontWeight: 900, letterSpacing: "0.03em" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-[#555] leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
