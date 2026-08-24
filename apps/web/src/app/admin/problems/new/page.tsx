"use client";

import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import ProblemForm, { emptyProblemForm, ProblemFormValues } from "@/components/admin/ProblemForm";

export default function NewProblemPage() {
  const router = useRouter();

  async function handleCreate(values: ProblemFormValues) {
    const response = await apiRequest<{ success: boolean; data: { slug: string } }>("/problems", {
      method: "POST",
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        difficulty: values.difficulty,
        status: values.status,
        tags: values.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        constraints: values.constraints.split("\n").map((line) => line.trim()).filter(Boolean),
        examples: values.examples.filter((example) => example.input || example.output),
        starterCode: values.starterCode,
        timeLimit: values.timeLimit,
        memoryLimit: values.memoryLimit,
      }),
    });

    router.push(`/admin/problems/${response.data.slug}`);
  }

  return (
    <main className="p-10">
      <h1 className="mb-8 text-3xl font-bold">New Problem</h1>
      <ProblemForm initialValues={emptyProblemForm} submitLabel="Create Problem" onSubmit={handleCreate} />
    </main>
  );
}
