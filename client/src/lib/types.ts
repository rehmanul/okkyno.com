// Custom type definitions for use in the client code
// These should match the schema types defined in shared/schema.ts

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  category: string;
  categoryId: number;
  stockQuantity: number;
  featured: boolean;
  rating: number;
  ratingCount: number;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  categoryId: number;
  category: string;
  publishedAt: string;
  featured: boolean;
}

export interface Testimonial {
  id: number;
  personName: string;
  role: string;
  content: string;
  rating: number;
  avatarUrl: string;
}

export interface Subscriber {
  id: number;
  email: string;
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}