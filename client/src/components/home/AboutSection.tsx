import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image grid */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="/images/about/about-1.svg" 
                  alt="Urban garden with vegetables" 
                  className="rounded-lg shadow-md w-full h-auto object-cover aspect-square"
                />
                <img 
                  src="/images/about/about-2.svg" 
                  alt="Person tending plants" 
                  className="rounded-lg shadow-md w-full h-auto object-cover aspect-square"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="/images/about/about-3.svg" 
                  alt="Beautiful garden design" 
                  className="rounded-lg shadow-md w-full h-auto object-cover aspect-square"
                />
                <img 
                  src="/images/about/about-4.svg" 
                  alt="Organic produce harvest" 
                  className="rounded-lg shadow-md w-full h-auto object-cover aspect-square"
                />
              </div>
            </div>
          </motion.div>
          
          {/* Content */}
          <motion.div 
            className="lg:w-1/2 mt-10 lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">We Help You Grow Better Gardens</h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              At Okkyno, we believe everyone should have access to the joy and benefits of growing their own food. Since 2010, we've been helping gardeners of all skill levels succeed with practical, science-based advice.
            </p>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Our team of expert gardeners and horticulturists test growing methods in various climates to bring you the most reliable gardening information available.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Expert Advice</h3>
                  <p className="text-gray-600">Guidance from certified gardeners and plant specialists</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Quality Products</h3>
                  <p className="text-gray-600">Carefully selected tools and supplies for successful growing</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Community Support</h3>
                  <p className="text-gray-600">Join thousands of gardeners sharing tips and solutions</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Sustainable Methods</h3>
                  <p className="text-gray-600">Eco-friendly growing techniques for a healthier planet</p>
                </div>
              </div>
            </div>
            
            <Link href="/about">
              <Button className="px-6 py-3 text-base">Learn More About Us</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}