import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Loader2 } from "lucide-react";

const Pendaftaran = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    alamat: "",
    nama_ayah: "",
    nama_ibu: "",
    no_telepon: "",
    email: "",
    program: "",
    asal_sekolah: "",
    catatan: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("pendaftaran").insert([
        {
          nama_lengkap: formData.nama_lengkap,
          tempat_lahir: formData.tempat_lahir,
          tanggal_lahir: formData.tanggal_lahir,
          jenis_kelamin: formData.jenis_kelamin,
          alamat: formData.alamat,
          nama_ayah: formData.nama_ayah,
          nama_ibu: formData.nama_ibu,
          no_telepon: formData.no_telepon,
          email: formData.email || null,
          program: formData.program,
          asal_sekolah: formData.asal_sekolah || null,
          catatan: formData.catatan || null,
        },
      ]);

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Pendaftaran Berhasil!",
        description: "Data pendaftaran Anda telah kami terima. Tim kami akan menghubungi Anda segera.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Terjadi Kesalahan",
        description: "Gagal mengirim pendaftaran. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <section className="py-20 bg-background min-h-[70vh] flex items-center">
          <div className="container">
            <div className="max-w-lg mx-auto text-center">
              <div className="mb-6">
                <CheckCircle className="h-20 w-20 text-primary mx-auto" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
                Pendaftaran Berhasil!
              </h1>
              <p className="text-muted-foreground mb-8">
                Terima kasih telah mendaftarkan putra/putri Anda di Saung Qur'an Cilegon. 
                Tim kami akan segera menghubungi Anda untuk proses selanjutnya.
              </p>
              <Button onClick={() => navigate("/")}>
                Kembali ke Beranda
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 animate-fade-up">
              Pendaftaran Online
            </h1>
            <p className="text-lg text-primary-foreground/90 animate-fade-up delay-100">
              Daftarkan putra/putri Anda untuk menjadi bagian dari keluarga besar Saung Qur'an
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-background islamic-pattern">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="islamic-card p-8">
              <SectionHeader
                title="Formulir Pendaftaran"
                subtitle="Lengkapi data di bawah ini dengan benar"
              />

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Data Calon Santri */}
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                    Data Calon Santri
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
                      <Input
                        id="nama_lengkap"
                        name="nama_lengkap"
                        value={formData.nama_lengkap}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tempat_lahir">Tempat Lahir *</Label>
                      <Input
                        id="tempat_lahir"
                        name="tempat_lahir"
                        value={formData.tempat_lahir}
                        onChange={handleChange}
                        required
                        placeholder="Contoh: Cilegon"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tanggal_lahir">Tanggal Lahir *</Label>
                      <Input
                        id="tanggal_lahir"
                        name="tanggal_lahir"
                        type="date"
                        value={formData.tanggal_lahir}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
                      <Select
                        value={formData.jenis_kelamin}
                        onValueChange={(value) => handleSelectChange("jenis_kelamin", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                          <SelectItem value="Perempuan">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="asal_sekolah">Asal Sekolah</Label>
                      <Input
                        id="asal_sekolah"
                        name="asal_sekolah"
                        value={formData.asal_sekolah}
                        onChange={handleChange}
                        placeholder="Contoh: SD Negeri 1 Cilegon"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="alamat">Alamat Lengkap *</Label>
                      <Textarea
                        id="alamat"
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan alamat lengkap"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Data Orang Tua */}
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                    Data Orang Tua/Wali
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nama_ayah">Nama Ayah *</Label>
                      <Input
                        id="nama_ayah"
                        name="nama_ayah"
                        value={formData.nama_ayah}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan nama ayah"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nama_ibu">Nama Ibu *</Label>
                      <Input
                        id="nama_ibu"
                        name="nama_ibu"
                        value={formData.nama_ibu}
                        onChange={handleChange}
                        required
                        placeholder="Masukkan nama ibu"
                      />
                    </div>
                    <div>
                      <Label htmlFor="no_telepon">No. Telepon/WhatsApp *</Label>
                      <Input
                        id="no_telepon"
                        name="no_telepon"
                        value={formData.no_telepon}
                        onChange={handleChange}
                        required
                        placeholder="Contoh: 081234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Contoh: email@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Program */}
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                    Program yang Dipilih
                  </h3>
                  <div>
                    <Label htmlFor="program">Pilih Program *</Label>
                    <Select
                      value={formData.program}
                      onValueChange={(value) => handleSelectChange("program", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih program pendidikan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tahfidz Reguler">Program Tahfidz Reguler (3 Tahun)</SelectItem>
                        <SelectItem value="Tahfidz Intensif">Program Tahfidz Intensif (2 Tahun)</SelectItem>
                        <SelectItem value="Diniyah">Program Diniyah (6 Tahun)</SelectItem>
                        <SelectItem value="Akademik">Program Akademik (6 Tahun)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Catatan */}
                <div>
                  <Label htmlFor="catatan">Catatan Tambahan</Label>
                  <Textarea
                    id="catatan"
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleChange}
                    placeholder="Catatan atau pertanyaan tambahan (opsional)"
                    rows={3}
                  />
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      "Kirim Pendaftaran"
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Dengan mengirim formulir ini, Anda menyetujui untuk dihubungi oleh tim kami
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pendaftaran;
