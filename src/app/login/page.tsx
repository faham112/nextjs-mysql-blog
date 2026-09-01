"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "" }));
      setError(data.error || "Invalid email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }
  return (
    <div className="mx-auto max-w-md">
      <p className="text-xs uppercase tracking-[0.2em] text-accent">Writer desk</p>
      <h1 className="mt-2 font-serif text-4xl">Sign in to publish</h1>
      <p className="mt-2 text-sm text-slate-600">This page is only for Abdul Faheem. Readers do not need an account.</p>
      <form onSubmit={onSubmit} className="card mt-6 space-y-3 p-6">
        <input name="email" type="email" required placeholder="Writer email" className="input" />
        <input name="password" type="password" required placeholder="Password" className="input" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn w-full" type="submit">Enter dashboard</button>
      </form>
    </div>
  );
}
