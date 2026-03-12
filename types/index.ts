export type PostType = "article" | "short" | "podcast" | "video";
export type PostStatus = "draft" | "published";

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  role: "admin" | "author";
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  type: PostType;
  body: string;         // JSON from tiptap
  excerpt?: string;
  cover_image?: string;
  author_id: string;
  author?: Author;
  category_id?: string;
  category?: Category;
  tags?: string[];
  status: PostStatus;
  published_at?: string;
  created_at: string;
  updated_at: string;
  // podcast-specific
  audio_url?: string;
  duration?: string;
  // video-specific
  video_url?: string;
  video_duration?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
  body: string;
  approved: boolean;
  created_at: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SidebarCategory {
  label: string;
  items: NavItem[];
}
