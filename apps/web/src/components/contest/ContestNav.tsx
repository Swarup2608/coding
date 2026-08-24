"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ContestNav({ slug }: { slug: string }) {
  const pathname = usePathname();

  const items = [
    { href: `/contests/${slug}`, label: "Overview" },
    { href: `/contests/${slug}/leaderboard`, label: "Leaderboard" },
  ];

  return (
    <nav className="flex gap-6 border-b border-border bg-surface px-6 py-3 text-sm">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={pathname === item.href ? "font-medium text-accent" : "text-fg-muted transition-colors hover:text-fg"}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
