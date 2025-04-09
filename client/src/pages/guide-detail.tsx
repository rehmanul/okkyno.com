import React from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';

// Sample guide data - in production, this would come from an API
const guideData = {
  'complete-guide-to-composting': {
    title: "Complete Guide to Composting",
    description: "Master the art of composting with our comprehensive guide. Learn how to turn kitchen waste into nutrient-rich soil for your garden.",
    imageUrl: "/images/guides/composting_guide.svg",
    category: "Soil & Composting",
    difficulty: "beginner" as const,
    duration: "20 min",
    steps: [
      {
        title: "Choose Your Composting Method",
        content: "Decide between a traditional compost pile, tumbler, or worm composting based on your space and needs."
      },
      {
        title: "Gather Materials",
        content: "Collect both 'green' materials (kitchen scraps, grass clippings) and 'brown' materials (dry leaves, paper)."
      },
      {
        title: "Layer Your Materials",
        content: "Create alternating layers of green and brown materials to achieve the right balance of nitrogen and carbon."
      }
    ],
    tips: [
      "Keep your compost pile moist but not wet",
      "Turn the pile regularly for faster decomposition",
      "Maintain a good balance of green and brown materials"
    ],
    relatedGuides: [
      {
        title: "Soil Improvement Techniques",
        slug: "soil-improvement-techniques"
      },
      {
        title: "Garden Waste Management",
        slug: "garden-waste-management"
      }
    ]
  }
};

const GuideDetailPage: React.FC = () => {
  const [, params] = useRoute('/guides/:slug');
  const slug = params?.slug || '';
  const guide = guideData[slug as keyof typeof guideData];

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Guide Not Found</h1>
          <p className="text-gray-600 mb-6">The guide you're looking for doesn't exist.</p>
          <Link href="/guides">
            <a className="text-primary hover:underline">Browse All Guides</a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Guide Header */}
      <section className="bg-gradient-to-b from-green-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Link href="/guides">
                <a className="hover:text-primary">Guides</a>
              </Link>
              <i className="fas fa-chevron-right text-xs"></i>
              <Link href={`/guides/category/${guide.category.toLowerCase().replace(' & ', '-')}`}>
                <a className="hover:text-primary">{guide.category}</a>
              </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {guide.title}
                </motion.h1>
                <p className="text-lg text-gray-600 mb-6">
                  {guide.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <i className="fas fa-clock text-primary"></i>
                    {guide.duration}
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="fas fa-signal text-primary"></i>
                    {guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1)}
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="fas fa-list-ol text-primary"></i>
                    {guide.steps.length} Steps
                  </span>
                </div>
              </div>
              <div className="w-full md:w-1/3">
                <img 
                  src={guide.imageUrl} 
                  alt={guide.title}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Steps */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Guide</h2>
              <div className="space-y-6">
                {guide.steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white rounded-lg p-6 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="font-bold text-gray-900 mb-2">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-gray-600">{step.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pro Tips</h2>
              <div className="bg-primary/5 rounded-lg p-6">
                <ul className="space-y-4">
                  {guide.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <i className="fas fa-check-circle text-primary mt-1"></i>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Related Guides */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guide.relatedGuides.map((related, index) => (
                  <Link key={index} href={`/guides/${related.slug}`}>
                    <a className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-gray-900 mb-2">{related.title}</h3>
                      <span className="text-primary flex items-center gap-2">
                        Read Guide
                        <i className="fas fa-arrow-right text-sm"></i>
                      </span>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default GuideDetailPage;