"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

export function getSupabaseBrowserClient() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase env is missing. Configure NEXT_PUBLIC_SUPABASE_URL / ANON KEY.");
  }
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

