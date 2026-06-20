"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { B, btnPrimaryStyle, btnOutlineStyle } from "@/lib/bauhaus";

export function HeroSection() {
  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{
        minHeight: "min(860px, 100vh)",
        background: B.CANVAS,
        borderBottom: "3px solid #121212",
        paddingTop: 72,
      }}
    >
      {/* Dot Grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />

      {/* ── Main Split ── */}
      <div className="site-shell relative z-10 flex-1 grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,44%)] gap-8 lg:gap-0 items-stretch">

        {/* LEFT — Typography & CTA */}
        <div
          className="flex flex-col justify-center py-16 lg:py-20"
          style={{ maxWidth: 680 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-8 inline-block"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-2"
              style={{
                background: B.YELLOW,
                border: B.border2,
                boxShadow: B.shadowSm,
                ...B.labelStyle,
                color: B.BLACK,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: B.BLACK, display: "inline-block" }} />
              Powered by Gemini 2.5 Flash
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="mb-6"
            style={{
              ...B.displayStyle,
              fontSize: "clamp(3rem, 8vw, 6.25rem)",
              color: B.BLACK,
            }}
          >
            Your
            <br />
            <span style={{ color: B.RED }}>Second</span>
            <br />
            Brain.
          </motion.h1>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="mb-8 max-w-xl"
            style={{
              fontFamily: "'Outfit', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: B.BLACK,
              lineHeight: 1.6,
            }}
          >
            Upload any document. Ask questions with AI. Build your knowledge
            graph. Remember everything — forever.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <Link href="/sign-up" id="hero-cta-primary">
              <button
                className="bau-button px-6 py-3"
                style={{
                  ...B.bodyBoldStyle,
                  fontSize: "0.9rem",
                  background: B.RED,
                  color: "#fff",
                  border: B.border2,
                  ...btnPrimaryStyle,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#b01a1a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = B.RED)}
              >
                Start Building Free
                <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="#features" id="hero-cta-secondary">
              <button
                className="bau-button px-6 py-3"
                style={{
                  ...B.bodyBoldStyle,
                  fontSize: "0.9rem",
                  background: "#fff",
                  color: B.BLACK,
                  border: B.border2,
                  ...btnOutlineStyle,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#e8e8e8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                See Features
              </button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6"
          >
            {[
              { label: "Free to Start",    color: B.RED    },
              { label: "No Credit Card",   color: B.BLUE   },
              { label: "AI-Powered",       color: B.YELLOW },
            ].map((badge) => (
              <span key={badge.label} className="flex items-center gap-2" style={{ ...B.labelStyle, color: B.BLACK }}>
                <span style={{ width: 10, height: 10, background: badge.color, border: B.border2, display: "inline-block" }} />
                {badge.label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Blue Bauhaus Composition */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="hidden lg:flex items-center justify-center relative overflow-hidden"
          style={{
            background: B.BLUE,
            borderLeft: "3px solid #121212",
            minHeight: 520,
          }}
        >
          <div className="absolute inset-0 bg-dot-grid-white opacity-20 pointer-events-none" />
          {/* Outer decorative circles */}
          <div style={{ position: "absolute", bottom: -80, right: -80, width: 280, height: 280, borderRadius: "50%", border: "4px solid rgba(255,255,255,0.15)" }} />
          <div style={{ position: "absolute", top: -40, left: -40, width: 160, height: 160, borderRadius: "50%", border: "4px solid rgba(255,255,255,0.15)" }} />

          <div className="relative z-10 flex flex-col items-center gap-8 px-10">
            {/* Central geometric composition */}
            <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
              {/* Large circle */}
              <div style={{ position: "absolute", width: 260, height: 260, borderRadius: "50%", border: "4px solid rgba(255,255,255,0.9)" }} />
              {/* Rotated square */}
              <div style={{ position: "absolute", width: 150, height: 150, border: "4px solid rgba(255,255,255,0.9)", transform: "rotate(45deg)" }} />
              {/* Inner white square */}
              <div style={{ position: "relative", width: 64, height: 64, background: "white", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 24, height: 24, background: B.BLUE }} />
              </div>
              {/* Red circle accent */}
              <div style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: B.RED, border: "4px solid white" }} />
              {/* Yellow square accent */}
              <div style={{ position: "absolute", bottom: 8, left: 8, width: 24, height: 24, background: B.YELLOW, border: "4px solid white" }} />
            </div>

            {/* Feature pills */}
            <div className="w-full flex flex-col gap-3">
              {[
                { label: "AI Knowledge Graph",  bg: B.YELLOW, color: B.BLACK },
                { label: "Hybrid RAG Search",   bg: B.RED,    color: "#fff"  },
                { label: "Spaced Repetition",   bg: "white",  color: B.BLACK },
              ].map((pill) => (
                <div
                  key={pill.label}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{
                    ...B.labelStyle,
                    background: pill.bg,
                    color: pill.color,
                    border: "2px solid rgba(255,255,255,0.9)",
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", border: `2px solid currentColor`, display: "inline-block", flexShrink: 0 }} />
                  {pill.label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Stats Bar ── */}
      <div
        className="relative z-10"
        style={{ background: B.BLACK, borderTop: "3px solid #121212" }}
      >
        <div className="site-shell grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#333]">
          {[
            { value: "10+",  label: "AI Features"     },
            { value: "500MB", label: "Document Limit" },
            { value: "100%", label: "Privacy First"   },
          ].map((stat) => (
            <div key={stat.label} className="py-4 text-center">
              <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem, 4vw, 2rem)", color: "white", textTransform: "uppercase", letterSpacing: 0 }}>
                {stat.value}
              </div>
              <div style={{ ...B.labelStyle, color: "#a1a1aa" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
