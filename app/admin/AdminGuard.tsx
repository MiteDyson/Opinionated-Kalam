"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    // Check if user is admin by calling a lightweight API endpoint
    const checkAdmin = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("/api/auth/check-admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          router.replace("/"); // Redirect non-admins to homepage
        }
      } catch {
        setIsAdmin(false);
        router.replace("/");
      }
    };

    checkAdmin();
  }, [user, loading, router]);

  if (loading || isAdmin === null) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", backgroundColor: "#0f0f0f",
        fontFamily: "'Inter', sans-serif", color: "#555",
      }}>
        Checking access...
      </div>
    );
  }

  if (!isAdmin) return null;

  return <>{children}</>;
}
