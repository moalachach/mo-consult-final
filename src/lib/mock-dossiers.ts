// UI-only mock store for dossiers + statuses + message threads.
// Later: swap implementation to Supabase/DB without changing page components.

import type { CreationType, Draft } from "@/app/[lang]/onboarding/creation-entreprise/types";
import { loadDraft, saveDraft } from "@/app/[lang]/onboarding/creation-entreprise/storage";
import type { Session } from "@/lib/mock-auth";

export type DossierStatus = "new" | "in_progress" | "approved" | "cancelled";

export type DossierSummary = {
  id: string;
  type: CreationType;
  updatedAt?: string;
  status: DossierStatus;
};

export type Message = {
  id: string;
  dossierId: string;
  sender: "client" | "admin";
  text: string;
  createdAt: string; // ISO
};

type EmailOutboxItem = {
  to: string;
  subject: string;
  body: string;
  createdAt: string;
};

const OUTBOX_KEY = "moConsult:outbox";

export function sendEmailMock(to: string, subject: string, body: string) {
  if (!isBrowser()) return;
  const item: EmailOutboxItem = { to, subject, body, createdAt: new Date().toISOString() };
  try {
    const raw = localStorage.getItem(OUTBOX_KEY);
    const prev = raw ? (JSON.parse(raw) as EmailOutboxItem[]) : [];
    const next = Array.isArray(prev) ? [...prev, item] : [item];
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(next));
  } catch {
    // UI-only
  }
}

export type StatusEvent = {
  status: DossierStatus;
  at: string; // ISO
};

const PREFIX = "moConsult:dossier";

function statusKey(id: string) {
  return `${PREFIX}:${id}:status`;
}

function statusHistoryKey(id: string) {
  return `${PREFIX}:${id}:statusHistory`;
}

function messagesKey(id: string) {
  return `${PREFIX}:${id}:messages`;
}

export function dossierId(type: CreationType) {
  return `creation-${type}`;
}

export function isBrowser() {
  return typeof window !== "undefined";
}

export function loadStatus(id: string): DossierStatus {
  if (!isBrowser()) return "new";
  try {
    const raw = localStorage.getItem(statusKey(id));
    if (
      raw === "new" ||
      raw === "in_progress" ||
      raw === "approved" ||
      raw === "cancelled"
    ) {
      return raw;
    }
    return "new";
  } catch {
    return "new";
  }
}

export function saveStatus(id: string, status: DossierStatus) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(statusKey(id), status);
    appendStatusEvent(id, status);
  } catch {
    // UI-only
  }
}

export function loadStatusHistory(id: string): StatusEvent[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(statusHistoryKey(id));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StatusEvent[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e) =>
        e &&
        (e.status === "new" ||
          e.status === "in_progress" ||
          e.status === "approved" ||
          e.status === "cancelled") &&
        typeof e.at === "string"
    );
  } catch {
    return [];
  }
}

export function appendStatusEvent(id: string, status: DossierStatus) {
  if (!isBrowser()) return;
  const current = loadStatus(id);
  const history = loadStatusHistory(id);

  // Avoid duplicated consecutive events.
  const last = history[history.length - 1];
  if (last?.status === status) return;
  if (history.length === 0 && current === status) {
    // Keep a first event for a stable timeline.
  }

  const next: StatusEvent = { status, at: new Date().toISOString() };
  try {
    localStorage.setItem(statusHistoryKey(id), JSON.stringify([...history, next]));
  } catch {
    // UI-only
  }
}

