import { getSession } from "@/lib/db/session";
import { redirect } from "next/navigation";
import { DashboardHome } from "@/components/dashboard/dashboard-home";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  return <DashboardHome userName={session.user.name ?? "Explorer"} />;
}
