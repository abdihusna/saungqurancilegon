import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { PageTransition } from "@/components/shared/PageTransition";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, Phone } from "lucide-react";

const faqCategories = [
  {
    category: "Pendaftaran & Penerimaan",
    questions: [
      {
        question: "Bagaimana cara mendaftar di Saung Qur'an Cilegon?",
        answer: "Pendaftaran dapat dilakukan secara online melalui website kami di halaman Pendaftaran atau langsung datang ke lokasi sekolah. Anda perlu mengisi formulir pendaftaran dan melengkapi dokumen yang diperlukan seperti akta kelahiran, kartu keluarga, dan pas foto.",
      },
      {
        question: "Berapa biaya pendaftaran dan SPP?",
        answer: "Untuk informasi biaya pendaftaran dan SPP terbaru, silakan hubungi admin kami melalui WhatsApp di +62 851-8785-5124 atau datang langsung ke sekolah untuk konsultasi lebih lanjut.",
      },
      {
        question: "Apa saja program pendidikan yang tersedia?",
        answer: "Kami memiliki 3 jenjang program: STASAQUR (PAUD/TK) untuk usia 4-6 tahun, TAKLIM (SD Islam) untuk usia 6-12 tahun, dan TAMYIZ (SMP Islam) untuk usia 12-15 tahun. Setiap program mengintegrasikan kurikulum nasional dengan program tahfidz Al-Qur'an.",
      },
      {
        question: "Kapan periode pendaftaran santri baru?",
        answer: "Pendaftaran Santri Baru (SPMB) biasanya dibuka mulai bulan Januari untuk tahun ajaran berikutnya. Namun, pendaftaran juga bisa dilakukan sepanjang tahun sesuai ketersediaan kuota. Pantau terus halaman Event untuk informasi terbaru.",
      },
    ],
  },
  {
    category: "Program Tahfidz",
    questions: [
      {
        question: "Berapa target hafalan Al-Qur'an untuk setiap jenjang?",
        answer: "Target hafalan disesuaikan dengan jenjang: STASAQUR (PAUD/TK) target Juz 30, TAKLIM (SD) target 5-10 Juz, dan TAMYIZ (SMP) target 10-15 Juz. Program Tasmi' (setoran hafalan) dilakukan secara rutin dengan pembimbing.",
      },
      {
        question: "Bagaimana metode pembelajaran tahfidz di SQC?",
        answer: "Kami menggunakan metode Talaqqi dan Tasmi' dengan pembimbing yang berkompeten. Santri menghafal secara bertahap dengan target harian, kemudian menyetorkan hafalan kepada ustadz/ustadzah. Ada juga program muroja'ah (mengulang hafalan) secara berkala.",
      },
      {
        question: "Apakah ada program untuk anak yang belum bisa membaca Al-Qur'an?",
        answer: "Ya, kami memiliki program Tahsin (perbaikan bacaan) untuk santri yang belum lancar membaca Al-Qur'an. Program ini menggunakan metode yang mudah dipahami anak-anak sebelum mereka masuk ke program tahfidz.",
      },
    ],
  },
  {
    category: "Fasilitas & Kegiatan",
    questions: [
      {
        question: "Apa saja fasilitas yang tersedia di SQC?",
        answer: "Fasilitas kami meliputi: ruang kelas ber-AC, masjid untuk kegiatan ibadah, perpustakaan, laboratorium komputer, area bermain outdoor, kolam renang, kebun edukasi, dan kandang ternak untuk pembelajaran praktis.",
      },
      {
        question: "Apa saja kegiatan ekstrakurikuler yang tersedia?",
        answer: "Ekstrakurikuler kami meliputi: Renang, English Club, Fotografi, Berkuda & Memanah, Futsal, dan Menggambar & Kaligrafi. Kegiatan dilaksanakan sesuai jadwal mingguan yang telah ditentukan.",
      },
      {
        question: "Apakah ada program outing atau field trip?",
        answer: "Ya, kami rutin mengadakan kegiatan outbond, field trip edukatif, dan kunjungan ke tempat-tempat bersejarah Islam. Kegiatan ini bertujuan untuk memperluas wawasan santri dan menumbuhkan rasa cinta terhadap alam dan sejarah.",
      },
    ],
  },
  {
    category: "Kurikulum & Pembelajaran",
    questions: [
      {
        question: "Apakah SQC menggunakan kurikulum nasional?",
        answer: "Ya, kami mengintegrasikan Kurikulum Merdeka dari Kemendikbud dengan kurikulum keislaman. Santri mendapatkan pendidikan akademik yang berstandar nasional sekaligus pembinaan karakter Islami dan program tahfidz.",
      },
      {
        question: "Bagaimana sistem penilaian di SQC?",
        answer: "Penilaian dilakukan secara komprehensif meliputi: ujian akademik, penilaian hafalan Al-Qur'an, penilaian akhlak dan karakter, serta partisipasi dalam kegiatan sekolah. Laporan kemajuan santri diberikan secara berkala kepada orang tua.",
      },
      {
        question: "Apakah ada konsultasi dengan orang tua?",
        answer: "Ya, kami mengadakan pertemuan orang tua secara rutin dan kajian parenting untuk mendukung pendidikan anak di rumah. Orang tua juga bisa berkonsultasi langsung dengan wali kelas atau guru pembimbing.",
      },
    ],
  },
  {
    category: "Informasi Umum",
    questions: [
      {
        question: "Dimana lokasi Saung Qur'an Cilegon?",
        answer: "Kami berlokasi di Link Ciberko Gg. Makam, RT.001/RW.003, Kalitimbang, Kec. Cibeber, Kota Cilegon, Banten 42426. Anda bisa menggunakan Google Maps untuk petunjuk arah ke lokasi kami.",
      },
      {
        question: "Bagaimana jam operasional sekolah?",
        answer: "Jam operasional kami: Senin-Jumat pukul 07:00-16:00 WIB, dan Sabtu pukul 07:00-12:00 WIB. Untuk kunjungan atau konsultasi, kami sarankan untuk menghubungi terlebih dahulu.",
      },
      {
        question: "Bagaimana cara menghubungi SQC?",
        answer: "Anda bisa menghubungi kami melalui WhatsApp di +62 851-8785-5124, telepon di +62 877-8181-8143, atau email ke admin@saungqurancilegon.id. Kami juga aktif di media sosial Instagram, Facebook, dan YouTube.",
      },
    ],
  },
];

