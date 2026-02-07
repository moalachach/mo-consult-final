import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AppRole = "USER" | "ADMIN";

export async function requireUser() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("UNAUTHENTICATED");
  return data.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  const supabase = await getSupabaseServerClient();

  // Simple role model: stored in `profiles.role`.
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error("AUTHZ_FAILED");
  if (!data || data.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}

