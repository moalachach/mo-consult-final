import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });
  }

  const supabase = await getSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ ok: false, error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("dossiers")
    .select("id,type,status,step_index,updated_at,created_at,draft")
    .eq("user_id", userData.user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    const msg = error.message || "UNKNOWN";
    if (msg.includes("Could not find the table")) {
      return NextResponse.json({ ok: false, error: "SUPABASE_SCHEMA_MISSING" }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  // minimal validation to keep response stable
  const Row = z.object({
    id: z.string(),
    type: z.string(),
    status: z.string(),
    step_index: z.number(),
    updated_at: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    draft: z.any(),
  });

  const parsed = z.array(Row).safeParse(data ?? []);
  return NextResponse.json({ ok: true, dossiers: parsed.success ? parsed.data : data ?? [] });
}
