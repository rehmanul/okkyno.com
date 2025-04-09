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
import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Product, Category } from '@shared/schema';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from '@/contexts/CartContext';
import { toast } from "@/hooks/use-toast";

// Type for sorting options
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

// Product data from epicgardening.com
const productData: Product[] = [
  {
    id: '1',
    name: '3-Minute Raised Bed',
    description: 'This raised garden bed assembles in minutes, tool free! Your fast track to a premium garden experience.',
    price: 199.99,
    image: '/images/products/raised-bed.jpg',
    category: 'garden-beds',
    stock: 15,
    featured: true
  },
  {
    id: '2',
    name: 'Premium Garden Bed Kit',
    description: 'Complete garden bed solution for serious gardeners.',
    price: 249.99,
    image: '/images/products/premium-bed.jpg',
    category: 'garden-beds',
    stock: 8,
    featured: true
  },
  {
    id: '3',
    name: '3-Minute Raised Bed Extension Kit Add-On',
    description: 'Extend your raised garden bed. Assembles in minutes with no tools required.',
    price: 129.99,
    image: '/images/products/extension-kit.jpg',
    category: 'garden-beds',
    stock: 12,
    featured: false
  },
  {
    id: '4',
    name: 'Supertunia Seeds',
    description: 'One of the easiest and most productive flowers to grow. Majestic blooms all season.',
    price: 3.49,
    image: '/images/products/supertunia-seeds.jpg',
    category: 'seeds',
    stock: 50,
    featured: false
  },
  {
    id: '5',
    name: 'Lettuce Variety Pack',
    description: 'Perfect for first-time gardeners. Quick to sprout and easy to cultivate.',
    price: 2.99,
    image: '/images/products/lettuce-seeds.jpg',
    category: 'seeds',
    stock: 35,
    featured: true
  },
  {
    id: '6',
    name: 'Premium Gardening Tool Set',
    description: 'Complete set of essential gardening tools for all your gardening needs.',
    price: 74.99,
    image: '/images/products/tool-set.jpg',
    category: 'tools',
    stock: 20,
    featured: true
  },
  {
    id: '7',
    name: 'Wave Petunia Seeds',
    description: 'The ultimate spreading flower for garden beds or containers. Transforms any garden with stunning blooms.',
    price: 2.69,
    image: '/images/products/wave-petunia.jpg',
    category: 'seeds',
    stock: 40,
    featured: false
  },
  {
    id: '8',
    name: 'Salvia Pink Profusion',
    description: 'Stunning blooms that reliably bring color to summer and fall landscapes. Perfect for attracting pollinators.',
    price: 4.99,
    image: '/images/products/salvia.jpg',
    category: 'plants',
    stock: 25,
    featured: false
  }
];

// Categories
const categories: Category[] = [
  { id: 'all', name: 'All Products' },
  { id: 'garden-beds', name: 'Garden Beds' },
  { id: 'seeds', name: 'Seeds' },
  { id: 'plants', name: 'Plants' },
  { id: 'tools', name: 'Tools & Accessories' }
];

// Product card component
const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart.`,
    });
  };
  
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <p className="font-medium">${product.price.toFixed(2)}</p>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            <Button onClick={handleAddToCart} disabled={product.stock === 0} size="sm">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shop main component
const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  
  // Mock the query for product data
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // In a real app, this would be an API call
      return Promise.resolve(productData);
    },
    initialData: productData,
  });
  
  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1] &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Garden Shop</h1>
      
      <div className="mb-8">
        <p className="text-lg mb-4">
          Find everything you need to create and maintain your perfect garden. From seeds to tools, we've got your gardening needs covered.
        </p>
      </div>
      
      {/* Filters section */}
      <div className="grid gap-6 mb-8 md:grid-cols-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Search</label>
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Price Range</label>
          <div className="pt-4 px-2">
            <Slider
              defaultValue={[0, 300]}
              min={0}
              max={300}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between mt-2 text-sm">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Sort By</label>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Products grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, index) => (
            <div key={index} className="rounded-lg border">
              <Skeleton className="h-[200px] w-full rounded-t-lg" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-8 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load products. Please try again later.</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Shop;
