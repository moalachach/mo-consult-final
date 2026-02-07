"use client";

import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { BadgeCheck, Clock3, FileText, XCircle } from "lucide-react";
import { listDossiers } from "@/lib/mock-dossiers";
import { getSession, signOut } from "@/lib/mock-auth";
import { normalizeLang } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; icon: any; cls: string }> = {
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
  const params = useParams<{ lang: string }>();
  const lang = normalizeLang(params.lang);

  const mockDossiers = listDossiers();
  const [sessionEmail, setSessionEmail] = React.useState<string | null>(null);
  const [dbDossiers, setDbDossiers] = React.useState<
    Array<{ id: string; type: string; status: string; step_index: number; updated_at?: string | null }>
  >([]);
  const [dbLoaded, setDbLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!isSupabaseConfigured()) {
      setSessionEmail(getSession()?.email ?? null);
      return;
    }
    const run = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getUser();
        setSessionEmail(data.user?.email ?? null);
      } catch {
        setSessionEmail(null);
      }
    };
    run();
  }, []);

  React.useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const run = async () => {
      try {
        const res = await fetch("/api/dossiers/list", { cache: "no-store" });
        const json = (await res.json()) as any;
        if (json?.ok) setDbDossiers(json.dossiers || []);
      } catch {
        // ignore
      } finally {
        setDbLoaded(true);
      }
    };
    run();
  }, []);

  const dossiers = isSupabaseConfigured() ? dbDossiers : mockDossiers;

  return (
    <div className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
              Espace client
            </h1>
            <p className="mt-2 text-[rgba(43,43,43,0.72)]">
              Retrouvez vos demandes, documents et messages (UI-only pour l’instant).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-[var(--color-sand)] bg-white/60 px-3 py-2 text-sm text-[rgba(43,43,43,0.75)] sm:inline-flex">
              {sessionEmail ?? "—"}
            </span>
            <button
              type="button"
              className="rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-beige)]"
              onClick={async () => {
                if (isSupabaseConfigured()) {
                  try {
                    const supabase = getSupabaseBrowserClient();
                    await supabase.auth.signOut();
                  } catch {
                    // ignore
                  }
                } else {
                  signOut();
                }
                window.location.href = `/${lang}/espace-client/login`;
              }}
              aria-label="Se déconnecter"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {isSupabaseConfigured() && !dbLoaded ? (
          <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 text-center shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">Chargement…</p>
          </div>
        ) : dossiers.length === 0 ? (
          <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 text-center shadow-sm backdrop-blur">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-[var(--color-accent)]">
              <FileText className="h-6 w-6" strokeWidth={2.2} />
            </div>
            <p className="text-sm font-semibold text-[var(--color-text)]">Aucun dossier pour le moment</p>
            <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
              Démarrez une création d’entreprise et revenez ici pour suivre l’avancement.
            </p>
            <Link
              href={`/${lang}/creer-entreprise`}
              className="mt-5 inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              Créer mon entreprise
            </Link>
            <Link
              href={`/${lang}/espace-client/demo`}
              className="mt-3 inline-flex items-center justify-center rounded-2xl border border-[var(--color-sand)] bg-white/60 px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-beige)]"
            >
              Activer un compte test (demo)
            </Link>
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-[rgba(43,43,43,0.70)]">Dossier</p>
                    <p className="mt-1 text-lg font-semibold text-[var(--color-text)]">
                      {d.type === "srl" ? "Créer une SRL" : "Indépendant (nom propre)"}
                    </p>
                    <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                      Mis à jour:{" "}
                      {("updatedAt" in d && (d as any).updatedAt) || (d as any).updated_at
                        ? new Date(((d as any).updatedAt || (d as any).updated_at) as string).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill status={d.status} />
                    <Link
                      href={`/${lang}/espace-client/dossiers/${d.id}`}
                      className="inline-flex items-center justify-center rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-beige)]"
                    >
                      Voir détail
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
