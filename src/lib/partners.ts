export type PartnerCategory =
  | "notaire"
  | "comptable"
  | "domiciliation"
  | "caisse_sociale"
  | "design";

export type Partner = {
  slug: string;
  category: PartnerCategory;
  name: string;
  website?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  vat?: string;
  description?: string;
  // UI-only for now: later we can store a real logo file.
  logoText?: string;
};

export const partners: Partner[] = [
  {
    slug: "indekeu-cleenewerck-decrayencour",
    category: "notaire",
    name: "Indekeu, Cleenewerck & Decrayencour",
    website: "https://indekeu-cleenewerckdecrayencour.be/fr",
    city: "Bruxelles",
    logoText: "N",
  },
  {
    slug: "sm-compta",
    category: "comptable",
    name: "SM COMPTA",
    website: "https://smcompta.be",
    city: "Belgique",
    logoText: "SM",
  },
  {
    slug: "atiscom",
    category: "comptable",
    name: "ATISCOM",
    city: "Belgique",
    logoText: "A",
  },
  {
    slug: "kiuaccount",
    category: "comptable",
    name: "KIUACCOUNT",
    city: "Belgique",
    logoText: "K",
  },
  {
    slug: "ed-partners",
    category: "domiciliation",
    name: "ED PARTNERS",
    website: "https://ed-partners.be/index.php/je-cree-mon-siege-social/partenaire-mo-consult/",
    city: "Belgique",
    logoText: "ED",
  },
  {
    slug: "liantis",
    category: "caisse_sociale",
    name: "Liantis",
    city: "Belgique",
    logoText: "L",
  },
  {
    slug: "partena-professionel",
    category: "caisse_sociale",
    name: "Partena Professionel",
    city: "Belgique",
    logoText: "P",
  },
  {
    slug: "judesign",
    category: "design",
    name: "JUDesign",
    city: "Belgique",
    logoText: "JU",
  },
];

export function getPartnerBySlug(slug: string) {
  return partners.find((p) => p.slug === slug) ?? null;
}

