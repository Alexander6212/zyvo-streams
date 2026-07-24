import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Reveal } from "@/components/reveal";
import { GlowBackdrop } from "@/components/glow-backdrop";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — ZYVO IPTV" },
      { name: "description", content: "Sign in to your ZYVO IPTV account and continue streaming premium live TV and VOD." },
      { property: "og:title", content: "Login — ZYVO IPTV" },
      { property: "og:description", content: "Sign in to your ZYVO IPTV account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/" });
  }, [user, authLoading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Login failed", { description: error.message });
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: "/" });
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
            <h1 className="mt-4 text-2xl font-extrabold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to continue streaming</p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 h-11 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={show ? "text" : "password"} required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 pr-10 h-11 rounded-xl" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary" aria-label="Toggle password">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <Checkbox id="remember" defaultChecked /> Remember me
              </label>
              <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-gradient-hero border-0 text-primary-foreground shadow-glow hover:opacity-95">
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </Reveal>
    </div>
  );
}
