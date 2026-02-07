export type CreationType = "srl" | "pp";

export type StepId =
  | "resume"
  | "identite"
  | "adresse_activite"
  | "specifics"
  | "capital_advisor"
  | "docs"
  | "account"
  | "recap";

export type StepConfig = {
  id: StepId;
  label: string;
  requiredPaths?: string[]; // e.g. "identite.email"
  visibleWhen?: (type: CreationType) => boolean;
};

export type Draft = {
  type: CreationType;
  meta: {
    draftId?: string; // future backend
    status?: "draft" | "submitted" | "paid"; // future
    updatedAt?: string; // ISO
    promoCode?: string; // UI-only for now (sync with admin promo codes later)
  };
  identite: { prenom: string; nom: string; email: string; tel: string };
  adresse: { rue: string; numero: string; cp: string; ville: string; pays?: string };
  activite: { description: string; nace: string };
  specifics: {
    // SRL
    apports?: string;
    nbAssocies?: string;
    // PP
    comptePro?: boolean | null;
  };
  capitalAdvisor?: {
    // SRL-only advisory (UI now, backend later)
    chargesMonthly: {
      rent?: number;
      utilities?: number;
      payroll?: number;
      insurance?: number;
      accountant?: number;
      marketing?: number;
      subscriptions?: number;
      vehicle?: number;
      purchases?: number;
      other?: number;
    };
    investmentsOneOff?: number;
    stockInitial?: number;
    safetyBufferMonths?: number; // default 3
    recommendedCash?: number; // computed
    userPlannedContribution?: number; // computed from specifics.apports
    verdict?: "ok" | "limit" | "insufficient"; // computed
    clientNote?: string;
  };
  docs: {
    uploadedNames: string[];
    notes: string;
    foundersCount: number;
    foundersIds: string[];
    adminsCount: number;
    adminsIds: string[];
  };
  workflow?: {
    status?: "new" | "in_progress" | "approved" | "cancelled";
    srl?: {
      // SRL-only tracking stages (UI now, backend later)
      dossier: {
        status: "pending" | "incomplete" | "done";
        adminNote?: string; // what is missing
      };
      planFinancier: {
        status: "pending" | "incomplete" | "done";
        blockers?: string[]; // predefined reasons
        adminNote?: string; // explanation/details
        planFileName?: string; // mock upload name
        notifiedClient?: boolean; // mock notification flag
      };
      banque: {
        status: "pending" | "incomplete" | "done";
        attestationFileName?: string; // client upload mock name
        alternativeWithin3Months?: boolean; // if client can't open now
        adminNote?: string;
      };
      domiciliation: {
        status: "pending" | "incomplete" | "done";
        wantsDomiciliation?: boolean | null;
        bailFileName?: string; // if no domiciliation, client uploads lease
        adminNote?: string;
      };
      comptable: {
        status: "pending" | "incomplete" | "done";
        // Admin can propose accountants; client can pick one or provide their own.
        proposals?: Array<{ name: string; city?: string; email?: string }>;
        clientChoice?: { mode: "proposed" | "already"; value: string }; // value = selected name or email/name
        adminNote?: string;
      };
      notaire: {
        status: "pending" | "incomplete" | "done";
        dossierFileName?: string; // admin upload (mock)
        adminNote?: string;
      };
      rendezVous: {
        status: "pending" | "incomplete" | "done";
        proposedDates?: string[]; // admin proposes (ISO-ish strings)
        confirmedDate?: string; // client confirms
        adminNote?: string;
      };
      factureNotaire: {
        status: "pending" | "incomplete" | "done";
        invoiceFileName?: string; // admin upload (mock)
        invoiceAmount?: number; // later configurable
        clientConfirmedPaid?: boolean;
        clientConfirmedRdv?: boolean;
        adminNote?: string;
      };
      numeroEntreprise: {
        status: "pending" | "incomplete" | "done";
        enterpriseNumber?: string;
        companyName?: string;
        adminNote?: string;
      };
      tva: {
        status: "pending" | "incomplete" | "done";
        hasStableOffice?: boolean | null; // client info
        attestation604AFileName?: string; // admin upload (mock)
        adminNote?: string;
      };
      affiliation: {
        status: "pending" | "incomplete" | "done";
        amountDue?: number; // default 190
        clientConfirmedPaid?: boolean;
        adminNote?: string;
      };
      finalDelivery: {
        status: "pending" | "incomplete" | "done";
        deliveryMode?: "email" | "download";
        destination?: string; // email or label
        downloadLinkMock?: string; // placeholder
        availableDays?: number; // e.g. 30
        adminNote?: string;
      };
    };
  };
};
