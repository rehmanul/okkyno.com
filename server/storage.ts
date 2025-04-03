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
        name: "Herbs",
        slug: "herbs",
        description: "Flavorful and aromatic herb plants for culinary and medicinal use",
        imageUrl: "/images/categories/herbs_category.svg",
      },
      {
        name: "Tools",
        slug: "tools",
        description: "Quality gardening tools for all your gardening needs",
        imageUrl: "/images/categories/tools_category.svg",
      },
      {
        name: "Fertilizers",
        slug: "fertilizers",
        description: "Organic fertilizers and soil amendments for healthy plants",
        imageUrl: "/images/categories/fertilizers_category.svg",
      },
      {
        name: "Pest Control",
        slug: "pest-control",
        description: "Natural and organic solutions for garden pests and diseases",
        imageUrl: "/images/categories/pest_control_category.svg",
      },
      {
        name: "Grow Lights",
        slug: "grow-lights",
        description: "LED grow lights for indoor gardening and seed starting",
        imageUrl: "/images/categories/grow_lights_category.svg",
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
    
    // Sample products based on Epic Gardening website
    const products: InsertProduct[] = [
      // Fruit Trees
      {
        name: "Honeycrisp Apple Tree",
        slug: "honeycrisp-apple-tree",
        description: "The Honeycrisp Apple Tree produces sweet, crisp apples that are perfect for fresh eating. This popular variety is known for its exceptional flavor and crunch.",
        shortDescription: "Sweet, crisp apples with exceptional flavor",
        price: 99.99,
        imageUrl: "/images/products/honeycrisp-apple-tree.svg",
        isBestSeller: true,
        categoryId: 1
      },
      {
        name: "Bing Cherry Tree",
        slug: "bing-cherry-tree",
        description: "The Bing Cherry Tree produces large, sweet dark cherries that are perfect for fresh eating or baking. This popular variety is a must-have for cherry lovers.",
        shortDescription: "Large, sweet dark cherries for fresh eating or baking",
        price: 89.99,
        imageUrl: "/images/products/bing-cherry-tree.svg",
        categoryId: 1
      },
      {
        name: "Wonderful Pomegranate Tree",
        slug: "wonderful-pomegranate-tree",
        description: "The Wonderful Pomegranate Tree produces large, juicy fruits with vibrant red arils. This popular variety is known for its sweet-tart flavor and nutritional benefits.",
        shortDescription: "Large, juicy pomegranates with sweet-tart flavor",
        price: 79.99,
        imageUrl: "/images/products/wonderful-pomegranate-tree.svg",
        categoryId: 1
      },
      {
        name: "Chicago Hardy Fig Tree",
        slug: "chicago-hardy-fig-tree",
        description: "The Chicago Hardy Fig Tree is an exceptionally cold-hardy variety that produces sweet, purple-brown figs. It can die back to the ground in winter and still produce fruit the following year.",
        shortDescription: "Cold-hardy fig variety that produces sweet, purple-brown figs",
        price: 69.99,
        imageUrl: "/images/products/chicago-hardy-fig-tree.svg",
        isBestSeller: true,
        categoryId: 1
      },
      {
        name: "Frost Peach Tree",
        slug: "frost-peach-tree",
        description: "The Frost Peach Tree produces large, yellow-fleshed peaches with a sweet flavor. This variety is known for its excellent disease resistance.",
        shortDescription: "Large, sweet peaches with excellent disease resistance",
        price: 89.99,
        imageUrl: "/images/products/frost-peach-tree.svg",
        categoryId: 1
      },
      // Berries and Vines
      {
        name: "Prolific Kiwi (Self-Fertile)",
        slug: "kiwi-prolific-self-fertile",
        description: "This self-fertile kiwi variety doesn't require a male pollinator to produce fruit. It produces sweet, flavorful kiwis on a vigorous vine.",
        shortDescription: "Self-fertile kiwi that produces sweet, flavorful fruits",
        price: 39.99,
        imageUrl: "/images/products/kiwi-prolific-self-fertile.svg",
        categoryId: 1
      },
      {
        name: "Thornless Blackberry Bush",
        slug: "thornless-blackberry-bush",
        description: "This thornless blackberry variety produces large, sweet berries on canes without thorns, making harvesting easy and painless.",
        shortDescription: "Large, sweet blackberries on thornless canes for easy harvesting",
        price: 29.99,
        imageUrl: "/images/products/thornless-blackberry-bush.svg",
        isBestSeller: true,
        categoryId: 1
      },
      {
        name: "Pink Lemonade Blueberry",
        slug: "pink-lemonade-blueberry",
        description: "This unique blueberry variety produces sweet, pink berries with a delicious flavor. It's a beautiful ornamental plant that also provides tasty fruit.",
        shortDescription: "Unique blueberry with sweet, pink berries and ornamental value",
        price: 34.99,
        imageUrl: "/images/products/pink-lemonade-blueberry.svg",
        categoryId: 1
      },
      // Seed Starting Supplies
      {
        name: "Epic 16-Cell Seed Starting Trays",
        slug: "epic-16-cell-seed-starting-trays",
        description: "Professional seed starting system with 16 individual cells, perfect for starting vegetables, flowers, and herbs.",
        shortDescription: "Professional 16-cell seed starting system",
        price: 19.99,
        imageUrl: "/images/products/16-celltray2_400x400.svg",
        isNew: true,
        categoryId: 11
      },
      {
        name: "6-Cell Garden Propagation Trays",
        slug: "epic-tray-6-cell-garden-propagation-trays",
        description: "Durable 6-cell seed starting tray with individual cells for better root development. Perfect for starting larger seedlings.",
        shortDescription: "6-cell propagation system for strong seedling development",
        price: 14.99,
        imageUrl: "/images/products/6cellblack_400x400.svg",
        categoryId: 11
      },
      {
        name: "4-Cell Garden Propagation Trays",
        slug: "epic-tray-4-cell-garden-propagation-trays",
        description: "Perfect beginner seed starting system with 4 large cells for better root development. Ideal for larger seedlings.",
        shortDescription: "4-cell propagation system with large cells for healthy roots",
        price: 12.99,
        imageUrl: "/images/products/4-cell-side-compressed_400x400.svg",
        categoryId: 11
      },
      {
        name: "6-Cell Germination Dome Kit",
        slug: "epic-tray-6-cell-germination-dome-and-bottom-tray",
        description: "Complete seed starting kit with 6 cells, humidity dome, and bottom tray for water. Creates the perfect environment for seed germination.",
        shortDescription: "Complete 6-cell seed starting kit with humidity dome",
        price: 16.99,
        imageUrl: "/images/products/4CellDomeWithBottomSmallGardenStarterKits_59f087c6-7e6c-41ee-b5af-765c31bbc57c_20_1_400x400.svg",
        isBestSeller: true,
        categoryId: 11
      },
      // Raised Beds
      {
        name: "Round Metal Raised Garden Bed",
        slug: "round-short-metal-raised-bed",
        description: "This beautiful round raised garden bed is perfect for growing vegetables, flowers, or herbs. Made from durable galvanized steel with a Light Clay finish.",
        shortDescription: "Durable galvanized steel raised bed with Light Clay finish",
        price: 99.99,
        imageUrl: "/images/products/10328_Large_short_LightClay.svg",
        isBestSeller: true,
        categoryId: 10
      },
      {
        name: "Medium Tall Metal Raised Garden Bed",
        slug: "medium-tall-metal-raised-bed",
        description: "Stylish medium height raised garden bed in Light Clay finish. Perfect for vegetables that need deeper soil.",
        shortDescription: "Stylish medium height metal raised bed in Light Clay finish",
        price: 119.99,
        imageUrl: "/images/categories/10331_Medium_Tall_LightClay_Compressed.svg",
        categoryId: 10
      },
      {
        name: "Small Tall Metal Raised Garden Bed",
        slug: "small-tall-metal-raised-bed",
        description: "Space-saving tall raised garden bed in Slate Grey finish. Ideal for small spaces and patio gardening.",
        shortDescription: "Space-saving tall metal planter in elegant Slate Grey",
        price: 89.99,
        imageUrl: "/images/articles/10344_Small_Tall_SlateGrey_Compressed.svg",
        categoryId: 10
      },
      // Seeds
      {
        name: "Zinnia Persian Carpet Seeds",
        slug: "zinnia-persian-carpet-seeds",
        description: "Beautiful bi-color zinnia mix with gold, mahogany, and burgundy blooms. Easy to grow and perfect for cut flowers.",
        shortDescription: "Stunning bi-color zinnia mix for dramatic garden display",
        price: 4.99,
        imageUrl: "/images/products/1193i_Zinnia-Persian-Carpet_3oykxo.svg",
        categoryId: 9
      },
      {
        name: "Nasturtium Fiesta Blend Seeds",
        slug: "nasturtium-fiesta-blend-seeds",
        description: "Vibrant mix of edible Nasturtium flowers in red, orange, and yellow shades. Great for containers or garden borders.",
        shortDescription: "Colorful, edible nasturtium flowers for containers or borders",
        price: 3.99,
        imageUrl: "/images/categories/2026i_Nasturtium-Fiesta-Blend_6ceu81.svg",
        isBestSeller: true,
        categoryId: 9
      },
      {
        name: "Bean Bush Goldrush Organic Seeds",
        slug: "bean-bush-goldrush-organic-seeds",
        description: "Organic yellow bush bean seeds for abundant harvests. Disease resistant and easy to grow.",
        shortDescription: "Organic yellow bush beans - high yield and disease resistant",
        price: 4.29,
        imageUrl: "/images/categories/3139i_Bean-Bush-Goldrush-ORG-new2025_ndzu9h.svg",
        isNew: true,
        categoryId: 9
      },
      {
        name: "Heirloom Organic Seed Collection",
        slug: "heirloom-organic-seed-bank",
        description: "Comprehensive collection of 25 heirloom organic vegetable, herb, and flower seeds for a complete garden.",
        shortDescription: "25 varieties of heirloom organic seeds for a complete garden",
        price: 29.99,
        imageUrl: "/images/articles/4560i-Heirloom-ORG-Seed-Bank-Collection_35vk3o_m4m7ls.svg",
        isBestSeller: true,
        categoryId: 9
      },
      // More gardening products
      {
        name: "Stack & Grow Seedling Trays",
        slug: "stack-and-grow-trays",
        description: "Stackable seed starting system for maximizing your growing space. Professional quality for serious gardeners.",
        shortDescription: "Space-saving stackable seedling trays for serious gardeners",
        price: 42.99,
        imageUrl: "/images/products/2022-11-17-Diego0293-STACK_400x400.svg",
        isNew: true,
        categoryId: 11
      },
      {
        name: "Premium Garden Gloves",
        slug: "premium-garden-gloves",
        description: "Durable and comfortable garden gloves with reinforced fingertips. Perfect for all gardening tasks.",
        shortDescription: "Durable garden gloves with reinforced fingertips",
        price: 14.99,
        imageUrl: "/images/products/garden_gloves.svg",
        categoryId: 5
      },
      {
        name: "Ergonomic Hand Trowel",
        slug: "ergonomic-hand-trowel",
        description: "Ergonomically designed hand trowel with comfortable grip and stainless steel construction.",
        shortDescription: "Ergonomic hand trowel with comfortable grip",
        price: 12.99,
        imageUrl: "/images/products/hand_trowel.svg",
        isBestSeller: true,
        categoryId: 5
      },
      {
        name: "Galvanized Steel Watering Can",
        slug: "galvanized-steel-watering-can",
        description: "Classic 2-gallon watering can with removable rose. Perfectly balanced for easy watering.",
        shortDescription: "Classic 2-gallon watering can with removable rose",
        price: 34.99,
        imageUrl: "/images/products/watering_can.svg",
        categoryId: 5
      },
      {
        name: "Heirloom Tomato Seed Collection",
        slug: "heirloom-tomato-seed-collection",
        description: "Collection of 6 heirloom tomato varieties, from cherry to beefsteak. Non-GMO and open-pollinated.",
        shortDescription: "Collection of 6 delicious heirloom tomato varieties",
        price: 18.99,
        imageUrl: "/images/products/tomato_seeds.svg",
        isNew: true,
        categoryId: 9
      }
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
    
    // Add new gardening articles
    const newArticles: InsertArticle[] = [
      {
        title: "Spring Gardening Tips for a Bountiful Season",
        slug: "spring-gardening-tips-bountiful-season",
        content: `<p>Spring is the perfect time to prepare your garden for a season of abundant growth. Here are essential tips to get your garden off to a great start.</p>
        <h2>Early Spring Garden Preparation</h2>
        <p>As soon as soil can be worked, clear out winter debris, add compost, and test your soil pH. Most vegetables and flowers prefer a slightly acidic to neutral pH (6.0-7.0). Adjust soil pH if necessary using lime to raise pH or sulfur to lower it.</p>
        <h2>Smart Seed Starting</h2>
        <p>Get a jump on the growing season by starting seeds indoors 6-8 weeks before your last frost date. Use a quality seed starting mix and provide consistent moisture and bright light. Harden off seedlings before transplanting by gradually exposing them to outdoor conditions over 7-10 days.</p>
        <h2>Strategic Planting Schedule</h2>
        <p>Follow a strategic planting schedule based on your local frost dates:</p>
        <ul>
          <li><strong>4-6 weeks before last frost:</strong> Plant cold-tolerant vegetables like peas, spinach, and radishes</li>
          <li><strong>2-4 weeks before last frost:</strong> Plant potatoes, carrots, beets, and onions</li>
          <li><strong>After last frost:</strong> Plant warm-season crops like tomatoes, peppers, and cucumbers</li>
        </ul>
        <h2>Water Management</h2>
        <p>Set up an efficient watering system early in the season. Drip irrigation or soaker hoses deliver water directly to plant roots while minimizing evaporation and fungal issues. Apply a 2-3 inch layer of mulch to conserve moisture and suppress weeds.</p>
        <h2>Pest Prevention</h2>
        <p>Take preventative measures against pests with these organic approaches:</p>
        <ul>
          <li>Install physical barriers like row covers for vulnerable young plants</li>
          <li>Plant companion flowers like marigolds and nasturtiums to repel certain pests</li>
          <li>Introduce beneficial insects like ladybugs and lacewings</li>
          <li>Implement crop rotation to disrupt pest life cycles</li>
        </ul>
        <h2>Early Season Maintenance</h2>
        <p>Stay ahead of garden maintenance by setting aside 15-30 minutes several times a week to pull young weeds, inspect plants for problems, and provide support for growing vines and stems before they need it.</p>
        <p>With these spring gardening tips, you'll create the foundation for a productive and beautiful garden throughout the growing season!</p>`,
        excerpt: "Set your garden up for success with these essential spring gardening tasks and tips for a productive growing season.",
        imageUrl: "/images/articles/spring_gardening_tips.svg",
        datePublished: new Date("2023-03-10"),
        categoryId: 1,
      },
      {
        title: "Composting Basics: Turn Kitchen Scraps into Garden Gold",
        slug: "composting-basics-kitchen-scraps-garden-gold",
        content: `<p>Composting is one of the most rewarding practices for any gardener. This simple process turns kitchen scraps and yard waste into nutrient-rich humus that will nourish your garden and reduce landfill waste.</p>
        <h2>Why Compost?</h2>
        <p>Homemade compost improves soil structure, adds essential nutrients, increases beneficial soil organisms, helps retain moisture, suppresses plant diseases, and reduces your environmental footprint by diverting organic matter from landfills.</p>
        <h2>Choosing Your Composting Method</h2>
        <h3>Traditional Pile or Bin</h3>
        <p>The simplest method is a basic pile or bin in a corner of your yard. This works well for those with ample outdoor space and mostly yard waste. For a more contained approach, use a purchased or DIY compost bin.</p>
        <h3>Tumbler Composting</h3>
        <p>Compost tumblers are fully enclosed containers that can be rotated, speeding up decomposition through increased aeration. They're ideal for small spaces and help deter pests.</p>
        <h3>Vermicomposting</h3>
        <p>For indoor composting, vermicomposting uses red wiggler worms to break down kitchen scraps quickly in a small container. It's perfect for apartments and produces extremely rich compost.</p>
        <h2>What to Compost</h2>
        <p><strong>Browns (Carbon-Rich Materials):</strong></p>
        <ul>
          <li>Dry leaves</li>
          <li>Straw or hay</li>
          <li>Shredded paper and cardboard</li>
          <li>Wood chips or sawdust</li>
          <li>Dried plant material</li>
        </ul>
        <p><strong>Greens (Nitrogen-Rich Materials):</strong></p>
        <ul>
          <li>Fruit and vegetable scraps</li>
          <li>Coffee grounds and filters</li>
          <li>Grass clippings</li>
          <li>Plant trimmings</li>
          <li>Eggshells</li>
        </ul>
        <h2>What to Avoid Composting</h2>
        <ul>
          <li>Meat, fish, and dairy products</li>
          <li>Oils and fats</li>
          <li>Diseased plants</li>
          <li>Pet waste</li>
          <li>Treated wood products</li>
        </ul>
        <h2>Building Your Compost Pile</h2>
        <p>For effective composting, maintain a ratio of approximately 3 parts browns to 1 part greens. Layer materials, adding browns first, then greens, and a thin layer of soil or finished compost to introduce microorganisms.</p>
        <h2>Maintaining Your Compost</h2>
        <p>Keep your compost pile as moist as a wrung-out sponge. Turn it regularly with a pitchfork or compost aerator tool to provide oxygen for microorganisms. In a well-maintained pile, you'll have finished compost in 2-6 months.</p>
        <h2>Using Your Compost</h2>
        <p>Finished compost looks like dark, crumbly soil with an earthy smell. Use it to topdress garden beds, mix into potting soil, use as a seed starting medium, or make compost tea for liquid fertilizer.</p>
        <p>With these basics, you'll be well on your way to creating your own garden gold while reducing waste!</p>`,
        excerpt: "Learn the fundamentals of composting to transform household waste into valuable garden fertilizer.",
        imageUrl: "/images/articles/composting_basics.svg",
        datePublished: new Date("2023-03-15"),
        categoryId: 6,
      },
      {
        title: "Identifying and Managing Common Garden Pests Naturally",
        slug: "identifying-managing-garden-pests-naturally",
        content: `<p>Every gardener faces pest challenges, but with vigilance and the right techniques, you can manage these unwelcome visitors while maintaining an eco-friendly garden.</p>
        <h2>Common Garden Pests and Natural Solutions</h2>
        <h3>Aphids</h3>
        <p><strong>Identification:</strong> Tiny pear-shaped insects in clusters on stems and leaf undersides, often green but can be black, brown, red, or yellow.</p>
        <p><strong>Natural Control:</strong></p>
        <ul>
          <li>Spray plants with strong stream of water to dislodge aphids</li>
          <li>Introduce or attract ladybugs and lacewings</li>
          <li>Apply insecticidal soap or neem oil solution</li>
          <li>Plant aphid-repelling companions like garlic, chives, and nasturtiums</li>
        </ul>
        <h3>Tomato Hornworms</h3>
        <p><strong>Identification:</strong> Large green caterpillars with white diagonal stripes and a horn-like projection, can grow up to 4 inches long.</p>
        <p><strong>Natural Control:</strong></p>
        <ul>
          <li>Handpick and relocate or dispose</li>
          <li>Watch for hornworms with small white cocoons (parasitic wasp eggs) and leave these intact</li>
          <li>Apply Bacillus thuringiensis (Bt), a natural bacteria</li>
          <li>Plant dill and marigolds as companions</li>
        </ul>
        <h3>Cucumber Beetles</h3>
        <p><strong>Identification:</strong> Yellow-green beetles with black spots or stripes that attack cucumber family plants.</p>
        <p><strong>Natural Control:</strong></p>
        <ul>
          <li>Use yellow sticky traps</li>
          <li>Cover young plants with row covers (remove when flowering for pollination)</li>
          <li>Apply kaolin clay</li>
          <li>Plant radishes and nasturtiums as trap crops</li>
        </ul>
        <h3>Cabbage Worms</h3>
        <p><strong>Identification:</strong> Velvety green caterpillars that feed on cabbage family plants, leaving holes in leaves.</p>
        <p><strong>Natural Control:</strong></p>
        <ul>
          <li>Inspect plants regularly and remove by hand</li>
          <li>Use lightweight row covers</li>
          <li>Apply Bt spray</li>
          <li>Plant thyme and rosemary nearby</li>
        </ul>
        <h3>Spider Mites</h3>
        <p><strong>Identification:</strong> Tiny spider-like pests that create fine webbing on plants; leaves appear stippled or bronzed.</p>
        <p><strong>Natural Control:</strong></p>
        <ul>
          <li>Increase humidity around plants with regular misting</li>
          <li>Spray plants forcefully with water</li>
          <li>Apply neem oil or insecticidal soap</li>
          <li>Introduce predatory mites</li>
        </ul>
        <h2>Prevention is Key</h2>
        <ul>
          <li><strong>Build healthy soil</strong> to grow strong plants that can resist pests</li>
          <li><strong>Practice crop rotation</strong> to disrupt pest life cycles</li>
          <li><strong>Encourage beneficial insects</strong> by planting diverse flowers</li>
          <li><strong>Keep plants well-watered and properly spaced</strong> for good air circulation</li>
          <li><strong>Clean up garden debris</strong> in fall to eliminate overwintering sites</li>
        </ul>
        <h2>Creating an Integrated Pest Management Plan</h2>
        <p>Develop a multi-faceted approach:</p>
        <ol>
          <li>Monitor regularly for early detection</li>
          <li>Identify pests correctly before taking action</li>
          <li>Set thresholds for when intervention is necessary</li>
          <li>Use least-toxic methods first, moving to stronger options only if needed</li>
          <li>Record what works for future reference</li>
        </ol>
        <p>With patience and consistent application of these natural methods, you can keep pest damage to a minimum while maintaining a healthy ecosystem in your garden.</p>`,
        excerpt: "Learn to identify common garden pests and control them using natural, environmentally friendly methods.",
        imageUrl: "/images/articles/garden_pests.svg",
        datePublished: new Date("2023-04-22"),
        categoryId: 7,
      },
      {
        title: "The Complete Guide to Watering Your Garden Efficiently",
        slug: "complete-guide-watering-garden-efficiently",
        content: `<p>Water is a precious resource and the lifeblood of your garden. Learning to water efficiently saves time, money, and resources while growing healthier plants.</p>
        <h2>Understanding Plant Water Needs</h2>
        <p>Different plants have different water requirements. Generally:</p>
        <ul>
          <li><strong>Vegetables:</strong> Consistent moisture, especially during fruit development</li>
          <li><strong>Established Trees and Shrubs:</strong> Deep, infrequent watering</li>
          <li><strong>Perennial Flowers:</strong> Medium moisture, allowing soil to slightly dry between waterings</li>
          <li><strong>Succulents and Xeriscape Plants:</strong> Minimal water, with soil drying completely between waterings</li>
        </ul>
        <h2>Signs of Improper Watering</h2>
        <h3>Underwatering Signs:</h3>
        <ul>
          <li>Wilting that doesn't recover in evening</li>
          <li>Curling or yellowing leaves</li>
          <li>Dry, crumbly soil</li>
          <li>Slowed or stopped growth</li>
        </ul>
        <h3>Overwatering Signs:</h3>
        <ul>
          <li>Yellowing leaves throughout plant</li>
          <li>Soft, limp stems</li>
          <li>Mold on soil surface</li>
          <li>Root rot (dark, soft roots)</li>
        </ul>
        <h2>When to Water</h2>
        <p>Timing matters almost as much as quantity:</p>
        <ul>
          <li><strong>Early morning</strong> (5-9am) is ideal – less evaporation, lower wind, and plants have moisture during heat of day</li>
          <li><strong>Avoid midday watering</strong> – much water is lost to evaporation</li>
          <li><strong>Evening watering is acceptable</strong> but can increase fungal disease risk if foliage stays wet overnight</li>
        </ul>
        <p>The finger test is reliable: insert your finger 2 inches into the soil – if it feels dry, it's time to water.</p>
        <h2>Efficient Watering Methods</h2>
        <h3>Drip Irrigation</h3>
        <p>The most efficient system, delivering water directly to plant roots with minimal evaporation. Benefits include:</p>
        <ul>
          <li>Water savings of 30-50% compared to sprinklers</li>
          <li>Reduced weed growth and fungal diseases</li>
          <li>Ability to automate with timers</li>
        </ul>
        <h3>Soaker Hoses</h3>
        <p>Porous hoses that "sweat" water along their length, ideal for rows of vegetables or perennial beds.</p>
        <h3>Hand Watering</h3>
        <p>While time-consuming, allows precise control and observation of your plants. Use a watering wand with breaker nozzle to deliver gentle shower.</p>
        <h3>Sprinklers</h3>
        <p>Less efficient but useful for lawns and large areas. Run early morning to minimize evaporation.</p>
        <h2>How to Water Correctly</h2>
        <p>Proper technique maximizes benefits:</p>
        <ul>
          <li><strong>Water deeply and infrequently</strong> to encourage deep root growth</li>
          <li><strong>Focus on the root zone</strong>, not leaves</li>
          <li><strong>Water until moisture reaches root depth</strong> – 6-8 inches for most vegetables and perennials</li>
          <li><strong>Apply water slowly</strong> to prevent runoff and allow absorption</li>
        </ul>
        <h2>Water-Saving Strategies</h2>
        <ul>
          <li><strong>Mulch extensively</strong> – 2-3 inches of organic mulch reduces evaporation by 70%</li>
          <li><strong>Group plants by water needs</strong> (hydrozoning)</li>
          <li><strong>Collect rainwater</strong> in barrels or cisterns</li>
          <li><strong>Install smart irrigation controllers</strong> with soil moisture sensors or weather-based adjustments</li>
          <li><strong>Fix leaks promptly</strong> – even small drips waste gallons</li>
        </ul>
        <p>By tailoring your watering approach to your plants' specific needs and using efficient techniques, you'll grow healthier plants while conserving one of our most valuable resources.</p>`,
        excerpt: "Master the art of garden watering with techniques that conserve water while keeping your plants thriving.",
        imageUrl: "/images/articles/watering_guide.svg",
        datePublished: new Date("2023-06-05"),
        categoryId: 1,
      },
      {
        title: "Soil Improvement Strategies for a Thriving Garden",
        slug: "soil-improvement-strategies-thriving-garden",
        content: `<p>The foundation of any successful garden is healthy soil. Whether you're dealing with clay, sand, or something in between, these soil improvement strategies will transform your garden's productivity.</p>
        <h2>Understanding Your Soil</h2>
        <p>Before making improvements, get to know what you're working with:</p>
        <h3>Soil Testing</h3>
        <p>Conduct a soil test through your local extension office or with a home kit to determine:</p>
        <ul>
          <li>pH level (ideal range for most plants: 6.0-7.0)</li>
          <li>Nutrient levels (nitrogen, phosphorus, potassium)</li>
          <li>Organic matter content</li>
          <li>Potential contaminants</li>
        </ul>
        <h3>Soil Texture Assessment</h3>
        <p>Perform a simple jar test: fill a clear jar 1/3 with soil, add water, shake vigorously, and let settle for 24 hours. Sand settles first, then silt, then clay on top, showing your soil's composition.</p>
        <h2>Building Organic Matter: The Key to Better Soil</h2>
        <p>Increasing organic matter improves soil structure, water retention, drainage, and nutrient availability in all soil types.</p>
        <h3>Compost: Garden Gold</h3>
        <p>Add 2-4 inches of compost annually by:</p>
        <ul>
          <li>Top-dressing existing beds in spring and fall</li>
          <li>Working it into new beds before planting</li>
          <li>Making compost tea for liquid fertilizer</li>
        </ul>
        <h3>Mulch: Protection and Improvement</h3>
        <p>Apply 2-3 inches of organic mulch such as:</p>
        <ul>
          <li>Shredded leaves or leaf mold</li>
          <li>Straw (not hay, which contains seeds)</li>
          <li>Wood chips (for paths and perennial beds)</li>
          <li>Pine needles (excellent for acid-loving plants)</li>
        </ul>
        <h3>Cover Crops: Living Soil Improvers</h3>
        <p>Plant these "green manures" in off-seasons or fallow areas:</p>
        <ul>
          <li><strong>Legumes</strong> (clover, vetch, peas) fix nitrogen</li>
          <li><strong>Grasses</strong> (winter rye, oats) add organic matter and prevent erosion</li>
          <li><strong>Buckwheat</strong> suppresses weeds and attracts beneficial insects</li>
        </ul>
        <h2>Addressing Specific Soil Challenges</h2>
        <h3>Improving Clay Soil</h3>
        <p>Clay soil is nutrient-rich but drains poorly. Improve by:</p>
        <ul>
          <li>Adding coarse organic matter like leaf mold and aged wood chips</li>
          <li>Incorporating expanded shale or perlite</li>
          <li>Building raised beds above problem areas</li>
          <li>Never working clay soil when wet</li>
        </ul>
        <h3>Enhancing Sandy Soil</h3>
        <p>Sandy soil drains quickly but loses nutrients. Enhance by:</p>
        <ul>
          <li>Adding compost, leaf mold, and coco coir</li>
          <li>Using cover crops frequently</li>
          <li>Applying clay-rich soil amendments</li>
          <li>Mulching heavily to retain moisture</li>
        </ul>
        <h3>Balancing Soil pH</h3>
        <ul>
          <li><strong>To raise pH</strong> (make more alkaline): add garden lime or wood ash</li>
          <li><strong>To lower pH</strong> (make more acidic): add elemental sulfur, pine needles, or peat moss</li>
        </ul>
        <h2>No-Till Gardening: Protecting Soil Structure</h2>
        <p>Minimize soil disturbance to preserve beneficial organisms and soil structure:</p>
        <ul>
          <li>Use broadforks to aerate without inverting soil layers</li>
          <li>Top-dress with compost instead of digging it in</li>
          <li>Use sheet mulching to establish new beds without tilling</li>
          <li>Plant into holes rather than turning entire beds</li>
        </ul>
        <h2>Feeding the Soil Web</h2>
        <p>Healthy soil is alive with billions of organisms that support plant health:</p>
        <ul>
          <li>Apply compost tea to introduce beneficial microorganisms</li>
          <li>Limit synthetic fertilizers that can harm soil life</li>
          <li>Grow diverse plant species to support diverse soil biology</li>
          <li>Minimize pesticides that kill beneficial soil insects</li>
        </ul>
        <p>Remember, building great soil is a long-term process. Each season of thoughtful care creates a more vibrant, productive garden that requires less input and provides greater rewards.</p>`,
        excerpt: "Discover proven techniques to enhance your soil quality for healthier plants and better harvests.",
        imageUrl: "/images/articles/soil_improvement.svg",
        datePublished: new Date("2023-02-18"),
        categoryId: 6,
      }
    ];
    
    // Create articles
    articles.forEach(article => {
      this.createArticle(article);
    });
    
    // Add new articles
    newArticles.forEach(article => {
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
