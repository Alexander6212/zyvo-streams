import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const links = [
  { to: "/", label: "Home" },
  { to: "/channels", label: "Channels" },
  { to: "/vod", label: "VOD" },
  { to: "/pricing", label: "Pricing" },
  { to: "/devices", label: "Devices" },
  { to: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign out failed", { description: error.message });
      return;
    }
    toast.success("Signed out");
    setOpen(false);
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero shadow-glow transition-transform group-hover:scale-110">
            <Zap className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            ZYVO <span className="gradient-text">IPTV</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  active ? "text-primary" : "text-foreground/70 hover:text-primary"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-hero" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-foreground/70 max-w-[180px] truncate" title={user.email ?? undefined}>
                {user.email}
              </span>
              <Button onClick={signOut} variant="outline" className="rounded-full gap-1.5">
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="rounded-full bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-95 border-0">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] sm:w-[380px]">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="mt-6 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base font-medium hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                {user ? (
                  <>
                    <p className="px-3 text-sm text-muted-foreground truncate">{user.email}</p>
                    <Button onClick={signOut} variant="outline" className="rounded-full gap-1.5">
                      <LogOut className="h-4 w-4" /> Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="rounded-full">
                      <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild className="rounded-full bg-gradient-hero text-primary-foreground border-0">
                      <Link to="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
