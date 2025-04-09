import { Link } from "wouter";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-secondary/90 to-secondary py-20 lg:py-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Content */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-inter font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight text-gray-900">
              Welcome to <span className="text-primary">Okkyno</span> Gardening
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700 leading-relaxed">
              Transform your space into a thriving garden oasis. Get expert tips, grow fresh vegetables, 
              and create beautiful landscapes with our comprehensive gardening guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-8 rounded-lg text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  Start Growing Today
                </motion.span>
              </Link>
              <Link href="/guides">
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block bg-white hover:bg-gray-50 text-primary font-semibold py-4 px-8 rounded-lg border-2 border-primary text-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  Explore Guides
                </motion.span>
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="Beautiful organic garden with vegetables and flowers" 
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                style={{ aspectRatio: '4/3' }}
              />
              {/* Floating elements */}
              <motion.div 
                className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg hidden md:block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-leaf text-primary text-2xl"></i>
                  <div>
                    <p className="font-semibold text-gray-900">100% Organic</p>
                    <p className="text-sm text-gray-600">Natural Growing Tips</p>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                className="absolute -top-4 -right-4 bg-white p-4 rounded-lg shadow-lg hidden md:block"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <i className="fas fa-seedling text-primary text-2xl"></i>
                  <div>
                    <p className="font-semibold text-gray-900">Expert Guidance</p>
                    <p className="text-sm text-gray-600">Step-by-Step Support</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
