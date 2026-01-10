import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { PersonAvatar } from "@/components/shared/PersonAvatar";
import { Award, Calendar, Building } from "lucide-react";

const achievements = [
  "Juara 1 MTQ Tingkat Kota Cilegon 2023",
  "Juara 2 Tahfidz Qur'an Tingkat Provinsi Banten 2023",
  "Juara 1 Kaligrafi Tingkat Nasional 2022",
  "Juara 3 Olimpiade Sains Madrasah 2022",
  "Juara 1 Pidato Bahasa Arab Tingkat Kota 2021",
];

const programs = [
  {
    name: "Program Tahfidz Reguler",
    description: "Program hafalan Al-Qur'an dengan target minimal 15 juz dalam 3 tahun",
    duration: "3 Tahun",
  },
  {
    name: "Program Tahfidz Intensif",
    description: "Program hafalan Al-Qur'an 30 juz dengan metode talaqqi intensif",
    duration: "2 Tahun",
  },
  {
    name: "Program Diniyah",
    description: "Pendidikan keagamaan meliputi Fiqh, Aqidah, Akhlak, dan Bahasa Arab",
    duration: "6 Tahun",
  },
  {
    name: "Program Akademik",
    description: "Kurikulum nasional dengan penguatan pada sains dan matematika",
    duration: "6 Tahun",
  },
];

const Profil = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 animate-fade-up">
              Profil Sekolah
            </h1>
            <p className="text-lg text-primary-foreground/90 animate-fade-up delay-100">
              Mengenal lebih dekat Saung Qur'an Cilegon
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  Sejarah Pendirian
                </h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Saung Qur'an Cilegon didirikan pada tahun 2020 oleh sekelompok tokoh 
                  masyarakat dan ulama yang memiliki visi untuk mencetak generasi 
                  Qur'ani di Kota Cilegon dan sekitarnya.
                </p>
                <p>
                  Berawal dari sebuah saung kecil dengan beberapa santri, kini Saung Qur'an 
                  telah berkembang menjadi lembaga pendidikan Islam terpadu dengan 
                  lebih dari 200 santri aktif.
                </p>
                <p>
                  Nama "Saung" diambil dari bahasa Sunda yang berarti "rumah kecil" atau 
                  "gubuk", melambangkan kesederhanaan dan ketulusan dalam menuntut ilmu. 
                  Kami percaya bahwa pendidikan yang baik tidak harus mewah, tetapi 
                  harus penuh dengan cinta dan dedikasi.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl" />
              <img
                src="https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=800&q=80"
                alt="Saung Qur'an Cilegon"
                className="relative rounded-2xl shadow-2xl w-full aspect-[4/3] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Structure Section */}
      <section className="py-20 bg-muted islamic-pattern">
        <div className="container">
          <SectionHeader
            title="Struktur Organisasi"
            subtitle="Struktur kepengurusan Saung Qur'an Cilegon"
          />

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ketua Yayasan */}
              <div className="col-span-full">
                <div className="islamic-card p-6 text-center max-w-xs mx-auto">
                  <PersonAvatar gender="male" size="md" className="mx-auto mb-4" />
                  <h3 className="font-serif text-lg font-bold text-foreground">DR. Ahmad Suja'i M.Pd</h3>
                  <p className="text-sm text-muted-foreground">Ketua Yayasan</p>
                </div>
              </div>

              {/* Kepala Sekolah & Wakil */}
              <div className="islamic-card p-6 text-center">
                <PersonAvatar gender="male" size="md" className="mx-auto mb-4" />
                <h3 className="font-serif text-lg font-bold text-foreground">Ustadz Mu'inudin S.Pd.I</h3>
                <p className="text-sm text-muted-foreground">Kepala Sekolah</p>
              </div>

              <div className="islamic-card p-6 text-center">
                <PersonAvatar gender="male" size="md" className="mx-auto mb-4" />
                <h3 className="font-serif text-lg font-bold text-foreground">Ustadz Ridwan, S.Pd.I</h3>
                <p className="text-sm text-muted-foreground">Wakil Kepala Sekolah</p>
              </div>

              <div className="islamic-card p-6 text-center">
                <PersonAvatar gender="female" size="md" className="mx-auto mb-4" />
                <h3 className="font-serif text-lg font-bold text-foreground">Ustadzah Maryam</h3>
                <p className="text-sm text-muted-foreground">Ketua Program Tahfidz</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <SectionHeader
            title="Program Pendidikan"
            subtitle="Program-program unggulan yang kami tawarkan"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((program, index) => (
              <div key={index} className="islamic-card p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent rounded-xl">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-xl font-bold text-foreground">
                        {program.name}
                      </h3>
                      <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">
                        {program.duration}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {program.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <SectionHeader
            title="Prestasi & Pencapaian"
            subtitle="Prestasi yang telah diraih oleh santri-santri kami"
            className="text-primary-foreground [&_.section-subtitle]:text-primary-foreground/80"
          />

          <div className="max-w-2xl mx-auto">
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl"
                >
                  <div className="p-2 bg-secondary rounded-lg">
                    <Award className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <span className="text-primary-foreground">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profil;
