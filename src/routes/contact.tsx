import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageCircle, Send, Clock, MessagesSquare } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { GlowBackdrop } from "@/components/glow-backdrop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Support — ZYVO IPTV" },
      { name: "description", content: "Get 24/7 support from ZYVO IPTV via WhatsApp, Telegram, live chat, or email." },
      { property: "og:title", content: "Contact & Support — ZYVO IPTV" },
      { property: "og:description", content: "24/7 support via WhatsApp, Telegram, live chat, or email." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); toast.success("Message sent", { description: "Our team will get back to you shortly." }); }, 700);
  };

  return (
    <div className="relative">
      <GlowBackdrop />
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-24 pb-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold">We're <span className="gradient-text">here 24/7</span></h1>
            <p className="mt-5 text-muted-foreground">Pick your favorite channel — our team responds fast, any day of the week.</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {[
            { icon: MessageCircle, title: "WhatsApp", desc: "Chat instantly", cta: "Open chat", href: "https://wa.me/10000000000", color: "#25D366" },
            { icon: Send, title: "Telegram", desc: "Join our support group", cta: "Open Telegram", href: "https://t.me/zyvoiptv", color: "#0088cc" },
            { icon: MessagesSquare, title: "Live Chat", desc: "Powered by Tawk.to", cta: "Start chat", href: "#tawk-to", color: "#00BFFF" },
            { icon: Mail, title: "Email", desc: "jattbhutta321@gmail.com", cta: "Send email", href: "mailto:jattbhutta321@gmail.com", color: "#00E5FF" },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="block h-full rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow hover:border-primary/30">
                <div className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow-glow" style={{ background: `linear-gradient(135deg, ${c.color}, #00E5FF)` }}>
                  <c.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-bold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                <div className="mt-4 text-sm font-semibold text-primary">{c.cta} →</div>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <div className="rounded-3xl border border-border bg-gradient-soft p-8">
              <h2 className="text-2xl font-extrabold">Send us a message</h2>
              <p className="mt-2 text-sm text-muted-foreground">Fill in the form and we'll reply within a few hours.</p>
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" required className="h-11 rounded-xl" /></div>
                  <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required className="h-11 rounded-xl" /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" required className="h-11 rounded-xl" /></div>
                <div className="space-y-2"><Label htmlFor="message">Message</Label><Textarea id="message" required rows={5} className="rounded-xl" /></div>
                <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-gradient-hero border-0 text-primary-foreground shadow-glow">{loading ? "Sending..." : "Send message"}</Button>
              </form>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-hero"><Clock className="h-5 w-5 text-white" /></div>
                  <h3 className="text-lg font-bold">Support hours</h3>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Our team is available <strong className="text-foreground">24 hours a day, 7 days a week</strong>. Average response time under 5 minutes on live chat and WhatsApp.</p>
              </div>
              <div id="tawk-to" className="rounded-3xl border border-border bg-gradient-hero p-8 text-primary-foreground shadow-glow">
                <h3 className="text-lg font-bold">Live chat</h3>
                <p className="mt-2 text-sm text-white/90">Tawk.to live chat widget can be embedded here. Add your Tawk.to property ID to enable it site-wide.</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-xs font-mono">Placeholder: TAWK_PROPERTY_ID</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
