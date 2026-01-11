import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Lightbox } from "@/components/shared/Lightbox";
import { Building, BookOpen, Clock, GraduationCap, Target, CheckCircle, Image } from "lucide-react";

import belajarKomputer from "@/assets/gallery/belajar-komputer.jpg";
import belajarOutdoor from "@/assets/gallery/belajar-outdoor.jpg";
import berkebunBersama from "@/assets/gallery/berkebun-bersama.jpg";
import berkebun from "@/assets/gallery/berkebun.jpg";
import cookingClass from "@/assets/gallery/cooking-class.jpg";
import kegiatanBersama from "@/assets/gallery/kegiatan-bersama.jpg";
import kegiatanKomputer from "@/assets/gallery/kegiatan-komputer.jpg";
import makanBersama from "@/assets/gallery/makan-bersama.jpg";
import mengaji from "@/assets/gallery/mengaji.jpg";
import ternak from "@/assets/gallery/ternak.jpg";

const programs = [
  {
    name: "Program Thufulah",
    description: "Thufulah adalah Program Pendidikan Anak Usia Dini (PAUD) Karakter Nabawiyah Taman Saung Qur'an (TASAQUR) untuk Usia 4-6 Tahun dalam rangka mewujudkan generasi berkarakter, beriman dan Cinta Al-Qur'an sejak usia dini dengan metode yang menyenangkan, bermain, bermakna, tumbuh dengan iman sesuai fitrah anak.",
    duration: "2 Tahun",
    icon: BookOpen,
    curriculum: [
      "Pendidikan Karakter Nabawiyah",
      "Pengenalan Al-Qur'an dengan metode menyenangkan",
      "Bermain sambil belajar sesuai fitrah anak",
      "Penanaman nilai iman dan cinta Al-Qur'an",
      "Pengembangan motorik dan kreativitas",
    ],
    targets: [
      "Anak berkarakter sesuai nilai-nilai Nabawiyah",
      "Anak beriman dan cinta Al-Qur'an sejak dini",
      "Tumbuh sesuai fitrah dengan metode yang menyenangkan",
      "Siap melanjutkan ke jenjang pendidikan dasar",
    ],
    gallery: [
      { src: cookingClass, alt: "Kegiatan cooking class anak-anak Thufulah" },
      { src: kegiatanBersama, alt: "Kegiatan bersama anak-anak Thufulah" },
      { src: makanBersama, alt: "Makan bersama anak-anak Thufulah" },
    ],
  },
  {
    name: "Program Tamyiz",
    description: "Tamyiz adalah Program Pendidikan Karakter untuk Usia Sekolah Dasar (SD), dalam rangka mewujudkan generasi Qur'ani yang terampil dan mandiri. Program ini ditunjang dengan Kurikulum Karakter Nabawiyah dengan metode pembelajaran yang berbasis project serta mengintegrasikan pembelajaran Al-Qur'an, Diniyah dan Kurikulum Nasional.",
    duration: "6 Tahun",
    icon: BookOpen,
    curriculum: [
      "Kurikulum Karakter Nabawiyah",
      "Pembelajaran Al-Qur'an terintegrasi",
      "Pendidikan Diniyah (Fiqh, Aqidah, Akhlak)",
      "Kurikulum Nasional berbasis project",
      "Pengembangan keterampilan dan kemandirian",
    ],
    targets: [
      "Generasi Qur'ani yang terampil dan mandiri",
      "Mampu mengintegrasikan nilai Al-Qur'an dalam kehidupan",
      "Menguasai ilmu Diniyah dan akademik nasional",
      "Memiliki karakter Nabawiyah yang kuat",
    ],
    gallery: [
      { src: belajarKomputer, alt: "Kegiatan belajar komputer santri Tamyiz" },
      { src: berkebun, alt: "Kegiatan berkebun santri Tamyiz" },
      { src: belajarOutdoor, alt: "Pembelajaran outdoor santri Tamyiz" },
    ],
  },
  {
    name: "Program Murohaqoh",
    description: "Program Murohaqoh adalah Program Pendidikan Jenjang SMP yang bersifat Bonding dan Boarding School. Program ini dalam rangka mewujudkan generasi Qur'ani yang solih dan muslih, berakhlakul karimah dan bermanfaat untuk umat.",
    duration: "3 Tahun",
    icon: GraduationCap,
    curriculum: [
      "Program Bonding & Boarding School",
      "Tahfidz dan Tahsin Al-Qur'an",
      "Kurikulum SMP Nasional terintegrasi",
      "Pendidikan Akhlak dan Adab Islami",
      "Pengembangan kepemimpinan dan dakwah",
    ],
    targets: [
      "Generasi Qur'ani yang solih dan muslih",
      "Berakhlakul karimah sesuai tuntunan Islam",
      "Bermanfaat untuk umat dan masyarakat",
      "Lulus pendidikan SMP dengan nilai baik",
    ],
    gallery: [
      { src: kegiatanKomputer, alt: "Kegiatan komputer santri Murohaqoh" },
      { src: berkebunBersama, alt: "Kegiatan berkebun bersama santri Murohaqoh" },
      { src: ternak, alt: "Kegiatan beternak santri Murohaqoh" },
    ],
  },
  {
    name: "Program Bimbel Qur'an & Akademik",
    description: "Program TALQIN (Tahsin Al-Qur'an Intensif) yaitu Program Bimbingan Belajar Al-Qur'an yang bersifat intensif dengan menggunakan metode pembelajaran Al-Qur'an Metode 'Ali. Program ini dilaksanakan di sore hari untuk usia mulai 4 tahun hingga usia SMP.",
    duration: "6 Level",
    icon: Building,
    curriculum: [
      "Tahsin Al-Qur'an dengan Metode 'Ali",
      "Pembelajaran intensif sore hari",
      "Pengenalan huruf dan makharijul huruf",
      "Tajwid dasar hingga lanjutan (6 level)",
      "Muraja'ah dan praktek membaca Al-Qur'an",
    ],
    targets: [
      "Mampu membaca Al-Qur'an dengan baik dan benar",
      "Menguasai tajwid sesuai level masing-masing",
      "Fasih dalam makharijul huruf",
      "Siap melanjutkan ke program hafalan Al-Qur'an",
    ],
    gallery: [
      { src: mengaji, alt: "Kegiatan mengaji Program TALQIN" },
      { src: makanBersama, alt: "Kegiatan makan bersama peserta TALQIN" },
      { src: kegiatanBersama, alt: "Kegiatan bersama peserta TALQIN" },
    ],
  },
];

