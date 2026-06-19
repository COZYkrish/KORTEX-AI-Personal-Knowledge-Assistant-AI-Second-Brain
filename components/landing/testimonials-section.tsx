"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "PhD Candidate, MIT",
    avatar: "SC",
    text: "Kortex AI completely changed how I manage my research literature. The knowledge graph feature alone saved me 20 hours of manual mapping. The citations in chat are incredibly accurate.",
    stars: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer, Google",
    avatar: "MJ",
    text: "I upload every technical RFC and spec document I encounter. The hybrid search is phenomenal — it finds semantically related content even when I don't use the exact keywords.",
    stars: 5,
  },
  {
    name: "Anika Patel",
    role: "Med Student, Johns Hopkins",
    avatar: "AP",
    text: "The spaced repetition flashcards generated from my lecture notes are better than what I'd create manually. My retention scores went up 40% in 3 weeks.",
    stars: 5,
  },
  {
    name: "David Kim",
    role: "Founder, EdTech Startup",
    avatar: "DK",
    text: "We use Kortex AI as our team's shared knowledge base. The workspace collaboration features and the daily digest keep everyone aligned without endless meetings.",
    stars: 5,
  },
  {
    name: "Emma Thompson",
    role: "Research Analyst",
    avatar: "ET",
    text: "The research agent's document comparison feature is unlike anything else. It found contradictions between two papers I'd read separately but never connected.",
    stars: 5,
  },
  {
    name: "James Wu",
    role: "Law Student, Harvard",
    avatar: "JW",
    text: "Reading case law is exhausting. Kortex AI's voice interface lets me listen to summaries while commuting. The quiz generator tests my actual legal reasoning, not just memorization.",
    stars: 5,
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Background border top */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#71717a] uppercase tracking-widest mb-4 block">
            Testimonials
          </span>
          <h2 className="font-display text-5xl font-bold text-white">
            Loved by Students,{" "}
            <span className="text-[#a1a1aa]">Researchers & Builders</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-[#0a0a0a] border border-[#222] p-6 cursor-default rounded-xl hover:border-[#444] transition-colors duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.stars }).map((_, si) => (
                  <Star
                    key={si}
                    className="w-4 h-4 fill-white text-white"
                  />
                ))}
              </div>

              <p className="text-[#a1a1aa] text-sm leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-[#222] text-white border border-[#333]"
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-[#71717a]">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
