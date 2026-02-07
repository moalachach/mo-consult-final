"use client";

import type { Draft } from "../types";
import { InputField } from "../components/Field";

type Props = {
  draft: Draft;
  errors: Record<string, string>;
  showError: (path: string) => boolean;
  onChange: (path: string, value: any) => void;
  onBlur: (path: string) => void;
};

export function StepIdentite({ draft, errors, showError, onChange, onBlur }: Props) {
  const get = (path: string) =>
    path.split(".").reduce<any>((acc, k) => (acc ? acc[k] : undefined), draft) ?? "";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InputField
        id="identite-prenom"
        label="Prénom"
        required
        value={get("identite.prenom")}
        placeholder="Ex: Mohamed"
        error={errors["identite.prenom"]}
        showError={showError("identite.prenom")}
        onChange={(v) => onChange("identite.prenom", v)}
        onBlur={() => onBlur("identite.prenom")}
      />
      <InputField
        id="identite-nom"
        label="Nom"
        required
        value={get("identite.nom")}
        placeholder="Ex: Al Achach"
        error={errors["identite.nom"]}
        showError={showError("identite.nom")}
        onChange={(v) => onChange("identite.nom", v)}
        onBlur={() => onBlur("identite.nom")}
      />
      <InputField
        id="identite-email"
        label="Email"
        type="email"
        required
        value={get("identite.email")}
        placeholder="Ex: vous@email.com"
        error={errors["identite.email"]}
        showError={showError("identite.email")}
        onChange={(v) => onChange("identite.email", v)}
        onBlur={() => onBlur("identite.email")}
      />
      <InputField
        id="identite-tel"
        label="Téléphone"
        type="tel"
        required
        value={get("identite.tel")}
        placeholder="Ex: +32 4 00 00 00 00"
        error={errors["identite.tel"]}
        showError={showError("identite.tel")}
        onChange={(v) => onChange("identite.tel", v)}
        onBlur={() => onBlur("identite.tel")}
      />
    </div>
  );
}
