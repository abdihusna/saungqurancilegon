import { useEffect, useState } from "react";
import type { NewsItem } from "@/data/newsData";

export function useDynamicNews() {
  const [dynamicNews, setDynamicNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("https://saungqurancilegon.id/hostinger-webhook/posts.php");

        const data = await res.json();

        if (cancelled) return;

        const normalized = (data || []).map((item: any) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt || "",
          content: item.content,
          date: item.date,
          category: item.category,
          image: item.image || undefined,
          gallery: item.gallery || [],
        }));

        setDynamicNews(normalized);
      } catch (err: any) {
        setError(err.message);
        setDynamicNews([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { dynamicNews, loading, error };
}
