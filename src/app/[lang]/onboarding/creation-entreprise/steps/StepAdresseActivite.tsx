"use client";

import type { Draft } from "../types";
import { InputField, TextareaField } from "../components/Field";

type Props = {
  draft: Draft;
  errors: Record<string, string>;
  showError: (path: string) => boolean;
  onChange: (path: string, value: any) => void;
  onBlur: (path: string) => void;
};

export function StepAdresseActivite({ draft, errors, showError, onChange, onBlur }: Props) {
  const get = (path: string) =>
    path.split(".").reduce<any>((acc, k) => (acc ? acc[k] : undefined), draft) ?? "";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InputField
        id="adresse-rue"
        label="Rue"
        required
        value={get("adresse.rue")}
        placeholder="Ex: Avenue Louise"
        error={errors["adresse.rue"]}
        showError={showError("adresse.rue")}
        onChange={(v) => onChange("adresse.rue", v)}
        onBlur={() => onBlur("adresse.rue")}
      />
      <InputField
        id="adresse-numero"
        label="Numéro"
        required
        value={get("adresse.numero")}
        placeholder="Ex: 12"
        error={errors["adresse.numero"]}
        showError={showError("adresse.numero")}
        onChange={(v) => onChange("adresse.numero", v)}
        onBlur={() => onBlur("adresse.numero")}
      />
      <InputField
        id="adresse-cp"
        label="Code postal"
        required
        value={get("adresse.cp")}
        placeholder="Ex: 1000"
        error={errors["adresse.cp"]}
        showError={showError("adresse.cp")}
        onChange={(v) => onChange("adresse.cp", v)}
        onBlur={() => onBlur("adresse.cp")}
      />
      <InputField
        id="adresse-ville"
        label="Ville"
        required
        value={get("adresse.ville")}
        placeholder="Ex: Bruxelles"
        error={errors["adresse.ville"]}
        showError={showError("adresse.ville")}
        onChange={(v) => onChange("adresse.ville", v)}
        onBlur={() => onBlur("adresse.ville")}
      />
      <TextareaField
        id="activite-description"
        className="sm:col-span-2"
        label="Activité (description)"
        required
        value={get("activite.description")}
        placeholder="Décrivez votre activité..."
        error={errors["activite.description"]}
        showError={showError("activite.description")}
        onChange={(v) => onChange("activite.description", v)}
        onBlur={() => onBlur("activite.description")}
      />

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
          NACE (optionnel)
        </label>
        <input
          className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
          placeholder="Ex: 62.010"
          value={draft.activite.nace}
          onChange={(e) => onChange("activite.nace", e.target.value)}
          onBlur={() => onBlur("activite.nace")}
        />
      </div>
    </div>
  );
}
