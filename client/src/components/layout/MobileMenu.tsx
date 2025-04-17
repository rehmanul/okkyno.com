import { useState } from "react";
import { Link } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [shopExpanded, setShopExpanded] = useState(false);
  const [learnExpanded, setLearnExpanded] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="flex justify-end p-4">
        <button className="text-xl text-dark" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="px-4 py-2">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full py-2 px-4 rounded-full border border-gray-200"
        />
      </div>
      <nav className="px-4 py-4">
        <ul className="space-y-4">
          <li className="py-2 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <Link href="/shop" className="text-lg font-semibold" onClick={onClose}>
                Shop
              </Link>
              <button
                className="text-gray-500"
                onClick={() => setShopExpanded(!shopExpanded)}
              >
                <i className={`fas fa-chevron-${shopExpanded ? 'up' : 'down'}`}></i>
              </button>
            </div>
            {shopExpanded && (
              <div className="mt-2 ml-4 space-y-2">
                <Link
                  href="/shop/garden-tools"
                  className="block py-1 text-gray-600"
                  onClick={onClose}
                >
                  Garden Tools
                </Link>
                <Link
                  href="/shop/indoor-plants"
                  className="block py-1 text-gray-600"
                  onClick={onClose}
                >
                  Plants & Seeds
                </Link>
                <Link
                  href="/shop/planters-pots"
                  className="block py-1 text-gray-600"
                  onClick={onClose}
                >
                  Planters & Pots
                </Link>
                <Link
                  href="/shop/soil-fertilizers"
                  className="block py-1 text-gray-600"
                  onClick={onClose}
                >
                  Soil & Fertilizers
                </Link>
                <Link
                  href="/shop"
                  className="block py-1 text-gray-600"
                  onClick={onClose}
                >
                  Pest Control
                </Link>
                <Link
                  href="/shop"
                  className="block py-1 text-gray-600"
                  onClick={onClose}
                >
                  Garden Decor
                </Link>
              </div>
            )}
          </li>
          <li className="py-2 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <a href="#" className="text-lg font-semibold">
                Learn
              </a>
              <button
                className="text-gray-500"
                onClick={() => setLearnExpanded(!learnExpanded)}
              >
                <i className={`fas fa-chevron-${learnExpanded ? 'up' : 'down'}`}></i>
              </button>
            </div>
            {learnExpanded && (
              <div className="mt-2 ml-4 space-y-2">
                <a href="#" className="block py-1 text-gray-600">
                  Gardening Guides
                </a>
                <a href="#" className="block py-1 text-gray-600">
                  Plant Care Library
                </a>
                <a href="#" className="block py-1 text-gray-600">
                  Video Tutorials
                </a>
                <a href="#" className="block py-1 text-gray-600">
                  Seasonal Tips
                </a>
              </div>
            )}
          </li>
          <li className="py-2 border-b border-gray-100">
            <Link href="/blog" className="text-lg font-semibold" onClick={onClose}>
              Blog
            </Link>
          </li>
          <li className="py-2 border-b border-gray-100">
            <a href="#" className="text-lg font-semibold">
              About
            </a>
          </li>
          <li className="py-2 border-b border-gray-100">
            <a href="#" className="text-lg font-semibold">
              Contact
            </a>
          </li>
        </ul>
      </nav>
      <div className="px-4 py-4 border-t border-gray-100">
        <a href="#" className="block py-2 text-primary font-semibold">
          <i className="far fa-user mr-2"></i> My Account
        </a>
        <Link href="/cart" className="block py-2 text-primary font-semibold" onClick={onClose}>
          <i className="fas fa-shopping-cart mr-2"></i> Cart
        </Link>
        <a href="#" className="block py-2 text-primary font-semibold">
          <i className="far fa-heart mr-2"></i> Wishlist
        </a>
      </div>
    </div>
  );
}
