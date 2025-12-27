import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Lightbox } from "@/components/shared/Lightbox";
import { BookOpen, Mic, Palette, Swords, Heart, Music } from "lucide-react";

const extracurriculars = [
  {
    name: "Tahfidz Al-Qur'an",
    icon: BookOpen,
    description: "Program unggulan hafalan Al-Qur'an dengan metode talaqqi dan muroja'ah intensif",
    schedule: "Setiap hari setelah Subuh dan Ashar",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tilawah & Qira'at",
    icon: Mic,
    description: "Pembelajaran seni membaca Al-Qur'an dengan tajwid dan lagu yang indah",
    schedule: "Senin & Kamis, 15:00 - 16:30",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Kaligrafi",
    icon: Palette,
    description: "Seni menulis huruf Arab yang indah dengan berbagai gaya khat",
    schedule: "Selasa & Jumat, 15:00 - 16:30",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pencak Silat",
    icon: Swords,
    description: "Bela diri tradisional Indonesia untuk melatih fisik dan mental",
    schedule: "Rabu & Sabtu, 15:00 - 17:00",
    image: "https://images.unsplash.com/photo-1544298621-35a989dc4f60?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pramuka",
    icon: Heart,
    description: "Kegiatan kepramukaan untuk membentuk karakter dan kepemimpinan",
    schedule: "Sabtu, 14:00 - 16:00",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Hadroh & Marawis",
    icon: Music,
    description: "Seni musik Islami dengan rebana dan alat musik tradisional",
    schedule: "Rabu & Sabtu, 15:00 - 16:30",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
  },
];

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
    alt: "Kegiatan Tahfidz",
  },
  {
    src: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?auto=format&fit=crop&w=800&q=80",
    alt: "Latihan Pencak Silat",
  },
  {
    src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80",
    alt: "Kegiatan Pramuka",
  },
  {
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    alt: "Penampilan Hadroh",
  },
];

const Ekstrakurikuler = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 animate-fade-up">
              Ekstrakurikuler
            </h1>
            <p className="text-lg text-primary-foreground/90 animate-fade-up delay-100">
              Kegiatan pengembangan bakat dan minat santri
            </p>
          </div>
        </div>
      </section>

      {/* Extracurricular List */}
      <section className="py-20 bg-background islamic-pattern">
        <div className="container">
          <SectionHeader
            title="Daftar Ekstrakurikuler"
            subtitle="Berbagai kegiatan untuk mengembangkan potensi santri"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extracurriculars.map((item, index) => (
              <div key={index} className="islamic-card overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="p-2 bg-primary rounded-lg">
                      <item.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <span className="bg-accent px-3 py-1 rounded-full">
                      {item.schedule}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-20 bg-muted">
        <div className="container">
          <SectionHeader
            title="Jadwal Kegiatan"
            subtitle="Jadwal kegiatan ekstrakurikuler mingguan"
          />

          <div className="max-w-4xl mx-auto">
            <div className="islamic-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary text-primary-foreground">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Hari</th>
                      <th className="px-6 py-4 text-left font-semibold">Kegiatan</th>
                      <th className="px-6 py-4 text-left font-semibold">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 font-medium">Senin</td>
                      <td className="px-6 py-4">Tilawah & Qira'at</td>
                      <td className="px-6 py-4 text-muted-foreground">15:00 - 16:30</td>
                    </tr>
                    <tr className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 font-medium">Selasa</td>
                      <td className="px-6 py-4">Kaligrafi</td>
                      <td className="px-6 py-4 text-muted-foreground">15:00 - 16:30</td>
                    </tr>
                    <tr className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 font-medium">Rabu</td>
                      <td className="px-6 py-4">Pencak Silat, Hadroh</td>
                      <td className="px-6 py-4 text-muted-foreground">15:00 - 17:00</td>
                    </tr>
                    <tr className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 font-medium">Kamis</td>
                      <td className="px-6 py-4">Tilawah & Qira'at</td>
                      <td className="px-6 py-4 text-muted-foreground">15:00 - 16:30</td>
                    </tr>
                    <tr className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 font-medium">Jumat</td>
                      <td className="px-6 py-4">Kaligrafi</td>
                      <td className="px-6 py-4 text-muted-foreground">15:00 - 16:30</td>
                    </tr>
                    <tr className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 font-medium">Sabtu</td>
                      <td className="px-6 py-4">Pramuka, Pencak Silat, Hadroh</td>
                      <td className="px-6 py-4 text-muted-foreground">14:00 - 17:00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-background">
        <div className="container">
          <SectionHeader
            title="Galeri Kegiatan"
            subtitle="Dokumentasi kegiatan ekstrakurikuler"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl cursor-pointer group aspect-square"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium text-sm">
                    Lihat Foto
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={galleryImages}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
          onNext={() => setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
        />
      )}
    </Layout>
  );
};

export default Ekstrakurikuler;
