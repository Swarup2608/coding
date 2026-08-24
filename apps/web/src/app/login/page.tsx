"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    try {
      const result = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log(result);

      alert("Login successful");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login failed");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleLogin} className="flex w-96 flex-col gap-4">
        <h1 className="text-3xl font-bold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border p-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border p-3"
        />

        <button type="submit" className="rounded bg-black p-3 text-white">
          Login
        </button>
      </form>
    </main>
  );
}
