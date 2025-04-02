import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import { useEffect } from "react";
import { format } from "date-fns";
import Newsletter from "@/components/home/newsletter";

const Blog = () => {
  useEffect(() => {
    document.title = "Blog - Epic Gardening";
  }, []);

  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  return (
    <>
      <div className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-center">Gardening Blog</h1>
          <p className="text-center text-gray-700 mt-4 max-w-2xl mx-auto">
            Expert gardening tips, guides, and inspiration to help you grow beautiful gardens and delicious homegrown food
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
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
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">Failed to load articles. Please try again later.</p>
            </div>
          ) : (
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
                        <i className="far fa-calendar mr-1"></i> {format(new Date(article.datePublished), 'MMM d, yyyy')}
                      </span>
                      <span>
                        <i className="far fa-folder mr-1"></i> Category
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
          )}
        </div>
      </section>

      <Newsletter />
    </>
  );
};

export default Blog;
