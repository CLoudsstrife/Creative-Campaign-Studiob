"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setError("Sign out failed. Please try again.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Something went wrong while signing out. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className={`${compact ? "rounded-md px-2 py-2" : "w-full rounded-md px-3 py-2 text-left"} dashboard-interactive border border-edge text-xs font-medium text-ink-muted hover:border-danger/30 hover:bg-danger/5 hover:text-danger active:scale-[0.98] focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-50`}
      >
        {loading ? "Signing out..." : "Sign out"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
