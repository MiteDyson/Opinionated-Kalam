import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg)" }}>
      <Header />
      <main
        className="flex-1 fade-in"
        style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "2.5rem 1.25rem" }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
