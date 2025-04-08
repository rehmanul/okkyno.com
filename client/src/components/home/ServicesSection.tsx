import { cn } from "@/lib/utils";

type Service = {
  id: string;
  icon: JSX.Element;
  title: string;
  description: string;
};

const services: Service[] = [
  {
    id: "web-design",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3498db]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    title: "Website Design & Development",
    description: "Custom website solutions that are visually stunning, mobile-responsive, and optimized for conversions."
  },
  {
    id: "seo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3498db]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Search Engine Optimization",
    description: "Improve your search rankings and drive organic traffic with our data-driven SEO strategies."
  },
  {
    id: "paid-ads",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3498db]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    title: "Paid Advertising",
    description: "Targeted ad campaigns on Google, Facebook, Instagram, and other platforms to reach your ideal customers."
  },
  {
    id: "social-media",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3498db]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    ),
    title: "Social Media Marketing",
    description: "Strategic social media management to build your brand, engage your audience, and drive conversions."
  },
  {
    id: "email-marketing",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3498db]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Email Marketing",
    description: "Personalized email campaigns that nurture leads, build relationships, and increase customer lifetime value."
  },
  {
    id: "analytics",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3498db]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Analytics & Reporting",
    description: "Comprehensive tracking and analysis of your digital marketing performance with actionable insights."
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 px-4 bg-[#f5f5f5]">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-[#424242]">Our Services</h2>
          <p className="text-lg text-[#9e9e9e]">
            We offer a comprehensive range of digital marketing services to boost your online presence 
            and drive business growth.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="service-card bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="w-14 h-14 bg-[#3498db] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-[#424242]">{service.title}</h3>
                <p className="text-[#9e9e9e] mb-6">{service.description}</p>
                <a href="#contact" className="text-[#3498db] hover:text-[#2ecc71] font-medium transition duration-300 flex items-center">
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
