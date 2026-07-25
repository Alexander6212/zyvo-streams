import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { GlowBackdrop } from "@/components/glow-backdrop";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — ZYVO IPTV" },
      { name: "description", content: "Answers to common questions about ZYVO IPTV: pricing, devices, quality, trials, and setup." },
      { property: "og:title", content: "FAQ — ZYVO IPTV" },
      { property: "og:description", content: "Everything you need to know about ZYVO IPTV." },
    ],
  }),
  component: FaqPage,
});

const sections = [
  {
    title: "Getting started",
    items: [
      { q: "What is ZYVO IPTV?", a: "ZYVO IPTV is a premium internet TV service streaming 20,000+ live channels and 60,000+ movies and shows in HD and 4K on every device." },
      { q: "How do I sign up?", a: "Click 'Start Free Trial', enter your details, and you'll get instant access to your personal dashboard with M3U links, EPG, and setup guides." },
      { q: "Do you offer a free trial?", a: "Yes — a 24-hour trial with full access to channels and VOD, no credit card required." },
    ],
  },
  {
    title: "Billing & subscriptions",
    items: [
      { q: "What payment methods do you accept?", a: "We accept major credit and debit cards, PayPal, and cryptocurrency. All payments are processed securely." },
      { q: "Can I cancel anytime?", a: "Yes. You can cancel your subscription from your account at any time without penalty." },
      { q: "Do you offer refunds?", a: "We offer a 7-day satisfaction guarantee on all new subscriptions. See our refund policy for details." },
    ],
  },
  {
    title: "Technical & devices",
    items: [
      { q: "What internet speed do I need?", a: "5 Mbps for HD, 15 Mbps for Full HD, and 25 Mbps for 4K Ultra HD. Wired connection or 5GHz Wi-Fi is recommended." },
      { q: "Which devices are supported?", a: "Smart TVs (Samsung, LG, Sony), Android TV, Fire TV, iOS, Android, Windows, Mac, MAG devices, and Chromecast." },
      { q: "Can I watch on multiple devices?", a: "Yes — Standard supports 2 simultaneous devices, Premium supports 5." },
      { q: "Do you support 4K streaming?", a: "Yes, premium 4K UHD channels and VOD are included with the Premium plan." },
    ],
  },
  {
    title: "Content",
    items: [
      { q: "What channels are included?", a: "Sports, movies, series, news, kids, documentaries, music, and international networks from 150+ countries." },
      { q: "Is VOD content updated?", a: "Yes, our VOD library is updated daily with the latest releases." },
      { q: "Do you offer PPV events?", a: "Selected pay-per-view sports and boxing events are available add-ons for Premium subscribers." },
    ],
  },
];

function FaqPage() {
  return (
    <div className="relative">
      <GlowBackdrop />
      <section className="relative mx-auto max-w-3xl px-4 md:px-6 pt-16 md:pt-24 pb-20">
        <Reveal>
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold">How can we <span className="gradient-text">help?</span></h1>
            <p className="mt-5 text-muted-foreground">Everything about ZYVO IPTV in one place.</p>
          </div>
        </Reveal>

        <div className="mt-14 space-y-10">
          {sections.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div>
                <h2 className="text-xl font-bold mb-4">{s.title}</h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {s.items.map((it, j) => (
                    <AccordionItem key={j} value={`${i}-${j}`} className="rounded-2xl border border-border bg-card px-5 shadow-soft">
                      <AccordionTrigger className="text-left font-semibold hover:no-underline">{it.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
