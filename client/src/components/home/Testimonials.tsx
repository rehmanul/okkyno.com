import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Testimonial } from "@shared/schema";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Fetch testimonials from API
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
    queryFn: async () => {
      const response = await fetch("/api/testimonials?approvedOnly=true");
      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }
      return response.json();
    }
  });

  // Auto-rotate testimonials every 6 seconds
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [testimonials]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our community of passionate gardeners
            </p>
          </div>
          
          <div className="animate-pulse max-w-4xl mx-auto">
            <div className="h-32 bg-white rounded-lg shadow p-8 flex items-center justify-center">
              <div className="space-y-3 w-full">
                <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No testimonials case
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our community of passionate gardeners
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative py-8">
            {testimonials.map((testimonial, i) => (
              <div 
                key={testimonial.id}
                className={`transition-opacity duration-500 ${
                  i === activeIndex ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}
              >
                <Card className="bg-white shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${
                            i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                          }`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    
                    <p className="text-lg text-gray-700 italic mb-6">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center justify-center">
                      {testimonial.customerImage ? (
                        <img 
                          src={testimonial.customerImage} 
                          alt={testimonial.customerName}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold mr-4">
                          {testimonial.customerName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="text-left">
                        <h4 className="font-semibold">{testimonial.customerName}</h4>
                        {testimonial.customerTitle && (
                          <p className="text-sm text-gray-600">{testimonial.customerTitle}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {testimonials.length > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="sm"
                    className={`w-3 h-3 p-0 rounded-full ${
                      i === activeIndex ? "bg-green-600" : "bg-gray-300"
                    }`}
                    onClick={() => setActiveIndex(i)}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => {
                document.getElementById("add-testimonial-form")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Share Your Experience
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}