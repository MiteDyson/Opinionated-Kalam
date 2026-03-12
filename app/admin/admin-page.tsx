import Link from "next/link";
import {
  FileText, MessageSquare, Eye, TrendingUp,
  Plus, Clock, CheckCircle,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  change,
  iconColor = "#9ca3af",
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  iconColor?: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: "#1A1A1A",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "rgba(255,255,255,0.06)", color: iconColor }}
        >
          <Icon size={16} strokeWidth={1.8} />
        </div>
        {change && (
          <span className="text-xs font-medium" style={{ color: "#34d399" }}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold text-white mb-1">{value}</p>
      <p className="text-xs" style={{ color: "#6b7280" }}>{label}</p>
    </div>
  );
}

function RecentPostRow({
  title,
  status,
  date,
  type,
}: {
  title: string;
  status: "published" | "draft";
  date: string;
  type: string;
}) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{title}</p>
        <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
          {type} · {date}
        </p>
      </div>
      <span
        className="ml-4 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
        style={
          status === "published"
            ? { backgroundColor: "rgba(52,211,153,0.1)", color: "#34d399" }
            : { backgroundColor: "rgba(251,191,36,0.1)", color: "#fbbf24" }
        }
      >
        {status === "published" ? <CheckCircle size={11} /> : <Clock size={11} />}
        {status}
      </span>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white">Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            Welcome back, Vineet.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          style={{ backgroundColor: "var(--terracotta)" }}
        >
          <Plus size={15} />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Published Posts" value={24} icon={FileText}      change="+3 this week" iconColor="#60a5fa" />
        <StatCard label="Pending Comments" value={7}  icon={MessageSquare} change="Needs review"   iconColor="#fbbf24" />
        <StatCard label="Total Views"    value="12.4k" icon={Eye}          change="+18% ↑"         iconColor="#34d399" />
        <StatCard label="Drafts"         value={5}    icon={TrendingUp}    iconColor="#9ca3af" />
      </div>

      {/* Content panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent posts */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">Recent Posts</h2>
            <Link href="/admin/posts" className="text-xs transition-colors" style={{ color: "#6b7280" }}>
              View all →
            </Link>
          </div>
          <RecentPostRow title="Indians are Sunroof-Suckers?"                  status="published" date="5 Mar 2026"  type="Article" />
          <RecentPostRow title="How Volkswagen Fooled the American Government"  status="published" date="3 Mar 2026"  type="Article" />
          <RecentPostRow title="Pakistan vs Afghanistan: Deep Dive"             status="draft"     date="1 Mar 2026"  type="Article" />
          <RecentPostRow title="Japan Earthquakes — Full Explainer"             status="published" date="28 Feb 2026" type="Video" />
          <RecentPostRow title="EV Battery Myths Debunked"                      status="draft"     date="25 Feb 2026" type="Podcast" />
        </div>

        {/* Pending comments */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">Pending Comments</h2>
            <Link href="/admin/comments" className="text-xs transition-colors" style={{ color: "#6b7280" }}>
              Moderate →
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { name: "Rahul S.",  comment: "Great breakdown of the VW scandal, very informative!",      post: "Volkswagen" },
              { name: "Priya M.", comment: "I had no idea sunroofs were this inefficient. Mind blown.",  post: "Sunroof article" },
              { name: "Arjun K.", comment: "Could you do a follow-up on the Indian EV market?",          post: "EV Battery" },
            ].map((c, i) => (
              <div
                key={i}
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-white">{c.name}</span>
                  <span className="text-[11px]" style={{ color: "#4b5563" }}>{c.post}</span>
                </div>
                <p className="text-xs line-clamp-2" style={{ color: "#9ca3af" }}>{c.comment}</p>
                <div className="flex gap-3 mt-2.5">
                  <button className="text-[11px] font-medium transition-colors" style={{ color: "#34d399" }}>
                    Approve
                  </button>
                  <button className="text-[11px] font-medium transition-colors" style={{ color: "#f87171" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
