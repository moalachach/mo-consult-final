"use client";

import React from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { getSession } from "@/lib/mock-auth";
import { normalizeLang } from "@/lib/i18n";

function isPublicClientRoute(pathname: string) {
  return (
    pathname.includes("/espace-client/login") ||
    pathname.includes("/espace-client/register") ||
    pathname.includes("/espace-client/demo")
  );
}

function safeNextForClientSpace(lang: string, rawNext: string) {
  // Prevent redirects into admin from a client-space auth prompt.
  // Only allow redirects within the client space for this locale.
  if (!rawNext) return `/${lang}/espace-client`;
  if (!rawNext.startsWith("/")) return `/${lang}/espace-client`;
  const allowedPrefix = `/${lang}/espace-client`;
  return rawNext.startsWith(allowedPrefix) ? rawNext : `/${lang}/espace-client`;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ lang: string }>();
  const lang = normalizeLang(params.lang);
  const pathname = usePathname();
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

    const next =
      typeof window !== "undefined"
        ? safeNextForClientSpace(
            lang,
            new URLSearchParams(window.location.search).get("next") || pathname
          )
        : pathname;
    router.replace(`/${lang}/espace-client/login?next=${encodeURIComponent(next)}`);
  }, [authed, lang, mounted, pathname, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--color-beige)]">
        <div className="mx-auto max-w-6xl px-4 py-10">
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
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">Redirection…</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
