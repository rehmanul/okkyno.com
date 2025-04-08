#!/bin/bash

# Netlify deployment script
echo "Building for Netlify deployment..."

# Step 1: Build the client
npm run build

# Step 2: Copy Netlify configuration files
cp netlify.toml dist/

# Step 3: Copy server files needed for Netlify functions
mkdir -p dist/server
cp -r server/storage.ts dist/server/
cp -r shared dist/

# Step 4: Copy functions directory to netlify functions location
mkdir -p dist/functions
cp -r functions/* dist/functions/

# Step 5: Copy any additional assets that might be needed
if [ -d "public" ]; then
  echo "Copying additional public assets..."
  cp -r public/* dist/
fi

# Step 6: Create a package.json for Netlify functions
cat > dist/package.json << EOF
{
  "name": "okkyno-api-functions",
  "version": "1.0.0",
  "description": "Netlify functions for Okkyno.com",
  "main": "index.js",
  "dependencies": {
    "zod": "latest",
    "drizzle-orm": "latest",
    "drizzle-zod": "latest"
  }
}
EOF

# Step 7: Create a simple zip file for easy download
echo "Creating zip archive for deployment..."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ZIP_FILENAME="okkyno_netlify_deploy_${TIMESTAMP}.zip"
cd dist && zip -r "../${ZIP_FILENAME}" . -x "*.DS_Store" -x "*.git*" && cd ..

echo "=================================================="
echo "✅ Deployment package prepared for Netlify!"
echo "✅ ZIP file created: ${ZIP_FILENAME}"
echo ""
echo "To deploy to Netlify:"
echo "1. Upload the ZIP file through Netlify UI OR"
echo "2. Use 'netlify deploy' command OR"
echo "3. Connect your Git repository to Netlify"
echo "=================================================="