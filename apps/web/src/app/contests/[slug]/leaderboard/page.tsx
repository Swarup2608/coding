"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import ContestNav from "@/components/contest/ContestNav";

interface ProblemResult {
  label: string;
  solved: boolean;
  attempts: number;
  penaltyMinutes: number;
}

interface LeaderboardEntry {
  userId: string;
  username: string;
  rank: number;
  totalSolved: number;
  totalPenalty: number;
  problems: ProblemResult[];
}

export default function ContestLeaderboardPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await apiRequest<{ success: boolean; data: LeaderboardEntry[] }>(`/contests/${slug}/leaderboard`);
        setEntries(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  if (loading) {
    return (
      <>
        <ContestNav slug={slug} />
        <main className="p-10 text-fg-muted">Loading leaderboard...</main>
      </>
    );
  }

  const labels = entries[0]?.problems.map((p) => p.label) ?? [];

  return (
    <>
      <ContestNav slug={slug} />
      <main className="mx-auto w-full max-w-5xl p-10">
      <h1 className="mb-8 text-3xl font-bold">Leaderboard</h1>

      {error && <p className="text-sm text-rose-500">{error}</p>}
      {!error && entries.length === 0 && <p className="text-fg-muted">No registered participants yet.</p>}

      {entries.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead className="bg-surface-hover">
              <tr>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Rank</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">User</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Solved</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Penalty</th>
                {labels.map((label) => (
                  <th key={label} className="p-4 text-center text-xs font-semibold uppercase tracking-wide text-fg-muted">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.userId} className="border-t border-border bg-surface transition-colors hover:bg-surface-hover">
                  <td className="p-4 font-semibold">{entry.rank}</td>
                  <td className="p-4 font-medium">{entry.username}</td>
                  <td className="p-4 text-fg-muted">{entry.totalSolved}</td>
                  <td className="p-4 text-fg-muted">{entry.totalPenalty}</td>
                  {entry.problems.map((problem) => (
                    <td key={problem.label} className="p-4 text-center">
                      {problem.solved ? (
                        <div className="text-emerald-600 dark:text-emerald-400">
                          <div className="font-semibold">+{problem.attempts > 1 ? problem.attempts - 1 : ""}</div>
                          <div className="text-xs text-fg-muted">{problem.penaltyMinutes}m</div>
                        </div>
                      ) : problem.attempts > 0 ? (
                        <div className="font-semibold text-rose-600 dark:text-rose-400">-{problem.attempts}</div>
                      ) : (
                        <div className="text-fg-muted">-</div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </main>
    </>
  );
}
