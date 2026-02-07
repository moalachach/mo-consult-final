"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getSteps } from "./steps";
import type { CreationType, Draft, StepId } from "./types";
import { clearDraft, loadDraft, loadProgress, saveDraft, saveProgress } from "./storage";
import { Stepper } from "./components/Stepper";
import { WizardLayout } from "./components/WizardLayout";
import { StepResume } from "./steps/StepResume";
import { StepIdentite } from "./steps/StepIdentite";
import { StepAdresseActivite } from "./steps/StepAdresseActivite";
import { StepSpecific } from "./steps/StepSpecific";
import { StepCapitalAdvisor } from "./steps/StepCapitalAdvisor";
import { StepDocs } from "./steps/StepDocs";
import { StepAccount } from "./steps/StepAccount";
import { StepRecap } from "./steps/StepRecap";
import { Button } from "@/components/ui";
import { getSession, registerUser } from "@/lib/mock-auth";
import { completeMockPayment } from "@/lib/mock-dossiers";
import { useRouter } from "next/navigation";
import { applyPromoToAmountEUR, findPromoCode, normalizePromoCode } from "@/lib/mock-promos";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { importLocalDraftsToSupabase } from "@/lib/import-local-drafts";
import { normalizeLang } from "@/lib/i18n";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function blankDraft(type: CreationType): Draft {
  return {
    type,
    meta: {
      status: "draft",
      updatedAt: new Date().toISOString(),
    },
    workflow: {
      status: "new",
      srl:
        type === "srl"
          ? {
              dossier: { status: "pending", adminNote: "" },
              planFinancier: {
                status: "pending",
                blockers: [],
                adminNote: "",
                planFileName: "",
                notifiedClient: false,
              },
              banque: {
                status: "pending",
                attestationFileName: "",
                alternativeWithin3Months: false,
                adminNote: "",
              },
              domiciliation: {
                status: "pending",
                wantsDomiciliation: null,
                bailFileName: "",
                adminNote: "",
              },
              comptable: {
                status: "pending",
                proposals: [
                  { name: "Cabinet Alpha", city: "Bruxelles", email: "alpha@example.com" },
                  { name: "Fidu Beta", city: "Charleroi", email: "beta@example.com" },
                  { name: "Compta Gamma", city: "Liège", email: "gamma@example.com" },
                ],
                clientChoice: undefined,
                adminNote: "",
              },
              notaire: { status: "pending", dossierFileName: "", adminNote: "" },
              rendezVous: {
                status: "pending",
                proposedDates: [],
                confirmedDate: "",
                adminNote: "",
              },
              factureNotaire: {
                status: "pending",
                invoiceFileName: "",
                invoiceAmount: 0,
                clientConfirmedPaid: false,
                clientConfirmedRdv: false,
                adminNote: "",
              },
              numeroEntreprise: {
                status: "pending",
                enterpriseNumber: "",
                companyName: "",
                adminNote: "",
              },
              tva: {
                status: "pending",
                hasStableOffice: null,
                attestation604AFileName: "",
                adminNote: "",
              },
              affiliation: { status: "pending", amountDue: 190, clientConfirmedPaid: false, adminNote: "" },
              finalDelivery: {
                status: "pending",
                deliveryMode: "download",
                destination: "",
                downloadLinkMock: "Lien de téléchargement (mock)",
                availableDays: 30,
                adminNote: "",
              },
            }
          : undefined,
    },
    identite: { prenom: "", nom: "", email: "", tel: "" },
    adresse: { rue: "", numero: "", cp: "", ville: "", pays: "Belgique" },
    activite: { description: "", nace: "" },
    specifics: {
      apports: "",
      nbAssocies: "",
      comptePro: null,
    },
    capitalAdvisor:
      type === "srl"
        ? {
            chargesMonthly: {},
            investmentsOneOff: undefined,
            stockInitial: undefined,
            safetyBufferMonths: 3,
            recommendedCash: undefined,
            userPlannedContribution: undefined,
            verdict: undefined,
            clientNote: "",
          }
        : undefined,
    docs: {
      uploadedNames: [],
      notes: "",
      foundersCount: 1,
      foundersIds: [],
      adminsCount: type === "pp" ? 1 : 1,
      adminsIds: [],
    },
  };
}

function getPath(obj: any, path: string) {
  return path.split(".").reduce<any>((acc, k) => (acc ? acc[k] : undefined), obj);
}

