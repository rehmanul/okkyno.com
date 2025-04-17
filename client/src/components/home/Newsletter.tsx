import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thank you for subscribing!",
        description: "You'll now receive our gardening tips and exclusive offers.",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-3">Get Gardening Tips & Exclusive Offers</h2>
          <p className="text-white/90 mb-6">
            Join our community and receive seasonal gardening advice, special offers, and early access to new products.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow py-3 px-4 rounded-l-lg rounded-r-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-secondary"
              disabled={isSubmitting}
            />
            <Button 
              type="submit"
              className="bg-secondary hover:bg-secondary/90 text-white font-bold rounded-l-lg rounded-r-lg sm:rounded-l-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          <p className="text-white/80 text-sm mt-3">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  );
}
