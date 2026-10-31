"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type CalendarItem = {
  campaignId: string;
  campaignTitle: string;
  ideaIndex: number;
  ideaTitle: string;
  format: string;
  scheduledAt: string;
  workflowStatus: string;
};

type Props = {
  items: CalendarItem[];
  initialMonth: string;
};

const weekdays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const statusLabels: Record<string, string> = {
  idea: "Ide",
  draft: "Draft",
  review: "Review",
  ready: "Siap",
  published: "Terbit",
};

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function CalendarGrid({ items, initialMonth }: Props) {
  const [monthKey, setMonthKey] = useState(initialMonth);
  const [yearText, monthText] = monthKey.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthDate = new Date(year, month - 1, 1);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("id-ID", {
        month: "long",
        year: "numeric",
      }).format(monthDate),
    [year, month]
  );

  const days = Array.from({ length: firstDay + daysInMonth }, (_, index) =>
    index < firstDay ? null : index - firstDay + 1
  );

  function changeMonth(offset: number) {
    const nextMonth = new Date(year, month - 1 + offset, 1);
    setMonthKey(
      `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}`
    );
  }

  const scheduledThisMonth = items.filter((item) => {
    const date = new Date(item.scheduledAt);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  }).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold capitalize">{monthLabel}</h2>
          <p className="mt-1 text-sm text-slate-400">
            {scheduledThisMonth} konten terjadwal bulan ini
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Bulan sebelumnya"
            className="rounded-lg border border-white/10 px-3 py-2 text-sm transition hover:bg-slate-800"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Bulan berikutnya"
            className="rounded-lg border border-white/10 px-3 py-2 text-sm transition hover:bg-slate-800"
          >
            →
          </button>
        </div>
      </div>

      {items.length === 0 && (
        <p className="mt-5 rounded-lg border border-dashed border-white/10 p-4 text-sm text-slate-400">
          Belum ada konten terjadwal. Buka campaign, pilih <b>Edit AI Results</b>, lalu atur status dan tanggal publikasi pada ide konten.
        </p>
      )}

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[840px]">
          <div className="grid grid-cols-7 border-b border-white/[0.08]">
            {weekdays.map((weekday) => (
              <div key={weekday} className="px-2 py-3 text-center text-xs font-medium text-slate-400">
                {weekday}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day, cellIndex) => {
              if (day === null) {
                return (
                  <div
                    key={`blank-${cellIndex}`}
                    className="min-h-32 border-b border-r border-white/10 bg-[#0b0a11]/40 p-2"
                  />
                );
              }

              const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayItems = items.filter(
                (item) => localDateKey(new Date(item.scheduledAt)) === dateKey
              );

              return (
                <div
                  key={dateKey}
                  className="min-h-32 border-b border-r border-white/10 p-2"
                >
                  <span className="text-xs font-medium text-slate-400">{day}</span>
                  <div className="mt-2 space-y-2">
                    {dayItems.map((item) => (
                      <Link
                        key={`${item.campaignId}-${item.ideaIndex}`}
                        href={`/dashboard/campaigns/${item.campaignId}/edit-ai`}
                        className="block rounded-md border border-violet-500/20 bg-[#5232ff]/10 p-2 transition hover:border-violet-400/50 hover:bg-[#7258ff]/20"
                      >
                        <p className="line-clamp-2 text-xs font-medium text-violet-100">
                          {item.ideaTitle}
                        </p>
                        <p className="mt-1 truncate text-[10px] text-slate-400">
                          {item.campaignTitle}
                        </p>
                        <div className="mt-1 flex items-center justify-between gap-1 text-[10px] text-slate-400">
                          <span>{new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(new Date(item.scheduledAt))}</span>
                          <span>{statusLabels[item.workflowStatus] ?? item.workflowStatus}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
