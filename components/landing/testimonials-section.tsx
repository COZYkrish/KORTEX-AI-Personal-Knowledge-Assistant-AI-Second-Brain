"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "PhD Candidate, MIT",
    avatar: "SC",
    text: "Kortex AI completely changed how I manage my research literature. The knowledge graph feature alone saved me 20 hours of manual mapping. The citations in chat are incredibly accurate.",
    accentColor: "#D02020",
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer, Google",
    avatar: "MJ",
    text: "I upload every technical RFC and spec document I encounter. The hybrid search is phenomenal — it finds semantically related content even when I don't use the exact keywords.",
    accentColor: "#1040C0",
  },
  {
    name: "Anika Patel",
    role: "Med Student, Johns Hopkins",
    avatar: "AP",
    text: "The spaced repetition flashcards generated from my lecture notes are better than what I'd create manually. My retention scores went up 40% in 3 weeks.",
    accentColor: "#F0C020",
  },
  {
    name: "David Kim",
    role: "Founder, EdTech Startup",
    avatar: "DK",
    text: "We use Kortex AI as our team's shared knowledge base. The workspace collaboration features and the daily digest keep everyone aligned without endless meetings.",
    accentColor: "#D02020",
  },
  {
    name: "Emma Thompson",
    role: "Research Analyst",
    avatar: "ET",
    text: "The research agent's document comparison feature is unlike anything else. It found contradictions between two papers I'd read separately but never connected.",
    accentColor: "#1040C0",
  },
  {
    name: "James Wu",
    role: "Law Student, Harvard",
    avatar: "JW",
    text: "Reading case law is exhausting. Kortex AI's voice interface lets me listen to summaries while commuting. The quiz generator tests my actual legal reasoning, not just memorization.",
    accentColor: "#F0C020",
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative bg-[#1040C0] border-b-4 border-[#121212] py-24 px-6 overflow-hidden">
      {/* Dot grid on blue */}
      <div className="absolute inset-0 bg-dot-grid-white opacity-10" />
      {/* Decorative shapes */}
      <div className="absolute -right-24 top-12 w-64 h-64 border-4 border-white opacity-10" style={{ transform: "rotate(45deg)" }} />
      <div className="absolute -left-16 bottom-12 w-40 h-40 rounded-full border-4 border-white opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b-4 border-white pb-10 mb-16">
          <span className="font-label text-[#F0C020] mb-3 block">Testimonials</span>
          <h2
            className="font-display text-5xl sm:text-6xl lg:text-7xl text-white"
            style={{ lineHeight: "0.92" }}
          >
            Loved by
            <br />
            <span className="text-[#F0C020]">Learners.</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l-4 border-t-4 border-white">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              className="bg-white border-r-4 border-b-4 border-white p-6 group hover:-translate-y-1 transition-transform duration-200"
            >
              {/* Quote */}
              <p className="text-sm text-[#333] leading-relaxed font-medium mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 border-t-2 border-[#e0e0e0] pt-4">
                {/* Avatar — circular, grayscale, color on hover */}
                <div
                  className="w-12 h-12 rounded-full border-4 border-[#121212] flex items-center justify-center text-sm font-black text-white flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300"
                  style={{ background: testimonial.accentColor }}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-sm font-black text-[#121212] uppercase tracking-wider">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-[#888] font-medium mt-0.5">{testimonial.role}</div>
                </div>
                {/* Color dot accent */}
                <div
                  className="ml-auto w-4 h-4 border-2 border-[#121212] flex-shrink-0"
                  style={{ background: testimonial.accentColor }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
