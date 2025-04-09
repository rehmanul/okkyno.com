import React from 'react';
import { motion } from 'framer-motion';
import GuideCard from './guide-card';

interface Guide {
  id: number;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  steps: number;
}

interface GuideGridProps {
  guides: Guide[];
  title?: string;
  showFilters?: boolean;
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

const GuideGrid: React.FC<GuideGridProps> = ({ guides, title, showFilters = true }) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {(title || showFilters) && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
            )}
            
            {showFilters && (
              <div className="flex flex-wrap items-center gap-4">
                <select 
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="all"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                <select 
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="newest"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="duration-asc">Duration: Short to Long</option>
                  <option value="duration-desc">Duration: Long to Short</option>
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
            )}
          </div>
        )}

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {guides.map((guide) => (
            <GuideCard
              key={guide.id}
              {...guide}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {guides.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <i className="fas fa-book-reader text-4xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Guides Found</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later for new guides.</p>
          </div>
        )}

        {/* Load More Button */}
        {guides.length > 0 && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Load More Guides
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default GuideGrid;