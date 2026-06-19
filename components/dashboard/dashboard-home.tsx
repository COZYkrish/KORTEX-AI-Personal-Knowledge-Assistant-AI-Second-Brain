"use client";

import { motion } from "framer-motion";
import {
  FileText, MessageSquare, BookOpen, ClipboardList,
  GitBranch, TrendingUp, Flame, Zap,
} from "lucide-react";
import Link from "next/link";
import { B } from "@/lib/bauhaus";

interface DashboardHomeProps {
  userName: string;
}

const ICON_COLORS = [B.RED, B.BLUE, B.YELLOW, B.RED] as const;

const stats = [
  { icon: FileText,      label: "Documents",  value: "0", href: "/dashboard/documents" },
  { icon: MessageSquare, label: "Chats",       value: "0", href: "/dashboard/chat"      },
  { icon: BookOpen,      label: "Flashcards",  value: "0", href: "/dashboard/flashcards"},
  { icon: ClipboardList, label: "Quizzes",     value: "0", href: "/dashboard/quizzes"  },
];

const quickActions = [
  { icon: FileText,  label: "Upload Document",  description: "Add PDFs, DOCX or TXT files",      href: "/dashboard/documents"      },
  { icon: MessageSquare, label: "Start AI Chat", description: "Chat with your knowledge base",   href: "/dashboard/chat"           },
  { icon: GitBranch, label: "Knowledge Graph",  description: "Explore your concept universe",     href: "/dashboard/knowledge-graph"},
  { icon: Zap,       label: "Quick Quiz",        description: "Test your knowledge now",          href: "/dashboard/quizzes"        },
];

export function DashboardHome({ userName }: DashboardHomeProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="pb-6"
        style={{ borderBottom: B.border4 }}
      >
        <h1 style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, textTransform: "uppercase" as const, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 0.92, color: B.BLACK, letterSpacing: "-0.02em" }}>
          Good Day,
          <br />
          <span style={{ color: B.RED }}>{userName}.</span>
        </h1>
        <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.95rem", color: "#888", marginTop: 12 }}>
          Here&apos;s what&apos;s happening with your knowledge base today.
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="grid grid-cols-2 lg:grid-cols-4"
        style={{ borderLeft: B.border4, borderTop: B.border4 }}
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const color = ICON_COLORS[i];
          const iconTextColor = color === B.YELLOW ? B.BLACK : "white";
          return (
            <Link key={stat.label} href={stat.href}>
              <div
                className="cursor-pointer"
                style={{ background: "white", borderRight: B.border4, borderBottom: B.border4, padding: "1.5rem", transition: "transform 0.2s ease-out" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translate(-2px, -2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translate(0, 0)"; }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div style={{ width: 40, height: 40, background: color, border: B.border2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color={iconTextColor} />
                  </div>
                  <TrendingUp size={14} color="#ccc" />
                </div>
                <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, fontSize: "2.5rem", color: B.BLACK }}>{stat.value}</div>
                <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", fontSize: "0.68rem", color: "#888", marginTop: 4 }}>{stat.label}</div>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* Learning streak */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        style={{ background: B.BLUE, border: B.border4, boxShadow: "4px 4px 0px 0px #121212", padding: "1.5rem" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div style={{ width: 32, height: 32, background: B.YELLOW, border: B.border2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flame size={16} color={B.BLACK} />
          </div>
          <h2 style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.08em", fontSize: "0.8rem", color: "white" }}>Learning Streak</h2>
        </div>
        <div className="flex items-center gap-6">
          <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, fontSize: "4rem", color: "white", lineHeight: 1 }}>0</div>
          <div>
            <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.08em", fontSize: "0.8rem", color: "white" }}>Day Streak</div>
            <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.82rem", color: "rgba(255,255,255,0.65)", marginTop: 4 }}>Upload a document to start your streak</div>
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      >
        <h2
          className="pb-3 mb-4"
          style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.08em", fontSize: "0.8rem", color: B.BLACK, borderBottom: B.border4 }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ borderLeft: B.border4, borderTop: B.border4 }}>
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            const color = ICON_COLORS[i];
            const iconTextColor = color === B.YELLOW ? B.BLACK : "white";
            return (
              <Link key={action.label} href={action.href}>
                <div
                  className="cursor-pointer"
                  style={{ background: "white", borderRight: B.border4, borderBottom: B.border4, padding: "1.5rem", transition: "transform 0.2s ease-out" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                >
                  <div style={{ width: 40, height: 40, background: color, border: B.border2, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <Icon size={18} color={iconTextColor} />
                  </div>
                  <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.06em", fontSize: "0.75rem", color: B.BLACK, marginBottom: 4 }}>{action.label}</div>
                  <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.78rem", color: "#888" }}>{action.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Empty state CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden text-center"
        style={{ background: B.YELLOW, border: B.border4, boxShadow: "8px 8px 0px 0px #121212", padding: "3rem 2rem" }}
      >
        <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
        <div style={{ position: "absolute", right: -24, top: -24, width: 80, height: 80, background: B.RED, border: B.border4, opacity: 0.3 }} />
        <div style={{ position: "absolute", left: -24, bottom: -24, width: 64, height: 64, borderRadius: "50%", background: B.BLUE, border: B.border4, opacity: 0.3 }} />

        <div className="relative z-10">
          <div style={{ width: 64, height: 64, background: B.BLACK, border: B.border4, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <FileText size={28} color={B.YELLOW} />
          </div>
          <h3 style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, textTransform: "uppercase" as const, fontSize: "clamp(1.6rem, 4vw, 2.8rem)", color: B.BLACK, lineHeight: 0.92, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Build Your
            <br />
            Second Brain.
          </h3>
          <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 500, fontSize: "0.95rem", color: B.BLACK, lineHeight: 1.6, marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            Upload your first document and watch as Kortex AI extracts knowledge, builds your graph, and generates learning materials.
          </p>
          <Link href="/dashboard/documents">
            <button
              className="inline-flex items-center justify-center gap-2 px-8 py-4 transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px]"
              style={{
                fontFamily: "'Outfit', system-ui, sans-serif",
                fontWeight: 900,
                textTransform: "uppercase" as const,
                letterSpacing: "0.08em",
                fontSize: "0.82rem",
                background: B.RED,
                color: "white",
                border: B.border2,
                boxShadow: "4px 4px 0px 0px #121212",
                cursor: "pointer",
              }}
            >
              Upload Your First Document
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
