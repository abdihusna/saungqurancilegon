import juaraTaekwondo from "@/assets/news/juara-taekwondo.jpeg";
import programTasmi from "@/assets/news/program-tasmi.jpeg";

// Gallery images for news articles
import thufulahBerkebun from "@/assets/gallery/thufulah-berkebun.jpg";
import thufulahKolam from "@/assets/gallery/thufulah-kolam.jpg";
import thufulahOutbond from "@/assets/gallery/thufulah-outbond.jpg";
import mengaji from "@/assets/gallery/mengaji.jpg";
import cookingClass from "@/assets/gallery/cooking-class.jpg";
import kegiatanBersama from "@/assets/gallery/kegiatan-bersama.jpg";
import makanBersama from "@/assets/gallery/makan-bersama.jpg";
import berkebun from "@/assets/gallery/berkebun.jpg";

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image?: string;
  gallery?: GalleryImage[];
}

export const newsData: NewsItem[] = [
  {
    id: 1,
    slug: "santri-sqc-raih-juara-1-taekwondo-nasional",
    title: "Santri SQC Raih Juara 1 Taekwondo Nasional",
    excerpt: "Alhamdulillah, Muhammad Kamil Abdun Syakuur, santri Saung Qur'an Cilegon berhasil meraih Juara 1 Kategori Kyorugi Pemula pada pertandingan PRABU TAEKWONDO CHALLENGE 9 Grade B Nasional di Indoor Stadium Tangerang.",
    content: `Alhamdulillah..

Santri Saung Qur'an Cilegon (SQC) telah meraih **Juara 1** (Kategori: Kyorugi Pemula)

Atas nama: **Muhammad Kamil Abdun Syakuur**

Pada kegiatan pertandingan PRABU TAEKWONDO CHALLENGE 9 Grade B Nasional di Indoor Stadium Tangerang.

---

**Sistem Penerimaan Murid Baru (SPMB) Tahun Pelajaran 2026-2027 Saung Qur'an Cilegon**

**Informasi SPMB:**
wa.me/6285187855124

**Pendaftaran Online:**
- PAUD/TK: https://bit.ly/SPMBSTASAQURsqc
- SD: https://bit.ly/SPMBSDsqc
- SMP: https://bit.ly/SPMBSMPsqc`,
    date: "24 Januari 2026",
    category: "Prestasi",
    image: juaraTaekwondo,
    gallery: [
      { src: kegiatanBersama, alt: "Kegiatan Bersama Santri" },
      { src: mengaji, alt: "Kegiatan Mengaji" },
    ],
  },
  {
    id: 2,
    slug: "pendaftaran-santri-baru-tahun-ajaran-2026-2027",
    title: "Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Dibuka",
    excerpt: "Saung Qur'an Cilegon membuka SPMB Tahun Pelajaran 2026-2027. Info: wa.me/6285187855124. Daftar online: PAUD/TK (bit.ly/SPMBSTASAQURsqc), SD (bit.ly/SPMBSDsqc), SMP (bit.ly/SPMBSMPsqc).",
    content: `**Sistem Penerimaan Murid Baru (SPMB) Tahun Pelajaran 2026-2027 Saung Qur'an Cilegon**

Saung Qur'an Cilegon membuka pendaftaran santri baru untuk tahun ajaran 2026-2027.

**Informasi SPMB:**
Hubungi kami di wa.me/6285187855124

**Pendaftaran Online:**
- PAUD/TK: https://bit.ly/SPMBSTASAQURsqc
- SD: https://bit.ly/SPMBSDsqc
- SMP: https://bit.ly/SPMBSMPsqc

Segera daftarkan putra-putri Anda untuk bergabung bersama kami dalam mewujudkan generasi Qur'ani, Terampil, dan Mandiri.`,
    date: "12 Januari 2026",
    category: "Pengumuman",
    gallery: [
      { src: thufulahBerkebun, alt: "Program Thufulah Berkebun" },
      { src: thufulahKolam, alt: "Program Thufulah Bermain Air" },
      { src: thufulahOutbond, alt: "Program Thufulah Outbond" },
      { src: cookingClass, alt: "Cooking Class" },
    ],
  },
  {
    id: 3,
    slug: "kunjungan-dinas-pendidikan-kota-cilegon",
    title: "Kunjungan Dinas Pendidikan Kota Cilegon",
    excerpt: "Dinas Pendidikan Kota Cilegon melakukan kunjungan kerja untuk melihat program pendidikan di Saung Qur'an Cilegon.",
    content: `Dinas Pendidikan Kota Cilegon melakukan kunjungan kerja untuk melihat program pendidikan di Saung Qur'an Cilegon.

Kunjungan ini merupakan bentuk apresiasi dan dukungan dari pemerintah daerah terhadap program pendidikan berbasis karakter dan tahfidz yang diselenggarakan oleh Saung Qur'an Cilegon.

Dalam kunjungan tersebut, tim dari Dinas Pendidikan berkesempatan melihat langsung proses pembelajaran dan fasilitas yang tersedia di Saung Qur'an Cilegon.`,
    date: "5 Januari 2026",
    category: "Berita",
    gallery: [
      { src: berkebun, alt: "Kegiatan Berkebun" },
      { src: makanBersama, alt: "Makan Bersama" },
    ],
  },
  {
    id: 4,
    slug: "program-tasmi-apresiasi-tertinggi-dhafita-nizza-nur",
    title: "Program Tasmi': Apresiasi Tertinggi untuk Ananda Dhafita Nizza Nur",
    excerpt: "Alhamdulillah, dengan penuh rasa syukur dan bangga, kami sampaikan apresiasi yang sebesar-besarnya kepada Ananda Dhafita Nizza Nur Azizah, santri Banat (putri) kelas 6, atas keberhasilannya dalam menyelesaikan program Tasmi' Juz'i Juz-30 di Saung Qur'an Cilegon.",
    content: `**APRESIASI TERTINGGI**

**Ananda Dhafita Nizza Nur A.**

Alhamdulillah

Dengan penuh rasa syukur dan bangga, kami sampaikan apresiasi yang sebesar-besarnya kepada Ananda Dhafita Nizza Nur Azizah, santri Banat (putri) kelas 6, atas keberhasilannya dalam menyelesaikan program Tasmi' Juz'i Juz-30 di Saung Qur'an Cilegon. Prestasi ini adalah hasil dari dedikasi, kesungguhan, dan kerja keras Ananda dalam mempelajari dan menghafal Al-Qur'an.

Tasmi' bukan hanya sekadar ujian kemampuan hafalan, tetapi juga merupakan bukti keteguhan hati dalam mendekatkan diri kepada Allah Ta'ala. Kami yakin bahwa pencapaian ini akan menjadi langkah awal yang baik bagi Ananda dalam terus meningkatkan hafalan serta pemahaman terhadap Al-Qur'an.

Semoga keberhasilan ini menjadi motivasi bagi Ananda untuk selalu mencintai Al-Qur'an dan mengamalkannya dalam kehidupan sehari-hari. Kami juga berterima kasih kepada kedua orang tua Ananda, para Ustadz Ustadzah, dan seluruh pihak yang telah mendukung dan membimbing Dhafita dalam perjalanannya.

*Syukron*`,
    date: "24 Januari 2026",
    category: "Program",
    image: programTasmi,
    gallery: [
      { src: mengaji, alt: "Kegiatan Mengaji" },
      { src: kegiatanBersama, alt: "Kegiatan Bersama" },
    ],
  },
];

// Achievements for Profil page - synced with news data
export const achievements = [
  {
    title: "Juara 1 Taekwondo Nasional 2026",
    description: "Muhammad Kamil Abdun Syakuur - PRABU TAEKWONDO CHALLENGE 9 Grade B Nasional",
  },
  {
    title: "Program Tasmi' Juz-30",
    description: "Ananda Dhafita Nizza Nur Azizah - Santri Banat Kelas 6",
  },
  {
    title: "Juara 1 MTQ Tingkat Kota Cilegon 2023",
    description: "Kategori Tilawah Anak-anak",
  },
  {
    title: "Juara 2 Tahfidz Qur'an Tingkat Provinsi Banten 2023",
    description: "Kategori 5 Juz",
  },
  {
    title: "Juara 1 Kaligrafi Tingkat Nasional 2022",
    description: "Kategori Naskah",
  },
];
