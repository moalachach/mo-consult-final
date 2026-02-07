"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { isSupabaseConfigured } from "@/lib/env";
import {
  listDossiers as listDossiersMock,
  setDraftWorkflowStatus as setDraftWorkflowStatusMock,
} from "@/lib/mock-dossiers";
import type { DossierStatus } from "@/lib/mock-dossiers";
import { BadgeCheck, Clock3, Filter, XCircle } from "lucide-react";

function StatusBadge({ status }: { status: DossierStatus }) {
  const map: Record<DossierStatus, { label: string; icon: any; cls: string }> = {
    new: { label: "Nouveau", icon: Clock3, cls: "border-[var(--color-sand)] bg-white/60" },
    in_progress: {
      label: "En cours",
      icon: Clock3,
      cls: "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.10)] text-[var(--color-accent)]",
    },
    approved: {
      label: "Approuvé",
      icon: BadgeCheck,
      cls: "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] text-[var(--color-accent)]",
    },
    cancelled: {
      label: "Annulé",
      icon: XCircle,
      cls: "border-[rgba(239,68,68,0.22)] bg-[rgba(239,68,68,0.10)] text-[rgb(153,27,27)]",
    },
  };
  const m = map[status] ?? map.new;
  const Icon = m.icon;
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-[var(--color-text)]",
        m.cls,
      ].join(" ")}
    >
      <Icon className="h-4 w-4" strokeWidth={2.2} />
      {m.label}
    </span>
  );
}

export default function Page() {
  const [filter, setFilter] = React.useState<DossierStatus | "all">("all");
  const [loading, setLoading] = React.useState(false);
  const [dossiers, setDossiers] = React.useState<
    Array<{ id: string; type: string; status: DossierStatus; updatedAt?: string; updated_at?: string | null }>
  >([]);

  React.useEffect(() => {
    const run = async () => {
      if (!isSupabaseConfigured()) {
        const all = listDossiersMock();
        setDossiers(filter === "all" ? all : all.filter((d) => d.status === filter));
        return;
      }
      setLoading(true);
      try {
        const qs = filter === "all" ? "" : `?status=${encodeURIComponent(filter)}`;
        const res = await fetch(`/api/admin/dossiers${qs}`, { cache: "no-store" });
        const json = (await res.json()) as any;
        if (json?.ok) setDossiers(json.dossiers || []);
      } finally {
        setLoading(false);
      }
    };
    run();
    if (!isSupabaseConfigured()) return;
    // Auto-refresh so new client dossiers appear without manual reload.
    const t = window.setInterval(run, 4000);
    return () => window.clearInterval(t);
  }, [filter]);

  const setStatus = async (id: string, type: string, status: DossierStatus) => {
    // Optimistic UX: update immediately without refresh.
    setDossiers((all) => all.map((d) => (d.id === id ? { ...d, status } : d)));

    if (!isSupabaseConfigured()) {
      setDraftWorkflowStatusMock(type as any, status);
      return;
    }
    try {
      await fetch(`/api/admin/dossiers/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {
      // Best-effort: ignore network errors in UI.
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
              Admin — Dossiers
            </h1>
            <p className="mt-2 text-[rgba(43,43,43,0.72)]">
              {isSupabaseConfigured()
                ? "Mode production (Supabase): dossiers en base de donnees."
                : "UI-only: statuts + messages en localStorage."}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-3 text-sm text-[rgba(43,43,43,0.75)] backdrop-blur">
            <Filter className="h-4 w-4" strokeWidth={2.2} />
            Filtre
            <select
              className="ml-2 rounded-xl border border-[var(--color-sand)] bg-white px-3 py-2 text-sm text-[var(--color-text)] outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              aria-label="Filtrer les dossiers"
            >
              <option value="all">Tous</option>
              <option value="new">Nouveaux</option>
              <option value="in_progress">En cours</option>
              <option value="approved">Approuvés</option>
              <option value="cancelled">Annulés</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 text-center shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">Chargement…</p>
          </div>
        ) : dossiers.length === 0 ? (
          <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 text-center shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">Aucun dossier</p>
            <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
              Crée un draft via le wizard (SRL/PP) puis reviens ici.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {dossiers.map((d) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-6 shadow-sm backdrop-blur"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm text-[rgba(43,43,43,0.70)]">Dossier</p>
                    <p className="mt-1 text-lg font-semibold text-[var(--color-text)]">
                      {d.type === "srl" ? "Créer une SRL" : "Indépendant (nom propre)"}
                    </p>
                    <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                      Mis à jour:{" "}
                      {d.updatedAt || (d as any).updated_at
                        ? new Date((d.updatedAt || (d as any).updated_at) as string).toLocaleString()
                        : "—"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <StatusBadge status={d.status as DossierStatus} />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-beige)]"
                        onClick={() => setStatus(d.id, d.type, "in_progress")}
                      >
                        En cours
                      </button>
                      <button
                        type="button"
                        className="rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-beige)]"
                        onClick={() => setStatus(d.id, d.type, "approved")}
                      >
                        Approuver
                      </button>
                      <button
                        type="button"
                        className="rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-beige)]"
                        onClick={() => setStatus(d.id, d.type, "cancelled")}
                      >
                        Annuler
                      </button>
                    </div>

                    <Link
                      href={`/admin/dossiers/${d.id}`}
                      className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    >
                      Ouvrir
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
