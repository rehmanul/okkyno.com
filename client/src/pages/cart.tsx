import { useEffect } from "react";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const CartPage = () => {
  useEffect(() => {
    document.title = "Shopping Cart - Epic Gardening";
  }, []);

  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  
  // Handle quantity changes with validation and notifications
  const handleQuantityChange = (productId: number, newQuantity: number, productName: string) => {
    if (newQuantity < 1) return;
    
    updateQuantity(productId, newQuantity);
    
    toast({
      title: "Cart updated",
      description: `Updated ${productName} quantity to ${newQuantity}`,
    });
  };
  
  // Handle item removal with confirmation toast
  const handleRemoveItem = (productId: number, productName: string) => {
    removeFromCart(productId);
    
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart`,
    });
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-primary text-7xl mb-6">
            <ShoppingCart />
          </div>
          <h1 className="font-montserrat font-bold text-3xl mb-4">Your Shopping Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link href="/shop">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-montserrat font-bold text-3xl mb-8 text-center md:text-left">Your Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-2">Product</th>
                    <th className="text-center py-4 px-2">Price</th>
                    <th className="text-center py-4 px-2">Quantity</th>
                    <th className="text-right py-4 px-2">Subtotal</th>
                    <th className="text-right py-4 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.product.id} className="border-b">
                      <td className="py-4 px-2">
                        <div className="flex items-center">
                          <img
                            src={item.product.imageUrl || ''}
                            alt={item.product.name}
                            className="h-16 w-16 object-cover rounded mr-4"
                          />
                          <div>
                            <Link href={`/product/${item.product.slug}`}>
                              <span className="font-medium hover:text-primary transition">
                                {item.product.name}
                              </span>
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-2">
                        ${item.product.price.toFixed(2)}
                      </td>
                      <td className="text-center py-4 px-2">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1, item.product.name)}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            aria-label="Decrease quantity"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1, item.product.name)}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            aria-label="Increase quantity"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="text-right py-4 px-2 font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="text-right py-4 px-2">
                        <button
                          onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                          className="text-destructive hover:text-destructive/80 transition"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between">
            <Link href="/shop">
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="font-montserrat font-bold text-xl mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between border-b pb-4">
                <span>Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-4">
                <span>Shipping</span>
                <span>{cartTotal > 50 ? "Free" : "$5.99"}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(cartTotal > 50 ? cartTotal : cartTotal + 5.99).toFixed(2)}</span>
              </div>
            </div>
            
            <Link href="/checkout">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Proceed to Checkout
              </Button>
            </Link>
            
            <div className="mt-6 text-sm text-gray-600">
              <p className="flex items-center mb-2">
                <span className="text-primary mr-2">✓</span> Free shipping on orders over $50
              </p>
              <p className="flex items-center mb-2">
                <span className="text-primary mr-2">✓</span> 30-day money-back guarantee
              </p>
              <p className="flex items-center">
                <span className="text-primary mr-2">✓</span> Secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;