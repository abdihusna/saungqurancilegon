import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Instagram, Youtube } from "lucide-react";

const HubungiKami = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 animate-fade-up">
              Hubungi Kami
            </h1>
            <p className="text-lg text-primary-foreground/90 animate-fade-up delay-100">
              Kami siap menjawab pertanyaan Anda
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Map */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                Informasi Kontak
              </h2>

              <div className="space-y-6">
                {/* Address */}
                <div className="islamic-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent rounded-xl">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Alamat</h3>
                      <p className="text-muted-foreground">
                        Link Ciberko Gg. Makam, RT.001/RW.003<br />
                        Kalitimbang, Kec. Cibeber, Kota Cilegon<br />
                        Banten 42426
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="islamic-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent rounded-xl">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Telepon</h3>
                      <a
                        href="tel:+6287781818143"
                        className="text-primary hover:underline"
                      >
                        +62 877-8181-8143
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        (Senin - Sabtu, 08:00 - 16:00)
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="islamic-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                      <a
                        href="https://wa.me/6287781818143"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        +62 877-8181-8143
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        Respon lebih cepat via WhatsApp
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="islamic-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent rounded-xl">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a
                        href="mailto:admin@saungqurancilegon.id"
                        className="text-primary hover:underline"
                      >
                        admin@saungqurancilegon.id
                      </a>
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="islamic-card p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent rounded-xl">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Jam Operasional</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Senin - Jumat</span>
                          <span className="text-foreground">07:00 - 16:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sabtu</span>
                          <span className="text-foreground">07:00 - 12:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Minggu</span>
                          <span className="text-foreground">Tutup</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-semibold text-foreground mb-4">Ikuti Kami</h3>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.facebook.com/saung.quran.cilegon/?locale=id_ID"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-accent hover:bg-primary hover:text-primary-foreground rounded-xl transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/saung.quran.cilegon/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-accent hover:bg-primary hover:text-primary-foreground rounded-xl transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="https://www.youtube.com/@saung.quran.cilegon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-accent hover:bg-primary hover:text-primary-foreground rounded-xl transition-colors"
                    aria-label="Youtube"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                Lokasi Kami
              </h2>
              <div className="islamic-card overflow-hidden h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d989.2816903684074!2d106.02972028630174!3d-6.372503799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e4224bba93d79eb%3A0xf8ffc5bf74edd8db!2sSaung%20Quran%20Cilegon!5e0!3m2!1sid!2sid!4v1737500000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Saung Qur'an Cilegon"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Klik peta untuk navigasi menggunakan Google Maps
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            Ada Pertanyaan?
          </h2>
          <p className="text-primary-foreground/90 mb-6">
            Jangan ragu untuk menghubungi kami. Kami siap membantu Anda.
          </p>
          <a
            href="https://wa.me/6287781818143"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Chat via WhatsApp
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default HubungiKami;
