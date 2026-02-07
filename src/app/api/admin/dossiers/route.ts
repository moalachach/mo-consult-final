import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseAdminConfigured } from "@/lib/env";
import { requireAdmin } from "@/lib/authz";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const querySchema = z.object({
  status: z.string().optional(),
});

export async function GET(req: Request) {
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

  const url = new URL(req.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  const status = parsed.success ? parsed.data.status : undefined;

  const supabase = getSupabaseAdminClient();
  let q = supabase
    .from("dossiers")
    .select("id,type,status,updated_at")
    .order("updated_at", { ascending: false });

  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, dossiers: data ?? [] });
}

