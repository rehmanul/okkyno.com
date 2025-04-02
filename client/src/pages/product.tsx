import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Product } from "@shared/schema";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const ProductPage = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
  });

  useEffect(() => {
    if (product) {
      document.title = `${product.name} - Epic Gardening`;
    } else {
      document.title = "Product - Epic Gardening";
    }
  }, [product]);

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const { addToCart: addToCartContext } = useCart();
  
  const addToCart = () => {
    if (!product) return;
    
    addToCartContext(product, quantity);
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart`,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="md:w-1/2">
              <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-full mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-lg mx-auto">
          <div className="text-primary text-4xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h1 className="font-montserrat font-bold text-2xl mb-4">Product Not Found</h1>
          <p className="text-gray-700 mb-6">The product you're looking for doesn't exist or may have been removed.</p>
          <Link href="/shop">
            <Button className="bg-primary hover:bg-primary/90 text-white">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/2">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        
        <div className="md:w-1/2">
          <div className="mb-2">
            <Link href="/shop" className="text-sm text-gray-500 hover:text-primary">
              <i className="fas fa-arrow-left mr-2"></i> Back to Shop
            </Link>
          </div>
          
          <h1 className="font-montserrat font-bold text-3xl mb-2">{product.name}</h1>
          
          <div className="mb-4">
            <span className="font-bold text-2xl text-primary">${product.price.toFixed(2)}</span>
            {product.salePrice && (
              <span className="ml-2 text-gray-500 line-through">${product.salePrice.toFixed(2)}</span>
            )}
          </div>
          
          {(product.isBestSeller || product.isNew) && (
            <div className="mb-4">
              {product.isBestSeller && (
                <span className="bg-accent text-white text-sm font-semibold px-3 py-1 rounded-md mr-2">Best Seller</span>
              )}
              {product.isNew && (
                <span className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded-md">New</span>
              )}
            </div>
          )}
          
          <p className="text-gray-700 mb-6">{product.description || product.shortDescription}</p>
          
          <div className="flex items-center mb-6">
            <span className="mr-4 font-montserrat">Quantity:</span>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button 
                onClick={decreaseQuantity}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
              >
                -
              </button>
              <div className="px-4 py-2 flex items-center justify-center min-w-12">
                {quantity}
              </div>
              <button 
                onClick={increaseQuantity}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
              >
                +
              </button>
            </div>
          </div>
          
          <button 
            onClick={addToCart}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-md mb-4 transition"
          >
            Add to Cart
          </button>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex items-center mb-3">
              <i className="fas fa-check-circle text-primary mr-2"></i>
              <span className="text-gray-700">Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center mb-3">
              <i className="fas fa-check-circle text-primary mr-2"></i>
              <span className="text-gray-700">30-day money-back guarantee</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-check-circle text-primary mr-2"></i>
              <span className="text-gray-700">Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="font-montserrat font-bold text-2xl mb-6">Product Details</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="prose max-w-none">
            <p>{product.description || "No detailed description available for this product."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
