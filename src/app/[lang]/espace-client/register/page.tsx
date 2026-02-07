"use client";

import Link from "next/link";
import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { registerUser } from "@/lib/mock-auth";
import { normalizeLang } from "@/lib/i18n";

export default function Page() {
  const params = useParams<{ lang: string }>();
  const lang = normalizeLang(params.lang);
  const sp = useSearchParams();
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const next = sp.get("next") || `/${lang}/espace-client`;

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
            Inscription
          </h1>
          <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
            Créez votre compte pour suivre votre dossier et recevoir les confirmations.
          </p>

          <div className="mt-6 grid gap-3">
            <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="name">
              Nom
            </label>
            <input
              id="name"
              className="w-full rounded-2xl border border-[var(--color-sand)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="mt-2 text-sm font-medium text-[var(--color-text)]" htmlFor="email">
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
              placeholder="Min 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              onClick={() => {
                setError(null);
                const res = registerUser({ name, email, password });
                if (!res.ok) {
                  setError(res.error || "Erreur");
                  return;
                }
                router.replace(next);
              }}
            >
              Créer mon compte
            </button>

            <Link
              href={`/${lang}/espace-client/login?next=${encodeURIComponent(next)}`}
              className="text-center text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              J’ai déjà un compte
            </Link>
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

