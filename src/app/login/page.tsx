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
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md space-y-6 p-8 sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-slate-800 bg-dark-900 text-2xl font-black text-brand-600">G.</div>
          <h2 className="mt-3 font-heading text-2xl font-extrabold">Writer Desk Access</h2>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider">Email Address</label>
            <input name="email" type="email" required className="input" placeholder="admin@globalcareerhub.org" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider">Password</label>
            <input name="password" type="password" required className="input" />
          </div>
          {error && <p className="text-sm text-brand-600">{error}</p>}
          <button className="btn w-full" type="submit">Sign In to Portal</button>
        </form>
      </div>
    </div>
  );
}
