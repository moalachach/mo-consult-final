import Link from "next/link";
import { DynamicLogo } from "@/components/dynamic-logo";
import { normalizeLang } from "@/lib/i18n";
import { Badge, Card } from "@/components/ui";
import { ButtonLink } from "@/components/button-link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

const content = {
  fr: {
    ctaTitle: "Prêt à démarrer ?",
    ctaLead: "Créez votre dossier en ligne et suivez chaque étape depuis votre espace client.",
    ctaPrimary: "Créer mon entreprise",
    ctaSecondary: "Demander un devis",
    brandLead: "Simplifier votre gestion. Développez votre entreprise.",
    colNav: "Navigation",
    colServices: "Services",
    colLegal: "Légal",
    nav: [
      { label: "Accueil", href: "" },
      { label: "Offres", href: "/#offres" },
      { label: "Process", href: "/#comment-ca-marche" },
      { label: "Partenaires", href: "/#partenaires" },
      { label: "Contact", href: "/#contact" },
      { label: "FAQ", href: "/faq" },
    ],
    services: [
      { label: "Créer une SRL", href: "/creer-entreprise?type=srl" },
      { label: "Indépendant (PP)", href: "/creer-entreprise?type=pp" },
      { label: "Charte graphique", href: "/#services" },
      { label: "Site web (WordPress / code)", href: "/#services" },
      { label: "Espace client", href: "/espace-client" },
    ],
    legal: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Politique de confidentialité", href: "/politique-confidentialite" },
    ],
    meta: "© 2026 Mo Consult. Tous droits réservés.",
    belgium: "Belgique",
  },
  nl: {
    ctaTitle: "Klaar om te starten?",
    ctaLead: "Maak uw dossier online aan en volg elke stap via uw klantomgeving.",
    ctaPrimary: "Start mijn bedrijf",
    ctaSecondary: "Offerte aanvragen",
    brandLead: "Vereenvoudig uw beheer. Groei uw bedrijf.",
    colNav: "Navigatie",
    colServices: "Diensten",
    colLegal: "Juridisch",
    nav: [
      { label: "Home", href: "" },
      { label: "Aanbod", href: "/#offres" },
      { label: "Proces", href: "/#comment-ca-marche" },
      { label: "Partners", href: "/#partenaires" },
      { label: "Contact", href: "/#contact" },
      { label: "FAQ", href: "/faq" },
    ],
    services: [
      { label: "SRL oprichten", href: "/creer-entreprise?type=srl" },
      { label: "Zelfstandige (PP)", href: "/creer-entreprise?type=pp" },
      { label: "Huisstijl", href: "/#services" },
      { label: "Website (WordPress / code)", href: "/#services" },
      { label: "Klantomgeving", href: "/espace-client" },
    ],
    legal: [
      { label: "Juridische vermeldingen", href: "/mentions-legales" },
      { label: "Privacybeleid", href: "/politique-confidentialite" },
    ],
    meta: "© 2026 Mo Consult. Alle rechten voorbehouden.",
    belgium: "België",
  },
  en: {
    ctaTitle: "Ready to start?",
    ctaLead: "Create your file online and track every step in your client space.",
    ctaPrimary: "Start my company",
    ctaSecondary: "Request a quote",
    brandLead: "Simplify your admin. Grow your business.",
    colNav: "Navigation",
    colServices: "Services",
    colLegal: "Legal",
    nav: [
      { label: "Home", href: "" },
      { label: "Offers", href: "/#offres" },
      { label: "Process", href: "/#comment-ca-marche" },
      { label: "Partners", href: "/#partenaires" },
      { label: "Contact", href: "/#contact" },
      { label: "FAQ", href: "/faq" },
    ],
    services: [
      { label: "Create an SRL", href: "/creer-entreprise?type=srl" },
      { label: "Sole proprietor", href: "/creer-entreprise?type=pp" },
      { label: "Brand guidelines", href: "/#services" },
      { label: "Website (WordPress / code)", href: "/#services" },
      { label: "Client space", href: "/espace-client" },
    ],
    legal: [
      { label: "Legal notice", href: "/mentions-legales" },
      { label: "Privacy policy", href: "/politique-confidentialite" },
    ],
    meta: "© 2026 Mo Consult. All rights reserved.",
    belgium: "Belgium",
  },
} as const;

