"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Badge from "@/components/ui/Badge";
import { contestPhaseTone } from "@/lib/badges";
import { getContestPhase } from "@/types/contest";

interface AdminContest {
  _id: string;
  title: string;
  slug: string;
  status: string;
  startTime: string;
  endTime: string;
  problems: unknown[];
  createdBy: { username: string } | null;
}

export default function AdminContestsPage() {
  const [contests, setContests] = useState<AdminContest[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadContests() {
    setLoading(true);
    const response = await apiRequest<{ success: boolean; data: AdminContest[] }>("/contests/admin/all");
    setContests(response.data);
    setLoading(false);
  }

  useEffect(() => {
    loadContests();
  }, []);

  async function handleDelete(slug: string) {
    if (!confirm(`Delete "${slug}"? This can't be undone.`)) {
      return;
    }

    await apiRequest(`/contests/${slug}`, { method: "DELETE" });
    loadContests();
  }

  if (loading) {
    return <main className="p-10 text-fg-muted">Loading contests...</main>;
  }

  return (
    <main className="p-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contests</h1>
        <Link href="/contests/new" className="rounded-md bg-accent px-5 py-2 font-medium text-accent-fg transition-colors hover:bg-accent-hover">New Contest</Link>
      </div>
      <p className="mb-4 text-sm text-fg-muted">All contests across every user. As an admin you can edit or delete any of them.</p>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full">
          <thead className="bg-surface-hover">
            <tr>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Title</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Creator</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Status</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Phase</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Problems</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Window</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((contest) => (
              <tr key={contest._id} className="border-t border-border bg-surface transition-colors hover:bg-surface-hover">
                <td className="p-4 font-medium">{contest.title}</td>
                <td className="p-4 text-fg-muted">{contest.createdBy?.username ?? "-"}</td>
                <td className="p-4"><Badge tone={contest.status === "PUBLISHED" ? "success" : "warning"}>{contest.status}</Badge></td>
                <td className="p-4"><Badge tone={contestPhaseTone(getContestPhase(contest))}>{getContestPhase(contest)}</Badge></td>
                <td className="p-4 text-fg-muted">{contest.problems.length}</td>
                <td className="p-4 text-fg-muted">{new Date(contest.startTime).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="flex gap-4 text-sm">
                    <Link href={`/contests/${contest.slug}/manage`} className="font-medium text-accent hover:text-accent-hover">Manage</Link>
                    {contest.status === "DRAFT" && (
                      <button onClick={() => handleDelete(contest.slug)} className="font-medium text-rose-600 hover:text-rose-500 dark:text-rose-400">Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