const FAQ = () => {
  useSmoothScroll();

  return (
    <Layout>
      <PageTransition>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
          <div className="container text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan umum seputar Saung Qur'an Cilegon
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16 bg-background">
          <div className="container max-w-4xl">
            {faqCategories.map((category, categoryIndex) => (
              <AnimatedSection key={categoryIndex} delay={categoryIndex * 0.1}>
                <div className="mb-10">
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    {category.category}
                  </h2>
                  <Card>
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((faq, faqIndex) => (
                          <AccordionItem
                            key={faqIndex}
                            value={`${categoryIndex}-${faqIndex}`}
                            className="border-b last:border-b-0"
                          >
                            <AccordionTrigger className="px-6 text-left hover:no-underline">
                              <span className="text-base font-medium">
                                {faq.question}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4">
                              <p className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <AnimatedSection>
          <section className="py-16 bg-muted/30">
            <div className="container text-center">
              <SectionHeader
                title="Masih Punya Pertanyaan?"
                subtitle="Tim kami siap membantu menjawab pertanyaan Anda"
              />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Button asChild size="lg" className="gap-2">
                  <a
                    href="https://wa.me/6285187855124"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat via WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link to="/hubungi-kami">
                    <Phone className="h-5 w-5" />
                    Hubungi Kami
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </PageTransition>
    </Layout>
  );
};

export default FAQ;
