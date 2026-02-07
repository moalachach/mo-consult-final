"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { seedDemo } from "@/lib/mock-dossiers";

export default function Page() {
  const params = useParams<{ lang: string }>();
  const lang = params.lang || "fr";
  const router = useRouter();

  useEffect(() => {
    seedDemo();
    router.replace(`/${lang}/espace-client`);
  }, [lang, router]);

  return (
    <div className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 text-center shadow-sm backdrop-blur">
          <p className="text-sm font-semibold text-[var(--color-text)]">Activation du mode demo…</p>
          <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
            Nous creons des dossiers de test en localStorage.
          </p>
        </div>
      </div>
    </div>
  );
}

