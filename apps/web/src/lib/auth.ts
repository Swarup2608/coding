"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "./api";

export interface CurrentUser {
  userId: string;
  username: string;
  role: "USER" | "ADMIN";
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await apiRequest<{ success: boolean; data: CurrentUser }>("/auth/me");
        if (!cancelled) setUser(response.data);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}
