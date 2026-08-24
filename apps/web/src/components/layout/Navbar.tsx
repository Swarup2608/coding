"use client";

import Link from "next/link";
import { useCurrentUser } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, loading } = useCurrentUser();

  async function handleLogout() {
    await apiRequest("/auth/logout", { method: "POST" });
    // Full navigation (not router.push) so Navbar's useCurrentUser refetches on mount.
    window.location.href = "/login";
  }

  return (
    <nav className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
      <div className="flex items-center gap-6 text-sm">
        <Link href="/problems" className="flex items-center gap-1.5 font-bold text-fg">
          <span className="text-accent">{"</>"}</span> CodePlatform
        </Link>
        <Link href="/problems" className="text-fg-muted transition-colors hover:text-fg">Problems</Link>
        <Link href="/contests" className="text-fg-muted transition-colors hover:text-fg">Contests</Link>
        {user && <Link href="/submissions" className="text-fg-muted transition-colors hover:text-fg">Submissions</Link>}
        {user && <Link href="/profile" className="text-fg-muted transition-colors hover:text-fg">Profile</Link>}
        {user?.role === "ADMIN" && <Link href="/admin" className="text-fg-muted transition-colors hover:text-fg">Admin</Link>}
      </div>
      <div className="flex items-center gap-3 text-sm">
        <ThemeToggle />
        {loading ? null : user ? (
          <button onClick={handleLogout} className="text-fg-muted transition-colors hover:text-fg">Logout</button>
        ) : (
          <Link href="/login" className="rounded-md bg-accent px-4 py-1.5 font-medium text-accent-fg transition-colors hover:bg-accent-hover">Login</Link>
        )}
      </div>
    </nav>
  );
}
