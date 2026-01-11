import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Building, BookOpen, Clock, GraduationCap, Target, CheckCircle } from "lucide-react";

const programs = [
  {
    name: "Program Thufulah",
    description: "Program hafalan Al-Qur'an dengan target minimal 15 juz dalam 3 tahun dengan metode yang menyenangkan dan sesuai fitrah anak.",
    duration: "3 Tahun",
    icon: BookOpen,
    curriculum: [
      "Hafalan Al-Qur'an dengan metode Talaqqi",
      "Tajwid dan Makharijul Huruf",
      "Muraja'ah (pengulangan) harian",
      "Tadabbur ayat-ayat pilihan",
    ],
    targets: [
      "Minimal 15 Juz hafalan",
      "Lancar membaca Al-Qur'an dengan tajwid",
      "Memahami makna ayat-ayat penting",
    ],
  },
  {
    name: "Program Tamyiz",
    description: "Program hafalan Al-Qur'an 30 juz dengan metode talaqqi intensif untuk santri yang memiliki semangat tinggi dalam menghafal.",
    duration: "2 Tahun",
    icon: BookOpen,
    curriculum: [
      "Hafalan intensif 30 juz Al-Qur'an",
      "Setoran hafalan harian kepada ustadz/ustadzah",
      "Muraja'ah terstruktur dan terjadwal",
      "Ilmu Gharib dan Mutasyabihat",
    ],
    targets: [
      "Hafal 30 Juz Al-Qur'an",
      "Mahir dalam ilmu tajwid",
      "Mampu mengajarkan Al-Qur'an kepada orang lain",
    ],
  },
  {
    name: "Program Murohaqoh",
    description: "Pendidikan keagamaan komprehensif meliputi Fiqh, Aqidah, Akhlak, dan Bahasa Arab dengan pendekatan klasik yang teruji.",
    duration: "6 Tahun",
    icon: GraduationCap,
    curriculum: [
      "Fiqh Ibadah dan Muamalah",
      "Aqidah Ahlus Sunnah wal Jama'ah",
      "Akhlak dan Adab Islami",
      "Bahasa Arab (Nahwu, Sharaf, Muhadatsah)",
      "Sirah Nabawiyah dan Tarikh Islam",
    ],
    targets: [
      "Memahami dan mengamalkan ibadah dengan benar",
      "Memiliki akidah yang lurus sesuai Al-Qur'an dan Sunnah",
      "Berakhlak mulia sesuai tuntunan Rasulullah ﷺ",
      "Mampu membaca dan memahami kitab-kitab berbahasa Arab",
    ],
  },
  {
    name: "Program Bimbel Qur'an & Akademik",
    description: "Kurikulum nasional dengan penguatan pada sains dan matematika, dipadukan dengan nilai-nilai Islam dalam setiap pembelajaran.",
    duration: "6 Tahun",
    icon: Building,
    curriculum: [
      "Matematika dan Sains Terpadu",
      "Bahasa Indonesia dan Inggris",
      "Ilmu Pengetahuan Sosial",
      "Pendidikan Jasmani dan Kesehatan",
      "Keterampilan dan Seni",
    ],
    targets: [
      "Lulus ujian nasional dengan nilai baik",
      "Memiliki dasar keilmuan yang kuat",
      "Siap melanjutkan ke jenjang pendidikan lebih tinggi",
      "Mampu mengintegrasikan ilmu dengan nilai-nilai Islam",
    ],
  },
];

const ProgramPendidikan = () => {
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
    </Layout>
  );
};

export default ProgramPendidikan;
