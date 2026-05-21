import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth/verifyAdmin";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify user is authenticated as admin
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Parse Multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Retrieve archive.org credentials
    const accessKey = process.env.ARCHIVE_ACCESS_KEY;
    const secretKey = process.env.ARCHIVE_SECRET_KEY;
    if (!accessKey || !secretKey || accessKey === "your_access_key" || secretKey === "your_secret_key") {
      return NextResponse.json({
        error: "Archive.org API keys are not configured or are placeholder values. Please add your actual ARCHIVE_ACCESS_KEY and ARCHIVE_SECRET_KEY to your .env.local file.",
      }, { status: 500 });
    }

    // 4. Sanitize and prepare file data
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Clean the filename to be URL-safe (lowercase alphanumeric, dots, and hyphens)
    const cleanFileName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Generate a unique Archive.org bucket identifier
    const identifier = `opinionated-kalam-audio-${Date.now()}`;

    // Target URL: https://s3.us.archive.org/<identifier>/<filename>
    const archiveUrl = `https://s3.us.archive.org/${identifier}/${cleanFileName}`;

    console.log(`[Archive.org] Initiating upload of ${cleanFileName} (Size: ${buffer.length} bytes) to identifier: ${identifier}`);

    // 5. Proxy upload to Archive.org via standard PUT
    const res = await fetch(archiveUrl, {
      method: "PUT",
      headers: {
        "Authorization": `LOW ${accessKey}:${secretKey}`,
        "Content-Type": file.type || "audio/mpeg",
        "Content-Length": buffer.length.toString(),
        "x-archive-auto-make-bucket": "1",
        "x-archive-meta-mediatype": "audio",
        "x-archive-meta-collection": "opensource_audio",
        "x-archive-meta-title": cleanFileName,
      },
      body: buffer,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Archive.org Upload Failed]", res.status, res.statusText, errorText);
      return NextResponse.json({ error: `Archive.org upload failed: ${res.statusText}. Details: ${errorText}` }, { status: 500 });
    }

    // 6. Return permanent download link
    const directUrl = `https://archive.org/download/${identifier}/${cleanFileName}`;
    console.log(`[Archive.org] Upload successful! Permanent URL: ${directUrl}`);

    return NextResponse.json({ url: directUrl });
  } catch (err: any) {
    console.error("[POST /api/admin/upload-archive]", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
