import { useEffect, useState } from "react";
import type { NewsItem, GalleryImage } from "@/data/newsData";

/**
 * Hook untuk fetch berita dinamis dari webhook PHP di Hostinger.
 * Berita dinamis akan digabung dengan newsData statis di komponen pemanggil.
 */

const POSTS_ENDPOINT = "https://saungqurancilegon.id/hostinger-webhook/posts.php";

interface DynamicPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author?: string;
  tags?: string[];
  image?: string | null;
  gallery?: { src: string; alt: string }[];
  created_at?: string;
}

function normalize(p: DynamicPost): NewsItem {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    date: p.date,
    category: p.category,
    image: p.image || undefined,
    gallery: (p.gallery || []) as GalleryImage[],
  };
}

export function useDynamicNews() {
  const [dynamicNews, setDynamicNews] = useState<NewsItem[]>([]);
  // mulai dari false agar tidak tampak skeleton kalau endpoint belum tersedia
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    fetch(POSTS_ENDPOINT, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        if (cancelled) return;
        const posts: DynamicPost[] = Array.isArray(data?.posts) ? data.posts : [];
        setDynamicNews(posts.map(normalize));
      })
      .catch((err) => {
        if (cancelled || err.name === "AbortError") return;
        // Diam saja kalau endpoint belum di-deploy / domain belum aktif
        setError(err.message);
        setDynamicNews([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return { dynamicNews, loading, error };
}
