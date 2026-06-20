import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata: Metadata = {
  title: "Dashboard — Kortex AI",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F0F0F0]">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-col flex-1">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto px-4 py-5 pb-24 md:px-6 md:py-6 md:pb-8">{children}</main>
      </div>
    </div>
  );
}
