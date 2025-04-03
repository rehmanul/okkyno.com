import {
  users, categories, products, articles, testimonials, subscribers,
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type Article, type InsertArticle,
  type Testimonial, type InsertTestimonial,
  type Subscriber, type InsertSubscriber
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Article methods
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticlesByCategory(categoryId: number): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  
  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Subscriber methods
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  
  // Search method
  search(query: string): Promise<{
    products: Product[];
    articles: Article[];
    categories: Category[];
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private articles: Map<number, Article>;
  private testimonials: Map<number, Testimonial>;
  private subscribers: Map<number, Subscriber>;
  
  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentArticleId: number;
  private currentTestimonialId: number;
  private currentSubscriberId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.articles = new Map();
    this.testimonials = new Map();
    this.subscribers = new Map();
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentArticleId = 1;
    this.currentTestimonialId = 1;
    this.currentSubscriberId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug,
    );
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId,
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
  
  // Article methods
  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values());
  }
  
  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }
  
  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(
      (article) => article.slug === slug,
    );
  }
  
  async getArticlesByCategory(categoryId: number): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(
      (article) => article.categoryId === categoryId,
    );
  }
  
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const article: Article = { ...insertArticle, id };
    this.articles.set(id, article);
    return article;
  }
  
  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  // Subscriber methods
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    // Check if email already exists
    const existingSubscriber = Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email === insertSubscriber.email,
    );
    
    if (existingSubscriber) {
      return existingSubscriber;
    }
    
    const id = this.currentSubscriberId++;
    const subscriber: Subscriber = { 
      ...insertSubscriber, 
      id, 
      dateSubscribed: new Date() 
    };
    
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
  
  // Search method
  async search(query: string): Promise<{
    products: Product[];
    articles: Article[];
    categories: Category[];
  }> {
    const lowercaseQuery = query.toLowerCase();
    
    const matchedProducts = Array.from(this.products.values()).filter(
      (product) => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        (product.description && product.description.toLowerCase().includes(lowercaseQuery))
    );
    
    const matchedArticles = Array.from(this.articles.values()).filter(
      (article) => 
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(lowercaseQuery))
    );
    
    const matchedCategories = Array.from(this.categories.values()).filter(
      (category) => 
        category.name.toLowerCase().includes(lowercaseQuery) ||
        (category.description && category.description.toLowerCase().includes(lowercaseQuery))
    );
    
    return {
      products: matchedProducts,
      articles: matchedArticles,
      categories: matchedCategories,
    };
  }
  
  // Initialize with sample data
  private initializeSampleData() {
    // Sample categories
    const categories: InsertCategory[] = [
      {
        name: "Vegetables",
        slug: "vegetables",
        description: "All types of vegetable plants for your garden",
        imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      },
      {
        name: "Herbs",
        slug: "herbs",
        description: "Culinary and medicinal herbs for your garden",
        imageUrl: "https://images.unsplash.com/photo-1515586000433-45406d8e6662?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      },
      {
        name: "Flowers",
        slug: "flowers",
        description: "Beautiful flowering plants to brighten your garden",
        imageUrl: "https://images.unsplash.com/photo-1618572196882-a79c9e1723ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      },
      {
        name: "Indoor Plants",
        slug: "indoor-plants",
        description: "Plants that thrive indoors",
        imageUrl: "https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      },
      {
        name: "Hand Tools",
        slug: "hand-tools",
        description: "Essential hand tools for gardening",
        imageUrl: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      },
      {
        name: "Power Tools",
        slug: "power-tools",
        description: "Power tools to make gardening easier",
        imageUrl: "https://images.unsplash.com/photo-1620372587831-566bc5adf72a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      },
    ];
    
    // Create categories
    categories.forEach(category => {
      this.createCategory(category);
    });
    
    // Sample products
    const products: InsertProduct[] = [
      {
        name: "Garden Pruning Shears",
        slug: "garden-pruning-shears",
        description: "Professional stainless steel garden pruners with ergonomic handles for clean cuts and comfortable use.",
        shortDescription: "Professional stainless steel garden pruners for clean cuts",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        isBestSeller: true,
        categoryId: 5,
      },
      {
        name: "Garden Trowel Set",
        slug: "garden-trowel-set",
        description: "3-piece ergonomic gardening tools with comfort grip handles.",
        shortDescription: "3-piece ergonomic gardening tools with comfort grip",
        price: 32.99,
        imageUrl: "https://images.unsplash.com/photo-1620372587831-566bc5adf72a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: 5,
      },
      {
        name: "Herb Garden Kit",
        slug: "herb-garden-kit",
        description: "Complete starter kit with seeds, soil, and containers for growing your own herbs.",
        shortDescription: "Complete starter kit with seeds, soil, and containers",
        price: 39.99,
        imageUrl: "https://images.unsplash.com/photo-1484507175567-a114f764f78b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        isNew: true,
        categoryId: 2,
      },
      {
        name: "Garden Hose Nozzle",
        slug: "garden-hose-nozzle",
        description: "10-pattern spray nozzle for all watering needs.",
        shortDescription: "10-pattern spray nozzle for all watering needs",
        price: 18.99,
        imageUrl: "https://images.unsplash.com/photo-1559896276-5e439a3b2be8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: 5,
      },
      {
        name: "Tomato Growing Kit",
        slug: "tomato-growing-kit",
        description: "Everything you need to grow delicious homegrown tomatoes.",
        shortDescription: "Complete kit for growing delicious homegrown tomatoes",
        price: 29.99,
        imageUrl: "https://images.unsplash.com/photo-1601383342548-c8915c91c4d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        isBestSeller: true,
        categoryId: 1,
      },
      {
        name: "Indoor Herb Garden",
        slug: "indoor-herb-garden",
        description: "Self-watering indoor herb garden with built-in LED grow lights.",
        shortDescription: "Self-watering indoor herb garden with LED grow lights",
        price: 54.99,
        imageUrl: "https://images.unsplash.com/photo-1567945394489-ce351c44ea60?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        isNew: true,
        categoryId: 2,
      },
      {
        name: "Gardening Gloves",
        slug: "gardening-gloves",
        description: "Durable and flexible gardening gloves with breathable fabric.",
        shortDescription: "Durable and flexible gardening gloves with reinforced fingertips",
        price: 15.99,
        imageUrl: "https://images.unsplash.com/photo-1588159832482-35a52294cbc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: 5,
      },
      {
        name: "Plant Support Cages",
        slug: "plant-support-cages",
        description: "Set of 3 durable, reusable support cages for tomatoes and other climbing plants.",
        shortDescription: "Durable plant support cages for tomatoes and climbing plants",
        price: 22.99,
        imageUrl: "https://images.unsplash.com/photo-1557429287-b2e26467fc2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: 5,
      },
      {
        name: "Soil Test Kit",
        slug: "soil-test-kit",
        description: "Professional-grade soil test kit measures pH and nutrient levels.",
        shortDescription: "Professional-grade soil test kit for optimal plant growth",
        price: 19.99,
        imageUrl: "https://images.unsplash.com/photo-1566820582589-9e3e2527e641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        isBestSeller: true,
        categoryId: 5,
      },
      {
        name: "Premium Potting Soil",
        slug: "premium-potting-soil",
        description: "Organic, nutrient-rich potting mix formulated for container plants.",
        shortDescription: "Nutrient-rich organic potting mix with slow-release fertilizer",
        price: 12.99,
        imageUrl: "https://images.unsplash.com/photo-1561356802-3b9cd2189609?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: 5,
      },
      {
        name: "Succulent Collection",
        slug: "succulent-collection",
        description: "Set of 6 unique, hardy succulents in small pots.",
        shortDescription: "Collection of 6 unique, hardy succulents in small pots",
        price: 34.99,
        imageUrl: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        categoryId: 4,
      },
      {
        name: "Raised Garden Bed",
        slug: "raised-garden-bed",
        description: "Cedar raised garden bed kit, easy to assemble.",
        shortDescription: "Cedar raised garden bed kit with easy assembly",
        price: 89.99,
        imageUrl: "https://images.unsplash.com/photo-1621954555476-30143ce18e6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        isNew: true,
        categoryId: 5,
      },
    ];
    
    // Create products
    products.forEach(product => {
      this.createProduct(product);
    });
    
    // Sample articles
    const articles: InsertArticle[] = [
      {
        title: "10 Vegetable Garden Basics for Beginners",
        slug: "vegetable-garden-basics-for-beginners",
        content: `<p>Starting your first vegetable garden can be both exciting and intimidating. Here are the essential steps to help you grow your own food successfully:</p>
        <h2>1. Choose the Right Location</h2>
        <p>Most vegetables need at least 6-8 hours of direct sunlight daily. Choose a spot with good sun exposure, away from trees and buildings that might cast shadows.</p>
        <h2>2. Start with Good Soil</h2>
        <p>Vegetables thrive in rich, well-draining soil. Test your soil and amend it with compost to improve its structure and nutrient content.</p>
        <h2>3. Plan Your Garden Layout</h2>
        <p>Consider the space requirements of different vegetables and plan accordingly. Taller plants should be planted on the north side to avoid shading smaller plants.</p>
        <h2>4. Choose Easy Vegetables for Beginners</h2>
        <p>Start with easy-to-grow vegetables like lettuce, tomatoes, cucumbers, and zucchini. These plants are relatively forgiving and produce abundantly.</p>
        <h2>5. Water Properly</h2>
        <p>Most vegetables need about 1-1.5 inches of water per week. Water deeply but infrequently to encourage deep root growth.</p>
        <h2>6. Mulch Your Garden</h2>
        <p>Apply a layer of mulch around your plants to conserve moisture, suppress weeds, and regulate soil temperature.</p>
        <h2>7. Fertilize as Needed</h2>
        <p>Use a balanced organic fertilizer to provide essential nutrients to your plants. Follow package instructions for application rates.</p>
        <h2>8. Stay on Top of Weeds</h2>
        <p>Regular weeding is essential to prevent competition for nutrients and water. Pull weeds when they're small and easier to remove.</p>
        <h2>9. Monitor for Pests and Diseases</h2>
        <p>Check your plants regularly for signs of pests or diseases. Early detection allows for more effective and less invasive intervention.</p>
        <h2>10. Harvest at the Right Time</h2>
        <p>Learn the optimal harvesting time for each vegetable. Regular harvesting encourages plants to produce more.</p>
        <p>Remember, gardening is a learning experience. Don't be discouraged by setbacks – each season brings new knowledge and better results!</p>`,
        excerpt: "Learn the essential steps to start your first vegetable garden and grow your own food successfully.",
        imageUrl: "https://images.unsplash.com/photo-1599076996832-12fe9f2d3690?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        datePublished: new Date("2023-05-12"),
        categoryId: 1,
      },
      {
        title: "Growing a Culinary Herb Garden at Home",
        slug: "growing-culinary-herb-garden-at-home",
        content: `<p>Fresh herbs can transform ordinary dishes into extraordinary culinary experiences. Growing your own herb garden at home is not only rewarding but also practical and cost-effective.</p>
        <h2>Benefits of Growing Your Own Herbs</h2>
        <p>Having fresh herbs at your fingertips means better-tasting food, significant savings compared to store-bought herbs, and the satisfaction of growing something yourself.</p>
        <h2>Best Herbs for Beginners</h2>
        <p>Start with these easy-to-grow herbs:</p>
        <ul>
          <li><strong>Basil:</strong> Perfect for Italian dishes, pesto, and salads</li>
          <li><strong>Parsley:</strong> A versatile herb that complements many dishes</li>
          <li><strong>Mint:</strong> Great for teas, cocktails, and desserts</li>
          <li><strong>Rosemary:</strong> Adds flavor to meats and roasted vegetables</li>
          <li><strong>Thyme:</strong> Works well in soups, stews, and with roasted meats</li>
          <li><strong>Chives:</strong> Adds a mild onion flavor to dishes</li>
        </ul>
        <h2>Indoor vs. Outdoor Herb Gardens</h2>
        <p>Herbs can be grown both indoors and outdoors. Indoor herb gardens are convenient for year-round access and protection from extreme weather, while outdoor gardens often yield more abundant growth due to natural sunlight.</p>
        <h2>Essential Growing Conditions</h2>
        <p>Most herbs need:</p>
        <ul>
          <li>6+ hours of sunlight daily (or grow lights for indoor gardens)</li>
          <li>Well-draining soil</li>
          <li>Regular watering (but not overwatering)</li>
          <li>Adequate air circulation</li>
        </ul>
        <h2>Container Selection</h2>
        <p>Choose containers with drainage holes to prevent root rot. Terra cotta pots are excellent for herbs as they allow soil to breathe.</p>
        <h2>Harvesting and Using Your Herbs</h2>
        <p>Harvest herbs in the morning when their essential oils are most concentrated. Regular harvesting encourages bushier growth. Use fresh herbs immediately or store them properly for later use.</p>
        <p>With minimal space and effort, you can enjoy the pleasure of growing and using your own fresh herbs all year round!</p>`,
        excerpt: "Discover the joy of growing fresh herbs for cooking and learn which varieties are easiest to grow indoors.",
        imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        datePublished: new Date("2023-05-08"),
        categoryId: 2,
      },
      {
        title: "Essential Garden Tools Every Gardener Needs",
        slug: "essential-garden-tools-every-gardener-needs",
        content: `<p>Having the right tools makes gardening more efficient and enjoyable. Whether you're a beginner or an experienced gardener, these essential tools will help you maintain a beautiful and productive garden.</p>
        <h2>Hand Tools</h2>
        <h3>1. Hand Trowel</h3>
        <p>This small, handheld shovel is perfect for digging planting holes, transplanting seedlings, and removing weeds. Look for one with a comfortable grip and durable, rust-resistant blade.</p>
        <h3>2. Pruning Shears</h3>
        <p>Essential for trimming and shaping plants, deadheading flowers, and harvesting produce. Choose bypass pruners for clean cuts on living plants.</p>
        <h3>3. Garden Fork</h3>
        <p>Ideal for turning soil, lifting plants, and incorporating compost. The tines break up compacted soil more effectively than a shovel.</p>
        <h3>4. Hand Cultivator</h3>
        <p>This claw-like tool is perfect for loosening soil, removing weeds, and mixing in amendments around established plants.</p>
        <h2>Long-Handled Tools</h2>
        <h3>5. Spade</h3>
        <p>With its flat, straight blade, a spade is perfect for edging, digging trenches, and dividing perennials.</p>
        <h3>6. Garden Rake</h3>
        <p>Use a bow rake to level soil, remove rocks, and spread mulch. A leaf rake is essential for autumn clean-up.</p>
        <h3>7. Hoe</h3>
        <p>Great for preparing seed beds, cultivating soil, and removing small weeds. Various shapes are available for different purposes.</p>
        <h2>Watering Equipment</h2>
        <h3>8. Watering Can</h3>
        <p>Choose one with a sprinkler spout for gentle watering of seedlings and delicate plants.</p>
        <h3>9. Garden Hose with Adjustable Nozzle</h3>
        <p>Look for a quality hose with a multi-pattern nozzle to customize watering for different plants and garden areas.</p>
        <h2>Protective Gear</h2>
        <h3>10. Gardening Gloves</h3>
        <p>Protect your hands from thorns, splinters, and soil. Choose waterproof gloves for wet work and breathable cotton for dry tasks.</p>
        <p>Investing in quality tools will save you time and effort in the long run. Proper cleaning and storage after use will extend their life and keep them functioning efficiently for years to come.</p>`,
        excerpt: "A comprehensive guide to the must-have tools that will make your gardening tasks easier and more efficient.",
        imageUrl: "https://images.unsplash.com/photo-1599685315640-8ed2e0c57c25?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        datePublished: new Date("2023-05-03"),
        categoryId: 5,
      },
    ];
    
    // Create articles
    articles.forEach(article => {
      this.createArticle(article);
    });
    
    // Sample testimonials
    const testimonials: InsertTestimonial[] = [
      {
        personName: "Sarah L.",
        role: "Home Gardener",
        avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
        content: "Epic Gardening has transformed my backyard! Their step-by-step guides made it easy to grow my own vegetables, even as a complete beginner. Now I have fresh produce all summer long!",
        rating: 5,
      },
      {
        personName: "Michael T.",
        role: "Urban Gardener",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        content: "The gardening tools I purchased from Epic Gardening are top-quality and made my garden work so much easier. Their customer service was excellent when I had questions about which products to choose.",
        rating: 5,
      },
      {
        personName: "Jennifer P.",
        role: "Herb Enthusiast",
        avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
        content: "I've been following Epic Gardening's blog for years and it's been invaluable for my herb garden. Their pest control tips saved my basil from aphids last season, and now I have a thriving herb collection!",
        rating: 4,
      },
    ];
    
    // Create testimonials
    testimonials.forEach(testimonial => {
      this.createTestimonial(testimonial);
    });
  }
}

export const storage = new MemStorage();
