import { Link } from "wouter";

const GardeningGuide = () => {
  return (
    <section className="bg-primary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
            <h2 className="font-montserrat font-bold text-2xl md:text-4xl mb-6">Get Our Complete Gardening Guide</h2>
            <p className="text-lg mb-6 opacity-90">Our comprehensive guide covers everything from soil preparation to harvesting. Learn how to grow your own food and create a beautiful garden oasis.</p>
            <ul className="mb-8 space-y-3">
              <li className="flex items-center">
                <i className="fas fa-check-circle mr-3 text-accent"></i>
                <span>Step-by-step planting instructions</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle mr-3 text-accent"></i>
                <span>Seasonal growing calendars</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle mr-3 text-accent"></i>
                <span>Pest control solutions</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check-circle mr-3 text-accent"></i>
                <span>Garden planning worksheets</span>
              </li>
            </ul>
            <Link href="/blog" className="inline-block bg-accent hover:bg-accent/90 text-white font-bold py-3 px-8 rounded-md">Get Your Guide</Link>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80" 
              alt="Gardening guide book with garden in background" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GardeningGuide;
