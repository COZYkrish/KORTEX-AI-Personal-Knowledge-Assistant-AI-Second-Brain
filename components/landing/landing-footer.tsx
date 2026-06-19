import Link from "next/link";
import { Brain, ExternalLink } from "lucide-react";



export function LandingFooter() {
  return (
    <footer className="border-t border-[#333] py-16 px-6 bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Brain className="w-4 h-4 text-black" />
            </div>
            <span className="font-display font-bold text-white">Kortex AI</span>
          </div>
          <p className="text-sm text-[#71717a]">
            Your AI Second Brain. Upload anything, remember everything, understand instantly.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="https://github.com" className="text-[#71717a] hover:text-white transition-colors">
              <ExternalLink className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" className="text-[#71717a] hover:text-white transition-colors">
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Product */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm">Product</h4>
          <ul className="space-y-2 text-sm text-[#71717a]">
            {["Features", "Pricing", "Changelog", "Roadmap"].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-white transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-[#71717a]">
            {["About", "Blog", "Careers", "Contact"].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-white transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm">Legal</h4>
          <ul className="space-y-2 text-sm text-[#71717a]">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-white transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#222] flex flex-col md:flex-row items-center justify-between text-sm text-[#71717a]">
        <span>© 2024 Kortex AI. All rights reserved.</span>
        <span>Built with ❤️ using Gemini 2.5 Flash & Next.js 15</span>
      </div>
    </footer>
  );
}
