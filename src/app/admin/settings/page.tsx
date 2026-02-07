"use client";

import React from "react";
import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { FadeIn } from "@/components/fade-in";
import { LOGO_STORAGE_KEY } from "@/components/dynamic-logo";
import { ImageUp, Trash2 } from "lucide-react";
import {
  deletePromoCode,
  listPromoCodes,
  normalizePromoCode,
  upsertPromoCode,
  type PromoType,
} from "@/lib/mock-promos";

const MAX_SIZE_BYTES = 2_000_000; // keep localStorage safe-ish

export default function Page() {
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [promoError, setPromoError] = React.useState<string | null>(null);
  const [promos, setPromos] = React.useState(() => listPromoCodes());
  const [promoForm, setPromoForm] = React.useState<{
    code: string;
    type: PromoType;
    value: number;
    active: boolean;
    note: string;
  }>({ code: "", type: "percent", value: 10, active: true, note: "" });

  React.useEffect(() => {
    try {
      setDataUrl(window.localStorage.getItem(LOGO_STORAGE_KEY));
    } catch {
      setDataUrl(null);
    }
    setPromos(listPromoCodes());
  }, []);

  const onFile = async (file: File | null) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choisis un fichier image (PNG, JPG, SVG...).");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Fichier trop lourd. Essaie une image < 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const next = typeof reader.result === "string" ? reader.result : null;
      if (!next) return;
      try {
        window.localStorage.setItem(LOGO_STORAGE_KEY, next);
        setDataUrl(next);
        window.dispatchEvent(new Event("moconsult:logo"));
      } catch {
        setError("Impossible de sauvegarder le logo (stockage plein ?).");
      }
    };
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setError(null);
    try {
      window.localStorage.removeItem(LOGO_STORAGE_KEY);
      setDataUrl(null);
      window.dispatchEvent(new Event("moconsult:logo"));
    } catch {
      setError("Impossible de supprimer le logo.");
    }
  };

  return (
    <main className="home-bg">
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
        <FadeIn className="flex flex-col gap-4">
          <Badge tone="accent">Admin</Badge>
          <h1 className="text-4xl font-semibold">Settings</h1>
          <p className="max-w-2xl text-sm text-[rgba(43,43,43,0.7)]">
            Gestion simple du logo (UI only). TODO plus tard: stockage Supabase / fichier
            public + auth.
          </p>
          <Link href="/fr" className="text-sm font-semibold text-primary underline underline-offset-4">
            Retour au site
          </Link>
        </FadeIn>

        <FadeIn className="mt-10 grid gap-6 md:grid-cols-[1.2fr,1fr]">
          <Card>
            <h2 className="text-xl font-semibold">Logo</h2>
            <p className="mt-2 text-sm text-[rgba(43,43,43,0.7)]">
              Téléverse une image. Le header se met à jour automatiquement.
            </p>

            <div className="mt-6">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-sand bg-white/70 px-5 py-3 text-sm font-semibold text-primary hover:bg-[var(--color-sand)]/50">
                <ImageUp className="h-4 w-4" strokeWidth={2.2} />
                Choisir une image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            {error && (
              <p className="mt-3 text-sm font-medium text-[rgba(166,48,48,0.9)]">{error}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={clear}
                disabled={!dataUrl}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                Supprimer
              </Button>
              <span className="text-xs text-[rgba(43,43,43,0.6)]">
                Stocké dans votre navigateur (localStorage).
              </span>
            </div>
          </Card>

          <Card accent className="flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-primary">Aperçu</p>
            <div className="mt-4 h-24 w-24 rounded-3xl border border-sand bg-white/70 shadow-soft-sm">
              {dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={dataUrl} alt="Logo preview" className="h-full w-full object-contain p-3" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
                  MC
                </div>
              )}
            </div>
            <p className="mt-4 text-xs text-[rgba(43,43,43,0.65)]">
              Le logo s’affiche dans le header.
            </p>
          </Card>
        </FadeIn>

        <FadeIn className="mt-10">
          <Card>
            <h2 className="text-xl font-semibold">Codes promo</h2>
            <p className="mt-2 text-sm text-[rgba(43,43,43,0.7)]">
              UI-only: ces codes sont stockés dans votre navigateur (localStorage). Ils sont
              utilisables dans le wizard à l’étape finale (Récap).
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-primary">
                  Code (ex: MO10)
                </label>
                <input
                  value={promoForm.code}
                  onChange={(e) =>
                    setPromoForm((f) => ({ ...f, code: e.target.value }))
                  }
                  placeholder="MO10"
                  className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                />
                <p className="mt-2 text-xs text-[rgba(43,43,43,0.6)]">
                  Le code sera normalisé en majuscules (sans espaces).
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-primary">Type</label>
                  <select
                    value={promoForm.type}
                    onChange={(e) =>
                      setPromoForm((f) => ({ ...f, type: e.target.value as PromoType }))
                    }
                    className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                    aria-label="Type de réduction"
                  >
                    <option value="percent">%</option>
                    <option value="fixed">EUR</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-primary">Valeur</label>
                  <input
                    value={Number.isFinite(promoForm.value) ? promoForm.value : 0}
                    onChange={(e) =>
                      setPromoForm((f) => ({ ...f, value: Number(e.target.value) }))
                    }
                    type="number"
                    min={0}
                    step={promoForm.type === "percent" ? 1 : 5}
                    className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                    aria-label="Valeur de réduction"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary">
                <input
                  type="checkbox"
                  checked={promoForm.active}
                  onChange={(e) => setPromoForm((f) => ({ ...f, active: e.target.checked }))}
                  className="h-4 w-4 accent-[var(--color-accent)]"
                />
                Actif
              </label>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-primary">
                Note (optionnel)
              </label>
              <input
                value={promoForm.note}
                onChange={(e) => setPromoForm((f) => ({ ...f, note: e.target.value }))}
                placeholder="Ex: Offre lancement"
                className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
              />
            </div>

            {promoError ? (
              <p className="mt-3 text-sm font-medium text-[rgba(166,48,48,0.9)]">
                {promoError}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                onClick={() => {
                  setPromoError(null);
                  try {
                    upsertPromoCode({
                      code: promoForm.code,
                      type: promoForm.type,
                      value: promoForm.value,
                      active: promoForm.active,
                      note: promoForm.note || undefined,
                    });
                    setPromos(listPromoCodes());
                    setPromoForm((f) => ({ ...f, code: "" }));
                  } catch (e: unknown) {
                    const msg = e instanceof Error ? e.message : null;
                    setPromoError(msg || "Impossible d’enregistrer le code promo.");
                  }
                }}
              >
                Enregistrer
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPromoError(null);
                  setPromoForm({ code: "", type: "percent", value: 10, active: true, note: "" });
                }}
              >
                Réinitialiser
              </Button>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold text-primary">Codes existants</p>
              {promos.length === 0 ? (
                <p className="mt-3 text-sm text-[rgba(43,43,43,0.7)]">
                  Aucun code promo pour l’instant.
                </p>
              ) : (
                <div className="mt-4 grid gap-3">
                  {promos.map((p) => (
                    <div
                      key={p.code}
                      className="flex flex-col gap-2 rounded-2xl border border-sand bg-white/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text)]">
                          {p.code}{" "}
                          <span className="ml-2 rounded-full bg-white/60 px-2 py-0.5 text-xs font-semibold text-primary">
                            {p.active ? "Actif" : "Inactif"}
                          </span>
                        </p>
                        <p className="mt-1 text-sm text-[rgba(43,43,43,0.72)]">
                          {p.type === "percent" ? `${p.value}%` : `${p.value}€`}{" "}
                          {p.note ? `· ${p.note}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setPromoError(null);
                            setPromoForm({
                              code: p.code,
                              type: p.type,
                              value: p.value,
                              active: p.active,
                              note: p.note || "",
                            });
                          }}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setPromoError(null);
                            deletePromoCode(p.code);
                            setPromos(listPromoCodes());
                          }}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-sand bg-white/60 p-4 text-sm text-[rgba(43,43,43,0.72)]">
              <p className="font-semibold text-[var(--color-text)]">Test rapide</p>
              <p className="mt-1">
                1) Crée un code (ex: <span className="font-semibold">{normalizePromoCode("mo10")}</span>)
                <br />
                2) Va sur{" "}
                <span className="font-semibold">/fr/onboarding/creation-entreprise?type=srl</span>
                <br />
                3) À la fin (Récap), applique le code.
              </p>
            </div>
          </Card>
        </FadeIn>
      </div>
    </main>
  );
}
