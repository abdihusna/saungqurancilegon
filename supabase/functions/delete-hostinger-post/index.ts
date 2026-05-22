// One-shot util: hapus postingan dari Hostinger berdasarkan slug
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    if (!slug) return new Response(JSON.stringify({ error: "missing slug" }), { status: 400, headers: corsHeaders });

    const webhookUrl = Deno.env.get("HOSTINGER_WEBHOOK_URL")!;
    const secret = Deno.env.get("HOSTINGER_WEBHOOK_SECRET")!;
    const res = await fetch(`${webhookUrl}?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
      headers: { "X-Webhook-Secret": secret },
    });
    const text = await res.text();
    return new Response(JSON.stringify({ status: res.status, body: text }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders });
  }
});
