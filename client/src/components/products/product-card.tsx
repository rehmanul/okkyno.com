import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  rating: number;
  isNew?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  slug,
  price,
  imageUrl,
  rating,
  isNew
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl"
    >
      <Link href={`/product/${slug}`}>
        <div className="cursor-pointer">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transform transition-transform hover:scale-110"
            />
            {isNew && (
              <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                New
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fas fa-star text-sm ${
                    i < rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                ></i>
              ))}
            </div>
            
            <h3 className="font-inter font-semibold text-gray-900 mb-2 line-clamp-2">
              {name}
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                ${price.toFixed(2)}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                Add to Cart
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;