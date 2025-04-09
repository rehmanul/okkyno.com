import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from '@/contexts/CartContext';
import { toast } from "@/hooks/use-toast";

// Type definitions
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
}

// Type for sorting options
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

// Product data
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
  },
  {
    id: '9',
    name: "Organic Vegetable Seeds Collection",
    description: "A complete collection of organic vegetable seeds for your garden",
    price: 24.99,
    image: "/images/products/organic-seeds.jpg",
    category: "seeds",
    stock: 30,
    featured: true
  },
  {
    id: '10',
    name: "Premium Garden Tool Set",
    description: "High-quality garden tools for all your gardening needs",
    price: 89.99,
    image: "/images/products/garden-tools.jpg",
    category: "tools",
    stock: 15,
    featured: true
  },
  {
    id: '11',
    name: "Self-Watering Plant Pot",
    description: "Innovative self-watering pot for hassle-free plant care",
    price: 34.99,
    image: "/images/products/self-watering-pot.jpg",
    category: "plants",
    stock: 20,
    featured: true
  },
  {
    id: '12',
    name: "Raised Garden Bed Kit",
    description: "Easy to assemble raised garden bed for optimal growing conditions",
    price: 149.99,
    image: "/images/products/garden-bed-kit.jpg",
    category: "garden-beds",
    stock: 10,
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
