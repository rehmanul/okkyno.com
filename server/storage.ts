import {
  users,
  categories,
  products,
  articles,
  testimonials,
  subscribers,
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type Article,
  type InsertArticle,
  type Testimonial,
  type InsertTestimonial,
  type Subscriber,
  type InsertSubscriber,
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
    // Ensure all required fields have values
    const category: Category = {
      id,
      name: insertCategory.name,
      slug: insertCategory.slug,
      description: insertCategory.description || null,
      imageUrl: insertCategory.imageUrl || null,
      parentId: insertCategory.parentId || null,
    };
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
    // Ensure all required fields have values
    const product: Product = {
      id,
      name: insertProduct.name,
      slug: insertProduct.slug,
      description: insertProduct.description || null,
      shortDescription: insertProduct.shortDescription || null,
      price: insertProduct.price,
      salePrice: insertProduct.salePrice || null,
      imageUrl: insertProduct.imageUrl || "",
      isBestSeller: insertProduct.isBestSeller || null,
      isNew: insertProduct.isNew || null,
      categoryId: insertProduct.categoryId,
    };
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
    // Ensure all required fields have values
    const article: Article = {
      id,
      slug: insertArticle.slug,
      title: insertArticle.title,
      content: insertArticle.content,
      categoryId: insertArticle.categoryId,
      imageUrl: insertArticle.imageUrl || "",
      excerpt: insertArticle.excerpt || null,
      datePublished: insertArticle.datePublished,
    };
    this.articles.set(id, article);
    return article;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(
    insertTestimonial: InsertTestimonial,
  ): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    // Ensure all required fields have values
    const testimonial: Testimonial = {
      id,
      personName: insertTestimonial.personName,
      content: insertTestimonial.content,
      rating: insertTestimonial.rating,
      role: insertTestimonial.role || null,
      avatarUrl: insertTestimonial.avatarUrl || null,
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Subscriber methods
  async createSubscriber(
    insertSubscriber: InsertSubscriber,
  ): Promise<Subscriber> {
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
      dateSubscribed: new Date(),
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
        (product.description &&
          product.description.toLowerCase().includes(lowercaseQuery)),
    );

    const matchedArticles = Array.from(this.articles.values()).filter(
      (article) =>
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery) ||
        (article.excerpt &&
          article.excerpt.toLowerCase().includes(lowercaseQuery)),
    );

    const matchedCategories = Array.from(this.categories.values()).filter(
      (category) =>
        category.name.toLowerCase().includes(lowercaseQuery) ||
        (category.description &&
          category.description.toLowerCase().includes(lowercaseQuery)),
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
      // Main categories
      {
        name: "Fruit Trees",
        slug: "fruit-trees",
        description:
          "Premium fruit trees including apple, cherry, fig, and citrus varieties for home orchards",
        imageUrl: "/images/products/honeycrisp-apple-tree.svg",
        parentId: null,
      } as InsertCategory,
      {
        name: "Vegetables",
        slug: "vegetables",
        description:
          "Seeds, plants, and supplies for growing your own delicious vegetables",
        imageUrl:
          "/images/categories/3139i_Bean-Bush-Goldrush-ORG-new2025_ndzu9h.svg",
        parentId: null,
      },
      {
        name: "Flowers",
        slug: "flowers",
        description:
          "Beautify your garden with a wide variety of flowering plants",
        imageUrl: "/images/categories/2026i_Nasturtium-Fiesta-Blend_6ceu81.svg",
        parentId: null,
      },
      {
        name: "Container Gardening",
        slug: "container-gardening",
        description:
          "Everything you need for successful gardening in pots and planters",
        imageUrl:
          "/images/categories/10331_Medium_Tall_LightClay_Compressed.svg",
        parentId: null,
      },
      {
        name: "Herbs",
        slug: "herbs",
        description: "Culinary and medicinal herbs to grow at home",
        imageUrl: "/images/categories/herbs_category.svg",
        parentId: null,
      },
      {
        name: "Tools",
        slug: "tools",
        description: "Quality gardening tools for every task",
        imageUrl: "/images/categories/tools_category.svg",
        parentId: null,
      },
      // Subcategories for Tools
      {
        name: "Hand Tools",
        slug: "hand-tools",
        description: "Essential hand tools for precise gardening work",
        imageUrl: "/images/products/garden_pruner.svg",
        parentId: 6, // Assuming Tools is category ID 6
      } as InsertCategory,
      {
        name: "Pruning Tools",
        slug: "pruning-tools",
        description: "Specialized tools for pruning and shaping plants",
        imageUrl: "/images/products/hedge-shears.svg",
        parentId: 6,
      } as InsertCategory,
      {
        name: "Power Tools",
        slug: "power-tools",
        description:
          "Electric and gas-powered tools for bigger gardening tasks",
        imageUrl: "/images/products/electric-garden-tiller.svg",
        parentId: 6,
      } as InsertCategory,
      {
        name: "Watering Tools",
        slug: "watering-tools",
        description: "Tools and equipment for efficient plant watering",
        imageUrl: "/images/products/watering-can.svg",
        parentId: 6,
      } as InsertCategory,
      {
        name: "Composting",
        slug: "composting",
        description:
          "Turn kitchen scraps and yard waste into valuable garden gold",
        imageUrl: "/images/products/compost_bin.svg",
        parentId: null,
      },
      {
        name: "Fertilizers",
        slug: "fertilizers",
        description:
          "Organic and conventional fertilizers for healthier plants",
        imageUrl: "/images/categories/fertilizers_category.svg",
        parentId: null,
      },
      {
        name: "Pest Control",
        slug: "pest-control",
        description: "Eco-friendly solutions for garden pests and diseases",
        imageUrl: "/images/categories/pest_control_category.svg",
        parentId: null,
      },
      {
        name: "Seeds",
        slug: "seeds",
        description: "High-quality seeds for vegetables, herbs, and flowers",
        imageUrl:
          "/images/articles/4560i-Heirloom-ORG-Seed-Bank-Collection_35vk3o_m4m7ls.svg",
        parentId: null,
      },
      {
        name: "Raised Beds",
        slug: "raised-beds",
        description: "Modern raised garden beds for productive growing spaces",
        imageUrl: "/images/articles/10344_Small_Tall_SlateGrey_Compressed.svg",
        parentId: null,
      },
      {
        name: "Seed Starting",
        slug: "seed-starting",
        description: "Everything you need to start seeds indoors and out",
        imageUrl: "/images/products/16-celltray2_400x400.svg",
        parentId: null,
      },
      {
        name: "Indoor Growing",
        slug: "indoor-growing",
        description:
          "Lights, hydroponics, and supplies for growing plants indoors year-round",
        imageUrl: "/images/products/grow-light-led-panel.svg",
        parentId: null,
      },
      {
        name: "Garden Décor",
        slug: "garden-decor",
        description:
          "Beautify your outdoor space with functional and decorative garden elements",
        imageUrl: "/images/products/solar-garden-lights.svg",
        parentId: null,
      },

      // Subcategories - Tools
      {
        name: "Hand Tools",
        slug: "hand-tools",
        description: "Quality hand tools for precision gardening tasks",
        imageUrl: "/images/products/hand-trowel.svg",
        parentId: 6, // Parent: Tools
      },
      {
        name: "Power Tools",
        slug: "power-tools",
        description: "Efficient power tools to make gardening easier",
        imageUrl: "/images/products/electric-garden-tiller.svg",
        parentId: 6, // Parent: Tools
      },
      {
        name: "Watering Tools",
        slug: "watering-tools",
        description: "Everything you need to keep your garden hydrated",
        imageUrl: "/images/products/garden-hose-nozzle.svg",
        parentId: 6, // Parent: Tools
      },
      {
        name: "Pruning Tools",
        slug: "pruning-tools",
        description: "Precise pruning tools for plant maintenance and health",
        imageUrl: "/images/products/bypass-pruners.svg",
        parentId: 6, // Parent: Tools
      },

      // Subcategories - Indoor Growing
      {
        name: "Grow Lights",
        slug: "grow-lights",
        description: "LED grow lights for indoor gardening and seed starting",
        imageUrl: "/images/categories/grow_lights_category.svg",
        parentId: 13, // Parent: Indoor Growing
      },
      {
        name: "Hydroponics",
        slug: "hydroponics",
        description: "Systems and supplies for soil-free growing",
        imageUrl: "/images/products/hydroponic-system.svg",
        parentId: 13, // Parent: Indoor Growing
      },

      // Subcategories - Seeds
      {
        name: "Vegetable Seeds",
        slug: "vegetable-seeds",
        description: "High-quality vegetable seeds for your edible garden",
        imageUrl: "/images/products/vegetable-seed-collection.svg",
        parentId: 10, // Parent: Seeds
      },
      {
        name: "Flower Seeds",
        slug: "flower-seeds",
        description: "Beautiful flower seeds to brighten your garden",
        imageUrl: "/images/products/flower-seed-collection.svg",
        parentId: 10, // Parent: Seeds
      },
      {
        name: "Herb Seeds",
        slug: "herb-seeds",
        description: "Culinary and medicinal herb seeds for your garden",
        imageUrl: "/images/products/herb-seed-collection.svg",
        parentId: 10, // Parent: Seeds
      },
    ];

    // Create categories
    categories.forEach((category) => {
      this.createCategory(category);
    });

    // Sample products based on Epic Gardening website
    const products: InsertProduct[] = [
      // Fruit Trees
      {
        name: "Honeycrisp Apple Tree",
        slug: "honeycrisp-apple-tree",
        description:
          "The Honeycrisp Apple Tree produces sweet, crisp apples that are perfect for fresh eating. This popular variety is known for its exceptional flavor and crunch.",
        shortDescription: "Sweet, crisp apples with exceptional flavor",
        price: 99.99,
        imageUrl: "/images/products/honeycrisp-apple-tree.svg",
        isBestSeller: true,
        categoryId: 1,
      },
      {
        name: "Bing Cherry Tree",
        slug: "bing-cherry-tree",
        description:
          "The Bing Cherry Tree produces large, sweet dark cherries that are perfect for fresh eating or baking. This popular variety is a must-have for cherry lovers.",
        shortDescription:
          "Large, sweet dark cherries for fresh eating or baking",
        price: 89.99,
        imageUrl: "/images/products/bing-cherry-tree.svg",
        categoryId: 1,
      },
      {
        name: "Wonderful Pomegranate Tree",
        slug: "wonderful-pomegranate-tree",
        description:
          "The Wonderful Pomegranate Tree produces large, juicy fruits with vibrant red arils. This popular variety is known for its sweet-tart flavor and nutritional benefits.",
        shortDescription: "Large, juicy pomegranates with sweet-tart flavor",
        price: 79.99,
        imageUrl: "/images/products/wonderful-pomegranate-tree.svg",
        categoryId: 1,
      },
      {
        name: "Chicago Hardy Fig Tree",
        slug: "chicago-hardy-fig-tree",
        description:
          "The Chicago Hardy Fig Tree is an exceptionally cold-hardy variety that produces sweet, purple-brown figs. It can die back to the ground in winter and still produce fruit the following year.",
        shortDescription:
          "Cold-hardy fig variety that produces sweet, purple-brown figs",
        price: 69.99,
        imageUrl: "/images/products/chicago-hardy-fig-tree.svg",
        isBestSeller: true,
        categoryId: 1,
      },
      {
        name: "Frost Peach Tree",
        slug: "frost-peach-tree",
        description:
          "The Frost Peach Tree produces large, yellow-fleshed peaches with a sweet flavor. This variety is known for its excellent disease resistance.",
        shortDescription:
          "Large, sweet peaches with excellent disease resistance",
        price: 89.99,
        imageUrl: "/images/products/frost-peach-tree.svg",
        categoryId: 1,
      },
      // Berries and Vines
      {
        name: "Prolific Kiwi (Self-Fertile)",
        slug: "kiwi-prolific-self-fertile",
        description:
          "This self-fertile kiwi variety doesn't require a male pollinator to produce fruit. It produces sweet, flavorful kiwis on a vigorous vine.",
        shortDescription:
          "Self-fertile kiwi that produces sweet, flavorful fruits",
        price: 39.99,
        imageUrl: "/images/products/kiwi-prolific-self-fertile.svg",
        categoryId: 1,
      },
      {
        name: "Thornless Blackberry Bush",
        slug: "thornless-blackberry-bush",
        description:
          "This thornless blackberry variety produces large, sweet berries on canes without thorns, making harvesting easy and painless.",
        shortDescription:
          "Large, sweet blackberries on thornless canes for easy harvesting",
        price: 29.99,
        imageUrl: "/images/products/thornless-blackberry-bush.svg",
        isBestSeller: true,
        categoryId: 1,
      },
      {
        name: "Pink Lemonade Blueberry",
        slug: "pink-lemonade-blueberry",
        description:
          "This unique blueberry variety produces sweet, pink berries with a delicious flavor. It's a beautiful ornamental plant that also provides tasty fruit.",
        shortDescription:
          "Unique blueberry with sweet, pink berries and ornamental value",
        price: 34.99,
        imageUrl: "/images/products/pink-lemonade-blueberry.svg",
        categoryId: 1,
      },
      // Seed Starting Supplies
      {
        name: "Epic 16-Cell Seed Starting Trays",
        slug: "epic-16-cell-seed-starting-trays",
        description:
          "Professional seed starting system with 16 individual cells, perfect for starting vegetables, flowers, and herbs.",
        shortDescription: "Professional 16-cell seed starting system",
        price: 19.99,
        imageUrl: "/images/products/16-celltray2_400x400.svg",
        isNew: true,
        categoryId: 11,
      },
      {
        name: "6-Cell Garden Propagation Trays",
        slug: "epic-tray-6-cell-garden-propagation-trays",
        description:
          "Durable 6-cell seed starting tray with individual cells for better root development. Perfect for starting larger seedlings.",
        shortDescription:
          "6-cell propagation system for strong seedling development",
        price: 14.99,
        imageUrl: "/images/products/6cellblack_400x400.svg",
        categoryId: 11,
      },
      {
        name: "4-Cell Garden Propagation Trays",
        slug: "epic-tray-4-cell-garden-propagation-trays",
        description:
          "Perfect beginner seed starting system with 4 large cells for better root development. Ideal for larger seedlings.",
        shortDescription:
          "4-cell propagation system with large cells for healthy roots",
        price: 12.99,
        imageUrl: "/images/products/4-cell-side-compressed_400x400.svg",
        categoryId: 11,
      },
      {
        name: "6-Cell Germination Dome Kit",
        slug: "epic-tray-6-cell-germination-dome-and-bottom-tray",
        description:
          "Complete seed starting kit with 6 cells, humidity dome, and bottom tray for water. Creates the perfect environment for seed germination.",
        shortDescription:
          "Complete 6-cell seed starting kit with humidity dome",
        price: 16.99,
        imageUrl:
          "/images/products/4CellDomeWithBottomSmallGardenStarterKits_59f087c6-7e6c-41ee-b5af-765c31bbc57c_20_1_400x400.svg",
        isBestSeller: true,
        categoryId: 11,
      },
      // Raised Beds
      {
        name: "Round Metal Raised Garden Bed",
        slug: "round-short-metal-raised-bed",
        description:
          "This beautiful round raised garden bed is perfect for growing vegetables, flowers, or herbs. Made from durable galvanized steel with a Light Clay finish.",
        shortDescription:
          "Durable galvanized steel raised bed with Light Clay finish",
        price: 99.99,
        imageUrl: "/images/products/10328_Large_short_LightClay.svg",
        isBestSeller: true,
        categoryId: 10,
      },
      {
        name: "Medium Tall Metal Raised Garden Bed",
        slug: "medium-tall-metal-raised-bed",
        description:
          "Stylish medium height raised garden bed in Light Clay finish. Perfect for vegetables that need deeper soil.",
        shortDescription:
          "Stylish medium height metal raised bed in Light Clay finish",
        price: 119.99,
        imageUrl:
          "/images/categories/10331_Medium_Tall_LightClay_Compressed.svg",
        categoryId: 10,
      },
      {
        name: "Small Tall Metal Raised Garden Bed",
        slug: "small-tall-metal-raised-bed",
        description:
          "Space-saving tall raised garden bed in Slate Grey finish. Ideal for small spaces and patio gardening.",
        shortDescription:
          "Space-saving tall metal planter in elegant Slate Grey",
        price: 89.99,
        imageUrl: "/images/articles/10344_Small_Tall_SlateGrey_Compressed.svg",
        categoryId: 10,
      },
      // Seeds
      {
        name: "Zinnia Persian Carpet Seeds",
        slug: "zinnia-persian-carpet-seeds",
        description:
          "Beautiful bi-color zinnia mix with gold, mahogany, and burgundy blooms. Easy to grow and perfect for cut flowers.",
        shortDescription:
          "Stunning bi-color zinnia mix for dramatic garden display",
        price: 4.99,
        imageUrl: "/images/products/1193i_Zinnia-Persian-Carpet_3oykxo.svg",
        categoryId: 9,
      },
      {
        name: "Nasturtium Fiesta Blend Seeds",
        slug: "nasturtium-fiesta-blend-seeds",
        description:
          "Vibrant mix of edible Nasturtium flowers in red, orange, and yellow shades. Great for containers or garden borders.",
        shortDescription:
          "Colorful, edible nasturtium flowers for containers or borders",
        price: 3.99,
        imageUrl: "/images/categories/2026i_Nasturtium-Fiesta-Blend_6ceu81.svg",
        isBestSeller: true,
        categoryId: 9,
      },
      {
        name: "Bean Bush Goldrush Organic Seeds",
        slug: "bean-bush-goldrush-organic-seeds",
        description:
          "Organic yellow bush bean seeds for abundant harvests. Disease resistant and easy to grow.",
        shortDescription:
          "Organic yellow bush beans - high yield and disease resistant",
        price: 4.29,
        imageUrl:
          "/images/categories/3139i_Bean-Bush-Goldrush-ORG-new2025_ndzu9h.svg",
        isNew: true,
        categoryId: 9,
      },
      {
        name: "Heirloom Organic Seed Collection",
        slug: "heirloom-organic-seed-bank",
        description:
          "Comprehensive collection of 25 heirloom organic vegetable, herb, and flower seeds for a complete garden.",
        shortDescription:
          "25 varieties of heirloom organic seeds for a complete garden",
        price: 29.99,
        imageUrl:
          "/images/articles/4560i-Heirloom-ORG-Seed-Bank-Collection_35vk3o_m4m7ls.svg",
        isBestSeller: true,
        categoryId: 9,
      },
      {
        name: "Heirloom Tomato Seed Collection",
        slug: "heirloom-tomato-seed-collection",
        description:
          "Collection of 6 heirloom tomato varieties, from cherry to beefsteak. Non-GMO and open-pollinated.",
        shortDescription: "Collection of 6 delicious heirloom tomato varieties",
        price: 18.99,
        imageUrl: "/images/products/tomato_seeds.svg",
        isNew: true,
        categoryId: 9,
      },
      {
        name: "Butterfly Seed Mix",
        slug: "butterfly-seed-mix",
        description:
          "Special blend of annual and perennial flowers selected to attract and support butterflies throughout the growing season.",
        shortDescription:
          "Colorful flower mix to attract butterflies to your garden",
        price: 6.99,
        imageUrl: "/images/products/butterfly-seed-mix.svg",
        categoryId: 9,
      },
      {
        name: "Wildflower Seed Mix",
        slug: "wildflower-seed-mix",
        description:
          "Colorful blend of native and naturalized wildflowers that provides season-long color and attracts beneficial insects.",
        shortDescription:
          "Easy-to-grow wildflower mix for naturalistic plantings",
        price: 5.99,
        imageUrl: "/images/products/wildflower-seed-mix.svg",
        categoryId: 9,
      },
      {
        name: "Basil Seed Collection",
        slug: "basil-seed-collection",
        description:
          "Gourmet collection of 5 distinctive basil varieties including Sweet, Thai, Lemon, Purple, and Spicy Globe.",
        shortDescription: "5 gourmet basil varieties for culinary versatility",
        price: 8.99,
        imageUrl: "/images/products/basil-seed-collection.svg",
        categoryId: 9,
      },
      {
        name: "Lettuce Seed Collection",
        slug: "lettuce-seed-collection",
        description:
          "Mix of 6 gourmet lettuce varieties in different colors, textures, and flavors for continuous salad harvests.",
        shortDescription: "Colorful mix of lettuce varieties for fresh salads",
        price: 7.99,
        imageUrl: "/images/products/lettuce-seed-collection.svg",
        categoryId: 9,
      },
      {
        name: "Microgreens Seed Mix",
        slug: "microgreens-seed-mix",
        description:
          "Fast-growing blend of nutritious microgreens including radish, broccoli, kale, and sunflower for year-round indoor harvests.",
        shortDescription:
          "Nutritious microgreens mix for quick indoor harvests",
        price: 9.99,
        imageUrl: "/images/products/microgreens-seed-mix.svg",
        isNew: true,
        categoryId: 9,
      },
      {
        name: "Hot Pepper Seed Collection",
        slug: "hot-pepper-seed-collection",
        description:
          "Fiery collection of 5 hot pepper varieties ranging from mild to super-hot for adventurous gardeners.",
        shortDescription: "Spicy pepper collection with varied heat levels",
        price: 12.99,
        imageUrl: "/images/products/hot-pepper-seed-collection.svg",
        categoryId: 9,
      },
      // Garden tools - Hand Tools category
      {
        name: "Premium Garden Gloves",
        slug: "premium-garden-gloves",
        description:
          "Durable and comfortable garden gloves with reinforced fingertips. Perfect for all gardening tasks.",
        shortDescription: "Durable garden gloves with reinforced fingertips",
        price: 14.99,
        imageUrl: "/images/products/garden_gloves.svg",
        categoryId: 15, // Hand Tools
      },
      {
        name: "Ergonomic Hand Trowel",
        slug: "ergonomic-hand-trowel",
        description:
          "Ergonomically designed hand trowel with comfortable grip and stainless steel construction.",
        shortDescription: "Ergonomic hand trowel with comfortable grip",
        price: 12.99,
        imageUrl: "/images/products/hand_trowel.svg",
        isBestSeller: true,
        categoryId: 15, // Hand Tools
      },
      {
        name: "Garden Hand Pruner",
        slug: "garden-hand-pruner",
        description:
          "Sharp, precision garden pruners with comfort grip handles. Perfect for deadheading and small pruning tasks.",
        shortDescription: "Precision pruners for small garden tasks",
        price: 19.99,
        imageUrl: "/images/products/garden_pruner.svg",
        categoryId: 18, // Pruning Tools
      },
      {
        name: "Bypass Loppers",
        slug: "bypass-loppers",
        description:
          "Heavy-duty bypass loppers for cutting branches up to 1.5 inches thick. Telescoping handles extend reach.",
        shortDescription: "Heavy-duty loppers for thicker branches",
        price: 34.99,
        imageUrl: "/images/products/bypass-loppers.svg",
        isNew: true,
        categoryId: 18, // Pruning Tools
      },
      {
        name: "Hedge Shears",
        slug: "hedge-shears",
        description:
          "Precision hedge shears with wavy blade design for clean cuts. Shock-absorbing bumpers reduce fatigue.",
        shortDescription: "Precision hedge shears for clean, accurate cuts",
        price: 29.99,
        imageUrl: "/images/products/hedge-shears.svg",
        categoryId: 18, // Pruning Tools
      },
      {
        name: "Folding Hand Saw",
        slug: "folding-hand-saw",
        description:
          "Compact folding saw with triple-ground teeth for efficient cutting. Locks in open and closed positions.",
        shortDescription: "Compact folding saw for pruning small branches",
        price: 16.99,
        imageUrl: "/images/products/folding-hand-saw.svg",
        categoryId: 18, // Pruning Tools
      },
      {
        name: "Garden Cultivator",
        slug: "garden-cultivator",
        description:
          "Three-prong garden cultivator for breaking up soil and removing weeds. Comfortable ergonomic handle.",
        shortDescription: "Three-prong cultivator for soil aeration",
        price: 15.99,
        imageUrl: "/images/products/garden-cultivator.svg",
        categoryId: 15, // Hand Tools
      },
      {
        name: "Garden Digging Spade",
        slug: "garden-digging-spade",
        description:
          "Heavy-duty digging spade with carbon steel blade and comfortable D-handle grip. Perfect for digging and edging.",
        shortDescription: "Heavy-duty digging spade for garden prep",
        price: 29.99,
        imageUrl: "/images/products/garden-spade.svg",
        categoryId: 15, // Hand Tools
      },
      {
        name: "Garden Fork",
        slug: "garden-fork",
        description:
          "Four-tine garden fork ideal for turning soil, lifting plants, and adding compost. Durable steel construction.",
        shortDescription: "Four-tine garden fork for soil work",
        price: 26.99,
        imageUrl: "/images/products/garden-fork.svg",
        categoryId: 15, // Hand Tools
      },
      {
        name: "Mini Electric Tiller",
        slug: "mini-electric-tiller",
        description:
          "Compact electric tiller with adjustable tilling width for garden beds and small spaces. Powerful 8.5-amp motor.",
        shortDescription: "Compact electric tiller for small garden beds",
        price: 129.99,
        imageUrl: "/images/products/electric-garden-tiller.svg",
        isNew: true,
        categoryId: 16, // Power Tools
      },
      {
        name: "Cordless Hedge Trimmer",
        slug: "cordless-hedge-trimmer",
        description:
          "20V cordless hedge trimmer with 22-inch dual-action blade. Cuts branches up to 3/4 inch thick.",
        shortDescription:
          "Cordless hedge trimmer for precise landscape maintenance",
        price: 89.99,
        imageUrl: "/images/products/cordless-hedge-trimmer.svg",
        categoryId: 16, // Power Tools
      },
      {
        name: "Electric Leaf Blower",
        slug: "electric-leaf-blower",
        description:
          "Variable-speed electric leaf blower with vacuum capability. Includes collection bag for yard cleanup.",
        shortDescription: "Versatile electric leaf blower and vacuum",
        price: 59.99,
        imageUrl: "/images/products/electric-leaf-blower.svg",
        categoryId: 16, // Power Tools
      },
      {
        name: "Soaker Hose Kit",
        slug: "soaker-hose-kit",
        description:
          "50-foot recycled rubber soaker hose with connectors. Conserves water by delivering moisture directly to plant roots.",
        shortDescription:
          "Water-efficient soaker hose for direct root irrigation",
        price: 24.99,
        imageUrl: "/images/products/soaker-hose.svg",
        categoryId: 17, // Watering Tools
      },
      {
        name: "Garden Hose Nozzle",
        slug: "garden-hose-nozzle",
        description:
          "Multi-pattern metal hose nozzle with 9 spray patterns. Comfortable rubber grip and flow control.",
        shortDescription: "9-pattern metal hose nozzle for versatile watering",
        price: 12.99,
        imageUrl: "/images/products/garden-hose-nozzle.svg",
        isBestSeller: true,
        categoryId: 17, // Watering Tools
      },
      {
        name: "Watering Can",
        slug: "watering-can",
        description:
          "Two-gallon plastic watering can with removable rose. Balanced design makes it easy to carry and pour.",
        shortDescription: "Balanced 2-gallon watering can for precise watering",
        price: 19.99,
        imageUrl: "/images/products/watering-can.svg",
        categoryId: 17, // Watering Tools
      },
      {
        name: "Rain Barrel",
        slug: "rain-barrel",
        description:
          "50-gallon rainwater collection barrel with spigot and overflow port. Includes debris screen and linking kit.",
        shortDescription: "50-gallon rainwater harvesting system",
        price: 89.99,
        imageUrl: "/images/products/rain-barrel.svg",
        categoryId: 17, // Watering Tools
      },
      {
        name: "Galvanized Steel Watering Can",
        slug: "galvanized-steel-watering-can",
        description:
          "Classic 2-gallon watering can with removable rose. Perfectly balanced for easy watering.",
        shortDescription: "Classic 2-gallon watering can with removable rose",
        price: 34.99,
        imageUrl: "/images/products/watering_can.svg",
        categoryId: 5,
      },
      {
        name: "5-Blade Herb Scissors",
        slug: "herb-scissors",
        description:
          "Multi-blade herb scissors for quick and easy herb harvesting and chopping. Includes cleaning comb.",
        shortDescription: "Multi-blade scissors for easy herb harvesting",
        price: 16.99,
        imageUrl: "/images/products/herb_scissors.svg",
        categoryId: 5,
      },
      {
        name: "Weather-Resistant Plant Labels",
        slug: "weather-resistant-plant-labels",
        description:
          "Set of 50 weather-resistant plant labels with marking pen. Perfect for identifying plants in your garden.",
        shortDescription: "50 durable plant labels with marking pen",
        price: 9.99,
        imageUrl: "/images/products/plant_labels.svg",
        categoryId: 5,
      },
      {
        name: "Bypass Pruning Shears",
        slug: "bypass-pruning-shears",
        description:
          "Professional-grade bypass pruning shears with titanium-coated blades and ergonomic handles.",
        shortDescription:
          "Professional pruning shears with titanium-coated blades",
        price: 24.99,
        imageUrl: "/images/products/pruning_shears.svg",
        categoryId: 5,
      },
      {
        name: "Drip Irrigation Starter Kit",
        slug: "drip-irrigation-kit",
        description:
          "Complete drip irrigation kit for up to 25 plants. Includes timer, tubing, emitters, and connectors.",
        shortDescription:
          "Complete water-saving irrigation system for 25 plants",
        price: 49.99,
        imageUrl: "/images/products/drip_irrigation.svg",
        isBestSeller: true,
        categoryId: 5,
      },
      {
        name: "Garden Potting Bench",
        slug: "garden-potting-bench",
        description:
          "Durable cedar potting bench with built-in storage shelf, soil sink, and tool hooks for organized gardening.",
        shortDescription: "Cedar potting bench with storage for garden work",
        price: 149.99,
        imageUrl: "/images/products/garden-potting-bench.svg",
        categoryId: 5,
      },
      {
        name: "Garden Kneeling Pad",
        slug: "garden-kneeling-pad",
        description:
          "Extra-thick memory foam kneeling pad that provides comfort for extended garden work. Water and dirt resistant.",
        shortDescription: "Thick memory foam pad for comfortable gardening",
        price: 19.99,
        imageUrl: "/images/products/garden-kneeling-pad.svg",
        categoryId: 5,
      },
      {
        name: "Garden Knee Pads",
        slug: "garden-knee-pads",
        description:
          "Waterproof knee pads with adjustable straps for comfortable protection during garden work.",
        shortDescription: "Waterproof knee pads with adjustable straps",
        price: 24.99,
        imageUrl: "/images/products/garden-knee-pads.svg",
        categoryId: 5,
      },
      {
        name: "Plant Support Cages",
        slug: "plant-support-cages",
        description:
          "Set of 3 durable steel tomato cages with powder-coated finish. Provides sturdy support for tomatoes and other vining plants.",
        shortDescription: "Durable steel support cages for tomatoes and vines",
        price: 29.99,
        imageUrl: "/images/products/plant-support-cages.svg",
        categoryId: 5,
      },
      {
        name: "Tomato Support Stakes",
        slug: "tomato-support-stakes",
        description:
          "Set of 5 heavy-duty 6-foot garden stakes perfect for supporting tomatoes, peppers, and other tall plants.",
        shortDescription: "Heavy-duty 6-foot stakes for tall garden plants",
        price: 18.99,
        imageUrl: "/images/products/tomato-support-stakes.svg",
        categoryId: 5,
      },
      {
        name: "Fertilizer Spreader",
        slug: "fertilizer-spreader",
        description:
          "Hand-held spreader for even application of fertilizers, seeds, and other granular garden products.",
        shortDescription:
          "Hand-held spreader for fertilizer and seed application",
        price: 22.99,
        imageUrl: "/images/products/fertilizer-spreader.svg",
        categoryId: 5,
      },
      {
        name: "Expandable Garden Hose",
        slug: "expandable-garden-hose",
        description:
          "Lightweight, expandable garden hose that grows to 50 feet when in use, but shrinks for easy storage. Includes nozzle.",
        shortDescription: "Expandable 50-foot hose with storage-saving design",
        price: 39.99,
        imageUrl: "/images/products/garden-hose.svg",
        categoryId: 5,
      },
      // Planters
      {
        name: "Stack & Grow Seedling Trays",
        slug: "stack-and-grow-trays",
        description:
          "Stackable seed starting system for maximizing your growing space. Professional quality for serious gardeners.",
        shortDescription:
          "Space-saving stackable seedling trays for serious gardeners",
        price: 42.99,
        imageUrl: "/images/products/2022-11-17-Diego0293-STACK_400x400.svg",
        isNew: true,
        categoryId: 11,
      },
      {
        name: "Tiered Strawberry Planter",
        slug: "tiered-strawberry-planter",
        description:
          "3-tier strawberry planter that maximizes growing space. Perfect for patios and small gardens.",
        shortDescription: "Space-saving 3-tier planter for strawberries",
        price: 29.99,
        imageUrl: "/images/products/strawberry_planter.svg",
        categoryId: 3,
      },
      {
        name: "5-Tier Vertical Planter",
        slug: "vertical-planter",
        description:
          "Space-saving vertical planter with 5 tiers, perfect for growing herbs, strawberries, or flowers on patios and balconies.",
        shortDescription: "5-tier vertical planter for herbs and small plants",
        price: 59.99,
        imageUrl: "/images/products/vertical_planter.svg",
        isNew: true,
        categoryId: 3,
      },
      // Composting
      {
        name: "Compact Compost Bin",
        slug: "compact-compost-bin",
        description:
          "Space-saving 5-gallon compost bin with aeration system and activated charcoal filter to control odors.",
        shortDescription: "Space-saving compost bin with odor control",
        price: 39.99,
        imageUrl: "/images/products/compost_bin.svg",
        categoryId: 6,
      },
      {
        name: "Kitchen Compost Bin",
        slug: "kitchen-compost-bin",
        description:
          "Attractive stainless steel 1.3-gallon kitchen counter compost bin with replaceable charcoal filter to eliminate odors.",
        shortDescription: "Stylish countertop bin for collecting food scraps",
        price: 24.99,
        imageUrl: "/images/products/kitchen-compost-bin.svg",
        categoryId: 6,
      },
      {
        name: "Compost Thermometer",
        slug: "compost-thermometer",
        description:
          "Long-stem compost thermometer with temperature zones marked for monitoring your compost pile's decomposition process.",
        shortDescription:
          "Long-stem thermometer for monitoring compost temperature",
        price: 19.99,
        imageUrl: "/images/products/compost-thermometer.svg",
        categoryId: 6,
      },
      {
        name: "Compost Activator",
        slug: "compost-activator",
        description:
          "Natural compost accelerator that speeds up the decomposition process by adding essential microorganisms and nitrogen.",
        shortDescription:
          "Natural accelerator for faster compost decomposition",
        price: 12.99,
        imageUrl: "/images/products/compost-activator.svg",
        categoryId: 6,
      },
      {
        name: "Compost Aerator Tool",
        slug: "compost-aerator",
        description:
          "Specialized compost aerator tool that helps add oxygen to your compost pile without heavy turning or pitchforks.",
        shortDescription:
          "Easy-to-use tool for aerating compost without heavy turning",
        price: 29.99,
        imageUrl: "/images/products/compost-aerator.svg",
        categoryId: 6,
      },
      // Fertilizers
      {
        name: "Organic Plant Food Concentrate",
        slug: "plant-food-concentrate",
        description:
          "All-purpose liquid organic fertilizer concentrate made from plant-based ingredients. Gentle yet effective for all plants.",
        shortDescription:
          "All-purpose organic liquid fertilizer for all plants",
        price: 14.99,
        imageUrl: "/images/products/plant-food-concentrate.svg",
        categoryId: 7,
      },
      {
        name: "Slow-Release Fertilizer",
        slug: "slow-release-fertilizer",
        description:
          "Premium granular slow-release fertilizer that feeds plants continuously for up to 3 months with one application.",
        shortDescription:
          "Long-lasting granular fertilizer for continuous feeding",
        price: 19.99,
        imageUrl: "/images/products/slow-release-fertilizer.svg",
        categoryId: 7,
      },
      {
        name: "Bone Meal Fertilizer",
        slug: "bone-meal",
        description:
          "Organic bone meal fertilizer rich in phosphorus and calcium. Ideal for bulbs, flowering plants, and root development.",
        shortDescription:
          "Phosphorus-rich organic fertilizer for flowers and bulbs",
        price: 8.99,
        imageUrl: "/images/products/bone-meal.svg",
        categoryId: 7,
      },
      {
        name: "Blood Meal Fertilizer",
        slug: "blood-meal",
        description:
          "Organic nitrogen-rich blood meal for leafy greens and plants that need quick growth. Helps promote lush foliage.",
        shortDescription: "Nitrogen-rich organic fertilizer for leafy growth",
        price: 9.99,
        imageUrl: "/images/products/blood-meal.svg",
        categoryId: 7,
      },
      {
        name: "Fish Emulsion Fertilizer",
        slug: "fish-emulsion",
        description:
          "Organic liquid fish emulsion that provides immediate nutrients and beneficial soil microbes. Ideal for regular feeding.",
        shortDescription: "Fast-acting fish-based liquid fertilizer",
        price: 12.99,
        imageUrl: "/images/products/fish-emulsion.svg",
        categoryId: 7,
      },
      {
        name: "Premium Worm Castings",
        slug: "worm-castings",
        description:
          "Pure worm castings that improve soil structure, enhance microbial activity, and provide gentle nutrition for all plants.",
        shortDescription: "Pure worm castings for gentle natural fertilization",
        price: 15.99,
        imageUrl: "/images/products/worm-castings.svg",
        categoryId: 7,
      },
      // Pest Control
      {
        name: "Organic Neem Oil",
        slug: "neem-oil",
        description:
          "Cold-pressed neem oil concentrate that acts as a natural insecticide, fungicide, and miticide for organic gardening.",
        shortDescription: "Natural multi-purpose pest and disease control",
        price: 16.99,
        imageUrl: "/images/products/neem-oil.svg",
        categoryId: 8,
      },
      {
        name: "Insecticidal Soap",
        slug: "insecticidal-soap",
        description:
          "Ready-to-use organic insecticidal soap that controls soft-bodied pests like aphids, mealybugs, and spider mites.",
        shortDescription: "Targeted control for soft-bodied garden pests",
        price: 11.99,
        imageUrl: "/images/products/insecticidal-soap.svg",
        categoryId: 8,
      },
      {
        name: "Diatomaceous Earth",
        slug: "diatomaceous-earth",
        description:
          "Food-grade diatomaceous earth that controls crawling insects through physical rather than chemical action.",
        shortDescription: "Natural powder for controlling crawling insects",
        price: 13.99,
        imageUrl: "/images/products/diatomaceous-earth.svg",
        categoryId: 8,
      },
      {
        name: "Yellow Sticky Traps",
        slug: "sticky-traps",
        description:
          "Set of 20 dual-sided yellow sticky traps that attract and capture flying pests like fungus gnats, whiteflies, and aphids.",
        shortDescription:
          "Sticky traps for monitoring and controlling flying pests",
        price: 9.99,
        imageUrl: "/images/products/sticky-traps.svg",
        categoryId: 8,
      },
      {
        name: "Bird Netting",
        slug: "bird-netting",
        description:
          "Lightweight protective netting that keeps birds away from fruit trees, berry bushes, and garden beds without harming them.",
        shortDescription: "Protective barrier to keep birds away from crops",
        price: 17.99,
        imageUrl: "/images/products/bird-netting.svg",
        categoryId: 8,
      },
      // Indoor Growing
      {
        name: "LED Grow Light Panel",
        slug: "grow-light-led-panel",
        description:
          "Full-spectrum LED grow light panel with adjustable height. Perfect for seed starting, indoor herbs, and houseplants.",
        shortDescription: "Full-spectrum light panel for indoor growing",
        price: 79.99,
        imageUrl: "/images/products/grow-light-led-panel.svg",
        categoryId: 12,
      },
      {
        name: "Hydroponic Starter Kit",
        slug: "hydroponic-starter-kit",
        description:
          "Complete starter kit for soil-free growing. Includes growing chamber, nutrients, growing medium, and instructions.",
        shortDescription: "Complete kit for beginning soil-free growing",
        price: 69.99,
        imageUrl: "/images/products/hydroponic-starter-kit.svg",
        isNew: true,
        categoryId: 12,
      },
      {
        name: "Seedling Heat Mat",
        slug: "heat-mat",
        description:
          "Waterproof heat mat that warms soil 10-20°F above ambient temperature to improve germination rates and seedling growth.",
        shortDescription: "Warming mat for faster seed germination",
        price: 24.99,
        imageUrl: "/images/products/heat-mat.svg",
        categoryId: 12,
      },
      {
        name: "Digital Soil pH Meter",
        slug: "ph-meter",
        description:
          "Easy-to-use digital meter that measures soil pH accurately. Essential for determining your garden's lime or sulfur needs.",
        shortDescription: "Digital meter for accurate soil pH readings",
        price: 29.99,
        imageUrl: "/images/products/ph-meter.svg",
        categoryId: 12,
      },
      {
        name: "Digital Thermometer/Hygrometer",
        slug: "digital-thermometer",
        description:
          "Combination digital thermometer and humidity monitor perfect for greenhouses, indoor growing spaces, and seed starting.",
        shortDescription: "Temperature and humidity monitor for growing spaces",
        price: 19.99,
        imageUrl: "/images/products/digital-thermometer.svg",
        categoryId: 12,
      },
      // Garden Décor
      {
        name: "Solar Garden Lights",
        slug: "solar-garden-lights",
        description:
          "Set of 8 solar-powered LED garden path lights with automatic dusk-to-dawn operation. No wiring required.",
        shortDescription: "Solar path lights for nighttime garden illumination",
        price: 34.99,
        imageUrl: "/images/products/solar-garden-lights.svg",
        categoryId: 13,
      },
      {
        name: "Garden Stepping Stones",
        slug: "garden-stepping-stones",
        description:
          "Set of 3 decorative cast stone stepping stones with botanical design. Creates an attractive pathway through gardens.",
        shortDescription: "Decorative stepping stones with botanical design",
        price: 39.99,
        imageUrl: "/images/products/garden-stepping-stones.svg",
        categoryId: 13,
      },
      {
        name: "Butterfly House",
        slug: "butterfly-house",
        description:
          "Cedar butterfly shelter that provides protected space for butterflies to rest and hibernate, enhancing your garden's ecosystem.",
        shortDescription:
          "Cedar shelter for butterfly protection and observation",
        price: 29.99,
        imageUrl: "/images/products/butterfly-house.svg",
        categoryId: 13,
      },
      {
        name: "Decorative Bird Bath",
        slug: "birdbath",
        description:
          "Cast stone bird bath with elegant pedestal design. Provides drinking and bathing water for birds while adding garden decoration.",
        shortDescription: "Elegant bird bath to attract feathered visitors",
        price: 69.99,
        imageUrl: "/images/products/birdbath.svg",
        categoryId: 13,
      },
      {
        name: "Wild Bird Feeder",
        slug: "bird-feeder",
        description:
          "Clear plastic wild bird feeder with multiple perches. Easy to fill and clean, attracts a variety of songbirds to your garden.",
        shortDescription:
          "Easy-to-use feeder to attract songbirds to your yard",
        price: 19.99,
        imageUrl: "/images/products/bird-feeder.svg",
        categoryId: 13,
      },

      // Garden Tools - Hand Tools
      {
        name: "Garden Hand Pruner",
        slug: "garden-hand-pruner",
        description:
          "High-quality garden pruners with ergonomic handles and precision cutting blades. Perfect for trimming small branches and stems.",
        shortDescription: "Precision pruners for clean cuts on small branches",
        price: 24.99,
        imageUrl: "/images/products/garden_pruner.svg",
        isBestSeller: true,
        categoryId: 15, // Hand Tools subcategory
      },
      {
        name: "Garden Cultivator",
        slug: "garden-cultivator",
        description:
          "Three-pronged hand cultivator with comfortable ergonomic handle. Perfect for breaking up soil and removing weeds between plants.",
        shortDescription:
          "Three-pronged tool for aerating soil and removing weeds",
        price: 19.99,
        imageUrl: "/images/products/garden-cultivator.svg",
        categoryId: 15, // Hand Tools subcategory
      },
      {
        name: "Garden Digging Spade",
        slug: "garden-digging-spade",
        description:
          "Heavy-duty garden spade with sharpened edge for cleaner cuts through soil and roots. Ergonomic handle reduces strain during use.",
        shortDescription: "Heavy-duty digging spade with comfortable grip",
        price: 34.99,
        imageUrl: "/images/products/garden-spade.svg",
        categoryId: 15, // Hand Tools subcategory
      },
      {
        name: "Garden Fork",
        slug: "garden-fork",
        description:
          "Four-tine garden fork perfect for turning soil and compost. The strong tines easily penetrate compacted soil.",
        shortDescription: "Four-tine fork for turning soil and compost",
        price: 32.99,
        imageUrl: "/images/products/garden-fork.svg",
        categoryId: 15, // Hand Tools subcategory
      },

      // Garden Tools - Pruning Tools
      {
        name: "Bypass Loppers",
        slug: "bypass-loppers",
        description:
          "Long-handled bypass loppers for cutting branches up to 1.5 inches. The compound action mechanism increases cutting power with less effort.",
        shortDescription: "Long-handled cutters for branches up to 1.5 inches",
        price: 39.99,
        imageUrl: "/images/products/bypass-loppers.svg",
        isBestSeller: true,
        categoryId: 16, // Pruning Tools subcategory
      },
      {
        name: "Hedge Shears",
        slug: "hedge-shears",
        description:
          "Professional hedge shears with shock-absorbing bumpers and precision-ground wavy blades for clean cuts on leafy growth.",
        shortDescription: "Professional shears for trimming hedges and shrubs",
        price: 36.99,
        imageUrl: "/images/products/hedge-shears.svg",
        categoryId: 16, // Pruning Tools subcategory
      },
      {
        name: "Folding Hand Saw",
        slug: "folding-hand-saw",
        description:
          "Compact folding saw with triple-cut razor teeth for efficient cutting of larger branches. Safety lock keeps the blade secure when folded.",
        shortDescription: "Portable folding saw for efficient branch cutting",
        price: 21.99,
        imageUrl: "/images/products/folding-hand-saw.svg",
        isNew: true,
        categoryId: 16, // Pruning Tools subcategory
      },

      // Garden Tools - Power Tools
      {
        name: "Mini Electric Tiller",
        slug: "mini-electric-tiller",
        description:
          "Compact electric tiller perfect for small gardens and raised beds. The 6.5-amp motor powers through soil with four durable steel tines.",
        shortDescription: "Compact electric tiller for small garden spaces",
        price: 129.99,
        imageUrl: "/images/products/electric-garden-tiller.svg",
        isBestSeller: true,
        categoryId: 17, // Power Tools subcategory
      },
      {
        name: "Cordless Hedge Trimmer",
        slug: "cordless-hedge-trimmer",
        description:
          "Powerful 20V lithium-ion hedge trimmer with 22-inch dual-action blades. The lightweight design reduces fatigue during extended use.",
        shortDescription: "Cordless 22-inch trimmer for hedge maintenance",
        price: 89.99,
        imageUrl: "/images/products/cordless-hedge-trimmer.svg",
        categoryId: 17, // Power Tools subcategory
      },
      {
        name: "Electric Leaf Blower",
        slug: "electric-leaf-blower",
        description:
          "Versatile electric leaf blower with variable speed control. Effectively clears leaves and debris from your garden paths and lawn.",
        shortDescription: "Versatile blower for clearing garden debris",
        price: 69.99,
        imageUrl: "/images/products/electric-leaf-blower.svg",
        isNew: true,
        categoryId: 17, // Power Tools subcategory
      },

      // Garden Tools - Watering Tools
      {
        name: "Soaker Hose Kit",
        slug: "soaker-hose-kit",
        description:
          "Water-efficient soaker hose kit that delivers water directly to plant roots. Includes 50 feet of hose and all necessary fittings.",
        shortDescription: "Water-saving hose for efficient root watering",
        price: 29.99,
        imageUrl: "/images/products/soaker-hose.svg",
        categoryId: 18, // Watering Tools subcategory
      },
      {
        name: "Garden Watering Can",
        slug: "garden-watering-can",
        description:
          "Ergonomic 2-gallon watering can with removable rose spout for gentle watering of delicate seedlings and plants.",
        shortDescription: "Ergonomic can for precise plant watering",
        price: 24.99,
        imageUrl: "/images/products/watering-can.svg",
        isNew: true,
        categoryId: 18, // Watering Tools subcategory
      },
      {
        name: "Rain Barrel",
        slug: "rain-barrel",
        description:
          "50-gallon rain barrel with spigot and overflow valve. Collect rainwater from your downspouts for garden irrigation and conservation.",
        shortDescription: "50-gallon barrel for rainwater collection and use",
        price: 119.99,
        imageUrl: "/images/products/rain-barrel.svg",
        categoryId: 18, // Watering Tools subcategory
      },
    ];

    // Create products
    products.forEach((product) => {
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
        excerpt:
          "Learn how to grow productive, crisp yellow bush beans in your garden with these simple growing tips.",
        imageUrl:
          "/images/categories/3139i_Bean-Bush-Goldrush-ORG-new2025_ndzu9h.svg",
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
        excerpt:
          "Discover how to grow vibrant, edible nasturtium flowers that add beauty to your garden and flavor to your plate.",
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
        excerpt:
          "Discover the many advantages of raised bed gardening and learn how to create the perfect growing environment for your plants.",
        imageUrl:
          "/images/categories/10331_Medium_Tall_LightClay_Compressed.svg",
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
        excerpt:
          "Set your garden up for success with these essential spring gardening tasks and tips for a productive growing season.",
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
        excerpt:
          "Learn the fundamentals of composting to transform household waste into valuable garden fertilizer.",
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
        excerpt:
          "Learn to identify common garden pests and control them using natural, environmentally friendly methods.",
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
        excerpt:
          "Master the art of garden watering with techniques that conserve water while keeping your plants thriving.",
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
        excerpt:
          "Discover proven techniques to enhance your soil quality for healthier plants and better harvests.",
        imageUrl: "/images/articles/soil_improvement.svg",
        datePublished: new Date("2023-02-18"),
        categoryId: 6,
      },
    ];

    // Create articles
    articles.forEach((article) => {
      this.createArticle(article);
    });

    // Add new articles
    newArticles.forEach((article) => {
      this.createArticle(article);
    });

    // Sample testimonials
    const testimonials: InsertTestimonial[] = [
      {
        personName: "Sarah L.",
        role: "Home Gardener",
        avatarUrl: "https://randomuser.me/api/portraits/women/44.svg",
        content:
          "Epic Gardening has transformed my backyard! Their step-by-step guides made it easy to grow my own vegetables, even as a complete beginner. Now I have fresh produce all summer long!",
        rating: 5,
      },
      {
        personName: "Michael T.",
        role: "Urban Gardener",
        avatarUrl: "https://randomuser.me/api/portraits/men/32.svg",
        content:
          "The gardening tools I purchased from Epic Gardening are top-quality and made my garden work so much easier. Their customer service was excellent when I had questions about which products to choose.",
        rating: 5,
      },
      {
        personName: "Jennifer P.",
        role: "Herb Enthusiast",
        avatarUrl: "https://randomuser.me/api/portraits/women/68.svg",
        content:
          "I've been following Epic Gardening's blog for years and it's been invaluable for my herb garden. Their pest control tips saved my basil from aphids last season, and now I have a thriving herb collection!",
        rating: 4,
      },
    ];

    // Create testimonials
    testimonials.forEach((testimonial) => {
      this.createTestimonial(testimonial);
    });
  }
}

export const storage = new MemStorage();
