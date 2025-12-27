import { useState } from "react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Lightbox } from "@/components/shared/Lightbox";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
    alt: "Kegiatan hafalan Al-Qur'an",
  },
  {
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    alt: "Upacara wisuda tahfidz",
  },
  {
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    alt: "Kegiatan belajar di kelas",
  },
  {
    src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80",
    alt: "Kegiatan outdoor santri",
  },
  {
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    alt: "Perayaan Hari Besar Islam",
  },
  {
    src: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?auto=format&fit=crop&w=800&q=80",
    alt: "Kegiatan ekstrakurikuler",
  },
];

export function GallerySection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <SectionHeader
          title="Galeri Kegiatan"
          subtitle="Dokumentasi kegiatan dan momen berharga di Saung Qur'an Cilegon"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  Lihat Foto
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={galleryImages}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </section>
  );
}
