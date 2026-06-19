"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(#333 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#333] bg-[#0a0a0a] mb-8 text-sm text-[#a1a1aa]"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Powered by Gemini 2.5 Flash</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 tracking-tight text-white"
        >
          Your Second Brain
          <br />
          <span className="text-[#a1a1aa]">Has Arrived.</span>
        </motion.h1>

        {/* Subheadline (fixed alignment) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-xl md:text-2xl text-[#a1a1aa] mb-10"
        >
          <span>Upload anything.</span>
          <span className="hidden md:inline text-[#333]">•</span>
          <span>Remember everything.</span>
          <span className="hidden md:inline text-[#333]">•</span>
          <span>Understand instantly.</span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full"
        >
          <Link href="/sign-up" id="hero-cta-primary">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary text-base px-8 py-4"
            >
              Start Building Your Knowledge Base
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link href="#features" id="hero-cta-secondary">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="glass px-8 py-4 rounded-xl text-base font-medium text-[#a1a1aa] hover:text-white transition-all bg-[#0a0a0a]"
            >
              See How It Works
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-16 flex items-center justify-center gap-8 text-sm text-[#71717a]"
        >
          <span>✓ Free to start</span>
          <span>✓ No credit card required</span>
          <span>✓ AI-powered</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-[#333] flex items-center justify-center"
        >
          <div className="w-1 h-2 rounded-full bg-[#71717a]" />
        </motion.div>
        <span className="text-xs text-[#71717a]">Scroll to explore</span>
      </motion.div>
    </section>
  );
}
