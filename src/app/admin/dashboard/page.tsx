import { isSupabaseAdminConfigured } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function Card({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-6 shadow-sm backdrop-blur">
      <p className="text-sm font-semibold text-[rgba(43,43,43,0.72)]">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-text)]">
        {value}
      </p>
      {sub ? <p className="mt-2 text-sm text-[rgba(43,43,43,0.70)]">{sub}</p> : null}
    </div>
  );
}

export default async function Page() {
  if (!isSupabaseAdminConfigured()) {
    return (
      <div className="min-h-screen bg-[var(--color-beige)]">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
            Admin — Dashboard
          </h1>
          <p className="mt-2 text-[rgba(43,43,43,0.72)]">
            Supabase (service role) n’est pas configuré. Ajoutez la clé service role pour
            activer les statistiques.
          </p>
        </div>
      </div>
    );
  }

  const supabase = getSupabaseAdminClient();
  const now = new Date();
  const since7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  const [{ count: views7d }, { count: views24h }, dossiersRes, topRes] = await Promise.all([
    supabase.from("page_events").select("*", { count: "exact", head: true }).gte("created_at", since7d),
    supabase.from("page_events").select("*", { count: "exact", head: true }).gte("created_at", since24h),
    supabase.from("dossiers").select("id,type,status,updated_at").order("updated_at", { ascending: false }).limit(20),
    supabase
      .from("page_events")
      .select("path,created_at")
      .gte("created_at", since7d)
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  const dossiers = dossiersRes.data ?? [];
  const events = topRes.data ?? [];

  // Aggregate top pages (simple in-memory count).
  const counts = new Map<string, number>();
  for (const e of events as any[]) {
    const p = (e.path as string) || "";
    const key = p.split("?")[0] || "/";
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const topPages = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
            Admin — Dashboard
          </h1>
          <p className="mt-2 text-[rgba(43,43,43,0.72)]">
            Vues (pageviews) + demandes reçues. (MVP stats — on pourra affiner ensuite.)
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card title="Vues (7 jours)" value={String(views7d ?? 0)} />
          <Card title="Vues (24h)" value={String(views24h ?? 0)} />
          <Card title="Demandes récentes" value={String(dossiers.length)} sub="Derniers 20 dossiers" />
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-6 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">Top pages (7 jours)</p>
            <div className="mt-4 grid gap-2">
              {topPages.length === 0 ? (
                <p className="text-sm text-[rgba(43,43,43,0.72)]">Pas encore de données.</p>
              ) : (
                topPages.map(([path, n]) => (
                  <div
                    key={path}
                    className="flex items-center justify-between rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-3 text-sm"
                  >
                    <span className="font-semibold text-[var(--color-text)]">{path}</span>
                    <span className="text-[rgba(43,43,43,0.72)]">{n}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-6 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">Dernières demandes</p>
            <div className="mt-4 grid gap-2">
              {dossiers.length === 0 ? (
                <p className="text-sm text-[rgba(43,43,43,0.72)]">Aucune demande.</p>
              ) : (
                dossiers.map((d: any) => (
                  <a
                    key={d.id}
                    href={`/admin/dossiers/${d.id}`}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-3 text-sm transition hover:bg-white/80"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--color-text)]">
                        {d.type === "srl" ? "SRL" : "PP"} • {d.status}
                      </p>
                      <p className="mt-1 truncate text-xs text-[rgba(43,43,43,0.70)]">{d.id}</p>
                    </div>
                    <span className="text-xs text-[rgba(43,43,43,0.65)]">
                      {d.updated_at ? new Date(d.updated_at).toLocaleString() : "—"}
                    </span>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

