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
    // Sample categories with authentic Epic Gardening images
    const categories: InsertCategory[] = [
      {
        name: "Vegetables",
        slug: "vegetables",
        description: "All types of vegetable plants for your garden",
        imageUrl: "/images/categories/3139i_Bean-Bush-Goldrush-ORG-new2025_ndzu9h.svg",
      },
      {
        name: "Flowers",
        slug: "flowers",
        description: "Beautiful flowering plants to brighten your garden",
        imageUrl: "/images/categories/2026i_Nasturtium-Fiesta-Blend_6ceu81.svg",
      },
      {
        name: "Container Gardening",
        slug: "container-gardening",
        description: "Everything you need for gardening in containers and raised beds",
        imageUrl: "/images/categories/10331_Medium_Tall_LightClay_Compressed.svg",
      },
      {
        name: "Seeds",
        slug: "seeds",
        description: "High-quality seeds for your garden",
        imageUrl: "/images/articles/4560i-Heirloom-ORG-Seed-Bank-Collection_35vk3o_m4m7ls.svg",
      },
      {
        name: "Raised Beds",
        slug: "raised-beds",
        description: "Beautiful raised beds for your garden",
        imageUrl: "/images/articles/10344_Small_Tall_SlateGrey_Compressed.svg",
      },
      {
        name: "Seed Starting",
        slug: "seed-starting",
        description: "Everything you need to start your seeds right",
        imageUrl: "/images/products/16-celltray2_400x400.svg",
      },
    ];
    
    // Create categories
    categories.forEach(category => {
      this.createCategory(category);
    });
    
    // Sample products with authentic Epic Gardening images
    const products: InsertProduct[] = [
      {
        name: "Round Short Metal Raised Garden Bed",
        slug: "round-short-metal-raised-bed",
        description: "This beautiful round raised garden bed is perfect for growing vegetables, flowers, or herbs. Made from durable galvanized steel with a Light Clay finish.",
        shortDescription: "Durable galvanized steel raised bed with Light Clay finish",
        price: 99.99,
        imageUrl: "/images/products/10328_Large_short_LightClay.svg",
        isBestSeller: true,
        categoryId: 5,
      },
      {
        name: "Zinnia Persian Carpet Seeds",
        slug: "zinnia-persian-carpet-seeds",
        description: "Beautiful bi-color zinnia mix with gold, mahogany, and burgundy blooms. Easy to grow and perfect for cut flowers.",
        shortDescription: "Stunning bi-color zinnia mix for dramatic garden display",
        price: 4.99,
        imageUrl: "/images/products/1193i_Zinnia-Persian-Carpet_3oykxo.svg",
        categoryId: 2,
      },
      {
        name: "Epic 16-Cell Seed Starting Trays",
        slug: "epic-16-cell-seed-starting-trays",
        description: "Professional seed starting system with 16 individual cells, perfect for starting vegetables, flowers, and herbs.",
        shortDescription: "Professional 16-cell seed starting system",
        price: 19.99,
        imageUrl: "/images/products/16-celltray2_400x400.svg",
        isNew: true,
        categoryId: 6,
      },
      {
        name: "Black 6-Cell Seed Starting Kit",
        slug: "black-6-cell-seed-starting-kit",
        description: "Durable 6-cell seed starting tray with dome lid for better germination rates.",
        shortDescription: "6-cell seed starting system with humidity dome",
        price: 14.99,
        imageUrl: "/images/products/6cellblack_400x400.svg",
        categoryId: 6,
      },
      {
        name: "Nasturtium Fiesta Blend Seeds",
        slug: "nasturtium-fiesta-blend-seeds",
        description: "Vibrant mix of edible Nasturtium flowers in red, orange, and yellow shades. Great for containers or garden borders.",
        shortDescription: "Colorful, edible nasturtium flowers for containers or borders",
        price: 3.99,
        imageUrl: "/images/categories/2026i_Nasturtium-Fiesta-Blend_6ceu81.svg",
        isBestSeller: true,
        categoryId: 2,
      },
      {
        name: "Bean Bush Goldrush Organic Seeds",
        slug: "bean-bush-goldrush-organic-seeds",
        description: "Organic yellow bush bean seeds for abundant harvests. Disease resistant and easy to grow.",
        shortDescription: "Organic yellow bush beans - high yield and disease resistant",
        price: 4.29,
        imageUrl: "/images/categories/3139i_Bean-Bush-Goldrush-ORG-new2025_ndzu9h.svg",
        isNew: true,
        categoryId: 1,
      },
      {
        name: "Medium Tall Metal Raised Garden Bed",
        slug: "medium-tall-metal-raised-bed",
        description: "Stylish medium height raised garden bed in Light Clay finish. Perfect for vegetables that need deeper soil.",
        shortDescription: "Stylish medium height metal raised bed in Light Clay finish",
        price: 119.99,
        imageUrl: "/images/categories/10331_Medium_Tall_LightClay_Compressed.svg",
        categoryId: 5,
      },
      {
        name: "Small Tall Metal Raised Garden Bed",
        slug: "small-tall-metal-raised-bed",
        description: "Space-saving tall raised garden bed in Slate Grey finish. Ideal for small spaces and patio gardening.",
        shortDescription: "Space-saving tall metal planter in elegant Slate Grey",
        price: 89.99,
        imageUrl: "/images/articles/10344_Small_Tall_SlateGrey_Compressed.svg",
        categoryId: 5,
      },
      {
        name: "Heirloom Organic Seed Bank Collection",
        slug: "heirloom-organic-seed-bank",
        description: "Comprehensive collection of 25 heirloom organic vegetable, herb, and flower seeds for a complete garden.",
        shortDescription: "25 varieties of heirloom organic seeds for a complete garden",
        price: 29.99,
        imageUrl: "/images/articles/4560i-Heirloom-ORG-Seed-Bank-Collection_35vk3o_m4m7ls.svg",
        isBestSeller: true,
        categoryId: 4,
      },
      {
        name: "Epic 4-Cell Seed Starting Kit",
        slug: "epic-4-cell-seed-starting-kit",
        description: "Perfect beginner seed starting system with 4 large cells and humidity dome for better germination.",
        shortDescription: "Beginner-friendly 4-cell seed starting system with dome",
        price: 12.99,
        imageUrl: "/images/products/4-cell-side-compressed_400x400.svg",
        categoryId: 6,
      },
      {
        name: "4-Cell Dome Seed Starting Kit",
        slug: "4-cell-dome-seed-starting-kit",
        description: "Professional 4-cell seed starting system with high dome for taller seedlings.",
        shortDescription: "Professional seed starting kit with high dome for tall seedlings",
        price: 16.99,
        imageUrl: "/images/products/4CellDomeWithBottomSmallGardenStarterKits_59f087c6-7e6c-41ee-b5af-765c31bbc57c_20_1_400x400.svg",
        categoryId: 6,
      },
      {
        name: "Stack & Grow Seedling Trays",
        slug: "stack-and-grow-trays",
        description: "Stackable seed starting system for maximizing your growing space. Professional quality for serious gardeners.",
        shortDescription: "Space-saving stackable seedling trays for serious gardeners",
        price: 42.99,
        imageUrl: "/images/products/2022-11-17-Diego0293-STACK_400x400.svg",
        isNew: true,
        categoryId: 6,
      },
    ];
    
    // Create products
    products.forEach(product => {
      this.createProduct(product);
    });
    
    // Sample articles with authentic Epic Gardening images
    const articles: InsertArticle[] = [
      {
        title: "Growing Yellow Bush Beans: Easy and Productive",
        slug: "growing-yellow-bush-beans",
        content: `<p>Yellow bush beans are one of the easiest and most productive vegetables for home gardeners. Here's how to grow them successfully:</p>
        <h2>Benefits of Growing Yellow Bush Beans</h2>
        <p>Yellow bush beans, also known as wax beans, are compact, productive, and don't require trellising like pole beans. They're perfect for small gardens and containers, and their bright color makes them easy to spot during harvest.</p>
        <h2>Starting from Seed</h2>
        <p>Direct sow seeds in the garden after all danger of frost has passed and soil temperatures reach at least 60°F. Plant seeds 1 inch deep and 2-3 inches apart in rows 18-24 inches apart. For continuous harvests, succession plant every 2-3 weeks.</p>
        <h2>Growing Conditions</h2>
        <p>Bush beans thrive in full sun (6+ hours daily) and well-draining soil rich in organic matter. They prefer a soil pH between 6.0 and 7.0. Keep soil consistently moist but not waterlogged, especially during flowering and pod development.</p>
        <h2>Care and Maintenance</h2>
        <p>Mulch around plants to conserve moisture and suppress weeds. Avoid working around bean plants when they're wet to prevent spreading diseases. Support bean plants with light stakes or cages if they become top-heavy with pods.</p>
        <h2>Pest and Disease Management</h2>
        <p>Watch for common bean pests like bean beetles, aphids, and spider mites. Disease resistance varies by variety, but most yellow bush beans are fairly resistant to common bean diseases like anthracnose and bean mosaic virus.</p>
        <h2>Harvesting and Storage</h2>
        <p>Harvest beans when they're young and tender, usually about 50-60 days after planting. Pick regularly to encourage continued production. Fresh beans will keep in the refrigerator for up to a week, or can be blanched and frozen for longer storage.</p>
        <p>With their ease of growing and abundant harvests, yellow bush beans are a perfect choice for both beginner and experienced gardeners!</p>`,
        excerpt: "Learn how to grow productive, crisp yellow bush beans in your garden with these simple growing tips.",
        imageUrl: "/images/categories/3139i_Bean-Bush-Goldrush-ORG-new2025_ndzu9h.svg",
        datePublished: new Date("2023-05-12"),
        categoryId: 1,
      },
      {
        title: "Growing Beautiful Nasturtiums in Your Garden",
        slug: "growing-beautiful-nasturtiums",
        content: `<p>Nasturtiums are among the easiest and most rewarding flowers to grow, offering vibrant colors, edible blooms and leaves, and excellent companion planting benefits.</p>
        <h2>Why Grow Nasturtiums</h2>
        <p>These versatile flowers add bright splashes of red, orange, and yellow to gardens while attracting beneficial pollinators. The entire plant is edible with a peppery taste similar to watercress, making them perfect for edible landscaping.</p>
        <h2>Starting from Seed</h2>
        <p>Nasturtiums are easy to grow from seed. Their large seeds can be directly sown outdoors after the last frost, or started indoors 4 weeks before the last frost date. Plant seeds 1/2 inch deep, and thin seedlings to 8-12 inches apart.</p>
        <h2>Growing Conditions</h2>
        <p>These flowers prefer full sun but will tolerate partial shade in hot climates. One of the secrets to prolific blooms is to grow them in poor to average soil with minimal fertilizer. Rich soil produces lush foliage but fewer flowers. Water moderately, allowing soil to dry between waterings.</p>
        <h2>Varieties to Try</h2>
        <ul>
          <li><strong>Climbing varieties:</strong> Ideal for trellises and fences, can reach 6-8 feet tall</li>
          <li><strong>Dwarf varieties:</strong> Perfect for containers and borders</li>
          <li><strong>Fiesta Blend:</strong> A beautiful mix of red, orange, and yellow flowers that creates a stunning display</li>
        </ul>
        <h2>Culinary Uses</h2>
        <p>Harvest young leaves and flowers regularly to encourage continuous blooming. Add the peppery leaves to salads, use the colorful flowers as edible garnishes, or try pickling the seed pods as a substitute for capers.</p>
        <h2>Companion Planting Benefits</h2>
        <p>Nasturtiums make excellent companion plants. They repel aphids, whiteflies, and cucumber beetles, making them valuable additions near vegetables like tomatoes, cucumbers, and brassicas.</p>
        <p>With their easy growing requirements and multiple benefits, nasturtiums deserve a place in every garden!</p>`,
        excerpt: "Discover how to grow vibrant, edible nasturtium flowers that add beauty to your garden and flavor to your plate.",
        imageUrl: "/images/categories/2026i_Nasturtium-Fiesta-Blend_6ceu81.svg",
        datePublished: new Date("2023-05-08"),
        categoryId: 2,
      },
      {
        title: "Raised Bed Gardening: Benefits and Best Practices",
        slug: "raised-bed-gardening-benefits-practices",
        content: `<p>Raised bed gardening offers numerous advantages for both beginning and experienced gardeners. From better soil control to extended growing seasons, raised beds can transform your gardening experience.</p>
        <h2>Benefits of Raised Bed Gardening</h2>
        <h3>1. Better Soil Control</h3>
        <p>Raised beds allow you to create the perfect soil mix tailored to your plants' needs, bypassing problems with existing soil.</p>
        <h3>2. Improved Drainage</h3>
        <p>The elevated design provides excellent drainage, preventing waterlogged roots and many associated plant diseases.</p>
        <h3>3. Extended Growing Season</h3>
        <p>Soil in raised beds warms up faster in spring and maintains heat longer in fall, allowing for earlier planting and later harvests.</p>
        <h3>4. Reduced Back Strain</h3>
        <p>Properly designed raised beds minimize bending and kneeling, making gardening more accessible for people with mobility limitations.</p>
        <h3>5. Defined Garden Spaces</h3>
        <p>Raised beds create clear boundaries that keep garden plants separate from lawn areas and help prevent grass invasion.</p>
        <h2>Raised Bed Materials</h2>
        <p>Modern raised beds are available in various materials:</p>
        <ul>
          <li><strong>Metal:</strong> Durable, long-lasting, and available in attractive finishes like slate grey, light clay, and mist green</li>
          <li><strong>Wood:</strong> Traditional cedar or redwood beds offer natural beauty</li>
          <li><strong>Composite:</strong> Low-maintenance alternative to wood</li>
          <li><strong>Fabric:</strong> Lightweight and portable option</li>
        </ul>
        <h2>Ideal Dimensions</h2>
        <p>The ideal width for a raised bed is 3-4 feet, allowing you to reach the center from either side without stepping on the soil. Length can vary based on your space, but most beds are 6-8 feet long. Height typically ranges from 8-36 inches, with taller beds requiring less bending.</p>
        <h2>Filling Your Raised Bed</h2>
        <p>A good soil mix for raised beds consists of:</p>
        <ul>
          <li>60% topsoil</li>
          <li>30% compost</li>
          <li>10% aeration materials (perlite, vermiculite, or coarse sand)</li>
        </ul>
        <p>Add balanced organic fertilizer according to package directions to provide essential nutrients for your plants.</p>
        <p>With proper planning and setup, raised bed gardens can provide years of productive and enjoyable gardening!</p>`,
        excerpt: "Discover the many advantages of raised bed gardening and learn how to create the perfect growing environment for your plants.",
        imageUrl: "/images/categories/10331_Medium_Tall_LightClay_Compressed.svg",
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
        avatarUrl: "https://randomuser.me/api/portraits/women/44.svg",
        content: "Epic Gardening has transformed my backyard! Their step-by-step guides made it easy to grow my own vegetables, even as a complete beginner. Now I have fresh produce all summer long!",
        rating: 5,
      },
      {
        personName: "Michael T.",
        role: "Urban Gardener",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.svg",
        content: "The gardening tools I purchased from Epic Gardening are top-quality and made my garden work so much easier. Their customer service was excellent when I had questions about which products to choose.",
        rating: 5,
      },
      {
        personName: "Jennifer P.",
        role: "Herb Enthusiast",
        avatarUrl: "https://randomuser.me/api/portraits/women/68.svg",
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
