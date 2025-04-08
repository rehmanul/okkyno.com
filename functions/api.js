// Netlify serverless function to handle API requests
const { MemStorage } = require('../server/storage');

// Initialize our storage
const storage = new MemStorage();

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
  
  try {
    // Handle GET requests
    if (event.httpMethod === 'GET') {
      // Handle /api/categories
      if (segments[0] === 'categories') {
        if (segments.length === 1) {
          const categories = await storage.getCategories();
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(categories)
          };
        } else if (segments.length === 2) {
          const category = await storage.getCategoryBySlug(segments[1]);
          if (category) {
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify(category)
            };
          } else {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Category not found' })
            };
          }
        }
      }
      
      // Handle /api/products
      if (segments[0] === 'products') {
        if (segments.length === 1) {
          const products = await storage.getProducts();
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(products)
          };
        } else if (segments.length === 2) {
          const product = await storage.getProductBySlug(segments[1]);
          if (product) {
            // Get product images
            const productImages = await storage.getProductImages(product.id);
            const productWithImages = { ...product, images: productImages };
            
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify(productWithImages)
            };
          } else {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Product not found' })
            };
          }
        } else if (segments.length === 3 && segments[1] === 'category') {
          const category = await storage.getCategoryBySlug(segments[2]);
          if (category) {
            const products = await storage.getProductsByCategory(category.id);
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify(products)
            };
          } else {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Category not found' })
            };
          }
        }
      }
      
      // Handle /api/articles
      if (segments[0] === 'articles') {
        if (segments.length === 1) {
          const articles = await storage.getArticles();
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(articles)
          };
        } else if (segments.length === 2) {
          const article = await storage.getArticleBySlug(segments[1]);
          if (article) {
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify(article)
            };
          } else {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Article not found' })
            };
          }
        } else if (segments.length === 3 && segments[1] === 'category') {
          const category = await storage.getCategoryBySlug(segments[2]);
          if (category) {
            const articles = await storage.getArticlesByCategory(category.id);
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify(articles)
            };
          } else {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Category not found' })
            };
          }
        }
      }
      
      // Handle /api/testimonials
      if (segments[0] === 'testimonials') {
        const testimonials = await storage.getTestimonials();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(testimonials)
        };
      }
      
      // Handle search
      if (segments[0] === 'search' && event.queryStringParameters?.q) {
        const results = await storage.search(event.queryStringParameters.q);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(results)
        };
      }
    }
    
    // Handle POST requests
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      
      // Handle /api/subscribers
      if (segments[0] === 'subscribers') {
        const subscriber = await storage.createSubscriber(data);
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(subscriber)
        };
      }
      
      // Handle /api/contact
      if (segments[0] === 'contact') {
        const contact = await storage.createContact(data);
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(contact)
        };
      }
    }
    
    // If we get here, return 404
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found', path: path })
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