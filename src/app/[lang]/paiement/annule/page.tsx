"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { normalizeLang } from "@/lib/i18n";

export default function Page() {
  const params = useParams<{ lang: string }>();
  const lang = normalizeLang(params.lang);

  return (
    <div className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 shadow-sm backdrop-blur"
        >
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-6 w-6 text-[rgb(153,27,27)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">Paiement annulé</p>
              <p className="mt-1 text-sm text-[rgba(43,43,43,0.72)]">
                Aucun montant n’a été débité. Vous pouvez réessayer quand vous voulez.
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  className="rounded-2xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  href={`/${lang}/onboarding/creation-entreprise?type=srl`}
                >
                  Retour au wizard
                </Link>
                <Link
                  className="rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-beige)]"
                  href={`/${lang}`}
                >
                  Accueil
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

