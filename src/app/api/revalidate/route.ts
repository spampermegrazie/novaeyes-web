import { revalidateTag } from "next/cache";

// Call after publishing a blog post so the site refreshes right away:
//   POST https://nova-eyes.com/api/revalidate  with header  x-revalidate-secret: <REVALIDATE_SECRET>
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag("blog", "max");
  return Response.json({ ok: true });
}
