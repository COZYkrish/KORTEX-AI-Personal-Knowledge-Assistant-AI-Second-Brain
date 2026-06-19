"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
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
    bg: "#F0F0F0",
    border: "#121212",
    checkColor: "#1040C0",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    description: "For serious learners and researchers",
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
    bg: "#121212",
    border: "#121212",
    checkColor: "#F0C020",
  },
  {
    name: "Team",
    price: "$49",
    period: "/ month",
    description: "For teams and organizations",
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
    bg: "#F0F0F0",
    border: "#121212",
    checkColor: "#D02020",
  },
];

export function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="pricing" ref={ref} className="relative bg-[#F0C020] border-b-4 border-[#121212] py-24 px-6 overflow-hidden">
      {/* Background dot grid on yellow */}
      <div className="absolute inset-0 bg-dot-grid opacity-10" />

      {/* Decorative shapes */}
      <div className="absolute right-12 top-12 w-32 h-32 rounded-full border-4 border-[#121212] opacity-20" />
      <div className="absolute left-8 bottom-8 w-24 h-24 border-4 border-[#121212] opacity-20" style={{ transform: "rotate(45deg)" }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-b-4 border-[#121212] pb-10 mb-16">
          <span className="font-label text-[#D02020] mb-3 block">Pricing</span>
          <h2
            className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#121212]"
            style={{ lineHeight: "0.92" }}
          >
            Simple,
            <br />
            <span className="text-[#1040C0]">Transparent.</span>
          </h2>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l-4 border-t-4 border-[#121212]">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
              className="border-r-4 border-b-4 border-[#121212] flex flex-col"
              style={{ background: plan.bg }}
            >
              {/* Plan header */}
              <div className={`p-6 border-b-4 border-[#121212] ${plan.popular ? "bg-[#D02020]" : ""}`}>
                {plan.popular && (
                  <span className="font-label text-white mb-2 block">★ Most Popular</span>
                )}
                <h3
                  className={`text-2xl mb-1 uppercase ${plan.popular ? "text-white" : "text-[#121212]"}`}
                  style={{ fontWeight: 900, letterSpacing: "-0.01em" }}
                >
                  {plan.name}
                </h3>
                <p className={`text-sm font-medium mb-4 ${plan.popular ? "text-white opacity-80" : "text-[#888]"}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl font-black ${plan.popular ? "text-white" : "text-[#121212]"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm font-bold ${plan.popular ? "text-white opacity-70" : "text-[#888]"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="p-6 flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-center gap-3 text-sm font-medium ${plan.popular ? "text-white" : "text-[#121212]"}`}
                    >
                      <Check
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: plan.popular ? "#F0C020" : plan.checkColor }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="p-6 border-t-4 border-[#121212]">
                <Link href={plan.href}>
                  <button
                    className={`w-full py-4 font-black uppercase tracking-wider text-sm border-2 border-[#121212] transition-all duration-200 hover:translate-y-[-2px] active:translate-y-[2px] ${
                      plan.popular
                        ? "bg-[#F0C020] text-[#121212] shadow-hard-white"
                        : "bg-[#121212] text-white shadow-hard"
                    }`}
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
