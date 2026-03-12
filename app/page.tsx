import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Eye,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle,
} from "lucide-react";

// Stat card
function StatCard({
  label,
  value,
  icon: Icon,
  change,
  color = "text-neutral-300",
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  color?: string;
}) {
  return (
    <div className="bg-[#1A1A1A] border border-white/[0.07] rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg bg-white/[0.06] ${color}`}>
          <Icon size={16} strokeWidth={1.8} />
        </div>
        {change && (
          <span className="text-xs text-emerald-400 font-medium">{change}</span>
        )}
      </div>
      <p className="font-sans text-2xl font-semibold text-white mb-1">{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
    </div>
  );
}

// Recent post row
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
    <div className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{title}</p>
        <p className="text-xs text-neutral-500 mt-0.5">{type} · {date}</p>
      </div>
      <span
        className={`ml-4 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
          status === "published"
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-amber-500/10 text-amber-400"
        }`}
      >
        {status === "published" ? (
          <CheckCircle size={11} />
        ) : (
          <Clock size={11} />
        )}
        {status}
      </span>
    </div>
  );
}

export default function AdminDashboard() {
  const stats = [
    { label: "Published Posts", value: 24, icon: FileText, change: "+3 this week", color: "text-blue-400" },
    { label: "Pending Comments", value: 7, icon: MessageSquare, change: "Needs review", color: "text-amber-400" },
    { label: "Total Views", value: "12.4k", icon: Eye, change: "+18% ↑", color: "text-emerald-400" },
    { label: "Drafts", value: 5, icon: TrendingUp, color: "text-neutral-300" },
  ];

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Welcome back, Vineet.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 bg-[#D38B88] hover:bg-[#c97c79] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={15} />
          New Post
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent posts */}
        <div className="bg-[#1A1A1A] border border-white/[0.07] rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-sans text-sm font-semibold text-white">
              Recent Posts
            </h2>
            <Link
              href="/admin/posts"
              className="text-xs text-neutral-500 hover:text-white transition-colors"
            >
              View all →
            </Link>
          </div>
          <div>
            <RecentPostRow
              title="Indians are Sunroof-Suckers?"
              status="published"
              date="5 Mar 2026"
              type="Article"
            />
            <RecentPostRow
              title="How Volkswagen Fooled the American Government"
              status="published"
              date="3 Mar 2026"
              type="Article"
            />
            <RecentPostRow
              title="Pakistan vs Afghanistan: Deep Dive"
              status="draft"
              date="1 Mar 2026"
              type="Article"
            />
            <RecentPostRow
              title="Japan Earthquakes — Full Explainer"
              status="published"
              date="28 Feb 2026"
              type="Video"
            />
            <RecentPostRow
              title="EV Battery Myths Debunked"
              status="draft"
              date="25 Feb 2026"
              type="Podcast"
            />
          </div>
        </div>

        {/* Pending comments */}
        <div className="bg-[#1A1A1A] border border-white/[0.07] rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-sans text-sm font-semibold text-white">
              Comments Awaiting Approval
            </h2>
            <Link
              href="/admin/comments"
              className="text-xs text-neutral-500 hover:text-white transition-colors"
            >
              Moderate →
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { name: "Rahul S.", comment: "Great breakdown of the VW scandal, very informative!", post: "Volkswagen article" },
              { name: "Priya M.", comment: "I had no idea sunroofs were this inefficient. Mind blown.", post: "Sunroof article" },
              { name: "Arjun K.", comment: "Could you do a follow-up on the Indian EV market?", post: "EV Battery Myths" },
            ].map((c, i) => (
              <div
                key={i}
                className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-lg"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-white">{c.name}</span>
                  <span className="text-[11px] text-neutral-600">{c.post}</span>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2">{c.comment}</p>
                <div className="flex gap-2 mt-2.5">
                  <button className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                    Approve
                  </button>
                  <button className="text-[11px] text-red-400 hover:text-red-300 font-medium transition-colors">
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
