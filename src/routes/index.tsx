import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Play, Tv, Film, Zap, Shield, Globe, Smartphone, Monitor, Tv2, Cast,
  Check, ChevronDown, Sparkles, Wifi, Clock, Star, ArrowRight, Radio, HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { GlowBackdrop } from "@/components/glow-backdrop";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZYVO IPTV — Premium Live TV & VOD Streaming" },
      { name: "description", content: "20,000+ live channels, 60,000+ VOD titles, 99.9% uptime. Stream in 4K on any device — start your free ZYVO IPTV trial today." },
      { property: "og:title", content: "ZYVO IPTV — Premium Live TV & VOD Streaming" },
      { property: "og:description", content: "20,000+ channels, 60,000+ VOD, 99.9% uptime. Stream anywhere, anytime." },
    ],
  }),
  component: HomePage,
});

function useCounter(target: number, duration = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setN(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const n = useCounter(value);
  return (
    <div className="text-center">
      <div className="text-3xl md:text-5xl font-extrabold gradient-text">
        {n.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-sm md:text-base text-muted-foreground">{label}</div>
    </div>
  );
}

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <GlowBackdrop />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-24 pb-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  New: 4K Ultra HD channels now live
                </div>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05]">
                  Your Entertainment. <br />
                  <span className="gradient-text">Anywhere. Anytime.</span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground">
                  Stream 20,000+ live channels and 60,000+ movies and shows in stunning HD & 4K.
                  Premium IPTV built for every screen — no buffering, no compromises.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button asChild size="lg" className="rounded-full bg-gradient-hero border-0 text-primary-foreground shadow-glow hover:opacity-95 h-12 px-7 text-base">
                    <Link to="/signup">
                      Start Free Trial <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-7 text-base border-primary/30 hover:bg-primary/5">
                    <Link to="/pricing">View Pricing</Link>
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={320}>
                <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> No credit card</div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Cancel anytime</div>
                  <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 24/7 support</div>
                </div>
              </Reveal>
            </div>

            {/* Visual */}
            <Reveal delay={200}>
              <div className="relative">
                <div className="relative rounded-3xl bg-gradient-hero p-1 shadow-glow">
                  <div className="rounded-[22px] bg-background p-4 md:p-6">
                    <div className="flex items-center gap-1.5 pb-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-hero animate-gradient">
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="grid h-20 w-20 place-items-center rounded-full bg-white/95 shadow-glow animate-pulse-glow">
                          <Play className="h-8 w-8 text-primary" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/95 text-xs">
                        <span className="rounded-full bg-black/40 backdrop-blur px-2.5 py-1 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE · 4K UHD
                        </span>
                        <span className="rounded-full bg-black/40 backdrop-blur px-2.5 py-1">CH 128</span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {["Sports", "Movies", "News", "Kids"].map((c, i) => (
                        <div key={c} className="rounded-xl bg-secondary p-2.5 text-center text-xs font-medium hover:bg-primary/10 transition-colors" style={{ animationDelay: `${i * 100}ms` }}>{c}</div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute -left-4 top-10 hidden sm:flex items-center gap-2 rounded-2xl bg-background shadow-card border border-border px-3 py-2 animate-float-slow">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-hero"><Wifi className="h-4 w-4 text-white" /></div>
                  <div><div className="text-xs font-semibold">99.9% Uptime</div><div className="text-[10px] text-muted-foreground">Ultra stable</div></div>
                </div>
                <div className="absolute -right-4 bottom-10 hidden sm:flex items-center gap-2 rounded-2xl bg-background shadow-card border border-border px-3 py-2 animate-float-slower">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-hero"><Shield className="h-4 w-4 text-white" /></div>
                  <div><div className="text-xs font-semibold">Secure Stream</div><div className="text-[10px] text-muted-foreground">Encrypted</div></div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Reveal><Stat value={20000} suffix="+" label="Live Channels" /></Reveal>
          <Reveal delay={100}><Stat value={60000} suffix="+" label="VOD Titles" /></Reveal>
          <Reveal delay={200}>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-extrabold gradient-text">99.9%</div>
              <div className="mt-2 text-sm md:text-base text-muted-foreground">Uptime</div>
            </div>
          </Reveal>
          <Reveal delay={300}><Stat value={150} suffix="+" label="Countries" /></Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-24">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">Why ZYVO</div>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">Built for the way you watch</h2>
            <p className="mt-4 text-muted-foreground">Everything you need for effortless premium streaming, all in one service.</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Sub-second channel switching with anti-freeze technology on every stream." },
            { icon: Tv, title: "4K Ultra HD", desc: "Watch top channels and blockbusters in stunning 4K clarity." },
            { icon: Globe, title: "Worldwide Content", desc: "150+ countries covered across sports, news, movies, and entertainment." },
            { icon: Shield, title: "Secure & Private", desc: "Fully encrypted streams and zero-log infrastructure keep you safe." },
            { icon: Clock, title: "7-Day Catch-up", desc: "Never miss your show — rewind up to a week on supported channels." },
            { icon: Radio, title: "EPG Guide", desc: "Full electronic program guide with schedules for every channel." },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow hover:border-primary/30">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-hero shadow-glow group-hover:scale-110 transition-transform">
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LIVE TV */}
      <section className="bg-gradient-soft border-y border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-24 grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE TV
              </div>
              <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">20,000+ live channels streaming right now</h2>
              <p className="mt-4 text-muted-foreground">Sports, news, entertainment, kids, and premium networks from every continent — with instant channel switching and a full EPG.</p>
              <ul className="mt-6 space-y-3">
                {["Premium sports packages", "International & local news", "Kids & family channels", "Music & lifestyle networks"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-sm"><Check className="h-4 w-4 text-primary" /> {t}</li>
                ))}
              </ul>
              <Button asChild className="mt-8 rounded-full bg-gradient-hero border-0 text-primary-foreground shadow-glow">
                <Link to="/channels">Explore Channels <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-3 gap-3">
              {["ESPN", "HBO", "SKY", "BEIN", "FOX", "BBC", "CNN", "MAX", "DAZN"].map((c, i) => (
                <div key={c} className="aspect-video rounded-2xl bg-card border border-border shadow-soft grid place-items-center font-extrabold text-xl gradient-text hover:shadow-glow hover:-translate-y-1 transition-all" style={{ animationDelay: `${i * 50}ms` }}>
                  {c}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* VOD */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-24 grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal delay={100} className="lg:order-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Film className="h-3.5 w-3.5" /> VIDEO ON DEMAND
            </div>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">60,000+ movies & series on demand</h2>
            <p className="mt-4 text-muted-foreground">The latest blockbusters, timeless classics, and binge-worthy series — updated daily and available in HD & 4K.</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border p-4"><div className="text-2xl font-extrabold gradient-text">4K</div><div className="text-xs text-muted-foreground mt-1">Ultra HD Quality</div></div>
              <div className="rounded-xl border border-border p-4"><div className="text-2xl font-extrabold gradient-text">Daily</div><div className="text-xs text-muted-foreground mt-1">New releases</div></div>
            </div>
            <Button asChild className="mt-8 rounded-full bg-gradient-hero border-0 text-primary-foreground shadow-glow">
              <Link to="/vod">Browse VOD <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </Reveal>
        <Reveal className="lg:order-1">
          <div className="grid grid-cols-3 gap-3">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="aspect-[2/3] rounded-2xl shadow-card overflow-hidden relative group cursor-pointer" style={{
                background: `linear-gradient(${135 + i*20}deg, oklch(0.72 0.18 235), oklch(0.85 0.16 200))`
              }}>
                <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                  <Play className="h-8 w-8 text-white" fill="currentColor" />
                </div>
                <div className="absolute bottom-2 left-2 right-2 text-[10px] font-semibold text-white/90 flex items-center gap-1">
                  <Star className="h-3 w-3" fill="currentColor" /> 8.{i}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* DEVICES */}
      <section className="bg-gradient-soft border-y border-border">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-24">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold">Watch on any device</h2>
              <p className="mt-4 text-muted-foreground">ZYVO IPTV works seamlessly across every major platform and device.</p>
            </div>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Tv2, label: "Smart TV" },
              { icon: Cast, label: "Android TV" },
              { icon: Tv, label: "Fire TV" },
              { icon: Smartphone, label: "Mobile" },
              { icon: Monitor, label: "Windows" },
              { icon: Monitor, label: "Mac" },
              { icon: HardDrive, label: "MAG Devices" },
              { icon: Cast, label: "Chromecast" },
            ].map((d, i) => (
              <Reveal key={d.label} delay={i * 50}>
                <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft hover:shadow-glow hover:-translate-y-1 hover:border-primary/30 transition-all">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-hero shadow-glow">
                    <d.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="mt-4 text-sm font-semibold">{d.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="rounded-full border-primary/30">
              <Link to="/devices">See setup guides <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold">Simple, transparent pricing</h2>
            <p className="mt-4 text-muted-foreground">One subscription. Everything included. Cancel anytime.</p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { name: "Basic", price: "9.99", features: ["10,000+ channels", "SD & HD quality", "1 device", "Email support"] },
            { name: "Standard", price: "14.99", popular: true, features: ["20,000+ channels", "60,000+ VOD", "Full HD quality", "2 devices", "24/7 support"] },
            { name: "Premium", price: "19.99", features: ["Everything in Standard", "4K Ultra HD", "5 devices", "Priority support", "Adult category"] },
          ].map((p, i) => (
            <Reveal key={p.name} delay={i * 100}>
              <div className={`relative h-full rounded-3xl border p-8 transition-all hover:-translate-y-1 ${p.popular ? "border-primary/40 bg-gradient-hero text-primary-foreground shadow-glow" : "border-border bg-card shadow-soft hover:shadow-glow"}`}>
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-soft">MOST POPULAR</div>
                )}
                <div className={`text-sm font-semibold ${p.popular ? "text-white/90" : "text-primary"}`}>{p.name}</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold">${p.price}</span>
                  <span className={p.popular ? "text-white/80" : "text-muted-foreground"}>/mo</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className={`h-4 w-4 ${p.popular ? "text-white" : "text-primary"}`} /> {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className={`mt-8 w-full rounded-full ${p.popular ? "bg-white text-primary hover:bg-white/95" : "bg-gradient-hero border-0 text-primary-foreground shadow-glow"}`}>
                  <Link to="/pricing">Choose {p.name}</Link>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gradient-soft border-y border-border">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-24">
          <Reveal>
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-extrabold">Frequently asked</h2>
              <p className="mt-4 text-muted-foreground">Everything you need to know before starting your trial.</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Accordion type="single" collapsible className="mt-10 space-y-3">
              {[
                { q: "What is ZYVO IPTV?", a: "ZYVO IPTV is a premium internet TV service delivering 20,000+ live channels and 60,000+ VOD titles in HD and 4K on all your devices." },
                { q: "Do you offer a free trial?", a: "Yes — sign up for a 24-hour trial with no credit card required. Test the full channel list and VOD library before you commit." },
                { q: "What internet speed do I need?", a: "5 Mbps for HD, 25 Mbps for 4K. A stable wired or 5GHz Wi-Fi connection delivers the best experience." },
                { q: "Which devices are supported?", a: "Smart TVs, Android TV, Fire TV, iOS, Android, Windows, Mac, MAG devices, and Chromecast." },
                { q: "Can I cancel anytime?", a: "Absolutely. Cancel from your account at any time — no fees, no questions." },
              ].map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl border border-border bg-card px-5 shadow-soft">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="rounded-full border-primary/30"><Link to="/faq">View all FAQs</Link></Button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-hero p-10 md:p-16 text-center text-primary-foreground shadow-glow">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-white/20 blur-3xl animate-float-slow" />
              <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/20 blur-3xl animate-float-slower" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-extrabold">Ready to experience premium streaming?</h2>
              <p className="mt-4 text-white/90 max-w-xl mx-auto">Join thousands watching ZYVO IPTV every day. Start your free trial in 30 seconds.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="rounded-full bg-white text-primary hover:bg-white/95 h-12 px-7 text-base">
                  <Link to="/signup">Start Free Trial <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 h-12 px-7 text-base">
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
