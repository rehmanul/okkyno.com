import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Product, Category } from "@shared/schema";
import { useEffect, useState } from "react";
import Newsletter from "@/components/home/newsletter";

const Shop = () => {
  useEffect(() => {
    document.title = "Shop - Epic Gardening";
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const filteredProducts = selectedCategory
    ? products?.filter(product => product.categoryId === selectedCategory)
    : products;

  return (
    <>
      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-center">Shop</h1>
          <p className="text-center text-gray-700 mt-4 max-w-2xl mx-auto">
            Discover our selection of high-quality gardening products to help you create and maintain your perfect garden
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar with categories */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-montserrat font-bold text-xl mb-4">Categories</h2>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left py-2 px-3 rounded-md transition ${
                      selectedCategory === null ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    All Products
                  </button>
                  
                  {isLoadingCategories ? (
                    Array(5).fill(0).map((_, i) => (
                      <div key={i} className="h-10 bg-gray-200 rounded animate-pulse mb-2"></div>
                    ))
                  ) : (
                    categories?.map(category => (
                      <button 
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`block w-full text-left py-2 px-3 rounded-md transition ${
                          selectedCategory === category.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            {/* Products grid */}
            <div className="lg:w-3/4">
              {isLoadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
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
              ) : filteredProducts?.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="text-primary text-4xl mb-4">
                    <i className="fas fa-leaf"></i>
                  </div>
                  <h3 className="font-montserrat font-semibold text-xl mb-2">No Products Found</h3>
                  <p className="text-gray-700 mb-4">
                    We couldn't find any products in this category. Please try another category or check back later.
                  </p>
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="text-primary hover:underline"
                  >
                    View All Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts?.map((product) => (
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
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="font-montserrat font-semibold text-lg mb-2 hover:text-primary transition duration-300">{product.name}</h3>
                        </Link>
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
              )}
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
};

export default Shop;
