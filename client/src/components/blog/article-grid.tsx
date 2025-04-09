import React from 'react';
import { motion } from 'framer-motion';
import ArticleCard from './article-card';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: number;
}

interface ArticleGridProps {
  articles: Article[];
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

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, title, showFilters = true }) => {
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
                  defaultValue="latest"
                >
                  <option value="latest">Latest Articles</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                </select>

                <div className="flex items-center gap-2">
                  <button 
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-filter mr-2"></i>
                    Filter
                  </button>
                  <button 
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-sort mr-2"></i>
                    Sort
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
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              {...article}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <i className="fas fa-newspaper text-4xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Articles Found</h3>
            <p className="text-gray-500">Check back later for new content or try a different filter.</p>
          </div>
        )}

        {/* Load More Button */}
        {articles.length > 0 && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Load More Articles
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArticleGrid;