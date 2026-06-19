"use client";

import { motion } from "framer-motion";
import {
  FileText, MessageSquare, BookOpen, ClipboardList,
  GitBranch, TrendingUp, Flame, Zap,
} from "lucide-react";
import Link from "next/link";

interface DashboardHomeProps {
  userName: string;
}

const stats = [
  { icon: FileText, label: "Documents", value: "0", color: "#D02020", href: "/dashboard/documents" },
  { icon: MessageSquare, label: "Chats", value: "0", color: "#1040C0", href: "/dashboard/chat" },
  { icon: BookOpen, label: "Flashcards", value: "0", color: "#F0C020", href: "/dashboard/flashcards" },
  { icon: ClipboardList, label: "Quizzes", value: "0", color: "#D02020", href: "/dashboard/quizzes" },
];

const quickActions = [
  {
    icon: FileText,
    label: "Upload Document",
    description: "Add PDFs, DOCX or TXT files",
    href: "/dashboard/documents",
    color: "#D02020",
  },
  {
    icon: MessageSquare,
    label: "Start AI Chat",
    description: "Chat with your knowledge base",
    href: "/dashboard/chat",
    color: "#1040C0",
  },
  {
    icon: GitBranch,
    label: "Knowledge Graph",
    description: "Explore your concept universe",
    href: "/dashboard/knowledge-graph",
    color: "#F0C020",
  },
  {
    icon: Zap,
    label: "Quick Quiz",
    description: "Test your knowledge now",
    href: "/dashboard/quizzes",
    color: "#D02020",
  },
];

export function DashboardHome({ userName }: DashboardHomeProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="border-b-4 border-[#121212] pb-6"
      >
        <h1
          className="font-display text-4xl sm:text-5xl text-[#121212]"
          style={{ lineHeight: "0.92" }}
        >
          Good Day,
          <br />
          <span className="text-[#D02020]">{userName}.</span>
        </h1>
        <p className="text-[#888] font-medium mt-3">
          Here&apos;s what&apos;s happening with your knowledge base today.
        </p>
      </motion.div>

      {/* Stats Row — Bauhaus bordered grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-l-4 border-t-4 border-[#121212]"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <div className="bg-white border-r-4 border-b-4 border-[#121212] p-6 cursor-pointer group hover:-translate-y-1 hover:translate-x-[-1px] transition-transform duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 border-2 border-[#121212] flex items-center justify-center group-hover:shadow-hard transition-all duration-200"
                    style={{ background: stat.color }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color === "#F0C020" ? "#121212" : "white" }} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-[#ccc] group-hover:text-[#121212] transition-colors" />
                </div>
                <div className="text-4xl font-black text-[#121212]">{stat.value}</div>
                <div className="font-label text-[#888] mt-1">{stat.label}</div>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* Learning Streak */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="bg-[#1040C0] border-4 border-[#121212] shadow-hard p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[#F0C020] border-2 border-[#121212] flex items-center justify-center">
            <Flame className="w-4 h-4 text-[#121212]" />
          </div>
          <h2 className="font-black uppercase text-white tracking-wider">Learning Streak</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-6xl font-black text-white">0</div>
          <div>
            <div className="font-black text-white uppercase tracking-wider">Day Streak</div>
            <div className="text-sm text-white opacity-70 font-medium mt-1">Upload a document to start your streak</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      >
        <h2 className="font-black uppercase text-[#121212] tracking-wider mb-4 border-b-4 border-[#121212] pb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-l-4 border-t-4 border-[#121212]">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <div className="bg-white border-r-4 border-b-4 border-[#121212] p-6 cursor-pointer group hover:-translate-y-1 transition-transform duration-200">
                  <div
                    className="w-10 h-10 border-2 border-[#121212] flex items-center justify-center mb-4 group-hover:shadow-hard transition-all duration-200"
                    style={{ background: action.color }}
                  >
                    <Icon className="w-5 h-5" style={{ color: action.color === "#F0C020" ? "#121212" : "white" }} />
                  </div>
                  <div className="font-black text-[#121212] text-sm uppercase tracking-wider">{action.label}</div>
                  <div className="text-xs text-[#888] font-medium mt-1">{action.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Empty State CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        className="bg-[#F0C020] border-4 border-[#121212] shadow-hard-lg p-10 text-center relative overflow-hidden"
      >
        {/* Background dot grid */}
        <div className="absolute inset-0 bg-dot-grid opacity-10" />
        {/* Decorative shapes */}
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#D02020] border-4 border-[#121212] opacity-30" />
        <div className="absolute -left-8 -bottom-8 w-20 h-20 rounded-full bg-[#1040C0] border-4 border-[#121212] opacity-30" />

        <div className="relative z-10">
          <div className="w-16 h-16 bg-[#121212] border-4 border-[#121212] flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-[#F0C020]" />
          </div>
          <h3 className="font-display text-3xl sm:text-4xl text-[#121212] mb-3" style={{ lineHeight: "0.92" }}>
            Build Your
            <br />
            Second Brain.
          </h3>
          <p className="text-[#121212] font-medium mb-8 max-w-md mx-auto">
            Upload your first document and watch as Kortex AI extracts knowledge, builds your graph, and generates learning materials.
          </p>
          <Link href="/dashboard/documents">
            <button className="btn-primary text-sm px-8 py-4">
              Upload Your First Document
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
