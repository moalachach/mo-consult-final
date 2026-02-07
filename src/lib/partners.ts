import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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

export const fallbackPartners: Partner[] = [
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

export function getPartnerBySlugFallback(slug: string) {
  return fallbackPartners.find((p) => p.slug === slug) ?? null;
}

export async function listPartnersServer() {
  if (!isSupabaseConfigured()) return fallbackPartners;
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("partners")
      .select("slug,category,name,website,city,address,phone,email,vat,description")
      .eq("is_active", true)
      .order("category", { ascending: true })
      .order("name", { ascending: true });
    if (error) return fallbackPartners;
    return (data ?? []).map((p: any) => ({
      slug: p.slug,
      category: p.category,
      name: p.name,
      website: p.website ?? undefined,
      city: p.city ?? undefined,
      address: p.address ?? undefined,
      phone: p.phone ?? undefined,
      email: p.email ?? undefined,
      vat: p.vat ?? undefined,
      description: p.description ?? undefined,
      logoText: (p.name || "").split(/\s+/).slice(0, 2).map((x: string) => x[0]).join("").toUpperCase(),
    }));
  } catch {
    return fallbackPartners;
  }
}

export async function getPartnerBySlugServer(slug: string) {
  if (!isSupabaseConfigured()) return getPartnerBySlugFallback(slug);
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("partners")
      .select("slug,category,name,website,city,address,phone,email,vat,description,is_active")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data || data.is_active === false) return getPartnerBySlugFallback(slug);
    return {
      slug: data.slug,
      category: data.category,
      name: data.name,
      website: data.website ?? undefined,
      city: data.city ?? undefined,
      address: data.address ?? undefined,
      phone: data.phone ?? undefined,
      email: data.email ?? undefined,
      vat: data.vat ?? undefined,
      description: data.description ?? undefined,
      logoText: (data.name || "").split(/\s+/).slice(0, 2).map((x: string) => x[0]).join("").toUpperCase(),
    } as Partner;
  } catch {
    return getPartnerBySlugFallback(slug);
  }
}
