import { useEffect, useState, useCallback } from "react";
import type { NewsItem } from "@/data/newsData";

const ENDPOINT = "https://saungqurancilegon.id/hostinger-webhook/posts.php";

export function useDynamicNews() {
  const [dynamicNews, setDynamicNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${ENDPOINT}?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data?.posts ?? []);
      const posts: NewsItem[] = list.map((item: any) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt || "",
        content: item.content,
        date: item.date,
        category: item.category,
        image: item.image,
        gallery: item.gallery || [],
      }));
      setDynamicNews(posts);
    } catch (err) {
      console.error(err);
      setDynamicNews([]);
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

  return { dynamicNews, loading, refetch: fetchData };
}
