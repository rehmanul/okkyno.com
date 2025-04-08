import { useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

const Cart = () => {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  
  useEffect(() => {
    document.title = "Shopping Cart - Okkyno";
  }, []);
  
  // Handle quantity change
  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    updateQuantity(productId, quantity);
  };
  
  // Handle remove item
  const handleRemoveItem = (productId: number, productName: string) => {
    removeFromCart(productId);
    toast({
      title: "Item Removed",
      description: `${productName} has been removed from your cart.`,
    });
  };
  
  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link href="/shop">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="hidden md:flex items-center bg-gray-50 p-4 text-sm font-medium text-gray-500">
                  <div className="w-2/5">Product</div>
                  <div className="w-1/5 text-center">Price</div>
                  <div className="w-1/5 text-center">Quantity</div>
                  <div className="w-1/5 text-center">Total</div>
                </div>
                
                <ul className="divide-y">
                  {cart.map((item) => {
                    const price = item.product.salePrice || item.product.price;
                    const itemTotal = price * item.quantity;
                    
                    return (
                      <li key={item.product.id} className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center">
                          {/* Product */}
                          <div className="md:w-2/5 flex items-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                              <img 
                                src={item.product.imageUrl || '/images/products/default.svg'} 
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <Link href={`/product/${item.product.slug}`}>
                                <a className="font-medium hover:text-primary transition-colors">
                                  {item.product.name}
                                </a>
                              </Link>
                              
                              {/* Mobile-only price */}
                              <div className="flex justify-between mt-2 md:hidden">
                                <span className="font-medium">${price.toFixed(2)}</span>
                                <button 
                                  onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                                  className="text-gray-500 hover:text-red-600 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="md:w-1/5 text-center hidden md:block">
                            ${price.toFixed(2)}
                          </div>
                          
                          {/* Quantity */}
                          <div className="md:w-1/5 text-center mt-4 md:mt-0">
                            <div className="flex items-center justify-center">
                              <button 
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l bg-gray-50"
                                disabled={item.quantity <= 1}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value) || 1)}
                                min="1"
                                className="w-14 h-8 text-center rounded-none border-l-0 border-r-0"
                              />
                              <button 
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r bg-gray-50"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          {/* Total */}
                          <div className="md:w-1/5 text-center mt-4 md:mt-0 flex items-center justify-between md:justify-center">
                            <span className="md:hidden">Total:</span>
                            <span className="font-medium">${itemTotal.toFixed(2)}</span>
                            <button 
                              onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                              className="ml-4 text-gray-500 hover:text-red-600 transition-colors hidden md:block"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button variant="outline">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Cart Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({cartCount})</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="pb-4">
                  <div className="relative">
                    <Input
                      placeholder="Enter coupon code"
                      className="pr-20"
                    />
                    <Button 
                      variant="ghost"
                      className="absolute right-0 top-0 h-full px-3"
                      type="button"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="py-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-500 text-xs">
                    Shipping and taxes calculated at checkout
                  </p>
                </div>
                
                <Link href="/checkout">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;