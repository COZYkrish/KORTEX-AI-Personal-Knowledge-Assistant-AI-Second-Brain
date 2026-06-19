"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { Brain } from "lucide-react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => setScrolled(y > 50));
    return unsubscribe;
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-[#333] py-3"
          : "py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <Brain className="w-4 h-4 text-black" />
          </div>
          <span className="font-display font-bold text-white text-lg">Kortex AI</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-[#a1a1aa]">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
        </div>

        {/* Auth CTA */}
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm text-[#a1a1aa] hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/sign-up">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary text-sm px-5 py-2.5"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
