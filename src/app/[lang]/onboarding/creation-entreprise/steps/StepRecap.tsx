"use client";

import type { Draft } from "../types";

export function StepRecap({ draft }: { draft: Draft }) {
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-5">
        <p className="text-sm font-semibold text-[var(--color-text)]">Récapitulatif (UI-only)</p>
        <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
          Utile pour vérifier la structure. Plus tard: paiement + génération documents.
        </p>
      </div>

      <pre className="overflow-auto rounded-2xl border border-[var(--color-sand)] bg-white/70 p-5 text-sm text-[var(--color-text)]">
        {JSON.stringify(draft, null, 2)}
      </pre>
    </div>
  );
}

