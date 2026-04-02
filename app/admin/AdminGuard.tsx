"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    if (user.email !== ADMIN_EMAIL) { router.replace("/"); }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0f0f0f", fontFamily: "'Inter', sans-serif", color: "#444", fontSize: "0.85rem" }}>
        Checking access…
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) return null;
  return <>{children}</>;
}
