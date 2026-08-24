import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main className="p-10">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/problems" className="rounded-xl border border-border bg-surface p-6 transition-colors hover:bg-surface-hover">
          <div className="font-semibold">Problems</div>
          <p className="mt-1 text-sm text-fg-muted">Create, edit, publish and archive problems.</p>
        </Link>
        <Link href="/admin/users" className="rounded-xl border border-border bg-surface p-6 transition-colors hover:bg-surface-hover">
          <div className="font-semibold">Users</div>
          <p className="mt-1 text-sm text-fg-muted">Browse registered users and their roles.</p>
        </Link>
        <Link href="/admin/submissions" className="rounded-xl border border-border bg-surface p-6 transition-colors hover:bg-surface-hover">
          <div className="font-semibold">Submissions</div>
          <p className="mt-1 text-sm text-fg-muted">Inspect submissions across every user.</p>
        </Link>
      </div>
    </main>
  );
}
