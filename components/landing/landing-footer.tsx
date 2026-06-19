import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-[#121212] border-t-4 border-[#121212] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-2 border-[#333] mb-0">
          {/* Brand */}
          <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-[#333]">
            {/* Geometric logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-[#D02020] border-2 border-[#333]" />
                <div className="w-4 h-4 bg-[#1040C0] border-2 border-[#333]" />
                <div
                  className="w-4 h-4 bg-[#F0C020] border-2 border-[#333]"
                  style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                />
              </div>
              <span className="font-black uppercase text-white text-sm tracking-tight">Kortex AI</span>
            </div>
            <p className="text-sm text-[#888] font-medium leading-relaxed">
              Your AI Second Brain. Upload anything, remember everything, understand instantly.
            </p>
          </div>

          {/* Product */}
          <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-[#333]">
            <h4 className="font-label text-[#F0C020] mb-5">Product</h4>
            <ul className="space-y-3">
              {["Features", "Pricing", "Changelog", "Roadmap"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-[#888] hover:text-white font-medium transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="p-8 border-b-2 md:border-b-0 md:border-r-2 border-[#333]">
            <h4 className="font-label text-[#F0C020] mb-5">Company</h4>
            <ul className="space-y-3">
              {["About", "Blog", "Careers", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-[#888] hover:text-white font-medium transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="p-8">
            <h4 className="font-label text-[#F0C020] mb-5">Legal</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-[#888] hover:text-white font-medium transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-2 border-t-0 border-[#333] flex flex-col md:flex-row items-center justify-between px-8 py-5 gap-4">
          <span className="text-sm text-[#666] font-medium">
            © 2024 Kortex AI. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#666] font-medium">Built with Gemini 2.5 Flash & Next.js</span>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#D02020]" />
              <div className="w-3 h-3 bg-[#1040C0]" />
              <div className="w-3 h-3 bg-[#F0C020]" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
