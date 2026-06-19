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
  { icon: FileText, label: "Documents", value: "0", color: "#a1a1aa", href: "/dashboard/documents" },
  { icon: MessageSquare, label: "Chats", value: "0", color: "#a1a1aa", href: "/dashboard/chat" },
  { icon: BookOpen, label: "Flashcards", value: "0", color: "#a1a1aa", href: "/dashboard/flashcards" },
  { icon: ClipboardList, label: "Quizzes", value: "0", color: "#a1a1aa", href: "/dashboard/quizzes" },
];

const quickActions = [
  {
    icon: FileText,
    label: "Upload Document",
    description: "Add PDFs, DOCX or TXT files",
    href: "/dashboard/documents",
  },
  {
    icon: MessageSquare,
    label: "Start AI Chat",
    description: "Chat with your knowledge base",
    href: "/dashboard/chat",
  },
  {
    icon: GitBranch,
    label: "Knowledge Graph",
    description: "Explore your concept universe",
    href: "/dashboard/knowledge-graph",
  },
  {
    icon: Zap,
    label: "Quick Quiz",
    description: "Test your knowledge now",
    href: "/dashboard/quizzes",
  },
];

export function DashboardHome({ userName }: DashboardHomeProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-display text-3xl font-bold text-white">
          Good day, {userName} 👋
        </h1>
        <p className="text-[#a1a1aa] mt-1">
          Here&apos;s what&apos;s happening with your knowledge base today.
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-[#0a0a0a] border border-[#222] p-5 cursor-pointer group rounded-xl hover:border-[#555] transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#111] border border-[#333] group-hover:bg-white group-hover:border-white transition-colors"
                  >
                    <Icon className="w-5 h-5 text-[#a1a1aa] group-hover:text-black transition-colors" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-[#71717a] group-hover:text-white transition-colors" />
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-[#71717a] mt-1">{stat.label}</div>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>

      {/* Learning Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Flame className="w-5 h-5 text-white" />
          <h2 className="font-semibold text-white">Learning Streak</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-white">0</div>
          <div>
            <div className="text-white font-medium">Day streak</div>
            <div className="text-sm text-[#71717a]">Upload a document to start your streak</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-[#0a0a0a] border border-[#222] p-5 cursor-pointer group hover:border-[#555] transition-colors rounded-xl"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-[#111] border border-[#333] group-hover:bg-white group-hover:border-white transition-colors"
                  >
                    <Icon className="w-5 h-5 text-[#a1a1aa] group-hover:text-black transition-colors" />
                  </div>
                  <div className="font-medium text-white text-sm">{action.label}</div>
                  <div className="text-xs text-[#71717a] mt-1">{action.description}</div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Empty state call to action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-[#0a0a0a] border border-[#222] rounded-xl p-10 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-black" />
        </div>
        <h3 className="font-display text-2xl font-bold text-white mb-2">
          Start Building Your Second Brain
        </h3>
        <p className="text-[#a1a1aa] mb-6 max-w-md mx-auto">
          Upload your first document and watch as Kortex AI extracts knowledge, builds your graph, and generates learning materials.
        </p>
        <Link href="/dashboard/documents">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary bg-white text-black font-semibold px-6 py-3 rounded-lg"
          >
            Upload Your First Document
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
