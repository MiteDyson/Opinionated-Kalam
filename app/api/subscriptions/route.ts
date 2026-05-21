import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Subscription } from "@/lib/db/Subscription";
import { verifyToken } from "@/lib/auth/verifyToken";
import crypto from "crypto";

// GET /api/subscriptions - Fetch preferences for authenticated user
export async function GET(req: NextRequest) {
  try {
    const user = await verifyToken(req.headers.get("Authorization"));
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.email.toLowerCase().trim();
    await connectDB();

    let sub = await Subscription.findOne({ email });
    
    if (!sub) {
      // Create a default subscription for the new user
      const unsubscribeToken = crypto.randomBytes(24).toString("hex");
      sub = await Subscription.create({
        email,
        uid: user.uid,
        unsubscribeToken,
        all: { enabled: true, frequency: "Daily" },
        trending: { enabled: true, frequency: "Daily" },
        formats: {
          Articles: { enabled: false, frequency: "Weekly" },
          Podcasts: { enabled: false, frequency: "Weekly" },
          "Short Reads": { enabled: false, frequency: "Weekly" }
        },
        beats: {
          Automotive: { enabled: false, frequency: "Weekly" },
          Business: { enabled: false, frequency: "Weekly" },
          Environment: { enabled: false, frequency: "Weekly" },
          "Geo Politics": { enabled: false, frequency: "Weekly" },
          Governance: { enabled: false, frequency: "Weekly" },
          "Law & Order": { enabled: false, frequency: "Weekly" },
          Media: { enabled: false, frequency: "Weekly" },
          Society: { enabled: false, frequency: "Weekly" },
          Technology: { enabled: false, frequency: "Weekly" }
        }
      });
    } else if (!sub.uid) {
      // Sync Firebase uid if missing
      sub.uid = user.uid;
      await sub.save();
    }

    return NextResponse.json(sub);
  } catch (err: any) {
    console.error("[GET /api/subscriptions]", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/subscriptions - Save/update preferences for authenticated user
export async function POST(req: NextRequest) {
  try {
    const user = await verifyToken(req.headers.get("Authorization"));
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.email.toLowerCase().trim();
    const body = await req.json();

    await connectDB();

    let sub = await Subscription.findOne({ email });
    const unsubscribeToken = sub?.unsubscribeToken || crypto.randomBytes(24).toString("hex");

    const updateData = {
      uid: user.uid,
      all: body.all || { enabled: false, frequency: "Daily" },
      trending: body.trending || { enabled: false, frequency: "Daily" },
      formats: body.formats || {
        Articles: { enabled: false, frequency: "Weekly" },
        Podcasts: { enabled: false, frequency: "Weekly" },
        "Short Reads": { enabled: false, frequency: "Weekly" }
      },
      beats: body.beats || {
        Automotive: { enabled: false, frequency: "Weekly" },
        Business: { enabled: false, frequency: "Weekly" },
        Environment: { enabled: false, frequency: "Weekly" },
        "Geo Politics": { enabled: false, frequency: "Weekly" },
        Governance: { enabled: false, frequency: "Weekly" },
        "Law & Order": { enabled: false, frequency: "Weekly" },
        Media: { enabled: false, frequency: "Weekly" },
        Society: { enabled: false, frequency: "Weekly" },
        Technology: { enabled: false, frequency: "Weekly" }
      },
      unsubscribeToken,
      updatedAt: new Date()
    };

    const updatedSub = await Subscription.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json(updatedSub);
  } catch (err: any) {
    console.error("[POST /api/subscriptions]", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
