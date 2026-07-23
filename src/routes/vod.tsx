import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Star, TrendingUp, Sparkles } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { GlowBackdrop } from "@/components/glow-backdrop";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/vod")({
  head: () => ({
    meta: [
      { title: "VOD Library — ZYVO IPTV" },
      { name: "description", content: "60,000+ movies and series on demand. New releases added daily in HD and 4K." },
      { property: "og:title", content: "VOD Library — ZYVO IPTV" },
      { property: "og:description", content: "60,000+ movies and series on demand — updated daily." },
    ],
  }),
  component: VodPage,
});

const rows = [
  { title: "Trending now", icon: TrendingUp, items: 8 },
  { title: "New releases", icon: Sparkles, items: 8 },
  { title: "Top rated", icon: Star, items: 8 },
];

function VodPage() {
  return (
    <div className="relative">
      <GlowBackdrop />
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-24 pb-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold">60,000+ <span className="gradient-text">on demand</span></h1>
            <p className="mt-5 text-muted-foreground">Movies, series, and originals — updated daily and streamed in stunning quality.</p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-24 space-y-14">
        {rows.map((row, r) => (
          <Reveal key={row.title} delay={r * 100}>
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-hero"><row.icon className="h-5 w-5 text-white" /></div>
                <h2 className="text-2xl font-extrabold">{row.title}</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {Array.from({ length: row.items }).map((_, i) => (
                  <div key={i} className="group aspect-[2/3] rounded-2xl shadow-card overflow-hidden relative cursor-pointer hover:-translate-y-1 transition-all" style={{
                    background: `linear-gradient(${(r*40 + i*30) % 360}deg, oklch(0.72 0.18 235), oklch(0.85 0.16 200))`
                  }}>
                    <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-white/95">
                        <Play className="h-5 w-5 text-primary" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 rounded-md bg-black/40 backdrop-blur px-1.5 py-0.5 text-[10px] font-bold text-white">4K</div>
                    <div className="absolute bottom-2 left-2 right-2 text-[10px] font-semibold text-white/90 flex items-center gap-1">
                      <Star className="h-3 w-3" fill="currentColor" /> 8.{(i + r) % 10}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}

        <Reveal>
          <div className="rounded-3xl bg-gradient-hero p-10 md:p-14 text-center text-primary-foreground shadow-glow">
            <h3 className="text-2xl md:text-4xl font-extrabold">Access the full VOD library</h3>
            <p className="mt-3 text-white/90">Start your trial and unlock every movie and show.</p>
            <Button asChild className="mt-6 rounded-full bg-white text-primary hover:bg-white/95"><Link to="/signup">Start Free Trial</Link></Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
