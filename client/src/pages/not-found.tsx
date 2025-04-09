import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "Product Not Found - Epic Gardening";
  }, []);

  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="text-primary mb-6">
        <AlertCircle className="h-16 w-16 mx-auto" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">Product Not Found</h1>
      
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        The product you're looking for doesn't exist or may have been removed.
      </p>
      
      <Link href="/shop">
        <button className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition duration-300">
          Back to Shop
        </button>
      </Link>
    </div>
  );
}
