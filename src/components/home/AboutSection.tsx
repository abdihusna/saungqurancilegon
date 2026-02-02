import { SectionHeader } from "@/components/shared/SectionHeader";

export function AboutSection() {
  return (
    <section className="py-20 bg-background geometric-pattern">
      <div className="container">
        <SectionHeader
          title="Tentang Kami"
          subtitle="Lembaga pendidikan Islam yang berdedikasi mewujudkan generasi Qur'ani, terampil dan mandiri"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl" />
            <img
              src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80"
              alt="Kegiatan belajar di Saung Qur'an"
              className="relative rounded-2xl shadow-2xl w-full aspect-[4/3] object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              <span className="font-serif text-2xl text-primary font-bold">Saung Qur'an Cilegon</span> 
              {" "}adalah lembaga pendidikan Islam yang berdiri sejak tahun 2020. Kami berkomitmen 
              untuk memberikan pendidikan terbaik yang memadukan kurikulum karakter nabawiyah dengan 
              pembelajaran Al-Qur'an yang intensif.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Dengan metode pembelajaran yang inovatif dan guru-guru yang berkompeten, 
              kami terus berupaya mewujudkan generasi yang solih dan solihah, hafidz dan hafidzah Al-Qur'an yang 
              tidak hanya menghafal tetapi juga memahami dan mengamalkan isi Al-Qur'an 
              dalam kehidupan sehari-hari.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
