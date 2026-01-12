import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
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

// Validation schema for registration form
const registrationSchema = z.object({
  nama_lengkap: z
    .string()
    .trim()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  tempat_lahir: z
    .string()
    .trim()
    .min(2, "Tempat lahir minimal 2 karakter")
    .max(100, "Tempat lahir maksimal 100 karakter"),
  tanggal_lahir: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid"),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], {
    errorMap: () => ({ message: "Pilih jenis kelamin" }),
  }),
  alamat: z
    .string()
    .trim()
    .min(10, "Alamat minimal 10 karakter")
    .max(500, "Alamat maksimal 500 karakter"),
  nama_ayah: z
    .string()
    .trim()
    .min(2, "Nama ayah minimal 2 karakter")
    .max(100, "Nama ayah maksimal 100 karakter"),
  nama_ibu: z
    .string()
    .trim()
    .min(2, "Nama ibu minimal 2 karakter")
    .max(100, "Nama ibu maksimal 100 karakter"),
  no_telepon: z
    .string()
    .trim()
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, "Format nomor telepon tidak valid (contoh: 081234567890)"),
  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter")
    .optional()
    .or(z.literal("")),
  program: z.enum(["Thufulah", "Tamyiz", "Murohaqoh", "TALQIN"], {
    errorMap: () => ({ message: "Pilih program pendidikan" }),
  }),
  asal_sekolah: z
    .string()
    .trim()
    .max(200, "Asal sekolah maksimal 200 karakter")
    .optional()
    .or(z.literal("")),
  catatan: z
    .string()
    .trim()
    .max(1000, "Catatan maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
});

