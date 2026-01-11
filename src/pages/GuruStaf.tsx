import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Building, BookOpen, Clock, GraduationCap } from "lucide-react";

const programs = [
  {
    name: "Program Tahfidz Reguler",
    description: "Program hafalan Al-Qur'an dengan target minimal 15 juz dalam 3 tahun",
    duration: "3 Tahun",
    icon: BookOpen,
  },
  {
    name: "Program Tahfidz Intensif",
    description: "Program hafalan Al-Qur'an 30 juz dengan metode talaqqi intensif",
    duration: "2 Tahun",
    icon: BookOpen,
  },
  {
    name: "Program Diniyah",
    description: "Pendidikan keagamaan meliputi Fiqh, Aqidah, Akhlak, dan Bahasa Arab",
    duration: "6 Tahun",
    icon: GraduationCap,
  },
  {
    name: "Program Akademik",
    description: "Kurikulum nasional dengan penguatan pada sains dan matematika",
    duration: "6 Tahun",
    icon: Building,
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((program, index) => {
              const IconComponent = program.icon;
              return (
                <div key={index} className="islamic-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent rounded-xl">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-serif text-xl font-bold text-foreground">
                          {program.name}
                        </h3>
                        <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {program.duration}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {program.description}
                      </p>
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
