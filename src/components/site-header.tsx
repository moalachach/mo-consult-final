"use client";

import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { getT, normalizeLang } from "@/lib/i18n";
import { DynamicLogo } from "@/components/dynamic-logo";
import { LangDropdown } from "@/components/lang-dropdown";
import { Menu, UserRound, X } from "lucide-react";

export function SiteHeader({ lang }: { lang: string }) {
  const safeLang = normalizeLang(lang);
  const t = getT(safeLang);
  const router = useRouter();
  const pathname = usePathname() || `/${safeLang}`;
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    // Close mobile drawer on route changes.
    setOpen(false);
  }, [pathname]);

  const isHome = pathname === `/${safeLang}`;

  const navLink =
    "px-3 py-2 rounded-xl text-[15px] font-medium tracking-[0.02em] text-[var(--color-text)]/80 hover:text-[var(--color-text)] hover:bg-white/40 transition";

  const goToSection = (id: string) => {
    const targetPath = `/${safeLang}/#${id}`;
    // Smooth-scroll if already on home; otherwise navigate then scroll.
    if (typeof window !== "undefined" && pathname === `/${safeLang}`) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    router.push(targetPath);
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-sand bg-[var(--color-beige)]/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Left: logo (dynamic) */}
        <div className="flex items-center pl-1">
          <Link
            href={`/${safeLang}`}
            className="inline-flex items-center"
            aria-label="Mo Consult - Accueil"
          >
            <DynamicLogo slot="header" />
          </Link>
        </div>

        {/* Center: nav */}
        <nav className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-2 rounded-2xl bg-white/25 px-2 py-1 backdrop-blur">
            <Link
              href={`/${safeLang}`}
              className={[
                "relative",
                navLink,
                isHome && "text-[var(--color-text)] bg-white/40",
              ].join(" ")}
            >
              {t.nav.home}
              {isHome && (
                <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--color-accent)]" />
              )}
            </Link>
            <button
              type="button"
              className={navLink}
              onClick={() => goToSection("offres")}
              aria-label={t.nav.offers}
            >
              {t.nav.offers}
            </button>
            <button
              type="button"
              className={navLink}
              onClick={() => goToSection("comment-ca-marche")}
              aria-label={t.nav.process}
            >
              {t.nav.process}
            </button>
            <button
              type="button"
              className={navLink}
              onClick={() => goToSection("partenaires")}
              aria-label={t.nav.partners}
            >
              {t.nav.partners}
            </button>
            <button
              type="button"
              className={navLink}
              onClick={() => goToSection("contact")}
              aria-label={t.nav.contact}
            >
              {t.nav.contact}
            </button>
          </div>
        </nav>

        {/* Right: language + CTA */}
        <div className="flex items-center justify-end gap-3">
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
            <div className="mx-auto max-w-6xl px-4 py-4">
              <div className="flex flex-col gap-2 text-sm font-semibold">
                <Link href={`/${safeLang}`} className="rounded-2xl px-3 py-2 text-primary hover:bg-white/60">
                  {t.nav.home}
                </Link>
                <button
                  type="button"
                  className="rounded-2xl px-3 py-2 text-left text-primary hover:bg-white/60"
                  onClick={() => goToSection("offres")}
                >
                  {t.nav.offers}
                </button>
                <button
                  type="button"
                  className="rounded-2xl px-3 py-2 text-left text-primary hover:bg-white/60"
                  onClick={() => goToSection("comment-ca-marche")}
                >
                  {t.nav.process}
                </button>
                <button
                  type="button"
                  className="rounded-2xl px-3 py-2 text-left text-primary hover:bg-white/60"
                  onClick={() => goToSection("partenaires")}
                >
                  {t.nav.partners}
                </button>
                <button
                  type="button"
                  className="rounded-2xl px-3 py-2 text-left text-primary hover:bg-white/60"
                  onClick={() => goToSection("contact")}
                >
                  {t.nav.contact}
                </button>
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
