"use client";

import React from "react";
import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import type { Partner } from "@/lib/partners";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

type TabId = "overview" | "services" | "contact" | "social" | "booking";

const labels = {
  fr: {
    badge: "Partenaire",
    back: "Retour",
    missing:
      "Cette fiche est en cours de complétion. Donnez-moi l’adresse/téléphone/email si vous voulez que je l’ajoute.",
    tabs: {
      overview: "Aperçu",
      services: "Services",
      contact: "Contact",
      social: "Réseaux",
      booking: "Formulaire-RDV",
    },
    ctas: {
      website: "Site web",
      whatsapp: "WhatsApp",
      call: "Appeler",
      email: "Email",
      booking: "Réserver un appel",
    },
    fields: {
      info: "Informations",
      contact: "Contact",
      location: "Adresse",
      phone: "Téléphone",
      email: "Email",
      networks: "Réseaux",
      form: "Formulaire",
    },
  },
  nl: {
    badge: "Partner",
    back: "Terug",
    missing:
      "Dit profiel wordt nog aangevuld. Deel adres/telefoon/e-mail als je wilt dat ik het toevoeg.",
    tabs: {
      overview: "Overzicht",
      services: "Diensten",
      contact: "Contact",
      social: "Netwerken",
      booking: "Formulier-Afspraak",
    },
    ctas: {
      website: "Website",
      whatsapp: "WhatsApp",
      call: "Bellen",
      email: "Email",
      booking: "Afspraak plannen",
    },
    fields: {
      info: "Info",
      contact: "Contact",
      location: "Adres",
      phone: "Telefoon",
      email: "Email",
      networks: "Netwerken",
      form: "Formulier",
    },
  },
  en: {
    badge: "Partner",
    back: "Back",
    missing:
      "This profile is being completed. Share address/phone/email if you want me to add it.",
    tabs: {
      overview: "Overview",
      services: "Services",
      contact: "Contact",
      social: "Social",
      booking: "Booking form",
    },
    ctas: {
      website: "Website",
      whatsapp: "WhatsApp",
      call: "Call",
      email: "Email",
      booking: "Book a call",
    },
    fields: {
      info: "Details",
      contact: "Contact",
      location: "Address",
      phone: "Phone",
      email: "Email",
      networks: "Social",
      form: "Form",
    },
  },
} as const;

