"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

const ADMIN_EMAIL = "opinionatedkalam@gmail.com";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.email !== ADMIN_EMAIL) {
      router.replace("/");
      return;
    }

    setChecked(true);
  }, [user, loading, router]);

  if (loading || !checked) {
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

  return <>{children}</>;
}
