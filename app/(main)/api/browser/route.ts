export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { url, method = "GET", headers = {}, body } = await req.json()
    if (!url || typeof url !== "string") return new Response("Missing or invalid URL", { status: 400 })

    const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined })
    const text = await res.text()

    // Basic CORS for your app; tighten as needed
    return new Response(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(`Failed to fetch: ${message}`, { status: 500 })
  }
}