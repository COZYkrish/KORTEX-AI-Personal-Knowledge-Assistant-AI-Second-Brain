"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, FileText, MessageSquare,
  Search, BookOpen, ClipboardList, GitBranch,
  BarChart3, Settings, Mic, Map,
  ChevronLeft, ChevronRight, PenTool,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", color: "#D02020" },
  { icon: FileText, label: "Documents", href: "/dashboard/documents", color: "#1040C0" },
  { icon: MessageSquare, label: "AI Chat", href: "/dashboard/chat", color: "#F0C020" },
  { icon: PenTool, label: "Workspace", href: "/dashboard/workspace", color: "#D02020" },
  { icon: Search, label: "Search", href: "/dashboard/search", color: "#1040C0" },
  { icon: BookOpen, label: "Flashcards", href: "/dashboard/flashcards", color: "#F0C020" },
  { icon: ClipboardList, label: "Quizzes", href: "/dashboard/quizzes", color: "#D02020" },
  { icon: Map, label: "Learning Paths", href: "/dashboard/learning-paths", color: "#1040C0" },
  { icon: GitBranch, label: "Knowledge Graph", href: "/dashboard/knowledge-graph", color: "#F0C020" },
  { icon: Mic, label: "Voice AI", href: "/dashboard/voice", color: "#D02020" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics", color: "#1040C0" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings", color: "#F0C020" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 224 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative flex flex-col h-full border-r-4 border-[#121212] bg-white shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className={`flex items-center gap-2 px-4 py-4 border-b-4 border-[#121212] bg-[#F0F0F0] ${collapsed ? "justify-center" : ""}`}>
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#D02020] border-2 border-[#121212]" />
          <div className="w-3 h-3 bg-[#1040C0] border-2 border-[#121212]" />
          <div
            className="w-3 h-3 bg-[#F0C020] border-2 border-[#121212]"
            style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
          />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="font-black uppercase text-[#121212] text-xs tracking-tight whitespace-nowrap"
            >
              Kortex AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              title={collapsed ? item.label : undefined}
            >
              <div
                className={`flex items-center gap-3 px-3 py-3 border-b-2 border-[#F0F0F0] transition-all duration-150 group relative ${
                  collapsed ? "justify-center" : ""
                } ${
                  isActive
                    ? "border-l-4 border-l-[#121212] bg-[#F0F0F0]"
                    : "hover:bg-[#F0F0F0] border-l-4 border-l-transparent"
                }`}
              >
                {/* Active color block for icon */}
                <div
                  className={`w-8 h-8 flex items-center justify-center flex-shrink-0 border-2 transition-colors duration-150 ${
                    isActive
                      ? "border-[#121212]"
                      : "border-transparent group-hover:border-[#e0e0e0]"
                  }`}
                  style={{ background: isActive ? item.color : "transparent" }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: isActive ? (item.color === "#F0C020" ? "#121212" : "white") : "#888" }}
                  />
                </div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                        isActive ? "text-[#121212]" : "text-[#888] group-hover:text-[#121212]"
                      }`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        id="sidebar-collapse-toggle"
        className="flex items-center justify-center gap-2 px-4 py-3 border-t-4 border-[#121212] bg-[#F0F0F0] hover:bg-[#121212] hover:text-white text-[#121212] transition-colors duration-200 font-bold uppercase text-xs tracking-wider"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : (
          <>
            <ChevronLeft className="w-4 h-4" />
            {!collapsed && <span>Collapse</span>}
          </>
        )}
      </button>
    </motion.aside>
  );
}
