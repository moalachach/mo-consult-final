import Link from "next/link";
import { normalizeLang } from "@/lib/i18n";
import { Badge, Card } from "@/components/ui";
import { FadeIn } from "@/components/fade-in";
import { ButtonLink } from "@/components/button-link";
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  Code2,
  FileText,
  Landmark,
  MonitorSmartphone,
  Palette,
  PiggyBank,
  ShieldCheck,
  Signature,
  Sparkles,
  Users,
} from "lucide-react";

const content = {
  fr: {
    badge: "Votre partenaire pour entreprendre en Belgique",
    h1: "Créez votre entreprise en ligne. On s’occupe du reste.",
    subline: "Vous remplissez. Nous préparons. Vous démarrez.",
    primaryCta: "Créer mon entreprise",
    secondaryCta: "Voir comment ça marche",
    trust: ["Plan financier inclus", "Dossier notaire inclus", "Paiement sécurisé"],
    offersTitle: "Choisissez votre situation",
    srl: {
      title: "Créer une SRL",
      price: "1.250 € – Honoraires Mo Consult",
      bullets: [
        "Plan financier – Nous construisons votre plan pour le notaire",
        "Notaire – Nous préparons le dossier et le transmettons",
        "Banque – Aide pour dépôt de capital et attestation",
        "Affiliation de la société – Nous enregistrons votre société",
      ],
      bottom: "Mo Consult s’occupe des démarches, vous restez concentré sur votre projet.",
      cta: "Créer ma SRL",
    },
    pp: {
      title: "Indépendant en nom propre",
      price: "200 € – Honoraires Mo Consult",
      bullets: [
        "Inscription comme indépendant",
        "Numéro TVA si besoin",
        "Caisse sociale",
        "Conseils de démarrage",
      ],
      bottom: "Mo Consult vous accompagne tout au long du processus.",
      cta: "Devenir indépendant",
    },
    processTitle: "Le processus, simplement",
    servicesTitle: "Nos services",
    services: [
      {
        title: "Création d’entreprise",
        lead: "SRL ou indépendant: un parcours guidé et un suivi clair.",
        icon: Building2,
      },
      {
        title: "Charte graphique & logo",
        lead: "Une identité cohérente, moderne et professionnelle pour votre société.",
        icon: Palette,
      },
      {
        title: "Site web professionnel",
        lead: "WordPress ou sur mesure (code) selon vos besoins.",
        icon: MonitorSmartphone,
      },
    ],
    process: [
      { title: "Vous remplissez", icon: FileText },
      { title: "Nous préparons", icon: Sparkles },
      { title: "Banque & notaire", icon: Landmark },
      { title: "Vous signez", icon: Signature },
      { title: "Numéro d’entreprise", icon: Building2 },
      { title: "Vous démarrez", icon: Users },
    ],
    partnersTitle: "Nos partenaires",
    partners: [
      {
        title: "Notaires",
        icon: Landmark,
        items: [
          {
            name: "Indekeu, Cleenewerck & Decrayencour",
            slug: "indekeu-cleenewerck-decrayencour",
          },
        ],
      },
      {
        title: "Comptables",
        icon: BadgeCheck,
        items: [
          { name: "SM COMPTA", slug: "sm-compta" },
          { name: "ATISCOM", slug: "atiscom" },
          { name: "KIUACCOUNT", slug: "kiuaccount" },
        ],
      },
      {
        title: "Domiciliation",
        icon: Building2,
        items: [
          {
            name: "ED PARTNERS",
            slug: "ed-partners",
          },
        ],
      },
      {
        title: "Caisses sociales",
        icon: ShieldCheck,
        items: [
          { name: "Liantis", slug: "liantis" },
          { name: "Partena Professionel", slug: "partena-professionel" },
        ],
      },
      {
        title: "Design",
        icon: Sparkles,
        items: [{ name: "JUDesign", slug: "judesign" }],
      },
    ],
    contactTitle: "Contact",
    contactLead:
      "Une question avant de démarrer ? Écrivez-nous, on vous répond rapidement.",
    contactCtaPrimary: "Créer mon entreprise",
    contactCtaSecondary: "Demander un devis",
    contactMeta: "Email: info@moconsult.be · Téléphone: +32 499 916 046 · Bruxelles",
  },
  nl: {
    badge: "Uw partner om te ondernemen in België",
    h1: "Richt uw bedrijf online op. Wij regelen de rest.",
    subline: "U vult in. Wij bereiden voor. U start.",
    primaryCta: "Start mijn bedrijf",
    secondaryCta: "Bekijk hoe het werkt",
    trust: ["Financieel plan inbegrepen", "Notarisdossier inbegrepen", "Veilige betaling"],
    offersTitle: "Kies uw situatie",
    srl: {
      title: "Een SRL oprichten",
      price: "1.250 € – Honoraria Mo Consult",
      bullets: [
        "Financieel plan – We maken uw plan voor de notaris",
        "Notaris – We bereiden het dossier voor en sturen het door",
        "Bank – Hulp bij kapitaalstorting en attest",
        "Registratie – We registreren uw vennootschap",
      ],
      bottom: "Mo Consult regelt de stappen, u blijft gefocust op uw project.",
      cta: "Start mijn SRL",
    },
    pp: {
      title: "Zelfstandige in eigen naam",
      price: "200 € – Honoraria Mo Consult",
      bullets: ["Inschrijving", "BTW-nummer indien nodig", "Sociaal fonds", "Startadvies"],
      bottom: "Mo Consult begeleidt u tijdens het hele proces.",
      cta: "Word zelfstandige",
    },
    processTitle: "Het proces, eenvoudig",
    servicesTitle: "Onze diensten",
    services: [
      {
        title: "Bedrijf oprichten",
        lead: "SRL of zelfstandige: een begeleid traject met duidelijke opvolging.",
        icon: Building2,
      },
      {
        title: "Huisstijl & logo",
        lead: "Een consistente, moderne en professionele identiteit voor uw onderneming.",
        icon: Palette,
      },
      {
        title: "Professionele website",
        lead: "WordPress of maatwerk (code), afhankelijk van uw behoeften.",
        icon: MonitorSmartphone,
      },
    ],
    process: [
      { title: "U vult in", icon: FileText },
      { title: "Wij bereiden voor", icon: Sparkles },
      { title: "Bank & notaris", icon: Landmark },
      { title: "U ondertekent", icon: Signature },
      { title: "Ondernemingsnummer", icon: Building2 },
      { title: "U start", icon: Users },
    ],
    partnersTitle: "Partners",
    partners: [
      {
        title: "Notarissen",
        icon: Landmark,
        items: [
          {
            name: "Indekeu, Cleenewerck & Decrayencour",
            slug: "indekeu-cleenewerck-decrayencour",
          },
        ],
      },
      {
        title: "Accountants",
        icon: BadgeCheck,
        items: [
          { name: "SM COMPTA", slug: "sm-compta" },
          { name: "ATISCOM", slug: "atiscom" },
          { name: "KIUACCOUNT", slug: "kiuaccount" },
        ],
      },
      {
        title: "Domicilie",
        icon: Building2,
        items: [
          {
            name: "ED PARTNERS",
            slug: "ed-partners",
          },
        ],
      },
      {
        title: "Sociale fondsen",
        icon: ShieldCheck,
        items: [
          { name: "Liantis", slug: "liantis" },
          { name: "Partena Professionel", slug: "partena-professionel" },
        ],
      },
      {
        title: "Design",
        icon: Sparkles,
        items: [{ name: "JUDesign", slug: "judesign" }],
      },
    ],
    contactTitle: "Contact",
    contactLead: "Een vraag voor u start? Stuur ons een bericht, we antwoorden snel.",
    contactCtaPrimary: "Start mijn bedrijf",
    contactCtaSecondary: "Offerte aanvragen",
    contactMeta: "E-mail: info@moconsult.be · Telefoon: +32 499 916 046 · Brussel",
  },
  en: {
    badge: "Your partner to build in Belgium",
    h1: "Create your company online. We handle the rest.",
    subline: "You fill in. We prepare. You start.",
    primaryCta: "Start my company",
    secondaryCta: "See how it works",
    trust: ["Financial plan included", "Notary package included", "Secure payment"],
    offersTitle: "Choose your situation",
    srl: {
      title: "Create an SRL",
      price: "€1,250 – Mo Consult fees",
      bullets: [
        "Financial plan – We build your plan for the notary",
        "Notary – We prepare the file and send it",
        "Bank – Help with capital deposit and certificate",
        "Registration – We register your company",
      ],
      bottom: "Mo Consult handles the steps so you stay focused on your project.",
      cta: "Create my SRL",
    },
    pp: {
      title: "Sole proprietor",
      price: "€200 – Mo Consult fees",
      bullets: [
        "Self-employed registration",
        "VAT number if needed",
        "Social fund",
        "Startup guidance",
      ],
      bottom: "Mo Consult supports you throughout the process.",
      cta: "Become self‑employed",
    },
    processTitle: "The process, simple",
    servicesTitle: "Our services",
    services: [
      {
        title: "Company creation",
        lead: "SRL or sole proprietor: a guided path with clear tracking.",
        icon: Building2,
      },
      {
        title: "Brand guidelines & logo",
        lead: "A consistent, modern and professional identity for your company.",
        icon: Palette,
      },
      {
        title: "Professional website",
        lead: "WordPress or custom code, depending on your needs.",
        icon: MonitorSmartphone,
      },
    ],
    process: [
      { title: "You fill in", icon: FileText },
      { title: "We prepare", icon: Sparkles },
      { title: "Bank & notary", icon: Landmark },
      { title: "You sign", icon: Signature },
      { title: "Company number", icon: Building2 },
      { title: "You start", icon: Users },
    ],
    partnersTitle: "Partners",
    partners: [
      {
        title: "Notaries",
        icon: Landmark,
        items: [
          {
            name: "Indekeu, Cleenewerck & Decrayencour",
            slug: "indekeu-cleenewerck-decrayencour",
          },
        ],
      },
      {
        title: "Accountants",
        icon: BadgeCheck,
        items: [
          { name: "SM COMPTA", slug: "sm-compta" },
          { name: "ATISCOM", slug: "atiscom" },
          { name: "KIUACCOUNT", slug: "kiuaccount" },
        ],
      },
      {
        title: "Domiciliation",
        icon: Building2,
        items: [
          {
            name: "ED PARTNERS",
            slug: "ed-partners",
          },
        ],
      },
      {
        title: "Social funds",
        icon: ShieldCheck,
        items: [
          { name: "Liantis", slug: "liantis" },
          { name: "Partena Professionel", slug: "partena-professionel" },
        ],
      },
      {
        title: "Design",
        icon: Sparkles,
        items: [{ name: "JUDesign", slug: "judesign" }],
      },
    ],
    contactTitle: "Contact",
    contactLead: "Have a question before you start? Message us and we’ll reply quickly.",
    contactCtaPrimary: "Start my company",
    contactCtaSecondary: "Request a quote",
    contactMeta: "Email: info@moconsult.be · Phone: +32 499 916 046 · Brussels",
  },
} as const;

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = normalizeLang(rawLang);
  const t = content[lang] ?? content.fr;

  return (
    <main className="home-bg">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 -top-24 h-[380px] w-[380px] rounded-full bg-[rgba(31,143,95,0.16)] blur-3xl" />
          <div className="absolute -right-28 top-12 h-[440px] w-[440px] rounded-full bg-[rgba(63,91,69,0.12)] blur-3xl" />
        </div>

        <FadeIn className="relative mx-auto max-w-6xl px-4 py-24 md:py-28">
          <div className="flex flex-col items-start gap-6">
            <Badge tone="accent" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
              {t.badge}
            </Badge>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-balance text-primary sm:text-5xl md:text-6xl">
              {t.h1}
            </h1>
            <p className="text-sm font-semibold text-primary">{t.subline}</p>

            <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <ButtonLink
                href={`/${lang}/creer-entreprise`}
                className="w-full whitespace-nowrap px-7 py-4 text-base shadow-soft sm:w-auto"
              >
                {t.primaryCta}
              </ButtonLink>
              <ButtonLink
                href={`/${lang}/#comment-ca-marche`}
                variant="outline"
                className="w-full whitespace-nowrap px-7 py-4 text-base sm:w-auto"
              >
                {t.secondaryCta}
              </ButtonLink>
              <Badge className="w-fit bg-white/60 text-primary">À partir de 200€</Badge>
            </div>

            <ul className="mt-2 grid gap-2 text-sm text-[rgba(43,43,43,0.72)] sm:grid-cols-3">
              {t.trust.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={2.2} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </section>

      {/* OFFERS */}
      <FadeIn className="mx-auto max-w-6xl px-4 py-20 md:py-24" id="offres">
        <h2 className="text-3xl font-semibold text-primary">{t.offersTitle}</h2>

        <div className="mt-8 grid items-stretch gap-6 md:grid-cols-2">
          <Card className="flex h-full flex-col p-7 shadow-soft-sm ring-1 ring-[rgba(31,143,95,0.22)] sm:p-8">
            <div className="flex-1">
              <p className="text-sm text-[rgba(43,43,43,0.72)]">
                <span className="text-3xl font-bold text-primary sm:text-4xl">
                  {t.srl.price.split("–")[0].trim()}
                </span>{" "}
                <span className="text-sm">– {t.srl.price.split("–").slice(1).join("–").trim()}</span>
              </p>
              <Badge className="mt-3 bg-white/60 text-primary">Franchise TVA</Badge>
              <h3 className="mt-3 text-xl font-semibold text-primary">{t.srl.title}</h3>

              <ul className="mt-5 grid gap-3 text-sm text-[rgba(43,43,43,0.74)]">
                {t.srl.bullets.map((item, idx) => {
                  const icons = [FileText, Landmark, PiggyBank, BadgeCheck] as const;
                  const Icon = icons[idx] ?? CheckCircle2;
                  return (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[rgba(31,143,95,0.12)] text-[var(--color-accent)]">
                        <Icon className="h-4 w-4" strokeWidth={2.2} />
                      </span>
                      <span>{item}</span>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-5 text-xs italic text-[rgba(43,43,43,0.65)]">{t.srl.bottom}</p>
            </div>

            <div className="mt-7 inline-flex">
              <ButtonLink href={`/${lang}/creer-entreprise?type=srl`} className="w-full sm:w-auto">
                {t.srl.cta}
              </ButtonLink>
            </div>
          </Card>

          <Card className="flex h-full flex-col p-7 shadow-soft-sm sm:p-8">
            <div className="flex-1">
              <p className="text-sm text-[rgba(43,43,43,0.72)]">
                <span className="text-3xl font-bold text-primary sm:text-4xl">
                  {t.pp.price.split("–")[0].trim()}
                </span>{" "}
                <span className="text-sm">– {t.pp.price.split("–").slice(1).join("–").trim()}</span>
              </p>
              <Badge className="mt-3 bg-white/60 text-primary">Franchise TVA</Badge>
              <h3 className="mt-3 text-xl font-semibold text-primary">{t.pp.title}</h3>

              <ul className="mt-5 grid gap-3 text-sm text-[rgba(43,43,43,0.74)]">
                {t.pp.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[rgba(31,143,95,0.12)] text-[var(--color-accent)]">
                      <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-xs italic text-[rgba(43,43,43,0.65)]">{t.pp.bottom}</p>
            </div>

            <div className="mt-7 inline-flex">
              <ButtonLink
                href={`/${lang}/creer-entreprise?type=pp`}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {t.pp.cta}
              </ButtonLink>
            </div>
          </Card>
        </div>
      </FadeIn>

      {/* SERVICES */}
      <FadeIn className="mx-auto max-w-6xl px-4 py-20 md:py-24" id="services">
        <h2 className="text-3xl font-semibold text-primary">{t.servicesTitle}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {t.services.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.title} className="h-full p-7 shadow-soft-sm">
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(31,143,95,0.12)] text-[var(--color-accent)]">
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-primary">{s.title}</p>
                    <p className="mt-2 text-sm text-[rgba(43,43,43,0.70)]">{s.lead}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-[rgba(43,43,43,0.72)]">
                      <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-white/60 px-3 py-1">
                        <Code2 className="h-3.5 w-3.5 text-[var(--color-accent)]" strokeWidth={2.2} />
                        WordPress / code
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-white/60 px-3 py-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-accent)]" strokeWidth={2.2} />
                        Conseil & exécution
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </FadeIn>

      {/* PROCESS */}
      <FadeIn className="mx-auto max-w-6xl px-4 py-20 md:py-24" id="comment-ca-marche">
        <h2 className="text-3xl font-semibold text-primary">{t.processTitle}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.process.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="h-full p-6 shadow-soft-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(31,143,95,0.12)] text-[var(--color-accent)]">
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <p className="text-sm font-semibold text-[rgba(43,43,43,0.82)]">{step.title}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </FadeIn>

      {/* PARTNERS */}
      <FadeIn className="mx-auto max-w-6xl px-4 pb-24 md:pb-28" id="partenaires">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-primary">{t.partnersTitle}</h2>
          <Badge>Réseau</Badge>
        </div>

        <div className="mt-8 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.partners.map((p) => {
            const Icon = p.icon;
            return (
              <Card
                key={p.title}
                className="flex h-full flex-col overflow-hidden p-7 shadow-soft-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(31,143,95,0.12)] text-[var(--color-accent)]">
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-primary">{p.title}</p>
                    <p className="mt-2 text-sm text-[rgba(43,43,43,0.70)]">
                      Partenaires (liens + logos bientôt).
                    </p>

                    <div className="mt-5 grid flex-1 gap-3">
                      {p.items.map((it) => (
                        <Link
                          key={it.name}
                          href={`/${lang}/partenaires/${it.slug}`}
                          className="flex max-w-full items-start justify-between gap-3 rounded-2xl border border-sand bg-white/60 px-4 py-3 transition hover:bg-white/80"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-primary" title={it.name}>
                              {it.name}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[rgba(43,43,43,0.60)]">
                              Voir la fiche partenaire
                            </p>
                          </div>
                          <span
                            aria-hidden
                            className="mt-0.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-2xl border border-sand bg-white/80 text-xs font-semibold text-primary"
                            title="Logo (placeholder)"
                          >
                            {(it.name.trim()[0] || "•").toUpperCase()}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </FadeIn>

      {/* CONTACT */}
      <FadeIn className="mx-auto max-w-6xl px-4 pb-24 md:pb-28" id="contact">
        <Card className="relative overflow-hidden p-8 shadow-soft-sm sm:p-10">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -bottom-24 h-[320px] w-[320px] rounded-full bg-[rgba(31,143,95,0.16)] blur-3xl" />
            <div className="absolute -right-28 -top-24 h-[360px] w-[360px] rounded-full bg-[rgba(63,91,69,0.12)] blur-3xl" />
          </div>

          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold text-primary">{t.contactTitle}</h2>
              <p className="mt-3 max-w-xl text-sm text-[rgba(43,43,43,0.72)]">
                {t.contactLead}
              </p>
              <p className="mt-3 text-sm font-semibold text-primary/80">{t.contactMeta}</p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={`/${lang}/creer-entreprise`}
                  className="w-full whitespace-nowrap px-7 py-4 text-base shadow-soft sm:w-auto"
                >
                  {t.contactCtaPrimary}
                </ButtonLink>
                <ButtonLink
                  href={`mailto:info@moconsult.be?subject=${encodeURIComponent("Demande de devis")}`}
                  variant="outline"
                  className="w-full whitespace-nowrap px-7 py-4 text-base sm:w-auto"
                >
                  {t.contactCtaSecondary}
                </ButtonLink>
              </div>
            </div>

            <div className="rounded-3xl border border-sand bg-white/60 p-6 backdrop-blur">
              <p className="text-sm font-semibold text-primary">Message rapide (UI-only)</p>
              <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
                (On branchera l’envoi plus tard. Pour l’instant, utilisez le bouton email.)
              </p>

              <div className="mt-5 grid gap-3">
                <input
                  className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="Votre nom"
                />
                <input
                  className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="Votre email"
                />
                <textarea
                  className="min-h-[120px] w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="Votre message"
                />
                <ButtonLink
                  href={`mailto:info@moconsult.be?subject=${encodeURIComponent(
                    "Contact Mo Consult"
                  )}&body=${encodeURIComponent(
                    "Bonjour Mo Consult,\n\nJe souhaite poser une question.\n\nMerci."
                  )}`}
                  className="w-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-soft-sm transition hover:bg-[var(--color-primary)]"
                >
                  Envoyer (email)
                </ButtonLink>
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>
    </main>
  );
}
