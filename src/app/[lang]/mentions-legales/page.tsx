"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { normalizeLang } from "@/lib/i18n";
import { Card } from "@/components/ui";

export default function Page() {
  const params = useParams<{ lang: string }>();
  const lang = normalizeLang(params.lang);

  return (
    <main className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card className="p-8">
            <h1 className="text-2xl font-semibold tracking-tight text-primary">Mentions légales</h1>
            <p className="mt-3 text-sm text-[rgba(43,43,43,0.72)]">
              Placeholder. À compléter (dénomination, TVA, siège, conditions, etc.).
            </p>

            <div className="mt-8 flex gap-3">
              <Link
                className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-soft-sm transition hover:opacity-95"
                href={`/${lang}`}
              >
                Accueil
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-2xl border border-sand bg-white/60 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-[var(--color-sand)]/50"
                href={`/${lang}/faq`}
              >
                FAQ
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

