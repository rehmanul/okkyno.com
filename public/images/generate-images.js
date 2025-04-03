import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create directories if they don't exist
const directories = [
  path.join(__dirname, 'categories'),
  path.join(__dirname, 'products'),
  path.join(__dirname, 'articles')
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Function to generate a visually appealing SVG with gradient, pattern, and text
function generateSVG(text, backgroundColor, textColor = 'white', width = 400, height = 400) {
  // Generate a slightly darker shade for gradient
  const darkerColor = backgroundColor.replace(/^#/, '');
  const r = parseInt(darkerColor.substr(0, 2), 16);
  const g = parseInt(darkerColor.substr(2, 2), 16);
  const b = parseInt(darkerColor.substr(4, 2), 16);
  const darkerShade = `#${Math.max(0, r - 30).toString(16).padStart(2, '0')}${Math.max(0, g - 30).toString(16).padStart(2, '0')}${Math.max(0, b - 30).toString(16).padStart(2, '0')}`;
  
  // Generate a lighter shade for highlights
  const lighterShade = `#${Math.min(255, r + 30).toString(16).padStart(2, '0')}${Math.min(255, g + 30).toString(16).padStart(2, '0')}${Math.min(255, b + 30).toString(16).padStart(2, '0')}`;

  // Generate unique IDs for the gradient
  const gradientId = `grad-${Math.random().toString(36).substring(2, 9)}`;
  const patternId = `pattern-${Math.random().toString(36).substring(2, 9)}`;
  
  // Split text into lines
  const lines = text.split('\n');
  const lineHeight = 30;
  const yStart = height / 2 - (lines.length * lineHeight) / 2 + lineHeight / 2;
  
  const textElements = lines.map((line, index) => {
    return `<text x="${width/2}" y="${yStart + index * lineHeight}" fill="${textColor}" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle" filter="url(#shadow)">${line}</text>`;
  }).join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${backgroundColor}" />
      <stop offset="100%" stop-color="${darkerShade}" />
    </linearGradient>
    <pattern id="${patternId}" patternUnits="userSpaceOnUse" width="30" height="30" patternTransform="rotate(45)">
      <rect width="30" height="30" fill="url(#${gradientId})" />
      <circle cx="15" cy="15" r="2" fill="${lighterShade}" fill-opacity="0.3" />
    </pattern>
    <filter id="shadow" x="-2" y="-2" width="104%" height="104%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.3" />
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${patternId})" />
  <rect width="${width}" height="${height/4}" y="${height*3/4}" fill="${darkerShade}" opacity="0.2" />
  ${textElements}
</svg>`;
}

// Generate category images
const categories = [
  { filename: 'categories/3139i_Bean-Bush-Goldrush-ORG-new2025_ndzu9h.svg', text: 'Vegetables', color: '#4CAF50' },
  { filename: 'categories/2026i_Nasturtium-Fiesta-Blend_6ceu81.svg', text: 'Flowers', color: '#8BC34A' },
  { filename: 'categories/10331_Medium_Tall_LightClay_Compressed.svg', text: 'Container\nGardening', color: '#689F38' },
  { filename: 'categories/herbs_category.svg', text: 'Herbs', color: '#00796B' },
  { filename: 'categories/tools_category.svg', text: 'Tools', color: '#5D4037' },
  { filename: 'categories/fertilizers_category.svg', text: 'Fertilizers', color: '#795548' },
  { filename: 'categories/pest_control_category.svg', text: 'Pest Control', color: '#FF5722' },
  { filename: 'categories/grow_lights_category.svg', text: 'Grow Lights', color: '#FFC107' }
];

// Generate article images
const articles = [
  { filename: 'articles/4560i-Heirloom-ORG-Seed-Bank-Collection_35vk3o_m4m7ls.svg', text: 'Seeds', color: '#33691E' },
  { filename: 'articles/10344_Small_Tall_SlateGrey_Compressed.svg', text: 'Raised Beds', color: '#1B5E20' },
  { filename: 'articles/spring_gardening_tips.svg', text: 'Spring\nGardening Tips', color: '#558B2F' },
  { filename: 'articles/composting_basics.svg', text: 'Composting\nBasics', color: '#8D6E63' },
  { filename: 'articles/garden_pests.svg', text: 'Garden Pests\nIdentification', color: '#F57C00' },
  { filename: 'articles/watering_guide.svg', text: 'Watering\nGuide', color: '#0288D1' },
  { filename: 'articles/soil_improvement.svg', text: 'Soil\nImprovement', color: '#6D4C41' }
];

// Generate product images
const products = [
  { filename: 'products/16-celltray2_400x400.svg', text: 'Seed Starting', color: '#2E7D32' },
  { filename: 'products/10328_Large_short_LightClay.svg', text: 'Round Metal\nRaised Bed', color: '#558B2F' },
  { filename: 'products/1193i_Zinnia-Persian-Carpet_3oykxo.svg', text: 'Zinnia Seeds', color: '#7CB342' },
  { filename: 'products/6cellblack_400x400.svg', text: '6-Cell\nSeed Kit', color: '#558B2F' },
  { filename: 'products/4-cell-side-compressed_400x400.svg', text: '4-Cell\nSeed Kit', color: '#33691E' },
  { filename: 'products/4CellDomeWithBottomSmallGardenStarterKits_59f087c6-7e6c-41ee-b5af-765c31bbc57c_20_1_400x400.svg', text: '4-Cell Dome\nSeed Kit', color: '#1B5E20' },
  { filename: 'products/2022-11-17-Diego0293-STACK_400x400.svg', text: 'Stack & Grow\nSeedling Trays', color: '#2E7D32' },
  { filename: 'products/garden_gloves.svg', text: 'Garden\nGloves', color: '#FF5722' },
  { filename: 'products/hand_trowel.svg', text: 'Hand\nTrowel', color: '#5D4037' },
  { filename: 'products/watering_can.svg', text: 'Watering\nCan', color: '#0288D1' },
  { filename: 'products/tomato_seeds.svg', text: 'Tomato\nSeeds', color: '#E53935' },
  { filename: 'products/herb_scissors.svg', text: 'Herb\nScissors', color: '#00796B' },
  { filename: 'products/plant_labels.svg', text: 'Plant\nLabels', color: '#F57C00' },
  { filename: 'products/strawberry_planter.svg', text: 'Strawberry\nPlanter', color: '#C2185B' },
  { filename: 'products/drip_irrigation.svg', text: 'Drip\nIrrigation Kit', color: '#0097A7' },
  { filename: 'products/pruning_shears.svg', text: 'Pruning\nShears', color: '#546E7A' },
  { filename: 'products/compost_bin.svg', text: 'Compost\nBin', color: '#6D4C41' },
  { filename: 'products/vertical_planter.svg', text: 'Vertical\nPlanter', color: '#455A64' }
];

// Generate and save all images
[...categories, ...articles, ...products].forEach(item => {
  const svg = generateSVG(item.text, item.color);
  fs.writeFileSync(path.join(__dirname, item.filename), svg);
  console.log(`Generated: ${item.filename}`);
});

console.log('All images generated successfully!');