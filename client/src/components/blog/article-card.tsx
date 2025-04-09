import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

interface ArticleCardProps {
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

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  slug,
  excerpt,
  imageUrl,
  category,
  author,
  publishedAt,
  readTime
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl"
    >
      <Link href={`/article/${slug}`}>
        <div className="cursor-pointer">
          <div className="relative aspect-video overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transform transition-transform hover:scale-110"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                {category}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="font-inter font-bold text-xl text-gray-900 mb-3 line-clamp-2 hover:text-primary transition-colors">
              {title}
            </h3>
            
            <p className="text-gray-600 mb-4 line-clamp-2">
              {excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{author.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <i className="far fa-clock mr-1"></i>
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ArticleCard;