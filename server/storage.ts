
import {
  User, InsertUser,
  Category, InsertCategory,
  Product, InsertProduct,
  BlogPost, InsertBlogPost,
  Comment, InsertComment,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  Testimonial, InsertTestimonial,
  CartItem, InsertCartItem
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<Category>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Product operations
  getProducts(limit?: number, offset?: number): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Blog operations
  getBlogPosts(limit?: number, offset?: number, publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Comment operations
  getCommentsByBlogPost(blogPostId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: number): Promise<boolean>;

  // Order operations
  getOrders(): Promise<Order[]>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Order item operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Testimonial operations
  getTestimonials(approvedOnly?: boolean): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  approveTestimonial(id: number): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;

  // Cart operations
  getCartItems(sessionId: string): Promise<CartItem[]>;
  getCartItem(sessionId: string, productId: number): Promise<CartItem | undefined>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private blogPosts: Map<number, BlogPost>;
  private comments: Map<number, Comment>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private testimonials: Map<number, Testimonial>;
  private cartItems: Map<number, CartItem>;

  private userIdCounter: number;
  private categoryIdCounter: number;
  private productIdCounter: number;
  private blogPostIdCounter: number;
  private commentIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private testimonialIdCounter: number;
  private cartItemIdCounter: number;

  private sampleCategories: InsertCategory[] = [
    { name: "Vegetables", slug: "vegetables", description: "Fresh vegetables for your garden", imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80" },
    { name: "Indoor Plants", slug: "indoor-plants", description: "Beautiful plants for your home", imageUrl: "https://images.unsplash.com/photo-1586093021710-3c5dd9bd1e06?w=800&auto=format&fit=crop&q=80" },
    { name: "Garden Tools", slug: "garden-tools", description: "Quality tools for gardening", imageUrl: "https://images.unsplash.com/photo-1589111118344-fe616859d7a7?w=800&auto=format&fit=crop&q=80" },
    { name: "Hand Tools", slug: "hand-tools", description: "Essential hand tools for gardening", imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80" },
    { name: "Power Tools", slug: "power-tools", description: "Electric and battery-powered garden tools", imageUrl: "https://images.unsplash.com/photo-1558618666-5a006db2c7ad?w=800&auto=format&fit=crop&q=80" },
    { name: "Watering", slug: "watering", description: "Watering systems and irrigation tools", imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80" },
    { name: "Pruning", slug: "pruning", description: "Pruning and cutting tools", imageUrl: "https://images.unsplash.com/photo-1615232428120-9aa7ce2ab176?w=800&auto=format&fit=crop&q=80" },
    { name: "Flowers", slug: "flowers", description: "Colorful flowers for your garden", imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop&q=80" },
    { name: "Pots & Planters", slug: "pots-planters", description: "Decorative pots for your plants", imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80" },
    { name: "Seeds", slug: "seeds", description: "High-quality seeds for planting", imageUrl: "https://images.unsplash.com/photo-1597254563670-2df0f6b27a5e?w=800&auto=format&fit=crop&q=80" },
    { name: "Herbs", slug: "herbs", description: "Fresh herbs for cooking and wellness", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80" },
    { name: "Succulents", slug: "succulents", description: "Low-maintenance succulent plants", imageUrl: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80" },
    { name: "Fruit Trees", slug: "fruit-trees", description: "Fruit-bearing trees for your garden", imageUrl: "https://images.unsplash.com/photo-1572915904405-c13b2eecfac7?w=800&auto=format&fit=crop&q=80" },
    { name: "Organic Fertilizers", slug: "organic-fertilizers", description: "Natural fertilizers for healthy plants", imageUrl: "https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800&auto=format&fit=crop&q=80" },
    { name: "Soil & Fertilizers", slug: "soil-fertilizers", description: "Premium soil and fertilizers", imageUrl: "https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800&auto=format&fit=crop&q=80" },
    { name: "Accessories", slug: "accessories", description: "Garden accessories and supplies", imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80" }
  ];

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.blogPosts = new Map();
    this.comments = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.testimonials = new Map();
    this.cartItems = new Map();

    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.productIdCounter = 1;
    this.blogPostIdCounter = 1;
    this.commentIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.testimonialIdCounter = 1;
    this.cartItemIdCounter = 1;

    this.initSampleData();
  }

  private initSampleData() {
    // Create admin user
    this.createUser({
      username: "admin",
      email: "admin@okkyno.com",
      password: "admin123",
      role: "admin"
    });

    // Create categories
    this.sampleCategories.forEach(category => this.createCategory(category));

    // Create comprehensive blog posts
    this.createBlogPost({
      title: "How to Start a Vegetable Garden: Complete Guide for Beginners",
      slug: "how-to-start-vegetable-garden-guide-beginners",
      content: `<p>Starting a vegetable garden can be a rewarding experience that provides fresh produce and a connection to the growing process. This comprehensive guide will walk you through everything you need to know to get started.</p>
      <h2>Choosing the Right Location</h2>
      <p>Most vegetables need at least 6-8 hours of direct sunlight daily. Choose a spot in your yard that gets plenty of sun and has good drainage. Avoid areas that are too windy or prone to flooding.</p>
      <h2>Planning Your Garden</h2>
      <p>Start small with just a few types of vegetables. Consider what your family enjoys eating and what grows well in your climate. Draw a simple layout of your garden beds.</p>
      <h2>Preparing the Soil</h2>
      <p>Good soil is the foundation of a successful garden. Test your soil to determine its pH and nutrient levels. Add compost or other organic matter to improve soil structure and fertility.</p>
      <h2>Planting</h2>
      <p>Follow the planting guidelines for each type of vegetable. Some plants, like tomatoes and peppers, are best started indoors and transplanted, while others, like carrots and beans, can be directly sown in the garden.</p>
      <h2>Watering and Maintenance</h2>
      <p>Most vegetables need about 1 inch of water per week. Water deeply but infrequently to encourage deep root growth. Mulch around plants to retain moisture and suppress weeds.</p>
      <h2>Harvesting</h2>
      <p>Harvest vegetables at their peak of ripeness for the best flavor. Regular harvesting often encourages plants to produce more.</p>
      <p>With proper planning and care, you'll be enjoying fresh vegetables from your garden in no time!</p>`,
      excerpt: "Learn everything you need to know about starting your first vegetable garden, from planning and soil preparation to harvesting.",
      imageUrl: "https://images.unsplash.com/photo-1527069438729-2eb562e7c9e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      authorId: 1,
      published: true
    });

    this.createBlogPost({
      title: "10 Low-Maintenance Indoor Plants That Purify Your Air",
      slug: "10-low-maintenance-indoor-plants-purify-air",
      content: `<p>Indoor plants not only add beauty to your home but can also improve air quality. Here are 10 easy-to-care-for plants that help purify the air.</p>
      <h2>1. Snake Plant (Sansevieria trifasciata)</h2>
      <p>Also known as mother-in-law's tongue, this plant is nearly indestructible. It thrives in low light and doesn't need frequent watering.</p>
      <h2>2. Spider Plant (Chlorophytum comosum)</h2>
      <p>A classic houseplant that produces baby plants you can propagate. It's non-toxic to pets and very forgiving of neglect.</p>
      <h2>3. Peace Lily (Spathiphyllum)</h2>
      <p>With elegant white flowers, peace lilies thrive in low light and help remove toxins like ammonia and formaldehyde.</p>
      <h2>4. ZZ Plant (Zamioculcas zamiifolia)</h2>
      <p>Glossy leaves and extreme drought tolerance make this perfect for busy schedules. It can survive weeks without water.</p>
      <h2>5. Rubber Plant (Ficus elastica)</h2>
      <p>Large, glossy leaves make a bold statement. It's forgiving and adapts well to various light conditions.</p>
      <h2>6. Pothos (Epipremnum aureum)</h2>
      <p>Trailing vines make this perfect for hanging baskets or shelves. It roots easily in water for propagation.</p>
      <h2>7. Philodendron</h2>
      <p>Heart-shaped leaves and low light tolerance make this a beginner favorite. Many varieties available.</p>
      <h2>8. Aloe Vera</h2>
      <p>Succulent that requires minimal water and provides natural healing gel for burns and cuts.</p>
      <h2>9. Boston Fern (Nephrolepis exaltata)</h2>
      <p>Adds lush texture and helps humidify dry indoor air. Perfect for bathrooms with natural light.</p>
      <h2>10. Chinese Evergreen (Aglaonema)</h2>
      <p>Colorful foliage patterns and low light tolerance. Available in many varieties with different leaf patterns.</p>
      <p>These plants require minimal care while providing maximum benefit to your indoor environment.</p>`,
      excerpt: "Discover beautiful houseplants that not only look great but also help clean the air in your home while requiring minimal care.",
      imageUrl: "https://images.unsplash.com/photo-1603436326446-e8beaa0c2956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      authorId: 1,
      published: true
    });

    // Create sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts = [
      // Vegetables (Category 1)
      {
        name: "Cherokee Purple Heirloom Tomato Seeds",
        slug: "cherokee-purple-heirloom-tomato-seeds",
        description: "Large, beefsteak-type tomatoes with deep purple-red color and exceptional flavor. These indeterminate heirloom tomatoes are perfect for slicing and have won numerous taste tests.",
        shortDescription: "Premium heirloom tomato seeds with exceptional flavor",
        price: 4.99,
        comparePrice: 6.99,
        imageUrl: "https://images.unsplash.com/photo-1592841200221-21e1c9bf5921?w=800&auto=format&fit=crop&q=80",
        imageUrls: ["https://images.unsplash.com/photo-1592841200221-21e1c9bf5921?w=800&auto=format&fit=crop&q=80"],
        videoUrl: "https://player.vimeo.com/video/456123456",
        categoryId: 1,
        sku: "CHE-PUR-001",
        stock: 150,
        featured: true,
        rating: 4.8,
        reviewCount: 124,
        tags: ["heirloom", "indeterminate", "beefsteak"],
        botanicalName: "Solanum lycopersicum",
        difficulty: "Intermediate",
        sunRequirement: "Full Sun",
        waterRequirement: "Regular",
        dimensions: "6-8 feet tall",
        weight: 0.1
      },
      // Dragon Tongue Bush Bean Seeds
      {
        name: "Dragon Tongue Bush Bean Seeds",
        slug: "dragon-tongue-bush-bean-seeds",
        description: "Stunning purple-streaked yellow pods with excellent flavor. These compact bush beans are both ornamental and delicious, perfect for container gardens.",
        shortDescription: "Colorful bush beans with purple streaks",
        price: 3.49,
        comparePrice: 4.99,
        imageUrl: "https://images.unsplash.com/photo-1543080917-8618c1dc2e85?w=800&auto=format&fit=crop&q=80",
        imageUrls: [
          "https://images.unsplash.com/photo-1543080917-8618c1dc2e85?w=800&auto=format&fit=crop&q=80"
        ],
        categoryId: 1,
        sku: "BEA-DRA-001",
        stock: 125,
        featured: true,
        rating: 4.7,
        reviewCount: 67,
        tags: ["bush bean", "heirloom", "compact"],
        botanicalName: "Phaseolus vulgaris",
        difficulty: "Easy",
        sunRequirement: "Full Sun",
        waterRequirement: "Regular",
        dimensions: "18-24 inches tall",
        weight: 0.08
      },

      // French Thyme Live Plant
      {
        name: "French Thyme Live Plant",
        slug: "french-thyme-live-plant",
        description: "Aromatic perennial herb with small gray-green leaves. Essential for French cuisine and herb gardens. Drought tolerant once established.",
        shortDescription: "Classic French culinary thyme plant",
        price: 8.99,
        comparePrice: 12.99,
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80",
        imageUrls: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80"],
        categoryId: 11,
        sku: "THY-FRE-001",
        stock: 145,
        featured: false,
        rating: 4.6,
        reviewCount: 198,
        tags: ["culinary", "french cuisine", "aromatic", "spreading"],
        botanicalName: "Thymus vulgaris",
        difficulty: "Easy",
        sunRequirement: "Full Sun",
        waterRequirement: "Low",
        dimensions: "6-8 inches tall",
        weight: 0.2
      },

      // Terra Cotta Classic Round Pot
      {
        name: "Terra Cotta Classic Round Pot 12-inch",
        slug: "terra-cotta-classic-round-pot-12-inch",
        description: "Traditional unglazed terra cotta pot with drainage hole. Breathable clay material promotes healthy root growth. Perfect for herbs, vegetables, and flowering plants.",
        shortDescription: "Classic terra cotta pot with excellent drainage",
        price: 18.99,
        comparePrice: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80",
        imageUrls: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80"],
        categoryId: 9,
        sku: "TER-CLA-001",
        stock: 85,
        featured: true,
        rating: 4.5,
        reviewCount: 267,
        tags: ["terra cotta", "drainage hole", "breathable", "traditional"],
        difficulty: "N/A",
        sunRequirement: "N/A",
        waterRequirement: "N/A",
        dimensions: "12 inches diameter",
        weight: 2.8
      },

      // Self-Watering Planter Box
      {
        name: "Self-Watering Planter Box 24-inch",
        slug: "self-watering-planter-box-24-inch",
        description: "Innovative self-watering system with water reservoir. Perfect for busy gardeners or vacation plant care. Includes water level indicator and overflow drain.",
        shortDescription: "Self-watering planter with reservoir system",
        price: 45.99,
        comparePrice: 59.99,
        imageUrl: "https://images.unsplash.com/photo-1493400448374-3b3e5ab7e0fa?w=800&auto=format&fit=crop&q=80",
        imageUrls: ["https://images.unsplash.com/photo-1493400448374-3b3e5ab7e0fa?w=800&auto=format&fit=crop&q=80"],
        videoUrl: "https://player.vimeo.com/video/456123789",
        categoryId: 9,
        sku: "SEL-WAT-001",
        stock: 35,
        featured: true,
        rating: 4.8,
        reviewCount: 189,
        tags: ["self-watering", "reservoir", "vacation care", "indicator"],
        difficulty: "N/A",
        sunRequirement: "N/A",
        waterRequirement: "N/A",
        dimensions: "24 x 8 x 8 inches",
        weight: 3.5
      },

      // Patriot Blueberry Bush
      {
        name: "Patriot Blueberry Bush",
        slug: "patriot-blueberry-bush",
        description: "Cold-hardy northern highbush blueberry with large, sweet berries. Self-pollinating variety with beautiful fall foliage. Perfect for home gardens.",
        shortDescription: "Cold-hardy blueberry bush with large berries",
        price: 24.99,
        comparePrice: 32.99,
        imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80",
        imageUrls: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80"],
        categoryId: 13,
        sku: "BLU-PAT-001",
        stock: 65,
        featured: false,
        rating: 4.7,
        reviewCount: 189,
        tags: ["cold-hardy", "self-pollinating", "large berries", "fall foliage"],
        botanicalName: "Vaccinium corymbosum",
        difficulty: "Intermediate",
        sunRequirement: "Full Sun to Partial Shade",
        waterRequirement: "Regular",
        dimensions: "4-6 feet tall",
        weight: 3.5
      },

      // Basil 'Genovese' Seeds
      {
        name: "Basil 'Genovese' Seeds",
        slug: "basil-genovese-seeds",
        description: "Classic Italian basil variety with large, aromatic leaves. Perfect for pesto, pasta, and Mediterranean cooking.",
        shortDescription: "Classic Italian basil for culinary use",
        price: 3.99,
        comparePrice: 5.99,
        imageUrl: "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=800&auto=format&fit=crop&q=80",
        imageUrls: ["https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=800&auto=format&fit=crop&q=80"],
        videoUrl: "https://player.vimeo.com/video/789123456",
        categoryId: 11,
        sku: "BAS-GEN-001",
        stock: 200,
        featured: false,
        rating: 4.6,
        reviewCount: 89,
        tags: ["culinary", "herb", "aromatic"],
        botanicalName: "Ocimum basilicum",
        difficulty: "Easy",
        sunRequirement: "Full Sun",
        waterRequirement: "Regular",
        dimensions: "12-18 inches tall",
        weight: 0.05
      }
    ];

    sampleProducts.forEach(product => this.createProduct(product));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const newUser: User = {
      ...user,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const now = new Date();
    const newCategory: Category = {
      ...category,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category | undefined> {
    const category = await this.getCategory(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...categoryData, updatedAt: new Date() };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Product operations
  async getProducts(limit?: number, offset = 0): Promise<Product[]> {
    const products = Array.from(this.products.values());
    if (limit) {
      return products.slice(offset, offset + limit);
    }
    return products;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.categoryId === categoryId);
  }

  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    const featured = Array.from(this.products.values()).filter(product => product.featured);
    if (limit) {
      return featured.slice(0, limit);
    }
    return featured;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(product => product.slug === slug);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      (product.description && product.description.toLowerCase().includes(lowerQuery))
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    const newProduct: Product = {
      ...product,
      id,
      createdAt: now,
      updatedAt: now,
      imageUrls: product.imageUrls ?? [],
      videoUrl: product.videoUrl ?? null,
      comparePrice: product.comparePrice ?? null,
      shortDescription: product.shortDescription ?? null,
      sku: product.sku ?? null,
      stock: product.stock ?? 0,
      featured: product.featured ?? false,
      rating: product.rating ?? null,
      reviewCount: product.reviewCount ?? 0,
      tags: product.tags ?? [],
      botanicalName: product.botanicalName ?? null,
      difficulty: product.difficulty ?? null,
      sunRequirement: product.sunRequirement ?? null,
      waterRequirement: product.waterRequirement ?? null,
      dimensions: product.dimensions ?? null,
      weight: product.weight ?? null,
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = await this.getProduct(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...productData, updatedAt: new Date() };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Blog operations
  async getBlogPosts(limit?: number, offset = 0, publishedOnly = true): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());

    if (publishedOnly) {
      posts = posts.filter(post => post.published);
    }

    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (limit) {
      return posts.slice(offset, offset + limit);
    }
    return posts;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostIdCounter++;
    const now = new Date();
    const newPost: BlogPost = {
      ...post,
      id,
      commentCount: 0,
      createdAt: now,
      updatedAt: now,
      excerpt: post.excerpt ?? null,
      imageUrl: post.imageUrl ?? null,
      published: post.published ?? false,
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: number, postData: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const post = await this.getBlogPost(id);
    if (!post) return undefined;

    const updatedPost = { ...post, ...postData, updatedAt: new Date() };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Comment operations
  async getCommentsByBlogPost(blogPostId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(comment => comment.blogPostId === blogPostId);
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    const newComment: Comment = { ...comment, id, createdAt: now };
    this.comments.set(id, newComment);
    return newComment;
  }

  async deleteComment(id: number): Promise<boolean> {
    return this.comments.delete(id);
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const now = new Date();
    const newOrder: Order = {
      ...order,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, status, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const newItem: OrderItem = { ...item, id };
    this.orderItems.set(id, newItem);
    return newItem;
  }

  // Testimonial operations
  async getTestimonials(approvedOnly = true): Promise<Testimonial[]> {
    let testimonials = Array.from(this.testimonials.values());
    if (approvedOnly) {
      testimonials = testimonials.filter(t => t.approved);
    }
    return testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const now = new Date();
    const newTestimonial: Testimonial = {
      ...testimonial,
      id,
      createdAt: now,
      updatedAt: now,
      approved: testimonial.approved ?? false,
    };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }

  async approveTestimonial(id: number): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;

    const updatedTestimonial = { ...testimonial, approved: true, updatedAt: new Date() };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
  }

  async getCartItem(sessionId: string, productId: number): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      item => item.sessionId === sessionId && item.productId === productId
    );
  }

  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    const existingItem = await this.getCartItem(item.sessionId, item.productId);

    if (existingItem) {
      return this.updateCartItemQuantity(existingItem.id, existingItem.quantity + item.quantity) as Promise<CartItem>;
    }

    const id = this.cartItemIdCounter++;
    const now = new Date();
    const newItem: CartItem = { ...item, id, createdAt: now };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }

    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const cartItems = await this.getCartItems(sessionId);
    let success = true;

    for (const item of cartItems) {
      if (!this.cartItems.delete(item.id)) {
        success = false;
      }
    }

    return success;
  }
}

export const storage = new MemStorage();
