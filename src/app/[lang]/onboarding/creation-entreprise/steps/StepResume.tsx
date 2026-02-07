"use client";

import type { CreationType, Draft } from "../types";
import { Badge } from "@/components/ui";
import { CheckCircle2 } from "lucide-react";

export function StepResume({ type }: { type: CreationType; draft: Draft }) {
  const packTitle = type === "srl" ? "Créer une SRL" : "Indépendant (nom propre)";
  const price = type === "srl" ? "1.250€" : "200€";

  const inclusions =
    type === "srl"
      ? ["Plan financier", "Dossier notaire", "Banque & attestation", "Affiliation société"]
      : ["Inscription", "TVA si besoin", "Caisse sociale", "Conseils de démarrage"];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">Votre formule</p>
          <p className="mt-1 text-xl font-semibold text-[var(--color-primary)]">{packTitle}</p>
        </div>
        <div className="rounded-2xl bg-[var(--color-primary)] px-4 py-2 text-white">
          {price}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge className="bg-white/60 text-primary">Plan financier inclus</Badge>
        <Badge className="bg-white/60 text-primary">Paiement sécurisé</Badge>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {inclusions.map((x) => (
          <div key={x} className="flex items-center gap-2 text-sm text-[rgba(43,43,43,0.75)]">
            <CheckCircle2 className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2.2} />
            <span>{x}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
