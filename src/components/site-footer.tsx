import { Link } from "@tanstack/react-router";
import { Zap, Facebook, Twitter, Instagram, Youtube, Mail, MessageCircle, Send } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-gradient-soft">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero shadow-glow">
                <Zap className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-extrabold">ZYVO <span className="gradient-text">IPTV</span></span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Premium IPTV streaming. 20,000+ channels, 60,000+ VOD titles, crystal-clear quality on every device.
            </p>
            <div className="mt-5 flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background hover:text-primary hover:border-primary transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/channels" className="hover:text-primary">Live Channels</Link></li>
              <li><Link to="/vod" className="hover:text-primary">VOD Library</Link></li>
              <li><Link to="/devices" className="hover:text-primary">Supported Devices</Link></li>
              <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              <li><a href="#" className="hover:text-primary">Live Chat</a></li>
              <li><a href="mailto:support@zyvoiptv.com" className="hover:text-primary">Email</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="https://wa.me/10000000000" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </li>
              <li>
                <a href="https://t.me/zyvoiptv" target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary">
                  <Send className="h-4 w-4" /> Telegram
                </a>
              </li>
              <li>
                <a href="mailto:support@zyvoiptv.com" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary">
                  <Mail className="h-4 w-4" /> support@zyvoiptv.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ZYVO IPTV. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
