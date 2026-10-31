import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import DashboardNavigation from "./DashboardNavigation";
import DashboardTopBar from "./DashboardTopBar";

// Generation limit shown on the "AI Generations" card. Adjust to match your plan.
const GENERATIONS_LIMIT = 10000;

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const generationsUsed = await prisma.campaign.count({
    where: { userId: user.id, aiResult: { not: null } },
  });

  const email = user.email ?? "Akun pengguna";

  return (
    <div className="dashboard-background min-h-screen text-slate-100 lg:flex">
      <DashboardNavigation email={email} generationsUsed={generationsUsed} generationsLimit={GENERATIONS_LIMIT} />
      <div className="min-w-0 flex-1">
        <DashboardTopBar email={email} />
        {children}
      </div>
    </div>
  );
}