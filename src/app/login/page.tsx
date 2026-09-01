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
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
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
      <h1 className="font-serif text-4xl">Admin login</h1>
      <p className="mt-2 text-sm text-slate-600">
        Use ADMIN_EMAIL and ADMIN_PASSWORD from Hostinger environment variables.
      </p>
      <form onSubmit={onSubmit} className="card mt-6 space-y-3 p-6">
        <input name="email" type="email" required placeholder="Email" className="input" />
        <input name="password" type="password" required placeholder="Password" className="input" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn w-full" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}
