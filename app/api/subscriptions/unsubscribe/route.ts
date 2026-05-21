import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { Subscription } from "@/lib/db/Subscription";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse(
        renderHtmlResponse(
          "Invalid Link",
          "The unsubscribe token is missing. Please double check the link or contact us if you need assistance.",
          false
        ),
        { headers: { "Content-Type": "text/html" }, status: 400 }
      );
    }

    await connectDB();
    const sub = await Subscription.findOne({ unsubscribeToken: String(token) });

    if (!sub) {
      return new NextResponse(
        renderHtmlResponse(
          "Unsubscribe Failed",
          "We could not find an active subscription associated with this link. You may already be unsubscribed, or the link may have expired.",
          false
        ),
        { headers: { "Content-Type": "text/html" }, status: 404 }
      );
    }

    // Disable all notification preferences
    sub.all.enabled = false;
    sub.trending.enabled = false;
    
    // Disable formats
    sub.formats.Articles.enabled = false;
    sub.formats.Podcasts.enabled = false;
    sub.formats["Short Reads"].enabled = false;

    // Disable all beats
    if (sub.beats) {
      const beatKeys = Object.keys(sub.beats.toJSON() || {});
      for (const key of beatKeys) {
        if (sub.beats[key]) {
          sub.beats[key].enabled = false;
        }
      }
    }

    sub.updatedAt = new Date();
    await sub.save();

    return new NextResponse(
      renderHtmlResponse(
        "Successfully Unsubscribed",
        `You have been unsubscribed from all email notifications for <strong>${sub.email}</strong>. We are sorry to see you go!`,
        true,
        sub.email
      ),
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err: any) {
    console.error("[GET /api/subscriptions/unsubscribe]", err.message);
    return new NextResponse(
      renderHtmlResponse(
        "Error Occurred",
        "An unexpected error occurred while processing your unsubscribe request. Please try again later.",
        false
      ),
      { headers: { "Content-Type": "text/html" }, status: 500 }
    );
  }
}

function renderHtmlResponse(title: string, message: string, success: boolean, email?: string) {
  const BG = "#f5f0eb";
  const BLACK = "#111111";
  const TERRACOTTA = "#D92323";
  const MUTED = "#666666";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} | Opinionated Kalam</title>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          background-color: ${BG};
          color: ${BLACK};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 24px;
        }
        .container {
          background-color: #ffffff;
          border-radius: 20px;
          padding: 40px 32px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.04);
          text-align: center;
          animation: fadeIn 0.4s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.8rem;
          color: ${BLACK};
          text-decoration: none;
          display: inline-block;
          margin-bottom: 24px;
        }
        .logo span {
          color: ${TERRACOTTA};
        }
        .icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: ${success ? "rgba(217, 35, 35, 0.08)" : "rgba(0, 0, 0, 0.05)"};
          color: ${success ? TERRACOTTA : BLACK};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 28px;
        }
        h1 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.75rem;
          margin-bottom: 12px;
          line-height: 1.2;
        }
        p {
          color: ${MUTED};
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .btn {
          display: inline-block;
          background-color: ${BLACK};
          color: #ffffff;
          padding: 12px 30px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s ease, opacity 0.2s ease;
          border: none;
          cursor: pointer;
        }
        .btn:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }
        .footer {
          margin-top: 32px;
          font-size: 0.75rem;
          color: ${MUTED};
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          padding-top: 20px;
        }
        .footer a {
          color: ${BLACK};
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <a href="/" class="logo">Opinionated <span>Kalam</span></a>
        
        <div class="icon">
          ${success ? "✓" : "!"}
        </div>
        
        <h1>${title}</h1>
        <p>${message}</p>
        
        <a href="/subscriptions" class="btn">Manage Preferences</a>
        
        <div class="footer">
          Changed your mind by mistake? <a href="/subscriptions">Resubscribe anytime</a>.
          <br>
          &copy; ${new Date().getFullYear()} Opinionated Kalam. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}
