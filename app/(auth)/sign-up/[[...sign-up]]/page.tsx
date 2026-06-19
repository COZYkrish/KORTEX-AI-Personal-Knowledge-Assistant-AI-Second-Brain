import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F0F0F0] relative overflow-hidden bg-dot-grid">
      {/* Decorative geometric shapes */}
      <div className="absolute top-8 right-8 w-32 h-32 bg-[#F0C020] border-4 border-[#121212] opacity-30" />
      <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full bg-[#D02020] border-4 border-[#121212] opacity-30" />
      <div
        className="absolute bottom-1/3 right-16 w-20 h-20 bg-[#1040C0] border-4 border-[#121212] opacity-40"
        style={{ transform: "rotate(45deg)" }}
      />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-white border-4 border-[#121212] shadow-hard-lg mx-4">
        {/* Card Header — Red color block */}
        <div className="bg-[#D02020] border-b-4 border-[#121212] p-8">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-white" />
              <div className="w-4 h-4 bg-[#1040C0] border-2 border-white" />
              <div
                className="w-4 h-4 bg-[#F0C020] border-2 border-white"
                style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
              />
            </div>
            <span className="font-black uppercase text-white text-sm tracking-tight">Kortex AI</span>
          </div>
          <h1 className="font-display text-4xl text-white" style={{ lineHeight: "0.92" }}>
            Create
            <br />
            Account.
          </h1>
          <p className="text-white opacity-70 mt-3 font-medium text-sm">
            Join Kortex AI and start building your second brain
          </p>
        </div>

        {/* Clerk Form */}
        <div className="p-8">
          <SignUp
            fallbackRedirectUrl="/dashboard"
            signInUrl="/sign-in"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-0 w-full p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                logoBox: "hidden",
                socialButtonsBlockButton: "bg-[#F0F0F0] text-[#121212] hover:bg-[#e0e0e0] border-2 border-[#121212] transition-colors duration-200 rounded-none font-bold uppercase tracking-wider text-sm shadow-[2px_2px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                socialButtonsBlockButtonText: "font-bold uppercase tracking-wider text-[#121212]",
                dividerLine: "bg-[#e0e0e0]",
                dividerText: "text-[#888] font-bold uppercase tracking-wider text-xs",
                formFieldLabel: "text-[#121212] font-bold uppercase tracking-wider text-xs",
                formFieldInput: "bg-[#F0F0F0] border-2 border-[#121212] text-[#121212] focus:border-[#D02020] rounded-none font-medium",
                formButtonPrimary: "bg-[#D02020] text-white hover:bg-[#b01a1a] border-2 border-[#121212] rounded-none font-black uppercase tracking-wider text-sm shadow-[4px_4px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150",
                footerActionText: "text-[#888] font-medium",
                footerActionLink: "text-[#D02020] hover:text-[#1040C0] font-black uppercase tracking-wider transition-colors",
                identityPreviewText: "text-[#121212] font-bold",
                identityPreviewEditButton: "text-[#D02020] font-bold",
                formFieldWarningText: "text-[#D02020] font-bold",
                formFieldErrorText: "text-[#D02020] font-bold",
                alertText: "text-[#121212] font-medium",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
