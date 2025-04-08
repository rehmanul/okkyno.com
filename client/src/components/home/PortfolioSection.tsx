import { useState } from "react";
import { cn } from "@/lib/utils";

type PortfolioItem = {
  id: string;
  category: "web" | "seo" | "social";
  title: string;
  description: string;
  image: string;
  tags: string[];
};

const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    category: "web",
    title: "Luxury Fashion E-commerce",
    description: "A responsive e-commerce platform with seamless checkout process and personalized recommendations.",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Web Design", "E-commerce"]
  },
  {
    id: "2",
    category: "seo",
    title: "Real Estate SEO Campaign",
    description: "Improved organic rankings for a real estate company, resulting in 150% increase in lead generation.",
    image: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["SEO", "Content Marketing"]
  },
  {
    id: "3",
    category: "social",
    title: "Food Delivery App Launch",
    description: "Social media campaign that generated 25,000+ app downloads within the first month of launch.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Social Media", "Paid Advertising"]
  },
  {
    id: "4",
    category: "web",
    title: "Healthcare Provider Portal",
    description: "A secure patient management system with telehealth capabilities and appointment scheduling.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Web Development", "UI/UX Design"]
  },
  {
    id: "5",
    category: "seo",
    title: "Local Restaurant SEO",
    description: "Helped a restaurant chain dominate local search results, increasing walk-in traffic by 85%.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Local SEO", "Google My Business"]
  },
  {
    id: "6",
    category: "social",
    title: "Fitness Brand Social Strategy",
    description: "Comprehensive social media management that grew the audience by 200K followers in 6 months.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    tags: ["Social Media", "Content Creation"]
  }
];

type FilterCategory = "all" | "web" | "seo" | "social";

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  const handleFilterClick = (filter: FilterCategory) => {
    setActiveFilter(filter);
  };

  const filteredItems = activeFilter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-[#424242]">Our Portfolio</h2>
          <p className="text-lg text-[#9e9e9e]">
            Take a look at some of our recent projects and the results we've achieved for our clients.
          </p>
        </div>
        
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              className={cn(
                "px-6 py-2 rounded-full font-medium transition duration-300",
                activeFilter === "all" 
                  ? "bg-[#3498db] text-white" 
                  : "bg-[#e0e0e0] hover:bg-[#3498db] hover:text-white"
              )}
              onClick={() => handleFilterClick("all")}
            >
              All
            </button>
            <button 
              className={cn(
                "px-6 py-2 rounded-full font-medium transition duration-300",
                activeFilter === "web" 
                  ? "bg-[#3498db] text-white" 
                  : "bg-[#e0e0e0] hover:bg-[#3498db] hover:text-white"
              )}
              onClick={() => handleFilterClick("web")}
            >
              Web Design
            </button>
            <button 
              className={cn(
                "px-6 py-2 rounded-full font-medium transition duration-300",
                activeFilter === "seo" 
                  ? "bg-[#3498db] text-white" 
                  : "bg-[#e0e0e0] hover:bg-[#3498db] hover:text-white"
              )}
              onClick={() => handleFilterClick("seo")}
            >
              SEO
            </button>
            <button 
              className={cn(
                "px-6 py-2 rounded-full font-medium transition duration-300",
                activeFilter === "social" 
                  ? "bg-[#3498db] text-white" 
                  : "bg-[#e0e0e0] hover:bg-[#3498db] hover:text-white"
              )}
              onClick={() => handleFilterClick("social")}
            >
              Social Media
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="rounded-lg overflow-hidden shadow-md">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-white">
                <h3 className="font-heading text-xl font-bold mb-2 text-[#424242]">{item.title}</h3>
                <p className="text-[#9e9e9e] mb-4">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-[#3498db] bg-opacity-10 text-[#3498db] text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
