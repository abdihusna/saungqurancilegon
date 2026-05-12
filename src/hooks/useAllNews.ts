import { useEffect, useState, useCallback } from "react";
import type { NewsItem } from "@/data/newsData";
import { supabase } from "@/integrations/supabase/client";

const ENDPOINT = "https://saungqurancilegon.id/hostinger-webhook/posts.php";

function parseDateLabel(label: string): Date {
  const months: Record<string, number> = {
    Januari: 0, Februari: 1, Maret: 2, April: 3, Mei: 4, Juni: 5,
    Juli: 6, Agustus: 7, September: 8, Oktober: 9, November: 10, Desember: 11,
  };
  const parts = label.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]] ?? 0;
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return new Date(0);
}

export function useAllNews() {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Ambil dari Hostinger webhook
      const hostingerRes = await fetch(`${ENDPOINT}?t=${Date.now()}`, { cache: "no-store" });
      const hostingerData = await hostingerRes.json();
      const hostingerList = Array.isArray(hostingerData) ? hostingerData : (hostingerData?.posts ?? []);
      const hostingerNews: NewsItem[] = hostingerList.map((item: any) => ({
        id: item.id ?? item.slug,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt || "",
        content: item.content,
        date: item.date,
        category: item.category,
        image: item.image,
        gallery: item.gallery || [],
      }));

      // 2. Ambil dari Supabase
      const { data: supabaseRows, error } = await supabase
        .from("news")
        .select("id, slug, title, excerpt, content, category, date_label, author, image_url, gallery, tags, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Supabase news error:", error);
      }

      const supabaseNews: NewsItem[] = (supabaseRows ?? []).map((row: any) => ({
        id: row.slug ?? row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt || "",
        content: row.content,
        date: row.date_label || new Date(row.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        category: row.category,
        image: row.image_url,
        gallery: Array.isArray(row.gallery)
          ? row.gallery.map((g: any) => ({ src: g.src ?? g.image_url ?? "", alt: g.alt ?? "" }))
          : [],
      }));

      // 3. Merge: Supabase menimpa Hostinger (prioritas Supabase)
      const map = new Map<string, NewsItem>();
      for (const n of hostingerNews) {
        if (n.slug) map.set(n.slug.toLowerCase(), n);
      }
      for (const n of supabaseNews) {
        if (n.slug) map.set(n.slug.toLowerCase(), n);
      }

      // 4. Sort descending by date
      const merged = Array.from(map.values()).sort((a, b) => {
        const da = parseDateLabel(a.date);
        const db = parseDateLabel(b.date);
        return db.getTime() - da.getTime();
      });

      setAllNews(merged);
    } catch (err) {
      console.error(err);
      setAllNews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60000);
    const onFocus = () => fetchData();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchData]);

  return { allNews, loading, refetch: fetchData };
}
