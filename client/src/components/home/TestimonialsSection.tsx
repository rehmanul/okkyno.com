import { Skeleton } from "@/components/ui/skeleton";

// Define local testimonial type
type Testimonial = {
  id: string;
  personName: string;
  role: string;
  content: string;
  rating: number;
  avatarUrl: string;
  tags: string[];
};

// Hardcoded testimonials array to match Epic Gardening style
const testimonials: Testimonial[] = [
  {
    id: "1",
    personName: "Sarah Johnson",
    role: "Hobby Gardener",
    avatarUrl: "/images/testimonials/sarah.svg",
    content: "I've been using the raised garden bed kit for two seasons now and it's held up beautifully. My vegetable yields have increased dramatically with the improved drainage and soil quality!",
    rating: 5,
    tags: ["Vegetables", "Containers"]
  },
  {
    id: "2",
    personName: "Michael Chen",
    role: "Urban Gardener",
    avatarUrl: "/images/testimonials/michael.svg",
    content: "As someone with limited space, the container gardening supplies have been a game-changer. I've successfully grown tomatoes, herbs, and even peppers on my small balcony!",
    rating: 5,
    tags: ["Herbs", "Containers"]
  },
  {
    id: "3",
    personName: "Emma Rodriguez",
    role: "Master Gardener",
    avatarUrl: "/images/testimonials/emma.svg",
    content: "The organic pest control products have made a huge difference in my garden. I no longer worry about harmful chemicals affecting my family or the beneficial insects in my yard.",
    rating: 4,
    tags: ["Pest Control", "Vegetables"]
  }
];

export default function TestimonialsSection() {
  // Simulate loading state for demo purposes
  const isLoading = false;
  const error = null;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`star-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    // Half star if needed
    if (hasHalfStar) {
      stars.push(
        <svg key="half-star" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    // Empty stars to fill up to 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-star-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    return stars;
  };

  return (
    <section id="testimonials" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Happy Gardeners</h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it. Here's what our customers have to say about their gardening success with us.
          </p>
        </div>
        
        {isLoading ? (
          // Loading skeleton UI
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-14 h-14 rounded-full mr-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-28 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-6 w-full mt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-red-500">
              We encountered an error loading testimonials. Please try again later.
            </p>
          </div>
        ) : (
          // Testimonials grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => {
              // Get tags directly from the testimonial object
              const tags = testimonial.tags || [];
              
              return (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-green-100 flex items-center justify-center mr-4">
                      {testimonial.avatarUrl ? (
                        <img 
                          src={testimonial.avatarUrl} 
                          alt={testimonial.personName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-green-600 text-xl font-bold">
                          {testimonial.personName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{testimonial.personName}</h4>
                      <p className="text-gray-500 text-sm">{testimonial.role || "Garden Enthusiast"}</p>
                    </div>
                  </div>
                  <div className="mb-4 flex">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-600 mb-4">{testimonial.content}</p>
                  {tags.length > 0 && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
