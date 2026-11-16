import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNavigation from "./DashboardNavigation";
import DashboardTopBar from "./DashboardTopBar";
import { AI_GENERATIONS_LIMIT, getAIGenerationCount } from "@/lib/ai-usage";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const generationsUsed = await getAIGenerationCount(user.id);

  const email = user.email ?? "Akun pengguna";

  return (
    <div className="dashboard-background min-h-screen text-foreground lg:flex">
      <DashboardNavigation generationsUsed={generationsUsed} generationsLimit={AI_GENERATIONS_LIMIT} />
      <div className="min-h-screen min-w-0 flex-1">
        <DashboardTopBar email={email} />
        {children}
      </div>
    </div>
  );
}
