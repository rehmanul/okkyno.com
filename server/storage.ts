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

    // Create sample products with consistent, category-appropriate images
    this.initializeProducts();
    console.log(`Generated ${this.products.size} products with images and videos`);
  }

  private initializeProducts() {
    const products = [
      // Vegetables (Category 1) - 30 products
      { name: "Cherokee Purple Heirloom Tomato Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1546470427-e5380b43d0a4?w=800&auto=format&fit=crop&q=80", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", price: 3.99 },
      { name: "Brandywine Pink Tomato Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop&q=80", price: 4.49 },
      { name: "San Marzano Tomato Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80", price: 3.99 },
      { name: "Roma Paste Tomato Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1592925741443-2c6323c1ed96?w=800&auto=format&fit=crop&q=80", price: 2.99 },
      { name: "Black Krim Heirloom Tomato Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&auto=format&fit=crop&q=80", price: 4.99 },
      { name: "Scarlet Nantes Carrot Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", price: 2.99 },
      { name: "Purple Top White Globe Turnip Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1605711576406-26aa98bfc6e0?w=800&auto=format&fit=crop&q=80", price: 2.49 },
      { name: "Chantenay Red Core Carrot Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80", price: 2.99 },
      { name: "Cosmic Purple Carrot Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=800&auto=format&fit=crop&q=80", price: 3.49 },
      { name: "Detroit Dark Red Beet Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1570493999006-ea80c2a4c815?w=800&auto=format&fit=crop&q=80", price: 2.49 },
      { name: "Chioggia Striped Beet Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1587411768465-7bf134ae3b25?w=800&auto=format&fit=crop&q=80", price: 3.49 },
      { name: "Golden Detroit Beet Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1594455042060-54c0a3e54f46?w=800&auto=format&fit=crop&q=80", price: 2.99 },
      { name: "Buttercrunch Lettuce Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1556909114-4f6e9d4d2f27?w=800&auto=format&fit=crop&q=80", price: 2.99 },
      { name: "Black Seeded Simpson Lettuce Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1560957123-a25cbb4de854?w=800&auto=format&fit=crop&q=80", price: 2.49 },
      { name: "Red Sails Lettuce Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1594455042060-54c0a3e54f46?w=800&auto=format&fit=crop&q=80", price: 2.99 },
      { name: "Sugar Snap Pea Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1576754792913-d0b8d8f4c1a4?w=800&auto=format&fit=crop&q=80", price: 3.49 },
      { name: "Oregon Sugar Pod Pea Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&auto=format&fit=crop&q=80", price: 3.99 },
      { name: "Mammoth Melting Sugar Pea Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80", price: 3.49 },
      { name: "Provider Green Bean Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80", price: 2.99 },
      { name: "Dragon Tongue Bush Bean Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1599119204109-d17d9de8c925?w=800&auto=format&fit=crop&q=80", price: 3.49 },
      { name: "Royal Burgundy Bean Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1591694509230-b066431b54dd?w=800&auto=format&fit=crop&q=80", price: 3.99 },
      { name: "Rainbow Swiss Chard Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1515196088641-63d8ad3e3c15?w=800&auto=format&fit=crop&q=80", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", price: 2.99 },
      { name: "Bright Lights Swiss Chard Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80", price: 3.49 },
      { name: "Fordhook Giant Swiss Chard Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1593113651673-b4ba687de281?w=800&auto=format&fit=crop&q=80", price: 2.99 },
      { name: "Japanese Long Cucumber Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=800&auto=format&fit=crop&q=80", price: 3.99 },
      { name: "Lemon Cucumber Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800&auto=format&fit=crop&q=80", price: 3.49 },
      { name: "Armenian Cucumber Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1549300079-323affc78da7?w=800&auto=format&fit=crop&q=80", price: 3.99 },
      { name: "Green Zebra Tomato Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=800&auto=format&fit=crop&q=80", price: 4.49 },
      { name: "Yellow Pear Tomato Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1592925741443-2c6323c1ed96?w=800&auto=format&fit=crop&q=80", price: 3.99 },
      { name: "Purple Top Turnip Seeds", categoryId: 1, image: "https://images.unsplash.com/photo-1605711576406-26aa98bfc6e0?w=800&auto=format&fit=crop&q=80", price: 2.49 },

      // Indoor Plants (Category 2) - 30 products
      { name: "Monstera Deliciosa", categoryId: 2, image: "https://images.unsplash.com/photo-1586093021710-3c5dd9bd1e06?w=800&auto=format&fit=crop&q=80", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", price: 39.99 },
      { name: "Fiddle Leaf Fig", categoryId: 2, image: "https://images.unsplash.com/photo-1603436326446-e8beaa0c2956?w=800&auto=format&fit=crop&q=80", price: 59.99 },
      { name: "Fiddle Leaf Fig Bambino", categoryId: 2, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=80", price: 34.99 },
      { name: "Pothos Golden", categoryId: 2, image: "https://images.unsplash.com/photo-1618377531907-42e7e7a54e69?w=800&auto=format&fit=crop&q=80", price: 19.99 },
      { name: "Pothos Marble Queen", categoryId: 2, image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&auto=format&fit=crop&q=80", price: 24.99 },
      { name: "Pothos Jade", categoryId: 2, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80", price: 19.99 },
      { name: "ZZ Plant", categoryId: 2, image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&auto=format&fit=crop&q=80", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", price: 29.99 },
      { name: "ZZ Plant Raven", categoryId: 2, image: "https://images.unsplash.com/photo-1586093248106-bbf80d13b57f?w=800&auto=format&fit=crop&q=80", price: 39.99 },
      { name: "ZZ Plant Zenzi", categoryId: 2, image: "https://images.unsplash.com/photo-1617575250623-b5c7cce05b58?w=800&auto=format&fit=crop&q=80", price: 34.99 },
      { name: "Snake Plant", categoryId: 2, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80", price: 24.99 },
      { name: "Snake Plant Laurentii", categoryId: 2, image: "https://images.unsplash.com/photo-1542238693-82b6d67b66f8?w=800&auto=format&fit=crop&q=80", price: 29.99 },
      { name: "Snake Plant Moonshine", categoryId: 2, image: "https://images.unsplash.com/photo-1593113651673-b4ba687de281?w=800&auto=format&fit=crop&q=80", price: 34.99 },
      { name: "Rubber Plant", categoryId: 2, image: "https://images.unsplash.com/photo-1542238693-82b6d67b66f8?w=800&auto=format&fit=crop&q=80", price: 34.99 },
      { name: "Rubber Plant Burgundy", categoryId: 2, image: "https://images.unsplash.com/photo-1591694509230-b066431b54dd?w=800&auto=format&fit=crop&q=80", price: 39.99 },
      { name: "Rubber Plant Tineke", categoryId: 2, image: "https://images.unsplash.com/photo-1542238693-82b6d67b66f8?w=800&auto=format&fit=crop&q=80", price: 44.99 },
      { name: "Bird of Paradise", categoryId: 2, image: "https://images.unsplash.com/photo-1610978938692-65b66e12c10d?w=800&auto=format&fit=crop&q=80", price: 89.99 },
      { name: "Bird of Paradise White", categoryId: 2, image: "https://images.unsplash.com/photo-1593113651673-b4ba687de281?w=800&auto=format&fit=crop&q=80", price: 99.99 },
      { name: "Philodendron Pink Princess", categoryId: 2, image: "https://images.unsplash.com/photo-1515196088641-63d8ad3e3c15?w=800&auto=format&fit=crop&q=80", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", price: 149.99 },
      { name: "Philodendron Brasil", categoryId: 2, image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80", price: 29.99 },
      { name: "Philodendron Heartleaf", categoryId: 2, image: "https://images.unsplash.com/photo-1593113651673-b4ba687de281?w=800&auto=format&fit=crop&q=80", price: 19.99 },
      { name: "Peace Lily", categoryId: 2, image: "https://images.unsplash.com/photo-1610978938692-65b66e12c10d?w=800&auto=format&fit=crop&q=80", price: 24.99 },
      { name: "Peace Lily Sensation", categoryId: 2, image: "https://images.unsplash.com/photo-1593113651673-b4ba687de281?w=800&auto=format&fit=crop&q=80", price: 39.99 },
      { name: "Spider Plant", categoryId: 2, image: "https://images.unsplash.com/photo-1542238693-82b6d67b66f8?w=800&auto=format&fit=crop&q=80", price: 14.99 },
      { name: "Spider Plant Variegated", categoryId: 2, image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80", price: 19.99 },
      { name: "Monstera Adansonii", categoryId: 2, image: "https://images.unsplash.com/photo-1586093021710-3c5dd9bd1e06?w=800&auto=format&fit=crop&q=80", price: 29.99 },
      { name: "Boston Fern", categoryId: 2, image: "https://images.unsplash.com/photo-1610978938692-65b66e12c10d?w=800&auto=format&fit=crop&q=80", price: 19.99 },
      { name: "Parlor Palm", categoryId: 2, image: "https://images.unsplash.com/photo-1593113651673-b4ba687de281?w=800&auto=format&fit=crop&q=80", price: 24.99 },
      { name: "Ponytail Palm", categoryId: 2, image: "https://images.unsplash.com/photo-1610978938692-65b66e12c10d?w=800&auto=format&fit=crop&q=80", price: 34.99 },
      { name: "Chinese Evergreen", categoryId: 2, image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80", price: 29.99 },
      { name: "Dracaena Marginata", categoryId: 2, image: "https://images.unsplash.com/photo-1610978938692-65b66e12c10d?w=800&auto=format&fit=crop&q=80", price: 39.99 },

      // Garden Tools (Category 3) - 25 products
      { name: "Ergonomic Garden Spade", categoryId: 3, image: "https://images.unsplash.com/photo-1589111118344-fe616859d7a7?w=800&auto=format&fit=crop&q=80", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", price: 29.99 },
      { name: "Professional Pruning Shears", categoryId: 3, image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800&auto=format&fit=crop&q=80", price: 19.99 },
      { name: "Felco F-2 Pruning Shears", categoryId: 3, image: "https://images.unsplash.com/photo-1615232428120-9aa7ce2ab176?w=800&auto=format&fit=crop&q=80", price: 45.99 },
      { name: "Corona Bypass Pruner", categoryId: 3, image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800&auto=format&fit=crop&q=80", price: 24.99 },
      { name: "Stainless Steel Trowel", categoryId: 3, image: "https://images.unsplash.com/photo-1598521112314-a9addabd2a2a?w=800&auto=format&fit=crop&q=80", price: 15.99 },
      { name: "Japanese Hori Hori Knife", categoryId: 3, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80", price: 39.99 },
      { name: "Garden Rake", categoryId: 3, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80", price: 24.99 },
      { name: "Leaf Rake", categoryId: 3, image: "https://images.unsplash.com/photo-1598521112314-a9addabd2a2a?w=800&auto=format&fit=crop&q=80", price: 19.99 },
      { name: "Watering Can", categoryId: 3, image: "https://images.unsplash.com/photo-1558618666-5a006db2c7ad?w=800&auto=format&fit=crop&q=80", price: 18.99 },
      { name: "Garden Hoe", categoryId: 3, image: "https://images.unsplash.com/photo-1589111118344-fe616859d7a7?w=800&auto=format&fit=crop&q=80", price: 22.99 },
      { name: "Hand Cultivator", categoryId: 3, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80", price: 12.99 },
      { name: "Weeding Fork", categoryId: 3, image: "https://images.unsplash.com/photo-1598521112314-a9addabd2a2a?w=800&auto=format&fit=crop&q=80", price: 14.99 },
      { name: "Garden Fork", categoryId: 3, image: "https://images.unsplash.com/photo-1589111118344-fe616859d7a7?w=800&auto=format&fit=crop&q=80", price: 34.99 },
      { name: "Pruning Saw", categoryId: 3, image: "https://images.unsplash.com/photo-1615232428120-9aa7ce2ab176?w=800&auto=format&fit=crop&q=80", price: 29.99 },
      { name: "Garden Scissors", categoryId: 3, image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800&auto=format&fit=crop&q=80", price: 16.99 },
      { name: "Hand Weeder", categoryId: 3, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80", price: 11.99 },
      { name: "Transplanting Trowel", categoryId: 3, image: "https://images.unsplash.com/photo-1598521112314-a9addabd2a2a?w=800&auto=format&fit=crop&q=80", price: 13.99 },
      { name: "Soil Scoop", categoryId: 3, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80", price: 9.99 },
      { name: "Spray Bottle", categoryId: 3, image: "https://images.unsplash.com/photo-1558618666-5a006db2c7ad?w=800&auto=format&fit=crop&q=80", price: 7.99 },
      { name: "Professional Soil Thermometer", categoryId: 3, image: "https://images.unsplash.com/photo-1598521112314-a9addabd2a2a?w=800&auto=format&fit=crop&q=80", price: 24.99 },
      { name: "Soil pH Tester", categoryId: 3, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80", price: 19.99 },
      { name: "Garden Kneeler Pad", categoryId: 3, image: "https://images.unsplash.com/photo-1589111118344-fe616859d7a7?w=800&auto=format&fit=crop&q=80", price: 16.99 },
      { name: "Garden Tool Set", categoryId: 3, image: "https://images.unsplash.com/photo-1598521112314-a9addabd2a2a?w=800&auto=format&fit=crop&q=80", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", price: 89.99 },
      { name: "Extendable Pole Saw", categoryId: 3, image: "https://images.unsplash.com/photo-1615232428120-9aa7ce2ab176?w=800&auto=format&fit=crop&q=80", price: 79.99 },
      { name: "Heavy Duty Garden Gloves", categoryId: 3, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80", price: 12.99 },

      // Flowers (Category 8) - 25 products
      { name: "Sunflower Mammoth Russian Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop&q=80", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", price: 2.99 },
      { name: "Zinnia State Fair Mix Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1463554050456-f2ed7d3fec09?w=800&auto=format&fit=crop&q=80", price: 2.49 },
      { name: "Cosmos Sensation Mix Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&auto=format&fit=crop&q=80", price: 2.99 },
      { name: "Marigold French Petite Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80", price: 2.49 },
      { name: "Sweet Pea Fragrant Mix Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1522049007011-a34e2ed7e635?w=800&auto=format&fit=crop&q=80", price: 3.49 },
      { name: "Nasturtium Climbing Mix Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80", price: 2.99 },
      { name: "Calendula Pacific Beauty Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1522049007011-a34e2ed7e635?w=800&auto=format&fit=crop&q=80", price: 2.49 },
      { name: "Bachelor Button Mix Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1463554050456-f2ed7d3fec09?w=800&auto=format&fit=crop&q=80", price: 2.49 },
      { name: "Celosia Plume Mix Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80", price: 2.99 },
      { name: "Dahlia Mix Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&auto=format&fit=crop&q=80", price: 3.99 },
      { name: "Petunia Wave Mix Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80", price: 2.99 },
      { name: "Impatiens Busy Lizzie Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1522049007011-a34e2ed7e635?w=800&auto=format&fit=crop&q=80", price: 3.49 },
      { name: "Begonia Dragon Wing Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80", price: 3.99 },
      { name: "Salvia Splendens Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1463554050456-f2ed7d3fec09?w=800&auto=format&fit=crop&q=80", price: 2.99 },
      { name: "Verbena Bonariensis Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80", price: 3.49 },
      { name: "Cleome Spider Flower Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1522049007011-a34e2ed7e635?w=800&auto=format&fit=crop&q=80", price: 2.99 },
      { name: "Nicotiana Flowering Tobacco Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80", price: 2.49 },
      { name: "Rudbeckia Cherokee Sunset Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop&q=80", price: 3.49 },
      { name: "Echinacea Purple Coneflower Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80", price: 3.99 },
      { name: "Gaillardia Blanket Flower Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1463554050456-f2ed7d3fec09?w=800&auto=format&fit=crop&q=80", price: 2.99 },
      { name: "Lupine Russell Mix Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1522049007011-a34e2ed7e635?w=800&auto=format&fit=crop&q=80", price: 3.99 },
      { name: "Delphinium Pacific Giant Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80", price: 4.49 },
      { name: "Hollyhock Chater's Double Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80", price: 3.49 },
      { name: "Foxglove Digitalis Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1522049007011-a34e2ed7e635?w=800&auto=format&fit=crop&q=80", price: 3.99 },
      { name: "Larkspur Imperial Mix Seeds", categoryId: 8, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80", price: 2.99 },

      // Pots & Planters (Category 9) - 20 products
      { name: "Terra Cotta Classic Pot 6-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80", price: 12.99 },
      { name: "Terra Cotta Classic Pot 8-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80", price: 18.99 },
      { name: "Terra Cotta Classic Pot 12-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80", price: 24.99 },
      { name: "Self-Watering Planter Box 24-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1502394202744-021cfbb17454?w=800&auto=format&fit=crop&q=80", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", price: 49.99 },
      { name: "Self-Watering Planter Box 36-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1502394202744-021cfbb17454?w=800&auto=format&fit=crop&q=80", price: 69.99 },
      { name: "Ceramic Decorative Pot 8-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&auto=format&fit=crop&q=80", price: 24.99 },
      { name: "Ceramic Decorative Pot 12-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&auto=format&fit=crop&q=80", price: 39.99 },
      { name: "Hanging Basket Planter 12-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1558618666-5a006db2c7ad?w=800&auto=format&fit=crop&q=80", price: 18.99 },
      { name: "Hanging Basket Planter 16-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1558618666-5a006db2c7ad?w=800&auto=format&fit=crop&q=80", price: 24.99 },
      { name: "Wooden Cedar Planter 36-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1502394202744-021cfbb17454?w=800&auto=format&fit=crop&q=80", price: 89.99 },
      { name: "Wooden Cedar Planter 48-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1502394202744-021cfbb17454?w=800&auto=format&fit=crop&q=80", price: 119.99 },
      { name: "Window Box Planter 24-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1558618666-5a006db2c7ad?w=800&auto=format&fit=crop&q=80", price: 34.99 },
      { name: "Window Box Planter 36-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1558618666-5a006db2c7ad?w=800&auto=format&fit=crop&q=80", price: 49.99 },
      { name: "Raised Garden Bed Kit 4x4", categoryId: 9, image: "https://images.unsplash.com/photo-1502394202744-021cfbb17454?w=800&auto=format&fit=crop&q=80", price: 179.99 },
      { name: "Raised Garden Bed Kit 4x8", categoryId: 9, image: "https://images.unsplash.com/photo-1502394202744-021cfbb17454?w=800&auto=format&fit=crop&q=80", price: 299.99 },
      { name: "Vertical Garden Tower", categoryId: 9, image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&auto=format&fit=crop&q=80", price: 149.99 },
      { name: "Stone Effect Planter 10-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80", price: 29.99 },
      { name: "Resin Planter 14-inch", categoryId: 9, image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&auto=format&fit=crop&q=80", price: 39.99 },
      { name: "Stackable Planter System", categoryId: 9, image: "https://images.unsplash.com/photo-1558618666-5a006db2c7ad?w=800&auto=format&fit=crop&q=80", price: 89.99 },
      { name: "Fabric Grow Bags Set of 5", categoryId: 9, image: "https://images.unsplash.com/photo-1502394202744-021cfbb17454?w=800&auto=format&fit=crop&q=80", price: 24.99 },

      // Herbs (Category 11) - 20 products
      { name: "Basil Genovese", categoryId: 11, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", price: 4.99 },
      { name: "Basil Thai", categoryId: 11, image: "https://images.unsplash.com/photo-1521944521548-a8ed0caa8f38?w=800&auto=format&fit=crop&q=80", price: 5.49 },
      { name: "Rosemary Tuscan Blue", categoryId: 11, image: "https://images.unsplash.com/photo-1521944521548-a8ed0caa8f38?w=800&auto=format&fit=crop&q=80", price: 5.99 },
      { name: "Rosemary Arp", categoryId: 11, image: "https://images.unsplash.com/photo-1506142439521-10db0e7b2caa?w=800&auto=format&fit=crop&q=80", price: 5.99 },
      { name: "French Thyme", categoryId: 11, image: "https://images.unsplash.com/photo-1506142439521-10db0e7b2caa?w=800&auto=format&fit=crop&q=80", price: 4.49 },
      { name: "Thyme Lemon", categoryId: 11, image: "https://images.unsplash.com/photo-1628017725085-7b54b9b5b53a?w=800&auto=format&fit=crop&q=80", price: 4.99 },
      { name: "Oregano Greek", categoryId: 11, image: "https://images.unsplash.com/photo-1628017725085-7b54b9b5b53a?w=800&auto=format&fit=crop&q=80", price: 4.99 },
      { name: "Oregano Hot & Spicy", categoryId: 11, image: "https://images.unsplash.com/photo-1533454947737-5e47f7e6c7b2?w=800&auto=format&fit=crop&q=80", price: 5.49 },
      { name: "Parsley Italian Flat", categoryId: 11, image: "https://images.unsplash.com/photo-1533454947737-5e47f7e6c7b2?w=800&auto=format&fit=crop&q=80", price: 3.99 },
      { name: "Parsley Curled", categoryId: 11, image: "https://images.unsplash.com/photo-1506142439521-10db0e7b2caa?w=800&auto=format&fit=crop&q=80", price: 3.99 },
      { name: "Cilantro Slow Bolt", categoryId: 11, image: "https://images.unsplash.com/photo-1521944521548-a8ed0caa8f38?w=800&auto=format&fit=crop&q=80", price: 3.49 },
      { name: "Cilantro Leisure", categoryId: 11, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80", price: 3.49 },
      { name: "Chives Garlic", categoryId: 11, image: "https://images.unsplash.com/photo-1628017725085-7b54b9b5b53a?w=800&auto=format&fit=crop&q=80", price: 4.49 },
      { name: "Chives Common", categoryId: 11, image: "https://images.unsplash.com/photo-1533454947737-5e47f7e6c7b2?w=800&auto=format&fit=crop&q=80", price: 3.99 },
      { name: "Sage Purple", categoryId: 11, image: "https://images.unsplash.com/photo-1506142439521-10db0e7b2caa?w=800&auto=format&fit=crop&q=80", price: 5.99 },
      { name: "Sage Garden", categoryId: 11, image: "https://images.unsplash.com/photo-1521944521548-a8ed0caa8f38?w=800&auto=format&fit=crop&q=80", price: 5.49 },
      { name: "Lavender English", categoryId: 11, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80", price: 6.99 },
      { name: "Lavender Provence", categoryId: 11, image: "https://images.unsplash.com/photo-1628017725085-7b54b9b5b53a?w=800&auto=format&fit=crop&q=80", price: 7.49 },
      { name: "Mint Spearmint", categoryId: 11, image: "https://images.unsplash.com/photo-1533454947737-5e47f7e6c7b2?w=800&auto=format&fit=crop&q=80", price: 4.99 },
      { name: "Mint Chocolate", categoryId: 11, image: "https://images.unsplash.com/photo-1506142439521-10db0e7b2caa?w=800&auto=format&fit=crop&q=80", price: 5.49 },

      // Succulents (Category 12) - 25 products
      { name: "Echeveria Blue Prince", categoryId: 12, image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", price: 12.99 },
      { name: "Echeveria Lola", categoryId: 12, image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&auto=format&fit=crop&q=80", price: 14.99 },
      { name: "Jade Plant", categoryId: 12, image: "https://images.unsplash.com/photo-1508022152233-9254631e31d1?w=800&auto=format&fit=crop&q=80", price: 14.99 },
      { name: "Jade Plant Gollum", categoryId: 12, image: "https://images.unsplash.com/photo-1551204078-6b3e5d0bb85e?w=800&auto=format&fit=crop&q=80", price: 16.99 },
      { name: "Aloe Vera", categoryId: 12, image: "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?w=800&auto=format&fit=crop&q=80", price: 16.99 },
      { name: "Aloe Aristata", categoryId: 12, image: "https://images.unsplash.com/photo-1494943611983-95c2206ece28?w=800&auto=format&fit=crop&q=80", price: 18.99 },
      { name: "String of Pearls", categoryId: 12, image: "https://images.unsplash.com/photo-1606305030704-aa9145b2bcb8?w=800&auto=format&fit=crop&q=80", price: 18.99 },
      { name: "String of Hearts", categoryId: 12, image: "https://images.unsplash.com/photo-1462039267831-5346cf7d4985?w=800&auto=format&fit=crop&q=80", price: 19.99 },
      { name: "String of Bananas", categoryId: 12, image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80", price: 17.99 },
      { name: "Hens and Chicks", categoryId: 12, image: "https://images.unsplash.com/photo-1526136834165-6b4d6ad9b17b?w=800&auto=format&fit=crop&q=80", price: 11.99 },
      { name: "Sempervivum Red Beauty", categoryId: 12, image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&auto=format&fit=crop&q=80", price: 13.99 },
      { name: "Barrel Cactus", categoryId: 12, image: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=800&auto=format&fit=crop&q=80", price: 22.99 },
      { name: "Golden Barrel Cactus", categoryId: 12, image: "https://images.unsplash.com/photo-1565011523534-747a8601f0a0?w=800&auto=format&fit=crop&q=80", price: 24.99 },
      { name: "Christmas Cactus", categoryId: 12, image: "https://images.unsplash.com/photo-1558647899-de79cfef9448?w=800&auto=format&fit=crop&q=80", price: 19.99 },
      { name: "Thanksgiving Cactus", categoryId: 12, image: "https://images.unsplash.com/photo-1513336080686-7448ad1a8fe3?w=800&auto=format&fit=crop&q=80", price: 21.99 },
      { name: "Burro's Tail", categoryId: 12, image: "https://images.unsplash.com/photo-1558631047-9d9a4e7a9b11?w=800&auto=format&fit=crop&q=80", price: 16.99 },
      { name: "Sedum Morganianum", categoryId: 12, image: "https://images.unsplash.com/photo-1578374173714-8f4fa5b9b04b?w=800&auto=format&fit=crop&q=80", price: 17.99 },
      { name: "Crown of Thorns", categoryId: 12, image: "https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=800&auto=format&fit=crop&q=80", price: 18.99 },
      { name: "Euphorbia Milii", categoryId: 12, image: "https://images.unsplash.com/photo-1533041206584-bb3bee43c0cf?w=800&auto=format&fit=crop&q=80", price: 19.99 },
      { name: "Desert Rose", categoryId: 12, image: "https://images.unsplash.com/photo-1598192957734-8e6b7c7c1e6a?w=800&auto=format&fit=crop&q=80", price: 29.99 },
      { name: "Adenium Obesum", categoryId: 12, image: "https://images.unsplash.com/photo-1581922181807-9039b0b632ae?w=800&auto=format&fit=crop&q=80", price: 32.99 },
      { name: "Haworthia Zebra", categoryId: 12, image: "https://images.unsplash.com/photo-1553881536-31ed77e5b02e?w=800&auto=format&fit=crop&q=80", price: 15.99 },
      { name: "Crassula Ovata", categoryId: 12, image: "https://images.unsplash.com/photo-1595121654853-02b4efda5fb8?w=800&auto=format&fit=crop&q=80", price: 13.99 },
      { name: "Senecio Rowleyanus", categoryId: 12, image: "https://images.unsplash.com/photo-1575627030656-ba3db0b52009?w=800&auto=format&fit=crop&q=80", price: 18.99 },
      { name: "Kalanchoe Blossfeldiana", categoryId: 12, image: "https://images.unsplash.com/photo-1592150648126-02600bd31b04?w=800&auto=format&fit=crop&q=80", price: 16.99 },

      // Fruit Trees (Category 13) - 15 products
      { name: "Dwarf Apple Honeycrisp", categoryId: 13, image: "https://images.unsplash.com/photo-1572915904405-c13b2eecfac7?w=800&auto=format&fit=crop&q=80", video: "https://www.youtube.com/embed/dQw4w9WgXcQ", price: 45.99 },
      { name: "Dwarf Apple Gala", categoryId: 13, image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop&q=80", price: 42.99 },
      { name: "Dwarf Apple Granny Smith", categoryId: 13, image: "https://images.unsplash.com/photo-1549923818-8d9b7b8b7ebe?w=800&auto=format&fit=crop&q=80", price: 44.99 },
      { name: "Meyer Lemon Tree", categoryId: 13, image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80", price: 39.99 },
      { name: "Key Lime Tree", categoryId: 13, image: "https://images.unsplash.com/photo-1598632640086-b5293b83b64c?w=800&auto=format&fit=crop&q=80", price: 42.99 },
      { name: "Blood Orange Tree", categoryId: 13, image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80", price: 46.99 },
      { name: "Cherry Tree Sweet Bing", categoryId: 13, image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop&q=80", price: 42.99 },
      { name: "Cherry Tree Rainier", categoryId: 13, image: "https://images.unsplash.com/photo-1572915904405-c13b2eecfac7?w=800&auto=format&fit=crop&q=80", price: 48.99 },
      { name: "Peach Tree Elberta", categoryId: 13, image: "https://images.unsplash.com/photo-1549923818-8d9b7b8b7ebe?w=800&auto=format&fit=crop&q=80", price: 38.99 },
      { name: "Peach Tree Red Haven", categoryId: 13, image: "https://images.unsplash.com/photo-1598632640086-b5293b83b64c?w=800&auto=format&fit=crop&q=80", price: 39.99 },
      { name: "Fig Tree Brown Turkey", categoryId: 13, image: "https://images.unsplash.com/photo-1598632640086-b5293b83b64c?w=800&auto=format&fit=crop&q=80", price: 44.99 },
      { name: "Fig Tree Chicago Hardy", categoryId: 13, image: "https://images.unsplash.com/photo-1549923818-8d9b7b8b7ebe?w=800&auto=format&fit=crop&q=80", price: 46.99 },
      { name: "Pomegranate Tree Red Silk", categoryId: 13, image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop&q=80", price: 52.99 },
      { name: "Avocado Tree Hass", categoryId: 13, image: "https://images.unsplash.com/photo-1572915904405-c13b2eecfac7?w=800&auto=format&fit=crop&q=80", price: 59.99 },
      { name: "Pear Tree Bartlett", categoryId: 13, image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80", price: 41.99 }
    ];

    products.forEach((product, index) => {
      this.createProduct({
        name: product.name,
        slug: this.slugify(product.name),
        description: `High-quality ${product.name.toLowerCase()} for your garden. Perfect for both beginners and experienced gardeners.`,
        shortDescription: `Premium ${product.name.toLowerCase()}`,
        price: product.price,
        comparePrice: index % 4 === 0 ? product.price * 1.3 : null,
        imageUrl: product.image,
        imageUrls: [product.image],
        videoUrl: (product as any).video || null,
        categoryId: product.categoryId,
        sku: `PROD-${String(index + 1).padStart(3, '0')}`,
        stock: 25 + Math.floor(Math.random() * 75),
        featured: index < 10,
        rating: 4.0 + Math.random() * 1,
        reviewCount: Math.floor(Math.random() * 200),
        tags: ["gardening", "plants", "seeds"],
        botanicalName: "Various species",
        difficulty: index % 3 === 0 ? "Easy" : index % 3 === 1 ? "Intermediate" : "Advanced",
        sunRequirement: "Full Sun",
        waterRequirement: "Regular",
        dimensions: "Various",
        weight: 0.5 + Math.random() * 5
      });
    });
  }

  private slugify(str: string) {
    return str.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) return user;
    }
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const newUser: User = {
      ...user,
      id,
      createdAt: now
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
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
    for (const category of this.categories.values()) {
      if (category.slug === slug) return category;
    }
    return undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = {
      ...category,
      id
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Product operations
  async getProducts(limit?: number, offset = 0): Promise<Product[]> {
    const products = Array.from(this.products.values()).slice(offset);
    return limit ? products.slice(0, limit) : products;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.categoryId === categoryId);
  }

  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    const featured = Array.from(this.products.values()).filter(p => p.featured);
    return limit ? featured.slice(0, limit) : featured;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    for (const product of this.products.values()) {
      if (product.slug === slug) return product;
    }
    return undefined;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.products.values()).filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    const newProduct: Product = {
      ...product,
      id,
      createdAt: now
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
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
    posts = posts.slice(offset);
    return limit ? posts.slice(0, limit) : posts;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    for (const post of this.blogPosts.values()) {
      if (post.slug === slug) return post;
    }
    return undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostIdCounter++;
    const now = new Date();
    const newPost: BlogPost = {
      ...post,
      id,
      createdAt: now
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: number, postData: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...postData };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Comment operations
  async getCommentsByBlogPost(blogPostId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(c => c.blogPostId === blogPostId);
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
    return Array.from(this.orders.values()).filter(o => o.userId === userId);
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
      createdAt: now
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order item operations
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
    return testimonials;
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const now = new Date();
    const newTestimonial: Testimonial = {
      ...testimonial,
      id,
      createdAt: now,
      approved: false
    };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }

  async approveTestimonial(id: number): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;
    
    const updatedTestimonial = { ...testimonial, approved: true };
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
    for (const item of this.cartItems.values()) {
      if (item.sessionId === sessionId && item.productId === productId) {
        return item;
      }
    }
    return undefined;
  }

  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemIdCounter++;
    const now = new Date();
    const newItem: CartItem = { ...item, id, createdAt: now };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToDelete = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId)
      .map(([id, _]) => id);
    
    itemsToDelete.forEach(id => this.cartItems.delete(id));
    return true;
  }
}

export const storage = new MemStorage();