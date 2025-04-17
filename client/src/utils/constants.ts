// Images for the carousel/hero section
export const heroImages = [
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1590691564191-2d5adc7e66be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
];

// Navigation links
export const navLinks = [
  {
    name: 'Plants',
    path: '/products/category/vegetables',
    submenu: [
      { name: 'Vegetables', path: '/products/category/vegetables' },
      { name: 'Herbs', path: '/products/category/herbs' },
      { name: 'Flowers', path: '/products/category/flowers' },
      { name: 'Indoor Plants', path: '/products/category/indoor-plants' },
      { name: 'Seeds', path: '/products/category/seeds' }
    ]
  },
  {
    name: 'Tools',
    path: '/products/category/garden-tools',
    submenu: [
      { name: 'Hand Tools', path: '/products/category/hand-tools' },
      { name: 'Power Tools', path: '/products/category/power-tools' },
      { name: 'Watering', path: '/products/category/watering' },
      { name: 'Pruning', path: '/products/category/pruning' }
    ]
  },
  {
    name: 'Accessories',
    path: '/products/category/pots-planters',
    submenu: [
      { name: 'Pots & Planters', path: '/products/category/pots-planters' },
      { name: 'Soil & Fertilizers', path: '/products/category/soil-fertilizers' },
      { name: 'Garden Decor', path: '/products/category/garden-decor' },
      { name: 'Pest Control', path: '/products/category/pest-control' }
    ]
  },
  {
    name: 'Blog',
    path: '/blog',
    submenu: []
  },
  {
    name: 'About',
    path: '/about',
    submenu: []
  }
];

// Footer quick links
export const footerQuickLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Shop', path: '/products' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'FAQs', path: '/faqs' }
];

// Footer category links
export const footerCategoryLinks = [
  { name: 'Vegetables', path: '/products/category/vegetables' },
  { name: 'Herbs', path: '/products/category/herbs' },
  { name: 'Indoor Plants', path: '/products/category/indoor-plants' },
  { name: 'Garden Tools', path: '/products/category/garden-tools' },
  { name: 'Pots & Planters', path: '/products/category/pots-planters' }
];

// Company information
export const companyInfo = {
  name: 'Okkyno',
  address: '123 Garden Street, Plantville, PL 12345',
  phone: '(800) 555-1234',
  email: 'info@okkyno.com',
  hours: 'Mon-Fri: 9am-5pm, Sat: 10am-4pm'
};

// Social media links
export const socialLinks = [
  { name: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
  { name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
  { name: 'Pinterest', url: 'https://pinterest.com', icon: 'pinterest' },
  { name: 'YouTube', url: 'https://youtube.com', icon: 'youtube' }
];

// Legal links
export const legalLinks = [
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Terms of Service', path: '/terms-of-service' },
  { name: 'Shipping & Returns', path: '/shipping-returns' }
];

// Common product categories
export const productCategories = [
  'Vegetables',
  'Herbs',
  'Flowers',
  'Indoor Plants',
  'Garden Tools',
  'Pots & Planters',
  'Seeds',
  'Soil & Fertilizers'
];

// Product rating options
export const ratingOptions = [5, 4, 3, 2, 1];

// Order status options
export const orderStatuses = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
];

// Payment methods
export const paymentMethods = [
  'Credit Card',
  'PayPal',
  'Bank Transfer'
];
