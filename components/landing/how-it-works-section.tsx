"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Upload",
    description: "Drag & drop any PDF, DOCX, or TXT file. Our system accepts up to 500MB.",
  },
  {
    number: "02",
    title: "AI Processing",
    description: "Automated pipeline extracts text, generates embeddings, and indexes your knowledge.",
  },
  {
    number: "03",
    title: "Knowledge Extraction",
    description: "The Graph Agent identifies concepts, entities, and their relationships automatically.",
  },
  {
    number: "04",
    title: "Ask Questions",
    description: "Chat with your entire knowledge base using Hybrid RAG with exact source citations.",
  },
  {
    number: "05",
    title: "Learn Faster",
    description: "Flashcards, quizzes, learning paths, and daily digests accelerate your retention.",
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Background border top */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium text-[#71717a] uppercase tracking-widest mb-4 block">
            How It Works
          </span>
          <h2 className="font-display text-5xl font-bold mb-4 text-white">
            From Upload to{" "}
            <span className="text-[#a1a1aa]">Mastery in 5 Steps</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Animated vertical line */}
          <div className="absolute left-[28px] top-0 bottom-0 w-[2px] bg-[#222]">
            <motion.div
              className="w-full bg-white"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="flex gap-8 items-start"
              >
                {/* Step circle */}
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold shrink-0 relative z-10 border-2 bg-black border-[#444] text-white group-hover:border-white transition-colors duration-300"
                >
                  {step.number}
                </motion.div>

                {/* Content */}
                <div className="bg-[#0a0a0a] border border-[#222] p-6 rounded-xl flex-1 group hover:border-[#555] transition-colors duration-300">
                  <h3 className="font-display text-xl font-bold mb-2 text-white">
                    {step.title}
                  </h3>
                  <p className="text-[#a1a1aa]">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
