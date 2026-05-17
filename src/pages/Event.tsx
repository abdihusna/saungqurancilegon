import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAllNews } from "@/hooks/useAllNews";

const PAGE_SIZE = 6;

const Event = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [page, setPage] = useState(1);
  const { allNews, loading } = useAllNews();

  const categories = useMemo(() => {
    const set = new Set<string>();
    allNews.forEach((n) => n.category && set.add(n.category));
    return ["Semua", ...Array.from(set)];
  }, [allNews]);

  const filteredNews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allNews.filter((news) => {
      let matchCat = activeCategory === "Semua" || news.category === activeCategory;
      // Tampilkan "Prestasi Santri" juga saat kategori "Program" dipilih
      if (activeCategory === "Program" && news.category === "Prestasi Santri") {
        matchCat = true;
      }
      const matchSearch =
        !q ||
        news.title.toLowerCase().includes(q) ||
        news.excerpt.toLowerCase().includes(q) ||
        (news.slug || "").toLowerCase().includes(q) ||
        (news.content || "").toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [searchQuery, activeCategory, allNews]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filteredNews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <Layout>
      <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container text-center">
          <h1 className="font-serif text-4xl font-bold mb-3">Event & Berita</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kabar terbaru kegiatan dan prestasi Saung Qur'an Cilegon
          </p>

          <div className="max-w-md mx-auto relative mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari berita atau slug..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); resetPage(); }}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); resetPage(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); resetPage(); }}
                className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Memuat berita...</div>
          ) : paginated.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((news) => (
                  <Card key={news.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                    {news.image && (
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    )}
                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge>{news.category}</Badge>
                        <span className="text-xs text-muted-foreground">{news.date}</span>
                      </div>
                      <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2">{news.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{news.excerpt}</p>
                      <Link to={`/berita/${news.slug}`}>
                        <Button variant="ghost" size="sm" className="px-0 hover:bg-transparent hover:text-primary">
                          Baca Selengkapnya →
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(p)}
                      className="w-9"
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <p className="text-center text-sm text-muted-foreground mt-4">
                Halaman {currentPage} dari {totalPages} · {filteredNews.length} berita
              </p>
            </>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              Tidak ada berita ditemukan
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Event;
