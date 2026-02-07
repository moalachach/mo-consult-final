"use client";

import React from "react";
import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { FadeIn } from "@/components/fade-in";
import { LOGO_STORAGE_KEYS, type LogoSlot } from "@/components/dynamic-logo";
import { ImageUp, Trash2 } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/env";
import {
  deletePromoCode,
  listPromoCodes,
  normalizePromoCode,
  upsertPromoCode,
  type PromoType,
} from "@/lib/mock-promos";

const MAX_SIZE_BYTES = 2_000_000; // keep localStorage safe-ish

function logoLabel(slot: LogoSlot) {
  return slot === "header" ? "Logo Header" : "Logo Footer";
}

function logoHelp(slot: LogoSlot) {
  return slot === "header"
    ? "Ce logo s’affiche dans le header (petit format)."
    : "Ce logo s’affiche dans le footer (format plus large possible).";
}

export default function Page() {
  const [headerUrl, setHeaderUrl] = React.useState<string | null>(null);
  const [footerUrl, setFooterUrl] = React.useState<string | null>(null);
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
      setHeaderUrl(window.localStorage.getItem(LOGO_STORAGE_KEYS.header));
      setFooterUrl(window.localStorage.getItem(LOGO_STORAGE_KEYS.footer));
    } catch {
      setHeaderUrl(null);
      setFooterUrl(null);
    }
    setPromos(listPromoCodes());
  }, []);

  const refreshPromos = React.useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setPromos(listPromoCodes());
      return;
    }
    try {
      const res = await fetch("/api/admin/promo-codes", { cache: "no-store" });
      const json = (await res.json()) as any;
      if (json?.ok) setPromos(json.promoCodes || []);
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    void refreshPromos();
  }, [refreshPromos]);

  const onFile = async (slot: LogoSlot, file: File | null) => {
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
        window.localStorage.setItem(LOGO_STORAGE_KEYS[slot], next);
        if (slot === "header") setHeaderUrl(next);
        else setFooterUrl(next);
        // Global + slot-specific events (header/footer update live).
        window.dispatchEvent(new Event("moconsult:logo"));
        window.dispatchEvent(new Event(`moconsult:logo:${slot}`));
      } catch {
        setError("Impossible de sauvegarder le logo (stockage plein ?).");
      }
    };
    reader.readAsDataURL(file);
  };

  const clear = (slot: LogoSlot) => {
    setError(null);
    try {
      window.localStorage.removeItem(LOGO_STORAGE_KEYS[slot]);
      if (slot === "header") setHeaderUrl(null);
      else setFooterUrl(null);
      window.dispatchEvent(new Event("moconsult:logo"));
      window.dispatchEvent(new Event(`moconsult:logo:${slot}`));
    } catch {
      setError("Impossible de supprimer le logo.");
    }
  };

  const LogoCard = ({
    slot,
    value,
  }: {
    slot: LogoSlot;
    value: string | null;
  }) => (
    <Card>
      <h2 className="text-xl font-semibold">{logoLabel(slot)}</h2>
      <p className="mt-2 text-sm text-[rgba(43,43,43,0.7)]">{logoHelp(slot)}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-sand bg-white/70 px-5 py-3 text-sm font-semibold text-primary hover:bg-[var(--color-sand)]/50">
          <ImageUp className="h-4 w-4" strokeWidth={2.2} />
          Choisir une image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(slot, e.target.files?.[0] ?? null)}
          />
        </label>

        <Button
          variant="outline"
          onClick={() => clear(slot)}
          disabled={!value}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" strokeWidth={2.2} />
          Supprimer
        </Button>
      </div>

      <div className="mt-5 rounded-3xl border border-sand bg-white/60 p-5">
        <p className="text-sm font-semibold text-primary">Aperçu</p>
        <div className="mt-3 rounded-3xl border border-sand bg-white/70 p-4 shadow-soft-sm">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt={`Logo preview (${slot})`}
              className={[
                "mx-auto block object-contain",
                slot === "footer" ? "h-16 w-auto max-w-[260px]" : "h-12 w-auto max-w-[110px]",
              ].join(" ")}
            />
          ) : (
            <div className="mx-auto flex h-16 w-full items-center justify-center text-sm font-bold text-primary">
              MC
            </div>
          )}
        </div>
        <p className="mt-3 text-xs text-[rgba(43,43,43,0.65)]">
          Stocké dans votre navigateur (localStorage). TODO plus tard: Supabase Storage.
        </p>
      </div>
    </Card>
  );

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

        <FadeIn className="mt-10 grid gap-6 md:grid-cols-2">
          <LogoCard slot="header" value={headerUrl} />
          <LogoCard slot="footer" value={footerUrl} />
        </FadeIn>

        {error && (
          <FadeIn className="mt-6">
            <p className="text-sm font-medium text-[rgba(166,48,48,0.9)]">{error}</p>
          </FadeIn>
        )}

        <FadeIn className="mt-10">
          <Card>
            <h2 className="text-xl font-semibold">Codes promo</h2>
            <p className="mt-2 text-sm text-[rgba(43,43,43,0.7)]">
              {isSupabaseConfigured()
                ? "Mode production (Supabase): les codes promo sont stockés en base de donnees."
                : "UI-only: ces codes sont stockés dans votre navigateur (localStorage)."}
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
                  (async () => {
                    try {
                      if (!isSupabaseConfigured()) {
                        upsertPromoCode({
                          code: promoForm.code,
                          type: promoForm.type,
                          value: promoForm.value,
                          active: promoForm.active,
                          note: promoForm.note || undefined,
                        });
                        setPromos(listPromoCodes());
                        setPromoForm((f) => ({ ...f, code: "" }));
                        return;
                      }

                      const res = await fetch("/api/admin/promo-codes", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          code: promoForm.code,
                          type: promoForm.type,
                          value: promoForm.value,
                          active: promoForm.active,
                          note: promoForm.note,
                        }),
                      });
                      const json = (await res.json()) as any;
                      if (!json?.ok) throw new Error(json?.error || "Erreur");
                      setPromoForm((f) => ({ ...f, code: "" }));
                      await refreshPromos();
                    } catch (e: unknown) {
                      const msg = e instanceof Error ? e.message : null;
                      setPromoError(msg || "Impossible d’enregistrer le code promo.");
                    }
                  })();
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
                            (async () => {
                              try {
                                if (!isSupabaseConfigured()) {
                                  deletePromoCode(p.code);
                                  setPromos(listPromoCodes());
                                  return;
                                }
                                await fetch(`/api/admin/promo-codes/${encodeURIComponent(p.code)}`, {
                                  method: "DELETE",
                                });
                                await refreshPromos();
                              } catch {
                                // ignore
                              }
                            })();
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
