import React, { useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Product, Category as CategoryType } from '@shared/schema';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from '@/contexts/CartContext';
import { toast } from "@/hooks/use-toast";
import { RouteComponentProps } from 'wouter';

// Product card component
const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart.`,
    });
  };
  
  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/product/${product.slug}`}>
        <div className="block cursor-pointer">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <img 
              src={product.imageUrl || '/images/products/default.svg'} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {product.salePrice && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                SALE
              </div>
            )}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <div className="block cursor-pointer">
            <h3 className="font-medium mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>
        </Link>
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold">
            {product.salePrice ? (
              <div className="flex items-center gap-2">
                <span>${product.salePrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span>${product.price.toFixed(2)}</span>
            )}
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="hover:bg-primary hover:text-white transition-colors rounded-full aspect-square p-0 w-8 h-8"
            onClick={handleAddToCart}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Loading skeletons
const CategorySkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="space-y-3">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-full max-w-xl" />
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Define props interface
interface CategoryProps {
  slug?: string;
  routeParams?: { slug: string };
}

// Main Category component
const Category = ({ slug: propSlug, routeParams }: CategoryProps) => {
  // Get category slug from URL or props
  const [, params] = useRoute('/category/:slug');
  const slug = propSlug || routeParams?.slug || params?.slug || '';
  
  // Fetch the category by slug
  const { data: category, isLoading: categoryLoading, error: categoryError } = useQuery<CategoryType>({
    queryKey: ['/api/categories', slug],
    queryFn: async () => {
      const response = await fetch(`/api/categories/${slug}`);
      if (!response.ok) throw new Error('Category not found');
      return response.json();
    },
    enabled: !!slug,
  });
  
  // Fetch products for the category
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/category', category?.id],
    queryFn: async () => {
      const response = await fetch(`/api/products/category/${category?.id}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
    enabled: !!category?.id,
  });
  
  const isLoading = categoryLoading || productsLoading;
  
  useEffect(() => {
    // Update page title when category loads
    if (category) {
      document.title = `${category.name} - Okkyno`;
    } else {
      document.title = 'Category - Okkyno';
    }
  }, [category]);
  
  // Handle 404 case
  if (categoryError) {
    return (
      <div className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Category Not Found</h1>
          <p className="text-gray-600 mb-8">
            The category you're looking for doesn't exist or may have been removed.
          </p>
          <Link href="/shop">
            <Button>Browse All Products</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="font-sans bg-white">
      <header>
        {/* Import the Header component */}
        {React.createElement(require('@/components/layout/Header').default)}
      </header>
      
      <main className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <div className="flex items-center text-sm">
              <Link href="/">
                <span className="text-gray-500 hover:text-primary cursor-pointer">Home</span>
              </Link>
              <span className="mx-2 text-gray-500">/</span>
              <Link href="/shop">
                <span className="text-gray-500 hover:text-primary cursor-pointer">Shop</span>
              </Link>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-gray-900">{category?.name || 'Loading...'}</span>
            </div>
          </div>
          
          {/* Main Content */}
          {isLoading ? (
            <CategorySkeleton />
          ) : (
            <div className="space-y-8">
              {/* Category Header */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-3">{category?.name}</h1>
                <p className="text-gray-600">{category?.description}</p>
              </div>
              
              {/* Products Grid */}
              {products && products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600 mb-4">
                    No products found in this category.
                  </p>
                  <Link href="/shop">
                    <Button variant="outline">Browse All Products</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer>
        {/* Import the Footer component */}
        {React.createElement(require('@/components/layout/Footer').default)}
      </footer>
    </div>
  );
};

export default Category;