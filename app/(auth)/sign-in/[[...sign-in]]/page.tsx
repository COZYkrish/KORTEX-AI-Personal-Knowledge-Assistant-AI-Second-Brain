import { SignIn } from "@clerk/nextjs";
import { B } from "@/lib/bauhaus";

export default function SignInPage() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-dot-grid"
      style={{ background: B.CANVAS }}
    >
      {/* Geometric decorations */}
      <div style={{ position: "absolute", top: 32, left: 32, width: 120, height: 120, background: B.RED,    border: B.border4, opacity: 0.25 }} />
      <div style={{ position: "absolute", bottom: 32, right: 32, width: 96, height: 96, borderRadius: "50%", background: B.BLUE, border: B.border4, opacity: 0.25 }} />
      <div style={{ position: "absolute", top: "33%", right: 64, width: 72, height: 72, background: B.YELLOW, border: B.border4, opacity: 0.35, transform: "rotate(45deg)" }} />

      {/* Card */}
      <div
        className="relative z-10 w-full mx-4"
        style={{ maxWidth: 440, background: "white", border: B.border4, boxShadow: "8px 8px 0px 0px #121212" }}
      >
        {/* Blue header */}
        <div style={{ background: B.BLUE, borderBottom: B.border4, padding: "2rem" }}>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: B.RED,    border: "2px solid white" }} />
              <div style={{ width: 12, height: 12,                       background: "white",  border: "2px solid white" }} />
              <div style={{ width: 12, height: 12,                       background: B.YELLOW, border: "2px solid white", clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
            </div>
            <span style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, textTransform: "uppercase" as const, color: "white", fontSize: "0.85rem", letterSpacing: "0.05em" }}>
              Kortex AI
            </span>
          </div>
          <h1 style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, textTransform: "uppercase" as const, fontSize: "2.8rem", color: "white", lineHeight: 0.92, letterSpacing: "-0.02em" }}>
            Welcome
            <br />
            Back.
          </h1>
          <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.9rem", color: "rgba(255,255,255,0.75)", marginTop: 12 }}>
            Sign in to access your second brain
          </p>
        </div>

        {/* Clerk form */}
        <div style={{ padding: "2rem" }}>
          <SignIn
            fallbackRedirectUrl="/dashboard"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-0 w-full p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                logoBox: "hidden",
                socialButtonsBlockButton: `bg-[#F0F0F0] text-[#121212] hover:bg-[#e0e0e0] border-2 border-[#121212] rounded-none font-bold uppercase tracking-wider text-xs`,
                socialButtonsBlockButtonText: "font-bold uppercase tracking-wider",
                dividerLine: "bg-[#e0e0e0]",
                dividerText: "text-[#888] font-bold uppercase tracking-wider text-xs",
                formFieldLabel: "text-[#121212] font-bold uppercase tracking-wider text-xs",
                formFieldInput: "bg-[#F0F0F0] border-2 border-[#121212] text-[#121212] rounded-none font-medium",
                formButtonPrimary: "bg-[#D02020] text-white hover:bg-[#b01a1a] border-2 border-[#121212] rounded-none font-bold uppercase tracking-wider text-xs",
                footerActionText: "text-[#888] font-medium text-xs",
                footerActionLink: "text-[#1040C0] font-bold uppercase tracking-wider text-xs",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
