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
import { B } from "@/lib/bauhaus";

const ICON_COLORS = [B.RED, B.BLUE, B.YELLOW];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",      href: "/dashboard" },
  { icon: FileText,        label: "Documents",       href: "/dashboard/documents" },
  { icon: MessageSquare,   label: "AI Chat",         href: "/dashboard/chat" },
  { icon: PenTool,         label: "Workspace",       href: "/dashboard/workspace" },
  { icon: Search,          label: "Search",          href: "/dashboard/search" },
  { icon: BookOpen,        label: "Flashcards",      href: "/dashboard/flashcards" },
  { icon: ClipboardList,   label: "Quizzes",         href: "/dashboard/quizzes" },
  { icon: Map,             label: "Learning Paths",  href: "/dashboard/learning-paths" },
  { icon: GitBranch,       label: "Knowledge Graph", href: "/dashboard/knowledge-graph" },
  { icon: Mic,             label: "Voice AI",        href: "/dashboard/voice" },
  { icon: BarChart3,       label: "Analytics",       href: "/dashboard/analytics" },
  { icon: Settings,        label: "Settings",        href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const mobileNavItems = navItems.filter((item) =>
    ["Dashboard", "Documents", "AI Chat", "Search", "Knowledge Graph"].includes(item.label)
  );

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 68 : 232 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="sticky top-0 hidden md:flex flex-col h-screen overflow-hidden"
        style={{ background: "white", borderRight: "3px solid #121212", flexShrink: 0 }}
      >
      {/* Logo */}
      <div
        className={`flex items-center gap-2 px-4 py-4 ${collapsed ? "justify-center" : ""}`}
        style={{ borderBottom: "3px solid #121212", background: B.CANVAS }}
      >
        <div className="flex items-center gap-1 flex-shrink-0">
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: B.RED,    border: B.border2 }} />
          <div style={{ width: 10, height: 10,                       background: B.BLUE,   border: B.border2 }} />
          <div style={{ width: 10, height: 10,                       background: B.YELLOW, border: B.border2, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 900, textTransform: "uppercase" as const, color: B.BLACK, fontSize: "0.8rem", letterSpacing: "0.04em", whiteSpace: "nowrap" as const }}
            >
              Kortex AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-1">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const accentColor = ICON_COLORS[i % 3];
          const iconTextColor = accentColor === B.YELLOW ? B.BLACK : "white";

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              title={collapsed ? item.label : undefined}
            >
              <div
                className={`flex items-center gap-3 transition-all duration-150 ${collapsed ? "justify-center" : ""}`}
                style={{
                  padding: "10px 12px",
                  borderBottom: "2px solid #F0F0F0",
                  borderLeft: isActive ? `4px solid ${B.BLACK}` : "4px solid transparent",
                  background: isActive ? B.CANVAS : "white",
                }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = B.CANVAS; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "white"; }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    background: isActive ? accentColor : "transparent",
                    border: isActive ? B.border2 : "2px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <Icon size={16} color={isActive ? iconTextColor : "#888"} />
                </div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        fontFamily: "'Outfit', system-ui, sans-serif",
                        fontWeight: 700,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.07em",
                        fontSize: "0.7rem",
                        color: isActive ? B.BLACK : "#888",
                        whiteSpace: "nowrap" as const,
                      }}
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
        className="flex items-center justify-center gap-2 w-full transition-colors duration-200"
        style={{
          padding: "12px 16px",
          background: B.CANVAS,
          fontFamily: "'Outfit', system-ui, sans-serif",
          fontWeight: 700,
          textTransform: "uppercase" as const,
          letterSpacing: "0.07em",
          fontSize: "0.65rem",
          color: B.BLACK,
          cursor: "pointer",
          border: "none",
          borderTop: "3px solid #121212",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = B.BLACK; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = B.CANVAS; (e.currentTarget as HTMLButtonElement).style.color = B.BLACK; }}
      >
        {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
      </button>
      </motion.aside>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 md:hidden"
        style={{ background: "white", borderTop: "3px solid #121212" }}
      >
        {mobileNavItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const accentColor = ICON_COLORS[i % 3];
          const iconTextColor = accentColor === B.YELLOW ? B.BLACK : "white";

          return (
            <Link key={item.href} href={item.href} aria-label={item.label}>
              <div
                className="flex min-h-[64px] flex-col items-center justify-center gap-1"
                style={{
                  borderRight: i < mobileNavItems.length - 1 ? "1px solid #e0e0e0" : "none",
                  background: isActive ? B.CANVAS : "white",
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 30,
                    height: 30,
                    background: isActive ? accentColor : "transparent",
                    border: isActive ? B.border2 : "2px solid transparent",
                  }}
                >
                  <Icon size={15} color={isActive ? iconTextColor : "#666"} />
                </div>
                <span
                  style={{
                    fontFamily: "'Outfit', system-ui, sans-serif",
                    fontWeight: 800,
                    textTransform: "uppercase" as const,
                    letterSpacing: 0,
                    fontSize: "0.55rem",
                    color: isActive ? B.BLACK : "#666",
                    maxWidth: 58,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {item.label.replace("Knowledge Graph", "Graph")}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
