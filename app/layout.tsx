import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { DM_Serif_Display, Inter, Radley } from "next/font/google";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-dm-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const radley = Radley({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-radley",
});

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
    <html lang="en" className={`${dmSerif.variable} ${inter.variable} ${radley.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <Preloader />
        <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} toastOptions={{ duration: 3000, style: { background: "#1A1A1A", color: "#fff", fontSize: "0.85rem", fontFamily: "var(--font-inter), sans-serif" } }} />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

