import mongoose, { Schema, models } from "mongoose";

const PreferenceSchema = new Schema({
  enabled: { type: Boolean, default: false },
  frequency: { type: String, enum: ["Daily", "Weekly", "Monthly"], default: "Weekly" }
}, { _id: false });

const SubscriptionSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  uid: { type: String }, // Firebase UID for authenticated users (optional)
  
  // Overall notifications
  all: {
    enabled: { type: Boolean, default: true },
    frequency: { type: String, enum: ["Daily", "Weekly", "Monthly"], default: "Daily" }
  },
  
  trending: {
    enabled: { type: Boolean, default: true },
    frequency: { type: String, enum: ["Daily", "Weekly", "Monthly"], default: "Daily" }
  },
  
  // Format based notifications
  formats: {
    Articles: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, enum: ["Daily", "Weekly", "Monthly"], default: "Weekly" }
    },
    Podcasts: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, enum: ["Daily", "Weekly", "Monthly"], default: "Weekly" }
    },
    "Short Reads": {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, enum: ["Daily", "Weekly", "Monthly"], default: "Weekly" }
    }
  },
  
  // Beat (category) based notifications
  beats: {
    Automotive:   { type: PreferenceSchema, default: () => ({}) },
    Business:     { type: PreferenceSchema, default: () => ({}) },
    Environment:  { type: PreferenceSchema, default: () => ({}) },
    "Geo Politics": { type: PreferenceSchema, default: () => ({}) },
    Governance:   { type: PreferenceSchema, default: () => ({}) },
    "Law & Order": { type: PreferenceSchema, default: () => ({}) },
    Media:        { type: PreferenceSchema, default: () => ({}) },
    Society:      { type: PreferenceSchema, default: () => ({}) },
    Technology:   { type: PreferenceSchema, default: () => ({}) },
  },
  
  // Secure unsubscribe token
  unsubscribeToken: { type: String, unique: true, sparse: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for faster lookups
SubscriptionSchema.index({ email: 1 });
SubscriptionSchema.index({ unsubscribeToken: 1 });

export const Subscription = models.Subscription ?? mongoose.model("Subscription", SubscriptionSchema);
