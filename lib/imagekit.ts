const IMAGEKIT_ENDPOINT = "https://ik.imagekit.io/ok15";
const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

// You need to add this to your .env.local:
// NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
// Get it from: ImageKit dashboard → Developer Options → Public Key

export async function uploadToImageKit(file: File, folder = "articles"): Promise<string> {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  if (!publicKey) throw new Error("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY not set in .env.local");

  // Get auth signature from our API
  const authRes = await fetch("/api/imagekit-auth");
  if (!authRes.ok) throw new Error("Failed to get upload auth");
  const { token, expire, signature } = await authRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`);
  formData.append("folder", folder);
  formData.append("publicKey", publicKey);
  formData.append("signature", signature);
  formData.append("expire", expire.toString());
  formData.append("token", token);

  const res = await fetch(IMAGEKIT_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Upload failed");
  }

  const data = await res.json();
  return data.url;
}

export { IMAGEKIT_ENDPOINT };
