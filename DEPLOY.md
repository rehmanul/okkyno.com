# Okkyno.com Deployment Guide

This document provides step-by-step instructions for deploying the Okkyno.com website to Netlify.

## Prerequisites

Before deploying, make sure you have:

1. A [Netlify account](https://app.netlify.com/signup)
2. Git installed on your computer (if deploying via Git)
3. Node.js and npm installed (for local testing)

## Deployment Options

You have two main options for deploying to Netlify:

### Option 1: Drag and Drop Deployment

This is the simplest option for a quick deployment:

1. Run the deployment script:
   ```bash
   ./deploy-netlify.sh
   ```

2. This will create a zip file in the project root directory

3. Go to [Netlify](https://app.netlify.com/)

4. Drag and drop the generated zip file onto the Netlify dashboard

5. Netlify will automatically build and deploy your site

### Option 2: Git-based Deployment (Recommended)

For continuous deployment with version control:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. In Netlify, click "New site from Git"

3. Connect your Git provider and select the repository

4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

5. Click "Deploy site"

## Environment Variables

Make sure to set these environment variables in Netlify:

1. Go to Site settings > Environment variables

2. Add the following (if needed for your project):
   ```
   NODE_ENV=production
   ```

3. If you're using Stripe for payments, also add:
   ```
   STRIPE_SECRET_KEY=your_secret_key
   VITE_STRIPE_PUBLIC_KEY=your_public_key
   ```

## Custom Domain

To use a custom domain with your Netlify site:

1. Go to Site settings > Domain management

2. Click "Add custom domain"

3. Enter your domain name and follow the instructions

4. Update your domain's DNS settings to point to Netlify

## Post-Deployment Checks

After deployment, verify these items:

1. All pages load correctly
2. Images and assets appear properly
3. Forms submit successfully
4. API endpoints work as expected
5. Responsive design functions on mobile devices

## Troubleshooting

If you encounter issues:

1. Check Netlify's deploy logs for errors
2. Verify environment variables are set correctly
3. Test locally with `npm run dev` before deploying
4. Check browser console for client-side errors

## Contact

If you need assistance with deployment, please contact support@okkyno.com.