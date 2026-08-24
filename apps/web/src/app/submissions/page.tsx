"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Badge from "@/components/ui/Badge";
import { submissionStatusTone } from "@/lib/badges";

interface Submission {
  _id: string;
  problemId: { title: string; slug: string; difficulty: string };
  language: string;
  status: string;
  score: number;
  runtimeMs?: number;
  passedTests: number;
  totalTests: number;
  createdAt: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubmissions() {
      try {
        const response = await apiRequest<{ success: boolean; data: Submission[] }>("/submissions");
        setSubmissions(response.data);
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, []);

  if (loading) {
    return <main className="p-10 text-fg-muted">Loading submissions...</main>;
  }

  return (
    <main className="mx-auto w-full max-w-6xl p-10">
      <h1 className="mb-8 text-3xl font-bold">My Submissions</h1>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full">
          <thead className="bg-surface-hover">
            <tr>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Problem</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Language</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Status</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Tests</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Runtime</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id} className="border-t border-border bg-surface transition-colors hover:bg-surface-hover">
                <td className="p-4">
                  <Link href={`/problems/${submission.problemId.slug}`} className="font-medium text-accent hover:text-accent-hover">
                    {submission.problemId.title}
                  </Link>
                </td>
                <td className="p-4 text-fg-muted">{submission.language}</td>
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
