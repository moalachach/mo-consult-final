import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    ok: true,
    supabaseConfigured: isSupabaseConfigured(),
    time: new Date().toISOString(),
  });
}

