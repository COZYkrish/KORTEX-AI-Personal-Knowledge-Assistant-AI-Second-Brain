"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    color: "#a1a1aa",
    features: [
      "5 Documents",
      "100 AI Chat Messages / month",
      "Basic Knowledge Graph",
      "50 Flashcards",
      "Community Support",
    ],
    cta: "Get Started Free",
    href: "/sign-up",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    description: "For serious learners and researchers",
    color: "#ffffff",
    features: [
      "Unlimited Documents",
      "Unlimited AI Chat",
      "Full Knowledge Graph + Universe",
      "Unlimited Flashcards & Quizzes",
      "Voice AI Assistant",
      "Learning Paths",
      "Daily Digest",
      "Priority Support",
    ],
    cta: "Start Pro Trial",
    href: "/sign-up?plan=pro",
    popular: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/ month",
    description: "For teams and organizations",
    color: "#a1a1aa",
    features: [
      "Everything in Pro",
      "5 Team Members",
      "Shared Workspaces",
      "Role-Based Access Control",
      "Team Analytics",
      "API Access",
      "Dedicated Support",
    ],
    cta: "Start Team Trial",
    href: "/sign-up?plan=team",
    popular: false,
  },
];

export function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="pricing" ref={ref} className="relative py-32 px-6 overflow-hidden bg-black">
      {/* Background border top */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#71717a] uppercase tracking-widest mb-4 block">
            Pricing
          </span>
          <h2 className="font-display text-5xl font-bold mb-4 text-white">
            Simple, Transparent{" "}
            <span className="text-[#a1a1aa]">Pricing</span>
          </h2>
          <p className="text-xl text-[#a1a1aa]">
            Start free. Scale when you&apos;re ready.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-2xl p-8 transition-colors duration-300 ${
                plan.popular
                  ? "bg-[#0a0a0a] border-2 border-white"
                  : "bg-[#0a0a0a] border border-[#222] hover:border-[#444]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white text-black">
                    <Zap className="w-3 h-3 fill-black" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-[#71717a] mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: plan.color }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-[#71717a] text-sm">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                    <Check className="w-4 h-4 shrink-0" style={{ color: plan.color }} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
                  style={
                    plan.popular
                      ? {
                          background: "#ffffff",
                          color: "#000000",
                        }
                      : {
                          background: "#111111",
                          border: `1px solid #333`,
                          color: "#ffffff",
                        }
                  }
                >
                  {plan.cta}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
