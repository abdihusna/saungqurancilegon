import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Lightbox } from "@/components/shared/Lightbox";
import { PageTransition } from "@/components/shared/PageTransition";
import { AnimatedSection, AnimatedCard } from "@/components/shared/AnimatedSection";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { Waves, BookOpen, Camera, Globe, Swords, Dribbble, Palette } from "lucide-react";

import berkudaMemanah from "@/assets/gallery/berkuda-memanah.jpg";

const extracurriculars = [
  {
    name: "Renang",
    icon: Waves,
    description: "Olahraga air untuk melatih stamina, koordinasi tubuh, dan keberanian santri",
    schedule: "Senin, 14:00 - 15:30",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "English Club",
    icon: Globe,
    description: "Program pembelajaran bahasa Inggris interaktif untuk meningkatkan kemampuan komunikasi global",
    schedule: "Senin & Rabu, 13:05 - 14:05",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Fotografi",
    icon: Camera,
    description: "Belajar teknik fotografi dan seni visual untuk mengabadikan momen berharga",
    schedule: "Selasa, 14:00 - 15:00",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Berkuda & Memanah",
    icon: Swords,
    description: "Sunnah Rasulullah ﷺ untuk melatih keberanian, fokus, dan ketangkasan",
    schedule: "Rabu, 14:20 - 17:20",
    image: berkudaMemanah,
  },
  {
    name: "Futsal",
    icon: Dribbble,
    description: "Olahraga tim untuk melatih kerjasama, strategi, dan kebugaran fisik",
    schedule: "Kamis, 14:15 - 17:00",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Menggambar & Kaligrafi",
    icon: Palette,
    description: "Seni visual dan kaligrafi Arab untuk mengembangkan kreativitas dan keindahan tulisan",
    schedule: "Jumat, 10:30 - 11:30",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
  },
];

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80",
    alt: "Kegiatan Renang",
  },
  {
    src: berkudaMemanah,
    alt: "Berkuda & Memanah",
  },
  {
    src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    alt: "Kegiatan Futsal",
  },
  {
    src: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80",
    alt: "Kaligrafi",
  },
];

const Ekstrakurikuler = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  useSmoothScroll();

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <Layout>
      <PageTransition>
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
        <AnimatedSection>
          <section className="py-20 bg-background islamic-pattern">
            <div className="container">
              <SectionHeader
                title="Daftar Ekstrakurikuler"
                subtitle="Berbagai kegiatan untuk mengembangkan potensi santri"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {extracurriculars.map((item, index) => (
                  <AnimatedCard key={index} index={index} className="islamic-card overflow-hidden group">
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
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Schedule */}
        <AnimatedSection delay={0.1}>
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
                          <td className="px-6 py-4">Renang</td>
                          <td className="px-6 py-4 text-muted-foreground">14:00 - 15:30</td>
                        </tr>
                        <tr className="hover:bg-accent/50 transition-colors">
                          <td className="px-6 py-4 font-medium">Senin</td>
                          <td className="px-6 py-4">English Club</td>
                          <td className="px-6 py-4 text-muted-foreground">13:05 - 14:05</td>
                        </tr>
                        <tr className="hover:bg-accent/50 transition-colors">
                          <td className="px-6 py-4 font-medium">Selasa</td>
                          <td className="px-6 py-4">Fotografi</td>
                          <td className="px-6 py-4 text-muted-foreground">14:00 - 15:00</td>
                        </tr>
                        <tr className="hover:bg-accent/50 transition-colors">
                          <td className="px-6 py-4 font-medium">Rabu</td>
                          <td className="px-6 py-4">English Club</td>
                          <td className="px-6 py-4 text-muted-foreground">13:05 - 14:05</td>
                        </tr>
                        <tr className="hover:bg-accent/50 transition-colors">
                          <td className="px-6 py-4 font-medium">Rabu</td>
                          <td className="px-6 py-4">Berkuda & Memanah</td>
                          <td className="px-6 py-4 text-muted-foreground">14:20 - 17:20</td>
                        </tr>
                        <tr className="hover:bg-accent/50 transition-colors">
                          <td className="px-6 py-4 font-medium">Kamis</td>
                          <td className="px-6 py-4">Futsal</td>
                          <td className="px-6 py-4 text-muted-foreground">14:15 - 17:00</td>
                        </tr>
                        <tr className="hover:bg-accent/50 transition-colors">
                          <td className="px-6 py-4 font-medium">Jumat</td>
                          <td className="px-6 py-4">Menggambar & Kaligrafi</td>
                          <td className="px-6 py-4 text-muted-foreground">10:30 - 11:30</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Gallery */}
        <AnimatedSection delay={0.2}>
          <section className="py-20 bg-background">
            <div className="container">
              <SectionHeader
                title="Galeri Kegiatan"
                subtitle="Dokumentasi kegiatan ekstrakurikuler"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <AnimatedCard
                    key={index}
                    index={index}
                    className="relative overflow-hidden rounded-xl cursor-pointer group aspect-square"
                  >
                    <div onClick={() => openLightbox(index)} className="w-full h-full">
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
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

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
      </PageTransition>
    </Layout>
  );
};

export default Ekstrakurikuler;
