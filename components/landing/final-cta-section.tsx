"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { B } from "@/lib/bauhaus";

export function FinalCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-32 px-8"
      style={{ background: B.YELLOW, borderBottom: B.border4 }}
    >
      <div className="absolute inset-0 bg-dot-grid opacity-15 pointer-events-none" />
      <div style={{ position: "absolute", left: -80, top: -80, width: 256, height: 256, borderRadius: "50%", border: `4px solid ${B.BLACK}`, opacity: 0.25 }} />
      <div style={{ position: "absolute", right: -48, bottom: -48, width: 192, height: 192, border: `4px solid ${B.BLACK}`, opacity: 0.25, transform: "rotate(45deg)" }} />
      <div style={{ position: "absolute", right: 128, top: 64, width: 64, height: 64, background: B.RED, border: `4px solid ${B.BLACK}`, opacity: 0.5 }} />
      <div style={{ position: "absolute", left: 160, bottom: 64, width: 48, height: 48, borderRadius: "50%", background: B.BLUE, border: `4px solid ${B.BLACK}`, opacity: 0.5 }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 text-center max-w-5xl mx-auto"
      >
        <p style={{ ...B.labelStyle, color: B.RED, marginBottom: 24 }}>Start Today — It&apos;s Free</p>

        <h2 style={{ ...B.displayStyle, fontSize: "clamp(3rem, 9vw, 7rem)", color: B.BLACK, marginBottom: 40 }}>
          Never Lose
          <br />
          An <span style={{ color: B.BLUE }}>Idea</span>
          <br />
          Again.
        </h2>

        <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "1.1rem", color: B.BLACK, lineHeight: 1.7, marginBottom: 48, maxWidth: 560, margin: "0 auto 48px" }}>
          Join thousands of students, researchers, and professionals who have transformed how they learn and think. Your second brain is waiting.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
          <Link href="/sign-up" id="final-cta-button">
            <button
              className="inline-flex items-center justify-center gap-2 px-10 py-5 transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px]"
              style={{
                ...B.bodyBoldStyle,
                fontSize: "0.9rem",
                background: B.RED,
                color: "white",
                border: B.border2,
                boxShadow: B.shadowLg,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#b01a1a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = B.RED)}
            >
              Build Your Second Brain — Free
              <ArrowRight size={18} />
            </button>
          </Link>
          <Link href="/sign-in">
            <button
              className="inline-flex items-center justify-center gap-2 px-10 py-5 transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px]"
              style={{
                ...B.bodyBoldStyle,
                fontSize: "0.9rem",
                background: "white",
                color: B.BLACK,
                border: B.border2,
                boxShadow: B.shadowMd,
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {["No Credit Card Required", "Free Plan Forever", "AI-Powered"].map((item) => (
            <span key={item} className="flex items-center gap-2" style={{ ...B.labelStyle, color: B.BLACK }}>
              <span style={{ width: 10, height: 10, background: B.BLACK, display: "inline-block", flexShrink: 0 }} />
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
