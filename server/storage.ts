import {
  users,
  categories,
  products,
  productImages,
  articles,
  testimonials,
  subscribers,
  contacts,
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type ProductImage,
  type InsertProductImage,
  type Article,
  type InsertArticle,
  type Testimonial,
  type InsertTestimonial,
  type Subscriber,
  type InsertSubscriber,
  type Contact,
  type InsertContact
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
  
  // Product image methods
  createProductImage(productImage: InsertProductImage): Promise<ProductImage>;
  getProductImages(productId: number): Promise<ProductImage[]>;

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

  // Contact methods
  createContact(contact: InsertContact): Promise<Contact>;

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
  private productImages: Map<number, ProductImage>;
  private articles: Map<number, Article>;
  private testimonials: Map<number, Testimonial>;
  private subscribers: Map<number, Subscriber>;
  private contacts: Map<number, Contact>;

  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentProductImageId: number;
  private currentArticleId: number;
  private currentTestimonialId: number;
  private currentSubscriberId: number;
  private currentContactId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.productImages = new Map();
    this.articles = new Map();
    this.testimonials = new Map();
    this.subscribers = new Map();
    this.contacts = new Map();

    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentProductImageId = 1;
    this.currentArticleId = 1;
    this.currentTestimonialId = 1;
    this.currentSubscriberId = 1;
    this.currentContactId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
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
      (category) => category.slug === slug
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
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
      (product) => product.slug === slug
    );
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
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
      features: insertProduct.features || null,
      specifications: insertProduct.specifications || null,
      categoryId: insertProduct.categoryId,
    };
    this.products.set(id, product);
    return product;
  }
  
  // Product image methods
  async createProductImage(insertProductImage: InsertProductImage): Promise<ProductImage> {
    const id = this.currentProductImageId++;
    const productImage: ProductImage = {
      id,
      productId: insertProductImage.productId,
      imageUrl: insertProductImage.imageUrl,
      isPrimary: insertProductImage.isPrimary || false,
      sortOrder: insertProductImage.sortOrder || 0,
    };
    this.productImages.set(id, productImage);
    return productImage;
  }
  
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return Array.from(this.productImages.values()).filter(
      (image) => image.productId === productId
    );
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
      (article) => article.slug === slug
    );
  }

  async getArticlesByCategory(categoryId: number): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(
      (article) => article.categoryId === categoryId
    );
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
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
    insertTestimonial: InsertTestimonial
  ): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
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
    insertSubscriber: InsertSubscriber
  ): Promise<Subscriber> {
    // Check if email already exists
    const existingSubscriber = Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email === insertSubscriber.email
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

  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = {
      id,
      name: insertContact.name,
      email: insertContact.email,
      phone: insertContact.phone || null,
      service: insertContact.service,
      message: insertContact.message,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
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
          product.description.toLowerCase().includes(lowercaseQuery))
    );

    const matchedArticles = Array.from(this.articles.values()).filter(
      (article) =>
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery) ||
        (article.excerpt &&
          article.excerpt.toLowerCase().includes(lowercaseQuery))
    );

    const matchedCategories = Array.from(this.categories.values()).filter(
      (category) =>
        category.name.toLowerCase().includes(lowercaseQuery) ||
        (category.description &&
          category.description.toLowerCase().includes(lowercaseQuery))
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
    const categoryData = [
      {
        name: "Vegetables",
        slug: "vegetables",
        description: "Seeds, plants, and supplies for growing your own delicious vegetables",
        imageUrl: "/images/categories/3139i_Bean-Bush-Goldrush-ORG-new2025_ndzu9h.svg",
        parentId: null,
      } as InsertCategory,
      {
        name: "Flowers",
        slug: "flowers",
        description: "Beautify your garden with a wide variety of flowering plants",
        imageUrl: "/images/categories/2026i_Nasturtium-Fiesta-Blend_6ceu81.svg",
        parentId: null,
      } as InsertCategory,
      {
        name: "Container Gardening",
        slug: "container-gardening",
        description: "Everything you need for successful gardening in pots and planters",
        imageUrl: "/images/categories/10331_Medium_Tall_LightClay_Compressed.svg",
        parentId: null,
      } as InsertCategory,
      {
        name: "Herbs",
        slug: "herbs",
        description: "Culinary and medicinal herbs to grow at home",
        imageUrl: "/images/categories/herbs_category.svg",
        parentId: null,
      } as InsertCategory,
      {
        name: "Tools",
        slug: "tools",
        description: "Quality gardening tools for every task",
        imageUrl: "/images/categories/tools_category.svg",
        parentId: null,
      } as InsertCategory,
      {
        name: "Pest Control",
        slug: "pest-control",
        description: "Eco-friendly solutions for garden pests and diseases",
        imageUrl: "/images/categories/pest_control_category.svg",
        parentId: null,
      } as InsertCategory
    ];

    // Insert sample categories
    for (const category of categoryData) {
      this.createCategory(category);
    }

    // Sample products
    const productData: InsertProduct[] = [
      {
        name: "Raised Garden Bed Kit",
        slug: "raised-garden-bed-kit",
        description: "This premium raised garden bed kit is perfect for growing vegetables, herbs, and flowers. Made from high-quality cedar that's naturally resistant to rot and pests.",
        shortDescription: "Premium cedar raised bed for vegetables and herbs",
        price: 129.99,
        salePrice: 99.99,
        imageUrl: "/images/products/10328_Large_short_LightClay.svg",
        isBestSeller: true,
        isNew: false,
        features: "- Made from high-quality cedar wood\n- Naturally resistant to rot and pests\n- Easy to assemble with included hardware\n- Stackable design for customized height\n- Perfect for growing vegetables, herbs, and flowers",
        specifications: "- Dimensions: 48\"L x 24\"W x 10\"H\n- Material: 100% natural cedar\n- Weight: 24 lbs\n- Capacity: 8 cubic feet of soil\n- Warranty: 5 years",
        categoryId: 3, // Container Gardening
      },
      {
        name: "Organic Vegetable Seed Collection",
        slug: "organic-vegetable-seed-collection",
        description: "Start your vegetable garden with this comprehensive collection of organic, non-GMO seeds. Includes 12 popular vegetable varieties.",
        shortDescription: "12 varieties of organic, non-GMO vegetable seeds",
        price: 24.99,
        salePrice: null,
        imageUrl: "/images/articles/4560i-Heirloom-ORG-Seed-Bank-Collection_35vk3o_m4m7ls.svg",
        isBestSeller: true,
        isNew: false,
        features: "- 100% organic, non-GMO seeds\n- 12 popular vegetable varieties\n- High germination rates\n- Detailed planting instructions included\n- Stored in humidity-controlled packaging for freshness",
        specifications: "- Varieties: Tomato, Cucumber, Carrot, Lettuce, Kale, Spinach, Radish, Bean, Pea, Squash, Pepper, Broccoli\n- Origin: USA grown\n- Weight: 125g total\n- Storage life: 3 years when properly stored\n- Certified Organic by USDA",
        categoryId: 1, // Vegetables
      },
      {
        name: "Premium Garden Pruners",
        slug: "premium-garden-pruners",
        description: "These professional-grade pruners make clean cuts through stems up to 3/4 inch thick. Ergonomic design reduces hand fatigue during extended use.",
        shortDescription: "Professional-grade bypass pruners for clean cuts",
        price: 34.99,
        salePrice: 29.99,
        imageUrl: "/images/products/garden_pruner.svg",
        isBestSeller: false,
        isNew: true,
        features: "- High-carbon steel blades for precise cuts\n- Ergonomic non-slip grips reduce hand strain\n- Shock-absorbing spring system\n- Sap groove prevents sticking\n- Easy-to-use safety lock",
        specifications: "- Cutting capacity: 3/4 inch diameter\n- Overall length: 8.5 inches\n- Weight: 8.8 oz\n- Materials: High-carbon steel blades, rubberized grips\n- Lifetime warranty against defects",
        categoryId: 5, // Tools
      },
      {
        name: "Garden Gloves",
        slug: "garden-gloves",
        description: "Durable and comfortable garden gloves that protect your hands while providing excellent dexterity for all gardening tasks. Available in multiple colors and sizes.",
        shortDescription: "Durable, comfortable garden gloves for all gardening tasks",
        price: 14.99,
        salePrice: 12.99,
        imageUrl: "/images/products/garden_gloves.svg",
        isBestSeller: false,
        isNew: false,
        features: "- Made from premium synthetic leather\n- Breathable spandex back\n- Adjustable wrist closure\n- Reinforced fingertips\n- Machine washable",
        specifications: "- Materials: Synthetic leather, spandex\n- Available sizes: S, M, L, XL\n- Available colors: Blue, Green, Pink\n- Weight: 3.2 oz\n- Care: Machine wash cold, air dry",
        categoryId: 5, // Tools
      },
      {
        name: "Pruning Shears",
        slug: "pruning-shears",
        description: "Sharp and precise pruning shears perfect for trimming and shaping plants, cutting flowers, and harvesting vegetables. The comfortable handles and safety lock make gardening tasks easy and safe.",
        shortDescription: "Sharp and precise pruning shears for all garden cutting tasks",
        price: 18.99,
        salePrice: null,
        imageUrl: "/images/products/pruning_shears.svg",
        isBestSeller: true,
        isNew: false,
        features: "- Hardened stainless steel blades\n- Cushioned non-slip handles\n- Safety lock mechanism\n- Spring-loaded action\n- Ideal for stems up to 1/2 inch diameter",
        specifications: "- Overall length: 8 inches\n- Blade material: Hardened stainless steel\n- Handle material: TPR rubber\n- Weight: 7.5 oz\n- Max cutting diameter: 1/2 inch",
        categoryId: 5, // Tools
      },
      {
        name: "Persian Carpet Zinnia Seeds",
        slug: "persian-carpet-zinnia-seeds",
        description: "These stunning double and semi-double flowers bloom in rich shades of burgundy, cream, orange, and gold with chocolate centers. Perfect for borders and cutting gardens.",
        shortDescription: "Stunning mix of double and semi-double flowers",
        price: 4.99,
        salePrice: null,
        imageUrl: "/images/products/1193i_Zinnia-Persian-Carpet_3oykxo.svg",
        isBestSeller: false,
        isNew: true,
        features: "- Beautiful mix of burgundy, cream, orange, and gold flowers\n- Double and semi-double blooms with chocolate centers\n- Drought tolerant once established\n- Excellent for cut flowers\n- Attracts butterflies and pollinators",
        specifications: "- Plant height: 12-15 inches\n- Bloom size: 2-2.5 inches\n- Days to germination: 7-10\n- Days to bloom: 60-70\n- Seeds per packet: Approximately 75",
        categoryId: 2, // Flowers
      }
    ];

    // Insert sample products
    for (const product of productData) {
      this.createProduct(product);
    }

    // Sample articles
    const articleData: InsertArticle[] = [
      {
        title: "How to Start a Vegetable Garden: A Beginner's Guide",
        slug: "how-to-start-vegetable-garden-beginners-guide",
        content: "Starting a vegetable garden is a rewarding experience that can provide fresh, healthy produce right from your backyard. This guide covers everything you need to know to get started, from selecting the right location to choosing the best vegetables for beginners...",
        excerpt: "Learn how to create your first vegetable garden with this comprehensive beginner's guide.",
        imageUrl: "/images/articles/spring_gardening_tips.svg",
        datePublished: new Date("2023-03-15"),
        categoryId: 1, // Vegetables
      },
      {
        title: "10 Easy-to-Grow Flowers for Your Cutting Garden",
        slug: "10-easy-grow-flowers-cutting-garden",
        content: "Creating a cutting garden allows you to enjoy beautiful bouquets all season long without depleting your landscape. This article explores 10 flowers that are both easy to grow and excellent for arrangements...",
        excerpt: "Discover the best flowers for creating beautiful homegrown bouquets.",
        imageUrl: "/images/categories/2026i_Nasturtium-Fiesta-Blend_6ceu81.svg",
        datePublished: new Date("2023-04-10"),
        categoryId: 2, // Flowers
      },
      {
        title: "Container Gardening: Growing Vegetables in Limited Space",
        slug: "container-gardening-vegetables-limited-space",
        content: "Don't let limited space stop you from growing your own food! Container gardening opens up possibilities for patios, balconies, and small yards. This guide covers container selection, soil considerations, watering techniques, and the best vegetables for container growing...",
        excerpt: "Learn how to grow a thriving vegetable garden in containers.",
        imageUrl: "/images/categories/10331_Medium_Tall_LightClay_Compressed.svg",
        datePublished: new Date("2023-05-22"),
        categoryId: 3, // Container Gardening
      },
      {
        title: "Organic Pest Control: Natural Solutions for Common Garden Problems",
        slug: "organic-pest-control-natural-solutions",
        content: "Keep your garden healthy without harmful chemicals using these effective organic pest control methods. From companion planting to homemade sprays, this comprehensive guide covers natural solutions for common garden pests and diseases...",
        excerpt: "Discover effective and eco-friendly ways to manage garden pests naturally.",
        imageUrl: "/images/categories/pest_control_category.svg",
        datePublished: new Date("2023-06-14"),
        categoryId: 6, // Pest Control
      },
      {
        title: "Ultimate Guide to Composting at Home",
        slug: "ultimate-guide-composting-home",
        content: "Transform kitchen scraps and yard waste into garden gold with this comprehensive composting guide. Learn about different composting methods, what materials to use, troubleshooting common problems, and how to use your finished compost for amazing garden results...",
        excerpt: "Everything you need to know to start and maintain a successful compost system.",
        imageUrl: "/images/articles/composting_basics.svg",
        datePublished: new Date("2023-07-05"),
        categoryId: 1, // Vegetables (general gardening)
      }
    ];

    // Insert sample articles
    for (const article of articleData) {
      this.createArticle(article);
    }

    // Sample testimonials
    const testimonialData: InsertTestimonial[] = [
      {
        personName: "Sarah Johnson",
        role: "Hobby Gardener",
        avatarUrl: "/images/testimonials/sarah.svg",
        content: "I've been using the raised garden bed kit for two seasons now and it's held up beautifully. My vegetable yields have increased dramatically with the improved drainage and soil quality!",
        rating: 5,
      },
      {
        personName: "Michael Chen",
        role: "Urban Gardener",
        avatarUrl: "/images/testimonials/michael.svg",
        content: "As someone with limited space, the container gardening supplies have been a game-changer. I've successfully grown tomatoes, herbs, and even peppers on my small balcony!",
        rating: 5,
      },
      {
        personName: "Emma Rodriguez",
        role: "Master Gardener",
        avatarUrl: "/images/testimonials/emma.svg",
        content: "The organic pest control products have made a huge difference in my garden. I no longer worry about harmful chemicals affecting my family or the beneficial insects in my yard.",
        rating: 4,
      }
    ];

    // Insert sample testimonials
    for (const testimonial of testimonialData) {
      this.createTestimonial(testimonial);
    }

    // Add sample product images for multi-image support
    const productImageData: InsertProductImage[] = [
      // Raised Garden Bed Kit images
      {
        productId: 1,
        imageUrl: "/images/products/10328_Large_short_LightClay.svg",
        isPrimary: true,
        sortOrder: 0,
      },
      {
        productId: 1,
        imageUrl: "/images/products/raised_bed_2.svg",
        isPrimary: false,
        sortOrder: 1,
      },
      {
        productId: 1,
        imageUrl: "/images/products/raised_bed_3.svg",
        isPrimary: false,
        sortOrder: 2,
      },
      
      // Organic Vegetable Seed Collection images
      {
        productId: 2,
        imageUrl: "/images/articles/4560i-Heirloom-ORG-Seed-Bank-Collection_35vk3o_m4m7ls.svg",
        isPrimary: true,
        sortOrder: 0,
      },
      {
        productId: 2,
        imageUrl: "/images/products/seeds_2.svg",
        isPrimary: false,
        sortOrder: 1,
      },
      {
        productId: 2,
        imageUrl: "/images/products/seeds_3.svg",
        isPrimary: false,
        sortOrder: 2,
      },
      
      // Premium Garden Pruners images
      {
        productId: 3,
        imageUrl: "/images/products/garden_pruner.svg",
        isPrimary: true,
        sortOrder: 0,
      },
      {
        productId: 3,
        imageUrl: "/images/products/pruner_2.svg",
        isPrimary: false,
        sortOrder: 1,
      },
      
      // Persian Carpet Zinnia Seeds images (product ID 6, since it's the 6th product)
      {
        productId: 6,
        imageUrl: "/images/products/1193i_Zinnia-Persian-Carpet_3oykxo.svg",
        isPrimary: true,
        sortOrder: 0,
      },
      {
        productId: 6,
        imageUrl: "/images/products/zinnia_2.svg",
        isPrimary: false,
        sortOrder: 1,
      },
      {
        productId: 6,
        imageUrl: "/images/products/zinnia_3.svg",
        isPrimary: false,
        sortOrder: 2,
      },

      // Garden Gloves images (product ID 4, since we added it as the 4th product)
      {
        productId: 4,
        imageUrl: "/images/products/garden_gloves.svg",
        isPrimary: true,
        sortOrder: 0,
      },
      {
        productId: 4,
        imageUrl: "/images/products/garden_gloves_2.svg",
        isPrimary: false,
        sortOrder: 1,
      },
      {
        productId: 4,
        imageUrl: "/images/products/garden_gloves_3.svg",
        isPrimary: false,
        sortOrder: 2,
      },

      // Pruning Shears images (product ID 5, since we added it as the 5th product)
      {
        productId: 5,
        imageUrl: "/images/products/pruning_shears.svg",
        isPrimary: true,
        sortOrder: 0,
      },
      {
        productId: 5,
        imageUrl: "/images/products/shears_2.svg",
        isPrimary: false,
        sortOrder: 1,
      }
    ];

    // Insert sample product images
    for (const productImage of productImageData) {
      this.createProductImage(productImage);
    }
  }
}

export const storage = new MemStorage();
