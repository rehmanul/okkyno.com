import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GardenHeroSection from "@/components/home/GardenHeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AboutSection from "@/components/home/AboutSection";
import CTASection from "@/components/home/CTASection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ContactSection from "@/components/home/ContactSection";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="font-sans bg-white">
      <Header />
      
      <main>
        <GardenHeroSection />
        <FeaturedCategories />
        <FeaturedProducts />
        <AboutSection />
        <TestimonialsSection />
        <CTASection />
        <ContactSection />
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}
