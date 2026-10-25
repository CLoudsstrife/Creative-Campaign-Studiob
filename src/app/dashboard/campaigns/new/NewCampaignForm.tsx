
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createCampaign, type CampaignFormState } from "../actions";

const initialState: CampaignFormState = {};

export default function NewCampaignForm() {
  const [state, formAction, pending] = useActionState(
    createCampaign,
    initialState
  );

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard/campaigns");
      router.refresh();
    }
  }, [state.success, router]);

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500";

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="title" className="text-sm font-medium">
          Judul Campaign *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={150}
          placeholder="Contoh: Summer Product Launch"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="brandName" className="text-sm font-medium">
          Nama Brand
        </label>
        <input
          id="brandName"
          name="brandName"
          type="text"
          maxLength={150}
          placeholder="Contoh: CreativeFlow"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Deskripsi Campaign
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={5000}
          placeholder="Jelaskan tujuan dan ide campaign..."
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="targetAudience" className="text-sm font-medium">
          Target Audiens
        </label>
        <input
          id="targetAudience"
          name="targetAudience"
          type="text"
          maxLength={500}
          placeholder="Contoh: Mahasiswa usia 18–24 tahun"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="platform" className="text-sm font-medium">
          Platform
        </label>
        <select
          id="platform"
          name="platform"
          defaultValue=""
          className={inputClass}
        >
          <option value="">Pilih platform</option>
          <option value="Instagram">Instagram</option>
          <option value="TikTok">TikTok</option>
          <option value="YouTube">YouTube</option>
          <option value="Facebook">Facebook</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Website">Website</option>
          <option value="Multi-platform">Multi-platform</option>
        </select>
      </div>

      <div>
        <label htmlFor="tone" className="text-sm font-medium">
          Tone of Voice
        </label>
        <select
          id="tone"
          name="tone"
          defaultValue=""
          className={inputClass}
        >
          <option value="">Pilih tone</option>
          <option value="Professional">Professional</option>
          <option value="Casual">Casual</option>
          <option value="Friendly">Friendly</option>
          <option value="Funny">Funny</option>
          <option value="Inspirational">Inspirational</option>
          <option value="Persuasive">Persuasive</option>
        </select>
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Menyimpan..." : "Simpan Campaign"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard/campaigns")}
          className="rounded-lg border border-slate-700 px-5 py-3 font-medium transition hover:bg-slate-800"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
