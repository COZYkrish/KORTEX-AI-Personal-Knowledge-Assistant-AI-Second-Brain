import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "700", "900"],
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
    description: "Upload anything. Remember everything. Understand instantly.",
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
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
        >
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
