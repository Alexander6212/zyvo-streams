import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GlowBackdrop } from "@/components/glow-backdrop";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ loaderData }: any) => {
    const p = loaderData?.post;
    const title = p?.seo_title || p?.title || "Post — ZYVO IPTV";
    const desc = p?.seo_description || p?.excerpt || "ZYVO IPTV blog post.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(p?.featured_image ? [{ property: "og:image", content: p.featured_image }, { name: "twitter:image", content: p.featured_image }] : []),
      ],
    };
  },
  loader: async ({ params }) => {
    const { data } = await supabase.from("blog_posts").select("*").eq("slug", params.slug).eq("published", true).maybeSingle();
    if (!data) throw notFound();
    return { post: data };
  },
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => (await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle()).data,
  });
  const p: any = data ?? (Route.useLoaderData() as any)?.post;
  if (!p) return null;
  return (
    <div className="relative">
      <GlowBackdrop />
      <article className="relative mx-auto max-w-3xl px-4 md:px-6 pt-14 md:pt-20 pb-20">
        <Link to="/blog" className="text-sm text-primary">← All posts</Link>
        {p.category && <div className="mt-6 text-xs font-semibold text-primary">{p.category}</div>}
        <h1 className="mt-2 text-3xl md:text-5xl font-extrabold">{p.title}</h1>
        <div className="mt-3 text-xs text-muted-foreground">{p.published_at && new Date(p.published_at).toLocaleDateString()} {p.author && `• ${p.author}`}</div>
        {p.featured_image && <img src={p.featured_image} alt={p.title} className="mt-6 rounded-2xl w-full object-cover max-h-[420px]" />}
        {p.excerpt && <p className="mt-6 text-lg text-muted-foreground">{p.excerpt}</p>}
        <div className="mt-6 prose prose-slate max-w-none whitespace-pre-wrap text-[15px] leading-relaxed">{p.content}</div>
      </article>
    </div>
  );
}
