import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Opinionated Kalam",
    template: "%s | Opinionated Kalam",
  },
  description:
    "Sharp opinions, deep dives, and honest takes on politics, geopolitics, automotive, and beyond — by Dense.",
  openGraph: {
    siteName: "Opinionated Kalam",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
