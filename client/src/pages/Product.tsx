import { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Product as ProductType } from '@shared/schema';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

// Component for displaying star ratings
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      
      {hasHalfStar && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// Loading skeleton
const ProductSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-10">
    <div>
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="grid grid-cols-4 gap-2 mt-2">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="aspect-square w-full rounded-md" />
        ))}
      </div>
    </div>
    
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-4 w-40" />
      </div>
      
      <Skeleton className="h-24 w-full" />
      
      <div className="pt-4">
        <Skeleton className="h-10 w-40 mb-4" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  </div>
);

// Main Product component
const Product = () => {
  // Get product slug from URL
  const [, params] = useRoute('/product/:slug');
  const slug = params?.slug || '';
  
  // State for quantity input
  const [quantity, setQuantity] = useState(1);
  
  // Access cart context
  const { addToCart } = useCart();
  
  // Fetch product data
  const { data: product, isLoading, error } = useQuery<ProductType>({
    queryKey: ['/api/products', slug],
    queryFn: async () => {
      const response = await fetch(`/api/products/${slug}`);
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    },
    enabled: !!slug,
  });
  
  useEffect(() => {
    // Update page title when product loads
    if (product) {
      document.title = `${product.name} - Okkyno`;
    } else {
      document.title = 'Product - Okkyno';
    }
  }, [product]);
  
  // Handle quantity input changes
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };
  
  // Handle decrease quantity button
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Handle increase quantity button
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: 'Added to cart',
        description: `${quantity} × ${product.name} added to your cart.`,
      });
    }
  };
  
  // Handle 404 case
  if (error) {
    return (
      <div className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Product Not Found</h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or may have been removed.
          </p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center text-sm">
            <Link href="/">
              <a className="text-gray-500 hover:text-primary">Home</a>
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href="/shop">
              <a className="text-gray-500 hover:text-primary">Shop</a>
            </Link>
            {product?.categoryId && (
              <>
                <span className="mx-2 text-gray-500">/</span>
                <Link href={`/category/${product.categorySlug || 'products'}`}>
                  <a className="text-gray-500 hover:text-primary">{product.categoryName || 'Products'}</a>
                </Link>
              </>
            )}
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-900">{product?.name || 'Loading...'}</span>
          </div>
        </div>
        
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          {isLoading ? (
            <ProductSkeleton />
          ) : product ? (
            <div className="grid md:grid-cols-2 gap-10">
              {/* Product Image */}
              <div>
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={product.imageUrl || '/images/products/default.svg'} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.galleryImages && product.galleryImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {product.galleryImages.map((image, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden bg-gray-100">
                        <img 
                          src={image} 
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">{product.name}</h1>
                  {product.sku && (
                    <p className="text-gray-500 text-sm">SKU: {product.sku}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold">
                    {product.salePrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-primary">${product.salePrice.toFixed(2)}</span>
                        <span className="text-base text-gray-500 line-through">${product.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span>${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {product.rating && (
                    <div className="flex items-center gap-1">
                      <StarRating rating={product.rating} />
                      <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
                    </div>
                  )}
                </div>
                
                <div className="text-gray-700">
                  <p>{product.description}</p>
                </div>
                
                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {product.inStock ? (
                    <div className="text-green-600 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>In Stock</span>
                    </div>
                  ) : (
                    <div className="text-red-600 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>
                
                {/* Add to Cart */}
                {product.inStock && (
                  <div className="pt-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center">
                        <button 
                          onClick={decreaseQuantity}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <Input
                          type="number"
                          value={quantity}
                          onChange={handleQuantityChange}
                          min="1"
                          className="w-16 h-10 text-center rounded-none border-x-0"
                        />
                        <button 
                          onClick={increaseQuantity}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleAddToCart}
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      size="lg"
                    >
                      Add to Cart
                    </Button>
                  </div>
                )}
                
                {/* Product Specs */}
                {product.specifications && (
                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-medium mb-2">Specifications</h3>
                    <ul className="space-y-1 text-sm">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <li key={key} className="grid grid-cols-2 gap-2">
                          <span className="text-gray-600">{key}</span>
                          <span>{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
        
        {/* Additional Information */}
        {!isLoading && product && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-10">
            <Tabs defaultValue="description">
              <TabsList className="w-full border-b mb-6">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="additional">Additional Information</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description">
                <div className="prose max-w-none">
                  <h3>Product Description</h3>
                  <p>{product.longDescription || product.description}</p>
                  
                  {/* Placeholder content if no long description */}
                  {!product.longDescription && (
                    <>
                      <p>
                        Our {product.name} is designed to help gardeners achieve the best results in their garden. 
                        Made with high-quality materials, this product is durable and will last for many growing seasons.
                      </p>
                      <h4>Features:</h4>
                      <ul>
                        <li>High-quality construction</li>
                        <li>Designed for ease of use</li>
                        <li>Perfect for both beginners and experienced gardeners</li>
                        <li>Environmentally friendly materials</li>
                      </ul>
                    </>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="additional">
                <div className="prose max-w-none">
                  <h3>Additional Information</h3>
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-500 bg-gray-50">Weight</td>
                        <td className="px-4 py-3">{product.weight || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-500 bg-gray-50">Dimensions</td>
                        <td className="px-4 py-3">{product.dimensions || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-500 bg-gray-50">Materials</td>
                        <td className="px-4 py-3">{product.materials || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-500 bg-gray-50">Warranty</td>
                        <td className="px-4 py-3">{product.warranty || '1 year limited warranty'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <div className="prose max-w-none">
                  <h3>Customer Reviews</h3>
                  {product.reviewCount && product.reviewCount > 0 ? (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <StarRating rating={product.rating || 5} />
                        <span>({product.reviewCount} reviews)</span>
                      </div>
                      
                      {/* Placeholder reviews */}
                      <div className="space-y-6">
                        <div className="border-b pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <StarRating rating={5} />
                            <span className="font-medium">Excellent product</span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            This product exceeded my expectations. Very well made and works perfectly for my garden.
                          </p>
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">John D.</span> - 2 months ago
                          </div>
                        </div>
                        
                        <div className="border-b pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <StarRating rating={4} />
                            <span className="font-medium">Good value</span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            Good quality for the price. I would recommend this to any gardener.
                          </p>
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Sarah M.</span> - 3 weeks ago
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <p className="text-gray-600 mb-4">There are no reviews for this product yet.</p>
                      <Button variant="outline">Be the first to write a review</Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* Related Products */}
        {!isLoading && product && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="aspect-square bg-gray-100 rounded-md mb-4"></div>
                  <h3 className="font-medium mb-1">Related Product</h3>
                  <p className="text-primary font-bold mb-2">$29.99</p>
                  <Button variant="outline" size="sm" className="w-full">View</Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;