import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Share2, Megaphone } from "lucide-react";

const PengumumanDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { announcements, loading } = useAnnouncements();

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 text-center text-muted-foreground">Memuat...</div>
      </Layout>
    );
  }

  const item = announcements.find((a) => a.slug?.toLowerCase() === slug?.toLowerCase());

  if (!item) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Pengumuman tidak ditemukan</h1>
            <Link to="/pengumuman">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Pengumuman
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: item.title, text: item.excerpt, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin!");
    }
  };

  return (
    <Layout>
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8">
        <div className="container">
          <Link to="/pengumuman" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Pengumuman
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <article className="max-w-3xl mx-auto">
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge>{item.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {item.date}
                </div>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">{item.title}</h1>
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                Bagikan
              </Button>
            </header>

            {item.image && (
              <div className="mb-8 rounded-xl overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-auto object-cover" />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              {(item.content || "")
                .replace(/\\n/g, "\n")
                .split("\n\n")
                .map((p, i) => (
                  <p key={i} className="mb-4 leading-relaxed">{p}</p>
                ))}
            </div>

            <footer className="mt-12 pt-8 border-t text-center">
              <p className="font-semibold">Saung Qur'an Cilegon</p>
              <p className="text-sm text-muted-foreground">Mewujudkan Generasi Qur'ani, Terampil, dan Mandiri</p>
            </footer>
          </article>
        </div>
      </section>
    </Layout>
  );
};

export default PengumumanDetail;
