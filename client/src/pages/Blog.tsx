import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Article } from '@shared/schema';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Article Card Component
const ArticleCard = ({ article }: { article: Article }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video">
        <img 
          src={article.imageUrl || '/images/articles/default.svg'} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
          <span>{article.categoryId ? article.categoryName : 'Gardening'}</span>
          <span>•</span>
          <span>{formatDate(article.createdAt || new Date().toISOString())}</span>
        </div>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">
          <Link href={`/blog/${article.slug}`}>
            <a className="hover:text-primary transition-colors">{article.title}</a>
          </Link>
        </h3>
        <p className="text-gray-600 line-clamp-3 mb-4">
          {article.excerpt}
        </p>
        <Link href={`/blog/${article.slug}`}>
          <a className="text-primary font-medium hover:underline inline-flex items-center">
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </Link>
      </div>
    </div>
  );
};

// Featured Article Component
const FeaturedArticle = ({ article }: { article: Article }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-video md:aspect-auto">
          <img
            src={article.imageUrl || '/images/articles/featured.svg'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-8 flex flex-col justify-center">
          <span className="text-primary font-semibold mb-4">Featured Article</span>
          <h2 className="text-3xl font-bold mb-4">
            {article.title}
          </h2>
          <p className="text-gray-600 mb-6">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
              {article.authorName ? article.authorName.charAt(0) : 'A'}
            </div>
            <div>
              <p className="font-medium">{article.authorName || 'Garden Expert'}</p>
              <p className="text-sm text-gray-500">{formatDate(article.createdAt || new Date().toISOString())} · {article.readTime || '5'} min read</p>
            </div>
          </div>
          <Link href={`/blog/${article.slug}`}>
            <Button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors self-start">
              Read Article
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main Blog Page Component
const Blog = () => {
  useEffect(() => {
    document.title = "Blog - Okkyno";
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showCategories, setShowCategories] = useState(false);

  // Fetch articles
  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Filter articles based on search and category
  const filteredArticles = articles?.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || article.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get featured article (first one or null)
  const featuredArticle = articles && articles.length > 0 ? articles[0] : null;
  
  // Get remaining articles
  const remainingArticles = filteredArticles?.slice(featuredArticle ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gardening Blog & Resources
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Expert tips, in-depth guides, and inspiring stories to help you create and maintain 
            your perfect garden.
          </p>
        </div>
      </div>

      {/* Featured Article */}
      <div className="container mx-auto px-4 py-12">
        {articlesLoading ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="aspect-video md:aspect-auto w-full h-full" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        ) : featuredArticle ? (
          <FeaturedArticle article={featuredArticle} />
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <p>No articles found. Check back soon for great gardening content!</p>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              
              {categoriesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                        selectedCategory === null
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      <span>All Categories</span>
                    </button>
                  </li>
                  {categories?.map((category) => (
                    <li key={category.id}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                          selectedCategory === category.id
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-500">
                          {articles?.filter(a => a.categoryId === category.id).length || 0}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <hr className="my-6" />

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Vegetables', 'Herbs', 'Indoor Plants', 'Composting', 'Seeds'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Categories Button */}
          <div className="lg:hidden">
            <button
              className="w-full bg-white shadow rounded-lg px-4 py-3 flex items-center justify-between"
              onClick={() => setShowCategories(!showCategories)}
            >
              <span className="font-medium">Categories</span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showCategories ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Mobile Categories Panel */}
            {showCategories && (
              <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        selectedCategory === null ? 'bg-primary/10 text-primary' : ''
                      }`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories?.map((category) => (
                    <li key={category.id}>
                      <button
                        className={`w-full text-left px-3 py-2 rounded-lg ${
                          selectedCategory === category.id ? 'bg-primary/10 text-primary' : ''
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Articles Grid */}
            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : remainingArticles && remainingArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {remainingArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p>No articles found matching your criteria.</p>
                {selectedCategory !== null && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedCategory(null)} 
                    className="mt-4"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;