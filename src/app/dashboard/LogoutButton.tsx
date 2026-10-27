
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
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
        setError("Logout gagal. Silakan coba lagi.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan saat logout. Silakan coba lagi.");
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
        className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Logging out..." : "Logout"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
