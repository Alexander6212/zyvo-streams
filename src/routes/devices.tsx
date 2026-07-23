import { createFileRoute } from "@tanstack/react-router";
import { Tv2, Smartphone, Monitor, Tv, Cast, HardDrive, Check, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { GlowBackdrop } from "@/components/glow-backdrop";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/devices")({
  head: () => ({
    meta: [
      { title: "Supported Devices — ZYVO IPTV" },
      { name: "description", content: "ZYVO IPTV runs on Smart TV, Android TV, Fire TV, iOS, Android, Windows, Mac, and MAG devices. Setup in minutes." },
      { property: "og:title", content: "Supported Devices — ZYVO IPTV" },
      { property: "og:description", content: "Compatible with every major streaming device." },
    ],
  }),
  component: DevicesPage,
});

const devices = [
  { icon: Tv2, name: "Smart TV", desc: "Samsung, LG, Sony — native app on Tizen and webOS.", features: ["4K support", "Voice remote", "EPG guide"] },
  { icon: Cast, name: "Android TV", desc: "Google TV, Nvidia Shield, TCL, and more.", features: ["Native app", "Chromecast built-in", "Google Assistant"] },
  { icon: Tv, name: "Fire TV", desc: "Amazon Fire TV Stick, Cube, and Fire TV Edition sets.", features: ["1-click install", "Alexa control", "4K HDR"] },
  { icon: Smartphone, name: "iOS & Android", desc: "iPhone, iPad, and every modern Android phone or tablet.", features: ["Download & watch", "Chromecast", "Picture-in-picture"] },
  { icon: Monitor, name: "Windows & Mac", desc: "Desktop apps for Windows 10/11 and macOS.", features: ["4K playback", "Multi-window", "Hardware acceleration"] },
  { icon: HardDrive, name: "MAG Devices", desc: "MAG 250/254/322/420/424 and Infomir set-top boxes.", features: ["Portal ready", "Instant provisioning", "EPG support"] },
];

function DevicesPage() {
  return (
    <div className="relative">
      <GlowBackdrop />
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-24 pb-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold">Watch on <span className="gradient-text">every device</span></h1>
            <p className="mt-5 text-muted-foreground">ZYVO IPTV works natively on every major streaming device — no complicated setup, no compatibility headaches.</p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {devices.map((d, i) => (
            <Reveal key={d.name} delay={i * 60}>
              <div className="group h-full rounded-3xl border border-border bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow hover:border-primary/30">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-hero shadow-glow group-hover:scale-110 transition-transform">
                  <d.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mt-5 text-xl font-bold">{d.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d.desc}</p>
                <ul className="mt-5 space-y-2">
                  {d.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" className="mt-6 px-0 hover:bg-transparent text-primary">
                  Setup guide <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
