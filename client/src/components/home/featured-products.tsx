import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Product } from "@shared/schema";

const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  if (isLoading) {
    return (
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-4 md:mb-0">Top Gardening Products</h2>
            <Link href="/shop" className="font-montserrat font-semibold text-primary hover:underline">View All Products</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-10 bg-gray-200 rounded w-28"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-4 md:mb-0">Top Gardening Products</h2>
            <Link href="/shop" className="font-montserrat font-semibold text-primary hover:underline">View All Products</Link>
          </div>
          <p className="text-center text-red-500">Failed to load products</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-4 md:mb-0">Top Gardening Products</h2>
          <Link href="/shop" className="font-montserrat font-semibold text-primary hover:underline">View All Products</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
              <div className="relative">
                <Link href={`/product/${product.slug}`}>
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-64 object-cover"
                  />
                </Link>
                {(product.isBestSeller || product.isNew) && (
                  <div className="absolute top-2 right-2">
                    {product.isBestSeller && (
                      <span className="bg-accent text-white text-sm font-semibold px-2 py-1 rounded-md">Best Seller</span>
                    )}
                    {product.isNew && !product.isBestSeller && (
                      <span className="bg-primary text-white text-sm font-semibold px-2 py-1 rounded-md">New</span>
                    )}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-montserrat font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.shortDescription}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                  <button className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
