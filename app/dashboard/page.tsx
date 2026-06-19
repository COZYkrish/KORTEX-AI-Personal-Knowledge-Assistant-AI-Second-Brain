import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardHome } from "@/components/dashboard/dashboard-home";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return <DashboardHome userName={user.firstName ?? "Explorer"} />;
}
