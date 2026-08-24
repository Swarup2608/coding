"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Badge from "@/components/ui/Badge";
import { submissionStatusTone } from "@/lib/badges";

interface AdminSubmission {
  _id: string;
  userId: { username: string; email: string } | null;
  problemId: { title: string; slug: string; difficulty: string } | null;
  language: string;
  mode: string;
  status: string;
  passedTests: number;
  totalTests: number;
  runtimeMs?: number;
  createdAt: string;
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubmissions() {
      const response = await apiRequest<{ success: boolean; data: AdminSubmission[] }>("/submissions/admin/all");
      setSubmissions(response.data);
      setLoading(false);
    }

    loadSubmissions();
  }, []);

  if (loading) {
    return <main className="p-10 text-fg-muted">Loading submissions...</main>;
  }

  return (
    <main className="p-10">
      <h1 className="mb-8 text-3xl font-bold">All Submissions</h1>
      <p className="mb-4 text-sm text-fg-muted">Showing the most recent 200 submissions across all users.</p>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full">
          <thead className="bg-surface-hover">
            <tr>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">User</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Problem</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Language</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Mode</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Status</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Tests</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Runtime</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id} className="border-t border-border bg-surface transition-colors hover:bg-surface-hover">
                <td className="p-4">{submission.userId?.username ?? "-"}</td>
                <td className="p-4">{submission.problemId?.title ?? "-"}</td>
                <td className="p-4 text-fg-muted">{submission.language}</td>
                <td className="p-4 text-fg-muted">{submission.mode}</td>
                <td className="p-4"><Badge tone={submissionStatusTone(submission.status)}>{submission.status.replaceAll("_", " ")}</Badge></td>
                <td className="p-4 text-fg-muted">{submission.passedTests}/{submission.totalTests}</td>
                <td className="p-4 text-fg-muted">{submission.runtimeMs ? `${submission.runtimeMs} ms` : "-"}</td>
                <td className="p-4 text-fg-muted">{new Date(submission.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
