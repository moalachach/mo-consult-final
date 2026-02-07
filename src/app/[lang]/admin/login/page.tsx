"use client";

import Link from "next/link";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { normalizeLang } from "@/lib/i18n";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function Page() {
  const params = useParams<{ lang: string }>();
  const lang = normalizeLang(params.lang);
  const router = useRouter();
  const [next, setNext] = React.useState("/admin/dashboard");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const n = new URLSearchParams(window.location.search).get("next");
    setNext(n || "/admin/dashboard");
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-lg px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 shadow-sm backdrop-blur"
        >
          <p className="text-sm font-semibold text-[var(--color-text)]">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            Connexion
          </h1>
          <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
            Accès réservé. Connectez-vous avec votre email + mot de passe.
          </p>

          {!isSupabaseConfigured() ? (
            <div className="mt-6 rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4 text-sm text-[rgba(43,43,43,0.72)]">
              Supabase n’est pas configuré. Ajoutez les variables d’environnement pour activer l’admin.
            </div>
          ) : null}

          <div className="mt-6 grid gap-3">
            <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
              placeholder="admin@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <label
              className="mt-2 text-sm font-medium text-[var(--color-text)]"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-50"
              disabled={!isSupabaseConfigured()}
              onClick={async () => {
                setError(null);
                try {
                  const supabase = getSupabaseBrowserClient();
                  const { error } = await supabase.auth.signInWithPassword({ email, password });
                  if (error) {
                    setError(error.message);
                    return;
                  }
                  router.replace(next);
                } catch (e: unknown) {
                  setError(e instanceof Error ? e.message : "Erreur");
                }
              }}
              aria-label="Se connecter (admin)"
            >
              Continuer
            </button>

            <div className="mt-3 flex items-center justify-between text-sm">
              <Link
                href={`/${lang}`}
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                Retour au site
              </Link>
              <Link
                href={`/${lang}/espace-client/login`}
                className="font-semibold text-[var(--color-primary)] hover:underline"
              >
                Espace client
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

