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
  whatsapp?: string; // e.g. "+32499..." or "https://wa.me/..."
  email?: string;
  vat?: string;
  description?: string;
  linkedin?: string;
  instagram?: string;
  formLink?: string;
  services?: string[]; // UI-only for now
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
    services: ["Création SRL", "Actes notariés", "Rendez-vous notaire"],
    logoText: "N",
  },
  {
    slug: "sm-compta",
    category: "comptable",
    name: "SM COMPTA",
    website: "https://smcompta.be",
    city: "Belgique",
    services: ["Comptabilité", "TVA", "Conseil"],
    logoText: "SM",
  },
  {
    slug: "atiscom",
    category: "comptable",
    name: "ATISCOM",
    city: "Belgique",
    services: ["Comptabilité", "TVA", "Conseil"],
    logoText: "A",
  },
  {
    slug: "kiuaccount",
    category: "comptable",
    name: "KIUACCOUNT",
    city: "Belgique",
    services: ["Comptabilité", "TVA", "Conseil"],
    logoText: "K",
  },
  {
    slug: "ed-partners",
    category: "domiciliation",
    name: "ED PARTNERS",
    website: "https://ed-partners.be/index.php/je-cree-mon-siege-social/partenaire-mo-consult/",
    city: "Belgique",
    services: ["Siège social", "Unité d’établissement", "Bail / attestation"],
    logoText: "ED",
  },
  {
    slug: "liantis",
    category: "caisse_sociale",
    name: "Liantis",
    city: "Belgique",
    services: ["Affiliation", "Cotisations", "Conseil"],
    logoText: "L",
  },
  {
    slug: "partena-professionel",
    category: "caisse_sociale",
    name: "Partena Professionel",
    city: "Belgique",
    services: ["Affiliation", "Cotisations", "Conseil"],
    logoText: "P",
  },
  {
    slug: "judesign",
    category: "design",
    name: "JUDesign",
    city: "Belgique",
    services: ["Logo", "Charte graphique", "Supports"],
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
      whatsapp: p.whatsapp ?? undefined,
      email: p.email ?? undefined,
      vat: p.vat ?? undefined,
      description: p.description ?? undefined,
      linkedin: p.linkedin ?? undefined,
      instagram: p.instagram ?? undefined,
      formLink: p.form_link ?? p.formLink ?? undefined,
      services: p.services ?? undefined,
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
      whatsapp: (data as any).whatsapp ?? undefined,
      email: data.email ?? undefined,
      vat: data.vat ?? undefined,
      description: data.description ?? undefined,
      linkedin: (data as any).linkedin ?? undefined,
      instagram: (data as any).instagram ?? undefined,
      formLink: (data as any).form_link ?? (data as any).formLink ?? undefined,
      services: (data as any).services ?? undefined,
      logoText: (data.name || "").split(/\s+/).slice(0, 2).map((x: string) => x[0]).join("").toUpperCase(),
    } as Partner;
  } catch {
    return getPartnerBySlugFallback(slug);
  }
}
