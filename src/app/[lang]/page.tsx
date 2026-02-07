import Link from "next/link";
import { normalizeLang } from "@/lib/i18n";
import { Badge, Card } from "@/components/ui";
import { FadeIn } from "@/components/fade-in";
import { ButtonLink } from "@/components/button-link";
import { listPartnersServer } from "@/lib/partners";
import {
	  BadgeCheck,
	  Building2,
	  CheckCircle2,
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
	    packsCta: "Choisir ce pack",
	    packs: [
	      {
	        id: "base",
	        title: "Pack A — Création (base)",
	        price: "À partir de 200€",
	        idealFor: "Idéal pour démarrer vite et clair.",
	        bullets: ["Dossier complet", "Suivi en ligne", "Support humain"],
	        recommended: false,
	      },
	      {
	        id: "branding",
	        title: "Pack B — Création + Charte graphique",
	        price: "À partir de 600€",
	        idealFor: "Idéal pour lancer une marque solide.",
	        bullets: ["Logo + charte PDF", "Variantes de logo", "Kit réseaux sociaux (base)"],
	        recommended: false,
	      },
	      {
	        id: "domiciliation",
	        title: "Pack C — Création + Domiciliation",
	        price: "Sur devis",
	        idealFor: "Idéal si vous n’avez pas encore d’adresse pro.",
	        bullets: ["Siège social", "Unité d’établissement", "Accompagnement administratif"],
	        recommended: true,
	      },
	      {
	        id: "partners",
	        title: "Pack D — Pack Partenaires",
	        price: "Sur devis",
	        idealFor: "Idéal si vous voulez tout centraliser.",
	        bullets: ["Comptable + design + domiciliation", "Devis coordonné", "Un seul interlocuteur"],
	        recommended: false,
	      },
	    ],
	    processTitle: "Le processus, simplement",
	    servicesTitle: "Nos services",
    services: [
      {
        title: "Création d’entreprise",
        lead: "Dossier complet et suivi en ligne, étape par étape.",
        tags: ["SRL / PP", "Suivi en ligne"],
        icon: Building2,
      },
      {
        title: "Charte graphique & logo",
        lead: "Logo, charte PDF et variantes pour une identité cohérente.",
        tags: ["Logo", "Charte PDF"],
        icon: Palette,
      },
      {
        title: "Site web professionnel",
        lead: "Site vitrine avec SEO de base et formulaire de contact.",
        tags: ["Vitrine", "SEO de base"],
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
        key: "notaire",
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
        key: "comptable",
        title: "Comptables",
        icon: BadgeCheck,
        items: [
          { name: "SM COMPTA", slug: "sm-compta" },
          { name: "ATISCOM", slug: "atiscom" },
          { name: "KIUACCOUNT", slug: "kiuaccount" },
        ],
      },
      {
        key: "domiciliation",
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
        key: "caisse_sociale",
        title: "Caisses sociales",
        icon: ShieldCheck,
        items: [
          { name: "Liantis", slug: "liantis" },
          { name: "Partena Professionel", slug: "partena-professionel" },
        ],
      },
      {
        key: "design",
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
	    packsCta: "Kies dit pack",
	    packs: [
	      {
	        id: "base",
	        title: "Pack A — Oprichting (basis)",
	        price: "Vanaf €200",
	        idealFor: "Ideaal om snel en duidelijk te starten.",
	        bullets: ["Volledig dossier", "Online opvolging", "Menselijke ondersteuning"],
	        recommended: false,
	      },
	      {
	        id: "branding",
	        title: "Pack B — Oprichting + huisstijl",
	        price: "Vanaf €600",
	        idealFor: "Ideaal voor een sterke merkstart.",
	        bullets: ["Logo + PDF-huisstijl", "Logo varianten", "Social kit (basis)"],
	        recommended: false,
	      },
	      {
	        id: "domiciliation",
	        title: "Pack C — Oprichting + domicilie",
	        price: "Offerte",
	        idealFor: "Ideaal als u nog geen professioneel adres hebt.",
	        bullets: ["Maatschappelijke zetel", "Vestigingseenheid", "Administratieve begeleiding"],
	        recommended: true,
	      },
	      {
	        id: "partners",
	        title: "Pack D — Partnerpack",
	        price: "Offerte",
	        idealFor: "Ideaal als u alles wilt centraliseren.",
	        bullets: ["Accountant + design + domicilie", "Gecombineerde offerte", "Eén aanspreekpunt"],
	        recommended: false,
	      },
	    ],
	    processTitle: "Het proces, eenvoudig",
	    servicesTitle: "Onze diensten",
    services: [
      {
        title: "Bedrijf oprichten",
        lead: "Volledig dossier en online opvolging, stap voor stap.",
        tags: ["SRL / PP", "Online opvolging"],
        icon: Building2,
      },
      {
        title: "Huisstijl & logo",
        lead: "Logo, PDF-huisstijl en varianten voor een consistente identiteit.",
        tags: ["Logo", "PDF-huisstijl"],
        icon: Palette,
      },
      {
        title: "Professionele website",
        lead: "Vitrinesite met basis SEO en contactformulier.",
        tags: ["Vitrine", "Basis SEO"],
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
        key: "notaire",
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
        key: "comptable",
        title: "Accountants",
        icon: BadgeCheck,
        items: [
          { name: "SM COMPTA", slug: "sm-compta" },
          { name: "ATISCOM", slug: "atiscom" },
          { name: "KIUACCOUNT", slug: "kiuaccount" },
        ],
      },
      {
        key: "domiciliation",
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
        key: "caisse_sociale",
        title: "Sociale fondsen",
        icon: ShieldCheck,
        items: [
          { name: "Liantis", slug: "liantis" },
          { name: "Partena Professionel", slug: "partena-professionel" },
        ],
      },
      {
        key: "design",
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
	    packsCta: "Choose this pack",
	    packs: [
	      {
	        id: "base",
	        title: "Pack A — Creation (base)",
	        price: "From €200",
	        idealFor: "Best for a quick, clear start.",
	        bullets: ["Complete file", "Online tracking", "Human support"],
	        recommended: false,
	      },
	      {
	        id: "branding",
	        title: "Pack B — Creation + Brand guidelines",
	        price: "From €600",
	        idealFor: "Best for launching a strong brand.",
	        bullets: ["Logo + PDF guidelines", "Logo variants", "Social kit (basic)"],
	        recommended: false,
	      },
	      {
	        id: "domiciliation",
	        title: "Pack C — Creation + Domiciliation",
	        price: "Quote",
	        idealFor: "Best if you don’t have a business address yet.",
	        bullets: ["Registered seat", "Establishment unit", "Admin support"],
	        recommended: true,
	      },
	      {
	        id: "partners",
	        title: "Pack D — Partners pack",
	        price: "Quote",
	        idealFor: "Best if you want everything centralized.",
	        bullets: ["Accountant + design + domiciliation", "Coordinated quote", "Single point of contact"],
	        recommended: false,
	      },
	    ],
	    processTitle: "The process, simple",
	    servicesTitle: "Our services",
    services: [
      {
        title: "Company creation",
        lead: "Complete file with step-by-step online tracking.",
        tags: ["SRL / Sole", "Online tracking"],
        icon: Building2,
      },
      {
        title: "Brand guidelines & logo",
        lead: "Logo, PDF guidelines and variants for a consistent identity.",
        tags: ["Logo", "PDF guidelines"],
        icon: Palette,
      },
      {
        title: "Professional website",
        lead: "Landing website with basic SEO and a contact form.",
        tags: ["Website", "Basic SEO"],
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
        key: "notaire",
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
        key: "comptable",
        title: "Accountants",
        icon: BadgeCheck,
        items: [
          { name: "SM COMPTA", slug: "sm-compta" },
          { name: "ATISCOM", slug: "atiscom" },
          { name: "KIUACCOUNT", slug: "kiuaccount" },
        ],
      },
      {
        key: "domiciliation",
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
        key: "caisse_sociale",
        title: "Social funds",
        icon: ShieldCheck,
        items: [
          { name: "Liantis", slug: "liantis" },
          { name: "Partena Professionel", slug: "partena-professionel" },
        ],
      },
      {
        key: "design",
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
  const partnersAll = await listPartnersServer();

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

        <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-2">
          {t.packs.map((p) => (
            <Card
              key={p.id}
              accent={!!p.recommended}
              className={[
                "flex h-full flex-col p-7 shadow-soft-sm sm:p-8",
                p.recommended ? "ring-1 ring-[rgba(31,143,95,0.22)]" : "",
              ].join(" ")}
            >
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[rgba(43,43,43,0.72)]">
                      {p.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                      {p.price}
                    </p>
                    <p className="mt-3 text-sm text-[rgba(43,43,43,0.72)]">{p.idealFor}</p>
                  </div>
                  {p.recommended ? <Badge tone="accent">Recommandé</Badge> : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge className="bg-white/60 text-primary">Franchise TVA</Badge>
                </div>

                <ul className="mt-6 grid gap-3 text-sm text-[rgba(43,43,43,0.74)]">
                  {p.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-[rgba(31,143,95,0.12)] text-[var(--color-accent)]">
                        <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 inline-flex">
                <ButtonLink
                  href={`/${lang}/creer-entreprise?pack=${encodeURIComponent(p.id)}`}
                  className="w-full whitespace-nowrap sm:w-auto"
                >
                  {t.packsCta}
                </ButtonLink>
              </div>
            </Card>
          ))}
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
                      {(s as any).tags?.slice(0, 2).map((tag: string, idx: number) => {
                        const Icon = idx === 0 ? CheckCircle2 : Sparkles;
                        return (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-2 rounded-full border border-sand bg-white/60 px-3 py-1"
                        >
                          <Icon
                            className="h-3.5 w-3.5 text-[var(--color-accent)]"
                            strokeWidth={2.2}
                          />
                          {tag}
                        </span>
                      )})}
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
	            const key = (p as any).key as string;
	            const dbItems = partnersAll.filter((x) => x.category === key);
	            const items = (dbItems.length > 0 ? dbItems : (p as any).items) as Array<{
	              slug: string;
	              name: string;
	              logoText?: string;
	            }>;
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
	                      {items.length === 0 ? (
	                        <div className="rounded-2xl border border-sand bg-white/60 px-4 py-3 text-sm text-[rgba(43,43,43,0.70)]">
	                          Aucun partenaire pour l’instant.
	                        </div>
	                      ) : (
	                        items.map((it) => (
	                          <Link
	                            key={it.slug}
	                            href={`/${lang}/partenaires/${it.slug}`}
	                            className="flex max-w-full items-start justify-between gap-3 rounded-2xl border border-sand bg-white/60 px-4 py-3 transition hover:bg-white/80"
	                          >
	                            <div className="min-w-0 flex-1">
	                              <p
	                                className="truncate text-sm font-semibold text-primary"
	                                title={it.name}
	                              >
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
	                              {it.logoText || (it.name.trim()[0] || "•").toUpperCase()}
	                            </span>
	                          </Link>
	                        ))
	                      )}
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
