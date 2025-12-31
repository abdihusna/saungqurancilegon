import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground islamic-pattern">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Bergabunglah Bersama Kami
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Daftarkan putra-putri Anda sekarang dan wujudkan generasi Qur'ani yang terampil dan mandiri.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" asChild className="group">
              <Link to="/pendaftaran">
                Daftar Sekarang
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent border-white/30 text-white hover:bg-white/20 hover:text-white">
              <a href="tel:+6281234567890">
                <Phone className="mr-2 h-4 w-4" />
                Hubungi Kami
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
