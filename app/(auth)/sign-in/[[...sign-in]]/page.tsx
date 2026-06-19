import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden aurora-bg">
      {/* Background radial gradient for depth */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md p-8 glass-bright animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-gray-300 flex items-center justify-center mx-auto mb-4 shadow-glow-white">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
            Welcome back
          </h1>
          <p className="text-[#a1a1aa] text-sm">Sign in to Kortex AI to access your second brain</p>
        </div>

        <SignIn
          fallbackRedirectUrl="/dashboard"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none border-0 w-full p-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] border border-[#333] transition-colors duration-300 rounded-xl",
              socialButtonsBlockButtonText: "font-medium text-white",
              dividerLine: "bg-[#333]",
              dividerText: "text-[#71717a] font-medium",
              formFieldLabel: "text-[#a1a1aa] font-medium",
              formFieldInput: "bg-[#0a0a0a] border border-[#333] text-white focus:border-white focus:ring-1 focus:ring-white rounded-xl transition-all",
              formButtonPrimary: "btn-primary w-full bg-white text-black hover:bg-gray-200 transition-colors duration-300 rounded-xl font-semibold",
              footerActionText: "text-[#71717a]",
              footerActionLink: "text-white hover:text-gray-300 font-semibold",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-white hover:text-gray-300",
              formFieldWarningText: "text-[#f59e0b]",
              formFieldErrorText: "text-[#ef4444]",
              logoBox: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
