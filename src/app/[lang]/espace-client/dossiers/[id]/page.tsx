"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  CircleDashed,
  Clock3,
  MessageCircle,
  XCircle,
} from "lucide-react";
import React from "react";
import {
  addMessage,
  dossierId,
  loadDossier,
  loadMessages,
  persistDossier,
} from "@/lib/mock-dossiers";
import type { CreationType, Draft } from "@/app/[lang]/onboarding/creation-entreprise/types";
import { applyPromoToAmountEUR, findPromoCode, normalizePromoCode } from "@/lib/mock-promos";
import { isSupabaseConfigured } from "@/lib/env";
import { normalizeLang } from "@/lib/i18n";

function typeFromId(id: string): CreationType | null {
  if (id === dossierId("srl")) return "srl";
  if (id === dossierId("pp")) return "pp";
  return null;
}

function Timeline({ draft }: { draft: Draft }) {
  const status = (draft.workflow?.status as any) ?? "new";

  const stagePill = (st: "pending" | "incomplete" | "done") => {
    const map: Record<string, string> = {
      pending: "border-[var(--color-sand)] bg-white/60 text-[rgba(43,43,43,0.75)]",
      incomplete:
        "border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] text-[rgb(146,64,14)]",
      done: "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] text-[var(--color-accent)]",
    };
    const label =
      st === "pending" ? "En attente" : st === "incomplete" ? "Incomplet" : "Terminé";
    const Icon = st === "done" ? BadgeCheck : st === "incomplete" ? XCircle : Clock3;
    return (
      <span
        className={[
          "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm",
          map[st],
        ].join(" ")}
      >
        <Icon className="h-4 w-4" strokeWidth={2.2} />
        {label}
      </span>
    );
  };

  const isSrl = draft.type === "srl" && !!draft.workflow?.srl;
  const srl = draft.workflow?.srl;

  return (
    <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-6 shadow-sm backdrop-blur">
      <p className="text-sm font-semibold text-[var(--color-text)]">
        Suivi de votre dossier
      </p>
      <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
        Voici l’évolution de votre demande (UI-only).
      </p>

      <div className="mt-5 grid gap-3">
        {isSrl && srl ? (
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4">
              <p className="text-sm font-semibold text-[var(--color-text)]">
                1 — Traitement du dossier
              </p>
              <p className="mt-1 text-xs text-[rgba(43,43,43,0.65)]">
                Réception et vérification
              </p>
              <div className="mt-3">{stagePill(srl.dossier.status)}</div>
            </div>
            <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4">
              <p className="text-sm font-semibold text-[var(--color-text)]">
                2 — Préparation du plan financier
              </p>
              <p className="mt-1 text-xs text-[rgba(43,43,43,0.65)]">
                Analyse + plan sur la plateforme
              </p>
              <div className="mt-3">{stagePill(srl.planFinancier.status)}</div>
            </div>
            <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4">
              <p className="text-sm font-semibold text-[var(--color-text)]">
                3 — Attestation bancaire
              </p>
              <p className="mt-1 text-xs text-[rgba(43,43,43,0.65)]">
                Attestation ou alternative 3 mois
              </p>
              <div className="mt-3">{stagePill(srl.banque.status)}</div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4">
            <p className="text-sm font-semibold text-[var(--color-text)]">Statut</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              {status === "new"
                ? "Nouveau"
                : status === "in_progress"
                  ? "En cours"
                  : status === "approved"
                    ? "Approuvé"
                    : "Annulé"}
            </p>
          </div>
        )}

        {/* Client view: hide raw history to keep it simple/premium. */}
      </div>
    </div>
  );
}

