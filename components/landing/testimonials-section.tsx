"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { B } from "@/lib/bauhaus";

const ACCENT_COLORS = [B.RED, B.BLUE, B.YELLOW];

const testimonials = [
  { name: "Dr. Sarah Chen",    role: "PhD Candidate, MIT",          avatar: "SC", text: "Kortex AI completely changed how I manage my research literature. The knowledge graph feature alone saved me 20 hours of manual mapping. The citations in chat are incredibly accurate." },
  { name: "Marcus Johnson",    role: "Software Engineer, Google",    avatar: "MJ", text: "I upload every technical RFC and spec document I encounter. The hybrid search is phenomenal — it finds semantically related content even when I don't use the exact keywords." },
  { name: "Anika Patel",       role: "Med Student, Johns Hopkins",   avatar: "AP", text: "The spaced repetition flashcards generated from my lecture notes are better than what I'd create manually. My retention scores went up 40% in 3 weeks." },
  { name: "David Kim",         role: "Founder, EdTech Startup",      avatar: "DK", text: "We use Kortex AI as our team's shared knowledge base. The workspace collaboration features and the daily digest keep everyone aligned without endless meetings." },
  { name: "Emma Thompson",     role: "Research Analyst",             avatar: "ET", text: "The research agent's document comparison feature is unlike anything else. It found contradictions between two papers I'd read separately but never connected." },
  { name: "James Wu",          role: "Law Student, Harvard",         avatar: "JW", text: "Reading case law is exhausting. Kortex AI's voice interface lets me listen to summaries while commuting. The quiz generator tests my actual legal reasoning, not just memorization." },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="landing-section"
      style={{ background: B.BLUE }}
    >
      <div className="absolute inset-0 bg-dot-grid-white opacity-10 pointer-events-none" />
      <div style={{ position: "absolute", right: -80, top: 40, width: 240, height: 240, border: "4px solid rgba(255,255,255,0.1)", transform: "rotate(45deg)" }} />
      <div style={{ position: "absolute", left: -50, bottom: 40, width: 160, height: 160, borderRadius: "50%", border: "4px solid rgba(255,255,255,0.1)" }} />

      <div className="site-shell relative z-10">
        {/* Header */}
        <div className="pb-8 mb-12" style={{ borderBottom: "3px solid rgba(255,255,255,0.4)" }}>
          <p className="section-label" style={{ color: B.YELLOW, marginBottom: 12 }}>Testimonials</p>
          <h2 className="section-heading" style={{ color: "white" }}>
            Loved by
            <br />
            <span style={{ color: B.YELLOW }}>Learners.</span>
          </h2>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ borderLeft: "3px solid white", borderTop: "3px solid white" }}
        >
          {testimonials.map((t, i) => {
            const accentColor = ACCENT_COLORS[i % 3];
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                style={{
                  background: "white",
                  borderRight: "3px solid white",
                  borderBottom: "3px solid white",
                  padding: "1.5rem",
                  transition: "transform 0.2s ease-out",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
              >
                <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.88rem", color: "#333", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: "2px solid #e0e0e0" }}>
                  {/* Avatar — grayscale → color on hover */}
                  <div
                    className="flex items-center justify-center flex-shrink-0 group-hover:grayscale-0"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      border: `4px solid ${B.BLACK}`,
                      background: accentColor,
                      filter: "grayscale(100%)",
                      fontFamily: "'Outfit', system-ui, sans-serif",
                      fontWeight: 900,
                      fontSize: "0.8rem",
                      color: accentColor === B.YELLOW ? B.BLACK : "white",
                      transition: "filter 0.3s",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.filter = "grayscale(0%)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.filter = "grayscale(100%)"; }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, fontSize: "0.78rem", color: B.BLACK, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {t.name}
                    </div>
                    <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.75rem", color: "#888", marginTop: 2 }}>{t.role}</div>
                  </div>
                  <div style={{ marginLeft: "auto", width: 14, height: 14, background: accentColor, border: B.border2, flexShrink: 0 }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
