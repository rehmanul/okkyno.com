import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactSchema, insertSubscriberSchema } from "@shared/schema";
import { z } from "zod";
// Stripe import is commented out until keys are provided
// import Stripe from "stripe";

// This is a placeholder for Stripe setup
// const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
// let stripe: Stripe | undefined;

// if (stripeSecretKey) {
//   stripe = new Stripe(stripeSecretKey, {
//     apiVersion: "2023-10-16",
//   });
// }

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories API
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch categories" 
      });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ 
          success: false, 
          message: "Category not found" 
        });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch category" 
      });
    }
  });

  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch products" 
      });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const product = await storage.getProductBySlug(slug);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: "Product not found" 
        });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch product" 
      });
    }
  });
  
  app.get("/api/products/:productId/images", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      
      if (isNaN(productId)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid product ID" 
        });
      }
      
      const productImages = await storage.getProductImages(productId);
      res.json(productImages);
    } catch (error) {
      console.error("Error fetching product images:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch product images" 
      });
    }
  });

  app.get("/api/categories/:categoryId/products", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      
      if (isNaN(categoryId)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid category ID" 
        });
      }
      
      const products = await storage.getProductsByCategory(categoryId);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch products" 
      });
    }
  });

  // Articles API
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch articles" 
      });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ 
          success: false, 
          message: "Article not found" 
        });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch article" 
      });
    }
  });

  app.get("/api/categories/:categoryId/articles", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      
      if (isNaN(categoryId)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid category ID" 
        });
      }
      
      const articles = await storage.getArticlesByCategory(categoryId);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles by category:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch articles" 
      });
    }
  });

  // Testimonials API
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch testimonials" 
      });
    }
  });

  // Search API
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ 
          success: false, 
          message: "Search query is required" 
        });
      }
      
      const results = await storage.search(query);
      res.json(results);
    } catch (error) {
      console.error("Error performing search:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to perform search" 
      });
    }
  });

  // Newsletter subscription
  app.post("/api/subscribe", async (req, res) => {
    try {
      const data = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.createSubscriber(data);
      
      res.status(201).json({ 
        success: true, 
        message: "Successfully subscribed to newsletter",
        data: subscriber
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating subscriber:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to subscribe to newsletter" 
        });
      }
    }
  });

  // Contact API
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = contactSchema.parse(req.body);
      const savedContact = await storage.createContact(contactData);
      res.status(201).json({ 
        success: true, 
        message: "Contact message received",
        data: savedContact
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        console.error("Error saving contact message:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to save contact message" 
        });
      }
    }
  });

  // Payment processing API - Placeholder for Stripe integration
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      // Normally, this would create a payment intent with Stripe
      // if (!stripe) {
      //   return res.status(500).json({
      //     success: false,
      //     message: "Stripe API key not configured"
      //   });
      // }
      
      // const { amount } = req.body;
      // const paymentIntent = await stripe.paymentIntents.create({
      //   amount: Math.round(amount * 100), // Convert dollars to cents
      //   currency: "usd",
      // });
      
      // Instead of real Stripe integration, return a mock client secret
      // This is for demonstration purposes only
      res.json({
        success: true,
        message: "This is a placeholder for Stripe integration. See README for setup instructions.",
        clientSecret: "mock_client_secret_" + Date.now(),
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create payment intent: " + error.message,
      });
    }
  });
  
  // Order processing API
  app.post("/api/orders", async (req, res) => {
    try {
      // This would normally create an order in the database
      // For now, just return success
      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      });
    } catch (error: any) {
      console.error("Error creating order:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create order: " + error.message,
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
