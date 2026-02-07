"use client";

import React from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { getSession } from "@/lib/mock-auth";
import { normalizeLang } from "@/lib/i18n";

function isPublicClientRoute(pathname: string) {
  return (
    pathname.includes("/espace-client/login") ||
    pathname.includes("/espace-client/register") ||
    pathname.includes("/espace-client/demo")
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ lang: string }>();
  const lang = normalizeLang(params.lang);
  const pathname = usePathname();
  const sp = useSearchParams();
  const router = useRouter();

  const [mounted, setMounted] = React.useState(false);
  const [authed, setAuthed] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
    setAuthed(!!getSession());
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    if (isPublicClientRoute(pathname)) return;
    if (authed) return;

    const next = sp.get("next") || pathname;
    router.replace(`/${lang}/espace-client/login?next=${encodeURIComponent(next)}`);
  }, [authed, lang, mounted, pathname, router, sp]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--color-beige)]">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">Chargement…</p>
          </div>
        </div>
      </div>
    );
  }

  // If redirecting, avoid flashing protected UI.
  if (!authed && !isPublicClientRoute(pathname)) {
    return (
      <div className="min-h-screen bg-[var(--color-beige)]">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">Redirection…</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

