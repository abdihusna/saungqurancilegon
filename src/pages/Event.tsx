import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Lightbox } from "@/components/shared/Lightbox";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { newsData } from "@/data/newsData";

import thufulahBerkebun from "@/assets/gallery/thufulah-berkebun.jpg";
import thufulahKolam from "@/assets/gallery/thufulah-kolam.jpg";
import thufulahOutbond from "@/assets/gallery/thufulah-outbond.jpg";
import mengaji from "@/assets/gallery/mengaji.jpg";
import cookingClass from "@/assets/gallery/cooking-class.jpg";
import kegiatanBersama from "@/assets/gallery/kegiatan-bersama.jpg";
import makanBersama from "@/assets/gallery/makan-bersama.jpg";
import ternak from "@/assets/gallery/ternak.jpg";
import kajianParenting from "@/assets/news/kajian-parenting.jpeg";

const latestGallery = [
  { src: thufulahBerkebun, alt: "Program Thufulah - Berkebun", date: "30 Januari 2025" },
  { src: thufulahKolam, alt: "Program Thufulah - Bermain Air", date: "30 Januari 2025" },
  { src: thufulahOutbond, alt: "Program Thufulah - Outbond", date: "30 Januari 2025" },
  { src: mengaji, alt: "Kegiatan Mengaji Bersama", date: "10 Januari 2026" },
  { src: cookingClass, alt: "Cooking Class", date: "5 Januari 2026" },
  { src: kegiatanBersama, alt: "Kegiatan Bersama", date: "1 Januari 2026" },
  { src: makanBersama, alt: "Makan Bersama", date: "28 Desember 2025" },
  { src: ternak, alt: "Kegiatan Beternak", date: "22 Desember 2025" },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Wisuda Tahfidz Angkatan 2025",
    description: "Acara wisuda santri yang telah menyelesaikan program hafalan Al-Qur'an dengan berbagai tingkatan.",
    date: "25 Januari 2026",
    time: "08:00 WIB",
    location: "Aula Utama Saung Qur'an Cilegon",
    category: "Wisuda",
  },
  {
    id: 2,
    title: "Lomba Tahfidz Antar Santri",
    description: "Kompetisi hafalan Al-Qur'an untuk semua tingkatan santri dengan berbagai kategori.",
    date: "15 Februari 2026",
    time: "09:00 WIB",
    location: "Masjid Saung Qur'an Cilegon",
    category: "Lomba",
  },
  {
    id: 3,
    title: "Kajian Parenting: Membina Intelektualitas Anak Sejak Dini",
    description: "Kajian Parenting SQC bersama Ustadz Drs. Muhammad Rijal, Psi (Pembina Yayasan Al Hanif Cilegon, Independent Consultant, Trainer, Presenter & Conselor). Acara ini diselenggarakan sebagai bentuk kepedulian dalam mendidik peserta didik dan bukti komitmen orangtua dalam meningkatkan kapasitas keilmuan.",
    date: "25 Januari 2026 / 6 Sya'ban 1447 H",
    time: "08:00 - 10:00 WIB",
    location: "Saung Qur'an Cilegon (Saung Abu Bakr)",
    category: "Kajian",
    image: kajianParenting,
  },
];


const Event = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? latestGallery.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === latestGallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Event & Berita
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ikuti perkembangan terbaru kegiatan dan informasi dari Saung Qur'an Cilegon
          </p>
        </div>
      </section>

      {/* Latest Gallery Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <SectionHeader
            title="Gallery Terbaru"
            subtitle="Dokumentasi kegiatan terkini di Saung Qur'an Cilegon"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {latestGallery.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-sm font-medium">{image.alt}</p>
                    <p className="text-white/80 text-xs">{image.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <SectionHeader
            title="Agenda Mendatang"
            subtitle="Event dan kegiatan yang akan datang"
          />
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className={`hover:shadow-lg transition-shadow ${event.image ? 'md:col-span-3' : ''}`}>
                <div className={event.image ? 'flex flex-col md:flex-row' : ''}>
                  {event.image && (
                    <div className="md:w-1/3 flex-shrink-0">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{event.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <SectionHeader
            title="Berita & Informasi Terbaru"
            subtitle="Kabar terkini seputar Saung Qur'an Cilegon"
          />
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {newsData.map((news) => (
              <Card key={news.id} className={`hover:shadow-lg transition-shadow group ${news.image ? 'md:col-span-2' : ''}`}>
                <CardContent className={`p-6 ${news.image ? 'flex flex-col md:flex-row gap-6' : ''}`}>
                  {news.image && (
                    <div className="md:w-1/3 flex-shrink-0">
                      <img 
                        src={news.image} 
                        alt={news.title}
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <div className={news.image ? 'flex-1' : ''}>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge>{news.category}</Badge>
                      <span className="text-sm text-muted-foreground">{news.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{news.excerpt}</p>
                    <Link to={`/berita/${news.slug}`}>
                      <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto text-primary">
                        Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={latestGallery}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </Layout>
  );
};

export default Event;
