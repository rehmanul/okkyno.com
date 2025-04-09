import React from 'react';

interface CategoryProps {
  slug: string;
}

const Category: React.FC<CategoryProps> = ({ slug }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Category: {slug}</h1>
      {/* Category content here */}
    </div>
  );
};

export default Category;
