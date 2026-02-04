import { BookOpen, Scroll, Users, GraduationCap, Shield, Star } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const features = [
  {
    icon: BookOpen,
    title: "Tahfidz Al-Qur'an",
    description: "Program hafalan Al-Qur'an intensif dengan metode talaqqi dari ustadz/ustadzah berpengalaman",
  },
  {
    icon: Scroll,
    title: "Madah Diniyah",
    description: "Penanaman aqidah salimah, ibadah sohihah. Pembinaan karakter dan akhlak berdasarkan nilai-nilai Al-Qur'an dan Sunnah Rasulullah SAW",
  },
  {
    icon: Users,
    title: "Pembelajaran Based on Project",
    description: "Metode pembelajaran berbasis proyek yang mengasah kreativitas dan kemandirian santri melalui pengalaman nyata",
  },
  {
    icon: GraduationCap,
    title: "Kurikulum Pendidikan Karakter Nabawiyah",
    description: "Kurikulum berbasis fitrah yang mengembangkan 4 karakter: iman, belajar, bakat, dan perkembangan sesuai Sunnah Rasulullah SAW",
  },
  {
    icon: Shield,
    title: "Lingkungan Alami",
    description: "Suasana belajar di alam terbuka dengan kegiatan berkebun, berternak, dan eksplorasi alam untuk tumbuh kembang optimal",
  },
  {
    icon: Star,
    title: "Tenaga Pengajar Berkualitas",
    description: "Guru-guru hafidz/hafidzah yang berkompeten dan berpengalaman dalam mengajar",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <SectionHeader
          title="Keunggulan Kami"
          subtitle="Berbagai keunggulan yang menjadikan Saung Qur'an Cilegon pilihan terbaik"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="islamic-card p-6 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent rounded-xl group-hover:bg-primary transition-colors">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
