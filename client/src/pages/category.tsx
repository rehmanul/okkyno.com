import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Category, Product, Article } from "@shared/schema";
import { useEffect, useState } from "react";
import Newsletter from "@/components/home/newsletter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CategoryPage = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("products");

  const { data: category, isLoading: isLoadingCategory } = useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
  });

  useEffect(() => {
    if (category) {
      document.title = `${category.name} - Epic Gardening`;
    } else {
      document.title = "Category - Epic Gardening";
    }
  }, [category]);

  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: [`/api/categories/${category?.id}/products`],
    enabled: !!category?.id,
  });

  const { data: articles, isLoading: isLoadingArticles } = useQuery<Article[]>({
    queryKey: [`/api/categories/${category?.id}/articles`],
    enabled: !!category?.id,
  });

  if (isLoadingCategory) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-10 bg-gray-200 rounded w-28"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-lg mx-auto">
          <div className="text-primary text-4xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h1 className="font-montserrat font-bold text-2xl mb-4">Category Not Found</h1>
          <p className="text-gray-700 mb-6">The category you're looking for doesn't exist or may have been removed.</p>
          <Link href="/">
            <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-md">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-center mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-center text-gray-700 max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="products" className="w-full max-w-4xl mx-auto mb-8" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-6">
              <TabsList>
                <TabsTrigger value="products" className="font-montserrat">Products</TabsTrigger>
                <TabsTrigger value="articles" className="font-montserrat">Articles</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="products">
              {isLoadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
                      <div className="h-64 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                        <div className="flex justify-between items-center">
                          <div className="h-5 bg-gray-200 rounded w-16"></div>
                          <div className="h-10 bg-gray-200 rounded w-28"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products?.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                      <div className="relative">
                        <Link href={`/product/${product.slug}`}>
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-64 object-cover"
                          />
                        </Link>
                        {(product.isBestSeller || product.isNew) && (
                          <div className="absolute top-2 right-2">
                            {product.isBestSeller && (
                              <span className="bg-accent text-white text-sm font-semibold px-2 py-1 rounded-md">Best Seller</span>
                            )}
                            {product.isNew && !product.isBestSeller && (
                              <span className="bg-primary text-white text-sm font-semibold px-2 py-1 rounded-md">New</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="font-montserrat font-semibold text-lg mb-2 hover:text-primary transition duration-300">{product.name}</h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-3">{product.shortDescription}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                          <button className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-primary text-4xl mb-4">
                    <i className="fas fa-leaf"></i>
                  </div>
                  <h2 className="font-montserrat font-bold text-xl mb-2">No Products Found</h2>
                  <p className="text-gray-700 mb-6">We don't have any products in this category yet. Check back soon!</p>
                  <Link href="/shop">
                    <button className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md">
                      Browse All Products
                    </button>
                  </Link>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="articles">
              {isLoadingArticles ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <div className="h-4 bg-gray-200 rounded w-24 mr-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : articles && articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles?.map((article) => (
                    <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                      <Link href={`/article/${article.slug}`}>
                        <img 
                          src={article.imageUrl} 
                          alt={article.title} 
                          className="w-full h-48 object-cover"
                        />
                      </Link>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span className="mr-4">
                            <i className="far fa-calendar mr-1"></i> {new Date(article.datePublished).toLocaleDateString()}
                          </span>
                          <span>
                            <i className="far fa-folder mr-1"></i> {category.name}
                          </span>
                        </div>
                        <Link href={`/article/${article.slug}`}>
                          <h3 className="font-montserrat font-semibold text-xl mb-3 hover:text-primary transition duration-300">{article.title}</h3>
                        </Link>
                        <p className="text-gray-600 mb-4">{article.excerpt}</p>
                        <Link href={`/article/${article.slug}`} className="inline-block font-semibold text-primary hover:underline">
                          Read More
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-primary text-4xl mb-4">
                    <i className="fas fa-book-open"></i>
                  </div>
                  <h2 className="font-montserrat font-bold text-xl mb-2">No Articles Found</h2>
                  <p className="text-gray-700 mb-6">We don't have any articles in this category yet. Check back soon!</p>
                  <Link href="/blog">
                    <button className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md">
                      Browse All Articles
                    </button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Newsletter />
    </>
  );
};

export default CategoryPage;
