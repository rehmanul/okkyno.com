# Okkyno.com

A gardening website inspired by [Epic Gardening](https://www.epicgardening.com).

## Features

- Modern responsive design
- Content-rich gardening resources
- Product listings and categories
- Blog articles and growing guides
- E-commerce functionality with shopping cart
- Secure payment processing (Stripe)
- Newsletter subscription
- Contact form

## Technologies Used

- React with TypeScript
- Tailwind CSS and shadcn/ui for styling
- Express.js backend
- Stripe for payment processing
- In-memory data storage
- Netlify for deployment

## Local Development

1. Clone the repository
2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Setting Up Payment Processing

The checkout process is currently configured with a placeholder for Stripe integration. To enable real payment processing:

1. Create a Stripe account at [stripe.com](https://stripe.com) if you don't have one
2. Get your API keys from the Stripe Dashboard (https://dashboard.stripe.com/apikeys)
3. Add the following environment variables:
   - `STRIPE_SECRET_KEY` - Your Stripe Secret Key (starts with "sk_")
   - `VITE_STRIPE_PUBLIC_KEY` - Your Stripe Publishable Key (starts with "pk_")
4. Uncomment the Stripe integration code in:
   - `client/src/pages/Checkout.tsx`
   - `server/routes.ts`

For a full Stripe implementation, you'll need to:

1. Create products and prices in your Stripe Dashboard
2. Implement webhook handling for post-payment processes
3. Set up proper error handling and payment confirmation flows
4. Consider implementing Stripe Customer objects for user accounts

Refer to the [Stripe API Documentation](https://stripe.com/docs/api) for detailed implementation guidance.

## Deployment to Netlify

### Option 1: Continuous Deployment via GitHub

1. Push your code to GitHub
2. Create a new site in Netlify
3. Connect to your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add your Stripe environment variables in the Netlify dashboard:
   - Settings → Build & deploy → Environment → Environment variables
6. Deploy the site

### Option 2: Manual Deployment

1. Build the project for production
```bash
npm run build
```

2. Run the deployment script to prepare the files
```bash
./deploy-netlify.sh
```

3. Install Netlify CLI (if not already installed)
```bash
npm install -g netlify-cli
```

4. Set up environment variables for Stripe
```bash
netlify env:set STRIPE_SECRET_KEY sk_your_secret_key
netlify env:set VITE_STRIPE_PUBLIC_KEY pk_your_public_key
```

5. Deploy to Netlify
```bash
netlify deploy
```

6. Follow the prompts to complete the deployment

## Project Structure

- `client/` - Frontend React application
  - `src/pages/` - Page components
  - `src/components/` - Reusable UI components
  - `src/contexts/` - React context providers (e.g., CartContext)
  - `src/hooks/` - Custom React hooks
- `server/` - Express.js backend
  - `routes.ts` - API routes including payment processing
  - `storage.ts` - Data storage implementation
- `shared/` - Shared types and schemas
- `functions/` - Netlify serverless functions
- `public/` - Static assets including images