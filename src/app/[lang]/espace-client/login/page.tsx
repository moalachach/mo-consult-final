"use client";

import Link from "next/link";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ensureDemoUser, signIn } from "@/lib/mock-auth";
import { seedDemo } from "@/lib/mock-dossiers";
import { normalizeLang } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { importLocalDraftsToSupabase } from "@/lib/import-local-drafts";

export default function Page() {
  const params = useParams<{ lang: string }>();
  const lang = normalizeLang(params.lang);
  const router = useRouter();
  const [next, setNext] = React.useState(`/${lang}/espace-client`);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const n = new URLSearchParams(window.location.search).get("next");
    setNext(n || `/${lang}/espace-client`);
  }, [lang]);

  return (
    <div className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-lg px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 shadow-sm backdrop-blur"
        >
          <p className="text-sm font-semibold text-[var(--color-text)]">Espace client</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
            Inscrivez-vous / connectez-vous pour suivre l’évolution de votre dossier.
          </p>

          <div className="mt-6 grid gap-3">
            <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="mt-2 text-sm font-medium text-[var(--color-text)]" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              onClick={async () => {
                setError(null);
                if (isSupabaseConfigured()) {
                  try {
                    const supabase = getSupabaseBrowserClient();
                    const { error } = await supabase.auth.signInWithPassword({
                      email,
                      password,
                    });
                    if (error) {
                      setError(error.message);
                      return;
                    }
                    // If the user filled the wizard as a guest, import drafts now so admin can see them.
                    await importLocalDraftsToSupabase();
                    router.replace(next);
                    return;
                  } catch (e: unknown) {
                    setError(e instanceof Error ? e.message : "Erreur");
                    return;
                  }
                }

                // Fallback (UI-only mode)
                const res = signIn(email, password);
                if (!res.ok) return setError(res.error || "Erreur");
                router.replace(next);
              }}
            >
              Continuer
            </button>

            <Link
              href={`/${lang}/espace-client/register?next=${encodeURIComponent(next)}`}
              className="text-center text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              Créer un compte
            </Link>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl border border-[var(--color-sand)] bg-white/60 px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-beige)]"
              onClick={async () => {
                seedDemo();
                ensureDemoUser();
                if (isSupabaseConfigured()) {
                  try {
                    const supabase = getSupabaseBrowserClient();
                    // Note: demo user must exist in Supabase to work in real mode.
                    await supabase.auth.signInWithPassword({
                      email: "demo@moconsult.local",
                      password: "demo123",
                    });
                  } catch {
                    // ignore
                  }
                } else {
                  signIn("demo@moconsult.local", "demo123");
                }
                router.replace(`/${lang}/espace-client`);
              }}
              aria-label="Activer un compte test"
            >
              Utiliser un compte test (demo)
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-[rgba(43,43,43,0.72)]">
            <Link className="font-semibold text-[var(--color-primary)]" href={`/${lang}`}>
              Retour au site
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
