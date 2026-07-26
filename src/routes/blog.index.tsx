import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/reveal";
import { GlowBackdrop } from "@/components/glow-backdrop";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — ZYVO IPTV" },
      { name: "description", content: "News, tips and updates from ZYVO IPTV." },
      { property: "og:title", content: "Blog — ZYVO IPTV" },
      { property: "og:url", content: "https://azure-view-global.lovable.app/blog" },
    ],
    links: [{ rel: "canonical", href: "https://azure-view-global.lovable.app/blog" }],
  }),
  component: BlogList,
});

function BlogList() {
  const { data, isLoading } = useQuery({
    queryKey: ["public-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts")
        .select("id,title,slug,excerpt,featured_image,category,published_at,author")
        .eq("published", true).order("published_at", { ascending: false });
      if (error) throw error; return data;
    },
  });

  return (
    <div className="relative">
      <GlowBackdrop />
      <section className="relative mx-auto max-w-6xl px-4 md:px-6 pt-16 md:pt-24 pb-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold">ZYVO <span className="gradient-text">Blog</span></h1>
            <p className="mt-4 text-muted-foreground">News, guides and updates.</p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && (data ?? []).length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
          {(data ?? []).map((p: any) => (
            <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group rounded-3xl border border-border bg-card overflow-hidden shadow-soft hover:shadow-glow hover:-translate-y-1 transition-all">
              {p.featured_image && <img src={p.featured_image} alt={p.title} className="h-44 w-full object-cover" />}
              <div className="p-5">
                {p.category && <div className="text-xs font-semibold text-primary">{p.category}</div>}
                <h2 className="mt-1 text-lg font-bold group-hover:text-primary transition-colors">{p.title}</h2>
                {p.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>}
                <div className="mt-3 text-xs text-muted-foreground">{p.published_at && new Date(p.published_at).toLocaleDateString()} {p.author && `• ${p.author}`}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
