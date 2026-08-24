"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Contest, getContestPhase } from "@/types/contest";
import Badge from "@/components/ui/Badge";
import { contestPhaseTone } from "@/lib/badges";
import { useCurrentUser } from "@/lib/auth";

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useCurrentUser();

  useEffect(() => {
    async function loadContests() {
      try {
        const response = await apiRequest<{ success: boolean; data: Contest[] }>("/contests");
        setContests(response.data);
      } finally {
        setLoading(false);
      }
    }

    loadContests();
  }, []);

  if (loading) {
    return <main className="p-10 text-fg-muted">Loading contests...</main>;
  }

  return (
    <main className="mx-auto w-full max-w-5xl p-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contests</h1>
        {user && (
          <Link href="/contests/new" className="rounded-md bg-accent px-5 py-2 font-medium text-accent-fg transition-colors hover:bg-accent-hover">
            Create Contest
          </Link>
        )}
      </div>

      {contests.length === 0 && <p className="text-fg-muted">No contests are scheduled yet.</p>}

      <div className="space-y-3">
        {contests.map((contest) => {
          const phase = getContestPhase(contest);
          return (
            <Link
              key={contest._id}
              href={`/contests/${contest.slug}`}
              className="block rounded-xl border border-border bg-surface p-5 transition-colors hover:bg-surface-hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold">{contest.title}</h2>
                    <Badge tone={contestPhaseTone(phase)}>{phase}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-fg-muted">
                    {new Date(contest.startTime).toLocaleString()} &rarr; {new Date(contest.endTime).toLocaleString()}
                  </p>
                </div>
                <span className="text-sm text-fg-muted">{contest.problems.length} problem{contest.problems.length === 1 ? "" : "s"}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
