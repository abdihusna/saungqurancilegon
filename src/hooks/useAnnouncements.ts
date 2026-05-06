import { useEffect, useState, useCallback } from "react";

export interface Announcement {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string | null;
  gallery?: { src: string; alt: string }[];
  tags?: string[];
}

const ENDPOINT = "https://saungqurancilegon.id/hostinger-webhook/announcements.php";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // cache busting query param + no-store
      const res = await fetch(`${ENDPOINT}?t=${Date.now()}`, { cache: "no-store" });
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data?.posts ?? []);
      const items: Announcement[] = list.map((it: any) => ({
        id: it.id,
        slug: it.slug,
        title: it.title,
        excerpt: it.excerpt || "",
        content: it.content || "",
        date: it.date || "",
        category: it.category || "Pengumuman",
        image: it.image || null,
        gallery: it.gallery || [],
        tags: it.tags || [],
      }));
      setAnnouncements(items);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Gagal memuat pengumuman");
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto refresh tiap 60 detik
    const id = setInterval(fetchData, 60000);
    // Refetch saat tab kembali fokus
    const onFocus = () => fetchData();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchData]);

  return { announcements, loading, error, refetch: fetchData };
}
