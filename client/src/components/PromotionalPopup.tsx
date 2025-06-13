import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function PromotionalPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // Show popup after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-8 rounded-lg max-w-md w-full relative shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/20"
          aria-label="Close popup"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Garden Transformation Sale</h2>
          <p className="mb-6">
            Take 20% off all plants and planters. Use code{' '}
            <span className="bg-white text-green-800 px-2 py-1 rounded font-bold">
              GARDEN20
            </span>{' '}
            at checkout.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="bg-white text-green-800 hover:bg-gray-100 font-semibold border-0"
            >
              <Link href="/products" onClick={handleClose}>Shop Plants</Link>
            </Button>

            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-green-800 font-semibold bg-transparent"
              onClick={handleClose}
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}