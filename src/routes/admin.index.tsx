import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, FileText, Film, Radio, MessagesSquare, Tag } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

async function count(table: any, filter?: (q: any) => any) {
  let q: any = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count } = await q;
  return count ?? 0;
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: any }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-hero text-white shadow-glow"><Icon className="h-4 w-4" /></div>
      </div>
      <div className="mt-3 text-3xl font-extrabold">{value}</div>
    </div>
  );
}

function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [users, active, subs, expired, posts, published, movies, channels, msgs] = await Promise.all([
        count("profiles"),
        count("profiles", (q) => q.eq("status", "active")),
        count("profiles", (q) => q.eq("subscription_status", "active")),
        count("profiles", (q) => q.eq("subscription_status", "expired")),
        count("blog_posts"),
        count("blog_posts", (q) => q.eq("published", true)),
        count("movies"),
        count("channels"),
        count("support_messages", (q) => q.eq("status", "open")),
      ]);
      const { data: recent } = await supabase
        .from("profiles").select("id,email,full_name,created_at")
        .order("created_at", { ascending: false }).limit(5);
      return { users, active, subs, expired, posts, published, movies, channels, msgs, recent: recent ?? [] };
    },
  });

  if (isLoading || !data) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Overview</h1>
        <p className="text-sm text-muted-foreground">Snapshot of your ZYVO IPTV platform.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={data.users} icon={Users} />
        <StatCard label="Active Users" value={data.active} icon={Users} />
        <StatCard label="Active Subscriptions" value={data.subs} icon={Tag} />
        <StatCard label="Expired Subscriptions" value={data.expired} icon={Tag} />
        <StatCard label="Blog Posts" value={data.posts} icon={FileText} />
        <StatCard label="Published Posts" value={data.published} icon={FileText} />
        <StatCard label="Movies / VOD" value={data.movies} icon={Film} />
        <StatCard label="Channels" value={data.channels} icon={Radio} />
        <StatCard label="Open Support Messages" value={data.msgs} icon={MessagesSquare} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h2 className="text-lg font-bold">Recent registrations</h2>
        <div className="mt-3 divide-y">
          {data.recent.length === 0 && <p className="text-sm text-muted-foreground py-3">No users yet.</p>}
          {data.recent.map((u) => (
            <div key={u.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <div className="font-medium">{u.full_name || u.email || u.id}</div>
                <div className="text-muted-foreground text-xs">{u.email}</div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
