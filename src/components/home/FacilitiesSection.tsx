import { SectionHeader } from "@/components/shared/SectionHeader";
import aulaSaung from "@/assets/facilities/aula-saung.jpg";
import ruangKelasSaung from "@/assets/facilities/ruang-kelas-saung.jpg";
import perpustakaanSaung from "@/assets/facilities/perpustakaan-saung.jpg";
import lapanganAlami from "@/assets/facilities/lapangan-alami.jpg";
import kantinSaung from "@/assets/facilities/kantin-saung.jpg";
import asramaSaung from "@/assets/facilities/asrama-saung.jpg";

const facilities = [
  {
    name: "Aula Saung",
    image: aulaSaung,
    description: "Aula berbentuk saung untuk kegiatan bersama, kajian, dan pertemuan dalam suasana alami",
  },
  {
    name: "Ruang Kelas Saung",
    image: ruangKelasSaung,
    description: "Ruang belajar berbentuk saung dengan ventilasi alami untuk suasana belajar yang nyaman",
  },
  {
    name: "Perpustakaan",
    image: perpustakaanSaung,
    description: "Perpustakaan berbentuk saung dengan koleksi buku Islam dan pengetahuan umum",
  },
  {
    name: "Asrama",
    image: asramaSaung,
    description: "Asrama bergaya pondok dengan konstruksi kayu alami yang bersih dan nyaman untuk santri mukim",
  },
  {
    name: "Lapangan Bermain Alami",
    image: lapanganAlami,
    description: "Lapangan bermain yang luas di tengah alam hijau dengan pepohonan rindang untuk eksplorasi dan bermain bebas",
  },
  {
    name: "Kantin Sehat",
    image: kantinSaung,
    description: "Kantin berbentuk saung yang menyediakan makanan halal, sehat, dan bergizi",
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
