"use client";

import { useEffect, useState } from "react";
import { onAuth, type User } from "@/lib/firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuth(async (u) => {
      setUser(u);
      if (u) {
        const tokenResult = await u.getIdTokenResult();
        setIsAdmin(tokenResult.claims.role === "admin");
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading, isAuthenticated: !!user, isAdmin };
}
