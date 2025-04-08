import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create an SVG with text and custom background
function generateSVG(text, backgroundColor, textColor = 'white', width = 400, height = 300) {
  // Create a random pattern in the background with slightly lighter color
  const lighterColor = lightenColor(backgroundColor, 20);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="${backgroundColor}" />
    <g fill="${lighterColor}" opacity="0.3">
      ${generateRandomPatterns(width, height)}
    </g>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" 
          font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${textColor}">
      ${text}
    </text>
  </svg>`;
}

// Generate random patterns for the SVG background
function generateRandomPatterns(width, height) {
  let patterns = '';
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 10 + Math.random() * 40;
    
    if (Math.random() > 0.5) {
      // Circle
      patterns += `<circle cx="${x}" cy="${y}" r="${size}" />`;
    } else {
      // Rectangle
      patterns += `<rect x="${x}" y="${y}" width="${size}" height="${size}" />`;
    }
  }
  return patterns;
}

// Helper function to lighten a color
function lightenColor(hex, percent) {
  // Remove hash if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex color
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);
  
  // Lighten
  r = Math.min(255, Math.floor(r * (1 + percent / 100)));
  g = Math.min(255, Math.floor(g * (1 + percent / 100)));
  b = Math.min(255, Math.floor(b * (1 + percent / 100)));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Create directory if it doesn't exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Generate vegetable category images
const categories = [
  { name: 'Vegetables', color: '#2E7D32' },
  { name: 'Herbs', color: '#558B2F' },
  { name: 'Flowers', color: '#C62828' },
  { name: 'Fruits', color: '#EF6C00' },
  { name: 'Tools', color: '#455A64' },
  { name: 'Containers', color: '#6D4C41' }
];

const categoryDir = path.join(__dirname, '../public/images/categories');
ensureDirectoryExists(categoryDir);

categories.forEach(category => {
  const slug = category.name.toLowerCase();
  const svg = generateSVG(category.name, category.color);
  fs.writeFileSync(path.join(categoryDir, `${slug}.svg`), svg);
  console.log(`Generated category image: ${slug}.svg`);
});

// Generate product images
const products = [
  { name: 'Raised Garden Bed Kit', color: '#795548' },
  { name: 'Tomato Seeds (Heirloom)', color: '#E53935' },
  { name: 'Herb Garden Starter Kit', color: '#7CB342' },
  { name: 'Expandable Garden Hose', color: '#1976D2' },
  { name: 'Cedar Planter Box', color: '#A1887F' },
  { name: 'Compost Bin', color: '#6D4C41' },
  { name: 'Pruning Shears', color: '#546E7A' },
  { name: 'Vegetable Fertilizer', color: '#8D6E63' }
];

const productDir = path.join(__dirname, '../public/images/products');
ensureDirectoryExists(productDir);

products.forEach(product => {
  const slug = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  const svg = generateSVG(product.name, product.color);
  fs.writeFileSync(path.join(productDir, `${slug}.svg`), svg);
  console.log(`Generated product image: ${slug}.svg`);
});

// Generate hero image
const heroDir = path.join(__dirname, '../public/images/hero');
ensureDirectoryExists(heroDir);
const heroSvg = generateSVG('Garden Hero Image', '#4CAF50', 'white', 800, 500);
fs.writeFileSync(path.join(heroDir, 'garden-hero.svg'), heroSvg);
console.log('Generated hero image: garden-hero.svg');

// Generate about section images
const aboutDir = path.join(__dirname, '../public/images/about');
ensureDirectoryExists(aboutDir);
const aboutImages = [
  { name: 'about-1', color: '#43A047', text: 'Urban Gardening' },
  { name: 'about-2', color: '#689F38', text: 'Organic Produce' },
  { name: 'about-3', color: '#388E3C', text: 'Expert Gardeners' },
  { name: 'about-4', color: '#4CAF50', text: 'Garden Design' }
];

aboutImages.forEach(img => {
  const svg = generateSVG(img.text, img.color, 'white', 400, 400);
  fs.writeFileSync(path.join(aboutDir, `${img.name}.svg`), svg);
  console.log(`Generated about image: ${img.name}.svg`);
});

// Generate CTA section image
const ctaDir = path.join(__dirname, '../public/images/cta');
ensureDirectoryExists(ctaDir);
const ctaSvg = generateSVG('Garden Planning', '#00897B', 'white', 600, 400);
fs.writeFileSync(path.join(ctaDir, 'garden-planning.svg'), ctaSvg);
console.log('Generated CTA image: garden-planning.svg');

// Generate articles images
const articlesDir = path.join(__dirname, '../public/images/articles');
ensureDirectoryExists(articlesDir);
const articles = [
  { name: 'spring-gardening-tips', color: '#66BB6A', text: 'Spring Gardening Tips' },
  { name: 'growing-tomatoes', color: '#EF5350', text: 'Growing Tomatoes' },
  { name: 'organic-pest-control', color: '#AED581', text: 'Organic Pest Control' },
  { name: 'herb-gardening', color: '#81C784', text: 'Herb Gardening' }
];

articles.forEach(article => {
  const svg = generateSVG(article.text, article.color);
  fs.writeFileSync(path.join(articlesDir, `${article.name}.svg`), svg);
  console.log(`Generated article image: ${article.name}.svg`);
});

console.log('All images generated successfully!');