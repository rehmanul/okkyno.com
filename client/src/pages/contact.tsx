import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const Contact = () => {
  useEffect(() => {
    document.title = "Contact Us - Epic Gardening";
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    toast({
      title: "Message sent!",
      description: "We've received your message and will get back to you soon.",
    });
    form.reset();
  };

  return (
    <>
      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-center">Contact Us</h1>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/2">
                <h2 className="font-montserrat font-bold text-2xl mb-6">Get In Touch</h2>
                <p className="text-gray-700 mb-8">
                  Have questions about gardening, our products, or need assistance? We're here to help!
                  Fill out the form and our team will get back to you as soon as possible.
                </p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-montserrat">Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
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
                          <FormLabel className="font-montserrat">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-montserrat">Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="How to grow tomatoes" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-montserrat">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us how we can help..." 
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6"
                    >
                      Send Message
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="md:w-1/2">
                <h2 className="font-montserrat font-bold text-2xl mb-6">Contact Information</h2>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex items-start mb-6">
                    <div className="text-primary text-xl mt-1 mr-4">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg mb-1">Our Location</h3>
                      <p className="text-gray-700">
                        1234 Garden Way<br />
                        San Diego, CA 92101
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-6">
                    <div className="text-primary text-xl mt-1 mr-4">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg mb-1">Email Us</h3>
                      <p className="text-gray-700">
                        <a href="mailto:info@epicgardening.com" className="hover:text-primary">info@epicgardening.com</a><br />
                        <a href="mailto:support@epicgardening.com" className="hover:text-primary">support@epicgardening.com</a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-6">
                    <div className="text-primary text-xl mt-1 mr-4">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg mb-1">Call Us</h3>
                      <p className="text-gray-700">
                        <a href="tel:+18001234567" className="hover:text-primary">(800) 123-4567</a><br />
                        Monday - Friday, 9am - 5pm PST
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-primary text-xl mt-1 mr-4">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg mb-1">Business Hours</h3>
                      <p className="text-gray-700">
                        Monday - Friday: 9am - 5pm<br />
                        Saturday: 10am - 3pm<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-montserrat font-semibold text-lg mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-primary hover:bg-primary/90 text-white h-10 w-10 rounded-full flex items-center justify-center transition duration-300">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="bg-primary hover:bg-primary/90 text-white h-10 w-10 rounded-full flex items-center justify-center transition duration-300">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="bg-primary hover:bg-primary/90 text-white h-10 w-10 rounded-full flex items-center justify-center transition duration-300">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a href="#" className="bg-primary hover:bg-primary/90 text-white h-10 w-10 rounded-full flex items-center justify-center transition duration-300">
                    <i className="fab fa-pinterest"></i>
                  </a>
                  <a href="#" className="bg-primary hover:bg-primary/90 text-white h-10 w-10 rounded-full flex items-center justify-center transition duration-300">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
