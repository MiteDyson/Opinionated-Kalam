const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

// Cache the auth signature for its lifetime (avoids a round-trip on every upload)
let authCache: { token: string; expire: number; signature: string } | null = null;

async function getAuth() {
  const now = Date.now() / 1000;
  if (authCache && authCache.expire - 60 > now) return authCache;
  const res = await fetch("/api/imagekit-auth");
  if (!res.ok) throw new Error("Failed to get upload auth");
  authCache = await res.json();
  return authCache!;
}

export async function uploadToImageKit(file: File, folder = "articles"): Promise<string> {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  if (!publicKey) throw new Error("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY not set in .env.local");

  const { token, expire, signature } = await getAuth();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`);
  formData.append("folder", folder);
  formData.append("publicKey", publicKey);
  formData.append("signature", signature);
  formData.append("expire", expire.toString());
  formData.append("token", token);

  const res = await fetch(IMAGEKIT_UPLOAD_URL, { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Upload failed");
  }
  const data = await res.json();
  return data.url;
}

export const IMAGEKIT_ENDPOINT = "https://ik.imagekit.io/ok15";
