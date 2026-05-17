"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, adminLoading } = useAuth();
  const [gracePeriod, setGracePeriod] = useState(true);

  useEffect(() => {
    // 1.5s grace period to allow Firebase to settle
    const timer = setTimeout(() => setGracePeriod(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading || adminLoading || gracePeriod) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#0f0f0f", fontFamily: "'Inter', sans-serif", color: "#444", fontSize: "0.85rem" }}>
        Checking access…
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f3", fontFamily: "'Inter', sans-serif", color: "#1A1A1A" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", marginBottom: 10 }}>Access Denied</h2>
        <p style={{ color: "#555", marginBottom: 20 }}>You must be logged in to view this page.</p>
        <a href="/login" style={{ padding: "10px 20px", backgroundColor: "#1B2A47", color: "white", textDecoration: "none", borderRadius: 8, fontWeight: 600 }}>Go to Login</a>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f3", fontFamily: "'Inter', sans-serif", color: "#1A1A1A" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2rem", marginBottom: 10 }}>Unauthorized</h2>
        <p style={{ color: "#555", marginBottom: 20 }}>You do not have permission to access the admin panel.</p>
        <a href="/" style={{ padding: "10px 20px", backgroundColor: "#1B2A47", color: "white", textDecoration: "none", borderRadius: 8, fontWeight: 600 }}>Return Home</a>
      </div>
    );
  }

  return <>{children}</>;
}