export function SiteFooter({ lang }: { lang: string }) {
  const safeLang = normalizeLang(lang);
  const t = content[safeLang] ?? content.fr;

  const linkCls =
    "text-sm text-[rgba(255,255,255,0.82)] transition hover:text-white";

  return (
    <footer className="border-t border-sand bg-[var(--color-primary)] text-white">
      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 -top-24 h-[360px] w-[360px] rounded-full bg-[rgba(31,143,95,0.18)] blur-3xl" />
          <div className="absolute -right-28 top-10 h-[420px] w-[420px] rounded-full bg-[rgba(255,255,255,0.08)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-14">
          {/* CTA strip */}
          <Card className="overflow-hidden border-[rgba(255,255,255,0.18)] bg-white/10 p-8 text-white shadow-soft-sm backdrop-blur sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{t.ctaTitle}</h2>
                <p className="mt-2 text-sm text-[rgba(255,255,255,0.82)]">
                  {t.ctaLead}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <ButtonLink
                  href={`/${safeLang}/creer-entreprise`}
                  className="w-full whitespace-nowrap px-7 py-4 text-base shadow-soft sm:w-auto"
                >
                  {t.ctaPrimary}
                </ButtonLink>
                <ButtonLink
                  href={`mailto:info@moconsult.be?subject=${encodeURIComponent("Demande de devis")}`}
                  variant="outline"
                  className="w-full whitespace-nowrap px-7 py-4 text-base text-white sm:w-auto"
                >
                  {t.ctaSecondary}
                </ButtonLink>
              </div>
            </div>
          </Card>

          {/* Columns */}
          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <DynamicLogo slot="footer" />
                <div>
                  <p className="text-base font-semibold">Mo Consult</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge className="bg-white/10 text-white">{t.belgium}</Badge>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-[rgba(255,255,255,0.82)]">{t.brandLead}</p>

              <div className="mt-6 grid gap-3">
                <a className={linkCls} href="mailto:info@moconsult.be">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[rgba(255,255,255,0.85)]" strokeWidth={2.2} />
                    info@moconsult.be
                  </span>
                </a>
                <a className={linkCls} href="tel:+32499916046">
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[rgba(255,255,255,0.85)]" strokeWidth={2.2} />
                    +32 499 916 046
                  </span>
                </a>
                <span className="text-sm text-[rgba(255,255,255,0.82)]">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[rgba(255,255,255,0.85)]" strokeWidth={2.2} />
                    Bruxelles
                  </span>
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-white/95">{t.colNav}</p>
              <div className="mt-4 grid gap-2">
                {t.nav.map((l) => (
                  <Link key={l.label} href={`/${safeLang}${l.href}`} className={linkCls}>
                    <span className="inline-flex items-center gap-2">
                      {l.label}
                      <ArrowUpRight className="h-4 w-4 text-white/50" strokeWidth={2.2} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-white/95">{t.colServices}</p>
              <div className="mt-4 grid gap-2">
                {t.services.map((l) => (
                  <Link key={l.label} href={`/${safeLang}${l.href}`} className={linkCls}>
                    <span className="inline-flex items-center gap-2">
                      {l.label}
                      <ArrowUpRight className="h-4 w-4 text-white/50" strokeWidth={2.2} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-white/95">{t.colLegal}</p>
              <div className="mt-4 grid gap-2">
                {t.legal.map((l) => (
                  <Link key={l.label} href={`/${safeLang}${l.href}`} className={linkCls}>
                    <span className="inline-flex items-center gap-2">
                      {l.label}
                      <ArrowUpRight className="h-4 w-4 text-white/50" strokeWidth={2.2} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-[rgba(255,255,255,0.14)] pt-6 text-xs text-[rgba(255,255,255,0.70)] sm:flex-row sm:items-center sm:justify-between">
            <span>
              {t.meta} · TVA BE0724724810
            </span>
            <Link href={`/${safeLang}`} className="inline-flex items-center gap-2 text-xs text-white/80 hover:text-white">
              Retour en haut
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
