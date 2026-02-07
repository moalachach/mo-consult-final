import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { requireUser } from "@/lib/authz";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const patchSchema = z.object({
  draft: z.unknown(),
});

function sanitizeClientDraft(existing: any, incoming: any) {
  // Client must not be able to modify workflow statuses/admin notes.
  const next = { ...(incoming || {}) };

  const exW = existing?.workflow || {};
  const inW = next.workflow || {};

  // Preserve top-level workflow.status.
  if (exW?.status !== undefined) {
    next.workflow = { ...(inW || {}), status: exW.status };
  }

  // Preserve SRL stage admin-controlled fields but allow client inputs inside those stages.
  if (exW?.srl && typeof exW.srl === "object") {
    const exS = exW.srl;
    const inS = inW?.srl && typeof inW.srl === "object" ? inW.srl : {};

    const preserveStage = (key: string, allowedKeys: string[]) => {
      const exStage = exS[key] || {};
      const inStage = inS[key] || {};
      const out: any = {};
      for (const k of allowedKeys) out[k] = inStage[k];
      // Always preserve status + adminNote + blockers + uploads set by admin.
      out.status = exStage.status;
      if (exStage.adminNote !== undefined) out.adminNote = exStage.adminNote;
      if (exStage.blockers !== undefined) out.blockers = exStage.blockers;
      if (exStage.planFileName !== undefined) out.planFileName = exStage.planFileName;
      if (exStage.notifiedClient !== undefined) out.notifiedClient = exStage.notifiedClient;
      if (exStage.planFileName !== undefined) out.planFileName = exStage.planFileName;
      if (exStage.appointmentUrl !== undefined) out.appointmentUrl = exStage.appointmentUrl;
      if (exStage.invoiceReceived !== undefined) out.invoiceReceived = exStage.invoiceReceived;
      if (exStage.companyNumber !== undefined) out.companyNumber = exStage.companyNumber;
      if (exStage.vat604AFileName !== undefined) out.vat604AFileName = exStage.vat604AFileName;
      if (exStage.paymentAmountEUR !== undefined) out.paymentAmountEUR = exStage.paymentAmountEUR;
      return out;
    };

    const outSrl: any = { ...exS };
    outSrl.banque = preserveStage("banque", ["attestationFileName", "alternativeWithin3Months"]);
    outSrl.domiciliation = preserveStage("domiciliation", ["wantsDomiciliation", "bailFileName"]);
    outSrl.comptable = preserveStage("comptable", ["alreadyHasAccountant", "chosenAccountantKey"]);

    // Keep everything else as-is from existing to avoid privilege escalation.
    next.workflow = { ...(next.workflow || {}), srl: outSrl };
  }

  return next;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured" },
      { status: 501 }
    );
  }

  let userId: string;
  try {
    const user = await requireUser();
    userId = user.id;
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthenticated" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("dossiers")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, dossier: data });
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured" },
      { status: 501 }
    );
  }

  let userId: string;
  try {
    const user = await requireUser();
    userId = user.id;
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthenticated" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();
  const { data: existing, error: exErr } = await supabase
    .from("dossiers")
    .select("draft")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  if (exErr) return NextResponse.json({ ok: false, error: exErr.message }, { status: 500 });
  if (!existing) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const safeDraft = sanitizeClientDraft(existing.draft, parsed.data.draft);

  const { data, error } = await supabase
    .from("dossiers")
    .update({ draft: safeDraft, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, dossier: data });
}

