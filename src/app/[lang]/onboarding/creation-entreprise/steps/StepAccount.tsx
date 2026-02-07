"use client";

import React from "react";
import { InputField } from "../components/Field";
import type { Session } from "@/lib/mock-auth";

type AccountForm = {
  name: string;
  email: string;
  password: string;
};

export function StepAccount({
  session,
  form,
  errors,
  showError,
  onChange,
  onBlur,
}: {
  session: Session | null;
  form: AccountForm;
  errors: Record<string, string>;
  showError: (key: string) => boolean;
  onChange: (key: keyof AccountForm, value: string) => void;
  onBlur: (key: keyof AccountForm) => void;
}) {
  if (session) {
    return (
      <div className="rounded-2xl border border-[var(--color-sand)] bg-white/70 p-5">
        <p className="text-sm font-semibold text-[var(--color-text)]">Compte</p>
        <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
          Vous êtes connecté en tant que{" "}
          <span className="font-semibold">{session.email}</span>.
        </p>
        <p className="mt-1 text-sm text-[rgba(43,43,43,0.72)]">
          Vous pouvez continuer vers le paiement.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-[var(--color-sand)] bg-white/70 p-5">
        <p className="text-sm font-semibold text-[var(--color-text)]">
          Inscription (avant paiement)
        </p>
        <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
          Créez votre compte pour suivre l’évolution du dossier après le paiement.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          id="accountName"
          label="Nom"
          required
          value={form.name}
          onChange={(v) => onChange("name", v)}
          onBlur={() => onBlur("name")}
          error={errors.name}
          showError={showError("name")}
        />
        <InputField
          id="accountEmail"
          label="Email"
          required
          value={form.email}
          onChange={(v) => onChange("email", v)}
          onBlur={() => onBlur("email")}
          error={errors.email}
          showError={showError("email")}
        />
        <InputField
          id="accountPassword"
          label="Mot de passe"
          required
          type="password"
          value={form.password}
          onChange={(v) => onChange("password", v)}
          onBlur={() => onBlur("password")}
          error={errors.password}
          showError={showError("password")}
          className="sm:col-span-2"
          helperText="Min 6 caractères (UI-only)."
        />
      </div>
    </div>
  );
}

