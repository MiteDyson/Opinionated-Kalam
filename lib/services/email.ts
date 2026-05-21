import nodemailer from "nodemailer";
import { Subscription } from "@/lib/db/Subscription";
import { connectDB } from "@/lib/db/mongodb";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.resend.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_SECURE = process.env.SMTP_SECURE !== undefined
  ? process.env.SMTP_SECURE === "true"
  : SMTP_PORT === 465;
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "Opinionated Kalam <info@opinionatedkalam.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Helper to check if SMTP is fully configured
const isSmtpConfigured = (): boolean => {
  return !!(SMTP_USER && SMTP_PASS);
};

// Create Nodemailer transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

/**
 * Filter subscribers who should receive notification for this article.
 */
async function getQualifyingSubscribers(article: {
  type: string;
  tags?: string[];
}) {
  await connectDB();
  const allSubs = await Subscription.find({}).lean() as any[];
  const qualifying: Array<{ email: string; token: string }> = [];

  const articleType = String(article.type || "article").toLowerCase();
  const articleTags = (article.tags || []).map(t => t.toLowerCase().trim());

  for (const sub of allSubs) {
    let matches = false;

    // 1. General override (Any Post)
    if (sub.all?.enabled) {
      matches = true;
    }

    // 2. Format specific
    if (!matches && sub.formats) {
      if (articleType === "article" && sub.formats.Articles?.enabled) {
        matches = true;
      } else if (articleType === "podcast" && sub.formats.Podcasts?.enabled) {
        matches = true;
      } else if (articleType === "short" && sub.formats["Short Reads"]?.enabled) {
        matches = true;
      }
    }

    // 3. Beat/tag specific
    if (!matches && sub.beats) {
      const beatsObject = sub.beats;
      for (const beatName of Object.keys(beatsObject)) {
        if (beatsObject[beatName]?.enabled) {
          // If the article has a tag matching the beat
          if (articleTags.includes(beatName.toLowerCase())) {
            matches = true;
            break;
          }
        }
      }
    }

    if (matches && sub.email) {
      qualifying.push({
        email: sub.email,
        token: sub.unsubscribeToken || ""
      });
    }
  }

  return qualifying;
}

/**
 * Send article notification emails in background
 */
export async function sendArticleNotification(article: {
  title: string;
  slug: string;
  type: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
}) {
  try {
    const subscribers = await getQualifyingSubscribers(article);

    if (subscribers.length === 0) {
      console.log(`[Email Service] No qualifying subscribers found for new ${article.type}: "${article.title}"`);
      return;
    }

    const typeLabel = article.type === "podcast"
      ? "PODCAST"
      : article.type === "short"
        ? "SHORT READ"
        : "ARTICLE";

    const path = article.type === "podcast"
      ? `/podcasts/${article.slug}`
      : article.type === "short"
        ? `/shorts/${article.slug}`
        : `/article/${article.slug}`;

    const articleUrl = `${APP_URL}${path}`;

    console.log(`[Email Service] Found ${subscribers.length} subscribers. Dispatching email notifications...`);

    const hasSmtp = isSmtpConfigured();
    if (!hasSmtp) {
      console.warn("[Email Service] SMTP is NOT configured (missing SMTP_USER/SMTP_PASS in environment). Simulating email dispatch to terminal/logs.");
    }

    const transporter = hasSmtp ? getTransporter() : null;

    // Dispatch emails in batches/parallel
    const emailPromises = subscribers.map(async (sub) => {
      const unsubscribeUrl = `${APP_URL}/api/subscriptions/unsubscribe?token=${sub.token}`;
      const html = renderEmailHtml({
        title: article.title,
        typeLabel,
        excerpt: article.excerpt || "",
        coverImage: article.coverImage || "",
        author: article.author || "Opinionated Kalam Team",
        articleUrl,
        unsubscribeUrl
      });

      const mailOptions = {
        from: EMAIL_FROM,
        to: sub.email,
        subject: `New ${article.type}: ${article.title} | Opinionated Kalam`,
        html: html,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
        }
      };

      if (transporter) {
        try {
          await transporter.sendMail(mailOptions);
          return { email: sub.email, status: "sent" };
        } catch (err: any) {
          console.error(`[Email Service] Failed to send email to ${sub.email}:`, err.message);
          return { email: sub.email, status: "failed", error: err.message };
        }
      } else {
        // Simulation Output in console
        console.log(`
=========================================
[SIMULATED EMAIL DISPATCH]
To: ${sub.email}
Subject: ${mailOptions.subject}
Link: ${articleUrl}
Unsubscribe: ${unsubscribeUrl}
=========================================`);
        return { email: sub.email, status: "simulated" };
      }
    });

    const results = await Promise.all(emailPromises);
    const sentCount = results.filter(r => r.status === "sent" || r.status === "simulated").length;
    console.log(`[Email Service] Finished dispatch. Status: ${sentCount}/${results.length} emails dispatched successfully.`);
  } catch (error: any) {
    console.error("[Email Service] Critical error in sendArticleNotification:", error.message);
  }
}

