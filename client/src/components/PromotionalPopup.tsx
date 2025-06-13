import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromotionalPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds if not shown before
    const hasSeenPopup = localStorage.getItem("garden-transformation-popup");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("garden-transformation-popup", "true");
  };

  const handleShopNow = (category: string) => {
    handleClose();
    window.location.href = `/products?category=${category}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className="relative bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-2xl max-w-2xl w-full"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&auto=format&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-green-800 bg-opacity-75 rounded-lg"></div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 z-10"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="relative z-10 p-8 text-center text-white">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Garden Transformation Sale
          </h1>
          <p className="text-xl mb-8 text-white">
            Take 20% off all plants and planters. Use code <span className="font-bold bg-white text-green-800 px-2 py-1 rounded">GARDEN20</span> at checkout.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleShopNow("indoor-plants")}
              className="bg-white text-green-800 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg text-lg"
            >
              Shop Plants
            </Button>
            <Button
              onClick={() => handleShopNow("pots-planters")}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-800 font-semibold px-8 py-3 rounded-lg text-lg"
            >
              Shop Planters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}