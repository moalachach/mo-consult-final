import type { CreationType, Draft } from "./types";

const DRAFT_PREFIX = "moConsult:onboarding:creationEntreprise";

export function draftKey(type: CreationType) {
  return `${DRAFT_PREFIX}:${type}:draft`;
}

export function progressKey(type: CreationType) {
  return `${DRAFT_PREFIX}:${type}:progress`;
}

export function loadDraft(type: CreationType): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(draftKey(type));
    if (!raw) return null;
    return JSON.parse(raw) as Draft;
  } catch {
    return null;
  }
}

export function saveDraft(type: CreationType, draft: Draft): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(draftKey(type), JSON.stringify(draft));
  } catch {
    // Ignore quota/private-mode errors (UI-only). Caller may add a toast later.
  }
}

export function clearDraft(type: CreationType): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(draftKey(type));
  localStorage.removeItem(progressKey(type));
}

export function loadProgress(type: CreationType): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(progressKey(type));
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export function saveProgress(type: CreationType, idx: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(progressKey(type), String(idx));
}
