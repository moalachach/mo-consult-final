import { normalizeLang } from "@/lib/i18n";
import { Badge, Card } from "@/components/ui";
import { FadeIn } from "@/components/fade-in";
import { ButtonLink } from "@/components/button-link";
import { CheckCircle2 } from "lucide-react";

type TypeParam = "srl" | "pp";

const isTypeParam = (value: unknown): value is TypeParam =>
  value === "srl" || value === "pp";

type PackParam = "base" | "branding" | "domiciliation" | "partners";
const isPackParam = (value: unknown): value is PackParam =>
  value === "base" || value === "branding" || value === "domiciliation" || value === "partners";

const content = {
  fr: {
    badge: "Créer une entreprise",
    h1: "On démarre ?",
    subtitle:
      "Choisissez votre formule. Remplissez le formulaire. Nous nous occupons du reste.",
    chosenPack: "Pack choisi",
    selected: "Sélectionné",
    choose: "Choisir",
    start: "Commencer",
    chosen: "Type choisi",
    processTitle: "Le parcours",
    srlTitle: "Créer une SRL",
    srlPrice: "1.250 € – Honoraires Mo Consult",
    ppTitle: "Indépendant en nom propre",
    ppPrice: "200 € – Honoraires Mo Consult",
  },
  nl: {
    badge: "Start",
    h1: "Gaan we van start?",
    subtitle: "Kies uw formule. Vul het formulier in. Wij regelen de rest.",
    chosenPack: "Gekozen pack",
    selected: "Geselecteerd",
    choose: "Kiezen",
    start: "Start",
    chosen: "Gekozen type",
    processTitle: "Het traject",
    srlTitle: "Een SRL oprichten",
    srlPrice: "1.250 € – Honoraria Mo Consult",
    ppTitle: "Zelfstandige in eigen naam",
    ppPrice: "200 € – Honoraria Mo Consult",
  },
  en: {
    badge: "Get started",
    h1: "Shall we start?",
    subtitle: "Choose your plan. Fill in the form. We handle the rest.",
    chosenPack: "Selected pack",
    selected: "Selected",
    choose: "Choose",
    start: "Start",
    chosen: "Chosen type",
    processTitle: "The path",
    srlTitle: "Create an SRL",
    srlPrice: "€1,250 – Mo Consult fees",
    ppTitle: "Sole proprietor",
    ppPrice: "€200 – Mo Consult fees",
  },
} as const;

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ type?: string; pack?: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = normalizeLang(rawLang);
  const sp = (await searchParams) || {};
  const selected = isTypeParam(sp.type) ? sp.type : undefined;
  const pack = isPackParam(sp.pack) ? sp.pack : undefined;
  const chosen: TypeParam = selected ?? "srl";
  const t = content[lang] ?? content.fr;

  const packLabel =
    pack === "base"
      ? "Base"
      : pack === "branding"
        ? "Charte"
        : pack === "domiciliation"
          ? "Domiciliation"
          : pack === "partners"
            ? "Partenaires"
            : undefined;

  return (
    <main className="hero-bg">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <FadeIn className="flex flex-col gap-4">
          <Badge tone="accent">{t.badge}</Badge>
          <h1 className="text-4xl font-semibold">{t.h1}</h1>
          <p className="max-w-2xl text-[rgba(43,43,43,0.75)]">{t.subtitle}</p>
          {packLabel ? (
            <div className="flex items-center gap-2 text-sm text-[rgba(43,43,43,0.72)]">
              <span className="font-semibold text-primary/80">{t.chosenPack}:</span>
              <Badge className="bg-white/60 text-primary">{packLabel}</Badge>
            </div>
          ) : null}
        </FadeIn>

        <FadeIn className="mt-8 grid gap-6 md:grid-cols-2">
          <Card
            accent
            className={selected === "srl" ? "ring-2 ring-[var(--color-accent)]" : ""}
          >
            {selected === "srl" && (
              <Badge className="mb-3" tone="accent">
                {t.selected}
              </Badge>
            )}
            <h2 className="text-xl font-semibold">{t.srlTitle}</h2>
            <p className="mt-2 text-sm text-[rgba(43,43,43,0.75)]">{t.srlPrice}</p>
            <ul className="mt-4 grid gap-2 text-sm text-[rgba(43,43,43,0.75)]">
              {["Plan financier", "Dossier notaire", "Banque & attestation", "Affiliation société"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[var(--color-accent)]" />
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink
                href={`/${lang}/creer-entreprise?type=srl${pack ? `&pack=${pack}` : ""}`}
                variant="outline"
              >
                {t.choose}
              </ButtonLink>
            </div>
          </Card>

          <Card
            className={selected === "pp" ? "ring-2 ring-[var(--color-accent)]" : ""}
          >
            {selected === "pp" && (
              <Badge className="mb-3" tone="accent">
                {t.selected}
              </Badge>
            )}
            <h2 className="text-xl font-semibold">{t.ppTitle}</h2>
            <p className="mt-2 text-sm text-[rgba(43,43,43,0.75)]">{t.ppPrice}</p>
            <ul className="mt-4 grid gap-2 text-sm text-[rgba(43,43,43,0.75)]">
              {["Inscription", "TVA si besoin", "Caisse sociale", "Conseils de démarrage"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[var(--color-accent)]" />
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink
                href={`/${lang}/creer-entreprise?type=pp${pack ? `&pack=${pack}` : ""}`}
                variant="outline"
              >
                {t.choose}
              </ButtonLink>
            </div>
          </Card>
        </FadeIn>

        <FadeIn className="mt-10">
          <Card>
            <h2 className="text-xl font-semibold">{t.processTitle}</h2>
            <div className="mt-4 grid gap-2 text-sm text-[rgba(43,43,43,0.75)] sm:grid-cols-2">
              {[
                "Vous remplissez",
                "Nous préparons",
                "Banque & notaire",
                "Vous signez",
                "Numéro d’entreprise",
                "Vous démarrez",
              ].map((item) => (
                <p key={item}>• {item}</p>
              ))}
            </div>
          </Card>
        </FadeIn>

        <FadeIn className="mt-10 flex items-center justify-between gap-4">
          <ButtonLink
            href={`/${lang}/onboarding/creation-entreprise?type=${chosen}${pack ? `&pack=${pack}` : ""}`}
            className="px-9 py-4 text-base shadow-soft"
          >
            {t.start}
          </ButtonLink>
          <span className="text-sm text-[rgba(43,43,43,0.65)]">
            {t.chosen} : <span className="font-semibold">{chosen.toUpperCase()}</span>
          </span>
        </FadeIn>
      </div>
    </main>
  );
}
