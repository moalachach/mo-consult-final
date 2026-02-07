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
	  ChevronDown,
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
	    offersTitle: "Choisissez votre service",
	    packsCtaStart: "Commencer",
	    packsCtaChoose: "Choisir ce pack",
	    packsCtaPartners: "Découvrir les partenaires",
	    packsRecommended: "Recommandé",
	    packs: [
	      {
	        id: "base",
	        title: "Pack 1 — Création d’entreprise (Base)",
	        price: "À partir de 200€ (PP) / 1.250€ (SRL)",
	        idealFor: "Idéal pour : démarrer vite avec un dossier complet",
	        bullets: [
	          "Dossier BCE + activation",
	          "TVA (si nécessaire)",
	          "Caisse sociale / affiliations",
	          "Checklist documents + suivi",
	        ],
	        recommended: false,
	      },
	      {
	        id: "branding",
	        title: "Pack 2 — Création + Charte graphique",
	        price: "Sur devis",
	        idealFor: "Idéal pour : lancer une marque crédible dès le 1er jour",
	        bullets: [
	          "Logo (2–3 propositions)",
	          "Charte (couleurs, typographies, usages)",
	          "Versions réseaux sociaux",
	          "Fichier PDF + exports",
	        ],
	        recommended: true,
	      },
	      {
	        id: "domiciliation",
	        price: "Sur devis",
	        title: "Pack 3 — Création + Domiciliation (Siège + UE)",
	        idealFor: "Idéal pour : séparer privé/pro et être conforme",
	        bullets: [
	          "Domiciliation siège social",
	          "Unité d’établissement",
	          "Courrier & attestations",
	          "Accompagnement administratif",
	        ],
	        recommended: false,
	      },
	      {
	        id: "partners",
	        price: "Sur devis",
	        title: "Pack 4 — Pack Partenaires (Services groupés)",
	        idealFor: "Idéal pour : avoir les bons contacts au bon moment",
	        bullets: [
	          "Notaire / comptable / banque",
	          "Caisse sociale / assurances",
	          "Domiciliation (si besoin)",
	          "Mise en relation + suivi",
	        ],
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
	    partnerCtaView: "Voir la fiche",
	    partnerTagWebsite: "Site web",
	    partners: [
	      {
	        key: "notaire",
	        title: "Notaires",
	        icon: Landmark,
	        lead: "Pour l’acte et le rendez-vous.",
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
	        lead: "Conseil, TVA et suivi comptable.",
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
	        lead: "Siège social + unité d’établissement.",
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
	        lead: "Affiliation et cotisations.",
	        items: [
	          { name: "Liantis", slug: "liantis" },
	          { name: "Partena Professionel", slug: "partena-professionel" },
	        ],
	      },
	    ],
    contactTitle: "Contact",
    contactLead:
      "Une question avant de démarrer ? Écrivez-nous, on vous répond rapidement.",
	    contactCtaPrimary: "Créer mon entreprise",
	    contactCtaSecondary: "Demander un devis",
	    contactMeta: "Email: info@moconsult.be · Téléphone: +32 499 916 046 · Bruxelles",
	    contactHours: "Lun–Ven, 09:00–18:00",
	    contactResponse: "Réponse en général sous 24h.",
	    contactQuickWhatsApp: "WhatsApp",
	    contactQuickCall: "Réserver un appel",
	    contactFormTitle: "Envoyez un message",
	    contactFormLead: "On vous répond rapidement. (Envoi automatisé à brancher plus tard.)",
	    contactForm: {
	      name: "Nom",
	      email: "Email",
	      phone: "Téléphone (optionnel)",
	      subject: "Sujet",
	      message: "Message",
	      send: "Envoyer (email)",
	    },
	    contactSubjects: [
	      "Création SRL",
	      "Indépendant (PP)",
	      "Domiciliation",
	      "Comptable",
	      "Charte graphique / logo",
	      "Site web",
	      "Autre",
	    ],
	    faqTitle: "FAQ",
	    faqLead: "Les réponses rapides aux questions fréquentes.",
	    faqItems: [
	      {
	        q: "SRL ou indépendant (PP) — que choisir ?",
	        a: "On vous aide à choisir selon votre activité, vos revenus et votre projet. Dans le doute, commencez le dossier: on affine ensemble.",
	      },
	      {
	        q: "Quels sont les délais ?",
	        a: "Cela dépend du notaire, de la banque et des informations fournies. Notre objectif: avancer étape par étape, sans stress.",
	      },
	      {
	        q: "La TVA est-elle obligatoire ?",
	        a: "Pas toujours. On vérifie selon l’activité et la situation, puis on vous accompagne pour l’activation si nécessaire.",
	      },
	      {
	        q: "Que se passe-t-il si mon dossier est incomplet ?",
	        a: "On vous indique exactement ce qu’il manque, directement dans votre espace client, et vous pouvez compléter quand vous voulez.",
	      },
	      {
	        q: "Puis-je demander une domiciliation ?",
	        a: "Oui. Si vous n’en avez pas besoin, on peut vous demander le bail / preuve d’adresse selon votre cas.",
	      },
	      {
	        q: "Le paiement en ligne est-il sécurisé ?",
	        a: "Oui. Le paiement sera branché sur une solution sécurisée (à activer en fin de projet).",
	      },
	    ],
	  },
  nl: {
    badge: "Uw partner om te ondernemen in België",
    h1: "Richt uw bedrijf online op. Wij regelen de rest.",
    subline: "U vult in. Wij bereiden voor. U start.",
    primaryCta: "Start mijn bedrijf",
	    secondaryCta: "Bekijk hoe het werkt",
	    trust: ["Financieel plan inbegrepen", "Notarisdossier inbegrepen", "Veilige betaling"],
	    offersTitle: "Kies uw pakket",
	    packsCtaStart: "Starten",
	    packsCtaChoose: "Kies dit pakket",
	    packsCtaPartners: "Bekijk partners",
	    packsRecommended: "Aanbevolen",
	    packs: [
	      {
	        id: "base",
	        title: "Pakket 1 — Bedrijf oprichten (Basis)",
	        price: "Vanaf €200 (PP) / €1.250 (SRL)",
	        idealFor: "Ideaal om snel te starten met een volledig dossier",
	        bullets: [
	          "BCE-dossier + activatie",
	          "BTW (indien nodig)",
	          "Sociaal fonds / aansluitingen",
	          "Documentenchecklist + opvolging",
	        ],
	        recommended: false,
	      },
	      {
	        id: "branding",
	        title: "Pakket 2 — Oprichting + Huisstijl",
	        price: "Offerte",
	        idealFor: "Ideaal om meteen een geloofwaardig merk te lanceren",
	        bullets: [
	          "Logo (2–3 voorstellen)",
	          "Huisstijl (kleuren, typografie, gebruik)",
	          "Social media versies",
	          "PDF + exports",
	        ],
	        recommended: true,
	      },
	      {
	        id: "domiciliation",
	        price: "Offerte",
	        title: "Pakket 3 — Oprichting + Domicilie (Zetel + UE)",
	        idealFor: "Ideaal om privé/pro te scheiden en conform te blijven",
	        bullets: [
	          "Domicilie maatschappelijke zetel",
	          "Vestigingseenheid",
	          "Post & attesten",
	          "Administratieve begeleiding",
	        ],
	        recommended: false,
	      },
	      {
	        id: "partners",
	        price: "Offerte",
	        title: "Pakket 4 — Partners (gegroepeerde diensten)",
	        idealFor: "Ideaal om de juiste contacten op het juiste moment te hebben",
	        bullets: [
	          "Notaris / accountant / bank",
	          "Sociaal fonds / verzekeringen",
	          "Domicilie (indien nodig)",
	          "Intro + opvolging",
	        ],
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
	    partnerCtaView: "Bekijk fiche",
	    partnerTagWebsite: "Website",
	    partners: [
	      {
	        key: "notaire",
	        title: "Notarissen",
	        icon: Landmark,
	        lead: "Voor de akte en afspraak.",
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
	        lead: "Advies, btw en boekhouding.",
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
	        lead: "Zetel + vestigingseenheid.",
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
	        lead: "Aansluiting en bijdragen.",
	        items: [
	          { name: "Liantis", slug: "liantis" },
	          { name: "Partena Professionel", slug: "partena-professionel" },
	        ],
	      },
	    ],
    contactTitle: "Contact",
    contactLead: "Een vraag voor u start? Stuur ons een bericht, we antwoorden snel.",
	    contactCtaPrimary: "Start mijn bedrijf",
	    contactCtaSecondary: "Offerte aanvragen",
	    contactMeta: "E-mail: info@moconsult.be · Telefoon: +32 499 916 046 · Brussel",
	    contactHours: "Ma–Vr, 09:00–18:00",
	    contactResponse: "Meestal antwoord binnen 24u.",
	    contactQuickWhatsApp: "WhatsApp",
	    contactQuickCall: "Plan een gesprek",
	    contactFormTitle: "Stuur een bericht",
	    contactFormLead: "We antwoorden snel. (Automatisch verzenden later.)",
	    contactForm: {
	      name: "Naam",
	      email: "Email",
	      phone: "Telefoon (optioneel)",
	      subject: "Onderwerp",
	      message: "Bericht",
	      send: "Versturen (email)",
	    },
	    contactSubjects: [
	      "SRL oprichten",
	      "Zelfstandige (PP)",
	      "Domicilie",
	      "Accountant",
	      "Huisstijl / logo",
	      "Website",
	      "Andere",
	    ],
	    faqTitle: "FAQ",
	    faqLead: "Snelle antwoorden op veelgestelde vragen.",
	    faqItems: [
	      {
	        q: "SRL of zelfstandige (PP) — wat kies ik?",
	        a: "We helpen u kiezen op basis van uw activiteit en situatie. Start gerust: we verfijnen samen.",
	      },
	      {
	        q: "Wat zijn de doorlooptijden?",
	        a: "Dat hangt af van notaris, bank en volledigheid. We begeleiden stap voor stap.",
	      },
	      {
	        q: "Is btw verplicht?",
	        a: "Niet altijd. We bekijken dit volgens uw activiteit en helpen bij de activatie indien nodig.",
	      },
	      {
	        q: "Wat als mijn dossier onvolledig is?",
	        a: "We tonen precies wat ontbreekt in uw klantomgeving. U kan later aanvullen.",
	      },
	      {
	        q: "Kan ik domicilie aanvragen?",
	        a: "Ja. Indien niet nodig, vragen we eventueel huurcontract/bewijs van adres.",
	      },
	      {
	        q: "Is online betalen veilig?",
	        a: "Ja. Betaling wordt gekoppeld aan een beveiligde oplossing (te activeren aan het einde).",
	      },
	    ],
	  },
  en: {
    badge: "Your partner to build in Belgium",
    h1: "Create your company online. We handle the rest.",
    subline: "You fill in. We prepare. You start.",
    primaryCta: "Start my company",
	    secondaryCta: "See how it works",
	    trust: ["Financial plan included", "Notary package included", "Secure payment"],
	    offersTitle: "Choose your pack",
	    packsCtaStart: "Get started",
	    packsCtaChoose: "Choose this pack",
	    packsCtaPartners: "Explore partners",
	    packsRecommended: "Recommended",
	    packs: [
	      {
	        id: "base",
	        title: "Pack 1 — Company creation (Base)",
	        price: "From €200 (PP) / €1,250 (SRL)",
	        idealFor: "Best for starting fast with a complete file",
	        bullets: [
	          "BCE file + activation",
	          "VAT (if needed)",
	          "Social fund / affiliations",
	          "Documents checklist + tracking",
	        ],
	        recommended: false,
	      },
	      {
	        id: "branding",
	        title: "Pack 2 — Creation + Brand guidelines",
	        price: "Quote",
	        idealFor: "Best for launching a credible brand from day one",
	        bullets: [
	          "Logo (2–3 proposals)",
	          "Guidelines (colors, typography, usage)",
	          "Social media versions",
	          "PDF + exports",
	        ],
	        recommended: true,
	      },
	      {
	        id: "domiciliation",
	        price: "Quote",
	        title: "Pack 3 — Creation + Domiciliation (Seat + Unit)",
	        idealFor: "Best to separate private/pro and stay compliant",
	        bullets: [
	          "Registered seat domiciliation",
	          "Establishment unit",
	          "Mail & certificates",
	          "Admin support",
	        ],
	        recommended: false,
	      },
	      {
	        id: "partners",
	        price: "Quote",
	        title: "Pack 4 — Partners pack (Bundled services)",
	        idealFor: "Best to have the right contacts at the right time",
	        bullets: [
	          "Notary / accountant / bank",
	          "Social fund / insurance",
	          "Domiciliation (if needed)",
	          "Intro + follow-up",
	        ],
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
	    partnerCtaView: "View profile",
	    partnerTagWebsite: "Website",
	    partners: [
	      {
	        key: "notaire",
	        title: "Notaries",
	        icon: Landmark,
	        lead: "For the deed and appointment.",
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
	        lead: "Advice, VAT and bookkeeping.",
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
	        lead: "Registered seat + establishment unit.",
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
	        lead: "Affiliation and contributions.",
	        items: [
	          { name: "Liantis", slug: "liantis" },
	          { name: "Partena Professionel", slug: "partena-professionel" },
	        ],
	      },
	    ],
    contactTitle: "Contact",
    contactLead: "Have a question before you start? Message us and we’ll reply quickly.",
	    contactCtaPrimary: "Start my company",
	    contactCtaSecondary: "Request a quote",
	    contactMeta: "Email: info@moconsult.be · Phone: +32 499 916 046 · Brussels",
	    contactHours: "Mon–Fri, 09:00–18:00",
	    contactResponse: "Usually replies within 24h.",
	    contactQuickWhatsApp: "WhatsApp",
	    contactQuickCall: "Book a call",
	    contactFormTitle: "Send a message",
	    contactFormLead: "We reply quickly. (Automated sending later.)",
	    contactForm: {
	      name: "Name",
	      email: "Email",
	      phone: "Phone (optional)",
	      subject: "Subject",
	      message: "Message",
	      send: "Send (email)",
	    },
	    contactSubjects: [
	      "Create an SRL",
	      "Sole proprietor",
	      "Domiciliation",
	      "Accountant",
	      "Branding / logo",
	      "Website",
	      "Other",
	    ],
	    faqTitle: "FAQ",
	    faqLead: "Quick answers to common questions.",
	    faqItems: [
	      {
	        q: "SRL or sole proprietor — which one?",
	        a: "We help you choose based on your activity and context. Start the file and we refine together.",
	      },
	      {
	        q: "What are the timelines?",
	        a: "Depends on notary, bank and how complete the information is. We move step by step.",
	      },
	      {
	        q: "Is VAT mandatory?",
	        a: "Not always. We check based on the activity and guide you for activation when needed.",
	      },
	      {
	        q: "What if my file is incomplete?",
	        a: "We tell you exactly what’s missing inside your client space so you can complete it anytime.",
	      },
	      {
	        q: "Can I request domiciliation?",
	        a: "Yes. If you don’t need it, we may ask for a lease/proof of address depending on the case.",
	      },
	      {
	        q: "Is online payment secure?",
	        a: "Yes. Payment will be connected to a secure provider (enabled at the end of the project).",
	      },
	    ],
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
                  {p.recommended ? <Badge tone="accent">{t.packsRecommended}</Badge> : null}
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
                  href={
                    p.id === "partners"
                      ? `/${lang}/#partenaires`
                      : `/${lang}/creer-entreprise?pack=${encodeURIComponent(p.id)}`
                  }
                  className="w-full whitespace-nowrap sm:w-auto"
                >
                  {p.id === "base"
                    ? t.packsCtaStart
                    : p.id === "partners"
                      ? t.packsCtaPartners
                      : t.packsCtaChoose}
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
	
		        <div className="mt-8 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
		          {t.partners.map((p) => {
		            const Icon = p.icon;
		            const key = (p as any).key as string;
		            const dbItems = partnersAll.filter((x) => x.category === key);
		            const items = (dbItems.length > 0 ? dbItems : (p as any).items) as Array<{
		              slug: string;
		              name: string;
		              city?: string;
		              website?: string;
		              logoText?: string;
		            }>;
		            const short = items.slice(0, 3);
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
	                    <p className="mt-2 text-sm text-[rgba(43,43,43,0.70)]">{(p as any).lead}</p>
	
		                    <div className="mt-5 grid flex-1 gap-3">
		                      {short.length === 0 ? (
		                        <div className="rounded-2xl border border-sand bg-white/60 px-4 py-3 text-sm text-[rgba(43,43,43,0.70)]">
		                          Aucun partenaire pour l’instant.
		                        </div>
		                      ) : (
			                        short.map((it) => {
			                          const tags = [
			                            it.city ? String(it.city) : null,
			                            it.website ? (t as any).partnerTagWebsite : null,
			                          ].filter(Boolean) as string[];
			                          return (
		                            <div
		                              key={it.slug}
		                              className="flex max-w-full items-start justify-between gap-3 rounded-2xl border border-sand bg-white/60 px-4 py-3"
		                            >
		                              <div className="flex min-w-0 flex-1 items-start gap-3">
		                                <span
		                                  aria-hidden
		                                  className="mt-0.5 inline-flex h-10 w-10 flex-none items-center justify-center rounded-2xl border border-sand bg-white/80 text-xs font-semibold text-primary"
		                                  title="Logo (placeholder)"
		                                >
		                                  {it.logoText || (it.name.trim()[0] || "•").toUpperCase()}
		                                </span>
		                                <div className="min-w-0 flex-1">
		                                  <p
		                                    className="truncate text-sm font-semibold text-primary"
		                                    title={it.name}
		                                  >
		                                    {it.name}
		                                  </p>
		                                  <div className="mt-2 flex flex-wrap gap-2">
		                                    {tags.slice(0, 2).map((tag) => (
		                                      <span
		                                        key={tag}
		                                        className="inline-flex items-center rounded-full border border-sand bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[rgba(43,43,43,0.72)]"
		                                      >
		                                        {tag}
		                                      </span>
		                                    ))}
		                                  </div>
		                                </div>
		                              </div>
			                              <Link
			                                href={`/${lang}/partenaires/${it.slug}`}
			                                className="whitespace-nowrap rounded-xl border border-sand bg-white/70 px-3 py-2 text-xs font-semibold text-[var(--color-primary)] transition hover:bg-white/90"
			                              >
			                                {(t as any).partnerCtaView}
			                              </Link>
		                            </div>
			                          );
			                        })
			                        )
				                      }
				                    </div>
		                  </div>
		                </div>
		              </Card>
		            );
		          })}
		        </div>
	      </FadeIn>

      {/* CONTACT */}
      <FadeIn className="mx-auto max-w-6xl px-4 pb-16 md:pb-20" id="contact">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="relative overflow-hidden p-8 shadow-soft-sm sm:p-10">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 -bottom-24 h-[320px] w-[320px] rounded-full bg-[rgba(31,143,95,0.16)] blur-3xl" />
              <div className="absolute -right-28 -top-24 h-[360px] w-[360px] rounded-full bg-[rgba(63,91,69,0.12)] blur-3xl" />
            </div>

            <div className="relative">
              <h2 className="text-3xl font-semibold text-primary">{t.contactTitle}</h2>
              <p className="mt-3 max-w-xl text-sm text-[rgba(43,43,43,0.72)]">{t.contactLead}</p>

              <div className="mt-6 grid gap-3 text-sm text-[rgba(43,43,43,0.78)]">
                <p className="font-semibold text-primary/80">{t.contactMeta}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/60 text-primary">{t.contactHours}</Badge>
                  <Badge className="bg-white/60 text-primary">{t.contactResponse}</Badge>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="https://wa.me/32499916046"
                  variant="outline"
                  className="w-full whitespace-nowrap px-6 py-3 text-sm sm:w-auto"
                >
                  {t.contactQuickWhatsApp}
                </ButtonLink>
                <ButtonLink
                  href={`mailto:info@moconsult.be?subject=${encodeURIComponent("Réserver un appel")}`}
                  className="w-full whitespace-nowrap bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-soft-sm transition hover:bg-[var(--color-primary)] sm:w-auto"
                >
                  {t.contactQuickCall}
                </ButtonLink>
              </div>
            </div>
          </Card>

          <Card className="p-8 shadow-soft-sm sm:p-10">
            <p className="text-sm font-semibold text-primary">{t.contactFormTitle}</p>
            <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">{t.contactFormLead}</p>

            <div className="mt-6 grid gap-3">
              <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="c_name">
                {t.contactForm.name}
              </label>
              <input
                id="c_name"
                className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                placeholder={t.contactForm.name}
              />

              <label className="mt-2 text-sm font-medium text-[var(--color-text)]" htmlFor="c_email">
                {t.contactForm.email}
              </label>
              <input
                id="c_email"
                className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                placeholder={t.contactForm.email}
              />

              <label className="mt-2 text-sm font-medium text-[var(--color-text)]" htmlFor="c_phone">
                {t.contactForm.phone}
              </label>
              <input
                id="c_phone"
                className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                placeholder={t.contactForm.phone}
              />

              <label className="mt-2 text-sm font-medium text-[var(--color-text)]" htmlFor="c_subject">
                {t.contactForm.subject}
              </label>
              <select
                id="c_subject"
                className="w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                defaultValue={t.contactSubjects[0]}
              >
                {t.contactSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <label className="mt-2 text-sm font-medium text-[var(--color-text)]" htmlFor="c_message">
                {t.contactForm.message}
              </label>
              <textarea
                id="c_message"
                className="min-h-[140px] w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                placeholder={t.contactForm.message}
              />

              <ButtonLink
                href={`mailto:info@moconsult.be?subject=${encodeURIComponent(
                  "Contact Mo Consult"
                )}&body=${encodeURIComponent(
                  "Bonjour Mo Consult,\n\nJe souhaite poser une question.\n\nMerci."
                )}`}
                className="mt-1 w-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-soft-sm transition hover:bg-[var(--color-primary)]"
              >
                {t.contactForm.send}
              </ButtonLink>
            </div>
          </Card>
        </div>
      </FadeIn>

      {/* FAQ */}
      <FadeIn className="mx-auto max-w-6xl px-4 pb-24 md:pb-28">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-primary">{t.faqTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm text-[rgba(43,43,43,0.72)]">{t.faqLead}</p>
        </div>

        <div className="grid gap-3">
          {t.faqItems.slice(0, 8).map((it) => (
            <details
              key={it.q}
              className="group rounded-3xl border border-sand bg-white/60 p-6 shadow-soft-sm backdrop-blur open:bg-white/70"
            >
              <summary className="cursor-pointer list-none">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{it.q}</p>
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-sand bg-white/70 text-[var(--color-primary)] transition">
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" strokeWidth={2.2} />
                  </span>
                </div>
              </summary>
              <p className="mt-4 text-sm text-[rgba(43,43,43,0.75)]">{it.a}</p>
            </details>
          ))}
        </div>
      </FadeIn>
    </main>
  );
}
