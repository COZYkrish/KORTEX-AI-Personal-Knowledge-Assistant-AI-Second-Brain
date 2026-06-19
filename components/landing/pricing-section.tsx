"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import { B } from "@/lib/bauhaus";

const plans = [
  {
    name: "Free",   price: "$0",   period: null,     desc: "Perfect for getting started",
    cta: "Get Started Free", href: "/sign-up", popular: false,
    checkColor: B.BLUE,
    features: ["5 Documents", "100 AI Chat Messages / month", "Basic Knowledge Graph", "50 Flashcards", "Community Support"],
  },
  {
    name: "Pro",    price: "$19",  period: "/ month", desc: "For serious learners and researchers",
    cta: "Start Pro Trial", href: "/sign-up?plan=pro", popular: true,
    checkColor: B.YELLOW,
    features: ["Unlimited Documents", "Unlimited AI Chat", "Full Knowledge Graph + Universe", "Unlimited Flashcards & Quizzes", "Voice AI Assistant", "Learning Paths", "Daily Digest", "Priority Support"],
  },
  {
    name: "Team",   price: "$49",  period: "/ month", desc: "For teams and organizations",
    cta: "Start Team Trial", href: "/sign-up?plan=team", popular: false,
    checkColor: B.RED,
    features: ["Everything in Pro", "5 Team Members", "Shared Workspaces", "Role-Based Access Control", "Team Analytics", "API Access", "Dedicated Support"],
  },
];

export function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      id="pricing"
      ref={ref}
      className="relative overflow-hidden py-24 px-8"
      style={{ background: B.YELLOW, borderBottom: B.border4 }}
    >
      <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
      <div style={{ position: "absolute", right: 48, top: 48, width: 120, height: 120, borderRadius: "50%", border: `4px solid ${B.BLACK}`, opacity: 0.2 }} />
      <div style={{ position: "absolute", left: 32, bottom: 32, width: 88, height: 88, border: `4px solid ${B.BLACK}`, opacity: 0.2, transform: "rotate(45deg)" }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="pb-10 mb-16" style={{ borderBottom: B.border4 }}>
          <p style={{ ...B.labelStyle, color: B.RED, marginBottom: 12 }}>Pricing</p>
          <h2 style={{ ...B.displayStyle, fontSize: "clamp(2.5rem, 6vw, 5rem)", color: B.BLACK }}>
            Simple,
            <br />
            <span style={{ color: B.BLUE }}>Transparent.</span>
          </h2>
        </div>

        {/* Plans */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ borderLeft: B.border4, borderTop: B.border4 }}
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
              className="flex flex-col"
              style={{ borderRight: B.border4, borderBottom: B.border4 }}
            >
              {/* Plan header */}
              <div
                style={{
                  padding: "1.75rem",
                  background: plan.popular ? B.BLACK : "white",
                  borderBottom: B.border4,
                }}
              >
                {plan.popular && (
                  <p style={{ ...B.labelStyle, color: B.YELLOW, marginBottom: 8 }}>★ Most Popular</p>
                )}
                <h3 style={{ ...B.displayStyle, fontSize: "1.8rem", color: plan.popular ? "white" : B.BLACK, marginBottom: 4 }}>
                  {plan.name}
                </h3>
                <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.85rem", color: plan.popular ? "rgba(255,255,255,0.7)" : "#888", marginBottom: 16 }}>
                  {plan.desc}
                </p>
                <div className="flex items-baseline gap-1">
                  <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, fontSize: "3rem", color: plan.popular ? "white" : B.BLACK }}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: plan.popular ? "rgba(255,255,255,0.6)" : "#888" }}>
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div style={{ padding: "1.75rem", flex: 1, background: plan.popular ? B.BLACK : "white" }}>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <Check size={14} color={plan.popular ? B.YELLOW : plan.checkColor} style={{ flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.85rem", color: plan.popular ? "rgba(255,255,255,0.9)" : B.BLACK }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div style={{ padding: "1.5rem", borderTop: B.border4, background: plan.popular ? B.BLACK : "white" }}>
                <Link href={plan.href}>
                  <button
                    className="w-full py-4 inline-flex items-center justify-center transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px]"
                    style={{
                      ...B.labelStyle,
                      fontSize: "0.8rem",
                      background: plan.popular ? B.YELLOW : B.BLACK,
                      color: plan.popular ? B.BLACK : "white",
                      border: B.border2,
                      boxShadow: plan.popular ? B.shadowMd : "4px 4px 0px 0px rgba(255,255,255,0.3)",
                      cursor: "pointer",
                    }}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
