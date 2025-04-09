import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Category } from "@shared/schema";

const FeaturedCategories = () => {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Filter to just show the plant categories
  const plantCategories = categories?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-center mb-10">What Would You Like To Grow?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-lg bg-gray-200 mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-center mb-10">What Would You Like To Grow?</h2>
          <p className="text-center text-red-500">Failed to load categories</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-center mb-10">What Would You Like To Grow?</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {plantCategories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="group">
              <div className="aspect-square rounded-lg overflow-hidden relative mb-3">
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition duration-300"></div>
              </div>
              <h3 className="font-montserrat font-semibold text-center group-hover:text-primary transition duration-300">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
