import React from 'react';

interface ArticleProps {
  slug: string;
}

const Article: React.FC<ArticleProps> = ({ slug }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Article: {slug}</h1>
      {/* Article content here */}
    </div>
  );
};

export default Article;
