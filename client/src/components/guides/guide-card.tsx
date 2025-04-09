import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

interface GuideCardProps {
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

const GuideCard: React.FC<GuideCardProps> = ({
  title,
  slug,
  description,
  imageUrl,
  category,
  difficulty,
  duration,
  steps
}) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <Link href={`/guides/${slug}`}>
        <div className="cursor-pointer">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                {category}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <i className="far fa-clock"></i>
                  {duration}
                </span>
                <span className="flex items-center gap-1">
                  <i className="far fa-list-alt"></i>
                  {steps} steps
                </span>
              </div>
            </div>
            
            <h3 className="font-inter font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-primary">
              {title}
            </h3>
            
            <p className="text-gray-600 mb-4 line-clamp-2">
              {description}
            </p>
            
            <div className="flex items-center gap-2 text-primary font-medium group">
              <span>Start Learning</span>
              <i className="fas fa-arrow-right text-sm transition-transform group-hover:translate-x-1"></i>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default GuideCard;