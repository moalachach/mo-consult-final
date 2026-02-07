"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { normalizeLang } from "@/lib/i18n";

const FAQ = [
  {
    q: "Combien de temps pour recevoir mon numéro d’entreprise ?",
    a: "En général, après le rendez-vous chez le notaire, le numéro arrive souvent sous 24–48h (selon les délais).",
  },
  {
    q: "Pourquoi demandez-vous des apports en SRL ?",
    a: "Il n’y a pas de capital minimum légal. L’objectif est d’avoir des apports suffisants pour couvrir les charges et la trésorerie de démarrage.",
  },
  {
    q: "Je n’ai pas encore de banque, je fais comment ?",
    a: "Vous pouvez choisir l’alternative “ouvrir un compte dans les 3 mois” selon votre situation. Mo Consult vous guide.",
  },
  {
    q: "Comment puis-je poser une question ?",
    a: "Depuis votre espace client, utilisez la section “Messages”.",
  },
];

export default function Page() {
  const params = useParams<{ lang: string }>();
  const lang = normalizeLang(params.lang);

  return (
    <div className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 shadow-sm backdrop-blur"
        >
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text)]">
            FAQ
          </h1>
          <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
            Questions fréquentes (placeholder). On enrichira au fur et à mesure.
          </p>

          <div className="mt-6 grid gap-3">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-[var(--color-sand)] bg-white/60 p-5"
              >
                <p className="text-sm font-semibold text-[var(--color-text)]">{item.q}</p>
                <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              href={`/${lang}/espace-client`}
            >
              Espace client
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-2xl border border-[var(--color-sand)] bg-white/60 px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-beige)]"
              href={`/${lang}`}
            >
              Accueil
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

