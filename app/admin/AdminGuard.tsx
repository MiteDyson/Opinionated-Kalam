"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ADMIN_EMAIL = "opinionatedkalam@gmail.com";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.email !== ADMIN_EMAIL) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // Still waiting for Firebase auth to initialize
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", backgroundColor: "#0f0f0f",
        fontFamily: "'Inter', sans-serif", color: "#555", fontSize: "0.9rem",
      }}>
        Checking access...
      </div>
    );
  }

  // Auth resolved but no valid admin user yet — show nothing while redirect happens
  if (!user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  return <>{children}</>;
}