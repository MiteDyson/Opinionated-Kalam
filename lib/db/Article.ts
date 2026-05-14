import mongoose, { Schema, models } from "mongoose";

const ArticleSchema = new Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  type:        { type: String, enum: ["article", "short", "podcast"], default: "article" },
  excerpt:     { type: String, default: "" },
  content:     { type: String, default: "" },
  coverImage:  { type: String, default: "" },
  author:      { type: String, required: true },
  tags:        [{ type: String }],
  status:      { type: String, enum: ["draft", "published"], default: "draft" },
  likes:       { type: Number, default: 0 },
  views:       { type: Number, default: 0 },
  readTime:    { type: String, default: "" },
  likedBy:     [{ type: String }],
  savedBy:     [{ type: String }],
  audioUrl:    { type: String, default: "" },
  episode:     { type: String, default: "" },
  duration:    { type: String, default: "" },
  publishedAt: { type: Date },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
});

// ── Indexes for common query patterns ──
ArticleSchema.index({ slug: 1 });                         // single article lookups
ArticleSchema.index({ status: 1, type: 1, createdAt: -1 }); // homepage feed & type filters
ArticleSchema.index({ status: 1, createdAt: -1 });        // published feed sorting
ArticleSchema.index({ tags: 1 });                         // tag filtering

ArticleSchema.pre("save", function() {
  if (this.content) {
    const words = this.content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
    this.readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
  }
  this.updatedAt = new Date();
});

export const Article = models.Article ?? mongoose.model("Article", ArticleSchema);
