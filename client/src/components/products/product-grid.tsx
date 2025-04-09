import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './product-card';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  rating: number;
  isNew?: boolean;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const ProductGrid: React.FC<ProductGridProps> = ({ products, title }) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {title && (
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
            <div className="flex items-center gap-4">
              <select 
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                defaultValue="featured"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              
              <div className="hidden md:flex items-center gap-2">
                <button 
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
                  aria-label="Grid view"
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button 
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
                  aria-label="List view"
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              imageUrl={product.imageUrl || `https://source.unsplash.com/800x800/?garden,${product.name.toLowerCase()}`}
              rating={product.rating}
              isNew={product.isNew}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <i className="fas fa-leaf text-4xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}

        {/* Load More Button */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Load More Products
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;