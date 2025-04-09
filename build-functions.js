import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the output directory exists
const functionsDistDir = path.join(__dirname, 'functions-dist');
if (!fs.existsSync(functionsDistDir)) {
  fs.mkdirSync(functionsDistDir, { recursive: true });
}

// Get all JavaScript files from functions directory
const functionsDir = path.join(__dirname, 'functions');
const functionFiles = fs.readdirSync(functionsDir)
  .filter(file => file.endsWith('.js'))
  .map(file => path.join(functionsDir, file));

// Bundle each function with its dependencies
async function bundleFunctions() {
  try {
    await build({
      entryPoints: functionFiles,
      bundle: true,
      platform: 'node',
      target: 'node14',
      outdir: functionsDistDir,
      external: ['aws-sdk', 'sharp', 'canvas'],
      logLevel: 'info'
    });

    // Copy the bundled functions back to the functions directory
    fs.readdirSync(functionsDistDir).forEach(file => {
      fs.copyFileSync(
        path.join(functionsDistDir, file),
        path.join(functionsDir, file)
      );
      console.log(`Copied bundled function: ${file}`);
    });

    console.log('Functions bundled successfully');
  } catch (error) {
    console.error('Error bundling functions:', error);
    process.exit(1);
  }
}

bundleFunctions();
