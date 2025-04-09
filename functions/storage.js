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
    const articles = [
      {
        title: "Yellow Bush Beans: Growing Guide",
        slug: "yellow-bush-beans-growing-guide",
        content: `Yellow bush beans are one of the easiest and most productive vegetables for home gardeners. Here's how to grow them successfully:

## Benefits of Growing Yellow Bush Beans

Yellow bush beans, also known as wax beans, are compact, productive, and don't require trellising like pole beans. They're perfect for small gardens and containers, and their bright color makes them easy to spot during harvest.

## Starting from Seed

Direct sow seeds in the garden after all danger of frost has passed and soil temperatures reach at least 60°F. Plant seeds 1 inch deep and 2-3 inches apart in rows 18-24 inches apart. For continuous harvests, succession plant every 2-3 weeks.

## Growing Conditions

Bush beans thrive in full sun (6+ hours daily) and well-draining soil rich in organic matter. They prefer a soil pH between 6.0 and 7.0. Keep soil consistently moist but not waterlogged, especially during flowering and pod development.

## Care and Maintenance

Mulch around plants to conserve moisture and suppress weeds. Avoid working around bean plants when they're wet to prevent spreading diseases. Support bean plants with light stakes or cages if they become top-heavy with pods.

## Pest and Disease Management

Watch for common bean pests like bean beetles, aphids, and spider mites. Disease resistance varies by variety, but most yellow bush beans are fairly resistant to common bean diseases like anthracnose and bean mosaic virus.

## Harvesting and Storage

Harvest beans when they're young and tender, usually about 50-60 days after planting. Pick regularly to encourage continued production. Fresh beans will keep in the refrigerator for up to a week, or can be blanched and frozen for longer storage.

With their ease of growing and abundant harvests, yellow bush beans are a perfect choice for both beginner and experienced gardeners!`,
        excerpt: "Learn how to grow productive, crisp yellow bush beans in your garden with these simple growing tips.",
        imageUrl: "/images/categories/3139i_Bean-Bush-Goldrush-ORG-new2025_ndzu9h.svg",
        datePublished: new Date("2023-05-12"),
        categoryId: 1,
      },
      {
        title: "Growing Beautiful Nasturtiums in Your Garden",
        slug: "growing-beautiful-nasturtiums",
        content: `Nasturtiums are among the easiest and most rewarding flowers to grow, offering vibrant colors, edible blooms and leaves, and excellent companion planting benefits.

## Why Grow Nasturtiums

These versatile flowers add bright splashes of red, orange, and yellow to gardens while attracting beneficial pollinators. The entire plant is edible with a peppery taste similar to watercress, making them perfect for edible landscaping.

## Starting from Seed

Nasturtiums are easy to grow from seed. Their large seeds can be directly sown outdoors after the last frost, or started indoors 4 weeks before the last frost date. Plant seeds 1/2 inch deep, and thin seedlings to 8-12 inches apart.

## Growing Conditions

These flowers prefer full sun but will tolerate partial shade in hot climates. One of the secrets to prolific blooms is to grow them in poor to average soil with minimal fertilizer. Rich soil produces lush foliage but fewer flowers. Water moderately, allowing soil to dry between waterings.

## Varieties to Try

**Climbing varieties:** Ideal for trellises and fences, can reach 6-8 feet tall
**Dwarf varieties:** Perfect for containers and borders
**Fiesta Blend:** A beautiful mix of red, orange, and yellow flowers that creates a stunning display

## Culinary Uses

Harvest young leaves and flowers regularly to encourage continuous blooming. Add the peppery leaves to salads, use the colorful flowers as edible garnishes, or try pickling the seed pods as a substitute for capers.

## Companion Planting Benefits

Nasturtiums make excellent companion plants. They repel aphids, whiteflies, and cucumber beetles, making them valuable additions near vegetables like tomatoes, cucumbers, and brassicas.

With their easy growing requirements and multiple benefits, nasturtiums deserve a place in every garden!`,
        excerpt: "Discover how to grow vibrant, edible nasturtium flowers that add beauty to your garden and flavor to your plate.",
        imageUrl: "/images/categories/2026i_Nasturtium-Fiesta-Blend_6ceu81.svg", 
        datePublished: new Date("2023-05-08"),
        categoryId: 2,
      }
    ];

    // Add new gardening articles
    const newArticles = [
      {
        title: "Spring Gardening Tips for a Bountiful Season",
        slug: "spring-gardening-tips-bountiful-season",
        content: `Spring is the perfect time to prepare your garden for a season of abundant growth. Here are essential tips to get your garden off to a great start.

## Early Spring Garden Preparation

As soon as soil can be worked, clear out winter debris, add compost, and test your soil pH. Most vegetables and flowers prefer a slightly acidic to neutral pH (6.0-7.0). Adjust soil pH if necessary using lime to raise pH or sulfur to lower it.

## Smart Seed Starting

Get a jump on the growing season by starting seeds indoors 6-8 weeks before your last frost date. Use a quality seed starting mix and provide consistent moisture and bright light. Harden off seedlings before transplanting by gradually exposing them to outdoor conditions over 7-10 days.

## Strategic Planting Schedule

Follow a strategic planting schedule based on your local frost dates:

**4-6 weeks before last frost:** Plant cold-tolerant vegetables like peas, spinach, and radishes
**2-4 weeks before last frost:** Plant potatoes, carrots, beets, and onions
**After last frost:** Plant warm-season crops like tomatoes, peppers, and cucumbers

## Water Management

Set up an efficient watering system early in the season. Drip irrigation or soaker hoses deliver water directly to plant roots while minimizing evaporation and fungal issues. Apply a 2-3 inch layer of mulch to conserve moisture and suppress weeds.

## Pest Prevention

Take preventative measures against pests with these organic approaches:

- Install physical barriers like row covers for vulnerable young plants
- Plant companion flowers like marigolds and nasturtiums to repel certain pests
- Introduce beneficial insects like ladybugs and lacewings
- Implement crop rotation to disrupt pest life cycles

## Early Season Maintenance

Stay ahead of garden maintenance by setting aside 15-30 minutes several times a week to pull young weeds, inspect plants for problems, and provide support for growing vines and stems before they need it.

With these spring gardening tips, you'll create the foundation for a productive and beautiful garden throughout the growing season!`,
        excerpt: "Set your garden up for success with these essential spring gardening tasks and tips for a productive growing season.",
        imageUrl: "/images/articles/spring_gardening_tips.svg",
        datePublished: new Date("2023-03-10"),
        categoryId: 1,
      }
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
    const testimonials = [
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
    testimonials.forEach((testimonial) => {
      this.createTestimonial(testimonial);
    });
  }
}

// Export a singleton instance
const storage = new MemStorage();
module.exports = { MemStorage, storage };
