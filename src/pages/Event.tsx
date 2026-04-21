import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Lightbox } from "@/components/shared/Lightbox";
import { Calendar, Clock, MapPin, ArrowRight, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsData } from "@/data/newsData";
import { useDynamicNews } from "@/hooks/useDynamicNews";
import { Skeleton } from "@/components/ui/skeleton";

const Event = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { dynamicNews, loading } = useDynamicNews();

  // 🔥 INI KUNCI UTAMA (FALLBACK)
  const allNews = dynamicNews.length > 0 ? dynamicNews : newsData;

  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return allNews;
    const query = searchQuery.toLowerCase();
    return allNews.filter(
      (news) =>
        news.title.toLowerCase().includes(query) ||
        news.excerpt.toLowerCase().includes(query) ||
        news.category.toLowerCase().includes(query) ||
        news.content.toLowerCase().includes(query),
    );
  }, [searchQuery, allNews]);

  return (
    <Layout>
      <section className="py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Berita & Informasi Terbaru</h1>

          <div className="max-w-md mx-auto relative mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
            <Input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container">
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : filteredNews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredNews.map((news) => (
                <Card key={news.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge>{news.category}</Badge>
                      <span className="text-sm">{news.date}</span>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">{news.title}</h3>

                    <p className="text-sm mb-4">{news.excerpt}</p>

                    <Link to={`/berita/${news.slug}`}>
                      <Button variant="ghost" size="sm">
                        Baca Selengkapnya →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">Tidak ada berita ditemukan</div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Event;
