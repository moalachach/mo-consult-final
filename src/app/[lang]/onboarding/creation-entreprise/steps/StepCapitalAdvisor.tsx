"use client";

import React, { useEffect, useMemo } from "react";
import type { Draft } from "../types";
import { InputField, TextareaField } from "../components/Field";
import { AlertTriangle, CheckCircle2, CircleDashed, Wallet } from "lucide-react";

type Props = {
  draft: Draft;
  onChange: (path: string, value: any) => void;
  onBlur: (path: string) => void;
};

function parseMoney(raw: string): number | undefined {
  const cleaned = raw.replace(",", ".").trim();
  if (!cleaned) return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

function toStr(n: number | undefined) {
  return typeof n === "number" && Number.isFinite(n) ? String(n) : "";
}

function sumNumbers(values: Array<number | undefined>) {
  return values.reduce<number>(
    (acc, v) => acc + (typeof v === "number" && Number.isFinite(v) ? v : 0),
    0
  );
}

export function StepCapitalAdvisor({ draft, onChange, onBlur }: Props) {
  const ca = draft.capitalAdvisor ?? {
    chargesMonthly: {},
    safetyBufferMonths: 3,
    clientNote: "",
  };

  const apportsStr = draft.specifics.apports ?? "";
  const apportsN = parseMoney(apportsStr);

  const monthlyTotal = useMemo(() => {
    const c = ca.chargesMonthly || {};
    return sumNumbers([
      c.rent,
      c.utilities,
      c.payroll,
      c.insurance,
      c.accountant,
      c.marketing,
      c.subscriptions,
      c.vehicle,
      c.purchases,
      c.other,
    ]);
  }, [ca.chargesMonthly]);

  const bufferMonths = typeof ca.safetyBufferMonths === "number" ? ca.safetyBufferMonths : 3;
  const investments = ca.investmentsOneOff ?? 0;
  const stock = ca.stockInitial ?? 0;

  const recommended = useMemo(() => {
    return Math.max(0, monthlyTotal * bufferMonths + investments + stock);
  }, [monthlyTotal, bufferMonths, investments, stock]);

  const verdict = useMemo<NonNullable<Draft["capitalAdvisor"]>["verdict"]>(() => {
    if (!apportsN || apportsN <= 0) return "insufficient";
    if (apportsN >= recommended) return "ok";
    if (apportsN >= 0.7 * recommended) return "limit";
    return "insufficient";
  }, [apportsN, recommended]);

  // Keep computed fields in the draft for recap/back-end mapping later.
  useEffect(() => {
    const nextRecommended = Math.round(recommended);
    if (draft.capitalAdvisor?.recommendedCash !== nextRecommended) {
      onChange("capitalAdvisor.recommendedCash", nextRecommended);
    }
    if (draft.capitalAdvisor?.userPlannedContribution !== apportsN) {
      onChange("capitalAdvisor.userPlannedContribution", apportsN);
    }
    if (draft.capitalAdvisor?.verdict !== verdict) {
      onChange("capitalAdvisor.verdict", verdict);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommended, apportsN, verdict]);

  const VerdictIcon =
    verdict === "ok" ? CheckCircle2 : verdict === "limit" ? AlertTriangle : CircleDashed;

  const verdictLabel =
    verdict === "ok" ? "Cohérent" : verdict === "limit" ? "Limite" : "Insuffisant";

  const verdictClass =
    verdict === "ok"
      ? "bg-[rgba(31,143,95,0.12)] text-[var(--color-accent)] border-[rgba(31,143,95,0.25)]"
      : verdict === "limit"
        ? "bg-[rgba(245,158,11,0.12)] text-[rgb(146,64,14)] border-[rgba(245,158,11,0.25)]"
        : "bg-[rgba(239,68,68,0.10)] text-[rgb(153,27,27)] border-[rgba(239,68,68,0.22)]";

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Estimation apports (outil indicatif)
            </p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              En SRL, il n’y a pas de capital minimum légal. L’enjeu est d’avoir des apports
              suffisants pour couvrir vos charges + votre trésorerie.
            </p>
          </div>
          <span className={["inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm", verdictClass].join(" ")}>
            <VerdictIcon className="h-4 w-4" strokeWidth={2.2} />
            {verdictLabel}
          </span>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-5 backdrop-blur">
        <p className="text-sm font-semibold text-[var(--color-text)]">Charges mensuelles (estimation)</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            id="rent"
            label="Loyer"
            value={toStr(ca.chargesMonthly.rent)}
            type="number"
            onChange={(v) => onChange("capitalAdvisor.chargesMonthly.rent", parseMoney(v))}
            onBlur={() => onBlur("capitalAdvisor.chargesMonthly.rent")}
          />
          <InputField
            id="utilities"
            label="Charges / énergie"
            value={toStr(ca.chargesMonthly.utilities)}
            type="number"
            onChange={(v) => onChange("capitalAdvisor.chargesMonthly.utilities", parseMoney(v))}
            onBlur={() => onBlur("capitalAdvisor.chargesMonthly.utilities")}
          />
          <InputField
            id="payroll"
            label="Salaires + ONSS"
            value={toStr(ca.chargesMonthly.payroll)}
            type="number"
            onChange={(v) => onChange("capitalAdvisor.chargesMonthly.payroll", parseMoney(v))}
            onBlur={() => onBlur("capitalAdvisor.chargesMonthly.payroll")}
          />
          <InputField
            id="accountant"
            label="Comptable / fiduciaire"
            value={toStr(ca.chargesMonthly.accountant)}
            type="number"
            onChange={(v) => onChange("capitalAdvisor.chargesMonthly.accountant", parseMoney(v))}
            onBlur={() => onBlur("capitalAdvisor.chargesMonthly.accountant")}
          />
          <InputField
            id="insurance"
            label="Assurances"
            value={toStr(ca.chargesMonthly.insurance)}
            type="number"
            onChange={(v) => onChange("capitalAdvisor.chargesMonthly.insurance", parseMoney(v))}
            onBlur={() => onBlur("capitalAdvisor.chargesMonthly.insurance")}
          />
          <InputField
            id="marketing"
            label="Marketing / pub"
            value={toStr(ca.chargesMonthly.marketing)}
            type="number"
            onChange={(v) => onChange("capitalAdvisor.chargesMonthly.marketing", parseMoney(v))}
            onBlur={() => onBlur("capitalAdvisor.chargesMonthly.marketing")}
          />
          <InputField
            id="subscriptions"
            label="Abonnements"
            value={toStr(ca.chargesMonthly.subscriptions)}
            type="number"
            onChange={(v) =>
              onChange("capitalAdvisor.chargesMonthly.subscriptions", parseMoney(v))
            }
            onBlur={() => onBlur("capitalAdvisor.chargesMonthly.subscriptions")}
          />
          <InputField
            id="vehicle"
            label="Véhicule / carburant"
            value={toStr(ca.chargesMonthly.vehicle)}
            type="number"
            onChange={(v) => onChange("capitalAdvisor.chargesMonthly.vehicle", parseMoney(v))}
            onBlur={() => onBlur("capitalAdvisor.chargesMonthly.vehicle")}
          />
          <InputField
            id="purchases"
            label="Achats / marchandises"
            value={toStr(ca.chargesMonthly.purchases)}
            type="number"
            onChange={(v) => onChange("capitalAdvisor.chargesMonthly.purchases", parseMoney(v))}
            onBlur={() => onBlur("capitalAdvisor.chargesMonthly.purchases")}
          />
          <InputField
            id="other"
            label="Autres"
            value={toStr(ca.chargesMonthly.other)}
            type="number"
            onChange={(v) => onChange("capitalAdvisor.chargesMonthly.other", parseMoney(v))}
            onBlur={() => onBlur("capitalAdvisor.chargesMonthly.other")}
          />
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-5 backdrop-blur">
        <p className="text-sm font-semibold text-[var(--color-text)]">Investissements & coussin</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InputField
            id="investmentsOneOff"
            label="Investissements (one-off)"
            value={toStr(ca.investmentsOneOff)}
            type="number"
            onChange={(v) => onChange("capitalAdvisor.investmentsOneOff", parseMoney(v))}
            onBlur={() => onBlur("capitalAdvisor.investmentsOneOff")}
          />
          <InputField
            id="stockInitial"
            label="Stock initial"
            value={toStr(ca.stockInitial)}
            type="number"
            onChange={(v) => onChange("capitalAdvisor.stockInitial", parseMoney(v))}
            onBlur={() => onBlur("capitalAdvisor.stockInitial")}
          />
          <InputField
            id="safetyBufferMonths"
            label="Coussin (mois)"
            value={String(ca.safetyBufferMonths ?? 3)}
            type="number"
            onChange={(v) => onChange("capitalAdvisor.safetyBufferMonths", clampInt(v, 1, 12))}
            onBlur={() => onBlur("capitalAdvisor.safetyBufferMonths")}
            helperText="Recommandé: 3 à 6 mois"
          />
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-5 backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">Résultat</p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              Besoin estimé = charges mensuelles × coussin + investissements + stock.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sand)] bg-white/60 px-3 py-1 text-sm text-[rgba(43,43,43,0.75)]">
            <Wallet className="h-4 w-4" strokeWidth={2.2} />
            {Math.round(recommended).toLocaleString("fr-BE")}€
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Metric label="Charges mensuelles" value={`${Math.round(monthlyTotal).toLocaleString("fr-BE")}€`} />
          <Metric label="Coussin" value={`${bufferMonths} mois`} />
          <Metric label="Apports prévus" value={apportsN ? `${Math.round(apportsN).toLocaleString("fr-BE")}€` : "—"} />
        </div>

        <TextareaField
          id="clientNote"
          label="Message pour le plan financier (optionnel)"
          value={ca.clientNote ?? ""}
          placeholder="Expliquez vos hypothèses (chiffres, saisonnalité, etc.)"
          onChange={(v) => onChange("capitalAdvisor.clientNote", v)}
          onBlur={() => onBlur("capitalAdvisor.clientNote")}
        />

        <p className="text-xs text-[rgba(43,43,43,0.65)]">
          Disclaimer: outil indicatif. Ce n’est pas une validation légale.
        </p>
      </div>
    </div>
  );
}

function clampInt(raw: string, min: number, max: number) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4">
      <p className="text-xs text-[rgba(43,43,43,0.70)]">{label}</p>
      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">{value}</p>
    </div>
  );
}
