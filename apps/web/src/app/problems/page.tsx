"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Difficulty } from "@/types/problem";

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
    return <main className="p-10">Loading problems...</main>;
  }

  return (
    <main className="mx-auto max-w-5xl p-10">
      <h1 className="mb-8 text-3xl font-bold">Problems</h1>
      <div className="space-y-3">
        {problems.map((problem, index) => (
          <Link key={problem._id} href={`/problems/${problem.slug}`} className="block rounded-lg border p-5 transition hover:bg-gray-50">
            <div className="flex items-center gap-4">
              <span className="text-gray-500">{index + 1}.</span>
              <div className="flex-1">
                <h2 className="font-semibold">{problem.title}</h2>
                <div className="mt-2 flex gap-2">
                  {problem.tags.map((tag) => (
                    <span key={tag} className="rounded bg-gray-100 px-2 py-1 text-xs">{tag}</span>
                  ))}
                </div>
              </div>
              <span>{problem.difficulty}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
