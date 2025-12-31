import { useState } from "react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Lightbox } from "@/components/shared/Lightbox";

// Import gallery images
import kegiatanKomputer from "@/assets/gallery/kegiatan-komputer.jpg";
import belajarKomputer from "@/assets/gallery/belajar-komputer.jpg";
import berkebun from "@/assets/gallery/berkebun.jpg";
import mengaji from "@/assets/gallery/mengaji.jpg";
import ternak from "@/assets/gallery/ternak.jpg";
import kegiatanBersama from "@/assets/gallery/kegiatan-bersama.jpg";
import cookingClass from "@/assets/gallery/cooking-class.jpg";
import berkebunBersama from "@/assets/gallery/berkebun-bersama.jpg";
import makanBersama from "@/assets/gallery/makan-bersama.jpg";
import belajarOutdoor from "@/assets/gallery/belajar-outdoor.jpg";

const galleryImages = [
  {
    src: mengaji,
    alt: "Kegiatan mengaji Al-Qur'an",
  },
  {
    src: belajarOutdoor,
    alt: "Belajar di saung outdoor",
  },
  {
    src: belajarKomputer,
    alt: "Kegiatan belajar komputer",
  },
  {
    src: kegiatanKomputer,
    alt: "Santri belajar komputer",
  },
  {
    src: berkebunBersama,
    alt: "Berkebun bersama di kebun sekolah",
  },
  {
    src: berkebun,
    alt: "Santri belajar menanam",
  },
  {
    src: ternak,
    alt: "Kegiatan ternak ayam",
  },
  {
    src: kegiatanBersama,
    alt: "Kegiatan bersama santriwati",
  },
  {
    src: cookingClass,
    alt: "Kegiatan cooking class",
  },
  {
    src: makanBersama,
    alt: "Makan bersama keluarga besar",
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
