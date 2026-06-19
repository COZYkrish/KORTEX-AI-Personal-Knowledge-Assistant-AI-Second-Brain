import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kortex AI — Your AI Second Brain",
    template: "%s | Kortex AI",
  },
  description:
    "Upload anything. Remember everything. Understand instantly. Kortex AI is your AI-powered second brain that organizes your knowledge and answers your questions.",
  keywords: [
    "AI second brain",
    "knowledge management",
    "document AI",
    "RAG",
    "flashcards",
    "knowledge graph",
    "AI learning",
  ],
  authors: [{ name: "Kortex AI" }],
  creator: "Kortex AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "Kortex AI — Your AI Second Brain",
    description:
      "Upload anything. Remember everything. Understand instantly.",
    siteName: "Kortex AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kortex AI — Your AI Second Brain",
    description: "Upload anything. Remember everything. Understand instantly.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
