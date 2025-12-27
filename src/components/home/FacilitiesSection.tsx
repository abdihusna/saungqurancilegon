import { SectionHeader } from "@/components/shared/SectionHeader";

const facilities = [
  {
    name: "Masjid",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=600&q=80",
    description: "Masjid yang luas untuk ibadah dan kegiatan keagamaan",
  },
  {
    name: "Ruang Kelas",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
    description: "Ruang belajar yang nyaman dengan fasilitas lengkap",
  },
  {
    name: "Perpustakaan",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80",
    description: "Koleksi buku Islam dan pengetahuan umum yang lengkap",
  },
  {
    name: "Asrama",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
    description: "Asrama yang bersih dan nyaman untuk santri mukim",
  },
  {
    name: "Lapangan Olahraga",
    image: "https://images.unsplash.com/photo-1544298621-35a989dc4f60?auto=format&fit=crop&w=600&q=80",
    description: "Fasilitas olahraga untuk menjaga kesehatan jasmani",
  },
  {
    name: "Kantin Sehat",
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=600&q=80",
    description: "Menyediakan makanan halal, sehat, dan bergizi",
  },
];

export function FacilitiesSection() {
  return (
    <section className="py-20 bg-muted islamic-pattern">
      <div className="container">
        <SectionHeader
          title="Fasilitas"
          subtitle="Fasilitas lengkap untuk mendukung kegiatan belajar dan mengajar"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => (
            <div key={index} className="islamic-card group">
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-serif text-xl font-bold text-white mb-1">
                    {facility.name}
                  </h3>
                  <p className="text-sm text-white/80">
                    {facility.description}
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
