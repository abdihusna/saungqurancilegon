import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Lightbox } from "@/components/shared/Lightbox";
import { newsData } from "@/data/newsData";
import { useDynamicNews } from "@/hooks/useDynamicNews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Share2, Images } from "lucide-react";

const BeritaDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { dynamicNews, loading } = useDynamicNews();

  // ✅ Hooks HARUS di atas (fix error sebelumnya)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Gabung data
  const news = [...dynamicNews, ...newsData].find((n) => n.slug?.toLowerCase() === slug?.toLowerCase());

  // ✅ Loading
  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  // ❌ Jika tidak ditemukan
  if (!news) {
    return (
      <Layout>
        <section className="py-20 bg-background">
          <div className="container text-center">
            <h1 className="text-2xl font-bold mb-4">Berita tidak ditemukan</h1>
            <Link to="/event">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Event
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  // ✅ Helper functions
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin!");
    }
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPrev = () => {
    if (news.gallery) {
      setCurrentIndex((prev) => (prev === 0 ? news.gallery!.length - 1 : prev - 1));
    }
  };

  const goToNext = () => {
    if (news.gallery) {
      setCurrentIndex((prev) => (prev === news.gallery!.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8 md:py-12">
        <div className="container">
          <Link to="/event" className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Event & Berita
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-background">
        <div className="container">
          <article className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge>{news.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  {news.date}
                </div>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">{news.title}</h1>

              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                Bagikan
              </Button>
            </header>

            {/* Image */}
            {news.image && (
              <div className="mb-8 rounded-xl overflow-hidden">
                <img src={news.image} alt={news.title} className="w-full h-auto object-cover" />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {(news.content || "")
                .replace(/\\n/g, "\n")
                .split("\n\n")
                .map((paragraph, index) => {
                  const formattedText = paragraph
                    .split("**")
                    .map((text, i) => (i % 2 === 1 ? <strong key={i}>{text}</strong> : text));

                  if (paragraph.startsWith("---")) {
                    return <hr key={index} className="my-6" />;
                  }

                  if (paragraph.startsWith("- ")) {
                    return (
                      <ul key={index} className="list-disc list-inside my-4">
                        {paragraph.split("\n").map((item, i) => (
                          <li key={i}>{item.replace("- ", "")}</li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p key={index} className="mb-4 leading-relaxed">
                      {formattedText}
                    </p>
                  );
                })}
            </div>

            {/* Gallery */}
            {news.gallery && news.gallery.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-2 mb-6">
                  <Images className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold">Galeri Foto</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {news.gallery.map((image, index) => (
                    <div key={index} onClick={() => openLightbox(index)} className="cursor-pointer">
                      <img src={image.src} alt={image.alt} className="rounded-xl" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <footer className="mt-12 pt-8 border-t text-center">
              <p className="font-semibold">Saung Qur'an Cilegon</p>
              <p className="text-sm text-muted-foreground">Mewujudkan Generasi Qur'ani, Terampil, dan Mandiri</p>
            </footer>
          </article>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && news.gallery && (
        <Lightbox
          images={news.gallery}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </Layout>
  );
};

export default BeritaDetail;
