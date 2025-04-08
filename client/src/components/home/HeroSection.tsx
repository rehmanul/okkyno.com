export default function HeroSection() {
  return (
    <section id="home" className="hero-section pt-32 pb-20 md:pt-40 md:pb-28 px-4 text-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Grow Your Business with Exceptional Digital Marketing
          </h1>
          <p className="text-lg md:text-xl mb-10 opacity-90">
            We help businesses thrive in the digital world with innovative marketing strategies 
            tailored to your unique needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a 
              href="#services" 
              className="bg-white text-[#3498db] hover:bg-opacity-90 font-medium py-3 px-8 rounded-full transition duration-300 w-full sm:w-auto text-center"
            >
              Explore Services
            </a>
            <a 
              href="#contact" 
              className="bg-[#2ecc71] hover:bg-opacity-90 text-white font-medium py-3 px-8 rounded-full transition duration-300 w-full sm:w-auto text-center"
            >
              Get a Free Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
