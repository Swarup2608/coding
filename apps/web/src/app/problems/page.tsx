"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Difficulty } from "@/types/problem";
import Badge from "@/components/ui/Badge";
import { difficultyTone } from "@/lib/badges";

interface ProblemListItem {
  _id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  tags: string[];
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProblems() {
      try {
        const result = await apiRequest<{ success: boolean; data: ProblemListItem[] }>("/problems");
        setProblems(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProblems();
  }, []);

  if (loading) {
    return <main className="p-10 text-fg-muted">Loading problems...</main>;
  }

  return (
    <main className="mx-auto w-full max-w-5xl p-10">
      <h1 className="mb-8 text-3xl font-bold">Problems</h1>
      <div className="overflow-hidden rounded-xl border border-border">
        {problems.map((problem, index) => (
          <Link
            key={problem._id}
            href={`/problems/${problem.slug}`}
            className={`flex items-center gap-4 bg-surface p-5 transition-colors hover:bg-surface-hover ${index > 0 ? "border-t border-border" : ""}`}
          >
            <span className="text-fg-muted">{index + 1}.</span>
            <div className="flex-1">
              <h2 className="font-semibold">{problem.title}</h2>
              <div className="mt-2 flex gap-2">
                {problem.tags.map((tag) => (
                  <span key={tag} className="rounded bg-surface-hover px-2 py-1 text-xs text-fg-muted">{tag}</span>
                ))}
              </div>
            </div>
            <Badge tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</Badge>
          </Link>
        ))}
      </div>
    </main>
  );
}
