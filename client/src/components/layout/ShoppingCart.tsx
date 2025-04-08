import { useState } from "react";
import { Link } from "wouter";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart as ShoppingCartIcon,
  X,
  Plus,
  Minus,
  Trash2
} from "lucide-react";

// Mock cart items type - this would come from your cart state management
type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export default function ShoppingCart() {
  const [open, setOpen] = useState(false);
  // Mock cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Raised Garden Bed Kit",
      price: 59.99,
      quantity: 1,
      image: "/images/products/10328_Large_short_LightClay.svg"
    },
    {
      id: 2,
      name: "Tomato Seeds",
      price: 3.99,
      quantity: 2,
      image: "/images/products/tomato_seeds.svg"
    }
  ]);

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCartIcon className="h-6 w-6 text-primary" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Shopping Cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[90vw] sm:w-[450px] overflow-y-auto">
        <SheetHeader className="text-left">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">Your Cart ({totalItems})</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        
        <div className="py-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-muted-foreground text-lg">Your cart is empty</div>
              <SheetClose asChild>
                <Button className="mt-4">
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </SheetClose>
            </div>
          ) : (
            <div className="flex flex-col space-y-5">
              {cartItems.map((item) => (
                <div key={item.id} className="flex space-x-4">
                  <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-primary font-medium mt-1">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full border hover:bg-gray-100"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="mx-2 text-sm w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full border hover:bg-gray-100"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <>
            <Separator />
            <div className="py-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-muted-foreground">Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            
            <SheetFooter className="sm:justify-start">
              <SheetClose asChild>
                <Link href="/checkout">
                  <Button className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="outline" className="w-full mt-2">
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}