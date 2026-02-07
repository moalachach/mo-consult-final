"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { getT, normalizeLang } from "@/lib/i18n";
import { DynamicLogo } from "@/components/dynamic-logo";
import { LangDropdown } from "@/components/lang-dropdown";
import { Menu, UserRound, X } from "lucide-react";

export function SiteHeader({ lang }: { lang: string }) {
  const safeLang = normalizeLang(lang);
  const t = getT(safeLang);
  const pathname = usePathname() || `/${safeLang}`;
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    // Close mobile drawer on route changes.
    setOpen(false);
  }, [pathname]);

  const isHome = pathname === `/${safeLang}`;

  const navLink =
    "relative text-[rgba(26,26,26,0.72)] transition hover:text-[var(--color-primary)]";

  return (
    <header className="sticky top-0 z-40 border-b border-sand bg-[var(--color-beige)]/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
        {/* Left: logo (dynamic) */}
        <div className="flex flex-1 items-center">
          <Link
            href={`/${safeLang}`}
            className="inline-flex items-center"
            aria-label="Mo Consult - Accueil"
          >
            <DynamicLogo />
          </Link>
        </div>

        {/* Center: nav */}
        <nav className="hidden flex-1 items-center justify-center gap-9 text-sm font-medium md:flex">
          <Link href={`/${safeLang}`} className={[navLink, isHome && "text-primary"].join(" ")}>
            {t.nav.home}
            {isHome && (
              <span className="absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--color-accent)]" />
            )}
          </Link>
          <Link href={`/${safeLang}/#offres`} className={navLink}>
            {t.nav.offers}
          </Link>
          <Link href={`/${safeLang}/#comment-ca-marche`} className={navLink}>
            {t.nav.process}
          </Link>
          <Link href={`/${safeLang}/#partenaires`} className={navLink}>
            {t.nav.partners}
          </Link>
          <Link href={`/${safeLang}/#contact`} className={navLink}>
            {t.nav.contact}
          </Link>
        </nav>

        {/* Right: language + CTA */}
        <div className="flex flex-1 items-center justify-end gap-3">
          {/* Next.js requires a Suspense boundary for components using useSearchParams(). */}
          <React.Suspense
            fallback={
              <div className="hidden h-9 w-[72px] rounded-2xl border border-sand bg-white/60 md:block" />
            }
          >
            <LangDropdown currentLang={safeLang} className="hidden md:block" />
          </React.Suspense>
          <Link
            href={`/${safeLang}/espace-client`}
            className="hidden md:inline-flex"
            aria-label="Espace client"
          >
            <Button
              variant="secondary"
              className="items-center gap-2 whitespace-nowrap border border-sand bg-[rgba(31,143,95,0.10)] px-6 py-3 text-base text-[var(--color-primary)] shadow-soft-sm hover:bg-[rgba(31,143,95,0.16)]"
            >
              <UserRound className="h-4 w-4" strokeWidth={2.2} />
              {t.nav.client}
            </Button>
          </Link>
          <Link
            href={`/${safeLang}/creer-entreprise`}
            className="hidden md:inline-flex"
            aria-label="Créer mon entreprise"
          >
            <Button className="max-w-[220px] whitespace-nowrap border border-sand bg-[rgba(31,143,95,0.10)] px-7 py-3 text-base text-[var(--color-primary)] shadow-soft-sm hover:bg-[rgba(31,143,95,0.16)] focus-visible:ring-offset-[var(--color-beige)]">
              {t.nav.create}
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border border-sand bg-white/60 p-2 text-primary shadow-soft-sm transition hover:bg-[var(--color-sand)]/50 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={2.2} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden">
          <div className="border-t border-sand bg-[var(--color-beige)]/92 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <div className="flex flex-col gap-2 text-sm font-semibold">
                <Link href={`/${safeLang}`} className="rounded-2xl px-3 py-2 text-primary hover:bg-white/60">
                  {t.nav.home}
                </Link>
                <Link
                  href={`/${safeLang}/#offres`}
                  className="rounded-2xl px-3 py-2 text-primary hover:bg-white/60"
                >
                  {t.nav.offers}
                </Link>
                <Link
                  href={`/${safeLang}/#comment-ca-marche`}
                  className="rounded-2xl px-3 py-2 text-primary hover:bg-white/60"
                >
                  {t.nav.process}
                </Link>
                <Link
                  href={`/${safeLang}/#partenaires`}
                  className="rounded-2xl px-3 py-2 text-primary hover:bg-white/60"
                >
                  {t.nav.partners}
                </Link>
                <Link
                  href={`/${safeLang}/#contact`}
                  className="rounded-2xl px-3 py-2 text-primary hover:bg-white/60"
                >
                  {t.nav.contact}
                </Link>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <React.Suspense
                  fallback={
                    <div className="h-9 w-[72px] rounded-2xl border border-sand bg-white/60" />
                  }
                >
                  <LangDropdown currentLang={safeLang} align="left" />
                </React.Suspense>
              </div>

              <div className="mt-4 grid justify-items-stretch gap-3">
                <Link href={`/${safeLang}/espace-client`} aria-label="Espace client">
                  <Button
                    variant="outline"
                    className="w-full items-center justify-center gap-2 whitespace-nowrap border border-sand bg-[rgba(31,143,95,0.10)] px-7 py-3 text-base text-[var(--color-primary)] shadow-soft-sm hover:bg-[rgba(31,143,95,0.16)]"
                  >
                    <UserRound className="h-4 w-4" strokeWidth={2.2} />
                    {t.nav.client}
                  </Button>
                </Link>
                <Link href={`/${safeLang}/creer-entreprise`} aria-label="Créer mon entreprise">
                  <Button className="w-full whitespace-nowrap border border-sand bg-[rgba(31,143,95,0.10)] px-7 py-3 text-base text-[var(--color-primary)] shadow-soft-sm hover:bg-[rgba(31,143,95,0.16)]">
                    {t.nav.create}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
