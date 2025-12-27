import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { VisionMissionSection } from "@/components/home/VisionMissionSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { FacilitiesSection } from "@/components/home/FacilitiesSection";
import { GallerySection } from "@/components/home/GallerySection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <VisionMissionSection />
      <FeaturesSection />
      <FacilitiesSection />
      <GallerySection />
      <CTASection />
    </Layout>
  );
};

export default Index;
