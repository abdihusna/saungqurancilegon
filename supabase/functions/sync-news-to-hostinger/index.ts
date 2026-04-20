// Edge function: sync-news-to-hostinger
// Dipanggil otomatis oleh database trigger (pg_net) setiap insert/update di tabel news.
// Forward ke Hostinger webhook.php menggunakan header X-Webhook-Secret.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  date_label: string | null;
  author: string;
  tags: string[];
  image_url: string | null;
  gallery: { src: string; alt: string }[] | unknown;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

interface TriggerPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: NewsRow | null;
  old_record: NewsRow | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const webhookUrl = Deno.env.get("HOSTINGER_WEBHOOK_URL");
    const webhookSecret = Deno.env.get("HOSTINGER_WEBHOOK_SECRET");

    if (!webhookUrl || !webhookSecret) {
      console.error("Missing HOSTINGER_WEBHOOK_URL or HOSTINGER_WEBHOOK_SECRET");
      return new Response(
        JSON.stringify({ error: "Webhook config missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const payload: TriggerPayload = await req.json();
    const news = payload.record;

    if (!news || !news.published) {
      console.log("Skip: no record or unpublished", payload.type);
      return new Response(
        JSON.stringify({ ok: true, skipped: true, reason: "unpublished_or_empty" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Body sesuai format webhook.php (field di root, bukan dibungkus)
    const body = {
      title: news.title,
      slug: news.slug,
      excerpt: news.excerpt ?? "",
      content: news.content,
      category: news.category,
      date: news.date_label ?? "",
      author: news.author,
      tags: news.tags ?? [],
      image_url: news.image_url,
      gallery: Array.isArray(news.gallery)
        ? (news.gallery as { src: string; alt: string }[]).map((g) => ({
            image_url: g.src,
            alt: g.alt ?? "",
          }))
        : [],
    };

    // Cek apakah slug sudah ada di Hostinger -> tentukan METHOD
    const baseUrl = webhookUrl.replace(/\/webhook\.php.*$/, "");
    const checkRes = await fetch(`${baseUrl}/posts.php?slug=${encodeURIComponent(news.slug)}`);
    const exists = checkRes.status === 200;

    const targetUrl = exists
      ? `${webhookUrl}?slug=${encodeURIComponent(news.slug)}`
      : webhookUrl;
    const method = exists ? "PUT" : "POST";

    console.log(`${method} ${targetUrl} (slug=${news.slug}, exists=${exists})`);

    const res = await fetch(targetUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": webhookSecret,
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();

    console.log(`Hostinger ${res.status}: ${text.slice(0, 200)}`);

    return new Response(
      JSON.stringify({ ok: res.ok, status: res.status, response: text.slice(0, 500) }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Sync error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
