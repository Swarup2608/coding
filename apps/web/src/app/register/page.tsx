"use client";

import { useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    try {
      await apiRequest("/auth/register", { method: "POST", body: JSON.stringify({ username, email, password }) });
      // Full navigation (not router.push) so Navbar's useCurrentUser refetches on mount.
      window.location.href = "/problems";
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-page px-4">
      <form onSubmit={handleRegister} className="w-full max-w-96 rounded-xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Create an account</h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-md border border-border bg-page p-3 text-fg placeholder:text-fg-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-border bg-page p-3 text-fg placeholder:text-fg-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-border bg-page p-3 text-fg placeholder:text-fg-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <button type="submit" className="rounded-md bg-accent p-3 font-medium text-accent-fg transition-colors hover:bg-accent-hover">
            Register
          </button>

          <p className="text-center text-sm text-fg-muted">
            Already have an account? <Link href="/login" className="font-medium text-accent hover:text-accent-hover">Login</Link>
          </p>
        </div>
      </form>
    </main>
  );
}
