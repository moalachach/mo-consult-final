import Link from "next/link";
import { normalizeLang } from "@/lib/i18n";
import { getPartnerBySlug } from "@/lib/partners";
import { Badge, Card } from "@/components/ui";
import { ArrowUpRight, Building2, Mail, MapPin, Phone } from "lucide-react";

const content = {
  fr: {
    badge: "Partenaire",
    back: "Retour",
    contact: "Contact",
    details: "Informations",
    website: "Site web",
    missing:
      "Cette fiche est en cours de complétion. (UI-only) Donnez-moi l’adresse/téléphone/email si vous voulez que je l’ajoute.",
  },
  nl: {
    badge: "Partner",
    back: "Terug",
    contact: "Contact",
    details: "Info",
    website: "Website",
    missing:
      "Deze fiche wordt nog aangevuld. (UI-only) Geef adres/telefoon/e-mail om toe te voegen.",
  },
  en: {
    badge: "Partner",
    back: "Back",
    contact: "Contact",
    details: "Details",
    website: "Website",
    missing:
      "This profile is being completed. (UI-only) Share address/phone/email if you want me to add it.",
  },
} as const;

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = normalizeLang(rawLang);
  const t = content[lang] ?? content.fr;

  const partner = getPartnerBySlug(slug);
  if (!partner) {
    return (
      <div className="min-h-screen bg-[var(--color-beige)]">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Link
            href={`/${lang}/#partenaires`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
          >
            {t.back}
          </Link>
          <div className="mt-6 rounded-3xl border border-sand bg-white/70 p-8 shadow-soft-sm backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">Partenaire introuvable</p>
          </div>
        </div>
      </div>
    );
  }

  const logoText = partner.logoText || (partner.name.trim()[0] || "•").toUpperCase();

  return (
    <main className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href={`/${lang}/#partenaires`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"
          >
            {t.back}
          </Link>
          <Badge tone="accent">{t.badge}</Badge>
        </div>

        <Card className="p-8 shadow-soft-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div
                aria-hidden
                className="inline-flex h-14 w-14 items-center justify-center rounded-3xl border border-sand bg-white/70 text-base font-extrabold text-primary"
              >
                {logoText}
              </div>
              <div className="min-w-0">
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
                  {partner.name}
                </h1>
                <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
                  {partner.description || t.missing}
                </p>
              </div>
            </div>

            {partner.website ? (
              <a
                href={partner.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sand bg-white/60 px-5 py-3 text-sm font-semibold text-[var(--color-primary)] shadow-soft-sm transition hover:bg-[var(--color-sand)]/50"
              >
                {t.website}
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
              </a>
            ) : null}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-sand bg-white/60 p-6">
              <p className="text-sm font-semibold text-[var(--color-text)]">{t.details}</p>
              <div className="mt-4 grid gap-3 text-sm text-[rgba(43,43,43,0.75)]">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2.2} />
                  <span className="truncate">{partner.category}</span>
                </div>
                {partner.city || partner.address ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2.2} />
                    <span className="truncate">
                      {[partner.address, partner.city].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl border border-sand bg-white/60 p-6">
              <p className="text-sm font-semibold text-[var(--color-text)]">{t.contact}</p>
              <div className="mt-4 grid gap-3 text-sm text-[rgba(43,43,43,0.75)]">
                {partner.email ? (
                  <a className="inline-flex items-center gap-2 hover:underline" href={`mailto:${partner.email}`}>
                    <Mail className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2.2} />
                    <span className="truncate">{partner.email}</span>
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 opacity-70">
                    <Mail className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2.2} />
                    <span>—</span>
                  </div>
                )}

                {partner.phone ? (
                  <a className="inline-flex items-center gap-2 hover:underline" href={`tel:${partner.phone}`}>
                    <Phone className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2.2} />
                    <span className="truncate">{partner.phone}</span>
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 opacity-70">
                    <Phone className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2.2} />
                    <span>—</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

