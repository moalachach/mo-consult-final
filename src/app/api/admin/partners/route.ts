import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseAdminConfigured } from "@/lib/env";
import { requireAdmin } from "@/lib/authz";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const PartnerBody = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2).max(80),
  category: z.string().min(2).max(40),
  name: z.string().min(2).max(120),
  website: z.string().url().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  vat: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  is_active: z.boolean().optional(),
});

export async function GET() {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ ok: false, error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });
  }
  await requireAdmin();

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("partners")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, partners: data ?? [] });
}

export async function POST(req: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ ok: false, error: "SUPABASE_NOT_CONFIGURED" }, { status: 503 });
  }
  await requireAdmin();

  const json = await req.json().catch(() => null);
  const parsed = PartnerBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "INVALID_BODY" }, { status: 400 });
  }

  const p = parsed.data;
  const admin = getSupabaseAdminClient();

  const row = {
    id: p.id,
    slug: p.slug.trim(),
    category: p.category.trim(),
    name: p.name.trim(),
    website: p.website ? String(p.website).trim() : null,
    city: p.city ? String(p.city).trim() : null,
    address: p.address ? String(p.address).trim() : null,
    phone: p.phone ? String(p.phone).trim() : null,
    email: p.email ? String(p.email).trim() : null,
    vat: p.vat ? String(p.vat).trim() : null,
    description: p.description ? String(p.description).trim() : null,
    is_active: p.is_active ?? true,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await admin.from("partners").upsert(row, { onConflict: "slug" }).select("*").maybeSingle();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, partner: data });
}
