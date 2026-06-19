"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
import { B } from "@/lib/bauhaus";

export function DashboardHeader() {
  return (
    <header
      className="flex items-center justify-between px-6 shrink-0"
      style={{ height: 56, background: "white", borderBottom: B.border4 }}
    >
      {/* Search */}
      <button
        id="global-search-trigger"
        className="flex items-center gap-2 transition-colors duration-200"
        style={{
          padding: "8px 16px",
          border: "2px solid #e0e0e0",
          background: B.CANVAS,
          fontFamily: "'Outfit', system-ui, sans-serif",
          fontWeight: 700,
          textTransform: "uppercase" as const,
          letterSpacing: "0.08em",
          fontSize: "0.72rem",
          color: "#888",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = B.BLACK; (e.currentTarget as HTMLButtonElement).style.color = B.BLACK; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e0e0e0"; (e.currentTarget as HTMLButtonElement).style.color = "#888"; }}
      >
        <Search size={14} />
        <span>Search</span>
        <span
          className="ml-2"
          style={{ background: B.BLACK, color: "white", padding: "1px 6px", fontSize: "0.65rem", fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 700 }}
        >
          ⌘K
        </span>
      </button>

      <div className="flex items-center gap-3">
        <button
          id="notifications-button"
          className="flex items-center justify-center relative transition-all duration-200"
          style={{ width: 36, height: 36, border: "2px solid #e0e0e0", background: B.CANVAS, cursor: "pointer" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = B.RED; (e.currentTarget as HTMLButtonElement).style.borderColor = B.BLACK; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = B.CANVAS; (e.currentTarget as HTMLButtonElement).style.borderColor = "#e0e0e0"; }}
        >
          <Bell size={16} color="#888" />
          <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, background: B.RED, border: "2px solid white" }} />
        </button>

        <div style={{ border: "2px solid #e0e0e0", padding: "2px" }}>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-7 h-7 rounded-none",
                userButtonPopoverCard: "border-2 border-[#121212] shadow-[4px_4px_0px_0px_#121212] rounded-none",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
