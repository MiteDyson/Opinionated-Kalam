import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  password:      { type: String, select: false },
  image:         { type: String },
  role:          { type: String, enum: ["user", "admin"], default: "user" },
  savedArticles: [{ type: String }],
  likedArticles: [{ type: String }],
  createdAt:     { type: Date, default: Date.now },
});

export const User = models.User ?? mongoose.model("User", UserSchema);
