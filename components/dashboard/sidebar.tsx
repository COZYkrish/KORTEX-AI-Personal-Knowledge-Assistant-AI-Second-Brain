"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, LayoutDashboard, FileText, MessageSquare,
  Search, BookOpen, ClipboardList, GitBranch,
  BarChart3, Settings, Mic, Map, ChevronLeft,
  ChevronRight, PenTool,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Documents", href: "/dashboard/documents" },
  { icon: MessageSquare, label: "AI Chat", href: "/dashboard/chat" },
  { icon: PenTool, label: "Workspace", href: "/dashboard/workspace" },
  { icon: Search, label: "Search", href: "/dashboard/search" },
  { icon: BookOpen, label: "Flashcards", href: "/dashboard/flashcards" },
  { icon: ClipboardList, label: "Quizzes", href: "/dashboard/quizzes" },
  { icon: Map, label: "Learning Paths", href: "/dashboard/learning-paths" },
  { icon: GitBranch, label: "Knowledge Graph", href: "/dashboard/knowledge-graph" },
  { icon: Mic, label: "Voice AI", href: "/dashboard/voice" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex flex-col h-full border-r border-[#222] bg-black shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#222]">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
          <Brain className="w-4 h-4 text-black" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-display font-bold text-white text-base whitespace-nowrap"
            >
              Kortex AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              title={collapsed ? item.label : undefined}
            >
              <motion.div
                whileHover={{ x: collapsed ? 0 : 2 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative ${
                  isActive
                    ? "bg-[#111] text-white"
                    : "text-[#71717a] hover:text-[#e4e4e7] hover:bg-[#0a0a0a]"
                } ${collapsed ? "justify-center" : ""}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-white"
                  />
                )}
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : ""}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        id="sidebar-collapse-toggle"
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-black border border-[#333] flex items-center justify-center text-[#71717a] hover:text-white hover:border-white transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </motion.aside>
  );
}
