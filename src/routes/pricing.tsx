import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { GlowBackdrop } from "@/components/glow-backdrop";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ZYVO IPTV" },
      { name: "description", content: "Choose the perfect ZYVO IPTV subscription. Monthly and yearly plans from $9.99. Save up to 40% with yearly billing." },
      { property: "og:title", content: "Pricing — ZYVO IPTV" },
      { property: "og:description", content: "Simple monthly and yearly plans. Save up to 40% with yearly." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Basic",
    monthly: 9.99,
    yearly: 71.99,
    tagline: "Perfect for casual viewers",
    features: ["10,000+ live channels", "SD & HD quality", "1 device", "EPG program guide", "Email support"],
    missing: ["4K quality", "VOD library"],
  },
  {
    name: "Standard",
    monthly: 14.99,
    yearly: 107.99,
    tagline: "Our most popular plan",
    popular: true,
    features: ["20,000+ live channels", "60,000+ VOD titles", "Full HD quality", "2 devices simultaneously", "EPG + 7-day catch-up", "24/7 live chat support"],
    missing: ["4K Ultra HD"],
  },
  {
    name: "Premium",
    monthly: 19.99,
    yearly: 143.99,
    tagline: "For the ultimate experience",
    features: ["Everything in Standard", "4K Ultra HD channels", "5 devices simultaneously", "Priority 24/7 support", "Adult category (optional)", "Early access to new features"],
    missing: [],
  },
];

function PricingPage() {
  const [yearly, setYearly] = useState(false);

  const handleChoose = (plan: string) => {
    toast.success(`${plan} plan selected`, {
      description: "Checkout flow will be connected soon.",
    });
  };

  return (
    <div className="relative">
      <GlowBackdrop />
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-24 pb-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Save 40% with yearly billing
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold">Pick your plan</h1>
            <p className="mt-4 text-muted-foreground">Simple, transparent pricing. Cancel anytime.</p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-soft">
              <button
                onClick={() => setYearly(false)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${!yearly ? "bg-gradient-hero text-primary-foreground shadow-glow" : "text-foreground/70"}`}
              >Monthly</button>
              <button
                onClick={() => setYearly(true)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all flex items-center gap-2 ${yearly ? "bg-gradient-hero text-primary-foreground shadow-glow" : "text-foreground/70"}`}
              >
                Yearly
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${yearly ? "bg-white text-primary" : "bg-primary/10 text-primary"}`}>-40%</span>
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p, i) => {
            const price = yearly ? p.yearly : p.monthly;
            return (
              <Reveal key={p.name} delay={i * 100}>
                <div className={`relative h-full rounded-3xl border p-8 transition-all hover:-translate-y-1 ${p.popular ? "border-primary/40 bg-gradient-hero text-primary-foreground shadow-glow" : "border-border bg-card shadow-soft hover:shadow-glow"}`}>
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow-soft">MOST POPULAR</div>
                  )}
                  <div className={`text-sm font-semibold ${p.popular ? "text-white/90" : "text-primary"}`}>{p.name}</div>
                  <p className={`mt-1 text-sm ${p.popular ? "text-white/80" : "text-muted-foreground"}`}>{p.tagline}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold">${price}</span>
                    <span className={p.popular ? "text-white/80" : "text-muted-foreground"}>/{yearly ? "yr" : "mo"}</span>
                  </div>
                  {yearly && (
                    <div className={`mt-1 text-xs ${p.popular ? "text-white/80" : "text-muted-foreground"}`}>
                      ${(p.yearly / 12).toFixed(2)}/mo billed annually
                    </div>
                  )}
                  <Button
                    onClick={() => handleChoose(p.name)}
                    data-plan-id={p.name.toLowerCase()}
                    data-billing-cycle={yearly ? "yearly" : "monthly"}
                    className={`mt-6 w-full rounded-full ${p.popular ? "bg-white text-primary hover:bg-white/95" : "bg-gradient-hero border-0 text-primary-foreground shadow-glow"}`}
                  >
                    Choose {p.name} <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  <ul className="mt-8 space-y-3 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${p.popular ? "text-white" : "text-primary"}`} /> {f}
                      </li>
                    ))}
                    {p.missing.map((f) => (
                      <li key={f} className={`flex items-start gap-2 ${p.popular ? "text-white/60" : "text-muted-foreground/60"}`}>
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={300}>
          <div className="mt-16 rounded-3xl border border-border bg-gradient-soft p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-extrabold">Need a custom plan?</h3>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Reseller plans, hotels, bars, and enterprise deployments — we have you covered.</p>
            <Button asChild className="mt-6 rounded-full bg-gradient-hero border-0 text-primary-foreground shadow-glow">
              <Link to="/contact">Contact sales</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
