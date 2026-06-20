"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { B, btnPrimaryStyle } from "@/lib/bauhaus";

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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        backgroundColor: scrolled ? B.CANVAS : "transparent",
        borderBottom: scrolled ? `3px solid ${B.BLACK}` : "none",
      }}
    >
      <div className="site-shell flex items-center justify-between h-18 py-3">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-3" id="nav-logo">
          <div className="flex items-center gap-1">
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: B.RED, border: `2px solid ${B.BLACK}` }} />
            <div style={{ width: 14, height: 14, background: B.BLUE, border: `2px solid ${B.BLACK}` }} />
            <div style={{ width: 14, height: 14, background: B.YELLOW, border: `2px solid ${B.BLACK}`, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
          </div>
          <span style={{ ...B.bodyBoldStyle, fontSize: "1.1rem", color: B.BLACK }}>Kortex AI</span>
        </Link>

        {/* ── Nav Links Desktop ── */}
        <div className="hidden md:flex items-center">
          {[
            { label: "Features", href: "#features" },
            { label: "Pricing",  href: "#pricing" },
            { label: "Docs",     href: "/docs" },
          ].map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-3 transition-colors duration-150"
              style={{
                ...B.bodyBoldStyle,
                color: B.BLACK,
                borderLeft: i > 0 ? `2px solid ${B.BLACK}` : "none",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = B.BLACK; (e.currentTarget as HTMLElement).style.color = B.CANVAS; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = B.BLACK; }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* ── Auth CTA ── */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            id="nav-sign-in"
            style={{ ...B.bodyBoldStyle, color: B.BLACK }}
            className="px-4 py-2 transition-colors hover:text-[#D02020]"
          >
            Sign In
          </Link>
          <Link href="/sign-up" id="nav-get-started">
            <button
              className="bau-button px-5"
              style={{
                ...B.bodyBoldStyle,
                background: B.RED,
                color: "#fff",
                border: `2px solid ${B.BLACK}`,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#b01a1a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = B.RED)}
            >
              Get Started
            </button>
          </Link>
        </div>

        {/* ── Mobile Toggle ── */}
        <button
          className="md:hidden p-2 transition-colors"
          style={{ border: `2px solid ${B.BLACK}`, background: "transparent" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div style={{ width: 20, height: 2, background: B.BLACK, marginBottom: 5, transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none", transition: "all 0.2s" }} />
          <div style={{ width: 20, height: 2, background: B.BLACK, opacity: menuOpen ? 0 : 1, transition: "all 0.2s" }} />
          <div style={{ width: 20, height: 2, background: B.BLACK, marginTop: 5, transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none", transition: "all 0.2s" }} />
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div style={{ background: B.CANVAS, borderBottom: `4px solid ${B.BLACK}`, borderTop: `2px solid ${B.BLACK}` }}>
          {[
            { label: "Features", href: "#features" },
            { label: "Pricing",  href: "#pricing" },
            { label: "Sign In",  href: "/sign-in" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-8 py-4 transition-colors"
              style={{ ...B.bodyBoldStyle, color: B.BLACK, borderBottom: `2px solid ${B.BLACK}` }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="p-6">
            <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
              <button
                className="bau-button w-full py-3"
                style={{ ...B.bodyBoldStyle, background: B.RED, color: "#fff", border: `2px solid ${B.BLACK}`, ...btnPrimaryStyle, cursor: "pointer" }}
              >
                Get Started Free
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
