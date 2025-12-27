import { SectionHeader } from "@/components/shared/SectionHeader";

export function AboutSection() {
  return (
    <section className="py-20 bg-background islamic-pattern">
      <div className="container">
        <SectionHeader
          title="Tentang Kami"
          subtitle="Lembaga pendidikan Islam yang berdedikasi untuk mencetak generasi Qur'ani"
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
              {" "}adalah lembaga pendidikan Islam yang berdiri sejak tahun 2013. Kami berkomitmen 
              untuk memberikan pendidikan terbaik yang memadukan kurikulum nasional dengan 
              pendidikan Al-Qur'an yang intensif.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Dengan metode pembelajaran yang inovatif dan guru-guru yang berkompeten, 
              kami telah berhasil mencetak ratusan hafidz dan hafidzah Al-Qur'an yang 
              tidak hanya menghafal tetapi juga memahami dan mengamalkan isi Al-Qur'an 
              dalam kehidupan sehari-hari.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { value: "Tahfidz Intensif", desc: "Program hafalan 30 Juz" },
                { value: "Kurikulum Terpadu", desc: "Diniyah & Nasional" },
                { value: "Lingkungan Islami", desc: "Kondusif untuk belajar" },
                { value: "Pendidik Kompeten", desc: "Bersertifikasi & berpengalaman" },
              ].map((item, index) => (
                <div key={index} className="p-4 bg-accent rounded-lg">
                  <p className="font-semibold text-foreground">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
