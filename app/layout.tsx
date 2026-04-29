import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Opinionated Kalam",
  description: "Independent journalism powered by research, fact-checking, and strong perspectives.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  }
};

import { Toaster } from "react-hot-toast";
import Preloader from "@/components/ui/Preloader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&family=Radley:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Preloader />
        <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} toastOptions={{ duration: 3000, style: { background: "#1A1A1A", color: "#fff", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif" } }} />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
