import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { heroImages } from '@/utils/constants';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <section className="bg-gradient-to-r from-primary/90 to-primary relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImages[currentSlide]} 
          alt="Garden background" 
          className="w-full h-full object-cover opacity-30 transition-opacity duration-1000"
        />
      </div>
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-4">
            Grow Your Perfect Garden
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Expert advice, quality plants, and premium tools for gardeners of all levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-bold">
                Shop Plants
              </Button>
            </Link>
            <Link href="/blog">
              <Button size="lg" variant="outline" className="bg-white hover:bg-gray-100 text-primary font-bold">
                Explore Our Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Navigation arrows */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full h-10 w-10 z-20 hidden md:flex"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full h-10 w-10 z-20 hidden md:flex"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-secondary" : "w-2 bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
    </section>
  );
}
