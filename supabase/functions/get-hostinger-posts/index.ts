// Edge function: get-hostinger-posts
// Proxy ke Hostinger posts.php untuk menghindari masalah CORS di browser.
// GET /functions/v1/get-hostinger-posts          -> semua post
// GET /functions/v1/get-hostinger-posts?slug=xxx -> 1 post by slug

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const HOSTINGER_BASE = "https://saungqurancilegon.id/hostinger-webhook/posts.php";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const target = slug
      ? `${HOSTINGER_BASE}?slug=${encodeURIComponent(slug)}`
      : HOSTINGER_BASE;

    const res = await fetch(target, {
      headers: { "Accept": "application/json" },
    });
    const text = await res.text();

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = [];
    }

    // Normalisasi: selalu kembalikan { ok, posts: [...] } atau { ok, post: {...} }
    let body: Record<string, unknown>;
    if (slug) {
      // Hostinger bisa return {ok,post} atau array dengan 1 item
      if (Array.isArray(data)) {
        const post = (data as Array<Record<string, unknown>>).find(
          (p) => p.slug === slug,
        );
        body = post ? { ok: true, post } : { ok: false, error: "Not found" };
      } else if (data && typeof data === "object") {
        body = data as Record<string, unknown>;
      } else {
        body = { ok: false, error: "Invalid response" };
      }
    } else {
      // List
      if (Array.isArray(data)) {
        body = { ok: true, posts: data };
      } else if (data && typeof data === "object" && "posts" in data) {
        body = data as Record<string, unknown>;
      } else {
        body = { ok: true, posts: [] };
      }
    }

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ ok: false, error: msg, posts: [] }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
