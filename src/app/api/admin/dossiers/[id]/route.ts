import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseAdminConfigured } from "@/lib/env";
import { requireAdmin } from "@/lib/authz";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const patchSchema = z.object({
  status: z.string().optional(),
  draft: z.unknown().optional(),
});

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase admin is not configured" },
      { status: 501 }
    );
  }

  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("dossiers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true, dossier: data });
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase admin is not configured" },
      { status: 501 }
    );
  }

  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const { status, draft } = parsed.data;
  const supabase = getSupabaseAdminClient();

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (status) update.status = status;
  if (draft !== undefined) update.draft = draft;

  const { data, error } = await supabase
    .from("dossiers")
    .update(update)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, dossier: data });
}

