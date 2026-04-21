import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { NewsItem } from "@/data/newsData";

export function useDynamicNews() {
  const [dynamicNews, setDynamicNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("get-hostinger-posts", { method: "GET" });

        if (cancelled) return;
        if (fnError) throw fnError;

        const rawPosts: any[] = Array.isArray(data?.posts) ? data.posts : [];

        const normalized: NewsItem[] = rawPosts.map((item: any) => {
          // 🔥 ambil gambar dari berbagai kemungkinan field
          const image =
            item.image ||
            item.image_url ||
            item.thumbnail ||
            item.cover ||
            "https://via.placeholder.com/600x400?text=Saung+Quran";

          return {
            id: item.id || Math.random(),
            slug: item.slug || "",
            title: item.title || "Tanpa Judul",
            excerpt: item.excerpt || "",
            content: item.content || "",
            date: item.date || "",
            category: item.category || "Umum",
            image,

            gallery: Array.isArray(item.gallery)
              ? item.gallery.map((g: any) => ({
                  src: g.src || g.image_url || "https://via.placeholder.com/300",
                  alt: g.alt || "",
                }))
              : [],
          };
        });

        setDynamicNews(normalized);
      } catch (err: any) {
        console.error("useDynamicNews error:", err);
        setError(err.message || "Failed to load news");
        setDynamicNews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { dynamicNews, loading, error };
}
