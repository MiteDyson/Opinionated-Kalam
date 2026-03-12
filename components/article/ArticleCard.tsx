import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";
import { formatDate, truncate } from "@/lib/utils";

interface ArticleCardProps {
  post: Post;
  variant?: "default" | "hero" | "side" | "compact";
}

export default function ArticleCard({ post, variant = "default" }: ArticleCardProps) {
  const href = `/${post.type === "article" ? "articles" : post.type}/${post.slug}`;
  const actionLabel =
    post.type === "video" ? "Watch" : post.type === "podcast" ? "Listen" : "Read";

  // ── HERO ─────────────────────────────────────────────
  if (variant === "hero") {
    return (
      <article className="flex flex-col gap-4 group">
        <Link href={href} className="block overflow-hidden rounded-sm">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              width={800}
              height={450}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              style={{ aspectRatio: "16/9" }}
            />
          ) : (
            <div className="w-full bg-[#D5D1C7]" style={{ aspectRatio: "16/9" }} />
          )}
        </Link>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="read-pill">{post.category?.name ?? "Feature"}</span>
            {post.type !== "article" && (
              <span
                className="text-xs font-sans uppercase tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                {post.type}
              </span>
            )}
          </div>
          <Link href={href}>
            <h2
              className="font-serif text-3xl md:text-4xl leading-tight transition-opacity hover:opacity-70"
              style={{ color: "var(--text-main)" }}
            >
              {post.title}
            </h2>
          </Link>
          {post.excerpt && (
            <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "var(--text-muted)" }}>
              {post.excerpt}
            </p>
          )}
          <div
            className="flex items-center gap-2 text-xs font-sans mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            {post.author?.name && <span>{post.author.name}</span>}
            {post.author?.name && post.published_at && (
              <span style={{ color: "var(--border)" }}>·</span>
            )}
            {post.published_at && <span>{formatDate(post.published_at)}</span>}
          </div>
        </div>
      </article>
    );
  }

  // ── SIDE ─────────────────────────────────────────────
  if (variant === "side") {
    return (
      <article className="flex gap-4 items-start group">
        <Link href={href} className="flex-shrink-0 overflow-hidden rounded-sm">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              width={140}
              height={88}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ width: 130, height: 80 }}
            />
          ) : (
            <div className="bg-[#D5D1C7] rounded-sm" style={{ width: 130, height: 80 }} />
          )}
        </Link>
        <div className="flex flex-col gap-2 min-w-0">
          <Link href={href}>
            <h3
              className="font-serif leading-snug transition-opacity hover:opacity-70 line-clamp-3"
              style={{ fontSize: "1.05rem", color: "var(--text-main)" }}
            >
              {post.title}
            </h3>
          </Link>
          <div
            className="flex items-center gap-2 text-[11px]"
            style={{ color: "var(--text-muted)" }}
          >
            {post.published_at && <span>{formatDate(post.published_at)}</span>}
            {post.author?.name && (
              <>
                <span>·</span>
                <span>{post.author.name}</span>
              </>
            )}
          </div>
          <span className="read-pill" style={{ fontSize: "0.65rem", padding: "2px 8px", width: "fit-content" }}>
            {actionLabel}
          </span>
        </div>
      </article>
    );
  }

  // ── COMPACT ───────────────────────────────────────────
  if (variant === "compact") {
    return (
      <article
        className="py-4 group"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <Link href={href}>
          <h3
            className="font-serif text-lg transition-opacity hover:opacity-70 mb-1"
            style={{ color: "var(--text-main)" }}
          >
            {post.title}
          </h3>
        </Link>
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          {post.published_at && <span>{formatDate(post.published_at)}</span>}
          {post.author?.name && (
            <>
              <span>·</span>
              <span>{post.author.name}</span>
            </>
          )}
        </div>
      </article>
    );
  }

  // ── DEFAULT ───────────────────────────────────────────
  return (
    <article className="flex flex-col gap-3 group">
      <Link href={href} className="block overflow-hidden rounded-sm">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            width={600}
            height={360}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ aspectRatio: "5/3" }}
          />
        ) : (
          <div className="w-full bg-[#D5D1C7]" style={{ aspectRatio: "5/3" }} />
        )}
      </Link>
      <div>
        {post.category?.name && (
          <span
            className="block text-[11px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            {post.category.name}
          </span>
        )}
        <Link href={href}>
          <h2
            className="font-serif text-xl leading-tight transition-opacity hover:opacity-70 mb-2"
            style={{ color: "var(--text-main)" }}
          >
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p
            className="text-sm line-clamp-2 mb-3"
            style={{ color: "var(--text-muted)" }}
          >
            {truncate(post.excerpt, 120)}
          </p>
        )}
        <div className="flex items-center gap-3">
          <span className="read-pill">{actionLabel}</span>
          <div
            className="flex items-center gap-1.5 text-[11px]"
            style={{ color: "var(--text-muted)" }}
          >
            {post.published_at && <span>{formatDate(post.published_at)}</span>}
            {post.author?.name && (
              <>
                <span>·</span>
                <span>{post.author.name}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
