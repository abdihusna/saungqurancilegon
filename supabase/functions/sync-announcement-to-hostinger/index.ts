// Edge function: sync-announcement-to-hostinger
// Dipanggil database trigger setiap insert/update di tabel announcements.
// Forward ke Hostinger announcement-webhook.php

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnnouncementRow {
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
}

interface TriggerPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: AnnouncementRow | null;
  old_record: AnnouncementRow | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const baseWebhook = Deno.env.get("HOSTINGER_WEBHOOK_URL");
    const secret = Deno.env.get("HOSTINGER_WEBHOOK_SECRET");
    if (!baseWebhook || !secret) {
      return new Response(JSON.stringify({ error: "Webhook config missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Derive announcement endpoint from base webhook (replace webhook.php -> announcement-webhook.php)
    const baseUrl = baseWebhook.replace(/\/webhook\.php.*$/, "");
    const annWebhookUrl = `${baseUrl}/announcement-webhook.php`;
    const annPostsUrl = `${baseUrl}/announcements.php`;

    const payload: TriggerPayload = await req.json();
    const a = payload.record;

    if (!a || !a.published) {
      return new Response(
        JSON.stringify({ ok: true, skipped: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = {
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt ?? "",
      content: a.content,
      category: a.category,
      date: a.date_label ?? "",
      author: a.author,
      tags: a.tags ?? [],
      image_url: a.image_url,
      gallery: Array.isArray(a.gallery)
        ? (a.gallery as { src: string; alt: string }[]).map((g) => ({
            image_url: g.src,
            alt: g.alt ?? "",
          }))
        : [],
    };

    let exists = false;
    try {
      const r = await fetch(`${annPostsUrl}?slug=${encodeURIComponent(a.slug)}`);
      if (r.status === 200) {
        const j = await r.json().catch(() => null) as { ok?: boolean; post?: unknown } | null;
        exists = !!(j && j.ok === true && j.post);
      }
    } catch (_) { /* default POST */ }

    const target = exists ? `${annWebhookUrl}?slug=${encodeURIComponent(a.slug)}` : annWebhookUrl;
    const method = exists ? "PUT" : "POST";

    const res = await fetch(target, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": secret,
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();

    return new Response(
      JSON.stringify({ ok: res.ok, status: res.status, response: text.slice(0, 500) }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
