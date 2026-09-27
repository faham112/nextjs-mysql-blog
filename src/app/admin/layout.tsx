import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import AdminBottomNav from "@/components/AdminBottomNav";
import AdminTopBar from "@/components/AdminTopBar";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// viewport-fit=cover lets the bottom tab bar use env(safe-area-inset-bottom) on iOS
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/dashboard");
  return (
    <div className="adm min-h-screen">
      <AdminNav />
      <div className="flex min-h-screen flex-col md:pl-60">
        <AdminTopBar name={user.name} email={user.email} />
        <div className="a-main mx-auto w-full max-w-6xl flex-1 px-4 pt-5 sm:px-6 md:pt-8 lg:px-8">{children}</div>
      </div>
      <AdminBottomNav name={user.name} email={user.email} />
    </div>
  );
}
