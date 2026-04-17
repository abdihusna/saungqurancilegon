// Edge function: import-hostinger-posts
// Fetch posts.php dari Hostinger, download gambar ke storage, insert ke news table.
// Idempotent: skip slug yang sudah ada.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const POSTS_URL = "https://saungqurancilegon.id/hostinger-webhook/posts.php";
const BUCKET = "news-images";

interface HostingerPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  category?: string;
  date?: string;
  author?: string;
  tags?: string[];
  image?: string | null;
  gallery?: { src: string; alt: string }[];
  created_at?: string;
}

async function downloadAndUpload(
  url: string,
  supabase: ReturnType<typeof createClient>,
): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
    const arrayBuf = await res.arrayBuffer();
    const path = `imported/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, arrayBuf, {
      contentType,
      upsert: false,
    });
    if (error) {
      console.error("Upload failed:", error.message);
      return null;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error("Download failed for", url, err);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify caller is authenticated admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cek role admin
    const { data: roleData } = await userClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service client untuk upload bypass RLS
    const adminClient = createClient(supabaseUrl, serviceKey);

    // Fetch posts.php
    const postsRes = await fetch(POSTS_URL);
    if (!postsRes.ok) {
      return new Response(JSON.stringify({ error: `Hostinger fetch ${postsRes.status}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const postsJson = await postsRes.json();
    const posts: HostingerPost[] = Array.isArray(postsJson?.posts) ? postsJson.posts : [];

    // Existing slugs
    const { data: existing } = await adminClient.from("news").select("slug");
    const existingSlugs = new Set((existing ?? []).map((r: { slug: string }) => r.slug));

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const p of posts) {
      if (!p.slug || existingSlugs.has(p.slug)) {
        skipped++;
        continue;
      }

      // Download main image
      let imageUrl: string | null = null;
      if (p.image) {
        imageUrl = await downloadAndUpload(p.image, adminClient);
      }

      // Download gallery
      const gallery: { src: string; alt: string }[] = [];
      for (const g of p.gallery ?? []) {
        if (!g?.src) continue;
        const newSrc = await downloadAndUpload(g.src, adminClient);
        if (newSrc) gallery.push({ src: newSrc, alt: g.alt ?? "" });
      }

      const { error: insErr } = await adminClient.from("news").insert({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? null,
        content: p.content,
        category: p.category ?? "Berita",
        date_label: p.date ?? null,
        author: p.author ?? "Admin SQC",
        tags: p.tags ?? [],
        image_url: imageUrl,
        gallery,
        published: true,
        published_at: p.created_at ?? new Date().toISOString(),
        created_by: userData.user.id,
      });

      if (insErr) {
        errors.push(`${p.slug}: ${insErr.message}`);
      } else {
        imported++;
      }
    }

    return new Response(
      JSON.stringify({ ok: true, total: posts.length, imported, skipped, errors }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Import error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
