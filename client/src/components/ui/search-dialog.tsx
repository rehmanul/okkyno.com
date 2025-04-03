import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Input } from "./input";
import { Button } from "./button";
import { useQuery } from "@tanstack/react-query";

// Type definitions
interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  publishedAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SearchResult {
  products: Product[];
  articles: Article[];
  categories: Category[];
}

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDialog = ({ isOpen, onClose }: SearchDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [, navigate] = useLocation();
  
  // Reset search term when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  const { data, isLoading } = useQuery<SearchResult>({
    queryKey: ['/api/search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return { products: [], articles: [], categories: [] };
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    enabled: searchTerm.length >= 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Search Epic Gardening</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="mt-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for products, plants, guides..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <Button type="submit">Search</Button>
          </div>
        </form>

        {searchTerm.length >= 2 && (
          <div className="mt-6">
            {isLoading ? (
              <div className="text-center py-10">Searching...</div>
            ) : (
              <div className="grid gap-8">
                {data?.products && data.products.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Products</h3>
                    <div className="grid gap-2">
                      {data.products.map(product => (
                        <div 
                          key={product.id} 
                          className="p-3 hover:bg-gray-100 rounded-md cursor-pointer"
                          onClick={() => {
                            navigate(`/product/${product.slug}`);
                            onClose();
                          }}
                        >
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">${product.price.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data?.articles && data.articles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Articles</h3>
                    <div className="grid gap-2">
                      {data.articles.map(article => (
                        <div 
                          key={article.id} 
                          className="p-3 hover:bg-gray-100 rounded-md cursor-pointer"
                          onClick={() => {
                            navigate(`/article/${article.slug}`);
                            onClose();
                          }}
                        >
                          <div className="font-medium">{article.title}</div>
                          <div className="text-sm text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data?.categories && data.categories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Categories</h3>
                    <div className="grid gap-2">
                      {data.categories.map(category => (
                        <div 
                          key={category.id} 
                          className="p-3 hover:bg-gray-100 rounded-md cursor-pointer"
                          onClick={() => {
                            navigate(`/category/${category.slug}`);
                            onClose();
                          }}
                        >
                          <div className="font-medium">{category.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!data?.products?.length && !data?.articles?.length && !data?.categories?.length) && (
                  <div className="text-center py-6">
                    <p>No results found for "{searchTerm}"</p>
                    <p className="text-sm text-gray-500 mt-2">Try different keywords or browse our categories.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;