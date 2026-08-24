"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Contest, getContestPhase } from "@/types/contest";
import Badge from "@/components/ui/Badge";
import { contestPhaseTone } from "@/lib/badges";
import ContestCountdown from "@/components/contest/ContestCountdown";
import ContestNav from "@/components/contest/ContestNav";

export default function ContestDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());

  async function loadContest() {
    setLoading(true);
    try {
      const response = await apiRequest<{ success: boolean; data: Contest }>(`/contests/${slug}`);
      setContest(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contest");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContest();
  }, [slug]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function handleRegister() {
    setRegistering(true);
    try {
      await apiRequest(`/contests/${slug}/register`, { method: "POST" });
      await loadContest();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register");
    } finally {
      setRegistering(false);
    }
  }

  if (loading) {
    return <main className="p-10 text-fg-muted">Loading...</main>;
  }

  if (!contest) {
    return <main className="p-10 text-fg-muted">{error || "Contest not found"}</main>;
  }

  const phase = getContestPhase(contest);
  const canOpenProblems = phase !== "UPCOMING" && contest.registered;

  return (
    <>
      <ContestNav slug={slug} />
      <main className="mx-auto w-full max-w-4xl p-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{contest.title}</h1>
          <Badge tone={contestPhaseTone(phase)}>{phase}</Badge>
        </div>
        {contest.isOwner && (
          <Link href={`/contests/${slug}/manage`} className="text-sm font-medium text-accent hover:text-accent-hover">Manage</Link>
        )}
      </div>

      <p className="text-sm text-fg-muted">
        {new Date(contest.startTime).toLocaleString()} &rarr; {new Date(contest.endTime).toLocaleString()}
      </p>

      {phase !== "ENDED" && (
        <div className="mt-4">
          <ContestCountdown
            key={now < new Date(contest.startTime).getTime() ? "start" : "end"}
            target={phase === "UPCOMING" ? contest.startTime : contest.endTime}
            label={phase === "UPCOMING" ? "Starts in" : "Ends in"}
          />
        </div>
      )}

      <p className="mt-6 whitespace-pre-line leading-relaxed">{contest.description}</p>

      <div className="mt-6 flex items-center gap-3">
        {phase !== "ENDED" && !contest.registered && (
          <button
            onClick={handleRegister}
            disabled={registering}
            className="rounded-md bg-accent px-5 py-2 font-medium text-accent-fg transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {registering ? "Registering..." : "Register"}
          </button>
        )}
        {contest.registered && <Badge tone="success">Registered</Badge>}
      </div>

      {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}

      <h2 className="mb-3 mt-10 text-lg font-semibold">Problems</h2>

      {!contest.registered && phase !== "ENDED" && (
        <p className="mb-3 text-sm text-fg-muted">Register to unlock the problems once the contest starts.</p>
      )}

      <div className="overflow-hidden rounded-xl border border-border">
        {contest.problems.map((cp, index) => {
          const problem = typeof cp.problemId === "string" ? null : cp.problemId;
          const row = (
            <div className="flex items-center gap-4 p-4">
              <span className="w-6 font-semibold text-fg-muted">{cp.label}</span>
              <span className="flex-1">{problem?.title ?? "Problem"}</span>
              {problem && <span className="text-xs text-fg-muted">{problem.difficulty}</span>}
            </div>
          );

          return (
            <div key={cp.label} className={index > 0 ? "border-t border-border" : ""}>
              {canOpenProblems && problem ? (
                <Link href={`/contests/${slug}/problems/${problem.slug}`} className="block bg-surface transition-colors hover:bg-surface-hover">
                  {row}
                </Link>
              ) : (
                <div className="bg-surface text-fg-muted">{row}</div>
              )}
            </div>
          );
        })}
      </div>
      </main>
    </>
  );
}
