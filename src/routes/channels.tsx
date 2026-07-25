import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Radio, Trophy, Newspaper, Baby, Film, Music, Globe } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { GlowBackdrop } from "@/components/glow-backdrop";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/channels")({
  head: () => ({
    meta: [
      { title: "Live Channels — ZYVO IPTV" },
      { name: "description", content: "Browse 20,000+ live channels across sports, movies, news, kids, music and international networks." },
      { property: "og:title", content: "Live Channels — ZYVO IPTV" },
      { property: "og:description", content: "20,000+ live channels across every category and country." },
      { property: "og:url", content: "https://azure-view-global.lovable.app/channels" },
    ],
    links: [{ rel: "canonical", href: "https://azure-view-global.lovable.app/channels" }],
  }),
  component: ChannelsPage,
});

const categories = [
  { icon: Trophy, name: "Sports", count: "3,200+", color: "from-[#00BFFF] to-[#00E5FF]" },
  { icon: Film, name: "Movies", count: "2,800+", color: "from-[#00BFFF] to-[#00E5FF]" },
  { icon: Newspaper, name: "News", count: "1,400+", color: "from-[#00BFFF] to-[#00E5FF]" },
  { icon: Baby, name: "Kids", count: "900+", color: "from-[#00BFFF] to-[#00E5FF]" },
  { icon: Music, name: "Music", count: "700+", color: "from-[#00BFFF] to-[#00E5FF]" },
  { icon: Globe, name: "International", count: "8,000+", color: "from-[#00BFFF] to-[#00E5FF]" },
  { icon: Radio, name: "Entertainment", count: "2,600+", color: "from-[#00BFFF] to-[#00E5FF]" },
  { icon: Film, name: "Documentaries", count: "400+", color: "from-[#00BFFF] to-[#00E5FF]" },
];

const channels = ["ESPN", "HBO", "Sky Sports", "BeIN", "Fox Sports", "BBC One", "CNN", "MAX", "DAZN", "TNT", "AMC", "Discovery", "Nat Geo", "Cartoon", "MTV", "History", "Disney", "Nickelodeon", "Bloomberg", "Al Jazeera", "TF1", "RAI", "ZDF", "Canal+"];

function ChannelsPage() {
  const [q, setQ] = useState("");
  const filtered = channels.filter((c) => c.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="relative">
      <GlowBackdrop />
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-24 pb-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold">20,000+ <span className="gradient-text">live channels</span></h1>
            <p className="mt-5 text-muted-foreground">Explore every category — sports, movies, news, kids, music, and international networks from 150+ countries.</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-8 mx-auto max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search channels..." className="h-12 pl-11 rounded-full shadow-soft" />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-16">
        <Reveal><h2 className="text-2xl font-extrabold mb-6">Browse by category</h2></Reveal>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.name} delay={i * 50}>
              <div className="group rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-glow hover:-translate-y-1 hover:border-primary/30 transition-all cursor-pointer">
                <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-hero shadow-glow group-hover:scale-110 transition-transform`}>
                  <c.icon className="h-6 w-6 text-white" />
                </div>
                <div className="mt-4 font-bold">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.count} channels</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-24">
        <Reveal><h2 className="text-2xl font-extrabold mb-6">Popular channels</h2></Reveal>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((c, i) => (
            <Reveal key={c} delay={Math.min(i * 30, 300)}>
              <div className="aspect-video rounded-2xl bg-card border border-border shadow-soft grid place-items-center font-extrabold text-lg gradient-text hover:shadow-glow hover:-translate-y-1 transition-all cursor-pointer">
                {c}
              </div>
            </Reveal>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground mt-10">No channels match your search.</p>}

        <Reveal delay={200}>
          <div className="mt-16 text-center rounded-3xl bg-gradient-hero p-10 text-primary-foreground shadow-glow">
            <h3 className="text-2xl md:text-3xl font-extrabold">See the full channel list</h3>
            <p className="mt-3 text-white/90">Start your free trial and unlock the complete guide.</p>
            <Button asChild className="mt-6 rounded-full bg-white text-primary hover:bg-white/95"><Link to="/signup">Start Free Trial</Link></Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
