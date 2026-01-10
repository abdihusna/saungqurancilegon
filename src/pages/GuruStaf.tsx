import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { PersonAvatar } from "@/components/shared/PersonAvatar";
import { BookOpen, Star } from "lucide-react";

const teachers = [
  {
    name: "KH. Ahmad Fauzi, Lc.",
    role: "Ketua Yayasan",
    specialty: "Tafsir & Ulum Al-Qur'an",
    gender: "male" as const,
    hafidz: true,
  },
  {
    name: "Ustadz Hasan, M.Pd.",
    role: "Kepala Sekolah",
    specialty: "Pendidikan Islam",
    gender: "male" as const,
    hafidz: true,
  },
  {
    name: "Ustadz Ridwan, S.Pd.I",
    role: "Wakil Kepala Sekolah",
    specialty: "Bahasa Arab",
    gender: "male" as const,
    hafidz: true,
  },
  {
    name: "Ustadzah Maryam",
    role: "Ketua Program Tahfidz",
    specialty: "Tahfidz Al-Qur'an",
    gender: "female" as const,
    hafidz: true,
  },
  {
    name: "Ustadz Abdullah, S.Pd.",
    role: "Guru Matematika",
    specialty: "Matematika & Sains",
    gender: "male" as const,
    hafidz: false,
  },
  {
    name: "Ustadzah Fatimah, S.Pd.",
    role: "Guru Bahasa Indonesia",
    specialty: "Bahasa & Sastra",
    gender: "female" as const,
    hafidz: false,
  },
  {
    name: "Ustadz Yusuf, S.Pd.I",
    role: "Guru Fiqh",
    specialty: "Fiqh & Ushul Fiqh",
    gender: "male" as const,
    hafidz: true,
  },
  {
    name: "Ustadzah Khadijah, S.Pd.",
    role: "Guru IPA",
    specialty: "Ilmu Pengetahuan Alam",
    gender: "female" as const,
    hafidz: false,
  },
];

const staff = [
  {
    name: "Bapak Dedi Setiawan",
    role: "Kepala Tata Usaha",
    gender: "male" as const,
  },
  {
    name: "Ibu Sri Wahyuni",
    role: "Administrasi & Keuangan",
    gender: "female" as const,
  },
  {
    name: "Bapak Agus Santoso",
    role: "Keamanan & Kebersihan",
    gender: "male" as const,
  },
];

const GuruStaf = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 animate-fade-up">
              Guru & Staf
            </h1>
            <p className="text-lg text-primary-foreground/90 animate-fade-up delay-100">
              Tim pendidik dan tenaga kependidikan yang berdedikasi
            </p>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-20 bg-background islamic-pattern">
        <div className="container">
          <SectionHeader
            title="Dewan Guru"
            subtitle="Guru-guru berkualitas yang mendidik dengan sepenuh hati"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((teacher, index) => (
              <div key={index} className="islamic-card overflow-hidden group">
                <div className="relative aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <PersonAvatar gender={teacher.gender} size="lg" className="w-3/4 h-3/4" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {teacher.hafidz && (
                    <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Hafidz
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-serif text-lg font-bold text-white mb-1">
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-white/90 mb-1">{teacher.role}</p>
                    <div className="flex items-center gap-2 text-xs text-white/70">
                      <BookOpen className="h-3 w-3" />
                      <span>{teacher.specialty}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <SectionHeader
            title="Tenaga Kependidikan"
            subtitle="Tim administrasi dan pendukung operasional sekolah"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {staff.map((person, index) => (
              <div key={index} className="islamic-card p-6 text-center">
                <PersonAvatar gender={person.gender} size="md" className="mx-auto mb-4" />
                <h3 className="font-serif text-lg font-bold text-foreground mb-1">
                  {person.name}
                </h3>
                <p className="text-sm text-muted-foreground">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "25+", label: "Guru Pengajar" },
              { value: "15+", label: "Guru Hafidz/Hafidzah" },
              { value: "10+", label: "Tenaga Kependidikan" },
              { value: "10", label: "Tahun Pengalaman" },
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

export default GuruStaf;
