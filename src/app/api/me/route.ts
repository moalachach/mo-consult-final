import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 501 });
  }

  try {
    const supabase = await getSupabaseServerClient();
    const { data: u, error: uErr } = await supabase.auth.getUser();
    if (uErr || !u.user) {
      return NextResponse.json({ ok: false, error: "Unauthenticated" }, { status: 401 });
    }

    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("role,name")
      .eq("id", u.user.id)
      .maybeSingle();

    if (pErr) {
      return NextResponse.json({ ok: false, error: pErr.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      user: { id: u.user.id, email: u.user.email, name: (profile as any)?.name ?? null },
      role: (profile as any)?.role ?? "USER",
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Error" },
      { status: 500 }
    );
  }
}

