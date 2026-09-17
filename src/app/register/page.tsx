import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration closed",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="font-heading text-3xl font-extrabold">Registration closed</h1>
      <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
        Public publisher sign-up is disabled. If you need an account, contact the
        site admin.
      </p>
      <Link href="/login" className="btn mt-6 inline-flex">
        Log in
      </Link>
    </div>
  );
}
