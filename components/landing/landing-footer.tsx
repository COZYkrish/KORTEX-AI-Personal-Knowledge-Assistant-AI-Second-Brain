import Link from "next/link";
import { B } from "@/lib/bauhaus";

export function LandingFooter() {
  const geo = (
    <div className="flex items-center gap-1">
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: B.RED,    border: "2px solid #333" }} />
      <div style={{ width: 12, height: 12,                       background: B.BLUE,   border: "2px solid #333" }} />
      <div style={{ width: 12, height: 12,                       background: B.YELLOW, border: "2px solid #333", clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
    </div>
  );

  return (
    <footer style={{ background: B.BLACK, borderTop: `4px solid ${B.BLACK}` }}>
      <div className="max-w-7xl mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4" style={{ border: "2px solid #333" }}>
          {/* Brand */}
          <div style={{ padding: "2rem", borderRight: "2px solid #333", borderBottom: "2px solid #333" }}>
            <div className="flex items-center gap-2 mb-4">
              {geo}
              <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, textTransform: "uppercase", color: "white", fontSize: "0.85rem", letterSpacing: "0.05em" }}>
                Kortex AI
              </span>
            </div>
            <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.82rem", color: "#888", lineHeight: 1.6 }}>
              Your AI Second Brain. Upload anything, remember everything, understand instantly.
            </p>
          </div>

          {/* Product */}
          <div style={{ padding: "2rem", borderRight: "2px solid #333", borderBottom: "2px solid #333" }}>
            <h4 style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.7rem", color: B.YELLOW, marginBottom: 20 }}>Product</h4>
            <ul className="space-y-3">
              {["Features", "Pricing", "Changelog", "Roadmap"].map((link) => (
                <li key={link}>
                  <a href="#" style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.85rem", color: "#888", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div style={{ padding: "2rem", borderRight: "2px solid #333", borderBottom: "2px solid #333" }}>
            <h4 style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.7rem", color: B.YELLOW, marginBottom: 20 }}>Company</h4>
            <ul className="space-y-3">
              {["About", "Blog", "Careers", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.85rem", color: "#888", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div style={{ padding: "2rem", borderBottom: "2px solid #333" }}>
            <h4 style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.7rem", color: B.YELLOW, marginBottom: 20 }}>Legal</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map((link) => (
                <li key={link}>
                  <a href="#" style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.85rem", color: "#888", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between px-8 py-5 gap-4" style={{ borderTop: "2px solid #333", borderLeft: "2px solid #333", borderRight: "2px solid #333", borderBottom: "2px solid #333" }}>
          <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.82rem", color: "#666" }}>
            © 2024 Kortex AI. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.82rem", color: "#666" }}>
              Built with Gemini 2.5 Flash & Next.js
            </span>
            {geo}
          </div>
        </div>
      </div>
    </footer>
  );
}
