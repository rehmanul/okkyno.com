import React from 'react';

interface ProductProps {
  slug: string;
}

const Product: React.FC<ProductProps> = ({ slug }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Product: {slug}</h1>
      {/* Product content here */}
    </div>
  );
};

export default Product;
