"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[#F0F0F0] border-b-4 border-[#121212]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo — Three Bauhaus geometric shapes */}
        <Link href="/" className="flex items-center gap-3" id="nav-logo">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-[#D02020] border-2 border-[#121212]" />
            <div className="w-4 h-4 bg-[#1040C0] border-2 border-[#121212]" />
            <div
              className="w-4 h-4 bg-[#F0C020] border-2 border-[#121212]"
              style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
            />
          </div>
          <span
            className="text-[#121212] text-xl tracking-tight"
            style={{ fontWeight: 900, textTransform: "uppercase" }}
          >
            Kortex AI
          </span>
        </Link>

        {/* Nav Links — Desktop */}
        <div className="hidden md:flex items-center gap-0">
          {["Features", "Pricing", "Docs"].map((item) => (
            <Link
              key={item}
              href={item === "Features" ? "#features" : item === "Pricing" ? "#pricing" : "/docs"}
              className="px-5 py-4 font-bold uppercase tracking-wider text-sm text-[#121212] hover:bg-[#121212] hover:text-[#F0F0F0] transition-colors duration-200 border-l-2 border-[#121212] first:border-l-0"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            id="nav-sign-in"
            className="font-bold uppercase tracking-wider text-sm text-[#121212] hover:text-[#D02020] transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link href="/sign-up" id="nav-get-started">
            <button className="btn-primary text-sm px-6 py-3">
              Get Started
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 border-2 border-[#121212]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-[#121212] transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#121212] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#121212] transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#F0F0F0] border-b-4 border-[#121212]">
          <div className="flex flex-col border-t-2 border-[#121212]">
            {["Features", "Pricing", "Sign In"].map((item) => (
              <Link
                key={item}
                href={item === "Features" ? "#features" : item === "Pricing" ? "#pricing" : "/sign-in"}
                className="px-6 py-4 font-bold uppercase tracking-wider text-sm text-[#121212] hover:bg-[#121212] hover:text-[#F0F0F0] border-b-2 border-[#121212] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="p-4">
              <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
                <button className="btn-primary w-full text-sm">Get Started Free</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
