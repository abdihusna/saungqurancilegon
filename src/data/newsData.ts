import juaraTaekwondo from "@/assets/news/juara-taekwondo.jpeg";
import programTasmi from "@/assets/news/program-tasmi.jpeg";
import tasmiHafidz from "@/assets/news/tasmi-hafidz.jpg";
import tasmiAli from "@/assets/news/tasmi-ali.jpg";
import tasmiMadina from "@/assets/news/tasmi-madina.jpg";
import tasmiSyifa from "@/assets/news/tasmi-syifa.jpg";
import tasmiJafar from "@/assets/news/tasmi-jafar.jpg";
import tasmiAbdullah from "@/assets/news/tasmi-abdullah.jpg";
import spmbGelombang2 from "@/assets/news/spmb-gelombang-2.jpg";
import rapatKerjaIpi from "@/assets/news/rapat-kerja-ipi.png";

// Gallery images for news articles
import thufulahBerkebun from "@/assets/gallery/thufulah-berkebun.jpg";
import thufulahKolam from "@/assets/gallery/thufulah-kolam.jpg";
import thufulahOutbond from "@/assets/gallery/thufulah-outbond.jpg";
import mengaji from "@/assets/gallery/mengaji.jpg";
import cookingClass from "@/assets/gallery/cooking-class.jpg";
import kegiatanBersama from "@/assets/gallery/kegiatan-bersama.jpg";
import belajarOutdoor from "@/assets/gallery/belajar-outdoor.jpg";
import berkebun from "@/assets/gallery/berkebun.jpg";
import berkudaMemanah from "@/assets/gallery/berkuda-memanah.jpg";
import berkebunSayuran from "@/assets/gallery/berkebun-sayuran.jpg";
import ternakKandang from "@/assets/gallery/ternak-kandang.jpg";
import outbondJembatan from "@/assets/gallery/outbond-jembatan.jpg";
import classMeetingPutra from "@/assets/gallery/class-meeting-putra.jpg";
import classMeetingPutri from "@/assets/gallery/class-meeting-putri.jpg";
import kegiatanOutdoorPutri from "@/assets/gallery/kegiatan-outdoor-putri.jpg";

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
    id: 10,
    slug: "program-tasmi-apresiasi-tertinggi-abdullah-alga-bagas",
    title: "Program Tasmi': Apresiasi Tertinggi untuk Ananda Abdullah Alga Bagas",
    excerpt: "Alhamdulillah, dengan penuh rasa syukur dan bangga, kami menyampaikan apresiasi yang setinggi-tingginya kepada Ananda Abdullah Alga Bagas, santri Banin (putra) kelas 1A, atas keberhasilannya menyelesaikan Program Tasmi' Juz'i Juz 30 di Saung Qur'an Cilegon.",
    content: `🌟 **APRESIASI TERTINGGI** 🌟

**Ananda Abdullah Alga Bagas**

Alhamdulillāh

Dengan penuh rasa syukur dan bangga, kami menyampaikan apresiasi yang setinggi-tingginya kepada Ananda Abdullah Alga Bagas, santri Banin (putra) kelas 1A, atas keberhasilannya menyelesaikan Program Tasmi' Juz'i Juz 30 di Saung Qur'an Cilegon.

Prestasi ini merupakan buah dari dedikasi, kesungguhan, serta kerja keras Ananda dalam mempelajari dan menghafal Al-Qur'an. Tasmi' bukan sekadar ujian hafalan, melainkan bukti keteguhan hati dalam menjaga kedekatan dengan Allah Ta'ālā.

Kami meyakini pencapaian ini menjadi langkah awal yang baik bagi Ananda untuk terus meningkatkan hafalan, pemahaman, dan pengamalan Al-Qur'an dalam kehidupan sehari-hari.

Ucapan terima kasih kami sampaikan kepada kedua orang tua Ananda, para Ustadz dan Ustadzah, serta seluruh pihak yang telah mendampingi dan membimbing Ananda Abdullah dalam perjalanan mulia ini.

Semoga Allah Ta'ālā senantiasa memberkahi, menjaga, dan menjadikan Al-Qur'an sebagai cahaya dalam hidup Ananda.

*Baarakallaahufiik*`,
    date: "18 Februari 2026",
    category: "Program",
    image: tasmiAbdullah,
    gallery: [
      { src: mengaji, alt: "Kegiatan Mengaji" },
      { src: kegiatanBersama, alt: "Kegiatan Bersama" },
    ],
  },
  {
    id: 9,
    slug: "program-tasmi-apresiasi-tertinggi-astapati-jafar",
    title: "Program Tasmi': Apresiasi Tertinggi untuk Ananda Astapati Jafar Wizkhalifa",
    excerpt: "Alhamdulillah, dengan penuh rasa syukur dan bangga, kami menyampaikan apresiasi yang setinggi-tingginya kepada Ananda Astapati Jafar Wizkhalifa, santri Banin (putra) kelas 5, atas keberhasilannya menyelesaikan Program Tasmi' Juz'i Juz 30 di Saung Qur'an Cilegon.",
    content: `🌟 **APRESIASI TERTINGGI** 🌟

**Ananda Astapati Jafar Wizkhalifa**

Alhamdulillāh

Dengan penuh rasa syukur dan bangga, kami menyampaikan apresiasi yang setinggi-tingginya kepada Ananda Astapati Jafar Wizkhalifa, santri Banin (putra) kelas 5, atas keberhasilannya menyelesaikan Program Tasmi' Juz'i Juz 30 di Saung Qur'an Cilegon.

Prestasi ini merupakan buah dari dedikasi, kesungguhan, serta kerja keras Ananda dalam mempelajari dan menghafal Al-Qur'an. Tasmi' bukan sekadar ujian hafalan, melainkan bukti keteguhan hati dalam menjaga kedekatan dengan Allah Ta'ālā.

Kami meyakini pencapaian ini menjadi langkah awal yang baik bagi Ananda untuk terus meningkatkan hafalan, pemahaman, dan pengamalan Al-Qur'an dalam kehidupan sehari-hari.

Ucapan terima kasih kami sampaikan kepada kedua orang tua Ananda, para Ustadz dan Ustadzah, serta seluruh pihak yang telah mendampingi dan membimbing Ananda Jafar dalam perjalanan mulia ini.

Semoga Allah Ta'ālā senantiasa memberkahi, Al-Qur'an sebagai cahaya dalam hidup Ananda.

*Baarakallaahufiik*`,
    date: "18 Februari 2026",
    category: "Program",
    image: tasmiJafar,
    gallery: [
      { src: mengaji, alt: "Kegiatan Mengaji" },
      { src: kegiatanBersama, alt: "Kegiatan Bersama" },
    ],
  },
  {
    id: 8,
    slug: "program-tasmi-apresiasi-tertinggi-syifa-nur-akhsanti",
    title: "Program Tasmi': Apresiasi Tertinggi untuk Ananda Syifa Nur Akhsanti",
    excerpt: "Alhamdulillah, dengan penuh rasa syukur dan bangga, kami menyampaikan apresiasi yang setinggi-tingginya kepada Ananda Syifa Nur Akhsanti, santri Banat (putri) kelas 8 SQC, atas keberhasilannya menyelesaikan Program Tasmi' Juz'i Juz 29 di Saung Qur'an Cilegon.",
    content: `🌟 **APRESIASI TERTINGGI** 🌟

**Ananda Syifa Nur Akhsanti**

Alhamdulillāh

Dengan penuh rasa syukur dan bangga, kami menyampaikan apresiasi yang setinggi-tingginya kepada Ananda Syifa Nur Akhsanti, santri Banat (putri) kelas 8 SQC, atas keberhasilannya menyelesaikan Program Tasmi' Juz'i Juz 29 di Saung Qur'an Cilegon.

Prestasi ini merupakan buah dari dedikasi, kesungguhan, serta kerja keras Ananda dalam mempelajari dan menghafal Al-Qur'an. Tasmi' bukan sekadar ujian hafalan, melainkan bukti keteguhan hati dalam menjaga kedekatan dengan Allah Ta'ālā.

Kami meyakini pencapaian ini menjadi langkah awal yang baik bagi Ananda untuk terus meningkatkan hafalan, pemahaman, dan pengamalan Al-Qur'an dalam kehidupan sehari-hari.

Ucapan terima kasih kami sampaikan kepada kedua orang tua Ananda, para Ustadz dan Ustadzah, serta seluruh pihak yang telah mendampingi dan membimbing Ananda Syifa dalam perjalanan mulia ini.

Semoga Allah Ta'ālā senantiasa memberkahi, menjaga, dan menjadikan Al-Qur'an sebagai cahaya dalam hidup Ananda.

*Baarakallaahufiik*`,
    date: "18 Februari 2026",
    category: "Program",
    image: tasmiSyifa,
    gallery: [
      { src: mengaji, alt: "Kegiatan Mengaji" },
      { src: kegiatanBersama, alt: "Kegiatan Bersama" },
    ],
  },
  {
    id: 7,
    slug: "program-tasmi-apresiasi-tertinggi-madina-khumaira",
    title: "Program Tasmi': Apresiasi Tertinggi untuk Ananda Madina Khumaira Ariyantono",
    excerpt: "Alhamdulillah, dengan penuh rasa syukur dan bangga, kami menyampaikan apresiasi yang setinggi-tingginya kepada Ananda Madina Khumaira Ariyantono, santri Banat (putri) kelas 8, atas keberhasilannya menyelesaikan Program Tasmi' Juz'i Juz 28 di Saung Qur'an Cilegon.",
    content: `🌟 **APRESIASI TERTINGGI** 🌟

**Ananda Madina Khumaira Ariyantono**

Alhamdulillāh

Dengan penuh rasa syukur dan bangga, kami menyampaikan apresiasi yang setinggi-tingginya kepada Ananda Madina Khumaira Ariyantono, santri Banat (putri) kelas 8, atas keberhasilannya menyelesaikan Program Tasmi' Juz'i Juz 28 di Saung Qur'an Cilegon.

Prestasi ini merupakan buah dari dedikasi, kesungguhan, serta kerja keras Ananda dalam mempelajari dan menghafal Al-Qur'an. Tasmi' bukan sekadar ujian hafalan, melainkan bukti keteguhan hati dalam menjaga kedekatan dengan Allah Ta'ālā.

Kami meyakini pencapaian ini menjadi langkah awal yang baik bagi Ananda untuk terus meningkatkan hafalan, pemahaman, dan pengamalan Al-Qur'an dalam kehidupan sehari-hari.

Ucapan terima kasih kami sampaikan kepada kedua orang tua Ananda, para Ustadz dan Ustadzah, serta seluruh pihak yang telah mendampingi dan membimbing Ananda Madina dalam perjalanan mulia ini.

Semoga Allah Ta'ālā senantiasa memberkahi dan menjaga Al-Qur'an sebagai cahaya dalam hidup Ananda.

*Baarakallaahufiik*`,
    date: "18 Februari 2026",
    category: "Program",
    image: tasmiMadina,
    gallery: [
      { src: mengaji, alt: "Kegiatan Mengaji" },
      { src: kegiatanBersama, alt: "Kegiatan Bersama" },
    ],
  },
  {
    id: 6,
    slug: "program-tasmi-apresiasi-tertinggi-ali",
    title: "Program Tasmi': Apresiasi Tertinggi untuk Ananda Ali",
    excerpt: "Alhamdulillah, dengan penuh rasa syukur dan bangga, kami menyampaikan apresiasi yang setinggi-tingginya kepada Ananda Ali, santri Banin (putra) kelas 5, atas keberhasilannya menyelesaikan Program Tasmi' Juz'i Juz 30 di Saung Qur'an Cilegon.",
    content: `🌟 **APRESIASI TERTINGGI** 🌟

**Ananda Ali**

Alhamdulillāh

Dengan penuh rasa syukur dan bangga, kami menyampaikan apresiasi yang setinggi-tingginya kepada Ananda Ali, santri Banin (putra) kelas 5, atas keberhasilannya menyelesaikan Program Tasmi' Juz'i Juz 30 di Saung Qur'an Cilegon.

Prestasi ini merupakan buah dari dedikasi, kesungguhan, serta kerja keras Ananda dalam mempelajari dan menghafal Al-Qur'an. Tasmi' bukan sekadar ujian hafalan, melainkan bukti keteguhan hati dalam menjaga kedekatan dengan Allah Ta'ālā.

Kami meyakini pencapaian ini menjadi langkah awal yang baik bagi Ananda untuk terus meningkatkan hafalan, pemahaman, dan pengamalan Al-Qur'an dalam kehidupan sehari-hari.

Ucapan terima kasih kami sampaikan kepada kedua orang tua Ananda, para Ustadz dan Ustadzah, serta seluruh pihak yang telah mendampingi dan membimbing Ananda Ali dalam perjalanan mulia ini.

Semoga Allah Ta'ālā senantiasa memberkahi, menjaga, dan menjadikan Al-Qur'an sebagai cahaya dalam hidup Ananda.

*Bârakallâhu fîk* ✨`,
    date: "3 Februari 2026",
    category: "Program",
    image: tasmiAli,
    gallery: [
      { src: mengaji, alt: "Kegiatan Mengaji" },
      { src: kegiatanBersama, alt: "Kegiatan Bersama" },
    ],
  },
  {
    id: 5,
    slug: "program-tasmi-apresiasi-tertinggi-muhammad-hafidz",
    title: "Program Tasmi': Apresiasi Tertinggi untuk Ananda Muhammad Hafidz",
    excerpt: "Alhamdulillah, dengan penuh rasa syukur dan bangga, kami menyampaikan apresiasi yang setinggi-tingginya kepada Ananda Muhammad Hafidz, santri Banin (putra) kelas 6, atas keberhasilannya menyelesaikan Program Tasmi' Juz'i Juz 1 dan 2 di Saung Qur'an Cilegon.",
    content: `🌟 **APRESIASI TERTINGGI** 🌟

**Ananda Muhammad Hafidz**

Alhamdulillāh

Dengan penuh rasa syukur dan bangga, kami menyampaikan apresiasi yang setinggi-tingginya kepada Ananda Muhammad Hafidz, santri Banin (putra) kelas 6, atas keberhasilannya menyelesaikan Program Tasmi' Juz'i Juz 1 dan 2 di Saung Qur'an Cilegon.

Prestasi ini merupakan buah dari dedikasi, kesungguhan, serta kerja keras Ananda dalam mempelajari dan menghafal Al-Qur'an. Tasmi' bukan sekadar ujian hafalan, melainkan bukti keteguhan hati dalam menjaga kedekatan dengan Allah Ta'ālā.

Kami meyakini pencapaian ini menjadi langkah awal yang baik bagi Ananda untuk terus meningkatkan hafalan, pemahaman, dan pengamalan Al-Qur'an dalam kehidupan sehari-hari.

Ucapan terima kasih kami sampaikan kepada kedua orang tua Ananda, para Ustadz dan Ustadzah, serta seluruh pihak yang telah mendampingi dan membimbing Ananda Hafidz dalam perjalanan mulia ini.

Semoga Allah Ta'ālā senantiasa memberkahi, menjaga, dan menjadikan Al-Qur'an sebagai cahaya dalam hidup Ananda.

*Baarakallaahufiik*`,
    date: "3 Februari 2026",
    category: "Program",
    image: tasmiHafidz,
    gallery: [
      { src: mengaji, alt: "Kegiatan Mengaji" },
      { src: kegiatanBersama, alt: "Kegiatan Bersama" },
    ],
  },
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
      { src: berkudaMemanah, alt: "Kegiatan Berkuda & Memanah" },
      { src: mengaji, alt: "Kegiatan Mengaji" },
      { src: outbondJembatan, alt: "Outbond Jembatan Tali" },
      { src: classMeetingPutra, alt: "Class Meeting Santri Putra" },
    ],
  },
  {
    id: 2,
    slug: "penerimaan-peserta-didik-baru-gelombang-2-tahun-ajaran-2026-2027",
    title: "Penerimaan Peserta Didik Baru Gelombang 2 Tahun Ajaran 2026-2027",
    excerpt: "Saung Qur'an Cilegon membuka SPMB Gelombang 2 untuk jenjang Setara SD. Kuota terbatas! Pendaftaran dimulai 02 Februari 2026.",
    content: `**PENERIMAAN PESERTA DIDIK BARU**
**GELOMBANG 2**
**TAHUN AJARAN 2026-2027**

**Saung Qur'an Cilegon - Setara SD**

⚠️ **Kuota Terbatas**

---

## Program Utama:
1. Penanaman aqidah salimah, ibadah sohihah, adab dan akhlak Islami
2. Mengimplementasikan konsepsi pendidikan karakter nabawiyah (PKN)
3. Mengajarkan calistung dan madah diniyah
4. Mengajarkan dasar-dasar ilmu pengetahuan umum setaraf SD mengacu kurikulum pendidikan Nasional
5. Mengajarkan life skill dan thinking skill
6. Outing Class

## Program Unggulan:
1. Tahsin Al Qur'an
2. Tahfizh Al Qur'an
3. Learning By Project (LBP)

## Kegiatan Penunjang:
1. Tasmi' Al Qur'an
2. Super Camp
3. Pesantren Kilat
4. Outing Class

---

📅 **Pendaftaran Gel 2:** 02 Februari 2026
*(Pendaftaran akan ditutup jika kuota telah terpenuhi)*

🔗 **Untuk Pendaftaran silahkan klik:** https://bit.ly/SPMBSDsqc

---

📞 **Informasi Pendaftaran:**
- **Pusat Info:** wa.me/6285175209033
- **Ustadzah Syifa:** wa.me/6285187855124`,
    date: "2 Februari 2026",
    category: "Pengumuman",
    image: spmbGelombang2,
    gallery: [
      { src: thufulahBerkebun, alt: "Program Thufulah Berkebun" },
      { src: thufulahKolam, alt: "Program Thufulah Bermain Air" },
      { src: thufulahOutbond, alt: "Program Thufulah Outbond" },
      { src: cookingClass, alt: "Cooking Class" },
      { src: berkebunSayuran, alt: "Berkebun Sayuran" },
      { src: classMeetingPutri, alt: "Class Meeting Santri Putri" },
    ],
  },
  {
    id: 3,
    slug: "fk-pkbm-cilegon-hadiri-rapat-kerja-ipi-2026",
    title: "FK PKBM Cilegon Hadiri Pembukaan Rapat Kerja IPI Kota Cilegon Tahun 2026",
    excerpt: "Turut menghadiri pembukaan Rapat Kerja Ikatan Penilik Indonesia (IPI) Kota Cilegon sekaligus pengesahan Program Kerja Penilik Tahun 2026 di Hotel Jayakarta Anyer.",
    content: `**FK PKBM Cilegon Hadiri Pembukaan Rapat Kerja IPI Kota Cilegon Tahun 2026**

Turut menghadiri pembukaan Rapat Kerja Ikatan Penilik Indonesia (IPI) Kota Cilegon sekaligus pengesahan Program Kerja Penilik Tahun 2026 yang dilaksanakan di Hotel Jayakarta Anyer, Selasa (3/2/2026).

Kegiatan dibuka secara resmi oleh Fajar Hadi Prabowo, Wakil Wali Kota Cilegon. Rapat kerja ini menegaskan pentingnya penguatan peran penilik dalam mendukung pendidikan nonformal yang adaptif terhadap transformasi digital.

Acara turut dihadiri jajaran Dinas Pendidikan Kota Cilegon, pengurus IPI Kota dan Provinsi, serta unsur lembaga pendidikan nonformal, antara lain FK PKBM Kota Cilegon, HIMPAUDI, dan pengurus LKP Kota Cilegon.

#PendidikanNonFormal #FKPKBMCilegon #IPICilegon #TransformasiDigital #CilegonJuare`,
    date: "3 Februari 2026",
    category: "Berita",
    image: rapatKerjaIpi,
    gallery: [
      { src: berkebun, alt: "Kegiatan Berkebun" },
      { src: belajarOutdoor, alt: "Pembelajaran Outdoor" },
      { src: ternakKandang, alt: "Membersihkan Kandang Ternak" },
      { src: kegiatanOutdoorPutri, alt: "Kegiatan Outdoor Santriwati" },
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
    title: "Program Tasmi' Juz 30",
    description: "Abdullah Alga Bagas - Santri Banin Kelas 1A",
  },
  {
    title: "Program Tasmi' Juz 30",
    description: "Astapati Jafar Wizkhalifa - Santri Banin Kelas 5",
  },
  {
    title: "Program Tasmi' Juz 29",
    description: "Syifa Nur Akhsanti - Santri Banat Kelas 8",
  },
  {
    title: "Program Tasmi' Juz 28",
    description: "Madina Khumaira Ariyantono - Santri Banat Kelas 8",
  },
  {
    title: "Program Tasmi' Juz 30",
    description: "Ali - Santri Banin Kelas 5",
  },
  {
    title: "Program Tasmi' Juz 1 & 2",
    description: "Muhammad Hafidz - Santri Banin Kelas 6",
  },
  {
    title: "Juara 1 Taekwondo Nasional 2026",
    description: "Muhammad Kamil Abdun Syakuur - PRABU TAEKWONDO CHALLENGE 9 Grade B Nasional",
  },
  {
    title: "Program Tasmi' Juz-30",
    description: "Ananda Dhafita Nizza Nur Azizah - Santri Banat Kelas 6",
  },
];
