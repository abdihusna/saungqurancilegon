import { useEffect, useState } from "react";
import type { NewsItem } from "@/data/newsData";

export function useDynamicNews() {
  const [dynamicNews, setDynamicNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://saungqurancilegon.id/hostinger-webhook/posts.php");
        const data = await res.json();

        const posts: NewsItem[] = (data.posts || []).map((item: any) => ({
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
    })();
  }, []);

  return { dynamicNews, loading };
}
