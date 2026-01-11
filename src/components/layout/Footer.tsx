import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from "lucide-react";
import logoSQC from "@/assets/logo-sqc.png";

export function Footer() {
  return (
    <footer className="bg-islamic-dark text-white">
      {/* Main Footer */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={logoSQC} 
                alt="Logo Saung Qur'an Cilegon" 
                className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
              />
              <span className="font-serif text-xl font-bold whitespace-nowrap">
                Saung Qur'an Cilegon
              </span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed">
              Lembaga pendidikan Islam yang berkomitmen mewujudkan generasi Qur'ani, terampil dan mandiri.
            </p>
            {/* Social Media */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/saung.quran.cilegon/?locale=id_ID"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/saung.quran.cilegon/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.youtube.com/@saung.quran.cilegon"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-primary transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-4">Link Cepat</h4>
            <ul className="space-y-2">
              {[
                { name: "Profil Sekolah", path: "/profil" },
                { name: "Program Pendidikan", path: "/program-pendidikan" },
                { name: "Ekstrakurikuler", path: "/ekstrakurikuler" },
                { name: "Pendaftaran", path: "/pendaftaran" },
                { name: "Hubungi Kami", path: "/hubungi-kami" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-white/70">
                  Link. Ciberko Gg. Makam, RT 001/003. Kalitimbang, Cibeber, Kota Cilegon, Banten 42424
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+6287781818143" className="text-sm text-white/70 hover:text-primary">
                  +62 877-8181-8143
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:admin@saungqurancilegon.id" className="text-sm text-white/70 hover:text-primary">
                  admin@saungqurancilegon.id
                </a>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-4">Jam Operasional</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <div className="text-sm text-white/70">
                  <p>Senin - Jumat</p>
                  <p className="text-white">07:00 - 16:00 WIB</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <div className="text-sm text-white/70">
                  <p>Sabtu</p>
                  <p className="text-white">07:00 - 12:00 WIB</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Saung Qur'an Cilegon. All rights reserved.
          </p>
          <p className="text-sm text-white/50">
            Mewujudkan Generasi Qur'ani, Terampil dan Mandiri
          </p>
        </div>
      </div>
    </footer>
  );
}
