"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Badge from "@/components/ui/Badge";

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  rating: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      const response = await apiRequest<{ success: boolean; data: AdminUser[] }>("/users");
      setUsers(response.data);
      setLoading(false);
    }

    loadUsers();
  }, []);

  if (loading) {
    return <main className="p-10 text-fg-muted">Loading users...</main>;
  }

  return (
    <main className="p-10">
      <h1 className="mb-8 text-3xl font-bold">Users</h1>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full">
          <thead className="bg-surface-hover">
            <tr>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Username</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Email</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Role</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Rating</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-fg-muted">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-border bg-surface transition-colors hover:bg-surface-hover">
                <td className="p-4 font-medium">{user.username}</td>
                <td className="p-4 text-fg-muted">{user.email}</td>
                <td className="p-4"><Badge tone={user.role === "ADMIN" ? "info" : "neutral"}>{user.role}</Badge></td>
                <td className="p-4 text-fg-muted">{user.rating}</td>
                <td className="p-4 text-fg-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