const Pendaftaran = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user selects
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Validate form data
      const validatedData = registrationSchema.parse(formData);

      const { error } = await supabase.from("pendaftaran").insert([
        {
          nama_lengkap: validatedData.nama_lengkap,
          tempat_lahir: validatedData.tempat_lahir,
          tanggal_lahir: validatedData.tanggal_lahir,
          jenis_kelamin: validatedData.jenis_kelamin,
          alamat: validatedData.alamat,
          nama_ayah: validatedData.nama_ayah,
          nama_ibu: validatedData.nama_ibu,
          no_telepon: validatedData.no_telepon,
          email: validatedData.email || null,
          program: validatedData.program,
          asal_sekolah: validatedData.asal_sekolah || null,
          catatan: validatedData.catatan || null,
        },
      ]);

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Pendaftaran Berhasil!",
        description: "Data pendaftaran Anda telah kami terima. Tim kami akan menghubungi Anda segera.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setValidationErrors(errors);
        toast({
          title: "Data Tidak Valid",
          description: "Mohon periksa kembali data yang Anda masukkan.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Terjadi Kesalahan",
          description: "Gagal mengirim pendaftaran. Silakan coba lagi.",
          variant: "destructive",
        });
      }
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
                        placeholder="Masukkan nama lengkap"
                        maxLength={100}
                        className={validationErrors.nama_lengkap ? "border-destructive" : ""}
                      />
                      {validationErrors.nama_lengkap && (
                        <p className="text-sm text-destructive mt-1">{validationErrors.nama_lengkap}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="tempat_lahir">Tempat Lahir *</Label>
                      <Input
                        id="tempat_lahir"
                        name="tempat_lahir"
                        value={formData.tempat_lahir}
                        onChange={handleChange}
                        placeholder="Contoh: Cilegon"
                        maxLength={100}
                        className={validationErrors.tempat_lahir ? "border-destructive" : ""}
                      />
                      {validationErrors.tempat_lahir && (
                        <p className="text-sm text-destructive mt-1">{validationErrors.tempat_lahir}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="tanggal_lahir">Tanggal Lahir *</Label>
                      <Input
                        id="tanggal_lahir"
                        name="tanggal_lahir"
                        type="date"
                        value={formData.tanggal_lahir}
                        onChange={handleChange}
                        className={validationErrors.tanggal_lahir ? "border-destructive" : ""}
                      />
                      {validationErrors.tanggal_lahir && (
                        <p className="text-sm text-destructive mt-1">{validationErrors.tanggal_lahir}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
                      <Select
                        value={formData.jenis_kelamin}
                        onValueChange={(value) => handleSelectChange("jenis_kelamin", value)}
                      >
                        <SelectTrigger className={validationErrors.jenis_kelamin ? "border-destructive" : ""}>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                          <SelectItem value="Perempuan">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.jenis_kelamin && (
                        <p className="text-sm text-destructive mt-1">{validationErrors.jenis_kelamin}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="asal_sekolah">Asal Sekolah</Label>
                      <Input
                        id="asal_sekolah"
                        name="asal_sekolah"
                        value={formData.asal_sekolah}
                        onChange={handleChange}
                        placeholder="Contoh: SD Negeri 1 Cilegon"
                        maxLength={200}
                        className={validationErrors.asal_sekolah ? "border-destructive" : ""}
                      />
                      {validationErrors.asal_sekolah && (
                        <p className="text-sm text-destructive mt-1">{validationErrors.asal_sekolah}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="alamat">Alamat Lengkap *</Label>
                      <Textarea
                        id="alamat"
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        placeholder="Masukkan alamat lengkap"
                        rows={3}
                        maxLength={500}
                        className={validationErrors.alamat ? "border-destructive" : ""}
                      />
                      {validationErrors.alamat && (
                        <p className="text-sm text-destructive mt-1">{validationErrors.alamat}</p>
                      )}
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
                        placeholder="Masukkan nama ayah"
                        maxLength={100}
                        className={validationErrors.nama_ayah ? "border-destructive" : ""}
                      />
                      {validationErrors.nama_ayah && (
                        <p className="text-sm text-destructive mt-1">{validationErrors.nama_ayah}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="nama_ibu">Nama Ibu *</Label>
                      <Input
                        id="nama_ibu"
                        name="nama_ibu"
                        value={formData.nama_ibu}
                        onChange={handleChange}
                        placeholder="Masukkan nama ibu"
                        maxLength={100}
                        className={validationErrors.nama_ibu ? "border-destructive" : ""}
                      />
                      {validationErrors.nama_ibu && (
                        <p className="text-sm text-destructive mt-1">{validationErrors.nama_ibu}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="no_telepon">No. Telepon/WhatsApp *</Label>
                      <Input
                        id="no_telepon"
                        name="no_telepon"
                        value={formData.no_telepon}
                        onChange={handleChange}
                        placeholder="Contoh: 081234567890"
                        maxLength={15}
                        className={validationErrors.no_telepon ? "border-destructive" : ""}
                      />
                      {validationErrors.no_telepon && (
                        <p className="text-sm text-destructive mt-1">{validationErrors.no_telepon}</p>
                      )}
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
                        maxLength={255}
                        className={validationErrors.email ? "border-destructive" : ""}
                      />
                      {validationErrors.email && (
                        <p className="text-sm text-destructive mt-1">{validationErrors.email}</p>
                      )}
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
                      <SelectTrigger className={validationErrors.program ? "border-destructive" : ""}>
                        <SelectValue placeholder="Pilih program pendidikan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Thufulah">Program Thufulah (Usia 4-6 Tahun)</SelectItem>
                        <SelectItem value="Tamyiz">Program Tamyiz (Usia 6-12 Tahun)</SelectItem>
                        <SelectItem value="Murohaqoh">Program Murohaqoh (Usia 12-18 Tahun)</SelectItem>
                        <SelectItem value="TALQIN">Program TALQIN (Usia 4+ Tahun)</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.program && (
                      <p className="text-sm text-destructive mt-1">{validationErrors.program}</p>
                    )}
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
                    maxLength={1000}
                    className={validationErrors.catatan ? "border-destructive" : ""}
                  />
                  {validationErrors.catatan && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.catatan}</p>
                  )}
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
