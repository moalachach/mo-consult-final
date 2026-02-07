"use client";

import type { CreationType, Draft } from "../types";
import { InputField } from "../components/Field";

type Props = {
  type: CreationType;
  draft: Draft;
  errors: Record<string, string>;
  showError: (path: string) => boolean;
  onChange: (path: string, value: any) => void;
  onBlur: (path: string) => void;
};

export function StepSpecific({ type, draft, errors, showError, onChange, onBlur }: Props) {
  if (type === "srl") {
    const fields = [
      { path: "specifics.apports", label: "Apports / capital (estimation)", placeholder: "Ex: 1000" },
      { path: "specifics.nbAssocies", label: "Nombre d'associés", placeholder: "Ex: 2" },
    ];

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <InputField
            key={f.path}
            id={f.path.replace(/\./g, "-")}
            label={f.label}
            required
            value={(f.path.split(".").reduce<any>((acc, k) => (acc ? acc[k] : undefined), draft) ??
              "") as string}
            placeholder={f.placeholder}
            error={errors[f.path]}
            showError={showError(f.path)}
            onChange={(v) => onChange(f.path, v)}
            onBlur={() => onBlur(f.path)}
          />
        ))}
      </div>
    );
  }

  const err = errors["specifics.comptePro"];
  const visibleErr = !!err && showError("specifics.comptePro");
  const value = draft.specifics.comptePro;

  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-text)]">
        Avez-vous déjà un compte pro ? <span className="text-red-500">*</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {[
          { label: "Oui", v: true },
          { label: "Non", v: false },
        ].map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => {
              onChange("specifics.comptePro", opt.v);
              onBlur("specifics.comptePro");
            }}
            onBlur={() => onBlur("specifics.comptePro")}
            className={[
              "inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-sm font-semibold transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-beige)]",
              value === opt.v
                ? "border-[var(--color-primary)] bg-[rgba(31,143,95,0.12)] text-[var(--color-primary)]"
                : "border-[var(--color-sand)] bg-white text-[rgba(43,43,43,0.8)] hover:bg-[var(--color-beige)]",
            ].join(" ")}
            aria-pressed={value === opt.v}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {visibleErr && <p className="mt-2 text-sm text-red-600">{err}</p>}
    </div>
  );
}
