import React from 'react';
import { useRoute } from 'wouter';
import GuideGrid from '../components/guides/guide-grid';

// Sample guides data organized by category
const guidesByCategory: Record<string, any[]> = {
  'soil-composting': [
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
    }
  ],
  'pest-control': [
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
    }
  ],
  'watering': [
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
  ]
};

// Category metadata for header information
const categoryMetadata: Record<string, { title: string; description: string; icon: string }> = {
  'soil-composting': {
    title: "Soil & Composting Guides",
    description: "Learn everything about soil health and composting techniques to create the perfect growing environment for your plants.",
    icon: "fas fa-seedling"
  },
  'pest-control': {
    title: "Pest Control Guides",
    description: "Discover natural and effective ways to protect your garden from common pests and diseases.",
    icon: "fas fa-bug"
  },
  'watering': {
    title: "Watering Guides",
    description: "Master the art of proper watering techniques to keep your plants healthy and thriving.",
    icon: "fas fa-tint"
  }
};

const GuideCategoryPage: React.FC = () => {
  const [, params] = useRoute('/guides/category/:slug');
  const categorySlug = params?.slug || '';
  
  const categoryData = categoryMetadata[categorySlug];
  const guides = guidesByCategory[categorySlug] || [];

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <section className="bg-gradient-to-b from-green-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <i className={`${categoryData.icon} text-4xl text-primary mb-6`}></i>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {categoryData.title}
            </h1>
            <p className="text-lg text-gray-600">
              {categoryData.description}
            </p>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <GuideGrid
        guides={guides}
        title={`All ${categoryData.title}`}
        showFilters={true}
      />
    </main>
  );
};

export default GuideCategoryPage;