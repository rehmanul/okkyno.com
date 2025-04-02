import HeroSection from "@/components/home/hero-section";
import FeaturedCategories from "@/components/home/featured-categories";
import FeaturedProducts from "@/components/home/featured-products";
import LatestArticles from "@/components/home/latest-articles";
import GardeningGuide from "@/components/home/gardening-guide";
import Testimonials from "@/components/home/testimonials";
import Newsletter from "@/components/home/newsletter";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.title = "Epic Gardening - Grow Your Own Food";
  }, []);

  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <LatestArticles />
      <GardeningGuide />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default Home;
