"use client";

import React from "react";
import type { StepConfig } from "../types";

export function Stepper({
  steps,
  stepIndex,
  onSelect,
}: {
  steps: StepConfig[];
  stepIndex: number;
  onSelect?: (idx: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((s, idx) => {
        const active = idx === stepIndex;
        const done = idx < stepIndex;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect?.(idx)}
            className={[
              "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-beige)]",
              active
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                : done
                  ? "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.10)] text-[var(--color-primary)] hover:bg-[rgba(31,143,95,0.14)]"
                  : "border-[var(--color-sand)] bg-white/55 text-[rgba(43,43,43,0.78)] hover:bg-white/70",
            ].join(" ")}
            aria-current={active ? "step" : undefined}
          >
            <span
              className={[
                "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                active ? "bg-white/15 text-white" : "bg-white/70 text-[rgba(43,43,43,0.75)]",
              ].join(" ")}
              aria-hidden="true"
            >
              {idx + 1}
            </span>
            <span className="whitespace-nowrap">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}

