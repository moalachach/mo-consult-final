import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/env";
import { requireUser } from "@/lib/authz";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const postSchema = z.object({
  body: z.string().min(1),
});

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
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthenticated" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const supabase = await getSupabaseServerClient();

  // RLS ensures only messages for the user's dossier are returned.
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("dossier_id", id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, messages: data ?? [] });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured" },
      { status: 501 }
    );
  }

  try {
    await requireUser();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthenticated" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("messages")
    .insert({ dossier_id: id, sender: "client", body: parsed.data.body })
    .select("*")
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, message: data });
}

