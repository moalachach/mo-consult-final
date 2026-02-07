"use client";

import React from "react";
import type { Draft } from "../types";
import { CloudUpload, Paperclip, Trash2, Users } from "lucide-react";
import { InputField } from "../components/Field";

type Props = {
  draft: Draft;
  onChange: (path: string, value: any) => void;
};

export function StepDocs({ draft, onChange }: Props) {
  const founders = draft.docs.foundersIds || [];
  const admins = draft.docs.adminsIds || [];
  const [drag, setDrag] = React.useState(false);
  const [dragA, setDragA] = React.useState(false);

  const addFiles = (files: File[], key: "docs.foundersIds" | "docs.adminsIds") => {
    const added = files.map((f) => f.name).filter(Boolean);
    if (added.length === 0) return;
    const current = key === "docs.foundersIds" ? founders : admins;
    const next = Array.from(new Set([...current, ...added]));
    onChange(key, next);
  };

  const helper = "1 personne = 2 fichiers (recto + verso).";

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-[var(--color-sand)] bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Cartes d’identité (mock)
            </p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              UI-only. On garde seulement les noms des fichiers.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm text-[rgba(43,43,43,0.65)]">
            <Users className="h-4 w-4" strokeWidth={2.2} />
            {helper}
          </span>
        </div>

        {/* Founders */}
        <div className="mt-6 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">
                Fondateurs (recto/verso)
              </p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">{helper}</p>
            </div>
            <div className="w-full sm:w-[220px]">
              <InputField
                id="foundersCount"
                label="Nombre de fondateurs"
                value={String(draft.docs.foundersCount ?? 1)}
                type="number"
                onChange={(v) =>
                  onChange("docs.foundersCount", clampNumber(v, 1, 5))
                }
              />
            </div>
          </div>

          <UploadBlock
            drag={drag}
            setDrag={setDrag}
            onAdd={(files) => addFiles(files, "docs.foundersIds")}
            ariaLabel="Zone de dépôt cartes fondateurs"
          />

          <FileList
            names={founders}
            onRemove={(name) => onChange("docs.foundersIds", founders.filter((x) => x !== name))}
          />
        </div>

        {/* Admins */}
        <div className="mt-5 rounded-2xl border border-[var(--color-sand)] bg-white/70 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">
                Administrateurs (recto/verso)
              </p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
                Si identique aux fondateurs, vous pouvez indiquer dans les notes.
              </p>
            </div>
            <div className="w-full sm:w-[240px]">
              <InputField
                id="adminsCount"
                label="Nombre d’administrateurs"
                value={String(draft.docs.adminsCount ?? 1)}
                type="number"
                onChange={(v) =>
                  onChange("docs.adminsCount", clampNumber(v, 1, 5))
                }
              />
            </div>
          </div>

          <UploadBlock
            drag={dragA}
            setDrag={setDragA}
            onAdd={(files) => addFiles(files, "docs.adminsIds")}
            ariaLabel="Zone de dépôt cartes administrateurs"
          />

          <FileList
            names={admins}
            onRemove={(name) => onChange("docs.adminsIds", admins.filter((x) => x !== name))}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
          Remarques (optionnel)
        </label>
        <textarea
          className="min-h-[120px] w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
          placeholder="Ajoutez une note si besoin..."
          value={draft.docs.notes}
          onChange={(e) => onChange("docs.notes", e.target.value)}
        />
      </div>
    </div>
  );
}

function clampNumber(raw: string, min: number, max: number) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function UploadBlock({
  drag,
  setDrag,
  onAdd,
  ariaLabel,
}: {
  drag: boolean;
  setDrag: (v: boolean) => void;
  onAdd: (files: File[]) => void;
  ariaLabel: string;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm text-[rgba(43,43,43,0.70)]">
          Glissez-déposez vos fichiers ici (mock).
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-beige)]">
          <Paperclip className="h-4 w-4" strokeWidth={2.2} />
          Ajouter
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              onAdd(Array.from(e.target.files || []));
              e.currentTarget.value = "";
            }}
          />
        </label>
      </div>

      <div
        className={[
          "mt-3 rounded-2xl border border-dashed p-5 transition",
          drag
            ? "border-[var(--color-accent)] bg-[rgba(31,143,95,0.08)]"
            : "border-[var(--color-sand)] bg-[var(--color-beige)]/40",
        ].join(" ")}
        onDragEnter={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDrag(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          onAdd(Array.from(e.dataTransfer.files || []));
        }}
        role="region"
        aria-label={ariaLabel}
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 text-[var(--color-accent)]">
            <CloudUpload className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">
              Déposez vos fichiers
            </p>
            <p className="mt-1 text-sm text-[rgba(43,43,43,0.70)]">
              On stocke uniquement les noms (UI-only).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileList({ names, onRemove }: { names: string[]; onRemove: (n: string) => void }) {
  return (
    <div className="mt-4 grid gap-2">
      {names.length === 0 ? (
        <p className="text-sm text-[rgba(43,43,43,0.65)]">Aucun fichier ajouté.</p>
      ) : (
        names.map((n) => (
          <div
            key={n}
            className="flex items-center justify-between rounded-2xl border border-[var(--color-sand)] bg-white/70 px-4 py-2"
          >
            <span className="text-sm text-[rgba(43,43,43,0.78)]">{n}</span>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-[rgba(43,43,43,0.65)] hover:bg-[var(--color-beige)]"
              onClick={() => onRemove(n)}
              aria-label={`Supprimer ${n}`}
            >
              <Trash2 className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