function setPath<T extends object>(obj: T, path: string, value: any): T {
  const keys = path.split(".");
  const next: any = Array.isArray(obj) ? [...(obj as any)] : { ...(obj as any) };
  let cur: any = next;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]!;
    const prev = cur[k];
    cur[k] = Array.isArray(prev) ? [...prev] : { ...(prev ?? {}) };
    cur = cur[k];
  }
  cur[keys[keys.length - 1]!] = value;
  return next as T;
}

function validateStep(stepId: StepId, draft: Draft): Record<string, string> {
  const e: Record<string, string> = {};

  const required = (path: string, message = "Champ obligatoire") => {
    const v = getPath(draft, path);
    const empty = v === undefined || v === null || String(v).trim() === "";
    if (empty) e[path] = message;
  };

  if (stepId === "identite") {
    required("identite.prenom");
    required("identite.nom");
    required("identite.email");
    required("identite.tel");
    const email = draft.identite.email;
    if (email && !String(email).includes("@")) e["identite.email"] = "Email invalide";
  }

  if (stepId === "adresse_activite") {
    required("adresse.rue");
    required("adresse.numero");
    required("adresse.cp");
    required("adresse.ville");
    required("activite.description");
  }

  if (stepId === "specifics") {
    if (draft.type === "srl") {
      required("specifics.apports");
      required("specifics.nbAssocies");
    } else {
      const v = draft.specifics.comptePro;
      if (v !== true && v !== false) e["specifics.comptePro"] = "Choisissez Oui ou Non";
    }
  }

  if (stepId === "capital_advisor") {
    // SRL only
    if (draft.type === "srl") {
      required("specifics.apports", "Indiquez vos apports estimés");
      const months = draft.capitalAdvisor?.safetyBufferMonths;
      if (!months || Number(months) < 1) e["capitalAdvisor.safetyBufferMonths"] = "Minimum 1";
    }
  }

  return e;
}

