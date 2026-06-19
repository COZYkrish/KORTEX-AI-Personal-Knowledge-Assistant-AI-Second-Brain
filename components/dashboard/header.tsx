"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Command } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="h-14 border-b border-[rgba(124,58,237,0.1)] flex items-center justify-between px-6 shrink-0">
      {/* Search hint */}
      <button
        id="global-search-trigger"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-sm text-[#64748b] hover:text-[#a8b2d8] transition-colors"
      >
        <Command className="w-3.5 h-3.5" />
        <span>Search</span>
        <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-[rgba(124,58,237,0.2)] text-[#7c3aed]">⌘K</span>
      </button>

      <div className="flex items-center gap-3">
        <button id="notifications-button" className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748b] hover:text-white hover:bg-[rgba(124,58,237,0.1)] transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#7c3aed]" />
        </button>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    </header>
  );
}
