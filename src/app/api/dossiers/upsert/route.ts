import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const Body = z.object({
  type: z.enum(["srl", "pp"]),
  status: z.enum(["new", "in_progress", "approved", "cancelled"]).optional(),
  stepIndex: z.number().int().min(0).optional(),
  draft: z.unknown(),
});

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "INVALID_BODY" }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ ok: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const { type, draft, status, stepIndex } = parsed.data;

  const row = {
    user_id: userData.user.id,
    type,
    status: status ?? "new",
    step_index: stepIndex ?? 0,
    draft,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("dossiers")
    .upsert(row, { onConflict: "user_id,type" })
    .select("id,type,status,step_index,updated_at,created_at")
    .maybeSingle();

  if (error) {
    const msg = error.message || "UNKNOWN";
    if (msg.includes("Could not find the table")) {
      // Schema not installed yet in Supabase project.
      return NextResponse.json({ ok: false, error: "SUPABASE_SCHEMA_MISSING" }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  return NextResponse.json({ ok: true, dossier: data });
}
