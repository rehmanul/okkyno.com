import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCart } from '@/contexts/CartContext';
import { toast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/queryClient';

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  zipCode: z.string().min(3, 'ZIP/Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  shippingMethod: z.enum(['standard', 'express', 'overnight']),
  orderNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Checkout steps enum
enum CheckoutStep {
  SHIPPING = 0,
  PAYMENT = 1,
  REVIEW = 2,
  CONFIRMATION = 3,
}

// Main Checkout component
const Checkout = () => {
  const [, setLocation] = useLocation();
  const { cart, cartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.SHIPPING);
  const [orderData, setOrderData] = useState<FormValues | null>(null);
  
  // Shipping cost calculation
  const shippingCosts = {
    standard: 5.99,
    express: 12.99,
    overnight: 24.99,
  };
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      shippingMethod: 'standard',
      orderNotes: '',
    },
  });
  
  // Calculate shipping cost based on selected method
  const shippingCost = orderData 
    ? shippingCosts[orderData.shippingMethod] 
    : shippingCosts.standard;
  
  // Calculate total with shipping
  const total = cartTotal + shippingCost;
  
  useEffect(() => {
    document.title = "Checkout - Okkyno";
    
    // Redirect to cart if cart is empty
    if (cart.length === 0 && currentStep !== CheckoutStep.CONFIRMATION) {
      setLocation('/cart');
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items before checkout.",
        variant: "destructive",
      });
    }
  }, [cart, currentStep, setLocation]);
  
  // Handle shipping form submission
  const onSubmit = (data: FormValues) => {
    setOrderData(data);
    setCurrentStep(CheckoutStep.PAYMENT);
    window.scrollTo(0, 0);
  };
  
  // Handle payment submission
  const handlePayment = async () => {
    try {
      // Call our payment endpoint with order data and cart information
      const response = await apiRequest('POST', '/api/create-payment-intent', {
        amount: total,
        items: cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        customer: {
          name: `${orderData?.firstName} ${orderData?.lastName}`,
          email: orderData?.email,
          phone: orderData?.phone,
          address: {
            street: orderData?.address,
            city: orderData?.city,
            state: orderData?.state,
            zip: orderData?.zipCode,
            country: orderData?.country
          }
        },
        shipping: {
          method: orderData?.shippingMethod,
          cost: shippingCost
        }
      });
      
      // In a real implementation, we would use the response to handle Stripe
      // But for now, we'll just move to the next step
      console.log('Payment response:', response);
      
      // Move to the review step
      setCurrentStep(CheckoutStep.REVIEW);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle order confirmation
  const confirmOrder = () => {
    // Place the order
    toast({
      title: "Order Placed!",
      description: "Your order has been successfully placed.",
    });
    
    // Clear the cart
    clearCart();
    
    // Move to confirmation step
    setCurrentStep(CheckoutStep.CONFIRMATION);
    window.scrollTo(0, 0);
  };
  
  // Return to the previous step
  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        
        {/* Checkout Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              'Shipping', 
              'Payment', 
              'Review', 
              'Confirmation'
            ].map((step, index) => (
              <div 
                key={step} 
                className="flex flex-col items-center"
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                    index <= currentStep 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <span 
                  className={`text-sm ${
                    index <= currentStep ? 'text-primary font-medium' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="md:col-span-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* Shipping Information */}
              {currentStep === CheckoutStep.SHIPPING && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP/Postal Code</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="shippingMethod"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Shipping Method</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-2"
                              >
                                <div className="flex items-center space-x-2 border p-3 rounded-lg">
                                  <RadioGroupItem value="standard" id="standard" />
                                  <Label htmlFor="standard" className="flex-1">
                                    <div className="flex justify-between">
                                      <span>Standard Shipping (3-5 business days)</span>
                                      <span className="font-semibold">${shippingCosts.standard.toFixed(2)}</span>
                                    </div>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-lg">
                                  <RadioGroupItem value="express" id="express" />
                                  <Label htmlFor="express" className="flex-1">
                                    <div className="flex justify-between">
                                      <span>Express Shipping (2-3 business days)</span>
                                      <span className="font-semibold">${shippingCosts.express.toFixed(2)}</span>
                                    </div>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-lg">
                                  <RadioGroupItem value="overnight" id="overnight" />
                                  <Label htmlFor="overnight" className="flex-1">
                                    <div className="flex justify-between">
                                      <span>Overnight Shipping (1 business day)</span>
                                      <span className="font-semibold">${shippingCosts.overnight.toFixed(2)}</span>
                                    </div>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="orderNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Order Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Special instructions for delivery or order"
                                className="resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-4 text-right">
                        <Button type="submit" size="lg">
                          Continue to Payment
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              )}
              
              {/* Payment Information - Placeholder for Stripe */}
              {currentStep === CheckoutStep.PAYMENT && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Payment Information</h2>
                  <div className="border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="text-center p-6">
                      <p className="mb-4 text-gray-600">
                        Payment processing with Stripe is currently in demonstration mode.
                      </p>
                      <p className="mb-4 text-gray-600">
                        In production, this would connect to Stripe's secure payment system. See README for setup instructions.
                      </p>
                      
                      <div className="mx-auto w-full max-w-sm mt-8">
                        <div className="border rounded-md p-4 bg-gray-50">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <div className="text-sm font-medium text-gray-700">Card Information</div>
                              <div className="text-sm text-gray-500">Demo Mode</div>
                            </div>
                            <div className="h-10 rounded-md border border-gray-300 px-3 py-2 bg-white">
                              <div className="flex items-center">
                                <span className="text-gray-500">•••• •••• •••• ••••</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <div className="h-10 rounded-md border border-gray-300 px-3 py-2 bg-white flex-1">
                                <span className="text-gray-500">MM/YY</span>
                              </div>
                              <div className="h-10 rounded-md border border-gray-300 px-3 py-2 bg-white flex-1">
                                <span className="text-gray-500">CVC</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={goBack}
                    >
                      Back to Shipping
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handlePayment}
                    >
                      Process Payment & Review
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Order Review */}
              {currentStep === CheckoutStep.REVIEW && orderData && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Review Your Order</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p>{orderData.firstName} {orderData.lastName}</p>
                        <p>{orderData.address}</p>
                        <p>{orderData.city}, {orderData.state} {orderData.zipCode}</p>
                        <p>{orderData.country}</p>
                        <p>{orderData.phone}</p>
                        <p>{orderData.email}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Shipping Method</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p>
                          {orderData.shippingMethod === 'standard' && 'Standard Shipping (3-5 business days)'}
                          {orderData.shippingMethod === 'express' && 'Express Shipping (2-3 business days)'}
                          {orderData.shippingMethod === 'overnight' && 'Overnight Shipping (1 business day)'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Order Summary</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ul className="divide-y">
                          {cart.map((item) => (
                            <li key={item.product.id} className="py-2 flex justify-between">
                              <div>
                                <span className="font-medium">{item.product.name}</span> &times; {item.quantity}
                              </div>
                              <span>
                                ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="border-t mt-4 pt-4">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span>Shipping</span>
                            <span>${shippingCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between mt-2 font-bold">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {orderData.orderNotes && (
                      <div>
                        <h3 className="font-medium mb-2">Order Notes</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p>{orderData.orderNotes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between pt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={goBack}
                    >
                      Back to Payment
                    </Button>
                    <Button 
                      type="button" 
                      onClick={confirmOrder}
                    >
                      Place Order
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Order Confirmation */}
              {currentStep === CheckoutStep.CONFIRMATION && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Thank You for Your Order!</h2>
                  <p className="text-gray-600 mb-6">
                    Your order has been placed successfully. A confirmation email has been sent to your email address.
                  </p>
                  <div className="max-w-md mx-auto mb-8 p-4 border border-gray-200 rounded-lg">
                    <p className="font-medium">Order Number: <span className="text-primary">ORD-{Math.floor(100000 + Math.random() * 900000)}</span></p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                      <Button variant="outline" size="lg">
                        Continue Shopping
                      </Button>
                    </Link>
                    <Link href="/account/orders">
                      <Button size="lg">
                        View Your Orders
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Order Summary Sidebar */}
          {currentStep !== CheckoutStep.CONFIRMATION && (
            <div className="md:col-span-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                {cart.length === 0 ? (
                  <p className="text-gray-500">Your cart is empty</p>
                ) : (
                  <>
                    <ul className="divide-y mb-4">
                      {cart.map((item) => (
                        <li key={item.product.id} className="py-3 flex">
                          <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4 flex-shrink-0">
                            <img 
                              src={item.product.imageUrl || '/images/products/default.svg'} 
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm line-clamp-1">{item.product.name}</h3>
                            <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                            <p className="font-medium">
                              ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>${shippingCost.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;