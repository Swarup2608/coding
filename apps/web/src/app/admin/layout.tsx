"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/problems", label: "Problems" },
  { href: "/admin/contests", label: "Contests" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/submissions", label: "Submissions" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.replace("/problems");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "ADMIN") {
    return <main className="p-10 text-fg-muted">Checking access...</main>;
  }

  return (
    <div className="flex flex-1 bg-page">
      <aside className="w-56 shrink-0 border-r border-border bg-surface p-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Admin</p>
        <div className="space-y-1 text-sm">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 transition-colors ${active ? "bg-accent/10 font-medium text-accent" : "text-fg-muted hover:bg-surface-hover hover:text-fg"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </aside>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
