"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative bg-[#F0C020] border-b-4 border-[#121212] py-32 px-6 overflow-hidden">
      {/* Background dot grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-15" />

      {/* Decorative shapes — large geometric at corners */}
      <div className="absolute -left-24 -top-24 w-64 h-64 rounded-full border-4 border-[#121212] opacity-30" />
      <div
        className="absolute -right-16 -bottom-16 w-48 h-48 border-4 border-[#121212] opacity-30"
        style={{ transform: "rotate(45deg)", background: "transparent" }}
      />
      <div className="absolute right-32 top-16 w-20 h-20 bg-[#D02020] border-4 border-[#121212] opacity-50" />
      <div className="absolute left-40 bottom-16 w-14 h-14 rounded-full bg-[#1040C0] border-4 border-[#121212] opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 text-center max-w-5xl mx-auto"
      >
        <span className="font-label text-[#D02020] mb-6 block">Start Today — It&apos;s Free</span>

        <h2
          className="font-display text-6xl sm:text-7xl lg:text-8xl text-[#121212] mb-10"
          style={{ lineHeight: "0.92" }}
        >
          Never Lose
          <br />
          An <span className="text-[#1040C0]">Idea</span>
          <br />
          Again.
        </h2>

        <p className="text-xl text-[#121212] font-medium mb-12 max-w-2xl mx-auto">
          Join thousands of students, researchers, and professionals who have
          transformed how they learn and think. Your second brain is waiting.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/sign-up" id="final-cta-button">
            <button className="btn-primary text-base px-10 py-5">
              Build Your Second Brain — Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <Link href="/sign-in">
            <button className="btn-outline text-base px-10 py-5">
              Sign In
            </button>
          </Link>
        </div>

        {/* Feature ticks */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 font-label text-[#121212]">
          {["No Credit Card Required", "Free Plan Forever", "AI-Powered"].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#121212] border-2 border-[#121212]" />
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
