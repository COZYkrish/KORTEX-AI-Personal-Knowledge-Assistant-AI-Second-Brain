"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-40 px-6 overflow-hidden bg-black">
      {/* Background border top */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent" />

      {/* Rotating ring decoration - monochrome */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#222]"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#333]"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#333] bg-[#0a0a0a] mb-8 text-sm text-[#a1a1aa]"
        >
          <Sparkles className="w-4 h-4 text-white" />
          Start your journey today
        </motion.div>

        <h2 className="font-display text-6xl md:text-7xl font-bold leading-tight mb-8 text-white tracking-tight">
          Never Lose An Idea
          <br />
          <span className="text-[#a1a1aa]">Again.</span>
        </h2>

        <p className="text-xl text-[#71717a] mb-12 max-w-2xl mx-auto">
          Join thousands of students, researchers, and professionals who have
          transformed how they learn and think. Your second brain is waiting.
        </p>

        <Link href="/sign-up" id="final-cta-button">
          <motion.button
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary text-lg px-10 py-5 bg-white text-black font-semibold rounded-xl"
            style={{
              boxShadow: "0 0 40px rgba(255,255,255,0.1), 0 0 80px rgba(255,255,255,0.05)",
            }}
          >
            Build Your Second Brain — Free
            <ArrowRight className="w-5 h-5 ml-2 inline-block" />
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}
