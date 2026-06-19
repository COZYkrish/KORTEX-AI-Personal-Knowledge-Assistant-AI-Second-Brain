"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="h-14 border-b-4 border-[#121212] flex items-center justify-between px-6 bg-white shrink-0">
      {/* Search */}
      <button
        id="global-search-trigger"
        className="flex items-center gap-2 px-4 py-2 border-2 border-[#e0e0e0] bg-[#F0F0F0] text-sm font-bold text-[#888] hover:border-[#121212] hover:text-[#121212] transition-colors duration-200 uppercase tracking-wider"
      >
        <Search className="w-4 h-4" />
        <span>Search</span>
        <span className="ml-2 text-xs px-2 py-0.5 bg-[#121212] text-white font-bold">⌘K</span>
      </button>

      <div className="flex items-center gap-3">
        <button
          id="notifications-button"
          className="w-9 h-9 border-2 border-[#e0e0e0] bg-[#F0F0F0] flex items-center justify-center text-[#888] hover:border-[#121212] hover:text-[#121212] hover:bg-[#D02020] hover:[&>svg]:text-white transition-all duration-200 relative group"
        >
          <Bell className="w-4 h-4 group-hover:text-white transition-colors" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#D02020] border-2 border-white" />
        </button>
        <div className="border-2 border-[#e0e0e0] p-0.5">
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
