import { useEffect, useState } from "react";
import type { NewsItem, GalleryImage } from "@/data/newsData";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook untuk fetch berita dinamis dari Lovable Cloud (table news).
 * Berita dinamis akan digabung dengan newsData statis di komponen pemanggil.
 */

interface NewsRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  date_label: string | null;
  image_url: string | null;
  gallery: unknown;
  published_at: string | null;
  created_at: string;
}

function normalize(row: NewsRow): NewsItem {
  // hash sederhana dari uuid untuk dapat number id (kompatibel dgn NewsItem.id: number)
  const numId = parseInt(row.id.replace(/-/g, "").slice(0, 8), 16);
  const galleryArr: GalleryImage[] = Array.isArray(row.gallery)
    ? (row.gallery as { src?: string; alt?: string }[])
        .filter((g) => g && typeof g.src === "string")
        .map((g) => ({ src: g.src as string, alt: g.alt ?? "" }))
    : [];
  return {
    id: numId,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content,
    date: row.date_label ?? new Date(row.published_at ?? row.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    category: row.category,
    image: row.image_url ?? undefined,
    gallery: galleryArr,
  };
}

export function useDynamicNews() {
  const [dynamicNews, setDynamicNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, slug, title, excerpt, content, category, date_label, image_url, gallery, published_at, created_at")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (cancelled) return;
      if (error) {
        setError(error.message);
        setDynamicNews([]);
      } else {
        setDynamicNews((data ?? []).map((r) => normalize(r as NewsRow)));
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { dynamicNews, loading, error };
}
