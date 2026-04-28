"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isMainAdmin: boolean;
  adminRole: string | null;
  logout: () => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isMainAdmin: false,
  adminRole: null,
  logout: async () => {},
  refreshAdminStatus: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string | null>(null);

  const fetchAdminStatus = async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      setIsAdmin(false);
      setIsMainAdmin(false);
      setAdminRole(null);
      return;
    }

    try {
      const token = await firebaseUser.getIdToken();
      const res = await fetch("/api/admin/check", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setIsAdmin(data.isAdmin);
        setIsMainAdmin(data.isMain);
        setAdminRole(data.role);
      } else {
        setIsAdmin(false);
        setIsMainAdmin(false);
        setAdminRole(null);
      }
    } catch (err) {
      console.error("Error fetching admin status:", err);
      setIsAdmin(false);
      setIsMainAdmin(false);
      setAdminRole(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchAdminStatus(firebaseUser);
      } else {
        setIsAdmin(false);
        setIsMainAdmin(false);
        setAdminRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const refreshAdminStatus = async () => {
    if (user) await fetchAdminStatus(user);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin, 
      isMainAdmin, 
      adminRole, 
      logout,
      refreshAdminStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