function normalizeWhatsApp(v: string) {
  const s = v.trim();
  if (!s) return null;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const digits = s.replace(/[^\d]/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export function PartnerProfileClient({
  lang,
  partner,
}: {
  lang: "fr" | "nl" | "en";
  partner: Partner;
}) {
  const t = labels[lang] ?? labels.fr;
  const [tab, setTab] = React.useState<TabId>("overview");

  const logoText = partner.logoText || (partner.name.trim()[0] || "•").toUpperCase();
  const wa = partner.whatsapp ? normalizeWhatsApp(partner.whatsapp) : null;
  const websiteHost = partner.website
    ? (() => {
        try {
          return new URL(partner.website).hostname.replace(/^www\./, "");
        } catch {
          return partner.website;
        }
      })()
    : null;

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "overview", label: t.tabs.overview },
    { id: "services", label: t.tabs.services },
    { id: "contact", label: t.tabs.contact },
    { id: "social", label: t.tabs.social },
    { id: "booking", label: t.tabs.booking },
  ];

  const tabBtn = (active: boolean) =>
    [
      "rounded-xl px-3 py-2 text-[15px] font-medium tracking-[0.02em] transition",
      active
        ? "bg-white/60 text-[var(--color-primary)] shadow-soft-sm"
        : "text-[rgba(43,43,43,0.78)] hover:bg-white/40 hover:text-[var(--color-text)]",
    ].join(" ");

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
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-[rgba(43,43,43,0.75)]">
                  {partner.city ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-white/60 px-3 py-1">
                      <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" strokeWidth={2.2} />
                      {partner.city}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-white/60 px-3 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-accent)]" strokeWidth={2.2} />
                    {partner.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:items-end">
              {partner.website ? (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sand bg-white/60 px-5 py-3 text-sm font-semibold text-[var(--color-primary)] shadow-soft-sm transition hover:bg-[var(--color-sand)]/50"
                >
                  <Globe className="h-4 w-4" strokeWidth={2.2} />
                  {t.ctas.website}
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                </a>
              ) : null}
              {wa ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-soft-sm transition hover:opacity-95"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={2.2} />
                  {t.ctas.whatsapp}
                </a>
              ) : null}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-sand bg-white/40 p-2 backdrop-blur">
            <div className="flex flex-wrap gap-2">
              {tabs.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  className={tabBtn(tab === x.id)}
                  onClick={() => setTab(x.id)}
                  aria-label={x.label}
                >
                  {x.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {tab === "overview" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-sand bg-white/60 p-6">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{t.fields.info}</p>
                  <div className="mt-4 grid gap-3 text-sm text-[rgba(43,43,43,0.75)]">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2.2} />
                      <span className="truncate">{websiteHost || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2.2} />
                      <span className="truncate">
                        {[partner.address, partner.city].filter(Boolean).join(" · ") || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-sand bg-white/60 p-6">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{t.fields.contact}</p>
                  <div className="mt-4 grid gap-3 text-sm text-[rgba(43,43,43,0.75)]">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2.2} />
                      <span className="truncate">{partner.phone || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2.2} />
                      <span className="truncate">{partner.email || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "services" ? (
              <div className="rounded-3xl border border-sand bg-white/60 p-6">
                <p className="text-sm font-semibold text-[var(--color-text)]">{t.tabs.services}</p>
                <div className="mt-4 grid gap-2 text-sm text-[rgba(43,43,43,0.75)]">
                  {(partner.services ?? []).length === 0 ? (
                    <p className="text-sm text-[rgba(43,43,43,0.70)]">—</p>
                  ) : (
                    (partner.services ?? []).map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2.2} />
                        <span>{s}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : null}

            {tab === "contact" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-sand bg-white/60 p-6">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{t.fields.location}</p>
                  <p className="mt-3 text-sm text-[rgba(43,43,43,0.75)]">
                    {[partner.address, partner.city].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
                <div className="rounded-3xl border border-sand bg-white/60 p-6">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{t.fields.phone}</p>
                  <div className="mt-4 grid gap-3">
                    {partner.phone ? (
                      <a
                        href={`tel:${partner.phone}`}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sand bg-white/70 px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-white/90"
                      >
                        <Phone className="h-4 w-4" strokeWidth={2.2} />
                        {t.ctas.call}
                      </a>
                    ) : null}
                    {partner.email ? (
                      <a
                        href={`mailto:${partner.email}`}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sand bg-white/70 px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-white/90"
                      >
                        <Mail className="h-4 w-4" strokeWidth={2.2} />
                        {t.ctas.email}
                      </a>
                    ) : null}
                    {wa ? (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-soft-sm transition hover:opacity-95"
                      >
                        <MessageCircle className="h-4 w-4" strokeWidth={2.2} />
                        {t.ctas.whatsapp}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {tab === "social" ? (
              <div className="rounded-3xl border border-sand bg-white/60 p-6">
                <p className="text-sm font-semibold text-[var(--color-text)]">{t.fields.networks}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {partner.linkedin ? (
                    <a
                      href={partner.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl border border-sand bg-white/70 px-4 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-white/90"
                    >
                      <Linkedin className="h-4 w-4" strokeWidth={2.2} />
                      LinkedIn
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                    </a>
                  ) : null}
                  {partner.instagram ? (
                    <a
                      href={partner.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl border border-sand bg-white/70 px-4 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-white/90"
                    >
                      <Instagram className="h-4 w-4" strokeWidth={2.2} />
                      Instagram
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                    </a>
                  ) : null}
                  {!partner.linkedin && !partner.instagram ? (
                    <p className="text-sm text-[rgba(43,43,43,0.70)]">—</p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {tab === "booking" ? (
              <div className="rounded-3xl border border-sand bg-white/60 p-6">
                <p className="text-sm font-semibold text-[var(--color-text)]">{t.fields.form}</p>
                <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
                  {partner.formLink ? "Utilisez le formulaire du partenaire." : "Formulaire à ajouter."}
                </p>
                <div className="mt-4">
                  {partner.formLink ? (
                    <a
                      href={partner.formLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white shadow-soft-sm transition hover:bg-[var(--color-primary)]"
                    >
                      <Calendar className="h-4 w-4" strokeWidth={2.2} />
                      {t.ctas.booking}
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sand bg-white/70 px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-white/90"
                      onClick={() => alert("UI-only: formulaire RDV à brancher plus tard.")}
                    >
                      <Calendar className="h-4 w-4" strokeWidth={2.2} />
                      {t.ctas.booking}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </main>
  );
}
