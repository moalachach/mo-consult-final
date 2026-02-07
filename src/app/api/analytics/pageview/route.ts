import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseAdminConfigured, env } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  path: z.string().min(1),
  lang: z.string().optional(),
  referrer: z.string().optional(),
});

function originAllowed(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // Same-origin navigation often has no Origin.
  const appUrl = env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return true; // Can't validate; allow in dev.
  try {
    const allowed = new URL(appUrl).origin;
    return origin === allowed;
  } catch {
    return true;
  }
}

export async function POST(req: Request) {
  if (!originAllowed(req)) {
    return NextResponse.json({ ok: false, error: "Origin not allowed" }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  // No backend configured yet: succeed silently so UI never breaks.
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const ua = req.headers.get("user-agent") || "";

    const { error } = await supabase.from("page_events").insert({
      event: "pageview",
      path: parsed.data.path,
      lang: parsed.data.lang,
      referrer: parsed.data.referrer,
      user_agent: ua,
    });

    // Never 500 here: analytics must not degrade UX (and schema may not be installed yet).
    if (error) return NextResponse.json({ ok: true, stored: false });
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    // Example: schema not installed yet.
    return NextResponse.json({ ok: true, stored: false });
  }
}
