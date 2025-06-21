import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { EpicGardeningScraper } from "./scraper";
import { EpicGardeningScraperV2 } from "./epic-scraper-v2";
import { importEpicGardeningContent } from "./import-epic-content";
import { ComprehensiveEpicScraper } from "./comprehensive-epic-scraper";
import { AggressiveEpicScraper } from "./aggressive-epic-scraper";
import { completeEpicGardeningImport } from "./complete-epic-import";
import { manualEpicGardeningImport } from "./manual-epic-import";

import {
  insertUserSchema,
  insertCategorySchema,
  insertProductSchema,
  insertBlogPostSchema,
  insertCommentSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertTestimonialSchema,
  insertCartItemSchema
} from "@shared/schema";

// Simple in-memory session store (in production, use Redis or database)
const sessions = new Map<string, any>();

function createSession(user: any): string {
  const sessionId = nanoid();
  sessions.set(sessionId, user);
  return sessionId;
}

function getSessionUser(sessionId: string): any {
  return sessions.get(sessionId);
}

function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to handle validation errors
  const validateRequest = (schema: any, data: any) => {
    try {
      return { data: schema.parse(data), error: null };
    } catch (error) {
      if (error instanceof ZodError) {
        return { data: null, error: fromZodError(error).message };
      }
      return { data: null, error: "Invalid data provided" };
    }
  };

  // ===== User Routes =====
  app.post("/api/users/register", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertUserSchema, req.body);
    if (error) return res.status(400).json({ error });

    // Check if username or email already exists
    const existingByUsername = await storage.getUserByUsername(data.username);
    if (existingByUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const existingByEmail = await storage.getUserByEmail(data.email);
    if (existingByEmail) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = await storage.createUser(data);
    
    // Create session
    const sessionId = createSession(user);
    
    // Set session cookie
    res.cookie("sessionId", sessionId, { 
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  });

  app.post("/api/users/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    console.log('Login attempt:', { username, password });
    
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await storage.getUserByUsername(username);
    console.log('Found user:', user ? { id: user.id, username: user.username } : 'null');
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: "Invalid username or password" });
    }
    
    if (user.password !== password) {
      console.log('Password mismatch:', { provided: password, expected: user.password });
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Create session
    const sessionId = createSession(user);
    console.log('Created session:', sessionId);
    
    // Set session cookie
    res.cookie("sessionId", sessionId, { 
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Return user info without password
    const { password: _, ...userWithoutPassword } = user;
    console.log('Login successful for user:', userWithoutPassword);
    res.json(userWithoutPassword);
  });

  app.post("/api/users/logout", async (req: Request, res: Response) => {
    const sessionId = req.cookies?.sessionId;
    if (sessionId) {
      deleteSession(sessionId);
      res.clearCookie("sessionId");
    }
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/users/me", async (req: Request, res: Response) => {
    // Get session ID from cookies
    const sessionId = req.cookies?.sessionId;
    if (!sessionId) {
      return res.json(null);
    }

    // In a real app, you would store sessions in a database
    // For demo purposes, we'll use a simple in-memory store
    const user = getSessionUser(sessionId);
    if (!user) {
      return res.json(null);
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // ===== Category Routes =====
  app.get("/api/categories", async (_req: Request, res: Response) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const category = await storage.getCategory(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  });

  app.get("/api/categories/slug/:slug", async (req: Request, res: Response) => {
    const category = await storage.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  });

  app.post("/api/categories", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertCategorySchema, req.body);
    if (error) return res.status(400).json({ error });

    const category = await storage.createCategory(data);
    res.status(201).json(category);
  });

  app.put("/api/categories/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const { data, error } = validateRequest(insertCategorySchema, req.body);
    if (error) return res.status(400).json({ error });

    const updatedCategory = await storage.updateCategory(id, data);
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(updatedCategory);
  });

  app.delete("/api/categories/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const deleted = await storage.deleteCategory(id);
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(204).end();
  });

  // ===== Product Routes =====
  app.get("/api/products", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    
    const products = await storage.getProducts(limit, offset);
    res.json(products);
  });

  app.get("/api/products/featured", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const featuredProducts = await storage.getFeaturedProducts(limit);
    res.json(featuredProducts);
  });

  app.get("/api/products/category/:categoryId", async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.categoryId);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const products = await storage.getProductsByCategory(categoryId);
    res.json(products);
  });

  app.get("/api/products/search", async (req: Request, res: Response) => {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const products = await storage.searchProducts(query);
    res.json(products);
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await storage.getProduct(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  });

  app.get("/api/products/slug/:slug", async (req: Request, res: Response) => {
    const product = await storage.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertProductSchema, req.body);
    if (error) return res.status(400).json({ error });

    const product = await storage.createProduct(data);
    res.status(201).json(product);
  });

  app.put("/api/products/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const { data, error } = validateRequest(insertProductSchema, req.body);
    if (error) return res.status(400).json({ error });

    const updatedProduct = await storage.updateProduct(id, data);
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  });

  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const deleted = await storage.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(204).end();
  });

  // ===== Blog Routes =====
  app.get("/api/blog", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const publishedOnly = req.query.publishedOnly !== "false"; // Default to true
    
    const posts = await storage.getBlogPosts(limit, offset, publishedOnly);
    res.json(posts);
  });

  app.get("/api/blog/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid blog post ID" });
    }

    const post = await storage.getBlogPost(id);
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.json(post);
  });

  app.get("/api/blog/slug/:slug", async (req: Request, res: Response) => {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.json(post);
  });

  app.post("/api/blog", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertBlogPostSchema, req.body);
    if (error) return res.status(400).json({ error });

    const post = await storage.createBlogPost(data);
    res.status(201).json(post);
  });

  app.put("/api/blog/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid blog post ID" });
    }

    const { data, error } = validateRequest(insertBlogPostSchema, req.body);
    if (error) return res.status(400).json({ error });

    const updatedPost = await storage.updateBlogPost(id, data);
    if (!updatedPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.json(updatedPost);
  });

  app.delete("/api/blog/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid blog post ID" });
    }

    const deleted = await storage.deleteBlogPost(id);
    if (!deleted) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.status(204).end();
  });

  // ===== Comment Routes =====
  app.get("/api/blog/:blogId/comments", async (req: Request, res: Response) => {
    const blogId = parseInt(req.params.blogId);
    if (isNaN(blogId)) {
      return res.status(400).json({ error: "Invalid blog post ID" });
    }

    const comments = await storage.getCommentsByBlogPost(blogId);
    res.json(comments);
  });

  app.post("/api/comments", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertCommentSchema, req.body);
    if (error) return res.status(400).json({ error });

    const comment = await storage.createComment(data);
    res.status(201).json(comment);
  });

  app.delete("/api/comments/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const deleted = await storage.deleteComment(id);
    if (!deleted) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(204).end();
  });

  // ===== Order Routes =====
  app.get("/api/orders", async (req: Request, res: Response) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.get("/api/users/:userId/orders", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const orders = await storage.getOrdersByUser(userId);
    res.json(orders);
  });

  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const order = await storage.getOrder(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Get order items
    const items = await storage.getOrderItems(id);
    
    // Return order with items
    res.json({ ...order, items });
  });

  app.post("/api/orders", async (req: Request, res: Response) => {
    const { order, items } = req.body;
    
    // Validate order
    const orderValidation = validateRequest(insertOrderSchema, order);
    if (orderValidation.error) {
      return res.status(400).json({ error: orderValidation.error });
    }
    
    // Create order
    const newOrder = await storage.createOrder(orderValidation.data);
    
    // Add order items
    const orderItems = [];
    if (Array.isArray(items)) {
      for (const item of items) {
        // Add orderId to each item
        const itemWithOrderId = { ...item, orderId: newOrder.id };
        
        // Validate item
        const itemValidation = validateRequest(insertOrderItemSchema, itemWithOrderId);
        if (itemValidation.error) {
          return res.status(400).json({ error: `Invalid order item: ${itemValidation.error}` });
        }
        
        // Create order item
        const newItem = await storage.createOrderItem(itemValidation.data);
        orderItems.push(newItem);
      }
    }
    
    res.status(201).json({ ...newOrder, items: orderItems });
  });

  app.patch("/api/orders/:id/status", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const updatedOrder = await storage.updateOrderStatus(id, status);
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  });

  // ===== Testimonial Routes =====
  app.get("/api/testimonials", async (req: Request, res: Response) => {
    const approvedOnly = req.query.approvedOnly !== "false"; // Default to true
    const testimonials = await storage.getTestimonials(approvedOnly);
    res.json(testimonials);
  });

  app.post("/api/testimonials", async (req: Request, res: Response) => {
    const { data, error } = validateRequest(insertTestimonialSchema, req.body);
    if (error) return res.status(400).json({ error });

    const testimonial = await storage.createTestimonial(data);
    res.status(201).json(testimonial);
  });

  app.patch("/api/testimonials/:id/approve", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid testimonial ID" });
    }

    const approvedTestimonial = await storage.approveTestimonial(id);
    if (!approvedTestimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.json(approvedTestimonial);
  });

  app.delete("/api/testimonials/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid testimonial ID" });
    }

    const deleted = await storage.deleteTestimonial(id);
    if (!deleted) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.status(204).end();
  });

  // ===== Cart Routes =====
  app.get("/api/cart", async (req: Request, res: Response) => {
    // Get or create session ID from cookies
    let sessionId = req.cookies?.cartSessionId;
    if (!sessionId) {
      sessionId = nanoid();
      res.cookie("cartSessionId", sessionId, { 
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
    }

    const cartItems = await storage.getCartItems(sessionId);
    
    // Get product details for each cart item
    const itemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await storage.getProduct(item.productId);
        return {
          ...item,
          product
        };
      })
    );
    
    res.json(itemsWithProducts);
  });

  app.post("/api/cart", async (req: Request, res: Response) => {
    // Get or create session ID from cookies
    let sessionId = req.cookies?.cartSessionId;
    if (!sessionId) {
      sessionId = nanoid();
      res.cookie("cartSessionId", sessionId, { 
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
    }

    // Add session ID to cart item
    const cartItemData = { ...req.body, sessionId };
    
    const { data, error } = validateRequest(insertCartItemSchema, cartItemData);
    if (error) return res.status(400).json({ error });

    const cartItem = await storage.addCartItem(data);
    
    // Get product details
    const product = await storage.getProduct(cartItem.productId);
    
    res.status(201).json({
      ...cartItem,
      product
    });
  });

  app.patch("/api/cart/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid cart item ID" });
    }

    const { quantity } = req.body;
    if (typeof quantity !== "number" || quantity < 0) {
      return res.status(400).json({ error: "Valid quantity is required" });
    }

    const updatedItem = await storage.updateCartItemQuantity(id, quantity);
    if (!updatedItem) {
      if (quantity === 0) {
        return res.status(204).end(); // Item was successfully removed
      }
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Get product details
    const product = await storage.getProduct(updatedItem.productId);
    
    res.json({
      ...updatedItem,
      product
    });
  });

  app.delete("/api/cart/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid cart item ID" });
    }

    const deleted = await storage.removeCartItem(id);
    if (!deleted) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.status(204).end();
  });

  app.delete("/api/cart", async (req: Request, res: Response) => {
    const sessionId = req.cookies?.cartSessionId;
    if (!sessionId) {
      return res.status(400).json({ error: "No cart session found" });
    }

    await storage.clearCart(sessionId);
    res.status(204).end();
  });

  // Epic Gardening scraper endpoint
  app.post("/api/scrape/epic-gardening", async (req: Request, res: Response) => {
    try {
      res.json({ message: "Scraping started in background", status: "initiated" });
      
      // Run scraping in background
      const scraper = new EpicGardeningScraper();
      scraper.scrapeAndImport().catch(error => {
        console.error("Background scraping failed:", error);
      });
      
    } catch (error) {
      console.error("Failed to start scraping:", error);
      res.status(500).json({ error: "Failed to start scraping process" });
    }
  });

  // Improved Epic Gardening scraper endpoint
  app.post("/api/scrape/epic-gardening-v2", async (req: Request, res: Response) => {
    try {
      res.json({ message: "Enhanced Epic Gardening import started", status: "initiated" });
      
      // Run improved scraping in background
      const scraperV2 = new EpicGardeningScraperV2();
      scraperV2.fullImport().catch(error => {
        console.error("Enhanced scraping failed:", error);
      });
      
    } catch (error) {
      console.error("Failed to start enhanced scraping:", error);
      res.status(500).json({ error: "Failed to start enhanced scraping process" });
    }
  });

  // Direct Epic Gardening content import
  app.post("/api/import/epic-content", async (req: Request, res: Response) => {
    try {
      const result = await importEpicGardeningContent();
      res.json({ 
        message: "Epic Gardening content imported successfully", 
        status: "completed",
        imported: result
      });
    } catch (error) {
      console.error("Failed to import Epic content:", error);
      res.status(500).json({ error: "Failed to import Epic Gardening content" });
    }
  });

  // Comprehensive Epic Gardening scraper
  app.post("/api/scrape/comprehensive-epic", async (req: Request, res: Response) => {
    try {
      res.json({ message: "Comprehensive Epic Gardening scraping started", status: "initiated" });
      
      // Run comprehensive scraping in background
      const comprehensiveScraper = new ComprehensiveEpicScraper();
      comprehensiveScraper.fullScrapeAndImport().catch(error => {
        console.error("Comprehensive scraping failed:", error);
      });
      
    } catch (error) {
      console.error("Failed to start comprehensive scraping:", error);
      res.status(500).json({ error: "Failed to start comprehensive scraping" });
    }
  });

  // Aggressive Epic Gardening content cloner
  app.post("/api/clone/epic-complete", async (req: Request, res: Response) => {
    try {
      res.json({ message: "Complete Epic Gardening clone initiated", status: "started" });
      
      // Run aggressive cloning in background
      const aggressiveScraper = new AggressiveEpicScraper();
      aggressiveScraper.fullContentClone().catch(error => {
        console.error("Aggressive cloning failed:", error);
      });
      
    } catch (error) {
      console.error("Failed to start aggressive cloning:", error);
      res.status(500).json({ error: "Failed to start complete cloning" });
    }
  });

  // Complete Epic Gardening import
  app.post("/api/import/complete-epic", async (req: Request, res: Response) => {
    try {
      const result = await completeEpicGardeningImport();
      res.json(result);
    } catch (error) {
      console.error("Failed to complete Epic import:", error);
      res.status(500).json({ error: "Failed to complete Epic Gardening import" });
    }
  });

  // Manual Epic Gardening import
  app.post("/api/import/manual-epic", async (req: Request, res: Response) => {
    try {
      const result = await manualEpicGardeningImport();
      res.json(result);
    } catch (error) {
      console.error("Failed to manual Epic import:", error);
      res.status(500).json({ error: "Failed to manual Epic Gardening import" });
    }
  });

  // Get scraping status (simple implementation)
  let scrapingStatus = { isRunning: false, lastRun: null, itemsImported: 0 };
  
  app.get("/api/scrape/status", async (req: Request, res: Response) => {
    res.json(scrapingStatus);
  });

  // Create the server
  const httpServer = createServer(app);
  return httpServer;
}
