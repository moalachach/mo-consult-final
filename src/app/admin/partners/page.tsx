"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge, Button, Card } from "@/components/ui";
import { Plus, RefreshCw, Trash2 } from "lucide-react";

type PartnerRow = {
  id: string;
  slug: string;
  category: string;
  name: string;
  website: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  vat: string | null;
  description: string | null;
  is_active: boolean;
  updated_at?: string | null;
};

const categories = [
  { value: "notaire", label: "Notaires" },
  { value: "comptable", label: "Comptables" },
  { value: "domiciliation", label: "Domiciliation" },
  { value: "caisse_sociale", label: "Caisses sociales" },
  { value: "design", label: "Design" },
] as const;

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Page() {
  const [rows, setRows] = React.useState<PartnerRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const [filter, setFilter] = React.useState<string>("all");
  const [showInactive, setShowInactive] = React.useState(false);

  const [editing, setEditing] = React.useState<PartnerRow | null>(null);
  const [form, setForm] = React.useState({
    id: "",
    name: "",
    slug: "",
    category: "comptable",
    website: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    vat: "",
    description: "",
    is_active: true,
  });

  const load = React.useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/partners", { cache: "no-store" });
      const json = (await res.json()) as any;
      if (!json?.ok) throw new Error(json?.error || "Erreur");
      setRows(json.partners || []);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = rows.filter((r) => {
    if (!showInactive && !r.is_active) return false;
    if (filter === "all") return true;
    return r.category === filter;
  });

  const startNew = () => {
    setEditing(null);
    setForm({
      id: "",
      name: "",
      slug: "",
      category: "comptable",
      website: "",
      city: "",
      address: "",
      phone: "",
      email: "",
      vat: "",
      description: "",
      is_active: true,
    });
  };

  const startEdit = (p: PartnerRow) => {
    setEditing(p);
    setForm({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      website: p.website || "",
      city: p.city || "",
      address: p.address || "",
      phone: p.phone || "",
      email: p.email || "",
      vat: p.vat || "",
      description: p.description || "",
      is_active: p.is_active,
    });
  };

  const save = async () => {
    setLoading(true);
    setErr(null);
    try {
      const payload = {
        ...form,
        slug: form.slug.trim() || slugify(form.name),
      };
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as any;
      if (!json?.ok) throw new Error(json?.error || "Erreur");
      await load();
      startNew();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const deactivate = async (id: string) => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
      const json = (await res.json()) as any;
      if (!json?.ok) throw new Error(json?.error || "Erreur");
      await load();
      if (editing?.id === id) startNew();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge tone="accent">Admin</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text)]">
              Partenaires
            </h1>
            <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
              Ajoutez / modifiez / désactivez vos partenaires. Ces fiches alimentent le site.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={load} disabled={loading}>
              <RefreshCw className="h-4 w-4" strokeWidth={2.2} />
              Actualiser
            </Button>
            <Button className="gap-2" onClick={startNew} disabled={loading}>
              <Plus className="h-4 w-4" strokeWidth={2.2} />
              Nouveau
            </Button>
          </div>
        </div>

        {err ? (
          <div className="mb-6 rounded-3xl border border-[rgba(239,68,68,0.22)] bg-[rgba(239,68,68,0.10)] p-4 text-sm text-[rgb(153,27,27)]">
            {err}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary">Filtre</span>
                <select
                  className="rounded-2xl border border-sand bg-white/70 px-4 py-2 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  aria-label="Filtrer par catégorie"
                >
                  <option value="all">Tous</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="h-4 w-4 accent-[var(--color-accent)]"
                />
                Afficher inactifs
              </label>
            </div>

            <div className="p-6">
              {loading && rows.length === 0 ? (
                <p className="text-sm text-[rgba(43,43,43,0.72)]">Chargement…</p>
              ) : filtered.length === 0 ? (
                <p className="text-sm text-[rgba(43,43,43,0.72)]">Aucun partenaire.</p>
              ) : (
                <div className="grid gap-3">
                  {filtered.map((p) => (
                    <motion.button
                      key={p.id}
                      type="button"
                      onClick={() => startEdit(p)}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={[
                        "w-full rounded-3xl border px-5 py-4 text-left transition",
                        editing?.id === p.id
                          ? "border-[rgba(31,143,95,0.35)] bg-[rgba(31,143,95,0.10)]"
                          : "border-sand bg-white/60 hover:bg-white/80",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--color-text)]">
                            {p.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-[rgba(43,43,43,0.65)]">
                            {p.category} · /{p.slug}
                          </p>
                        </div>
                        <span
                          className={[
                            "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                            p.is_active
                              ? "border-[rgba(31,143,95,0.25)] bg-[rgba(31,143,95,0.12)] text-[var(--color-accent)]"
                              : "border-[var(--color-sand)] bg-white/60 text-[rgba(43,43,43,0.70)]",
                          ].join(" ")}
                        >
                          {p.is_active ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-sm font-semibold text-primary">
              {editing ? "Modifier" : "Nouveau partenaire"}
            </p>

            <div className="mt-5 grid gap-3">
              <label className="text-sm font-medium text-[var(--color-text)]">
                Nom
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="Ex: SM COMPTA"
                />
              </label>

              <label className="text-sm font-medium text-[var(--color-text)]">
                Slug
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="auto si vide"
                />
              </label>

              <label className="text-sm font-medium text-[var(--color-text)]">
                Catégorie
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-medium text-[var(--color-text)]">
                Site web
                <input
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  placeholder="https://..."
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-medium text-[var(--color-text)]">
                  Ville
                  <input
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  />
                </label>
                <label className="text-sm font-medium text-[var(--color-text)]">
                  Email
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                    placeholder="contact@..."
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-medium text-[var(--color-text)]">
                  Téléphone
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  />
                </label>
                <label className="text-sm font-medium text-[var(--color-text)]">
                  TVA (optionnel)
                  <input
                    value={form.vat}
                    onChange={(e) => setForm((f) => ({ ...f, vat: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                  />
                </label>
              </div>

              <label className="text-sm font-medium text-[var(--color-text)]">
                Adresse
                <input
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                />
              </label>

              <label className="text-sm font-medium text-[var(--color-text)]">
                Description
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="mt-2 min-h-[110px] w-full rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
                />
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  className="h-4 w-4 accent-[var(--color-accent)]"
                />
                Actif
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={save} disabled={loading} className="whitespace-nowrap">
                Enregistrer
              </Button>
              {editing ? (
                <Button
                  variant="outline"
                  onClick={() => deactivate(editing.id)}
                  disabled={loading}
                  className="gap-2 whitespace-nowrap"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                  Désactiver
                </Button>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

