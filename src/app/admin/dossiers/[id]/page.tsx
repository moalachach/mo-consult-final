"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import React from "react";
import { ArrowLeft, BadgeCheck, CircleDashed, Clock3, MessageCircle, XCircle } from "lucide-react";
import {
  addMessage as addMessageMock,
  dossierId as dossierIdMock,
  loadDossier as loadDossierMock,
  loadMessages as loadMessagesMock,
  loadStatusHistory as loadStatusHistoryMock,
  setDraftWorkflowStatus as setDraftWorkflowStatusMock,
  persistDossier as persistDossierMock,
} from "@/lib/mock-dossiers";
import type { CreationType, Draft } from "@/app/[lang]/onboarding/creation-entreprise/types";
import type { DossierStatus } from "@/lib/mock-dossiers";
import { isSupabaseConfigured } from "@/lib/env";

function typeFromId(id: string): CreationType | null {
  if (id === dossierIdMock("srl")) return "srl";
  if (id === dossierIdMock("pp")) return "pp";
  return null;
}

function DocsBlock({ draft }: { draft: Draft }) {
  const founders = draft.docs.foundersIds ?? [];
  const admins = draft.docs.adminsIds ?? [];
  return (
    <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-6 shadow-sm backdrop-blur">
      <p className="text-sm font-semibold text-[var(--color-text)]">Documents (UI-only)</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4">
          <p className="text-sm font-semibold text-[var(--color-text)]">Fondateurs</p>
          <p className="mt-1 text-xs text-[rgba(43,43,43,0.70)]">
            Nombre: {draft.docs.foundersCount ?? 1}
          </p>
          <ul className="mt-3 grid gap-2 text-sm text-[rgba(43,43,43,0.78)]">
            {founders.length === 0 ? <li>—</li> : founders.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4">
          <p className="text-sm font-semibold text-[var(--color-text)]">Administrateurs</p>
          <p className="mt-1 text-xs text-[rgba(43,43,43,0.70)]">
            Nombre: {draft.docs.adminsCount ?? 1}
          </p>
          <ul className="mt-3 grid gap-2 text-sm text-[rgba(43,43,43,0.78)]">
            {admins.length === 0 ? <li>—</li> : admins.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Timeline({
  id,
  draft,
  onSetStatus,
}: {
  id: string;
  draft: Draft;
  onSetStatus: (s: DossierStatus) => void;
}) {
  const status = ((draft.workflow?.status as any) ?? "new") as DossierStatus;
  const history = loadStatusHistoryMock(id);
  const [showHistory, setShowHistory] = React.useState(false);

  const steps: Array<{ key: string; label: string; icon: any }> = [
    { key: "new", label: "Nouveau", icon: CircleDashed },
    { key: "in_progress", label: "En cours", icon: Clock3 },
    { key: "approved", label: "Approuvé", icon: BadgeCheck },
    { key: "cancelled", label: "Annulé", icon: XCircle },
  ];

  const idx = steps.findIndex((s) => s.key === status);
  const isCancelled = status === "cancelled";

  return (
    <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">Statut & suivi</p>
          <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
            Cliquez sur un statut pour mettre a jour le dossier (UI-only).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(steps as Array<{ key: DossierStatus; label: string }>).map((s) => {
            const active = s.key === status;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => onSetStatus(s.key)}
                className={[
                  "inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                  active
                    ? "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] text-[var(--color-primary)]"
                    : "border-[var(--color-sand)] bg-white/60 text-[rgba(43,43,43,0.80)] hover:bg-[var(--color-beige)]/60",
                ].join(" ")}
                aria-label={`Définir le statut: ${s.label}`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const active = i === idx;
          const done = i < idx && !isCancelled;
          const cancelled = s.key === "cancelled" && isCancelled;
          return (
            <div
              key={s.key}
              className={[
                "flex items-center justify-between rounded-2xl border px-4 py-3",
                cancelled
                  ? "border-[rgba(239,68,68,0.22)] bg-[rgba(239,68,68,0.10)]"
                  : done || active
                    ? "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.10)]"
                    : "border-[var(--color-sand)] bg-white/60",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" strokeWidth={2.2} />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{s.label}</p>
                  <p className="mt-0.5 text-xs text-[rgba(43,43,43,0.65)]">
                    {active || cancelled ? "Statut actuel" : done ? "Terminé" : "À venir"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-beige)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          onClick={() => setShowHistory((v) => !v)}
          aria-label={showHistory ? "Masquer l'historique" : "Voir l'historique"}
        >
          {showHistory ? "Masquer l’historique" : "Voir l’historique"}
        </button>
      </div>

      {showHistory && (
        <div className="mt-3 rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4">
          <p className="text-xs font-semibold text-[rgba(43,43,43,0.70)]">Historique</p>
          <div className="mt-3 grid gap-2 text-sm text-[var(--color-text)]">
            {history.length === 0 ? (
              <p className="text-sm text-[rgba(43,43,43,0.70)]">—</p>
            ) : (
              history.map((h, i) => (
                <div
                  key={`${h.status}-${h.at}-${i}`}
                  className="flex items-center justify-between rounded-2xl border border-[var(--color-sand)] bg-white/70 px-4 py-2"
                >
                  <span className="font-semibold">{h.status}</span>
                  <span className="text-xs text-[rgba(43,43,43,0.65)]">
                    {new Date(h.at).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Messages({ id }: { id: string }) {
  const [text, setText] = React.useState("");
  const [tick, setTick] = React.useState(0);
  const [dbMsgs, setDbMsgs] = React.useState<Array<any>>([]);

  const msgs = React.useMemo(() => {
    if (!isSupabaseConfigured()) return loadMessagesMock(id);
    return dbMsgs.map((m) => ({
      id: m.id,
      sender: m.sender,
      text: m.body,
      createdAt: m.created_at,
    }));
  }, [dbMsgs, id]);

  React.useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const run = async () => {
      try {
        const res = await fetch(`/api/admin/dossiers/${encodeURIComponent(id)}/messages`, {
          cache: "no-store",
        });
        const json = (await res.json()) as any;
        if (json?.ok) setDbMsgs(json.messages || []);
      } catch {
        // ignore
      }
    };
    run();
  }, [id, tick]);

  return (
    <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">Messages</p>
          <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
            {isSupabaseConfigured()
              ? "Admin ↔ client (Supabase)."
              : "Admin ↔ client (mock localStorage)."}
          </p>
        </div>
        <MessageCircle className="h-5 w-5 text-[var(--color-accent)]" strokeWidth={2.2} />
      </div>

      <div className="mt-4 grid gap-3">
        {msgs.length === 0 ? (
          <p className="text-sm text-[rgba(43,43,43,0.70)]">Aucun message.</p>
        ) : (
          msgs.map((m) => (
            <div
              key={m.id}
              className={[
                "max-w-[92%] rounded-2xl border px-4 py-3 text-sm",
                m.sender === "admin"
                  ? "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.10)] text-[var(--color-text)]"
                  : "ml-auto border-[var(--color-sand)] bg-white/60 text-[var(--color-text)]",
              ].join(" ")}
            >
              <p className="text-xs text-[rgba(43,43,43,0.65)]">
                {m.sender === "admin" ? "Admin" : "Client"} •{" "}
                {new Date(m.createdAt).toLocaleString()}
              </p>
              <p className="mt-1">{m.text}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
          placeholder="Répondre au client..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-50"
          disabled={!text.trim()}
          onClick={() => {
            const v = text.trim();
            if (!v) return;
            if (!isSupabaseConfigured()) {
              addMessageMock(id, { sender: "admin", text: v });
              setText("");
              setTick((t) => t + 1);
              return;
            }
            (async () => {
              try {
                await fetch(`/api/admin/dossiers/${encodeURIComponent(id)}/messages`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ body: v }),
                });
              } catch {
                // ignore
              } finally {
                setText("");
                setTick((t) => t + 1);
              }
            })();
          }}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}

const PLAN_BLOCKERS = [
  "Capital non suffisant",
  "Informations activité manquantes",
  "Charges mensuelles incomplètes",
  "Associés / administrateurs non renseignés",
  "Pièces d’identité manquantes",
  "Adresse / coordonnées incomplètes",
  "Autre",
];

function AdminSrlStages({
  id,
  draft,
  setDraft,
}: {
  id: string;
  draft: Draft;
  setDraft: (d: Draft) => void;
}) {
  const srl = draft.workflow?.srl;
  if (!srl) return null;

  const [open, setOpen] = React.useState<Record<string, boolean>>({
    dossier: true,
    plan: true,
    banque: true,
    domiciliation: true,
    comptable: true,
    notaire: true,
    rdv: true,
    facture: true,
    numero: true,
    tva: true,
    affiliation: true,
    final: true,
  });
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const update = (nextSrl: Draft["workflow"] extends infer W ? any : any) => {
    const next: Draft = {
      ...draft,
      workflow: { ...(draft.workflow ?? {}), srl: nextSrl },
      meta: { ...(draft.meta ?? {}), updatedAt: new Date().toISOString() },
    };
    setDraft(next);
  };

  const notifyClient = async (subject: string, text: string) => {
    const to = (draft.identite?.email || "").trim();
    if (!to || !to.includes("@")) {
      alert("Email client manquant dans le draft (Identité).");
      return;
    }
    try {
      const res = await fetch("/api/notify/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, text }),
      });
      const json = (await res.json()) as any;
      if (!json.ok) throw new Error(json.error || "Erreur envoi email");
      alert("Email envoyé au client.");
    } catch (e: any) {
      alert(e?.message || "Impossible d’envoyer l’email");
    }
  };

  const pushAdminMessage = async (text: string) => {
    if (!text.trim()) return;
    if (!isSupabaseConfigured()) {
      addMessageMock(id, { sender: "admin", text });
      return;
    }
    try {
      await fetch(`/api/admin/dossiers/${encodeURIComponent(id)}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
    } catch {
      // ignore
    }
  };

  const stageRow = (
    title: string,
    status: "pending" | "incomplete" | "done",
    onStatus: (s: "pending" | "incomplete" | "done") => void
  ) => (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-[var(--color-text)]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {(["pending", "incomplete", "done"] as const).map((s) => {
          const active = s === status;
          const label = s === "pending" ? "En attente" : s === "incomplete" ? "Incomplet" : "Terminé";
          return (
            <button
              key={s}
              type="button"
              onClick={() => onStatus(s)}
              className={[
                "inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                active
                  ? "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] text-[var(--color-primary)]"
                  : "border-[var(--color-sand)] bg-white/60 text-[rgba(43,43,43,0.80)] hover:bg-[var(--color-beige)]/60",
              ].join(" ")}
              aria-label={`Définir statut: ${label}`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-6 shadow-sm backdrop-blur">
      <p className="text-sm font-semibold text-[var(--color-text)]">Étapes SRL (admin)</p>
      <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
        Marquez “Incomplet” et expliquez ce qu’il manque.
      </p>

      <div className="mt-5 grid gap-3">
        {/* 1 */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
          <button
            type="button"
            onClick={() => toggle("dossier")}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">1 — Traitement du dossier</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">Réception et vérification.</p>
            </div>
            <span className="text-sm text-[rgba(43,43,43,0.70)]">{srl.dossier.status}</span>
          </button>
          {open.dossier && (
            <div className="border-t border-[var(--color-sand)] px-5 py-4">
              {stageRow("Statut", srl.dossier.status, (st) =>
                update({ ...srl, dossier: { ...srl.dossier, status: st } })
              )}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Note (si incomplet)
                </label>
                <textarea
                  className="min-h-[110px] w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="Expliquez ce qu’il manque…"
                  value={srl.dossier.adminNote ?? ""}
                  onChange={(e) =>
                    update({ ...srl, dossier: { ...srl.dossier, adminNote: e.target.value } })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* 2 */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
          <button
            type="button"
            onClick={() => toggle("plan")}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">2 — Préparation du plan financier</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">Blocages + upload plan.</p>
            </div>
            <span className="text-sm text-[rgba(43,43,43,0.70)]">{srl.planFinancier.status}</span>
          </button>
          {open.plan && (
            <div className="border-t border-[var(--color-sand)] px-5 py-4">
              {stageRow("Statut", srl.planFinancier.status, (st) =>
                update({ ...srl, planFinancier: { ...srl.planFinancier, status: st } })
              )}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Blocages (liste déroulante)</p>
                  <div className="mt-3 grid gap-2">
                    {PLAN_BLOCKERS.map((b) => {
                      const checked = !!srl.planFinancier.blockers?.includes(b);
                      return (
                        <label key={b} className="flex items-center gap-3 text-sm text-[var(--color-text)]">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-[var(--color-sand)]"
                            checked={checked}
                            onChange={(e) => {
                              const prev = srl.planFinancier.blockers ?? [];
                              const next = e.target.checked
                                ? Array.from(new Set([...prev, b]))
                                : prev.filter((x) => x !== b);
                              update({
                                ...srl,
                                planFinancier: { ...srl.planFinancier, blockers: next },
                              });
                            }}
                          />
                          {b}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Note (détails)</p>
                  <textarea
                    className="mt-3 min-h-[160px] w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                    placeholder="Expliquez le blocage (ex: apports insuffisants, infos manquantes…)…"
                    value={srl.planFinancier.adminNote ?? ""}
                    onChange={(e) =>
                      update({ ...srl, planFinancier: { ...srl.planFinancier, adminNote: e.target.value } })
                    }
                  />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                <p className="text-sm font-semibold text-[var(--color-text)]">Upload plan financier (mock)</p>
                <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                  On enregistre le nom du fichier. Plus tard: storage + lien.
                </p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95">
                    Uploader
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        if (!f) return;
                        update({
                          ...srl,
                          planFinancier: {
                            ...srl.planFinancier,
                            planFileName: f.name,
                            status: "done",
                            notifiedClient: true,
                          },
                        });
                        void pushAdminMessage(
                          `Votre plan financier est disponible sur la plateforme (${f.name}).`
                        );
                        notifyClient(
                          "Plan financier disponible",
                          `Votre plan financier est disponible sur la plateforme (${f.name}).`
                        );
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                  <p className="text-sm text-[rgba(43,43,43,0.75)]">
                    {srl.planFinancier.planFileName ? `Actuel: ${srl.planFinancier.planFileName}` : "Aucun fichier"}
                  </p>
                </div>
                <p className="mt-2 text-xs text-[rgba(43,43,43,0.65)]">
                  TODO backend: envoyer email/SMS (Resend/Twilio) au client.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3 */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
          <button
            type="button"
            onClick={() => toggle("banque")}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">3 — Attestation bancaire</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">Attestation ou alternative 3 mois.</p>
            </div>
            <span className="text-sm text-[rgba(43,43,43,0.70)]">{srl.banque.status}</span>
          </button>
          {open.banque && (
            <div className="border-t border-[var(--color-sand)] px-5 py-4">
              {stageRow("Statut", srl.banque.status, (st) =>
                update({ ...srl, banque: { ...srl.banque, status: st } })
              )}
              <div className="mt-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                <p className="text-sm font-semibold text-[var(--color-text)]">État client</p>
                <p className="mt-2 text-sm text-[rgba(43,43,43,0.75)]">
                  Attestation: {srl.banque.attestationFileName ? srl.banque.attestationFileName : "—"}
                </p>
                <p className="mt-1 text-sm text-[rgba(43,43,43,0.75)]">
                  Alternative 3 mois: {srl.banque.alternativeWithin3Months ? "Oui" : "Non"}
                </p>
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Note (si incomplet)
                </label>
                <textarea
                  className="min-h-[110px] w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="Expliquez ce qu’il manque…"
                  value={srl.banque.adminNote ?? ""}
                  onChange={(e) =>
                    update({ ...srl, banque: { ...srl.banque, adminNote: e.target.value } })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* 4 */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
          <button
            type="button"
            onClick={() => toggle("domiciliation")}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">4 — Domiciliation</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                Souhait du client + bail si nécessaire.
              </p>
            </div>
            <span className="text-sm text-[rgba(43,43,43,0.70)]">{srl.domiciliation.status}</span>
          </button>
          {open.domiciliation && (
            <div className="border-t border-[var(--color-sand)] px-5 py-4">
              {stageRow("Statut", srl.domiciliation.status, (st) =>
                update({ ...srl, domiciliation: { ...srl.domiciliation, status: st } })
              )}
              <div className="mt-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                <p className="text-sm font-semibold text-[var(--color-text)]">Infos client</p>
                <p className="mt-2 text-sm text-[rgba(43,43,43,0.75)]">
                  Domiciliation:{" "}
                  {srl.domiciliation.wantsDomiciliation === null
                    ? "—"
                    : srl.domiciliation.wantsDomiciliation
                      ? "Oui"
                      : "Non"}
                </p>
                <p className="mt-1 text-sm text-[rgba(43,43,43,0.75)]">
                  Bail: {srl.domiciliation.bailFileName ? srl.domiciliation.bailFileName : "—"}
                </p>
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Note (si incomplet)
                </label>
                <textarea
                  className="min-h-[110px] w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="Expliquez ce qu’il manque…"
                  value={srl.domiciliation.adminNote ?? ""}
                  onChange={(e) =>
                    update({
                      ...srl,
                      domiciliation: { ...srl.domiciliation, adminNote: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* 5 */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
          <button
            type="button"
            onClick={() => toggle("comptable")}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">5 — Comptable</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">Propositions + choix client.</p>
            </div>
            <span className="text-sm text-[rgba(43,43,43,0.70)]">{srl.comptable.status}</span>
          </button>
          {open.comptable && (
            <div className="border-t border-[var(--color-sand)] px-5 py-4">
              {stageRow("Statut", srl.comptable.status, (st) =>
                update({ ...srl, comptable: { ...srl.comptable, status: st } })
              )}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Comptables proposés</p>
                  <div className="mt-3 grid gap-2">
                    {(srl.comptable.proposals ?? []).length === 0 ? (
                      <p className="text-sm text-[rgba(43,43,43,0.70)]">—</p>
                    ) : (
                      (srl.comptable.proposals ?? []).map((p) => (
                        <div
                          key={p.name}
                          className="rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-3 text-sm"
                        >
                          <p className="font-semibold text-[var(--color-text)]">{p.name}</p>
                          <p className="mt-1 text-xs text-[rgba(43,43,43,0.65)]">
                            {p.city ?? "—"} {p.email ? `• ${p.email}` : ""}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="mt-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                    <p className="text-sm font-semibold text-[var(--color-text)]">Ajouter une proposition</p>
                    <div className="mt-3 grid gap-2">
                      <input
                        className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                        placeholder="Nom du comptable"
                        onBlur={(e) => {
                          const name = e.target.value.trim();
                          if (!name) return;
                          const prev = srl.comptable.proposals ?? [];
                          update({
                            ...srl,
                            comptable: {
                              ...srl.comptable,
                              proposals: Array.from(new Set([...prev.map((x) => x.name), name])).map((n) => {
                                const found = prev.find((p) => p.name === n);
                                return found ?? { name: n };
                              }),
                            },
                          });
                          e.target.value = "";
                        }}
                      />
                      <p className="text-xs text-[rgba(43,43,43,0.65)]">
                        (UI-only) Ajout rapide par nom. On raffinera plus tard.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Choix client</p>
                  <p className="mt-2 text-sm text-[rgba(43,43,43,0.75)]">
                    {srl.comptable.clientChoice
                      ? `${srl.comptable.clientChoice.mode}: ${srl.comptable.clientChoice.value}`
                      : "—"}
                  </p>
                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                      Note (si incomplet)
                    </label>
                    <textarea
                      className="min-h-[110px] w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                      placeholder="Expliquez ce qu’il manque…"
                      value={srl.comptable.adminNote ?? ""}
                      onChange={(e) =>
                        update({ ...srl, comptable: { ...srl.comptable, adminNote: e.target.value } })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6 */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
          <button
            type="button"
            onClick={() => toggle("notaire")}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">6 — Envoi du dossier au notaire</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">Upload dossier + statut.</p>
            </div>
            <span className="text-sm text-[rgba(43,43,43,0.70)]">{srl.notaire.status}</span>
          </button>
          {open.notaire && (
            <div className="border-t border-[var(--color-sand)] px-5 py-4">
              {stageRow("Statut", srl.notaire.status, (st) =>
                update({ ...srl, notaire: { ...srl.notaire, status: st } })
              )}
              <div className="mt-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                <p className="text-sm font-semibold text-[var(--color-text)]">Dossier notaire (mock)</p>
                <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                  On enregistre le nom du fichier.
                </p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95">
                    Uploader
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        if (!f) return;
                        update({
                          ...srl,
                          notaire: { ...srl.notaire, dossierFileName: f.name, status: "done" },
                        });
                        void pushAdminMessage("Dossier envoyé au notaire.");
                        notifyClient("Dossier envoyé au notaire", "Votre dossier a été transmis au notaire.");
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                  <p className="text-sm text-[rgba(43,43,43,0.75)]">
                    {srl.notaire.dossierFileName ? `Actuel: ${srl.notaire.dossierFileName}` : "Aucun fichier"}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Note (si incomplet)
                </label>
                <textarea
                  className="min-h-[110px] w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="Expliquez ce qu’il manque…"
                  value={srl.notaire.adminNote ?? ""}
                  onChange={(e) =>
                    update({ ...srl, notaire: { ...srl.notaire, adminNote: e.target.value } })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* 7 */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
          <button
            type="button"
            onClick={() => toggle("rdv")}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">7 — Rendez-vous notaire</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">Proposer + confirmation client.</p>
            </div>
            <span className="text-sm text-[rgba(43,43,43,0.70)]">{srl.rendezVous.status}</span>
          </button>
          {open.rdv && (
            <div className="border-t border-[var(--color-sand)] px-5 py-4">
              {stageRow("Statut", srl.rendezVous.status, (st) =>
                update({ ...srl, rendezVous: { ...srl.rendezVous, status: st } })
              )}
              <div className="mt-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                <p className="text-sm font-semibold text-[var(--color-text)]">Dates proposées</p>
                <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                  Séparez par virgule (ex: 2026-02-10 10:00, 2026-02-12 14:30)
                </p>
                <textarea
                  className="mt-3 min-h-[90px] w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  defaultValue={(srl.rendezVous.proposedDates ?? []).join(", ")}
                  onBlur={(e) => {
                    const raw = e.target.value;
                    const nextDates = raw
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean);
                    update({ ...srl, rendezVous: { ...srl.rendezVous, proposedDates: nextDates } });
                  }}
                />
                <p className="mt-3 text-sm text-[rgba(43,43,43,0.75)]">
                  Confirmé par le client: {srl.rendezVous.confirmedDate ? srl.rendezVous.confirmedDate : "—"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 8 */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
          <button
            type="button"
            onClick={() => toggle("facture")}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">8 — Facture notaire</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">Upload + confirmation client.</p>
            </div>
            <span className="text-sm text-[rgba(43,43,43,0.70)]">{srl.factureNotaire.status}</span>
          </button>
          {open.facture && (
            <div className="border-t border-[var(--color-sand)] px-5 py-4">
              {stageRow("Statut", srl.factureNotaire.status, (st) =>
                update({ ...srl, factureNotaire: { ...srl.factureNotaire, status: st } })
              )}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Upload facture (mock)</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95">
                      Uploader
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          if (!f) return;
                        update({
                          ...srl,
                          factureNotaire: { ...srl.factureNotaire, invoiceFileName: f.name },
                        });
                        void pushAdminMessage(`Facture notaire disponible (${f.name}).`);
                        notifyClient(
                          "Facture notaire disponible",
                          `Vous avez reçu la facture du notaire (${f.name}). Merci de la payer avant le rendez-vous et de confirmer dans votre espace client.`
                        );
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                    <p className="text-sm text-[rgba(43,43,43,0.75)]">
                      {srl.factureNotaire.invoiceFileName ? srl.factureNotaire.invoiceFileName : "Aucun fichier"}
                    </p>
                  </div>
                  <div className="mt-3">
                    <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                      Montant (optionnel)
                    </label>
                    <input
                      className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                      type="number"
                      value={String(srl.factureNotaire.invoiceAmount ?? 0)}
                      onChange={(e) =>
                        update({
                          ...srl,
                          factureNotaire: { ...srl.factureNotaire, invoiceAmount: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Confirmations client</p>
                  <p className="mt-2 text-sm text-[rgba(43,43,43,0.75)]">
                    Paiement: {srl.factureNotaire.clientConfirmedPaid ? "Oui" : "Non"}
                  </p>
                  <p className="mt-1 text-sm text-[rgba(43,43,43,0.75)]">
                    RDV confirmé: {srl.factureNotaire.clientConfirmedRdv ? "Oui" : "Non"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 9 */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
          <button
            type="button"
            onClick={() => toggle("numero")}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">9 — Numéro d’entreprise</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">Saisie du numéro + infos société.</p>
            </div>
            <span className="text-sm text-[rgba(43,43,43,0.70)]">{srl.numeroEntreprise.status}</span>
          </button>
          {open.numero && (
            <div className="border-t border-[var(--color-sand)] px-5 py-4">
              {stageRow("Statut", srl.numeroEntreprise.status, (st) =>
                update({ ...srl, numeroEntreprise: { ...srl.numeroEntreprise, status: st } })
              )}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                    Numéro d’entreprise
                  </label>
                  <input
                    className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                    value={srl.numeroEntreprise.enterpriseNumber ?? ""}
                    onChange={(e) =>
                      update({
                        ...srl,
                        numeroEntreprise: { ...srl.numeroEntreprise, enterpriseNumber: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                    Nom de la société
                  </label>
                  <input
                    className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                    value={srl.numeroEntreprise.companyName ?? ""}
                    onChange={(e) =>
                      update({
                        ...srl,
                        numeroEntreprise: { ...srl.numeroEntreprise, companyName: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 10 */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
          <button
            type="button"
            onClick={() => toggle("tva")}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">10 — Activation TVA</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">Upload 604A + info bureau stable.</p>
            </div>
            <span className="text-sm text-[rgba(43,43,43,0.70)]">{srl.tva.status}</span>
          </button>
          {open.tva && (
            <div className="border-t border-[var(--color-sand)] px-5 py-4">
              {stageRow("Statut", srl.tva.status, (st) =>
                update({ ...srl, tva: { ...srl.tva, status: st } })
              )}
              <div className="mt-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                <p className="text-sm font-semibold text-[var(--color-text)]">Infos client</p>
                <p className="mt-2 text-sm text-[rgba(43,43,43,0.75)]">
                  Bureau stable:{" "}
                  {srl.tva.hasStableOffice === null ? "—" : srl.tva.hasStableOffice ? "Oui" : "Non"}
                </p>
              </div>
              <div className="mt-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                <p className="text-sm font-semibold text-[var(--color-text)]">Attestation 604A (mock)</p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95">
                    Uploader
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        if (!f) return;
                        update({
                          ...srl,
                          tva: { ...srl.tva, attestation604AFileName: f.name, status: "done" },
                        });
                        void pushAdminMessage(`Attestation 604A disponible (${f.name}).`);
                        notifyClient(
                          "Attestation 604A disponible",
                          `Votre attestation 604A est disponible sur la plateforme (${f.name}).`
                        );
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                  <p className="text-sm text-[rgba(43,43,43,0.75)]">
                    {srl.tva.attestation604AFileName ? srl.tva.attestation604AFileName : "Aucun fichier"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 11 */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
          <button
            type="button"
            onClick={() => toggle("affiliation")}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">11 — Affiliation</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">Paiement (ex: 190€) + confirmation client.</p>
            </div>
            <span className="text-sm text-[rgba(43,43,43,0.70)]">{srl.affiliation.status}</span>
          </button>
          {open.affiliation && (
            <div className="border-t border-[var(--color-sand)] px-5 py-4">
              {stageRow("Statut", srl.affiliation.status, (st) =>
                update({ ...srl, affiliation: { ...srl.affiliation, status: st } })
              )}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                    Montant
                  </label>
                  <input
                    className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                    type="number"
                    value={String(srl.affiliation.amountDue ?? 190)}
                    onChange={(e) =>
                      update({
                        ...srl,
                        affiliation: { ...srl.affiliation, amountDue: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Client</p>
                  <p className="mt-2 text-sm text-[rgba(43,43,43,0.75)]">
                    Payé: {srl.affiliation.clientConfirmedPaid ? "Oui" : "Non"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 12 */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
          <button
            type="button"
            onClick={() => toggle("final")}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">12 — Dossier complet</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">Email comptable ou lien (1 mois).</p>
            </div>
            <span className="text-sm text-[rgba(43,43,43,0.70)]">{srl.finalDelivery.status}</span>
          </button>
          {open.final && (
            <div className="border-t border-[var(--color-sand)] px-5 py-4">
              {stageRow("Statut", srl.finalDelivery.status, (st) =>
                update({ ...srl, finalDelivery: { ...srl.finalDelivery, status: st } })
              )}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Mode</p>
                  <select
                    className="mt-3 w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                    value={srl.finalDelivery.deliveryMode ?? "download"}
                    onChange={(e) =>
                      update({
                        ...srl,
                        finalDelivery: { ...srl.finalDelivery, deliveryMode: e.target.value as any },
                      })
                    }
                  >
                    <option value="download">Lien</option>
                    <option value="email">Email</option>
                  </select>
                  <label className="mt-4 mb-2 block text-sm font-medium text-[var(--color-text)]">
                    Destination
                  </label>
                  <input
                    className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                    placeholder="Email ou libellé"
                    value={srl.finalDelivery.destination ?? ""}
                    onChange={(e) =>
                      update({
                        ...srl,
                        finalDelivery: { ...srl.finalDelivery, destination: e.target.value },
                      })
                    }
                  />
                  <label className="mt-4 mb-2 block text-sm font-medium text-[var(--color-text)]">
                    Jours disponibles
                  </label>
                  <input
                    className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                    type="number"
                    value={String(srl.finalDelivery.availableDays ?? 30)}
                    onChange={(e) =>
                      update({
                        ...srl,
                        finalDelivery: { ...srl.finalDelivery, availableDays: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Lien (mock)</p>
                  <input
                    className="mt-3 w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                    value={srl.finalDelivery.downloadLinkMock ?? ""}
                    onChange={(e) =>
                      update({
                        ...srl,
                        finalDelivery: { ...srl.finalDelivery, downloadLinkMock: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
                  Note
                </label>
                <textarea
                  className="min-h-[110px] w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  value={srl.finalDelivery.adminNote ?? ""}
                  onChange={(e) =>
                    update({ ...srl, finalDelivery: { ...srl.finalDelivery, adminNote: e.target.value } })
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const mockType = typeFromId(id);
  const [mounted, setMounted] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft | null>(null);
  const [type, setType] = React.useState<CreationType | null>(mockType);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (!isSupabaseConfigured()) {
      setType(mockType);
      setDraft(mockType ? loadDossierMock(mockType) : null);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/admin/dossiers/${encodeURIComponent(id)}`, {
          cache: "no-store",
        });
        const json = (await res.json()) as any;
        if (!json?.ok || !json?.dossier) {
          setType(null);
          setDraft(null);
          return;
        }
        const t = (json.dossier.type as CreationType) || null;
        setType(t);
        const next = (json.dossier.draft ?? {}) as any;
        if (t && !next.type) next.type = t;
        setDraft(next as Draft);
      } catch {
        setType(null);
        setDraft(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, mockType]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--color-beige)]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">Chargement…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!type || !draft) {
    return (
      <div className="min-h-screen bg-[var(--color-beige)]">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <Link
            href="/admin/dossiers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
            Retour
          </Link>
          <div className="mt-6 rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              {loading ? "Chargement…" : "Dossier introuvable"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const persist = async (next: Draft) => {
    setDraft(next);
    if (!isSupabaseConfigured()) {
      persistDossierMock(type, next);
      return;
    }
    try {
      await fetch(`/api/admin/dossiers/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: (next.workflow?.status as any) ?? undefined,
          draft: next,
        }),
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/admin/dossiers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
            Retour
          </Link>
          <div className="text-right">
            <p className="text-sm text-[rgba(43,43,43,0.70)]">Dossier</p>
            <p className="text-lg font-semibold text-[var(--color-text)]">
              {type === "srl" ? "Créer une SRL" : "Indépendant (nom propre)"}
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Timeline
              id={id}
              draft={draft}
              onSetStatus={(s) => {
                const next: Draft = {
                  ...draft,
                  workflow: { ...(draft.workflow ?? {}), status: s },
                };
                void persist(next);
                if (!isSupabaseConfigured()) {
                  // Keep mock history in sync.
                  setDraftWorkflowStatusMock(type, s);
                  setDraft(loadDossierMock(type));
                }
              }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.03 }}>
            {type === "srl" ? (
              <AdminSrlStages id={id} draft={draft} setDraft={(d) => void persist(d)} />
            ) : (
              <DocsBlock draft={draft} />
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.06 }}>
            <Messages id={id} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
