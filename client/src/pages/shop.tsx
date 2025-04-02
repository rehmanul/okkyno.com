import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Product, Category } from "@shared/schema";
import { useEffect, useState } from "react";
import Newsletter from "@/components/home/newsletter";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { ChevronRight, Star, ShoppingCart, Grid2X2, Filter, Leaf } from "lucide-react";

const Shop = () => {
  useEffect(() => {
    document.title = "Shop - Epic Gardening";
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { addToCart } = useCart();

  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const filteredProducts = selectedCategory
    ? products?.filter(product => product.categoryId === selectedCategory)
    : products;
    
  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  return (
    <>
      <div className="bg-primary text-white py-16 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-4">High-Quality Gardening Products</h1>
            <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto text-white/90">
              All products tested and approved by gardening experts
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="#featured">
                <button className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-6 rounded-md transition duration-300 flex items-center">
                  Shop Featured <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
              <Link href="#all-products">
                <button className="bg-transparent hover:bg-white/10 border-2 border-white font-semibold py-3 px-6 rounded-md transition duration-300">
                  View All Products
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center">
              <div className="mr-3 text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="font-medium">Expert Tested Products</span>
            </div>
            <div className="flex items-center">
              <div className="mr-3 text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="font-medium">Free Shipping Over $50</span>
            </div>
            <div className="flex items-center">
              <div className="mr-3 text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="font-medium">30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      <section id="featured" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-montserrat font-bold text-3xl mb-4">Featured Collections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Browse our most popular categories</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {!isLoadingCategories && categories?.slice(0, 3).map(category => (
              <div key={category.id} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=640&q=80`}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="font-montserrat font-bold text-xl mb-2">{category.name}</h3>
                  <p className="text-white/80 mb-4 text-sm line-clamp-2">{category.description || `Explore our selection of ${category.name.toLowerCase()}`}</p>
                  <button 
                    onClick={() => setSelectedCategory(category.id)}
                    className="bg-white text-primary hover:bg-gray-100 mt-2 py-2 px-4 rounded-md transition duration-300 inline-flex items-center self-start"
                  >
                    Shop Now <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {isLoadingCategories && 
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="relative overflow-hidden rounded-lg shadow-md animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-6">
                    <div className="h-6 bg-white/50 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-white/30 rounded w-full mb-4"></div>
                    <div className="h-10 bg-white/80 rounded w-1/3"></div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center flex flex-col items-center">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-montserrat font-bold text-3xl mb-2">All Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our complete selection of high-quality gardening tools and supplies
            </p>
          </div>

          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-medium mr-2">Filter:</span>
              {selectedCategory && categories?.find(c => c.id === selectedCategory) ? (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="ml-2 hover:text-primary/70"
                  >
                    ×
                  </button>
                </span>
              ) : (
                <span className="text-sm text-gray-500">All Products</span>
              )}
            </div>
            <div className="flex items-center">
              <Grid2X2 className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-sm text-gray-500">
                {filteredProducts?.length || 0} products
              </span>
            </div>
          </div>

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
                <div id="all-products" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts?.map((product) => (
                    <div key={product.id} className="card-wrapper product-card-wrapper bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="relative card__media">
                        <Link href={`/product/${product.slug}`}>
                          <div className="media media--hover-effect overflow-hidden">
                            <img 
                              src={product.imageUrl} 
                              alt={product.name} 
                              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                            />
                          </div>
                        </Link>
                        {(product.isBestSeller || product.isNew) && (
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.isBestSeller && (
                              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">BEST SELLER</span>
                            )}
                            {product.isNew && (
                              <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="card__content p-4">
                        <div className="flex items-center mb-1">
                          <div className="flex text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                          </div>
                          <span className="text-xs text-gray-500 ml-1">(22)</span>
                        </div>
                        
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="font-montserrat font-semibold text-base mb-1 hover:text-primary transition duration-300 line-clamp-2 h-12">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <div className="flex justify-between items-center mb-3">
                          <div className="price">
                            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                            {product.salePrice && (
                              <span className="text-gray-500 line-through ml-2 text-sm">${product.salePrice.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 flex items-center justify-center rounded-md transition"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                          </button>
                          <Link href={`/product/${product.slug}`} className="flex-shrink-0">
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2 rounded-md">
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </Link>
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

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-lg overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="text-white">
                  <span className="inline-block px-4 py-1 bg-white text-primary text-sm font-bold rounded-full mb-4">FEATURED PRODUCT</span>
                  <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-4">Herb Garden Kit</h2>
                  <p className="mb-6 text-white/90">
                    Complete starter kit with seeds, soil, and containers for growing your own culinary herbs at home. Includes basil, parsley, and mint.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/product/herb-garden-kit">
                      <button className="bg-white text-primary hover:bg-gray-100 py-3 px-6 rounded-md transition duration-300 font-semibold flex items-center">
                        Shop Now <ChevronRight className="ml-2 h-4 w-4" />
                      </button>
                    </Link>
                    <button 
                      onClick={() => {
                        const product = products?.find(p => p.slug === 'herb-garden-kit');
                        if (product) {
                          handleAddToCart(product);
                        } else {
                          toast({
                            title: "Product not found",
                            description: "This product is not available right now",
                            variant: "destructive"
                          });
                        }
                      }}
                      className="bg-transparent hover:bg-white/10 border-2 border-white text-white py-3 px-6 rounded-md transition duration-300 font-semibold"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1484507175567-a114f764f78b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                  alt="Herb Garden Kit" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Newsletter />
    </>
  );
};

export default Shop;
