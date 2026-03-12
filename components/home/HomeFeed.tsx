import { Post } from "@/types";
import ArticleCard from "@/components/article/ArticleCard";
import Link from "next/link";

interface HomeFeedProps {
  featuredPost: Post;
  sidebarPosts: Post[];
  recentPosts: Post[];
}

export default function HomeFeed({ featuredPost, sidebarPosts, recentPosts }: HomeFeedProps) {
  return (
    <div className="space-y-16">
      {/* Hero row */}
      <section className="flex gap-0 md:gap-10">
        {/* Main featured */}
        <div className="w-full md:w-[58%]">
          <ArticleCard post={featuredPost} variant="hero" />
        </div>

        {/* Vertical divider */}
        <div
          className="hidden md:block flex-shrink-0 mx-4"
          style={{ width: 2, backgroundColor: "var(--text-main)" }}
        />

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col flex-1 gap-0 pl-2">
          <h3
            className="text-[11px] font-semibold uppercase tracking-widest mb-4 font-sans"
            style={{ color: "var(--text-muted)" }}
          >
            Latest
          </h3>
          <div className="flex flex-col gap-4">
            {sidebarPosts.map((post) => (
              <div
                key={post.id}
                className="pb-4"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <ArticleCard post={post} variant="side" />
              </div>
            ))}
          </div>
        </aside>
      </section>

      {/* Divider */}
      <hr style={{ borderColor: "var(--border)" }} />

      {/* Recent grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl" style={{ color: "var(--text-main)" }}>
            Recent Stories
          </h2>
          <Link
            href="/articles"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--text-main)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-muted)")}
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
