import React from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { requireAdmin } from "@/lib/authz";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    // Allow UI-first work without a backend, but block admin in production until configured.
    return (
      <div className="min-h-screen bg-[var(--color-beige)]">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 shadow-soft-sm backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">Admin</p>
            <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
              Supabase n’est pas configuré. Ajoutez les variables d’environnement sur Vercel
              pour activer l’espace admin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  try {
    await requireAdmin();
  } catch {
    redirect(`/fr/espace-client/login?next=${encodeURIComponent("/admin")}`);
  }

  return <>{children}</>;
}

