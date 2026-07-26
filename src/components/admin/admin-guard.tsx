import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useIsAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin, loading, user } = useIsAdmin();

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-sm text-muted-foreground">
        Loading admin…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">Admin access required</h1>
          <p className="text-muted-foreground text-sm">Please sign in with an authorized admin account.</p>
          <Button asChild className="rounded-full bg-gradient-hero border-0 text-primary-foreground shadow-glow">
            <Link to="/login">Go to login</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">403 — Not authorized</h1>
          <p className="text-muted-foreground text-sm">Your account does not have admin permissions.</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/">Back to site</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
