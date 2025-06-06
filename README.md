# Okkyno.com - Professional Gardening E-commerce Platform

![Okkyno.com](icon.svg)

A professional gardening e-commerce platform offering comprehensive product listings, interactive user experience, and robust admin management.

## Features

- **Comprehensive Product Catalog**: 200+ garden products with detailed information, images, and specifications
- **Category Management**: Browse products by categories including Vegetables, Herbs, Tools, and more
- **User Accounts**: Create accounts, save favorites, and track order history
- **Shopping Cart**: Add products to cart, adjust quantities, and checkout
- **Blog Section**: Educational content on gardening tips and plant care
- **Admin Dashboard**: Manage products, orders, and content
- **Responsive Design**: Mobile-first approach for all device sizes

## Tech Stack

- **Frontend**: React with TypeScript
- **State Management**: React Context API and TanStack Query
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Express.js API
- **Database**: In-memory database (development) / PostgreSQL (production)
- **Authentication**: Passport.js
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: wouter for client-side routing

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/okkyno.com.git
   cd okkyno.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

## Deployment

The project is configured for deployment on Netlify. Simply connect your GitHub repository to Netlify and the site will be automatically deployed from the main branch.

Environmental variables that need to be set in Netlify:
- `SESSION_SECRET` - Secret used for session encryption
- `NODE_ENV` - Set to "production" for production builds

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/                # Source files
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application component
├── server/                 # Backend Express API
│   ├── storage.ts          # Data storage interface
│   └── routes.ts           # API route definitions
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts           # Data models and validation schemas
└── netlify/                # Netlify configuration
    └── functions/          # Serverless functions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by Epic Gardening
- Plant data sourced from reputable gardening resources

## Running Puppeteer on Render.com

When deploying a Puppeteer-based script to Render.com, run the browser in
headless mode and set a user agent. Otherwise, Chromium will fail to start.

```javascript
const puppeteer = require('puppeteer');

async function startBrowser() {
  return await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 720 },
  });
}

async function openPage(url) {
  const browser = await startBrowser();
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );
  await page.goto(url, { waitUntil: 'networkidle0' });
  // ...
  await browser.close();
}
```

`headless: true` stops Puppeteer from opening a GUI window, which is not
possible in a cloud build. The user agent ensures sites treat the headless
browser like a normal visitor.
