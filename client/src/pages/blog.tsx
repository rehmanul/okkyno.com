import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ArticleGrid from '../components/blog/article-grid';

// Mock data - replace with actual API call
const mockArticles = [
  {
    id: 1,
    title: "Essential Tips for Starting Your First Vegetable Garden",
    slug: "starting-vegetable-garden-tips",
    excerpt: "Learn the fundamental steps to create a thriving vegetable garden, from soil preparation to plant selection.",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&fit=crop",
    category: "Beginner's Guide",
    author: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    publishedAt: "2024-04-01T08:00:00Z",
    readTime: 8
  },
  {
    id: 2,
    title: "Sustainable Gardening Practices for a Greener Future",
    slug: "sustainable-gardening-practices",
    excerpt: "Discover eco-friendly gardening methods that help protect the environment while growing healthy plants.",
    imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&fit=crop",
    category: "Sustainability",
    author: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    publishedAt: "2024-03-28T10:30:00Z",
    readTime: 6
  },
  {
    id: 3,
    title: "Urban Gardening: Making the Most of Small Spaces",
    slug: "urban-gardening-small-spaces",
    excerpt: "Transform your balcony or patio into a productive garden with these space-saving techniques.",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&fit=crop",
    category: "Urban Gardening",
    author: {
      name: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    },
    publishedAt: "2024-03-25T09:15:00Z",
    readTime: 7
  }
];

const categories = [
  { id: 1, name: "Beginner's Guide", count: 28 },
  { id: 2, name: "Sustainability", count: 22 },
  { id: 3, name: "Urban Gardening", count: 19 },
  { id: 4, name: "Plant Care", count: 34 },
  { id: 5, name: "Seasonal Tips", count: 25 }
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gardening Blog & Resources
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Expert tips, in-depth guides, and inspiring stories to help you create and maintain 
            your perfect garden.
          </p>
        </div>
      </div>

      {/* Featured Article */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative aspect-video md:aspect-auto">
              <img
                src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&fit=crop"
                alt="Featured article"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="text-primary font-semibold mb-4">Featured Article</span>
              <h2 className="text-3xl font-bold mb-4">
                The Complete Guide to Raised Bed Gardening
              </h2>
              <p className="text-gray-600 mb-6">
                Everything you need to know about building, maintaining, and maximizing your 
                raised bed garden for optimal yields and easy maintenance.
              </p>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                  alt="Author"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">April 1, 2024 · 12 min read</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors self-start"
              >
                Read Article
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
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

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Vegetables', 'Herbs', 'Indoor Plants', 'Composting', 'Seeds'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Categories Button */}
          <div className="lg:hidden">
            <button
              className="w-full bg-white shadow rounded-lg px-4 py-3 flex items-center justify-between"
              onClick={() => setShowCategories(!showCategories)}
            >
              <span className="font-medium">Categories</span>
              <i className={`fas fa-chevron-${showCategories ? 'up' : 'down'}`}></i>
            </button>
            
            {/* Mobile Categories Panel */}
            {showCategories && (
              <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
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
              </div>
            )}
          </div>

          {/* Article Grid */}
          <div className="flex-1">
            <ArticleGrid articles={mockArticles} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