const ProgramPendidikan = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<{ src: string; alt: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (images: { src: string; alt: string }[], index: number) => {
    setCurrentImages(images);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
  };
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 animate-fade-up">
              Program Pendidikan
            </h1>
            <p className="text-lg text-primary-foreground/90 animate-fade-up delay-100">
              Program-program unggulan yang kami tawarkan
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-background islamic-pattern">
        <div className="container">
          <SectionHeader
            title="Program Unggulan"
            subtitle="Berbagai program pendidikan untuk mencetak generasi Qur'ani yang berakhlak mulia"
          />

          <div className="space-y-8">
            {programs.map((program, index) => {
              const IconComponent = program.icon;
              return (
                <div key={index} className="islamic-card p-6 md:p-8 hover:shadow-lg transition-shadow">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <div className="p-4 bg-accent rounded-xl w-fit">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3 className="font-serif text-2xl font-bold text-foreground">
                          {program.name}
                        </h3>
                        <span className="text-sm bg-secondary/20 text-secondary px-3 py-1.5 rounded-full flex items-center gap-1.5 w-fit">
                          <Clock className="h-4 w-4" />
                          {program.duration}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-2">
                        {program.description}
                      </p>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Curriculum */}
                    <div className="bg-muted/50 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-foreground">Kurikulum</h4>
                      </div>
                      <ul className="space-y-2">
                        {program.curriculum.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Targets */}
                    <div className="bg-accent/50 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-foreground">Target Capaian</h4>
                      </div>
                      <ul className="space-y-2">
                        {program.targets.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Gallery */}
                  {program.gallery && program.gallery.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Image className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-foreground">Galeri Kegiatan</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {program.gallery.map((image, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => openLightbox(program.gallery, imgIdx)}
                          >
                            <img
                              src={image.src}
                              alt={image.alt}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "4", label: "Program Unggulan" },
              { value: "200+", label: "Santri Aktif" },
              { value: "30", label: "Juz Target Tahfidz" },
              { value: "6", label: "Tahun Pendidikan" },
            ].map((stat, index) => (
              <div key={index}>
                <p className="font-serif text-4xl font-bold text-secondary mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={currentImages}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </Layout>
  );
};

export default ProgramPendidikan;
