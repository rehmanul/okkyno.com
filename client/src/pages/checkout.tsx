import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, ArrowLeft, CreditCard, Truck, Check } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  state: z.string().min(2, { message: "State must be at least 2 characters." }),
  zipCode: z.string().min(5, { message: "Zip code must be at least 5 characters." }),
  country: z.string().min(2, { message: "Country must be at least 2 characters." }),
  paymentMethod: z.enum(["credit", "paypal"], {
    required_error: "Please select a payment method.",
  }),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  shippingNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

enum CheckoutStep {
  SHIPPING = 0,
  PAYMENT = 1,
  REVIEW = 2,
  CONFIRMATION = 3,
}

const CheckoutPage = () => {
  const [, navigate] = useLocation();
  const { cart, cartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.SHIPPING);

  useEffect(() => {
    document.title = "Checkout - Epic Gardening";
  }, []);

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (cart.length === 0 && currentStep !== CheckoutStep.CONFIRMATION) {
      navigate("/cart");
    }
  }, [cart, navigate, currentStep]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      paymentMethod: "credit",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
      shippingNotes: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    if (currentStep === CheckoutStep.SHIPPING) {
      setCurrentStep(CheckoutStep.PAYMENT);
    } else if (currentStep === CheckoutStep.PAYMENT) {
      setCurrentStep(CheckoutStep.REVIEW);
    } else if (currentStep === CheckoutStep.REVIEW) {
      // Process payment and order here
      console.log("Order submitted:", data);
      
      // Simulate order processing
      setTimeout(() => {
        clearCart();
        setCurrentStep(CheckoutStep.CONFIRMATION);
        toast({
          title: "Order Placed Successfully",
          description: "Thank you for your purchase!",
        });
      }, 1000);
    }
  };

  const goBack = () => {
    if (currentStep === CheckoutStep.PAYMENT) {
      setCurrentStep(CheckoutStep.SHIPPING);
    } else if (currentStep === CheckoutStep.REVIEW) {
      setCurrentStep(CheckoutStep.PAYMENT);
    }
  };

  if (currentStep === CheckoutStep.CONFIRMATION) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-6">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="font-montserrat font-bold text-3xl mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>
          <p className="text-gray-600 mb-8">
            We've sent a confirmation email to {form.getValues().email} with your order details.
          </p>
          <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary/90 text-white">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-montserrat font-bold text-3xl mb-8 text-center md:text-left">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Steps Header */}
            <div className="flex border-b">
              <div
                className={`flex-1 text-center py-4 ${
                  currentStep === CheckoutStep.SHIPPING
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                1. Shipping
              </div>
              <div
                className={`flex-1 text-center py-4 ${
                  currentStep === CheckoutStep.PAYMENT
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                2. Payment
              </div>
              <div
                className={`flex-1 text-center py-4 ${
                  currentStep === CheckoutStep.REVIEW
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                3. Review
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {/* Shipping Information */}
                  {currentStep === CheckoutStep.SHIPPING && (
                    <div>
                      <h2 className="font-montserrat font-bold text-xl mb-6">Shipping Information</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="First name" {...field} />
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
                                <Input placeholder="Last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Email address" {...field} />
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
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="Phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator className="my-6" />

                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Street address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="City" {...field} />
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
                                  <Input placeholder="State or province" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP/Postal Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="ZIP code" {...field} />
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
                                  <Input placeholder="Country" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="shippingNotes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Instructions (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Add any special instructions for delivery"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Payment Information */}
                  {currentStep === CheckoutStep.PAYMENT && (
                    <div>
                      <h2 className="font-montserrat font-bold text-xl mb-6">Payment Method</h2>

                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                className="flex flex-col space-y-4"
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <div className="flex items-center space-x-2 border rounded-md p-4">
                                  <RadioGroupItem value="credit" id="credit" />
                                  <Label htmlFor="credit" className="flex-1 cursor-pointer">
                                    <div className="flex items-center">
                                      <CreditCard className="mr-2 h-5 w-5" />
                                      Credit/Debit Card
                                    </div>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-md p-4">
                                  <RadioGroupItem value="paypal" id="paypal" />
                                  <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                                    <div className="flex items-center">
                                      <span className="mr-2 text-blue-600 font-bold">PayPal</span>
                                      Pay with PayPal
                                    </div>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("paymentMethod") === "credit" && (
                        <div className="mt-6 space-y-6">
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="1234 5678 9012 3456" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name on Card</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="expiryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expiry Date</FormLabel>
                                  <FormControl>
                                    <Input placeholder="MM/YY" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="cvv"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CVV</FormLabel>
                                  <FormControl>
                                    <Input placeholder="123" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Order Review */}
                  {currentStep === CheckoutStep.REVIEW && (
                    <div>
                      <h2 className="font-montserrat font-bold text-xl mb-6">Review Your Order</h2>

                      <div className="space-y-8">
                        <div>
                          <h3 className="font-semibold text-lg mb-3">Shipping Address</h3>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p>
                              {form.getValues().firstName} {form.getValues().lastName}
                            </p>
                            <p>{form.getValues().address}</p>
                            <p>
                              {form.getValues().city}, {form.getValues().state} {form.getValues().zipCode}
                            </p>
                            <p>{form.getValues().country}</p>
                            <p>{form.getValues().phone}</p>
                            <p>{form.getValues().email}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg mb-3">Payment Method</h3>
                          <div className="bg-gray-50 p-4 rounded-md">
                            {form.getValues().paymentMethod === "credit" ? (
                              <div className="flex items-center">
                                <CreditCard className="mr-2 h-5 w-5" />
                                <span>
                                  Credit Card ending in {form.getValues().cardNumber?.slice(-4) || "****"}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <span className="mr-2 text-blue-600 font-bold">PayPal</span>
                                <span>Payment will be completed with PayPal</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg mb-3">Order Items</h3>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <div className="divide-y">
                              {cart.map((item) => (
                                <div key={item.product.id} className="py-3 flex justify-between">
                                  <div className="flex items-center">
                                    <div className="w-16 h-16 flex-shrink-0 mr-4">
                                      <img
                                        src={item.product.imageUrl || ''}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover rounded"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium">{item.product.name}</p>
                                      <p className="text-sm text-gray-600">
                                        ${item.product.price.toFixed(2)} x {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="font-medium">
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="mt-8 flex justify-between">
                    {currentStep > CheckoutStep.SHIPPING ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={goBack}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/cart")}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Back to Cart
                      </Button>
                    )}

                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      {currentStep === CheckoutStep.REVIEW ? "Place Order" : "Continue"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="font-montserrat font-bold text-xl mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 divide-y">
              {cart.map((item) => (
                <div key={item.product.id} className="py-3 flex justify-between">
                  <div className="flex items-center">
                    <p className="text-gray-800">
                      {item.quantity} x {item.product.name}
                    </p>
                  </div>
                  <div className="font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <div className="pt-4">
                <div className="flex justify-between pb-4">
                  <span>Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-4">
                  <span>Shipping</span>
                  <span>{cartTotal > 50 ? "Free" : "$5.99"}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4">
                  <span>Total</span>
                  <span>${(cartTotal > 50 ? cartTotal : cartTotal + 5.99).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-600">
              <div className="flex items-center mb-2">
                <Truck className="h-4 w-4 text-primary mr-2" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center mb-2">
                <Check className="h-4 w-4 text-primary mr-2" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 text-primary mr-2" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;