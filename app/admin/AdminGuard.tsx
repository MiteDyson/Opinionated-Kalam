"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    if (!isAdmin) { router.replace("/"); }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0f0f0f", fontFamily: "'Inter', sans-serif", color: "#444", fontSize: "0.85rem" }}>
        Checking access…
      </div>
    );
  }

  if (!user || !isAdmin) return null;
  return <>{children}</>;
}
