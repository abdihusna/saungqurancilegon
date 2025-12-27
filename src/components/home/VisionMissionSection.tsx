import { Target, Eye } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function VisionMissionSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container">
        <SectionHeader
          title="Visi & Misi"
          subtitle="Arah dan tujuan kami dalam mendidik generasi Qur'ani"
          className="text-primary-foreground [&_.section-subtitle]:text-primary-foreground/80"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision */}
          <div className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-secondary rounded-xl">
                <Eye className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-bold">Visi</h3>
            </div>
            <p className="text-lg leading-relaxed text-primary-foreground/90">
              Menjadi lembaga pendidikan Islam terdepan yang mencetak generasi 
              Qur'ani berakhlak mulia, cerdas, mandiri, dan bermanfaat bagi umat, 
              dengan landasan iman yang kokoh dan ilmu yang luas.
            </p>
          </div>

          {/* Mission */}
          <div className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-secondary rounded-xl">
                <Target className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-bold">Misi</h3>
            </div>
            <ul className="space-y-3 text-primary-foreground/90">
              {[
                "Menyelenggarakan pembelajaran Al-Qur'an dengan metode yang efektif dan menyenangkan",
                "Membina akhlak mulia berdasarkan nilai-nilai Islami",
                "Mengembangkan potensi peserta didik secara optimal",
                "Menciptakan lingkungan belajar yang Islami dan kondusif",
                "Menjalin kerjasama dengan orang tua dan masyarakat",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-secondary font-bold">{index + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
