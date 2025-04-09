// Netlify serverless function to handle API requests
const { storage } = require('./storage');

// Set CORS headers for all responses
const headers = {
  'Access-Control-Allow-Origin': '*', // Or set to your specific domain in production
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Content-Type': 'application/json'
};

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  const segments = path.split('/').filter(Boolean);
  const method = event.httpMethod;

  try {
    // Handle different API endpoints
    
    // GET /api/categories
    if (method === 'GET' && segments[0] === 'categories' && segments.length === 1) {
      const categories = await storage.getCategories();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(categories)
      };
    }
    
    // GET /api/categories/:slug
    if (method === 'GET' && segments[0] === 'categories' && segments.length === 2) {
      const slug = segments[1];
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Category not found' })
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(category)
      };
    }
    
    // GET /api/categories/:slug/products
    if (method === 'GET' && segments[0] === 'categories' && segments.length === 3 && segments[2] === 'products') {
      const slug = segments[1];
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Category not found' })
        };
      }
      
      const products = await storage.getProductsByCategory(category.id);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products)
      };
    }
    
    // GET /api/products
    if (method === 'GET' && segments[0] === 'products' && segments.length === 1) {
      const products = await storage.getProducts();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products)
      };
    }
    
    // GET /api/products/:slug
    if (method === 'GET' && segments[0] === 'products' && segments.length === 2) {
      const slug = segments[1];
      const product = await storage.getProductBySlug(slug);
      
      if (!product) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Product not found' })
        };
      }
      
      // Get product images
      const images = await storage.getProductImages(product.id);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ...product, images })
      };
    }
    
    // GET /api/articles
    if (method === 'GET' && segments[0] === 'articles' && segments.length === 1) {
      const articles = await storage.getArticles();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(articles)
      };
    }
    
    // GET /api/articles/:slug
    if (method === 'GET' && segments[0] === 'articles' && segments.length === 2) {
      const slug = segments[1];
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Article not found' })
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(article)
      };
    }
    
    // GET /api/testimonials
    if (method === 'GET' && segments[0] === 'testimonials' && segments.length === 1) {
      const testimonials = await storage.getTestimonials();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(testimonials)
      };
    }
    
    // POST /api/subscribers
    if (method === 'POST' && segments[0] === 'subscribers' && segments.length === 1) {
      const data = JSON.parse(event.body);
      
      if (!data.email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Email is required' })
        };
      }
      
      const subscriber = await storage.createSubscriber({
        email: data.email,
        firstName: data.firstName || null,
        lastName: data.lastName || null
      });
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(subscriber)
      };
    }
    
    // POST /api/contacts
    if (method === 'POST' && segments[0] === 'contacts' && segments.length === 1) {
      const data = JSON.parse(event.body);
      
      if (!data.name || !data.email || !data.message || !data.service) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Name, email, service, and message are required' })
        };
      }
      
      const contact = await storage.createContact({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        service: data.service,
        message: data.message
      });
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(contact)
      };
    }
    
    // GET /api/search?q=query
    if (method === 'GET' && segments[0] === 'search' && segments.length === 1) {
      const query = event.queryStringParameters?.q;
      
      if (!query) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Search query is required' })
        };
      }
      
      const results = await storage.search(query);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(results)
      };
    }
    
    // Endpoint not found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' })
    };
    
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};