function SrlStages({
  id,
  dossierUuid,
  draft,
  setDraft,
}: {
  id: string;
  dossierUuid: string | null;
  draft: Draft;
  setDraft: (d: Draft) => void;
}) {
  const srl = draft.workflow?.srl;
  if (!srl) return null;

  const persistClientDraft = (next: Draft, messageText?: string) => {
    setDraft(next);
    if (isSupabaseConfigured() && dossierUuid) {
      void fetch(`/api/dossiers/${encodeURIComponent(dossierUuid)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: next }),
      });
      if (messageText) {
        void fetch(`/api/dossiers/${encodeURIComponent(dossierUuid)}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: messageText }),
        });
      }
      return;
    }
    persistDossier("srl", next);
    if (messageText) addMessage(id, { sender: "client", text: messageText });
  };

  const [open, setOpen] = React.useState<Record<string, boolean>>({
    dossier: true,
    plan: true,
    banque: true,
    domiciliation: true,
    comptable: true,
  });

  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  // Client visibility rule:
  // - Always show step 1
  // - Show next steps only when previous step is done
  const canSeePlan = srl.dossier.status === "done";
  const canSeeBanque = canSeePlan && srl.planFinancier.status === "done";
  // Per requirement: steps 4 (domiciliation) and 5 (comptable) are always accessible to the client.
  const canSeeDomiciliation = true;
  const canSeeComptable = true;
  // Steps 6+ remain sequential (need previous steps completed).
  const canSeeNotaire =
    canSeeBanque &&
    srl.banque.status === "done" &&
    srl.domiciliation.status === "done" &&
    srl.comptable.status === "done";
  const canSeeRdv = canSeeNotaire && srl.notaire.status === "done";
  const canSeeFacture = canSeeRdv && srl.rendezVous.status === "done";
  const canSeeNumero = canSeeFacture && srl.factureNotaire.status === "done";
  const canSeeTva = canSeeNumero && srl.numeroEntreprise.status === "done";
  const canSeeAffiliation = canSeeTva && srl.tva.status === "done";
  const canSeeFinal = canSeeAffiliation && srl.affiliation.status === "done";

  const stagePill = (status: "pending" | "incomplete" | "done") => {
    const map: Record<string, string> = {
      pending: "border-[var(--color-sand)] bg-white/60 text-[rgba(43,43,43,0.75)]",
      incomplete:
        "border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] text-[rgb(146,64,14)]",
      done: "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] text-[var(--color-accent)]",
    };
    const label = status === "pending" ? "En attente" : status === "incomplete" ? "Incomplet" : "Terminé";
    return (
      <span className={["inline-flex items-center rounded-full border px-3 py-1 text-sm", map[status]].join(" ")}>
        {label}
      </span>
    );
  };

  const onUploadAttestation = (file: File | null) => {
    if (!file) return;
    const next: Draft = {
      ...draft,
      workflow: {
        ...(draft.workflow ?? {}),
        srl: {
          ...srl,
          banque: {
            ...srl.banque,
            attestationFileName: file.name,
            alternativeWithin3Months: false,
            status: "pending",
          },
        },
      },
    };
    persistClientDraft(next, `J’ai ajouté l’attestation bancaire: ${file.name}`);
  };

  const onToggleAlternative = (v: boolean) => {
    const next: Draft = {
      ...draft,
      workflow: {
        ...(draft.workflow ?? {}),
        srl: {
          ...srl,
          banque: {
            ...srl.banque,
            alternativeWithin3Months: v,
            attestationFileName: v ? "" : srl.banque.attestationFileName,
          },
        },
      },
    };
    persistClientDraft(next);
  };

  const onToggleDomiciliation = (v: boolean) => {
    const next: Draft = {
      ...draft,
      workflow: {
        ...(draft.workflow ?? {}),
        srl: {
          ...srl,
          domiciliation: {
            ...srl.domiciliation,
            wantsDomiciliation: v,
            bailFileName: v ? "" : srl.domiciliation.bailFileName,
          },
        },
      },
    };
    persistClientDraft(next);
  };

  const onUploadBail = (file: File | null) => {
    if (!file) return;
    const next: Draft = {
      ...draft,
      workflow: {
        ...(draft.workflow ?? {}),
        srl: {
          ...srl,
          domiciliation: { ...srl.domiciliation, bailFileName: file.name },
        },
      },
    };
    persistClientDraft(next, `J’ai ajouté le bail: ${file.name}`);
  };

  const onChooseAccountant = (mode: "proposed" | "already", value: string) => {
    const next: Draft = {
      ...draft,
      workflow: {
        ...(draft.workflow ?? {}),
        srl: {
          ...srl,
          comptable: { ...srl.comptable, clientChoice: { mode, value } },
        },
      },
    };
    persistClientDraft(
      next,
      mode === "proposed"
        ? `J’ai choisi un comptable proposé: ${value}`
        : `J’ai déjà un comptable: ${value}`
    );
  };

  const onConfirmRdv = (date: string) => {
    const next: Draft = {
      ...draft,
      workflow: {
        ...(draft.workflow ?? {}),
        srl: { ...srl, rendezVous: { ...srl.rendezVous, confirmedDate: date } },
      },
    };
    persistClientDraft(next);
  };

  const onConfirmPaidNotaire = (v: boolean) => {
    const next: Draft = {
      ...draft,
      workflow: {
        ...(draft.workflow ?? {}),
        srl: {
          ...srl,
          factureNotaire: { ...srl.factureNotaire, clientConfirmedPaid: v },
        },
      },
    };
    persistClientDraft(next);
  };

  const onConfirmRdvFinal = (v: boolean) => {
    const next: Draft = {
      ...draft,
      workflow: {
        ...(draft.workflow ?? {}),
        srl: {
          ...srl,
          factureNotaire: { ...srl.factureNotaire, clientConfirmedRdv: v },
        },
      },
    };
    persistClientDraft(next);
  };

  const onHasStableOffice = (v: boolean) => {
    const next: Draft = {
      ...draft,
      workflow: {
        ...(draft.workflow ?? {}),
        srl: { ...srl, tva: { ...srl.tva, hasStableOffice: v } },
      },
    };
    persistClientDraft(next);
  };

  const onConfirmAffiliationPaid = (v: boolean) => {
    const next: Draft = {
      ...draft,
      workflow: {
        ...(draft.workflow ?? {}),
        srl: { ...srl, affiliation: { ...srl.affiliation, clientConfirmedPaid: v } },
      },
    };
    persistClientDraft(next);
  };

  return (
    <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-6 shadow-sm backdrop-blur">
      <p className="text-sm font-semibold text-[var(--color-text)]">Étapes SRL</p>
      <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
        Les étapes se débloquent au fur et à mesure (vous gardez l’historique).
      </p>

      <div className="mt-5 grid gap-3">
        {/* 1) Traitement du dossier */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
          <button
            type="button"
            onClick={() => toggle("dossier")}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            aria-label="Ouvrir l'étape Traitement du dossier"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">1 — Traitement du dossier</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                Moment où vous envoyez votre demande.
              </p>
            </div>
            {stagePill(srl.dossier.status)}
          </button>
          {open.dossier && (
            <div className="border-t border-[var(--color-sand)] px-5 py-4">
              {srl.dossier.status === "incomplete" && srl.dossier.adminNote ? (
                <div className="rounded-2xl border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] p-4 text-sm text-[rgb(146,64,14)]">
                  <p className="font-semibold">Votre dossier est incomplet</p>
                  <p className="mt-1">{srl.dossier.adminNote}</p>
                </div>
              ) : (
                <p className="text-sm text-[rgba(43,43,43,0.72)]">
                  Nous analysons votre dossier et revenons vers vous si une information manque.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 2) Plan financier */}
        {canSeePlan ? (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
            <button
              type="button"
              onClick={() => toggle("plan")}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              aria-label="Ouvrir l'étape Préparation du plan financier"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  2 — Préparation du plan financier
                </p>
                <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                  Nous préparons votre plan et le mettons sur la plateforme.
                </p>
              </div>
              {stagePill(srl.planFinancier.status)}
            </button>
            {open.plan && (
              <div className="border-t border-[var(--color-sand)] px-5 py-4">
                {srl.planFinancier.status === "incomplete" ? (
                  <div className="rounded-2xl border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] p-4 text-sm text-[rgb(146,64,14)]">
                    <p className="font-semibold">Plan financier bloqué</p>
                    {srl.planFinancier.blockers && srl.planFinancier.blockers.length > 0 && (
                      <p className="mt-1">
                        Blocage:{" "}
                        <span className="font-semibold">
                          {srl.planFinancier.blockers.join(", ")}
                        </span>
                      </p>
                    )}
                    {srl.planFinancier.adminNote ? (
                      <p className="mt-2">{srl.planFinancier.adminNote}</p>
                    ) : null}
                  </div>
                ) : null}

                {srl.planFinancier.planFileName ? (
                  <div className="mt-3 rounded-2xl border border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] p-4 text-sm text-[var(--color-text)]">
                    <p className="font-semibold">Votre plan financier est disponible</p>
                    <p className="mt-1 text-[rgba(43,43,43,0.75)]">
                      Fichier: {srl.planFinancier.planFileName}
                    </p>
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center justify-center rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-beige)]"
                      onClick={() =>
                        alert("UI-only: téléchargement à connecter au storage plus tard")
                      }
                    >
                      Télécharger
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-[rgba(43,43,43,0.72)]">
                    Dès qu’il est prêt, vous le verrez ici.
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/40 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              2 — Préparation du plan financier
            </p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Cette étape s’ouvre après la fin du traitement du dossier.
            </p>
          </div>
        )}

        {/* 3) Attestation bancaire */}
        {canSeeBanque ? (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
            <button
              type="button"
              onClick={() => toggle("banque")}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              aria-label="Ouvrir l'étape Attestation bancaire"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  3 — Attestation bancaire
                </p>
                <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                  Vous ajoutez l’attestation ou vous choisissez l’alternative 3 mois.
                </p>
              </div>
              {stagePill(srl.banque.status)}
            </button>
            {open.banque && (
              <div className="border-t border-[var(--color-sand)] px-5 py-4">
                <div className="grid gap-3">
                  <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4">
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      Uploader l’attestation bancaire
                    </p>
                    <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                      UI-only: on stocke le nom du fichier.
                    </p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95">
                        Choisir un fichier
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            onUploadAttestation(f);
                            e.currentTarget.value = "";
                          }}
                        />
                      </label>
                      <p className="text-sm text-[rgba(43,43,43,0.75)]">
                        {srl.banque.attestationFileName
                          ? `Ajouté: ${srl.banque.attestationFileName}`
                          : "Aucun fichier"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4">
                    <p className="text-sm font-semibold text-[var(--color-text)]">Alternative</p>
                    <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                      Si vous ne trouvez pas de banque maintenant, vous pouvez ouvrir le compte dans les 3 mois.
                    </p>
                    <label className="mt-3 inline-flex items-center gap-3 text-sm font-semibold text-[var(--color-text)]">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-[var(--color-sand)]"
                        checked={!!srl.banque.alternativeWithin3Months}
                        onChange={(e) => onToggleAlternative(e.target.checked)}
                        aria-label="Choisir l'alternative 3 mois"
                      />
                      J’ouvrirai un compte dans les 3 mois (alternative)
                    </label>
                  </div>

                  {srl.banque.status === "incomplete" && srl.banque.adminNote ? (
                    <div className="rounded-2xl border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] p-4 text-sm text-[rgb(146,64,14)]">
                      <p className="font-semibold">Information manquante</p>
                      <p className="mt-1">{srl.banque.adminNote}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/40 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              3 — Attestation bancaire
            </p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Cette étape s’ouvre après la validation du plan financier.
            </p>
          </div>
        )}

        {/* 4) Domiciliation (always accessible) */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
            <button
              type="button"
              onClick={() => toggle("domiciliation")}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              aria-label="Ouvrir l'étape Domiciliation"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">4 — Domiciliation</p>
                <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                  Souhaitez-vous une domiciliation ?
                </p>
              </div>
              {stagePill(srl.domiciliation.status)}
            </button>
            {open.domiciliation && (
              <div className="border-t border-[var(--color-sand)] px-5 py-4">
                <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    Domiciliation
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={[
                        "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                        srl.domiciliation.wantsDomiciliation === true
                          ? "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] text-[var(--color-primary)]"
                          : "border-[var(--color-sand)] bg-white/60 text-[rgba(43,43,43,0.80)] hover:bg-[var(--color-beige)]/60",
                      ].join(" ")}
                      onClick={() => onToggleDomiciliation(true)}
                    >
                      Oui
                    </button>
                    <button
                      type="button"
                      className={[
                        "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                        srl.domiciliation.wantsDomiciliation === false
                          ? "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] text-[var(--color-primary)]"
                          : "border-[var(--color-sand)] bg-white/60 text-[rgba(43,43,43,0.80)] hover:bg-[var(--color-beige)]/60",
                      ].join(" ")}
                      onClick={() => onToggleDomiciliation(false)}
                    >
                      Non
                    </button>
                  </div>

                  {srl.domiciliation.wantsDomiciliation === true ? (
                    <p className="mt-3 text-sm text-[rgba(43,43,43,0.72)]">
                      Tarifs a venir. Nous vous proposerons une solution.
                    </p>
                  ) : srl.domiciliation.wantsDomiciliation === false ? (
                    <div className="mt-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                      <p className="text-sm font-semibold text-[var(--color-text)]">
                        Envoyer votre bail
                      </p>
                      <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                        UI-only: on stocke le nom du fichier.
                      </p>
                      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95">
                          Choisir un fichier
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              onUploadBail(e.target.files?.[0] ?? null);
                              e.currentTarget.value = "";
                            }}
                          />
                        </label>
                        <p className="text-sm text-[rgba(43,43,43,0.75)]">
                          {srl.domiciliation.bailFileName
                            ? `Ajouté: ${srl.domiciliation.bailFileName}`
                            : "Aucun fichier"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-[rgba(43,43,43,0.72)]">
                      Choisissez Oui ou Non.
                    </p>
                  )}

                  {srl.domiciliation.status === "incomplete" && srl.domiciliation.adminNote ? (
                    <div className="mt-4 rounded-2xl border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] p-4 text-sm text-[rgb(146,64,14)]">
                      <p className="font-semibold">Information manquante</p>
                      <p className="mt-1">{srl.domiciliation.adminNote}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
        </div>

        {/* 5) Comptable (always accessible) */}
        <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60">
            <button
              type="button"
              onClick={() => toggle("comptable")}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              aria-label="Ouvrir l'étape Comptable"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">5 — Comptable</p>
                <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                  Choisissez un comptable (ou indiquez le vôtre).
                </p>
              </div>
              {stagePill(srl.comptable.status)}
            </button>
            {open.comptable && (
              <div className="border-t border-[var(--color-sand)] px-5 py-4">
                <div className="grid gap-4">
                  <div className="rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                    <p className="text-sm font-semibold text-[var(--color-text)]">Comptables proposés</p>
                    <div className="mt-3 grid gap-2">
                      {(srl.comptable.proposals ?? []).map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          className="flex items-center justify-between rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-3 text-left text-sm transition hover:bg-[var(--color-beige)]/60"
                          onClick={() => onChooseAccountant("proposed", p.name)}
                        >
                          <span className="font-semibold text-[var(--color-text)]">{p.name}</span>
                          <span className="text-xs text-[rgba(43,43,43,0.65)]">{p.city ?? ""}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                    <p className="text-sm font-semibold text-[var(--color-text)]">J’ai déjà un comptable</p>
                    <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                      Indiquez son email ou son nom.
                    </p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <input
                        className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                        placeholder="Email ou nom du comptable"
                        defaultValue={srl.comptable.clientChoice?.mode === "already" ? srl.comptable.clientChoice.value : ""}
                        onBlur={(e) => {
                          const v = e.target.value.trim();
                          if (v) onChooseAccountant("already", v);
                        }}
                      />
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                        onClick={() => {
                          const el = document.activeElement as HTMLInputElement | null;
                          // No-op; blur handler stores the value.
                          el?.blur();
                        }}
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>

                  {srl.comptable.clientChoice ? (
                    <div className="rounded-2xl border border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] p-4 text-sm text-[var(--color-text)]">
                      <p className="font-semibold">Choix enregistré</p>
                      <p className="mt-1 text-[rgba(43,43,43,0.75)]">
                        {srl.comptable.clientChoice.mode === "proposed"
                          ? `Comptable proposé: ${srl.comptable.clientChoice.value}`
                          : `Comptable (fourni par vous): ${srl.comptable.clientChoice.value}`}
                      </p>
                    </div>
                  ) : null}

                  {srl.comptable.status === "incomplete" && srl.comptable.adminNote ? (
                    <div className="rounded-2xl border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] p-4 text-sm text-[rgb(146,64,14)]">
                      <p className="font-semibold">Information manquante</p>
                      <p className="mt-1">{srl.comptable.adminNote}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
        </div>

        {/* 6) Envoi au notaire */}
        {canSeeNotaire ? (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">6 — Envoi au notaire</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Nous transmettons votre dossier au notaire.
            </p>
            <div className="mt-3">{stagePill(srl.notaire.status)}</div>
            {srl.notaire.status === "incomplete" && srl.notaire.adminNote ? (
              <div className="mt-4 rounded-2xl border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] p-4 text-sm text-[rgb(146,64,14)]">
                <p className="font-semibold">Information manquante</p>
                <p className="mt-1">{srl.notaire.adminNote}</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/40 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">6 — Envoi au notaire</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Cette étape s’ouvre après le choix du comptable.
            </p>
          </div>
        )}

        {/* 7) Rendez-vous notaire */}
        {canSeeRdv ? (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">7 — Rendez-vous notaire</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Choisissez une proposition de rendez-vous.
            </p>
            <div className="mt-3">{stagePill(srl.rendezVous.status)}</div>
            <div className="mt-4 grid gap-2">
              {(srl.rendezVous.proposedDates ?? []).length === 0 ? (
                <p className="text-sm text-[rgba(43,43,43,0.72)]">En attente de propositions.</p>
              ) : (
                (srl.rendezVous.proposedDates ?? []).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onConfirmRdv(d)}
                    className={[
                      "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition",
                      srl.rendezVous.confirmedDate === d
                        ? "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] text-[var(--color-primary)]"
                        : "border-[var(--color-sand)] bg-white/60 text-[var(--color-text)] hover:bg-[var(--color-beige)]/60",
                    ].join(" ")}
                  >
                    {d}
                  </button>
                ))
              )}
            </div>
            {srl.rendezVous.confirmedDate ? (
              <p className="mt-3 text-sm text-[rgba(43,43,43,0.72)]">
                Rendez-vous choisi: <span className="font-semibold">{srl.rendezVous.confirmedDate}</span>
              </p>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/40 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">7 — Rendez-vous notaire</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Cette étape s’ouvre après l’envoi au notaire.
            </p>
          </div>
        )}

        {/* 8) Facture notaire */}
        {canSeeFacture ? (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">8 — Facture du notaire</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Avant le rendez-vous: facture + confirmation de paiement.
            </p>
            <div className="mt-3">{stagePill(srl.factureNotaire.status)}</div>

            {srl.factureNotaire.invoiceFileName ? (
              <div className="mt-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
                <p className="text-sm font-semibold text-[var(--color-text)]">Facture disponible</p>
                <p className="mt-1 text-sm text-[rgba(43,43,43,0.75)]">
                  {srl.factureNotaire.invoiceFileName}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[rgba(43,43,43,0.72)]">En attente de la facture.</p>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="inline-flex items-center gap-3 rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-3 text-sm font-semibold text-[var(--color-text)]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--color-sand)]"
                  checked={!!srl.factureNotaire.clientConfirmedPaid}
                  onChange={(e) => onConfirmPaidNotaire(e.target.checked)}
                />
                J’ai payé la facture du notaire
              </label>
              <label className="inline-flex items-center gap-3 rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-3 text-sm font-semibold text-[var(--color-text)]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--color-sand)]"
                  checked={!!srl.factureNotaire.clientConfirmedRdv}
                  onChange={(e) => onConfirmRdvFinal(e.target.checked)}
                />
                Je confirme le rendez-vous
              </label>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/40 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">8 — Facture du notaire</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Cette étape s’ouvre après le rendez-vous notaire.
            </p>
          </div>
        )}

        {/* 9) Numéro d'entreprise */}
        {canSeeNumero ? (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">9 — Numéro d’entreprise</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              En attente du numéro d’entreprise (souvent ~48h).
            </p>
            <div className="mt-3">{stagePill(srl.numeroEntreprise.status)}</div>
            {srl.numeroEntreprise.enterpriseNumber ? (
              <div className="mt-4 rounded-2xl border border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] p-4">
                <p className="text-sm font-semibold text-[var(--color-text)]">Félicitations 🎉</p>
                <p className="mt-1 text-sm text-[rgba(43,43,43,0.75)]">
                  Numéro d’entreprise:{" "}
                  <span className="font-semibold">{srl.numeroEntreprise.enterpriseNumber}</span>
                </p>
                {srl.numeroEntreprise.companyName ? (
                  <p className="mt-1 text-sm text-[rgba(43,43,43,0.75)]">
                    Société: <span className="font-semibold">{srl.numeroEntreprise.companyName}</span>
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/40 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">9 — Numéro d’entreprise</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Cette étape s’ouvre après la facture notaire.
            </p>
          </div>
        )}

        {/* 10) Activation TVA */}
        {canSeeTva ? (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">10 — Activation TVA</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              La société doit avoir un bureau / endroit stable physique.
            </p>
            <div className="mt-3">{stagePill(srl.tva.status)}</div>
            <div className="mt-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
              <p className="text-sm font-semibold text-[var(--color-text)]">Votre situation</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className={[
                    "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                    srl.tva.hasStableOffice === true
                      ? "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] text-[var(--color-primary)]"
                      : "border-[var(--color-sand)] bg-white/60 text-[rgba(43,43,43,0.80)] hover:bg-[var(--color-beige)]/60",
                  ].join(" ")}
                  onClick={() => onHasStableOffice(true)}
                >
                  J’ai un endroit stable
                </button>
                <button
                  type="button"
                  className={[
                    "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                    srl.tva.hasStableOffice === false
                      ? "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] text-[var(--color-primary)]"
                      : "border-[var(--color-sand)] bg-white/60 text-[rgba(43,43,43,0.80)] hover:bg-[var(--color-beige)]/60",
                  ].join(" ")}
                  onClick={() => onHasStableOffice(false)}
                >
                  Pas encore
                </button>
              </div>
            </div>
            {srl.tva.attestation604AFileName ? (
              <div className="mt-4 rounded-2xl border border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] p-4 text-sm text-[var(--color-text)]">
                <p className="font-semibold">Attestation 604A disponible</p>
                <p className="mt-1 text-[rgba(43,43,43,0.75)]">{srl.tva.attestation604AFileName}</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/40 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">10 — Activation TVA</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Cette étape s’ouvre après le numéro d’entreprise.
            </p>
          </div>
        )}

        {/* 11) Affiliation */}
        {canSeeAffiliation ? (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">11 — Affiliation</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Vous recevrez une demande de paiement (ex: {srl.affiliation.amountDue ?? 190}€).
            </p>
            <div className="mt-3">{stagePill(srl.affiliation.status)}</div>
            <label className="mt-4 inline-flex items-center gap-3 rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-3 text-sm font-semibold text-[var(--color-text)]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--color-sand)]"
                checked={!!srl.affiliation.clientConfirmedPaid}
                onChange={(e) => onConfirmAffiliationPaid(e.target.checked)}
              />
              J’ai payé l’affiliation
            </label>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/40 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">11 — Affiliation</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Cette étape s’ouvre après l’activation TVA.
            </p>
          </div>
        )}

        {/* 12) Dossier complet */}
        {canSeeFinal ? (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">12 — Dossier complet</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Récupération des documents (ex: 1 mois).
            </p>
            <div className="mt-3">{stagePill(srl.finalDelivery.status)}</div>
            <div className="mt-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-4">
              <p className="text-sm font-semibold text-[var(--color-text)]">Accès</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.75)]">
                {srl.finalDelivery.deliveryMode === "email"
                  ? `Email: ${srl.finalDelivery.destination || "—"}`
                  : `Lien: ${srl.finalDelivery.downloadLinkMock || "—"}`}
              </p>
              <p className="mt-1 text-xs text-[rgba(43,43,43,0.65)]">
                Disponible {srl.finalDelivery.availableDays ?? 30} jours (mock).
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/40 p-5">
            <p className="text-sm font-semibold text-[var(--color-text)]">12 — Dossier complet</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Cette étape s’ouvre après l’affiliation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DocsBlock({ draft }: { draft: Draft }) {
  const founders = draft.docs.foundersIds ?? [];
  const admins = draft.docs.adminsIds ?? [];
  return (
    <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-6 shadow-sm backdrop-blur">
      <p className="text-sm font-semibold text-[var(--color-text)]">Documents (UI-only)</p>
      <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
        On stocke uniquement les noms des fichiers pour l’instant.
      </p>

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

      {draft.docs.notes ? (
        <div className="mt-4 rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4">
          <p className="text-xs text-[rgba(43,43,43,0.70)]">Note</p>
          <p className="mt-1 text-sm text-[var(--color-text)]">{draft.docs.notes}</p>
        </div>
      ) : null}
    </div>
  );
}

function Messages({ id, dossierUuid }: { id: string; dossierUuid: string | null }) {
  const [text, setText] = React.useState("");
  const [tick, setTick] = React.useState(0);
  const [dbMsgs, setDbMsgs] = React.useState<Array<any>>([]);

  const msgs = React.useMemo(() => {
    if (!isSupabaseConfigured() || !dossierUuid) return loadMessages(id);
    return dbMsgs.map((m) => ({
      id: m.id,
      sender: m.sender,
      text: m.body,
      createdAt: m.created_at,
    }));
  }, [dbMsgs, dossierUuid, id]);

  React.useEffect(() => {
    if (!isSupabaseConfigured() || !dossierUuid) return;

    let stop = false;
    const fetchMsgs = async () => {
      try {
        const res = await fetch(`/api/dossiers/${encodeURIComponent(dossierUuid)}/messages`, {
          cache: "no-store",
        });
        const json = (await res.json()) as any;
        if (!stop && json?.ok) setDbMsgs(json.messages || []);
      } catch {
        // ignore
      }
    };

    void fetchMsgs();
    const t = window.setInterval(fetchMsgs, 4000);
    return () => {
      stop = true;
      window.clearInterval(t);
    };
  }, [dossierUuid, tick]);

  return (
    <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">Messages</p>
          <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
            Fil de discussion (mock localStorage).
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
                m.sender === "client"
                  ? "border-[var(--color-sand)] bg-white/60 text-[var(--color-text)]"
                  : "ml-auto border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.10)] text-[var(--color-text)]",
              ].join(" ")}
            >
              <p className="text-xs text-[rgba(43,43,43,0.65)]">
                {m.sender === "client" ? "Vous" : "Mo Consult"} •{" "}
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
          placeholder="Écrire un message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-50"
          disabled={!text.trim()}
          onClick={() => {
            const body = text.trim();
            if (!body) return;
            if (isSupabaseConfigured() && dossierUuid) {
              void fetch(`/api/dossiers/${encodeURIComponent(dossierUuid)}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body }),
              }).finally(() => setTick((t) => t + 1));
              setText("");
              return;
            }
            addMessage(id, { sender: "client", text: body });
            setText("");
            setTick((t) => t + 1);
          }}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  const params = useParams<{ lang: string; id: string }>();
  const lang = normalizeLang(params.lang);
  const id = params.id;

  const type = typeFromId(id);
  const [mounted, setMounted] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft | null>(null);
  const [dossierUuid, setDossierUuid] = React.useState<string | null>(null);
  const [loadingDb, setLoadingDb] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setDraft(type ? loadDossier(type) : null);
  }, [type, id]);

  // Supabase mode: resolve dossier UUID and keep the draft updated automatically (no manual refresh).
  React.useEffect(() => {
    if (!isSupabaseConfigured()) return;
    if (!type) return;

    let alive = true;
    const run = async () => {
      setLoadingDb(true);
      try {
        const res = await fetch("/api/dossiers/list", { cache: "no-store" });
        const json = (await res.json()) as any;
        const found = (json?.dossiers || []).find((d: any) => d.type === type) as any;
        if (!found?.id) {
          await fetch("/api/dossiers/upsert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, stepIndex: 0, draft: { type } }),
          });
          const res2 = await fetch("/api/dossiers/list", { cache: "no-store" });
          const json2 = (await res2.json()) as any;
          const found2 = (json2?.dossiers || []).find((d: any) => d.type === type) as any;
          if (alive) setDossierUuid(found2?.id ?? null);
        } else {
          if (alive) setDossierUuid(found.id);
        }
      } catch {
        if (alive) setDossierUuid(null);
      } finally {
        if (alive) setLoadingDb(false);
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [type]);

  React.useEffect(() => {
    if (!isSupabaseConfigured()) return;
    if (!dossierUuid) return;

    let stop = false;
    const fetchDraft = async () => {
      try {
        const res = await fetch(`/api/dossiers/${encodeURIComponent(dossierUuid)}`, {
          cache: "no-store",
        });
        const json = (await res.json()) as any;
        if (!stop && json?.ok && json.dossier?.draft) {
          const next = json.dossier.draft as Draft;
          if (!next.type && type) (next as any).type = type;
          setDraft(next);
        }
      } catch {
        // ignore
      }
    };

    void fetchDraft();
    const t = window.setInterval(fetchDraft, 4000);
    return () => {
      stop = true;
      window.clearInterval(t);
    };
  }, [dossierUuid, type]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--color-beige)]">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Link
            href={`/${lang}/espace-client`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
            Retour
          </Link>
          <div className="mt-6 rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">Chargement…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!type || !draft) {
    return (
      <div className="min-h-screen bg-[var(--color-beige)]">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Link
            href={`/${lang}/espace-client`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
            Retour
          </Link>
          <div className="mt-6 rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">Dossier introuvable</p>
            <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
              Démarrez un dossier depuis la page “Créer mon entreprise”.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const basePriceEUR = type === "srl" ? 1250 : 200;
  const promoCode = draft.meta?.promoCode ? normalizePromoCode(draft.meta.promoCode) : "";
  const promo = promoCode ? findPromoCode(promoCode) : null;
  const pricing = promo ? applyPromoToAmountEUR(basePriceEUR, promo) : null;

  return (
    <div className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href={`/${lang}/espace-client`}
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

        {draft.meta?.status === "paid" ? (
          <div className="mb-5 rounded-3xl border border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] p-5 text-sm text-[var(--color-text)]">
            <p className="font-semibold">Paiement confirmé</p>
            <p className="mt-1 text-[rgba(43,43,43,0.75)]">
              Votre paiement est bien passé. Le traitement de votre dossier commence.
            </p>
          </div>
        ) : null}

        <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold text-[var(--color-text)]">Récap paiement</p>
          <div className="mt-4 grid gap-2 text-sm text-[rgba(43,43,43,0.72)]">
            <div className="flex items-center justify-between">
              <span>Prix</span>
              <span className="font-semibold text-[var(--color-text)]">{basePriceEUR}€</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Code promo</span>
              <span className="font-semibold text-[var(--color-text)]">
                {promoCode ? promoCode : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Réduction</span>
              <span className="font-semibold text-[var(--color-text)]">
                {pricing ? `- ${pricing.discountEUR}€` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--color-sand)] pt-2">
              <span>Total</span>
              <span className="text-base font-semibold text-[var(--color-text)]">
                {pricing ? `${pricing.totalEUR}€` : `${basePriceEUR}€`}
              </span>
            </div>
            {promoCode && !promo ? (
              <p className="mt-1 text-xs text-[rgba(43,43,43,0.65)]">
                (Info) Code non trouvé/inactif dans l’admin.
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Timeline draft={draft} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.03 }}
          >
            {type === "srl" ? (
              <SrlStages id={id} dossierUuid={dossierUuid} draft={draft} setDraft={setDraft} />
            ) : null}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.045 }}
          >
            <DocsBlock draft={draft} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06 }}
          >
            <Messages id={id} dossierUuid={dossierUuid} />
          </motion.div>
        </div>

        {isSupabaseConfigured() ? (
          <p className="mt-6 text-center text-xs text-[rgba(43,43,43,0.60)]">
            Mise à jour automatique activée {loadingDb ? "(chargement…)" : "(~4s)"}.
          </p>
        ) : null}
      </div>
    </div>
  );
}
