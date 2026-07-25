import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { GlowBackdrop } from "@/components/glow-backdrop";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ZYVO IPTV" },
      { name: "description", content: "ZYVO IPTV subscription plans from £9.99. Choose 1, 3, 6 months or 1 year — 7000+ channels, 40000+ VOD, HD/FHD/UHD and 24/7 support." },
      { property: "og:title", content: "Pricing — ZYVO IPTV" },
      { property: "og:description", content: "1, 3, 6 months and yearly IPTV plans. Best value on the 6 Months plan." },
      { property: "og:url", content: "https://azure-view-global.lovable.app/pricing" },
    ],
    links: [{ rel: "canonical", href: "https://azure-view-global.lovable.app/pricing" }],
  }),
  component: PricingPage,
});

const sharedFeatures = [
  "7000+ Channels",
  "40000+ VOD",
  "HD / FHD / UHD*",
  "UK / USA / IE / ASIAN",
  "TV Guide (EPG)",
  "ALL SPORTS AVAILABLE",
  "24/7 Live Chat Support",
];

const plans = [
  { name: "1 Month", price: "9.99", period: "month", extra: "5 for Extra Device" },
  { name: "3 Months", price: "25", period: "3 months", extra: "10 for Extra Device" },
  { name: "6 Months", price: "40", period: "6 months", extra: "20 for Extra Device", popular: true },
  { name: "1 Year", price: "65", period: "year", extra: "30 for Extra Device" },
];

function PricingPage() {
  return (
    <div className="relative">
      <GlowBackdrop />
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-24 pb-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Best value on the 6 Months plan
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold">Pick your plan</h1>
            <p className="mt-4 text-muted-foreground">Simple, transparent pricing. Cancel anytime.</p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <div className={`relative flex h-full flex-col rounded-3xl border p-8 transition-all hover:-translate-y-1 ${p.popular ? "border-primary/40 bg-gradient-hero text-primary-foreground shadow-glow" : "border-border bg-card shadow-soft hover:shadow-glow"}`}>
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-soft">BEST VALUE</div>
                )}
                <div className={`text-sm font-semibold ${p.popular ? "text-white/90" : "text-primary"}`}>{p.name} Plan</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold">£{p.price}</span>
                  <span className={p.popular ? "text-white/80" : "text-muted-foreground"}>/ {p.period}</span>
                </div>

                <Button
                  asChild
                  className={`mt-6 w-full rounded-full ${p.popular ? "bg-white text-primary hover:bg-white/95" : "bg-gradient-hero border-0 text-primary-foreground shadow-glow"}`}
                >
                  <Link to="/signup">
                    Get Started <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>

                <ul className="mt-8 space-y-3 text-sm">
                  {sharedFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${p.popular ? "text-white" : "text-primary"}`} /> {f}
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${p.popular ? "text-white" : "text-primary"}`} /> {p.extra}
                  </li>
                </ul>

                <div className={`mt-6 text-[11px] ${p.popular ? "text-white/70" : "text-muted-foreground"}`}>
                  * UHD availability depends on source channel and your internet speed.
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <div className="mt-16 rounded-3xl border border-border bg-gradient-soft p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-extrabold">Need a custom plan?</h3>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Reseller plans, hotels, bars, and enterprise deployments — we have you covered.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild className="rounded-full bg-gradient-hero border-0 text-primary-foreground shadow-glow">
                <Link to="/contact">Contact sales</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-primary/30">
                <a href="mailto:jattbhutta321@gmail.com">jattbhutta321@gmail.com</a>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
