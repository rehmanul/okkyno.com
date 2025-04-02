import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertSubscriberSchema } from "@shared/schema";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = insertSubscriberSchema.extend({
  email: z.string().email('Please enter a valid email address'),
});

const Newsletter = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return apiRequest('POST', '/api/subscribe', data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You have successfully subscribed to our newsletter.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };

  return (
    <section className="bg-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-4">Join Our Gardening Community</h2>
          <p className="text-lg mb-8">Subscribe to our newsletter and get gardening tips, seasonal guides, and exclusive offers delivered to your inbox.</p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row max-w-xl mx-auto gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        placeholder="Your email address"
                        className="py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-md"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </Form>
          
          <p className="text-sm text-gray-600 mt-4">By subscribing, you agree to our Privacy Policy and consent to receive updates from Epic Gardening.</p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
