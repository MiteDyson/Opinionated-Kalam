import mongoose, { Schema, models } from "mongoose";

const ArticleSchema = new Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  type:        { type: String, enum: ["article", "short", "podcast"], default: "article" },
  excerpt:     { type: String, required: true },
  content:     { type: String, required: true },
  coverImage:  { type: String },
  author:      { type: String, required: true },
  tags:        [{ type: String }],
  status:      { type: String, enum: ["draft", "published"], default: "draft" },
  likes:       { type: Number, default: 0 },
  views:       { type: Number, default: 0 },
  readTime:    { type: String },
  publishedAt: { type: Date },
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now },
});

ArticleSchema.pre("save", function (next) {
  const words = this.content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  this.readTime = `${Math.ceil(words / 200)} min read`;
  this.updatedAt = new Date();
  next();
});

export const Article = models.Article ?? mongoose.model("Article", ArticleSchema);
