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

// Function to generate a colored SVG with text
function generateSVG(text, backgroundColor, textColor = 'white', width = 400, height = 400) {
  // Split text into lines
  const lines = text.split('\n');
  const lineHeight = 30;
  const yStart = height / 2 - (lines.length * lineHeight) / 2 + lineHeight / 2;
  
  const textElements = lines.map((line, index) => {
    return `<text x="${width/2}" y="${yStart + index * lineHeight}" fill="${textColor}" font-family="Arial" font-size="20" text-anchor="middle">${line}</text>`;
  }).join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${backgroundColor}" />
  ${textElements}
</svg>`;
}

// Generate category images
const categories = [
  { filename: 'categories/3139i_Bean-Bush-Goldrush-ORG-new2025_ndzu9h.svg', text: 'Vegetables', color: '#4CAF50' },
  { filename: 'categories/2026i_Nasturtium-Fiesta-Blend_6ceu81.svg', text: 'Flowers', color: '#8BC34A' },
  { filename: 'categories/10331_Medium_Tall_LightClay_Compressed.svg', text: 'Container\nGardening', color: '#689F38' }
];

// Generate article images
const articles = [
  { filename: 'articles/4560i-Heirloom-ORG-Seed-Bank-Collection_35vk3o_m4m7ls.svg', text: 'Seeds', color: '#33691E' },
  { filename: 'articles/10344_Small_Tall_SlateGrey_Compressed.svg', text: 'Raised Beds', color: '#1B5E20' }
];

// Generate product images
const products = [
  { filename: 'products/16-celltray2_400x400.svg', text: 'Seed Starting', color: '#2E7D32' },
  { filename: 'products/10328_Large_short_LightClay.svg', text: 'Round Metal\nRaised Bed', color: '#558B2F' },
  { filename: 'products/1193i_Zinnia-Persian-Carpet_3oykxo.svg', text: 'Zinnia Seeds', color: '#7CB342' },
  { filename: 'products/6cellblack_400x400.svg', text: '6-Cell\nSeed Kit', color: '#558B2F' },
  { filename: 'products/4-cell-side-compressed_400x400.svg', text: '4-Cell\nSeed Kit', color: '#33691E' },
  { filename: 'products/4CellDomeWithBottomSmallGardenStarterKits_59f087c6-7e6c-41ee-b5af-765c31bbc57c_20_1_400x400.svg', text: '4-Cell Dome\nSeed Kit', color: '#1B5E20' },
  { filename: 'products/2022-11-17-Diego0293-STACK_400x400.svg', text: 'Stack & Grow\nSeedling Trays', color: '#2E7D32' }
];

// Generate and save all images
[...categories, ...articles, ...products].forEach(item => {
  const svg = generateSVG(item.text, item.color);
  fs.writeFileSync(path.join(__dirname, item.filename), svg);
  console.log(`Generated: ${item.filename}`);
});

console.log('All images generated successfully!');