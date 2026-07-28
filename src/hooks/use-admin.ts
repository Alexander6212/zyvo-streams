import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { checkCurrentUserIsAdmin } from "@/lib/admin.functions";
import { useAuth } from "./use-auth";

export function useIsAdmin() {
  const { user: sessionUser, loading: authLoading } = useAuth();
  const checkAdmin = useServerFn(checkCurrentUserIsAdmin);
  const [verifiedUser, setVerifiedUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (authLoading) {
      setIsAdmin(null);
      setCheckingAdmin(true);
      return () => { cancelled = true; };
    }

    setIsAdmin(null);
    setCheckingAdmin(true);

    (async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (cancelled) return;

      const currentUser = authError ? null : authData.user;
      setVerifiedUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      try {
        const result = await checkAdmin();
        if (!cancelled) {
          setIsAdmin(result.userId === currentUser.id && result.isAdmin);
        }
      } catch {
        if (!cancelled) setIsAdmin(false);
      } finally {
        if (!cancelled) setCheckingAdmin(false);
      }
    })();

    return () => { cancelled = true; };
  }, [sessionUser?.id, authLoading, checkAdmin]);


  return { isAdmin, loading: authLoading || checkingAdmin, user: verifiedUser ?? sessionUser };
}
