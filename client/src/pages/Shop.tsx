import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Product, Category } from '@shared/schema';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from '@/contexts/CartContext';
import { toast } from "@/hooks/use-toast";

// Type for sorting options
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

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
    <div className="group bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/product/${product.slug}`}>
        <a className="block">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <img 
              src={product.imageUrl || '/images/products/default.svg'} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {product.isOnSale && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                SALE
              </div>
            )}
          </div>
        </a>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <a className="block">
            <h3 className="font-medium mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </a>
        </Link>
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold">
            {product.salePrice ? (
              <div className="flex items-center gap-2">
                <span>${product.salePrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span>${product.price.toFixed(2)}</span>
            )}
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="hover:bg-primary hover:text-white transition-colors rounded-full aspect-square p-0 w-8 h-8"
            onClick={handleAddToCart}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton for products grid
const ProductSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
        <Skeleton className="aspect-square w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Main Shop component
const Shop = () => {
  useEffect(() => {
    document.title = "Shop - Okkyno";
  }, []);

  // State for filters and sorting
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Apply filters and sorting to products
  const filteredAndSortedProducts = products
    ? products
        // Apply category filter
        .filter(product => 
          selectedCategory === null || product.categoryId === selectedCategory
        )
        // Apply price range filter
        .filter(product => {
          const price = product.salePrice || product.price;
          return price >= priceRange[0] && price <= priceRange[1];
        })
        // Apply search filter
        .filter(product => 
          searchTerm === '' || 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        // Apply sorting
        .sort((a, b) => {
          const aPrice = a.salePrice !== undefined ? a.salePrice : a.price;
          const bPrice = b.salePrice !== undefined ? b.salePrice : b.price;
          
          switch (sortBy) {
            case 'price-asc':
              return aPrice - bPrice;
            case 'price-desc':
              return bPrice - aPrice;
            case 'name-asc':
              return a.name.localeCompare(b.name);
            case 'name-desc':
              return b.name.localeCompare(a.name);
            default:
              return 0; // No specific sorting
          }
        })
    : [];

  // Get price range from products for the slider
  const minMaxPrice = products
    ? products.reduce(
        (acc, product) => {
          const price = product.salePrice !== undefined ? product.salePrice : product.price;
          return {
            min: Math.min(acc.min, price),
            max: Math.max(acc.max, price),
          };
        },
        { min: Number.MAX_SAFE_INTEGER, max: 0 }
      )
    : { min: 0, max: 200 };

  // Handler for price range slider
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

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
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              
              {categoriesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                        selectedCategory === null
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      <span>All Categories</span>
                      <span className="text-sm text-gray-500">{products?.length || 0}</span>
                    </button>
                  </li>
                  {categories?.map((category) => (
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
                        <span className="text-sm text-gray-500">
                          {products?.filter(p => p.categoryId === category.id).length || 0}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <hr className="my-6" />

              <h3 className="font-semibold text-lg mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>${priceRange[0].toFixed(2)}</span>
                  <span>${priceRange[1].toFixed(2)}</span>
                </div>
                
                <Slider
                  min={minMaxPrice.min}
                  max={minMaxPrice.max}
                  step={1}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={handlePriceRangeChange}
                  className="my-6"
                />
                
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    className="w-24"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    min={minMaxPrice.min}
                    max={priceRange[1]}
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    className="w-24"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    min={priceRange[0]}
                    max={minMaxPrice.max}
                  />
                </div>
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
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Mobile Filters Panel */}
            {showFilters && (
              <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Categories</h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-lg ${
                          selectedCategory === null ? 'bg-primary/10 text-primary' : ''
                        }`}
                        onClick={() => setSelectedCategory(null)}
                      >
                        All Categories
                      </button>
                    </li>
                    {categories?.map((category) => (
                      <li key={category.id}>
                        <button
                          className={`w-full text-left px-3 py-2 rounded-lg ${
                            selectedCategory === category.id ? 'bg-primary/10 text-primary' : ''
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          {category.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>${priceRange[0].toFixed(2)}</span>
                      <span>${priceRange[1].toFixed(2)}</span>
                    </div>
                    
                    <Slider
                      min={minMaxPrice.min}
                      max={minMaxPrice.max}
                      step={1}
                      value={[priceRange[0], priceRange[1]]}
                      onValueChange={handlePriceRangeChange}
                      className="my-6"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <div className="w-full md:w-48">
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortOption)}
                >
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

            {/* Products Grid */}
            {productsLoading ? (
              <ProductSkeleton />
            ) : filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-700 mb-4">No products found matching your criteria.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {selectedCategory !== null && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedCategory(null)}
                    >
                      Clear Category
                    </Button>
                  )}
                  {searchTerm !== '' && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchTerm('')}
                    >
                      Clear Search
                    </Button>
                  )}
                  {(priceRange[0] > minMaxPrice.min || priceRange[1] < minMaxPrice.max) && (
                    <Button 
                      variant="outline" 
                      onClick={() => setPriceRange([minMaxPrice.min, minMaxPrice.max])}
                    >
                      Reset Price
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;