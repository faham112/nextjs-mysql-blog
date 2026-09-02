"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.get("name"), email: form.get("email"), password: form.get("password") }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setError(data.error || "Could not create account."); return; }
    router.push("/dashboard");
    router.refresh();
  }
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-heading text-3xl font-extrabold">Become a publisher</h1>
      <p className="mt-2 text-sm text-slate-600">Create your own login. The admin email cannot be used here.</p>
      <form onSubmit={onSubmit} className="card mt-6 space-y-3 p-6">
        <input name="name" required placeholder="Full name" className="input" />
        <input name="email" type="email" required placeholder="Email" className="input" />
        <input name="password" type="password" minLength={8} required placeholder="Password (8+ characters)" className="input" />
        {error && <p className="text-sm text-brand-600">{error}</p>}
        <button className="btn w-full" type="submit">Create publisher account</button>
      </form>
      <p className="mt-4 text-sm text-slate-500">Already have an account? <Link href="/login" className="font-bold text-brand-600">Log in</Link></p>
    </div>
  );
}
