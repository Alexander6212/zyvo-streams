import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/reveal";
import { GlowBackdrop } from "@/components/glow-backdrop";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — ZYVO IPTV" },
      { name: "description", content: "Create your ZYVO IPTV account and start your free trial — 20,000+ channels and 60,000+ VOD titles." },
      { property: "og:title", content: "Sign Up — ZYVO IPTV" },
      { property: "og:description", content: "Create your account and start streaming in 30 seconds." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Account form ready", { description: "Connect Supabase to activate sign-up." });
    }, 700);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] grid place-items-center px-4 py-16">
      <GlowBackdrop />
      <Reveal className="relative w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <div className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-hero shadow-glow">
              <Zap className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="mt-4 text-2xl font-extrabold">Start your free trial</h1>
            <p className="mt-1 text-sm text-muted-foreground">No credit card required</p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" required placeholder="John Doe" className="pl-9 h-11 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" required placeholder="you@example.com" className="pl-9 h-11 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={show ? "text" : "password"} required placeholder="At least 8 characters" className="pl-9 pr-10 h-11 rounded-xl" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary" aria-label="Toggle password">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="confirm" type="password" required placeholder="••••••••" className="pl-9 h-11 rounded-xl" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-gradient-hero border-0 text-primary-foreground shadow-glow hover:opacity-95">
              {loading ? "Creating..." : "Create Account"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By continuing you agree to our <a href="#" className="text-primary hover:underline">Terms</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">Login</Link>
          </p>
        </div>
      </Reveal>
    </div>
  );
}