export default function Page() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = normalizeLang(params.lang);
  const [type, setType] = React.useState<CreationType>("pp");
  const enableMollie = process.env.NEXT_PUBLIC_ENABLE_MOLLIE === "true";

  // Read type from URL query (client-only) without useSearchParams() to keep static builds happy.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = new URLSearchParams(window.location.search).get("type");
    setType(raw === "srl" ? "srl" : "pp");
  }, []);

  const steps = useMemo(() => getSteps(type), [type]);

  const [draft, setDraft] = useState<Draft>(() => blankDraft(type));
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState(false);
  const [blurred, setBlurred] = useState<Record<string, boolean>>({});
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [resumeDraft, setResumeDraft] = useState<Draft | null>(null);
  const [resumeIndex, setResumeIndex] = useState<number>(0);
  const [saveEnabled, setSaveEnabled] = useState(true);
  const [session, setSession] = useState(() => getSession()); // mock session (UI-only)
  const [identity, setIdentity] = useState<{ name: string; email: string } | null>(null); // supabase or mock

  // If Supabase is configured but the schema isn't installed yet, repeated failing requests can slow the browser.
  // We disable sync after the first detected failure to keep UX smooth.
  const supabaseSyncDisabledRef = useRef(false);
  const [supabaseSyncWarning, setSupabaseSyncWarning] = useState<string | null>(null);

  const [accountForm, setAccountForm] = useState({ name: "", email: "", password: "" });
  const [accountErrors, setAccountErrors] = useState<Record<string, string>>({});
  const [accountBlurred, setAccountBlurred] = useState<Record<string, boolean>>({});
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoApplied, setPromoApplied] = useState<string | null>(null); // normalized code

  const saveTimer = useRef<number | null>(null);

  // Load draft + progress, then show resume banner if exists.
  useEffect(() => {
    setSession(getSession());
    // Read Supabase identity if configured.
    if (isSupabaseConfigured()) {
      (async () => {
        try {
          const supabase = getSupabaseBrowserClient();
          const { data } = await supabase.auth.getUser();
          const u = data.user;
          if (u?.email) {
            const name = (u.user_metadata?.name as string | undefined) || "Client";
            setIdentity({ name, email: u.email });
          } else {
            setIdentity(null);
          }
        } catch {
          setIdentity(null);
        }
      })();
    } else {
      const s = getSession();
      setIdentity(s ? { name: s.name, email: s.email } : null);
    }
    const existing = loadDraft(type);
    const progress = clamp(loadProgress(type), 0, steps.length - 1);
    if (existing) {
      // Safety: DO NOT write back to localStorage until user chooses Resume/Restart.
      setResumeDraft(existing);
      setResumeIndex(progress);
      setSaveEnabled(false);
      setDraft(blankDraft(type));
      setStepIndex(0);
      setShowResumePrompt(true);
    } else {
      setDraft(blankDraft(type));
      setStepIndex(progress);
      setShowResumePrompt(false);
      setResumeDraft(null);
      setSaveEnabled(true);
    }
    setErrors({});
    setTouched(false);
    setBlurred({});
    setPromoError(null);
    setPromoApplied(null);
    setPromoInput("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // Save progress immediately when step changes.
  useEffect(() => {
    if (!saveEnabled) return;
    saveProgress(type, stepIndex);
  }, [type, stepIndex, saveEnabled]);

  // Debounced autosave draft.
  useEffect(() => {
    if (!saveEnabled) return;
    const next: Draft = {
      ...draft,
      meta: { ...draft.meta, updatedAt: new Date().toISOString() },
    };
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      saveDraft(type, next);
      // When Supabase is configured and the user is authenticated,
      // persist drafts to DB so admin can see them immediately (no manual refresh).
      if (isSupabaseConfigured() && identity?.email && !supabaseSyncDisabledRef.current) {
        void (async () => {
          try {
            const res = await fetch("/api/dossiers/upsert", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type, stepIndex, draft: next }),
            });
            if (!res.ok) {
              supabaseSyncDisabledRef.current = true;
              setSupabaseSyncWarning(
                "Synchronisation temporairement désactivée (base non prête). Exécutez schema.sql dans Supabase, puis rechargez."
              );
            }
          } catch {
            supabaseSyncDisabledRef.current = true;
            setSupabaseSyncWarning(
              "Synchronisation temporairement désactivée (erreur réseau). Rechargez après configuration Supabase."
            );
          }
        })();
      }
    }, 400);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [type, draft, saveEnabled, identity, stepIndex]);

  const step = steps[stepIndex]!;

  const showError = (path: string) => touched || !!blurred[path];

  const onBlur = (path: string) => setBlurred((b) => ({ ...b, [path]: true }));

  const onChange = (path: string, value: any) => {
    setDraft((d) => setPath(d, path, value));
  };

  const onNext = () => {
    setTouched(true);
    if (step.id === "account") {
      const e: Record<string, string> = {};
      if (!identity) {
        if (!accountForm.name.trim()) e.name = "Nom obligatoire";
        if (!accountForm.email.trim() || !accountForm.email.includes("@")) e.email = "Email invalide";
        if (!accountForm.password || accountForm.password.length < 6) e.password = "Mot de passe (min 6 caractères)";
        setAccountErrors(e);
        if (Object.keys(e).length > 0) return;
        if (isSupabaseConfigured()) {
          (async () => {
            try {
              const supabase = getSupabaseBrowserClient();
              const { error } = await supabase.auth.signUp({
                email: accountForm.email,
                password: accountForm.password,
                options: { data: { name: accountForm.name } },
              });
              if (error) {
                setAccountErrors({ email: error.message });
                return;
              }
              // Import any local wizard drafts into DB (guest -> authed).
              await importLocalDraftsToSupabase();
              setIdentity({ name: accountForm.name, email: accountForm.email });
              setSession(getSession());
              setTouched(false);
              setErrors({});
              setStepIndex((i) => clamp(i + 1, 0, steps.length - 1));
            } catch (err: any) {
              setAccountErrors({ email: err?.message || "Erreur" });
            }
          })();
          return;
        }

        const res = registerUser({
          name: accountForm.name,
          email: accountForm.email,
          password: accountForm.password,
        });
        if (!res.ok) {
          setAccountErrors({ email: res.error || "Erreur" });
          return;
        }
        const s = getSession();
        setSession(s);
        setIdentity(s ? { name: s.name, email: s.email } : null);
      }
      setTouched(false);
      setErrors({});
      setStepIndex((i) => clamp(i + 1, 0, steps.length - 1));
      return;
    }

    const e = validateStep(step.id, draft);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setTouched(false);
    setErrors({});
    setStepIndex((i) => clamp(i + 1, 0, steps.length - 1));
  };

  const onPrev = () => {
    setTouched(false);
    setErrors({});
    setStepIndex((i) => clamp(i - 1, 0, steps.length - 1));
  };

  const onSelect = (idx: number) => {
    // Allow going backwards freely; forward selection stays blocked for v1.
    if (idx <= stepIndex) setStepIndex(idx);
  };

  const onRestart = () => {
    clearDraft(type);
    setShowResumePrompt(false);
    setResumeDraft(null);
    setSaveEnabled(true);
    setDraft(blankDraft(type));
    setStepIndex(0);
    setErrors({});
    setTouched(false);
    setBlurred({});
  };

  const startMollieCheckout = async () => {
    if (!enableMollie) {
      alert("Mollie est désactivé pour l’instant. (On l’activera quand le site sera prêt.)");
      return;
    }
    const s = getSession();
    if (!s) {
      alert("Veuillez vous inscrire / vous connecter avant le paiement.");
      return;
    }
    try {
      const res = await fetch("/api/mollie/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, lang, customer: { name: s.name, email: s.email } }),
      });
      const json = (await res.json()) as any;
      if (!json.ok) throw new Error(json.error || "Erreur Mollie");
      if (typeof window !== "undefined") {
        localStorage.setItem(`moConsult:lastPayment:${type}`, String(json.paymentId || ""));
      }
      window.location.href = String(json.checkoutUrl);
    } catch (e: any) {
      alert(e?.message || "Impossible de lancer le paiement (Mollie)");
    }
  };

  const banner = showResumePrompt ? (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6 rounded-3xl border border-[var(--color-sand)] bg-white/70 p-5 backdrop-blur"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">
            Reprendre votre dossier ?
          </p>
          <p className="mt-1 text-sm text-[rgba(43,43,43,0.72)]">
            Dernière mise à jour:{" "}
            {resumeDraft?.meta.updatedAt
              ? new Date(resumeDraft.meta.updatedAt).toLocaleString()
              : "—"}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={() => {
                  if (resumeDraft) {
                    setDraft(resumeDraft);
                    setStepIndex(clamp(resumeIndex, 0, steps.length - 1));
                    const code = resumeDraft.meta.promoCode ? normalizePromoCode(resumeDraft.meta.promoCode) : "";
                    if (code) {
                      setPromoApplied(code);
                      setPromoInput(code);
                    }
                  }
                  setShowResumePrompt(false);
                  setResumeDraft(null);
                  setSaveEnabled(true);
                  // If the user is already authenticated (Supabase), import existing local draft now.
                  if (isSupabaseConfigured()) void importLocalDraftsToSupabase();
                }}
                className="whitespace-nowrap"
              >
                Reprendre
              </Button>
          <Button variant="outline" onClick={onRestart} className="whitespace-nowrap">
            Recommencer
          </Button>
        </div>
      </div>
    </motion.div>
  ) : null;

  const title = `Wizard création — ${type === "srl" ? "SRL" : "Indépendant"}`;
  const subtitle = `Autosave activé (UI-only). Langue: ${lang.toUpperCase()}.`;

  const basePriceEUR = type === "srl" ? 1250 : 200;
  const promo = promoApplied ? findPromoCode(promoApplied) : null;
  const pricing = promo ? applyPromoToAmountEUR(basePriceEUR, promo) : null;

  const combinedBanner =
    supabaseSyncWarning || banner ? (
      <div className="grid gap-3">
        {supabaseSyncWarning ? (
          <div className="rounded-2xl border border-[var(--color-sand)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] shadow-sm backdrop-blur">
            {supabaseSyncWarning}
          </div>
        ) : null}
        {banner}
      </div>
    ) : null;

  return (
    <WizardLayout
      title={title}
      subtitle={subtitle}
      banner={combinedBanner || undefined}
      stepper={<Stepper steps={steps} stepIndex={stepIndex} onSelect={onSelect} />}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" onClick={onRestart} className="whitespace-nowrap">
            Recommencer
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onPrev} disabled={stepIndex === 0}>
              Précédent
            </Button>
            {stepIndex < steps.length - 1 ? (
              <Button onClick={onNext}>Suivant</Button>
            ) : (
              <Button
                onClick={() => {
                  const s =
                    identity?.email
                      ? { name: identity.name, email: identity.email }
                      : getSession()
                        ? { name: getSession()!.name, email: getSession()!.email }
                        : null;
                  if (!s) {
                    alert("Veuillez vous inscrire / vous connecter avant le paiement.");
                    return;
                  }

                  if (enableMollie) {
                    startMollieCheckout();
                    return;
                  }

                  // UI-only mock payment until you say "on a fini de configurer le site".
                  if (promoApplied) {
                    // Keep the applied code in the draft for client/admin UI (backend-ready later).
                    setDraft((d) => ({ ...d, meta: { ...d.meta, promoCode: promoApplied } }));
                  }
                  // UI-only mock payment: store messages + status in localStorage.
                  // (Supabase mode will be plugged later with Mollie webhooks.)
                  completeMockPayment(type, { name: s.name, email: s.email } as any);
                  router.push(`/${lang}/espace-client/dossiers/creation-${type}`);
                }}
              >
                {enableMollie ? "Payer (Mollie)" : "Payer (mock)"}
              </Button>
            )}
          </div>
        </div>
      }
    >
      {/* Promo code (UI-only): only show near the end */}
      {step.id === "recap" ? (
        <div className="mb-6 rounded-3xl border border-[var(--color-sand)] bg-white/70 p-5 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--color-text)]">Code promo</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.72)]">
                (UI-only) Ajoutez un code promo créé dans l’admin.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError(null);
                  }}
                  placeholder="Ex: MO10"
                  className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)] sm:max-w-[260px]"
                  aria-label="Code promo"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    const normalized = normalizePromoCode(promoInput);
                    const p = findPromoCode(normalized);
                    if (!p) {
                      setPromoApplied(null);
                      setPromoError("Code invalide ou inactif.");
                      return;
                    }
                    setPromoApplied(p.code);
                    setPromoInput(p.code);
                    setPromoError(null);
                    setDraft((d) => ({ ...d, meta: { ...d.meta, promoCode: p.code } }));
                  }}
                >
                  Appliquer
                </Button>
                {promoApplied ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setPromoApplied(null);
                      setPromoError(null);
                      setDraft((d) => ({ ...d, meta: { ...d.meta, promoCode: undefined } }));
                    }}
                  >
                    Retirer
                  </Button>
                ) : null}
              </div>
              {promoError ? (
                <p className="mt-2 text-sm text-[rgba(166,48,48,0.9)]">{promoError}</p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4 text-sm text-[rgba(43,43,43,0.72)] sm:min-w-[260px]">
              <div className="flex items-center justify-between">
                <span>Prix</span>
                <span className="font-semibold text-[var(--color-text)]">{basePriceEUR}€</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Réduction</span>
                <span className="font-semibold text-[var(--color-text)]">
                  {pricing ? `- ${pricing.discountEUR}€` : "—"}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-[var(--color-sand)] pt-2">
                <span>Total</span>
                <span className="text-base font-semibold text-[var(--color-text)]">
                  {pricing ? `${pricing.totalEUR}€` : `${basePriceEUR}€`}
                </span>
              </div>
              {promoApplied ? (
                <p className="mt-2 text-xs text-[rgba(43,43,43,0.65)]">
                  Code appliqué: <span className="font-semibold">{promoApplied}</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <motion.div
        key={step.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {step.id === "resume" && <StepResume type={type} draft={draft} />}
        {step.id === "identite" && (
          <StepIdentite
            draft={draft}
            errors={errors}
            showError={showError}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
        {step.id === "adresse_activite" && (
          <StepAdresseActivite
            draft={draft}
            errors={errors}
            showError={showError}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
        {step.id === "specifics" && (
          <StepSpecific
            type={type}
            draft={draft}
            errors={errors}
            showError={showError}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
        {step.id === "capital_advisor" && (
          <StepCapitalAdvisor draft={draft} onChange={onChange} onBlur={onBlur} />
        )}
        {step.id === "docs" && <StepDocs draft={draft} onChange={onChange} />}
        {step.id === "account" && (
          <StepAccount
            session={session}
            form={accountForm}
            errors={accountErrors}
            showError={(k) => touched || !!accountBlurred[k]}
            onChange={(k, v) => setAccountForm((f) => ({ ...f, [k]: v }))}
            onBlur={(k) => setAccountBlurred((b) => ({ ...b, [k]: true }))}
          />
        )}
        {step.id === "recap" && <StepRecap draft={draft} />}
      </motion.div>
    </WizardLayout>
  );
}
