import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Article } from "@shared/schema";
import { useEffect } from "react";
import { format } from "date-fns";
import Newsletter from "@/components/home/newsletter";

const ArticlePage = () => {
  const { slug } = useParams();

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
  });

  useEffect(() => {
    if (article) {
      document.title = `${article.title} - Epic Gardening`;
    } else {
      document.title = "Article - Epic Gardening";
    }
  }, [article]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="flex items-center mb-6">
              <div className="h-4 bg-gray-200 rounded w-32 mr-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-lg mx-auto">
          <div className="text-primary text-4xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h1 className="font-montserrat font-bold text-2xl mb-4">Article Not Found</h1>
          <p className="text-gray-700 mb-6">The article you're looking for doesn't exist or may have been removed.</p>
          <Link href="/blog">
            <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-md">
              Back to Blog
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-secondary py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog" className="text-sm text-primary hover:underline mb-4 inline-block">
              <i className="fas fa-arrow-left mr-2"></i> Back to Blog
            </Link>
            <h1 className="font-montserrat font-bold text-3xl md:text-4xl mb-4">{article.title}</h1>
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-4">
                <i className="far fa-calendar mr-1"></i> {format(new Date(article.datePublished), 'MMMM d, yyyy')}
              </span>
              <span>
                <i className="far fa-folder mr-1"></i> Category
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <img 
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-auto rounded-lg shadow-md mb-8"
            />

            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="font-montserrat font-bold text-xl mb-4">Share This Article</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-primary hover:text-primary/80 transition">
                  <i className="fab fa-facebook-f text-xl"></i>
                </a>
                <a href="#" className="text-primary hover:text-primary/80 transition">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-primary hover:text-primary/80 transition">
                  <i className="fab fa-pinterest text-xl"></i>
                </a>
                <a href="#" className="text-primary hover:text-primary/80 transition">
                  <i className="fab fa-linkedin-in text-xl"></i>
                </a>
                <a href="#" className="text-primary hover:text-primary/80 transition">
                  <i className="fas fa-envelope text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-montserrat font-bold text-2xl mb-8 text-center">Related Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* This would normally fetch related articles based on category or tags */}
              {/* For now, we'll just display placeholder sections */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <Link href="/blog">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <i className="fas fa-seedling text-4xl text-primary/20"></i>
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="font-montserrat font-semibold text-lg mb-2 hover:text-primary transition duration-300">Explore More Gardening Articles</h3>
                  <p className="text-gray-600 mb-3">Check out our collection of gardening tips, guides, and inspiration.</p>
                  <Link href="/blog" className="inline-block font-semibold text-primary hover:underline">View All Articles</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
};

export default ArticlePage;
