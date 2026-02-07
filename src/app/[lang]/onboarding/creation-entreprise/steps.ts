import type { CreationType, StepConfig } from "./types";

const STEPS: StepConfig[] = [
  {
    id: "resume",
    label: "Formule",
  },
  {
    id: "identite",
    label: "Identité",
    requiredPaths: ["identite.prenom", "identite.nom", "identite.email", "identite.tel"],
  },
  {
    id: "adresse_activite",
    label: "Adresse & activité",
    requiredPaths: [
      "adresse.rue",
      "adresse.numero",
      "adresse.cp",
      "adresse.ville",
      "activite.description",
    ],
  },
  {
    id: "specifics",
    label: "Spécifique",
    requiredPaths: [],
  },
  {
    id: "capital_advisor",
    label: "Apports",
    visibleWhen: (type) => type === "srl",
  },
  {
    id: "docs",
    label: "Documents",
  },
  {
    id: "account",
    label: "Compte",
  },
  {
    id: "recap",
    label: "Récap",
  },
];

export function getSteps(type: CreationType): StepConfig[] {
  // Steps are stable. We keep the content per type in step components,
  // but we can still expose type-specific required paths for backend-ready wiring.
  return STEPS.map((s) => {
    if (s.id !== "specifics") return s;
    return {
      ...s,
      label: type === "srl" ? "SRL" : "Indépendant",
      requiredPaths:
        type === "srl"
          ? ["specifics.apports", "specifics.nbAssocies"]
          : ["specifics.comptePro"],
    };
  }).filter((s) => !s.visibleWhen || s.visibleWhen(type));
}
