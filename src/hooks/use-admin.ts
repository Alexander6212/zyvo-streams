import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export function useIsAdmin() {
  const { user: sessionUser, loading: authLoading } = useAuth();
  const [verifiedUser, setVerifiedUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (authLoading) {
      setIsAdmin(null);
      return () => { cancelled = true; };
    }

    setIsAdmin(null);

    (async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (cancelled) return;

      const currentUser = authError ? null : authData.user;
      setVerifiedUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", currentUser.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!cancelled) setIsAdmin(data?.role === "admin");
    })();

    return () => { cancelled = true; };
  }, [sessionUser?.id, authLoading]);


  return { isAdmin, loading: authLoading || isAdmin === null, user: verifiedUser ?? sessionUser };
}
