"use client";

import { useEffect, useState, type CSSProperties } from "react";

// Adapted from Rendyn's Agent Progress component (beui.dev/components/agents/loading-states).
// Its Motion animation is expressed as CSS here to match the project's existing dependencies.
// Copyright (c) 2026 Saurabh Chauhan. Licensed under the MIT License.
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const GRID_CELLS = [
  { id: "top-left", delay: 0 },
  { id: "top-center", delay: 0.14 },
  { id: "top-right", delay: 0.28 },
  { id: "middle-left", delay: 0.42 },
  { id: "middle-center", delay: 0.56 },
  { id: "middle-right", delay: 0.7 },
  { id: "bottom-left", delay: 0.84 },
  { id: "bottom-center", delay: 0.98 },
  { id: "bottom-right", delay: 1.12 },
];

function formatElapsed(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = Math.floor(safeSeconds % 60).toString().padStart(2, "0");
  return minutes > 0 ? `${minutes}:${seconds}` : `0:${seconds}`;
}

export default function AgentProgress({ label }: { label: string }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <span
      role="status"
      aria-label={`${label}, in progress`}
      className="inline-flex items-center gap-3 text-sm text-slate-400"
    >
      <span aria-hidden="true" className="grid size-5 shrink-0 grid-cols-3 gap-[2px]">
        {GRID_CELLS.map(({ id, delay }) => (
          <span
            key={id}
            className="rendyn-agent-progress__cell rounded-[1px] bg-violet-300"
            style={{ "--cell-delay": `${delay}s` } as CSSProperties}
          />
        ))}
      </span>
      <span className="font-medium text-violet-200">{label}</span>
      <span aria-hidden="true" className="tabular-nums text-slate-500">
        {formatElapsed(elapsedSeconds)}
      </span>
    </span>
  );
}
