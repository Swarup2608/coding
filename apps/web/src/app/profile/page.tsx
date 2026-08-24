"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

interface ProfileData {
  user: { username: string; email: string; role: string; createdAt: string };
  stats: {
    solvedProblems: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const response = await apiRequest<{ success: boolean; data: ProfileData }>("/users/me");
      setProfile(response.data);
    }

    loadProfile();
  }, []);

  if (!profile) {
    return <main className="p-10 text-fg-muted">Loading profile...</main>;
  }

  const { user, stats } = profile;
  const acceptanceRate = stats.totalSubmissions === 0 ? 0 : Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100);

  return (
    <main className="mx-auto w-full max-w-5xl p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="mt-2 text-fg-muted">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Solved" value={stats.solvedProblems} />
        <StatCard label="Easy" value={stats.easySolved} accent="text-emerald-600 dark:text-emerald-400" />
        <StatCard label="Medium" value={stats.mediumSolved} accent="text-amber-600 dark:text-amber-400" />
        <StatCard label="Hard" value={stats.hardSolved} accent="text-rose-600 dark:text-rose-400" />
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-semibold">Submission Statistics</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-fg-muted">Total submissions</span>
              <span className="font-medium">{stats.totalSubmissions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Accepted</span>
              <span className="font-medium">{stats.acceptedSubmissions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-fg-muted">Acceptance rate</span>
              <span className="font-medium">{acceptanceRate}%</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="font-semibold">Progress</h2>
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-fg-muted">Problems solved</span>
              <span className="font-medium">{stats.solvedProblems}</span>
            </div>
            <div className="h-3 overflow-hidden rounded bg-surface-hover">
              <div className="h-full bg-accent" style={{ width: `${Math.min(stats.solvedProblems, 100)}%` }} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="text-sm text-fg-muted">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${accent ?? ""}`}>{value}</div>
    </div>
  );
}
