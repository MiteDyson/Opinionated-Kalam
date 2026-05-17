import { z } from "zod";

// ── Article / Content Schemas ─────────────────────────────────

export const createArticleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be under 200 characters").trim(),
  type: z.enum(["article", "podcast", "short"]),
  excerpt: z.string().max(1000, "Excerpt must be under 1000 characters").trim().default(""),
  content: z.string().max(100000, "Content must be under 100,000 characters").default(""),
  coverImage: z.string().url("Invalid cover image URL").or(z.literal("")).default(""),
  author: z.string().max(100).trim().default("Author"),
  tags: z.array(z.string().max(50).trim()).max(10, "Maximum 10 tags").default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  audioUrl: z.string().url("Invalid audio URL").or(z.literal("")).default(""),
  episode: z.string().max(50).trim().default(""),
  duration: z.string().max(20).trim().default(""),
});

export const updateArticleSchema = createArticleSchema.partial();

// ── Admin Team Member Schemas ─────────────────────────────────

export const addTeamMemberSchema = z.object({
  email: z.string().email("Invalid email address").max(254).trim().toLowerCase(),
  name: z.string().min(1, "Name is required").max(100).trim(),
  role: z.enum(["admin", "author"]).default("author"),
});

export const updateTeamMemberRoleSchema = z.object({
  email: z.string().email("Invalid email address").max(254).trim().toLowerCase(),
  role: z.enum(["admin", "author"]),
});

export const removeTeamMemberSchema = z.object({
  uid: z.string().min(1, "UID is required").max(100),
});

export const removeTeamMemberByEmailSchema = z.object({
  email: z.string().email("Invalid email address").max(254).trim().toLowerCase(),
});

// ── Auth Schemas ──────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  email: z.string().email("Invalid email address").max(254).trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

// ── Utility ───────────────────────────────────────────────────

/**
 * Safely parse and validate request JSON with a Zod schema.
 * Returns { success: true, data } or { success: false, error }.
 */
export function validateBody<T extends z.ZodTypeAny>(
  schema: T,
  body: unknown
): { success: true; data: z.infer<T> } | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (!result.success) {
    const firstError = result.error.issues[0];
    return {
      success: false,
      error: firstError
        ? `${firstError.path.join(".")}: ${firstError.message}`
        : "Validation failed",
    };
  }
  return { success: true, data: result.data };
}
