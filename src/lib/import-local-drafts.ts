"use client";

// Imports any localStorage wizard drafts into Supabase (via our API routes).
// This makes "guest fills wizard -> registers/logs in -> admin sees dossier" work.

export type ImportResult = {
  imported: Array<{ type: "srl" | "pp"; ok: boolean; error?: string }>;
};

function draftKey(type: "srl" | "pp") {
  return `moConsult:onboarding:creationEntreprise:${type}:draft`;
}

function progressKey(type: "srl" | "pp") {
  return `moConsult:onboarding:creationEntreprise:${type}:progress`;
}

function safeParseJSON(raw: string) {
  try {
    return JSON.parse(raw) as any;
  } catch {
    return null;
  }
}

export async function importLocalDraftsToSupabase(): Promise<ImportResult> {
  if (typeof window === "undefined") return { imported: [] };

  const types: Array<"srl" | "pp"> = ["srl", "pp"];
  const imported: ImportResult["imported"] = [];

  for (const type of types) {
    const rawDraft = localStorage.getItem(draftKey(type));
    if (!rawDraft) continue;

    const draft = safeParseJSON(rawDraft);
    if (!draft || typeof draft !== "object") continue;
    if (!draft.type) draft.type = type;

    const stepIndex = Number(localStorage.getItem(progressKey(type)) || "0") || 0;

    try {
      const res = await fetch("/api/dossiers/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, stepIndex, draft }),
      });
      const json = (await res.json()) as any;
      imported.push({ type, ok: !!json?.ok, error: json?.error });
    } catch (e: any) {
      imported.push({ type, ok: false, error: e?.message || "Import failed" });
    }
  }

  return { imported };
}

