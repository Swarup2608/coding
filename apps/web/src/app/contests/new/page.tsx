"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";
import ContestForm, { emptyContestForm, ContestFormValues } from "@/components/contest/ContestForm";

export default function NewContestPage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  async function handleCreate(values: ContestFormValues) {
    const response = await apiRequest<{ success: boolean; data: { slug: string } }>("/contests", {
      method: "POST",
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
        status: values.status,
        problems: values.problems.map((p) => ({ problemId: p.problemId, label: p.label })),
      }),
    });

    router.push(`/contests/${response.data.slug}/manage`);
  }

  if (loading || !user) {
    return <main className="p-10 text-fg-muted">Loading...</main>;
  }

  return (
    <main className="p-10">
      <h1 className="mb-2 text-3xl font-bold">New Contest</h1>
      <p className="mb-8 text-sm text-fg-muted">Anyone can create and run their own contest. You'll be able to add contest-only problems after creating it.</p>
      <ContestForm initialValues={emptyContestForm} submitLabel="Create Contest" onSubmit={handleCreate} />
    </main>
  );
}
