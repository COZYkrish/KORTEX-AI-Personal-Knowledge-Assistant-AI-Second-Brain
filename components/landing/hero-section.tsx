"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#F0F0F0] border-b-4 border-[#121212] pt-16">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 bg-dot-grid opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-stretch flex-1 w-full gap-0">

        {/* LEFT PANEL — Typography & CTA */}
        <div className="flex-1 flex flex-col justify-center py-20 lg:pr-12 lg:border-r-4 lg:border-[#121212]">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 bg-[#F0C020] border-2 border-[#121212] px-4 py-2 shadow-hard font-label text-[#121212]">
              <span className="w-2 h-2 rounded-full bg-[#121212]" />
              Powered by Gemini 2.5 Flash
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="font-display text-5xl sm:text-7xl lg:text-8xl text-[#121212] mb-6"
            style={{ lineHeight: "0.92" }}
          >
            Your
            <br />
            <span className="text-[#D02020]">Second</span>
            <br />
            Brain.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-[#121212] font-medium max-w-lg mb-10 leading-relaxed"
          >
            Upload any document. Ask questions with AI. Build your knowledge
            graph. Remember everything — forever.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/sign-up" id="hero-cta-primary">
              <button className="btn-primary text-base px-8 py-4">
                Start Building Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="#features" id="hero-cta-secondary">
              <button className="btn-outline text-base px-8 py-4">
                See Features
              </button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6 mt-10 font-label text-[#121212]"
          >
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#D02020] border-2 border-[#121212]" />
              Free to Start
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#1040C0] border-2 border-[#121212]" />
              No Credit Card
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#F0C020] border-2 border-[#121212]" />
              AI-Powered
            </span>
          </motion.div>
        </div>

        {/* RIGHT PANEL — Bauhaus Blue Geometric Composition */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="hidden lg:flex lg:w-[480px] bg-[#1040C0] border-l-0 items-center justify-center relative overflow-hidden"
        >
          {/* Background dot grid for the blue panel */}
          <div className="absolute inset-0 bg-dot-grid-white opacity-20" />

          {/* Large background circle — decorative */}
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full border-4 border-white opacity-20" />
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full border-4 border-white opacity-20" />

          {/* Central geometric composition */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Large outer circle */}
            <div className="relative w-64 h-64 rounded-full border-4 border-white flex items-center justify-center">
              {/* Inner rotated square */}
              <div
                className="w-40 h-40 border-4 border-white flex items-center justify-center"
                style={{ transform: "rotate(45deg)" }}
              >
                {/* Inner shape counter-rotated */}
                <div
                  className="w-20 h-20 bg-white flex items-center justify-center"
                  style={{ transform: "rotate(-45deg)" }}
                >
                  <div className="w-8 h-8 bg-[#1040C0]" />
                </div>
              </div>

              {/* Red circle top-right */}
              <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-[#D02020] border-4 border-white" />
              {/* Yellow square bottom-left */}
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-[#F0C020] border-4 border-white" />
            </div>

            {/* Feature Pills */}
            <div className="flex flex-col gap-3 w-full px-4">
              {[
                { label: "AI Knowledge Graph", color: "#F0C020", textColor: "#121212" },
                { label: "Hybrid RAG Search", color: "#D02020", textColor: "#ffffff" },
                { label: "Spaced Repetition", color: "#ffffff", textColor: "#121212" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-3 border-2 border-white font-bold uppercase tracking-wider text-sm"
                  style={{ background: item.color, color: item.textColor }}
                >
                  <span className="w-2 h-2 rounded-full border-2 border-current flex-shrink-0" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom — Stats bar */}
      <div className="relative z-10 border-t-4 border-[#121212] bg-[#121212]">
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x-2 divide-[#333]">
          {[
            { value: "10+", label: "AI Features" },
            { value: "500MB", label: "Document Limit" },
            { value: "100%", label: "Privacy First" },
          ].map((stat) => (
            <div key={stat.label} className="px-8 py-3 sm:py-0 text-center">
              <div className="text-3xl font-black text-white uppercase">{stat.value}</div>
              <div className="font-label text-[#a1a1aa]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
