import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@shared/schema';

export interface CartItem {
  id: number;
  sessionId: string;
  productId: number;
  quantity: number;
  product?: Product;
}

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Calculate totals
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/cart', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch your cart items',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [toast]);

  // Add item to cart
  const addToCart = async (productId: number, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/cart', { productId, quantity });
      
      if (response.ok) {
        const newItem = await response.json();
        
        // Check if the item already exists in the cart
        const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
        
        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedItems = [...cartItems];
          updatedItems[existingItemIndex] = newItem;
          setCartItems(updatedItems);
        } else {
          // Add new item
          setCartItems([...cartItems, newItem]);
        }
        
        toast({
          title: 'Added to cart',
          description: `${newItem.product.name} added to your cart`,
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Could not add item to cart',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      
      if (quantity === 0) {
        await removeFromCart(itemId);
        return;
      }
      
      const response = await apiRequest('PATCH', `/api/cart/${itemId}`, { quantity });
      
      if (response.ok) {
        const updatedItem = await response.json();
        
        // Update cart items
        const updatedItems = cartItems.map(item => 
          item.id === itemId ? updatedItem : item
        );
        
        setCartItems(updatedItems);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: 'Error',
        description: 'Could not update item quantity',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: number) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('DELETE', `/api/cart/${itemId}`, undefined);
      
      if (response.ok) {
        // Remove item from cart
        setCartItems(cartItems.filter(item => item.id !== itemId));
        
        toast({
          title: 'Item removed',
          description: 'Item removed from your cart',
        });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: 'Could not remove item from cart',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('DELETE', '/api/cart', undefined);
      
      if (response.ok) {
        setCartItems([]);
        toast({
          title: 'Cart cleared',
          description: 'Your cart has been cleared',
        });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: 'Could not clear your cart',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        isLoading,
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart,
        itemCount,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