export function loadMessages(id: string): Message[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(messagesKey(id));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Message[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addMessage(id: string, msg: Omit<Message, "id" | "dossierId" | "createdAt">) {
  if (!isBrowser()) return;
  const next: Message = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    dossierId: id,
    sender: msg.sender,
    text: msg.text,
    createdAt: new Date().toISOString(),
  };
  const all = loadMessages(id);
  const updated = [...all, next];
  try {
    localStorage.setItem(messagesKey(id), JSON.stringify(updated));
  } catch {
    // UI-only
  }
}

export function loadDossier(type: CreationType): Draft | null {
  const d = loadDraft(type);
  if (!d) return null;
  const upgraded = upgradeDraft(d);
  // Persist the upgrade so older localStorage drafts don't crash new UI.
  if (upgraded !== d) saveDraft(type, upgraded);
  return upgraded;
}

export function persistDossier(type: CreationType, draft: Draft) {
  saveDraft(type, draft);
}

export function updateDossier(type: CreationType, updater: (prev: Draft) => Draft) {
  const prev = loadDraft(type);
  if (!prev) return;
  const next = updater(prev);
  saveDraft(type, { ...next, meta: { ...(next.meta ?? {}), updatedAt: new Date().toISOString() } });
}

export function listDossiers(): DossierSummary[] {
  const types: CreationType[] = ["srl", "pp"];
  const items: DossierSummary[] = [];

  for (const t of types) {
    const d = loadDossier(t);
    if (!d) continue;
    const id = dossierId(t);
    const status = (d.workflow?.status as DossierStatus | undefined) ?? loadStatus(id);
    items.push({
      id,
      type: t,
      updatedAt: d.meta?.updatedAt,
      status,
    });
  }

  // Sort: newest first (fallback), then status grouping can be added later.
  items.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  return items;
}

export function setDraftWorkflowStatus(type: CreationType, status: DossierStatus) {
  const d = loadDossier(type);
  if (!d) return;
  const next: Draft = {
    ...d,
    workflow: { ...(d.workflow ?? {}), status },
    meta: { ...(d.meta ?? {}), updatedAt: new Date().toISOString() },
  };
  saveDraft(type, next);
  saveStatus(dossierId(type), status);
}

export function completeMockPayment(type: CreationType, session: Session) {
  const d = loadDossier(type);
  if (!d) return;
  const id = dossierId(type);
  const next: Draft = {
    ...d,
    meta: { ...(d.meta ?? {}), status: "paid", updatedAt: new Date().toISOString() },
    workflow: {
      ...(d.workflow ?? {}),
      status: "in_progress",
      srl:
        type === "srl" && d.workflow?.srl
          ? {
              ...d.workflow.srl,
              dossier: { ...d.workflow.srl.dossier, status: "pending" },
            }
          : d.workflow?.srl,
    },
  };
  saveDraft(type, next);
  saveStatus(id, "in_progress");

  // Messages shown in client space.
  addMessage(id, { sender: "admin", text: `Bienvenue ${session.name} 👋` });
  addMessage(id, {
    sender: "admin",
    text: "Paiement confirmé. Le traitement de votre dossier commence maintenant.",
  });

  // Mock email confirmations (outbox).
  sendEmailMock(
    session.email,
    "Bienvenue sur Mo Consult",
    `Bonjour ${session.name}, bienvenue sur Mo Consult. Votre espace client est actif.`
  );
  sendEmailMock(
    session.email,
    "Confirmation de paiement",
    "Votre paiement est bien passé. Le traitement de votre dossier commence."
  );
}

function defaultSrlWorkflow() {
  return {
    dossier: { status: "pending" as const, adminNote: "" },
    planFinancier: {
      status: "pending" as const,
      blockers: [] as string[],
      adminNote: "",
      planFileName: "",
      notifiedClient: false,
    },
    banque: {
      status: "pending" as const,
      attestationFileName: "",
      alternativeWithin3Months: false,
      adminNote: "",
    },
    domiciliation: {
      status: "pending" as const,
      wantsDomiciliation: null as boolean | null,
      bailFileName: "",
      adminNote: "",
    },
    comptable: {
      status: "pending" as const,
      proposals: [
        { name: "Cabinet Alpha", city: "Bruxelles", email: "alpha@example.com" },
        { name: "Fidu Beta", city: "Charleroi", email: "beta@example.com" },
        { name: "Compta Gamma", city: "Liège", email: "gamma@example.com" },
      ],
      clientChoice: undefined as any,
      adminNote: "",
    },
    notaire: { status: "pending" as const, dossierFileName: "", adminNote: "" },
    rendezVous: { status: "pending" as const, proposedDates: [] as string[], confirmedDate: "", adminNote: "" },
    factureNotaire: {
      status: "pending" as const,
      invoiceFileName: "",
      invoiceAmount: 0,
      clientConfirmedPaid: false,
      clientConfirmedRdv: false,
      adminNote: "",
    },
    numeroEntreprise: { status: "pending" as const, enterpriseNumber: "", companyName: "", adminNote: "" },
    tva: { status: "pending" as const, hasStableOffice: null as boolean | null, attestation604AFileName: "", adminNote: "" },
    affiliation: { status: "pending" as const, amountDue: 190, clientConfirmedPaid: false, adminNote: "" },
    finalDelivery: {
      status: "pending" as const,
      deliveryMode: "download" as const,
      destination: "",
      downloadLinkMock: "Lien de téléchargement (mock)",
      availableDays: 30,
      adminNote: "",
    },
  };
}

function upgradeDraft(draft: Draft): Draft {
  if (draft.type !== "srl") return draft;
  const cur = draft.workflow?.srl;
  const def = defaultSrlWorkflow();
  const nextSrl = {
    ...def,
    ...(cur ?? {}),
    dossier: { ...def.dossier, ...(cur?.dossier ?? {}) },
    planFinancier: { ...def.planFinancier, ...(cur?.planFinancier ?? {}) },
    banque: { ...def.banque, ...(cur?.banque ?? {}) },
    domiciliation: { ...def.domiciliation, ...(cur?.domiciliation ?? {}) },
    comptable: { ...def.comptable, ...(cur?.comptable ?? {}) },
    notaire: { ...def.notaire, ...(cur?.notaire ?? {}) },
    rendezVous: { ...def.rendezVous, ...(cur?.rendezVous ?? {}) },
    factureNotaire: { ...def.factureNotaire, ...(cur?.factureNotaire ?? {}) },
    numeroEntreprise: { ...def.numeroEntreprise, ...(cur?.numeroEntreprise ?? {}) },
    tva: { ...def.tva, ...(cur?.tva ?? {}) },
    affiliation: { ...def.affiliation, ...(cur?.affiliation ?? {}) },
    finalDelivery: { ...def.finalDelivery, ...(cur?.finalDelivery ?? {}) },
  };

  const next: Draft = {
    ...draft,
    workflow: {
      ...(draft.workflow ?? {}),
      srl: nextSrl,
    },
  };

  // If no upgrade is needed, keep referential equality.
  const changed = JSON.stringify(cur ?? {}) !== JSON.stringify(nextSrl);
  return changed ? next : draft;
}

function demoDraft(type: CreationType): Draft {
  const base: Draft = {
    type,
    meta: { status: "draft", updatedAt: new Date().toISOString() },
    workflow: {
      status: "new",
      srl:
        type === "srl"
          ? {
              dossier: { status: "done", adminNote: "" },
              planFinancier: {
                status: "incomplete",
                blockers: ["Capital non suffisant"],
                adminNote: "Merci d’indiquer vos charges mensuelles et vos apports prévus.",
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
              rendezVous: { status: "pending", proposedDates: ["2026-02-10 10:00", "2026-02-12 14:30"], confirmedDate: "", adminNote: "" },
              factureNotaire: { status: "pending", invoiceFileName: "", invoiceAmount: 0, clientConfirmedPaid: false, clientConfirmedRdv: false, adminNote: "" },
              numeroEntreprise: { status: "pending", enterpriseNumber: "", companyName: "", adminNote: "" },
              tva: { status: "pending", hasStableOffice: null, attestation604AFileName: "", adminNote: "" },
              affiliation: { status: "pending", amountDue: 190, clientConfirmedPaid: false, adminNote: "" },
              finalDelivery: { status: "pending", deliveryMode: "download", destination: "", downloadLinkMock: "Lien de téléchargement (mock)", availableDays: 30, adminNote: "" },
            }
          : undefined,
    },
    identite: { prenom: "Alex", nom: "Dupont", email: "alex@example.com", tel: "+32 4 00 00 00 00" },
    adresse: { rue: "Rue de l’Exemple", numero: "10", cp: "1000", ville: "Bruxelles", pays: "Belgique" },
    activite: { description: "Consulting & services", nace: "70220" },
    specifics:
      type === "srl"
        ? { apports: "2500", nbAssocies: "1", comptePro: null }
        : { apports: "", nbAssocies: "", comptePro: true },
    capitalAdvisor:
      type === "srl"
        ? {
            chargesMonthly: { rent: 650, accountant: 120, subscriptions: 40, marketing: 150, other: 90 },
            investmentsOneOff: 800,
            stockInitial: 0,
            safetyBufferMonths: 3,
            recommendedCash: undefined,
            userPlannedContribution: undefined,
            verdict: undefined,
            clientNote: "Hypothèses simples pour démarrer. Ajustable avec Mo Consult.",
          }
        : undefined,
    docs: {
      uploadedNames: [],
      notes: "",
      foundersCount: 1,
      foundersIds: ["id-recto.jpg", "id-verso.jpg"],
      adminsCount: 1,
      adminsIds: type === "srl" ? ["admin-recto.jpg", "admin-verso.jpg"] : [],
    },
  };
  return base;
}

export function seedDemo() {
  if (!isBrowser()) return;

  for (const t of ["srl", "pp"] as const) {
    if (!loadDraft(t)) {
      saveDraft(t, demoDraft(t));
      saveStatus(dossierId(t), "new");
    }
  }

  const srlId = dossierId("srl");
  if (loadMessages(srlId).length === 0) {
    addMessage(srlId, { sender: "admin", text: "Bonjour, on peut valider vos apports et votre activité ensemble." });
    addMessage(srlId, { sender: "client", text: "Merci ! J’ai une question sur le plan financier." });
  }
}
