"use client";

export type PromoType = "percent" | "fixed";

export type PromoCode = {
  code: string; // stored normalized (UPPERCASE)
  type: PromoType;
  value: number; // percent (1-100) or fixed EUR (>=1)
  active: boolean;
  createdAt: string; // ISO
  note?: string;
};

const STORAGE_KEY = "moconsult.promos";

function safeParse(json: string | null): PromoCode[] {
  if (!json) return [];
  try {
    const data = JSON.parse(json) as PromoCode[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function normalizePromoCode(code: string) {
  return code.trim().replace(/\s+/g, "").toUpperCase();
}

export function listPromoCodes(): PromoCode[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY)).sort((a, b) =>
    (b.createdAt || "").localeCompare(a.createdAt || "")
  );
}

export function upsertPromoCode(next: Omit<PromoCode, "code" | "createdAt"> & { code: string }) {
  if (typeof window === "undefined") return;
  const code = normalizePromoCode(next.code);
  if (!code) throw new Error("Code promo vide");
  if (next.type === "percent" && !(next.value > 0 && next.value <= 100)) {
    throw new Error("Pourcentage invalide (1..100)");
  }
  if (next.type === "fixed" && !(next.value > 0)) {
    throw new Error("Montant invalide (> 0)");
  }

  const now = new Date().toISOString();
  const all = listPromoCodes();
  const idx = all.findIndex((p) => p.code === code);
  const promo: PromoCode = {
    code,
    type: next.type,
    value: next.value,
    active: next.active,
    note: next.note,
    createdAt: idx >= 0 ? all[idx]!.createdAt : now,
  };
  const updated = idx >= 0 ? all.map((p) => (p.code === code ? promo : p)) : [promo, ...all];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deletePromoCode(codeInput: string) {
  if (typeof window === "undefined") return;
  const code = normalizePromoCode(codeInput);
  const all = listPromoCodes();
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(all.filter((p) => p.code !== code))
  );
}

export function findPromoCode(codeInput: string): PromoCode | null {
  const code = normalizePromoCode(codeInput);
  if (!code) return null;
  const all = listPromoCodes();
  const p = all.find((x) => x.code === code) ?? null;
  if (!p || !p.active) return null;
  return p;
}

export function applyPromoToAmountEUR(amountEUR: number, promo: PromoCode) {
  const base = Math.max(0, Number(amountEUR) || 0);
  const discount =
    promo.type === "percent" ? (base * promo.value) / 100 : promo.value;
  const discounted = Math.max(0, base - discount);
  // Keep 2 decimals max (EUR display).
  const round2 = (n: number) => Math.round(n * 100) / 100;
  return {
    baseEUR: round2(base),
    discountEUR: round2(Math.min(base, discount)),
    totalEUR: round2(discounted),
  };
}

