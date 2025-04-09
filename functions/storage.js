// functions/storage.js
class MemStorage {
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
  async getUser(id) {
    return this.users.get(id);
  }

  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories() {
    return Array.from(this.categories.values());
  }

  async getCategory(id) {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug) {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(insertCategory) {
    const id = this.currentCategoryId++;
    const category = {
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
  async getProducts() {
    return Array.from(this.products.values());
  }

  async getProduct(id) {
    return this.products.get(id);
  }

  async getProductBySlug(slug) {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }

  async getProductsByCategory(categoryId) {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }

  async createProduct(insertProduct) {
    const id = this.currentProductId++;
    const product = {
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
  async createProductImage(insertProductImage) {
    const id = this.currentProductImageId++;
    const productImage = {
      id,
      productId: insertProductImage.productId,
      imageUrl: insertProductImage.imageUrl,
      isPrimary: insertProductImage.isPrimary || false,
      sortOrder: insertProductImage.sortOrder || 0,
    };
    this.productImages.set(id, productImage);
    return productImage;
  }

  async getProductImages(productId) {
    return Array.from(this.productImages.values()).filter(
      (image) => image.productId === productId
    );
  }

  // Article methods
  async getArticles() {
    return Array.from(this.articles.values());
  }

  async getArticle(id) {
    return this.articles.get(id);
  }

  async getArticleBySlug(slug) {
    return Array.from(this.articles.values()).find(
      (article) => article.slug === slug
    );
  }

  async getArticlesByCategory(categoryId) {
    return Array.from(this.articles.values()).filter(
      (article) => article.categoryId === categoryId
    );
  }

  async createArticle(insertArticle) {
    const id = this.currentArticleId++;
    const article = {
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
  async getTestimonials() {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial) {
    const id = this.currentTestimonialId++;
    const testimonial = {
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
  async createSubscriber(insertSubscriber) {
    // Check if email already exists
    const existingSubscriber = Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email === insertSubscriber.email
    );
    if (existingSubscriber) {
      return existingSubscriber;
    }
    const id = this.currentSubscriberId++;
    const subscriber = {
      ...insertSubscriber,
      id,
      dateSubscribed: new Date(),
    };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }

  // Contact methods
  async createContact(insertContact) {
    const id = this.currentContactId++;
    const contact = {
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
  async search(query) {
    const lowercaseQuery = query.toLowerCase();
    
    const matchedProducts = Array.from(this.products.values()).filter(
      (product) => product.name.toLowerCase().includes(lowercaseQuery) || 
        (product.description && product.description.toLowerCase().includes(lowercaseQuery))
    );
    
    const matchedArticles = Array.from(this.articles.values()).filter(
      (article) => article.title.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(lowercaseQuery))
    );
    
    const matchedCategories = Array.from(this.categories.values()).filter(
      (category) => category.name.toLowerCase().includes(lowercaseQuery) ||
        (category.description && category.description.toLowerCase().includes(lowercaseQuery))
    );
    
    return {
      products: matchedProducts,
      articles: matchedArticles,
      categories: matchedCategories,
    };
  }

  // Initialize with sample data
  initializeSampleData() {
    // Sample categories
    const categoryData = [
      {
        name: "Vegetables",
        slug: "vegetables",
        description: "Seeds, plants, and supplies for growing your own delicious vegetables",
        imageUrl: "/images/categories/3139i_Bean-Bush-Goldrush-ORG-new2025_ndzu9h.svg",
        parentId: null,
      },
      {
        name: "Flowers",
        slug: "flowers",
        description: "Beautify your garden with a wide variety of flowering plants",
        imageUrl: "/images/categories/2026i_Nasturtium-Fiesta-Blend_6ceu81.svg",
        parentId: null,
      },
      {
        name: "Container Gardening",
        slug: "container-gardening",
        description: "Everything you need for successful gardening in pots and planters",
        imageUrl: "/images/categories/10331_Medium_Tall_LightClay_Compressed.svg",
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
      {
        name: "Pest Control",
        slug: "pest-control",
        description: "Eco-friendly solutions for garden pests and diseases",
        imageUrl: "/images/categories/pest_control_category.svg",
        parentId: null,
      }
    ];

    // Insert sample categories
    for (const category of categoryData) {
      this.createCategory(category);
    }

    // Sample products
    const productData = [
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
      }
    ];

    // Insert sample products
    for (const product of productData) {
      this.createProduct(product);
    }

    // Sample articles
    const articleData = [
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
      }
    ];

    // Insert sample articles
    for (const article of articleData) {
      this.createArticle(article);
    }

    // Sample testimonials
    const testimonialData = [
      {
        personName: "Sarah Johnson",
        role: "Hobby Gardener",
        avatarUrl: "/images/testimonials/sarah.svg",
        content: "I've been using the raised garden bed kit for two seasons now and it's held up beautifully. My vegetable yields have increased dramatically with the improved drainage and soil quality!",
        rating: 5,
      }
    ];

    // Insert sample testimonials
    for (const testimonial of testimonialData) {
      this.createTestimonial(testimonial);
    }

    // Add sample product images
    const productImageData = [
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
      }
    ];

    // Insert sample product images
    for (const productImage of productImageData) {
      this.createProductImage(productImage);
    }
  }
}

// Export a singleton instance
const storage = new MemStorage();
module.exports = { MemStorage, storage };
