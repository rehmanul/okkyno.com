# Okkyno.com File Structure Guide

This guide explains how to add new files to the Okkyno.com website so they'll be automatically connected and deployed properly.

## Directory Structure

```
okkyno.com/
├── client/                      # Frontend React code
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── lib/                 # Utility functions
│   │   ├── contexts/            # React context providers
│   │   └── hooks/               # Custom React hooks
├── public/                      # Static assets
│   ├── images/                  # Image files
│   │   ├── products/            # Product images
│   │   ├── categories/          # Category images
│   │   ├── articles/            # Article images 
│   │   ├── testimonials/        # Testimonial avatars
│   │   └── ...                  # Other image directories
├── server/                      # Backend code
│   ├── storage.ts               # Data storage interface
│   └── routes.ts                # API routes
├── shared/                      # Shared code between frontend and backend
│   └── schema.ts                # Data schema definitions
├── functions/                   # Netlify serverless functions
│   ├── api.js                   # Main API function
│   └── env.js                   # Environment variables function
└── scripts/                     # Utility scripts
    ├── prepare-assets.js        # Asset preparation script
    └── generate-images.js       # Image generation script
```

## Adding New Files

### Adding Images

1. Place your image files in the appropriate directory under `public/images/`:
   - Product images: `public/images/products/`
   - Category images: `public/images/categories/`
   - Article images: `public/images/articles/`
   - Testimonial avatars: `public/images/testimonials/`
   - Banners: `public/images/banners/`
   - etc.

2. Images will be automatically available at paths like `/images/products/your-image.jpg`.

### Adding New Pages

1. Create a new page component in `client/src/pages/`:

```jsx
// client/src/pages/NewPage.tsx
import React from 'react';

export default function NewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">New Page</h1>
      <p>This is a new page.</p>
    </div>
  );
}
```

2. Add the route in `client/src/App.tsx`:

```jsx
// In the Router component
<Route path="/new-page">
  <NewPage />
</Route>
```

3. Add a link to the new page in the navigation:

```jsx
<Link href="/new-page">
  <span className="font-medium hover:text-primary transition-colors cursor-pointer">New Page</span>
</Link>
```

### Adding New API Endpoints

1. Update the `server/routes.ts` file to add new endpoints:

```typescript
// Add a new endpoint
app.get('/api/new-endpoint', async (req, res) => {
  try {
    // Your endpoint logic here
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

2. Update the Netlify function in `functions/api.js` to handle the new endpoint:

```javascript
// Handle /api/new-endpoint
if (segments[0] === 'new-endpoint') {
  // Your endpoint logic here
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, data: [] })
  };
}
```

## Automatic Connection

Thanks to the project setup:

1. All static assets in the `public` directory are automatically served.
2. All React routes are handled by client-side routing.
3. All API endpoints are automatically proxied to Netlify functions in production.

When you add new files according to this structure, they will be automatically connected and work correctly both in development and production.

## Deployment

After adding new files, deploy your changes using the included deployment script:

```bash
./deploy-netlify.sh
```

This will create a ZIP file that you can upload to Netlify, or if you're using Git, simply push your changes to the connected repository.