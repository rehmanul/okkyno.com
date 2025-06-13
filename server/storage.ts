
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

  // Comprehensive product database with 200+ products
  private comprehensiveProducts: InsertProduct[] = [];

  private initializeProducts() {
    // Generate comprehensive product database with 200+ products
    this.generateComprehensiveProducts();
  }

  private generateComprehensiveProducts() {
    // Image collections for different categories
    const imageCollections = {
      vegetables: [
        "https://images.unsplash.com/photo-1546470427-e5380b43d0a4?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1543080917-8618c1dc2e85?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1574226516831-e1dff420e562?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=800&auto=format&fit=crop&q=80"
      ],
      plants: [
        "https://images.unsplash.com/photo-1586093021710-3c5dd9bd1e06?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1603436326446-e8beaa0c2956?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1618377531907-42e7e7a54e69?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1586093248106-bbf80d13b57f?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1617575250623-b5c7cce05b58?w=800&auto=format&fit=crop&q=80"
      ],
      tools: [
        "https://images.unsplash.com/photo-1589111118344-fe616859d7a7?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1598521112314-a9addabd2a2a?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1558618666-5a006db2c7ad?w=800&auto=format&fit=crop&q=80"
      ],
      flowers: [
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1463554050456-f2ed7d3fec09?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522049007011-a34e2ed7e635?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
      ],
      planters: [
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1502394202744-021cfbb17454?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1558618666-5a006db2c7ad?w=800&auto=format&fit=crop&q=80"
      ],
      herbs: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1521944521548-a8ed0caa8f38?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1506142439521-10db0e7b2caa?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1628017725085-7b54b9b5b53a?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1533454947737-5e47f7e6c7b2?w=800&auto=format&fit=crop&q=80"
      ],
      succulents: [
        "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1508022152233-9254631e31d1?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1606305030704-aa9145b2bcb8?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1526136834165-6b4d6ad9b17b?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1558647899-de79cfef9448?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1558631047-9d9a4e7a9b11?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1598192957734-8e6b7c7c1e6a?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1551204078-6b3e5d0bb85e?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1494943611983-95c2206ece28?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1462039267831-5346cf7d4985?w=800&auto=format&fit=crop&q=80"
      ],
      fruitTrees: [
        "https://images.unsplash.com/photo-1572915904405-c13b2eecfac7?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1549923818-8d9b7b8b7ebe?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1598632640086-b5293b83b64c?w=800&auto=format&fit=crop&q=80"
      ],
      fertilizers: [
        "https://images.unsplash.com/photo-1595771805070-fdf2e7cd5050?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1524930425341-b2eac4b6e7e4?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1458245914173-7dce38e1edbe?w=800&auto=format&fit=crop&q=80"
      ]
    };

    const videoUrls = [
      "https://player.vimeo.com/video/123456789",
      "https://player.vimeo.com/video/987654321",
      "https://player.vimeo.com/video/456789123",
      "https://player.vimeo.com/video/789123456"
    ];

    // Generate vegetables (Category 1) - 30 products
    const vegetableProducts = [
      "Cherokee Purple Heirloom Tomato", "Dragon Tongue Bush Bean", "Detroit Dark Red Beet", 
      "Purple Top Turnip", "Scarlet Nantes Carrot", "Buttercrunch Lettuce", "Sugar Snap Pea", 
      "Black Krim Heirloom Tomato", "Rainbow Swiss Chard", "Japanese Long Cucumber",
      "Green Zebra Tomato", "Provider Green Bean", "Chioggia Beet", "Hakurei Turnip",
      "Paris Market Carrot", "Black Seeded Simpson Lettuce", "Mammoth Melting Sugar Pea",
      "Brandywine Tomato", "Bright Lights Swiss Chard", "Lemon Cucumber",
      "Roma Tomato", "Royal Burgundy Bean", "Early Wonder Beet", "White Egg Turnip",
      "Chantenay Red Core Carrot", "Red Sails Lettuce", "Oregon Sugar Pod Pea",
      "San Marzano Tomato", "Fordhook Giant Swiss Chard", "Armenian Cucumber"
    ];

    vegetableProducts.forEach((name, index) => {
      const images = imageCollections.vegetables;
      const mainImage = images[index % images.length];
      const galleryImages = [
        mainImage, 
        images[(index + 2) % images.length], 
        images[(index + 4) % images.length]
      ];
      
      this.createProduct({
        name: `${name} Seeds`,
        slug: this.slugify(`${name}-seeds`),
        description: `Premium ${name.toLowerCase()} seeds for your vegetable garden. High germination rate and excellent flavor. Perfect for home gardeners who want fresh, organic produce.`,
        shortDescription: `Premium ${name.toLowerCase()} seeds`,
        price: 2.99 + Math.random() * 4,
        comparePrice: index % 3 === 0 ? 5.99 + Math.random() * 2 : null,
        imageUrl: mainImage,
        imageUrls: galleryImages,
        videoUrl: index % 10 === 0 ? videoUrls[index % videoUrls.length] : null,
        categoryId: 1,
        sku: `VEG-${String(index + 1).padStart(3, '0')}`,
        stock: 50 + Math.floor(Math.random() * 200),
        featured: index < 5,
        rating: 4.0 + Math.random() * 1,
        reviewCount: Math.floor(Math.random() * 300),
        tags: ["seeds", "vegetable", "organic", "heirloom"],
        botanicalName: "Various species",
        difficulty: index % 3 === 0 ? "Easy" : index % 3 === 1 ? "Intermediate" : "Advanced",
        sunRequirement: "Full Sun",
        waterRequirement: "Regular",
        dimensions: "Varies",
        weight: 0.05 + Math.random() * 0.15
      });
    });

    // Generate indoor plants (Category 2) - 25 products
    const indoorPlants = [
      "Monstera Deliciosa", "Fiddle Leaf Fig", "Pothos Golden", "ZZ Plant", "Rubber Plant",
      "Bird of Paradise", "Philodendron Pink Princess", "Snake Plant", "Peace Lily", "Spider Plant",
      "Fiddle Leaf Fig Bambino", "Pothos Marble Queen", "ZZ Plant Raven", "Rubber Plant Burgundy",
      "Bird of Paradise White", "Philodendron Brasil", "Snake Plant Laurentii", "Peace Lily Sensation",
      "Spider Plant Variegated", "Monstera Adansonii", "Pothos Jade", "ZZ Plant Zenzi",
      "Rubber Plant Tineke", "Philodendron Heartleaf", "Snake Plant Moonshine"
    ];

    indoorPlants.forEach((name, index) => {
      const images = imageCollections.plants;
      const mainImage = images[index % images.length];
      const galleryImages = [
        mainImage, 
        images[(index + 2) % images.length], 
        images[(index + 3) % images.length]
      ];
      
      this.createProduct({
        name: name,
        slug: this.slugify(name),
        description: `Beautiful ${name.toLowerCase()} perfect for indoor spaces. Easy to care for and air-purifying. Adds natural beauty to any room.`,
        shortDescription: `Beautiful ${name.toLowerCase()} houseplant`,
        price: 19.99 + Math.random() * 60,
        comparePrice: index % 4 === 0 ? 35.99 + Math.random() * 20 : null,
        imageUrl: mainImage,
        imageUrls: galleryImages,
        videoUrl: index % 8 === 0 ? videoUrls[index % videoUrls.length] : null,
        categoryId: 2,
        sku: `PLANT-${String(index + 1).padStart(3, '0')}`,
        stock: 10 + Math.floor(Math.random() * 50),
        featured: index < 8,
        rating: 4.2 + Math.random() * 0.8,
        reviewCount: Math.floor(Math.random() * 400),
        tags: ["houseplant", "air-purifying", "indoor", "low-maintenance"],
        botanicalName: "Various species",
        difficulty: "Easy",
        sunRequirement: "Bright Indirect Light",
        waterRequirement: "Weekly",
        dimensions: "12-36 inches",
        weight: 2 + Math.random() * 8
      });
    });

    // Generate garden tools (Category 3) - 20 products
    const gardenTools = [
      "Ergonomic Garden Spade", "Japanese Hori Hori Knife", "Professional Soil Thermometer",
      "Felco F-2 Pruning Shears", "Corona Bypass Pruner", "Stainless Steel Trowel",
      "Weeding Fork", "Garden Rake", "Watering Can", "Hand Cultivator",
      "Garden Hoe", "Pruning Saw", "Soil pH Tester", "Garden Scissors", "Hand Weeder",
      "Transplanting Trowel", "Garden Fork", "Leaf Rake", "Spray Bottle", "Soil Scoop"
    ];

    gardenTools.forEach((name, index) => {
      const images = imageCollections.tools;
      const mainImage = images[index % images.length];
      const galleryImages = [mainImage, images[(index + 1) % images.length]];
      
      this.createProduct({
        name: name,
        slug: this.slugify(name),
        description: `Professional-grade ${name.toLowerCase()} for serious gardeners. Durable construction and ergonomic design for comfortable use.`,
        shortDescription: `Professional ${name.toLowerCase()}`,
        price: 15.99 + Math.random() * 50,
        comparePrice: index % 5 === 0 ? 25.99 + Math.random() * 30 : null,
        imageUrl: mainImage,
        imageUrls: galleryImages,
        categoryId: 3,
        sku: `TOOL-${String(index + 1).padStart(3, '0')}`,
        stock: 25 + Math.floor(Math.random() * 75),
        featured: index < 6,
        rating: 4.3 + Math.random() * 0.7,
        reviewCount: Math.floor(Math.random() * 250),
        tags: ["tool", "professional", "durable", "ergonomic"],
        difficulty: "N/A",
        sunRequirement: "N/A",
        waterRequirement: "N/A",
        dimensions: "Various",
        weight: 0.5 + Math.random() * 2
      });
    });

    // Continue with other categories...
    // Generate flowers (Category 8) - 25 products
    const flowers = [
      "Sunflower Mammoth Russian", "Zinnia State Fair Mix", "Cosmos Sensation Mix",
      "Marigold French Petite", "Nasturtium Climbing Mix", "Sweet Pea Fragrant Mix",
      "Calendula Pacific Beauty", "Bachelor Button Mix", "Celosia Plume Mix", "Dahlia Mix",
      "Petunia Wave Mix", "Impatiens Busy Lizzie", "Begonia Dragon Wing", "Salvia Splendens",
      "Verbena Bonariensis", "Cleome Spider Flower", "Nicotiana Flowering Tobacco", "Rudbeckia Cherokee Sunset",
      "Echinacea Purple Coneflower", "Gaillardia Blanket Flower", "Lupine Russell Mix", "Delphinium Pacific Giant",
      "Hollyhock Chater's Double", "Foxglove Digitalis", "Larkspur Imperial Mix"
    ];

    flowers.forEach((name, index) => {
      const images = imageCollections.flowers;
      const mainImage = images[index % images.length];
      const galleryImages = [
        mainImage, 
        images[(index + 2) % images.length], 
        images[(index + 3) % images.length]
      ];
      
      this.createProduct({
        name: `${name} Seeds`,
        slug: this.slugify(`${name}-seeds`),
        description: `Beautiful ${name.toLowerCase()} flowers that attract pollinators and add stunning color to your garden. Easy to grow annual flowers.`,
        shortDescription: `Colorful ${name.toLowerCase()} flowers`,
        price: 2.49 + Math.random() * 6,
        imageUrl: mainImage,
        imageUrls: galleryImages,
        videoUrl: index % 12 === 0 ? videoUrls[index % videoUrls.length] : null,
        categoryId: 8,
        sku: `FLO-${String(index + 1).padStart(3, '0')}`,
        stock: 100 + Math.floor(Math.random() * 150),
        featured: index < 7,
        rating: 4.1 + Math.random() * 0.9,
        reviewCount: Math.floor(Math.random() * 200),
        tags: ["flowers", "annual", "pollinator-friendly", "colorful"],
        botanicalName: "Various species",
        difficulty: "Easy",
        sunRequirement: "Full Sun",
        waterRequirement: "Regular",
        dimensions: "6-48 inches",
        weight: 0.02 + Math.random() * 0.08
      });
    });

    // Generate pots and planters (Category 9) - 20 products
    const planters = [
      "Terra Cotta Classic Pot 6-inch", "Self-Watering Planter Box 24-inch", "Fabric Grow Bags Set of 5",
      "Wooden Cedar Planter 36-inch", "Ceramic Decorative Pot 8-inch", "Hanging Basket Planter 12-inch",
      "Window Box Planter 24-inch", "Raised Garden Bed Kit 4x8", "Vertical Garden Tower", "Stone Effect Planter 10-inch",
      "Terra Cotta Classic Pot 12-inch", "Self-Watering Planter Box 36-inch", "Fabric Grow Bags Set of 10",
      "Wooden Cedar Planter 48-inch", "Ceramic Decorative Pot 12-inch", "Hanging Basket Planter 16-inch",
      "Window Box Planter 36-inch", "Raised Garden Bed Kit 4x4", "Stackable Planter System", "Resin Planter 14-inch"
    ];

    planters.forEach((name, index) => {
      const images = imageCollections.planters;
      const mainImage = images[index % images.length];
      const galleryImages = [mainImage, images[(index + 1) % images.length]];
      
      this.createProduct({
        name: name,
        slug: this.slugify(name),
        description: `High-quality ${name.toLowerCase()} for all your gardening needs. Excellent drainage and durability for long-lasting use.`,
        shortDescription: `Durable ${name.toLowerCase()}`,
        price: 12.99 + Math.random() * 80,
        comparePrice: index % 3 === 0 ? 19.99 + Math.random() * 40 : null,
        imageUrl: mainImage,
        imageUrls: galleryImages,
        categoryId: 9,
        sku: `POT-${String(index + 1).padStart(3, '0')}`,
        stock: 15 + Math.floor(Math.random() * 50),
        featured: index < 5,
        rating: 4.0 + Math.random() * 1,
        reviewCount: Math.floor(Math.random() * 180),
        tags: ["planter", "drainage", "durable", "container"],
        difficulty: "N/A",
        sunRequirement: "N/A",
        waterRequirement: "N/A",
        dimensions: "Various sizes",
        weight: 1 + Math.random() * 10
      });
    });

    // Generate herbs (Category 11) - 20 products
    const herbs = [
      "Basil Genovese", "Rosemary Tuscan Blue", "French Thyme", "Oregano Greek",
      "Parsley Italian Flat", "Cilantro Slow Bolt", "Chives Garlic", "Sage Purple",
      "Lavender English", "Mint Spearmint", "Basil Thai", "Rosemary Arp",
      "Thyme Lemon", "Oregano Hot & Spicy", "Parsley Curled", "Cilantro Leisure",
      "Chives Common", "Sage Garden", "Lavender Provence", "Mint Chocolate"
    ];

    herbs.forEach((name, index) => {
      const images = imageCollections.herbs;
      const mainImage = images[index % images.length];
      const galleryImages = [mainImage, images[(index + 1) % images.length]];
      
      this.createProduct({
        name: name,
        slug: this.slugify(name),
        description: `Aromatic ${name.toLowerCase()} perfect for culinary use and garden fragrance. Easy to grow and harvest fresh herbs.`,
        shortDescription: `Aromatic ${name.toLowerCase()} herb`,
        price: 3.99 + Math.random() * 12,
        imageUrl: mainImage,
        imageUrls: galleryImages,
        videoUrl: index % 15 === 0 ? videoUrls[index % videoUrls.length] : null,
        categoryId: 11,
        sku: `HERB-${String(index + 1).padStart(3, '0')}`,
        stock: 40 + Math.floor(Math.random() * 80),
        featured: index < 6,
        rating: 4.4 + Math.random() * 0.6,
        reviewCount: Math.floor(Math.random() * 150),
        tags: ["herb", "culinary", "aromatic", "medicinal"],
        botanicalName: "Various species",
        difficulty: "Easy",
        sunRequirement: "Full Sun",
        waterRequirement: "Regular",
        dimensions: "6-24 inches",
        weight: 0.03 + Math.random() * 0.07
      });
    });

    // Generate succulents (Category 12) - 25 products
    const succulents = [
      "Echeveria Blue Prince", "Jade Plant", "Aloe Vera", "String of Pearls",
      "Hens and Chicks", "Barrel Cactus", "Christmas Cactus", "Burro's Tail",
      "Crown of Thorns", "Desert Rose", "Echeveria Lola", "Jade Plant Gollum",
      "Aloe Aristata", "String of Hearts", "Sempervivum Red Beauty", "Golden Barrel Cactus",
      "Thanksgiving Cactus", "String of Bananas", "Euphorbia Milii", "Adenium Obesum",
      "Sedum Morganianum", "Haworthia Zebra", "Crassula Ovata", "Senecio Rowleyanus", "Kalanchoe Blossfeldiana"
    ];

    succulents.forEach((name, index) => {
      const images = imageCollections.succulents;
      // Ensure each succulent gets a unique image by using index directly
      const mainImage = images[index % images.length];
      const secondaryImage = images[(index + 3) % images.length]; // Offset to avoid consecutive images
      const galleryImages = [mainImage, secondaryImage];
      
      this.createProduct({
        name: name,
        slug: this.slugify(name),
        description: `Low-maintenance ${name.toLowerCase()} perfect for beginners. Drought-tolerant and beautiful succulent for indoor or outdoor growing.`,
        shortDescription: `Beautiful ${name.toLowerCase()} succulent`,
        price: 8.99 + Math.random() * 30,
        imageUrl: mainImage,
        imageUrls: galleryImages,
        categoryId: 12,
        sku: `SUC-${String(index + 1).padStart(3, '0')}`,
        stock: 20 + Math.floor(Math.random() * 40),
        featured: index < 8,
        rating: 4.2 + Math.random() * 0.8,
        reviewCount: Math.floor(Math.random() * 120),
        tags: ["succulent", "drought-tolerant", "low-maintenance", "decorative"],
        botanicalName: "Various species",
        difficulty: "Easy",
        sunRequirement: "Bright Light",
        waterRequirement: "Low",
        dimensions: "2-12 inches",
        weight: 0.5 + Math.random() * 2
      });
    });

    // Generate fruit trees (Category 13) - 15 products
    const fruitTrees = [
      "Dwarf Apple Honeycrisp", "Dwarf Lemon Meyer", "Blueberry Patriot",
      "Fig Brown Turkey", "Pomegranate Red Silk", "Cherry Sweet Bing",
      "Peach Elberta", "Pear Bartlett", "Plum Santa Rosa", "Grapevine Concord",
      "Dwarf Orange Valencia", "Blueberry Bluecrop", "Fig Chicago Hardy",
      "Cherry Montmorency", "Peach Red Haven"
    ];

    fruitTrees.forEach((name, index) => {
      const images = imageCollections.fruitTrees;
      const mainImage = images[index % images.length];
      const galleryImages = [mainImage, images[(index + 1) % images.length]];
      
      this.createProduct({
        name: name,
        slug: this.slugify(name),
        description: `Productive ${name.toLowerCase()} perfect for home orchards. Self-pollinating and container-friendly varieties available for fresh fruit harvest.`,
        shortDescription: `Productive ${name.toLowerCase()} tree`,
        price: 39.99 + Math.random() * 100,
        comparePrice: index % 3 === 0 ? 59.99 + Math.random() * 40 : null,
        imageUrl: mainImage,
        imageUrls: galleryImages,
        videoUrl: index % 5 === 0 ? videoUrls[index % videoUrls.length] : null,
        categoryId: 13,
        sku: `FRUIT-${String(index + 1).padStart(3, '0')}`,
        stock: 5 + Math.floor(Math.random() * 25),
        featured: index < 5,
        rating: 4.5 + Math.random() * 0.5,
        reviewCount: Math.floor(Math.random() * 100),
        tags: ["fruit tree", "productive", "self-pollinating", "container-friendly"],
        botanicalName: "Various species",
        difficulty: "Intermediate",
        sunRequirement: "Full Sun",
        waterRequirement: "Regular",
        dimensions: "4-8 feet",
        weight: 5 + Math.random() * 15
      });
    });

    // Generate fertilizers and soil amendments (Category 14/15) - 20 products
    const fertilizers = [
      "All-Purpose Organic Compost", "Worm Castings Premium", "Kelp Meal Fertilizer",
      "Bone Meal Organic", "Fish Emulsion Liquid", "Bat Guano Fertilizer",
      "Rock Phosphate", "Greensand Potassium", "Mycorrhizal Inoculant", "Azomite Trace Minerals",
      "Organic Potting Mix", "Cactus Soil Mix", "Seed Starting Mix", "Compost Tea Bags",
      "Organic Plant Food", "Liquid Fertilizer Concentrate", "Slow Release Granules", "Soil Conditioner",
      "Perlite Soil Amendment", "Vermiculite Growing Medium"
    ];

    fertilizers.forEach((name, index) => {
      const images = imageCollections.fertilizers;
      const mainImage = images[0]; // Use same image for all fertilizers
      
      this.createProduct({
        name: name,
        slug: this.slugify(name),
        description: `Premium ${name.toLowerCase()} for healthy plant growth. Organic and slow-release nutrition for optimal garden performance.`,
        shortDescription: `Premium ${name.toLowerCase()}`,
        price: 12.99 + Math.random() * 35,
        imageUrl: mainImage,
        imageUrls: [mainImage],
        categoryId: index < 10 ? 14 : 15, // Split between organic fertilizers (14) and soil (15)
        sku: `FERT-${String(index + 1).padStart(3, '0')}`,
        stock: 30 + Math.floor(Math.random() * 70),
        featured: index < 4,
        rating: 4.3 + Math.random() * 0.7,
        reviewCount: Math.floor(Math.random() * 180),
        tags: ["fertilizer", "organic", "slow-release", "natural"],
        difficulty: "N/A",
        sunRequirement: "N/A",
        waterRequirement: "N/A",
        dimensions: "Various sizes",
        weight: 1 + Math.random() * 5
      });
    });

    console.log(`Generated ${this.products.size} products with images and videos`);
  }

  private slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
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
