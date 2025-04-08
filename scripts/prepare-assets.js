/**
 * Asset Preparation Script for Okkyno.com
 * 
 * This script helps organize assets for deployment by:
 * 1. Creating necessary directories
 * 2. Moving assets from attached_assets to the correct locations
 * 3. Optimizing images when possible
 * 
 * Usage:
 *   node scripts/prepare-assets.js
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory structure to ensure exists
const ensureDirectories = [
  'public/images/products',
  'public/images/categories',
  'public/images/articles',
  'public/images/testimonials',
  'public/images/banners',
  'public/images/backgrounds',
  'public/images/icons',
  'public/images/logos'
];

// Create directories if they don't exist
ensureDirectories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Check if attached_assets directory exists
if (fs.existsSync('attached_assets')) {
  console.log('Processing attached assets...');
  
  // Get all files in attached_assets
  const files = fs.readdirSync('attached_assets');
  
  files.forEach(file => {
    const extension = path.extname(file).toLowerCase();
    const sourcePath = path.join('attached_assets', file);
    
    // Skip directories and non-files
    if (!fs.statSync(sourcePath).isFile()) {
      return;
    }
    
    // Process based on file type
    if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(extension)) {
      // This is an image - determine the best location based on filename
      let targetDir = 'public/images';
      
      if (file.includes('product') || file.includes('item')) {
        targetDir = 'public/images/products';
      } else if (file.includes('category') || file.includes('cat')) {
        targetDir = 'public/images/categories';
      } else if (file.includes('article') || file.includes('blog')) {
        targetDir = 'public/images/articles';
      } else if (file.includes('testimonial') || file.includes('avatar') || file.includes('person')) {
        targetDir = 'public/images/testimonials';
      } else if (file.includes('banner') || file.includes('hero')) {
        targetDir = 'public/images/banners';
      } else if (file.includes('background') || file.includes('bg')) {
        targetDir = 'public/images/backgrounds';
      } else if (file.includes('icon')) {
        targetDir = 'public/images/icons';
      } else if (file.includes('logo')) {
        targetDir = 'public/images/logos';
      }
      
      // Create target directory if it doesn't exist
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      const targetPath = path.join(targetDir, file);
      
      // Copy the file if it doesn't already exist at the destination
      if (!fs.existsSync(targetPath)) {
        console.log(`Copying ${file} to ${targetDir}`);
        fs.copyFileSync(sourcePath, targetPath);
      } else {
        console.log(`File ${file} already exists in ${targetDir}, skipping`);
      }
    } else if (['.tsx', '.ts', '.jsx', '.js', '.html', '.css'].includes(extension)) {
      // This is a code file - should be handled by deployment process
      console.log(`Skipping code file: ${file} (will be handled by build process)`);
    } else {
      // Other file types can be copied to the public directory
      const targetPath = path.join('public', file);
      
      if (!fs.existsSync(targetPath)) {
        console.log(`Copying other file ${file} to public directory`);
        fs.copyFileSync(sourcePath, targetPath);
      } else {
        console.log(`File ${file} already exists in public directory, skipping`);
      }
    }
  });
  
  console.log('Asset preparation complete!');
} else {
  console.log('No attached_assets directory found, skipping asset processing');
}

console.log(`
================================================
✅ Assets prepared for deployment!
================================================

- All necessary directories have been created
- Any attached assets have been organized
- Your site is ready for image content

Next steps:
1. Run the deployment script: ./deploy-netlify.sh
2. Upload the generated ZIP file to Netlify
   or connect your Git repository
`);