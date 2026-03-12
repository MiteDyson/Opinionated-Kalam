import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "d MMMM, yyyy");
}

export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);
  const diffHours = (Date.now() - d.getTime()) / 1000 / 3600;
  if (diffHours < 48) return formatDistanceToNow(d, { addSuffix: true });
  return formatDate(d);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const POST_TYPE_LABELS: Record<string, string> = {
  article: "Article",
  short: "Short Read",
  podcast: "Podcast",
  video: "Video Essay",
};
