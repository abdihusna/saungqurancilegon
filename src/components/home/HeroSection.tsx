import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1920&q=80"
          alt="Saung Qur'an Cilegon"
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-20" />

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center text-white">
          {/* Bismillah */}
          <p className="font-serif text-2xl md:text-3xl mb-6 animate-fade-up text-secondary">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-up delay-100">
            Saung Qur'an Cilegon
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed animate-fade-up delay-200">
            Mewujudkan Generasi Qur'ani, Terampil dan Mandiri
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
            <Button size="lg" asChild className="group">
              <Link to="/pendaftaran">
                Daftar Sekarang
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
              <Link to="/profil">
                Pelajari Lebih Lanjut
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto animate-fade-up delay-400">
          {[
            { icon: BookOpen, value: "5+", label: "Tahun Berdiri" },
            { icon: Users, value: "200+", label: "Santri Aktif" },
            { icon: Award, value: "5+", label: "Hafidz Al-Qur'an" },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
            >
              <stat.icon className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
