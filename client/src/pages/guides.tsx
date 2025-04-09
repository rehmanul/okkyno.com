import React from 'react';
import { Link } from 'wouter';
import GuideGrid from '../components/guides/guide-grid';

// Sample guide data with proper images and categories
const sampleGuides = [
  {
    id: 1,
    title: "Complete Guide to Composting",
    slug: "complete-guide-to-composting",
    description: "Master the art of composting with our comprehensive guide. Learn how to turn kitchen waste into nutrient-rich soil for your garden.",
    imageUrl: "/images/guides/composting_guide.svg",
    category: "Soil & Composting",
    difficulty: "beginner" as const,
    duration: "20 min",
    steps: 10
  },
  {
    id: 2,
    title: "Natural Pest Control Methods",
    slug: "natural-pest-control-methods",
    description: "Discover eco-friendly ways to protect your garden from common pests. Learn organic solutions that work with nature.",
    imageUrl: "/images/guides/pest_control.svg",
    category: "Plant Care",
    difficulty: "intermediate" as const,
    duration: "25 min",
    steps: 12
  },
  {
    id: 3,
    title: "Smart Watering Techniques",
    slug: "smart-watering-techniques",
    description: "Learn efficient watering methods to keep your plants healthy while conserving water. Perfect for both beginners and experienced gardeners.",
    imageUrl: "/images/guides/watering_basics.svg",
    category: "Watering",
    difficulty: "beginner" as const,
    duration: "15 min",
    steps: 8
  }
];

// Popular categories with icons
const popularCategories = [
  { name: "Soil & Composting", icon: "fas fa-seedling", href: "/guides/category/soil-composting" },
  { name: "Plant Care", icon: "fas fa-leaf", href: "/guides/category/plant-care" },
  { name: "Watering", icon: "fas fa-tint", href: "/guides/category/watering" },
  { name: "Pest Control", icon: "fas fa-bug", href: "/guides/category/pest-control" },
  { name: "Seasonal Tips", icon: "fas fa-sun", href: "/guides/category/seasonal-tips" },
  { name: "Tools & Equipment", icon: "fas fa-tools", href: "/guides/category/tools-equipment" }
];

const GuidesPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Expert Gardening Guides
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Step-by-step instructions and expert advice to help you grow your garden successfully, 
              whether you're a beginner or experienced gardener.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/guides/all">
                <a className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Browse All Guides
                </a>
              </Link>
              <Link href="/guides/beginner">
                <a className="bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                  Start Here
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((category) => (
              <Link key={category.name} href={category.href}>
                <a className="group p-6 rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200">
                  <div className="text-center">
                    <i className={`${category.icon} text-2xl text-primary mb-3 group-hover:scale-110 transition-transform`}></i>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {['Beginner Guides', 'Seasonal Tips', 'Advanced Techniques', 'Video Tutorials'].map((link) => (
              <Link key={link} href={`/guides/${link.toLowerCase().replace(' ', '-')}`}>
                <a className="text-gray-600 hover:text-primary transition-colors">
                  {link}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Guides Grid */}
      <GuideGrid
        guides={sampleGuides}
        title="Latest Guides"
        showFilters={true}
      />

      {/* Newsletter Section */}
      <section className="py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Get Weekly Gardening Tips
            </h2>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter and receive expert gardening advice directly in your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default GuidesPage;