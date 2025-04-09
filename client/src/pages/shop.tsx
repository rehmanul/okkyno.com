import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '../components/products/product-grid';

// Mock data - replace with actual API call
const mockProducts = [
  {
    id: 1,
    name: "Organic Vegetable Seeds Collection",
    slug: "organic-vegetable-seeds",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&h=800&fit=crop",
    rating: 4.5,
    isNew: true
  },
  {
    id: 2,
    name: "Premium Garden Tool Set",
    slug: "premium-garden-tool-set",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop",
    rating: 4.8
  },
  {
    id: 3,
    name: "Self-Watering Plant Pot",
    slug: "self-watering-pot",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=800&fit=crop",
    rating: 4.2,
    isNew: true
  },
  {
    id: 4,
    name: "Raised Garden Bed Kit",
    slug: "raised-garden-bed",
    price: 149.99,
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=800&fit=crop",
    rating: 4.7
  }
];

const categories = [
  { id: 1, name: "Seeds & Plants", count: 145 },
  { id: 2, name: "Tools & Equipment", count: 89 },
  { id: 3, name: "Pots & Planters", count: 67 },
  { id: 4, name: "Soil & Fertilizers", count: 43 },
  { id: 5, name: "Garden Decor", count: 32 }
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop Gardening Supplies
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Find everything you need to create and maintain your perfect garden. From seeds to tools, 
            we've got your gardening needs covered.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                        selectedCategory === category.id
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <hr className="my-6" />

              <h3 className="font-semibold text-lg mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    className="w-24 px-3 py-2 border rounded-lg"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    className="w-24 px-3 py-2 border rounded-lg"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  />
                </div>
                <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90">
                  Apply Filter
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters Button */}
          <div className="lg:hidden">
            <button
              className="w-full bg-white shadow rounded-lg px-4 py-3 flex items-center justify-between"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="font-medium">Filters</span>
              <i className={`fas fa-chevron-${showFilters ? 'up' : 'down'}`}></i>
            </button>
            
            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
                {/* Mobile filters content */}
              </div>
            )}
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid products={mockProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