interface EmailHtmlParams {
  title: string;
  typeLabel: string;
  excerpt: string;
  coverImage: string;
  author: string;
  articleUrl: string;
  unsubscribeUrl: string;
}

function renderEmailHtml({
  title,
  typeLabel,
  excerpt,
  coverImage,
  author,
  articleUrl,
  unsubscribeUrl
}: EmailHtmlParams): string {
  const BG = "#f5f0eb";
  const BLACK = "#111111";
  const TERRACOTTA = "#D92323";
  const MUTED = "#444444";
  const LIGHT_MUTED = "#777777";
  const BORDER = "#e0d8d0";

  const logoUrl = `${APP_URL}/logo.png`;

  const bannerHtml = coverImage
    ? `<div class="email-banner-wrap" style="margin: 28px 0; padding: 0 10px; text-align: center;">
        <a href="${articleUrl}" style="text-decoration: none; display: block;">
          <img class="email-banner-img" src="${coverImage}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 0 auto; box-shadow: 0 8px 24px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.05);" />
        </a>
       </div>`
    : "";

  const actionText = typeLabel === "PODCAST"
    ? "Listen to Episode"
    : typeLabel === "SHORT READ"
      ? "Read Short"
      : "Read Article";

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${title}</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: ${BG};
          color: ${BLACK};
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table {
          border-collapse: collapse;
        }
        * {
          box-sizing: border-box;
        }
        @media only screen and (max-width: 600px) {
          .email-body {
            padding: 20px 8px !important;
          }
          .email-card {
            padding: 36px 20px 28px 20px !important;
            border-radius: 16px !important;
          }
          .email-header-logo {
            height: 32px !important;
            margin-bottom: 8px !important;
          }
          .email-header-title {
            font-size: 22px !important;
          }
          .email-badge {
            font-size: 10px !important;
            padding: 5px 12px !important;
            margin-bottom: 16px !important;
          }
          .email-title {
            font-size: 22px !important;
            line-height: 1.35 !important;
            margin-bottom: 12px !important;
          }
          .email-author {
            margin-bottom: 18px !important;
          }
          .email-banner-wrap {
            margin: 20px 0 !important;
            padding: 0 !important;
          }
          .email-banner-img {
            border-radius: 8px !important;
          }
          .email-excerpt {
            font-size: 14px !important;
            line-height: 1.65 !important;
            margin-bottom: 28px !important;
          }
          .email-cta-btn {
            padding: 14px 28px !important;
            font-size: 13px !important;
            border-radius: 10px !important;
            width: 100% !important;
            box-sizing: border-box !important;
            text-align: center !important;
          }
          .email-footer {
            padding-top: 28px !important;
          }
        }
      </style>
    </head>
    <body class="email-body" style="background-color: ${BG}; color: ${BLACK}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px 10px;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            <table class="email-card" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 24px; box-shadow: 0 12px 40px rgba(0,0,0,0.03); border: 1px solid ${BORDER}; overflow: hidden; padding: 48px 40px 40px 40px; text-align: center; box-sizing: border-box;">
              
              <!-- Header Section -->
              <tr>
                <td align="center" style="padding-bottom: 28px; border-bottom: 1px solid #f0eae4;">
                  <div style="margin: 0 auto; text-align: center;">
                    <a href="${APP_URL}" style="text-decoration: none; display: inline-block;">
                      <img class="email-header-logo" src="${logoUrl}" alt="" style="height: 38px; width: auto; vertical-align: middle; border: 0; display: block; margin: 0 auto 12px auto;" />
                    </a>
                    <a href="${APP_URL}" class="email-header-title" style="text-decoration: none; color: ${BLACK}; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: bold; letter-spacing: -0.5px; line-height: 1.2; display: block; margin: 0 auto;">
                      Opinionated Kalam
                    </a>
                  </div>
                </td>
              </tr>
              
              <!-- Body Content (Fully Centered) -->
              <tr>
                <td align="center" style="padding-top: 36px;">
                  <!-- Category Badge -->
                  <div class="email-badge" style="display: inline-block; background-color: rgba(217, 35, 35, 0.06); color: ${TERRACOTTA}; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 30px; letter-spacing: 1.5px; margin-bottom: 20px; text-transform: uppercase; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
                    ${typeLabel}
                  </div>
                  
                  <!-- Title -->
                  <h1 class="email-title" style="font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: bold; color: ${BLACK}; line-height: 1.3; margin: 0 auto 16px auto; max-width: 500px; text-align: center;">
                    ${title}
                  </h1>
                  
                  <!-- Author Metadata -->
                  <p class="email-author" style="font-size: 13px; color: ${LIGHT_MUTED}; margin: 0 auto 24px auto; font-weight: 500; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; text-align: center;">
                    By ${author}
                  </p>
                  
                  <!-- Banner Image with elegant inner padding -->
                  ${bannerHtml}
                  
                  <!-- Excerpt Description -->
                  <p class="email-excerpt" style="font-size: 15px; color: ${MUTED}; line-height: 1.75; margin: 0 auto 36px auto; max-width: 480px; text-align: center; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
                    ${excerpt}
                  </p>
                  
                  <!-- Large Centered CTA Button -->
                  <div style="text-align: center; margin-bottom: 28px;">
                    <a href="${articleUrl}" class="email-cta-btn" style="display: inline-block; background-color: ${BLACK}; color: #ffffff; padding: 16px 36px; border-radius: 12px; font-size: 14px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 14px rgba(0,0,0,0.08); letter-spacing: 0.5px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
                      ${actionText}
                    </a>
                  </div>
                </td>
              </tr>
              
              <!-- Footer Section (Ultra-Clean Unsubscribe & Prefs) -->
              <tr>
                <td align="center" class="email-footer" style="padding-top: 36px; border-top: 1px solid #f0eae4; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
                  <p style="margin: 0 0 10px 0; font-size: 11px; color: ${LIGHT_MUTED}; line-height: 1.6; max-width: 440px;">
                    Sent by <a href="${APP_URL}" style="color: ${BLACK}; text-decoration: underline; font-weight: 500;">Opinionated Kalam</a>. To stop receiving these updates, you can <a href="${unsubscribeUrl}" style="color: ${BLACK}; text-decoration: underline; font-weight: 500;">unsubscribe here</a> or <a href="${APP_URL}/subscriptions" style="color: ${BLACK}; text-decoration: underline; font-weight: 500;">manage preferences</a>.
                  </p>
                  <p style="margin: 16px 0 0 0; font-size: 10px; color: #999999; letter-spacing: 0.5px; text-transform: uppercase;">
                    &copy; ${new Date().getFullYear()} Opinionated Kalam
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
