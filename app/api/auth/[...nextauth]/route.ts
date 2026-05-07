// import { handlers } from "@/lib/auth";
// export const { GET, POST } = handlers;

export async function GET() {
  return new Response("Auth system disabled", { status: 404 });
}

export async function POST() {
  return new Response("Auth system disabled", { status: 404 });
}
