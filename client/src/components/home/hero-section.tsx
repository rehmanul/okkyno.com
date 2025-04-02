import { Link } from "wouter";

const HeroSection = () => {
  return (
    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="font-montserrat font-bold text-3xl md:text-5xl mb-4 leading-tight">Grow Your Own Food & Beautiful Gardens</h1>
            <p className="text-lg md:text-xl mb-6">Get expert gardening tips, grow vegetables and herbs at home, and transform your space into a thriving garden oasis.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-md text-center">Start Growing</Link>
              <Link href="/blog" className="bg-white hover:bg-gray-100 text-primary font-bold py-3 px-6 rounded-md border border-primary text-center">Explore Guides</Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Beautiful garden with vegetables and flowers" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
