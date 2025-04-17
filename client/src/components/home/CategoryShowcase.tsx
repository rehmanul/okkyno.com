import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Category } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryShowcase() {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Only show up to 6 categories
  const displayCategories = categories?.slice(0, 6);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">What Are You Looking For?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-3">
                  <Skeleton className="h-5 w-24 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !categories) {
    return (
      <section className="py-12 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-8">What Are You Looking For?</h2>
          <div className="text-center text-gray-500">
            Unable to load categories. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-8">What Are You Looking For?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((category) => (
            <Link key={category.id} href={`/products/category/${category.slug}`}>
              <a className="category-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group">
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={category.imageUrl || `https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80`} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-heading font-semibold text-dark">{category.name}</h3>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
