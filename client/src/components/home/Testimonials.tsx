import { useQuery } from '@tanstack/react-query';
import { Testimonial } from '@shared/schema';
import { Rating } from '@/components/ui/rating';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/formatters';

export default function Testimonials() {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
    queryFn: async () => {
      const response = await fetch('/api/testimonials');
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      return response.json();
    }
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex items-center">
                  <Skeleton className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !testimonials) {
    return (
      <section className="py-12 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">What Our Customers Say</h2>
          <div className="text-center text-gray-500 py-8">
            Unable to load testimonials. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-8">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-3">
                <Rating value={testimonial.rating} max={5} readonly />
              </div>
              <p className="text-gray-600 italic mb-4">{testimonial.content}</p>
              <div className="flex items-center">
                <Avatar className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <AvatarImage src={testimonial.customerImage} alt={testimonial.customerName} />
                  <AvatarFallback>{getInitials(testimonial.customerName)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{testimonial.customerName}</h4>
                  {testimonial.customerTitle && (
                    <p className="text-sm text-gray-500">{testimonial.customerTitle}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
