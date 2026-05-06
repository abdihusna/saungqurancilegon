import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Search, X, ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAnnouncements } from "@/hooks/useAnnouncements";

const PAGE_SIZE = 6;

const Pengumuman = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [page, setPage] = useState(1);
  const { announcements, loading } = useAnnouncements();

  const categories = useMemo(() => {
    const set = new Set<string>();
    announcements.forEach((a) => a.category && set.add(a.category));
    return ["Semua", ...Array.from(set)];
  }, [announcements]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return announcements.filter((a) => {
      const matchCat = activeCategory === "Semua" || a.category === activeCategory;
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [searchQuery, activeCategory, announcements]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const resetPage = () => setPage(1);

  return (
    <Layout>
      <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 mb-3 text-primary">
            <Megaphone className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wide">Info Resmi</span>
          </div>
          <h1 className="font-serif text-4xl font-bold mb-3">Pengumuman</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Informasi resmi dari Saung Qur'an Cilegon
          </p>

          <div className="max-w-md mx-auto relative mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari pengumuman atau slug..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); resetPage(); }}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); resetPage(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
            <div className="text-center py-10 text-muted-foreground">Memuat pengumuman...</div>
          ) : paginated.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((a) => (
                  <Card key={a.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                    {a.image && (
                      <img src={a.image} alt={a.title} className="w-full h-48 object-cover" loading="lazy" />
                    )}
                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="secondary">{a.category}</Badge>
                        <span className="text-xs text-muted-foreground">{a.date}</span>
                      </div>
                      <h3 className="font-serif text-lg font-semibold mb-2 line-clamp-2">{a.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{a.excerpt}</p>
                      <Link to={`/pengumuman/${a.slug}`}>
                        <Button variant="ghost" size="sm" className="px-0 hover:bg-transparent hover:text-primary">
                          Lihat Detail →
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button key={p} variant={p === currentPage ? "default" : "outline"} size="sm" onClick={() => setPage(p)} className="w-9">
                      {p}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <p className="text-center text-sm text-muted-foreground mt-4">
                Halaman {currentPage} dari {totalPages} · {filtered.length} pengumuman
              </p>
            </>
          ) : (
            <div className="text-center py-16">
              <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Belum ada pengumuman saat ini</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Pengumuman;
