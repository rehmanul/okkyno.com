import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import { format } from "date-fns";

const LatestArticles = () => {
  const { data: articles, isLoading, error } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-4 md:mb-0">Latest Gardening Articles</h2>
            <Link href="/blog" className="font-montserrat font-semibold text-primary hover:underline">View All Articles</Link>
          </div>
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-4 md:mb-0">Latest Gardening Articles</h2>
            <Link href="/blog" className="font-montserrat font-semibold text-primary hover:underline">View All Articles</Link>
          </div>
          <p className="text-center text-red-500">Failed to load articles</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="font-montserrat font-bold text-2xl md:text-3xl mb-4 md:mb-0">Latest Gardening Articles</h2>
          <Link href="/blog" className="font-montserrat font-semibold text-primary hover:underline">View All Articles</Link>
        </div>
        
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
                    <i className="far fa-folder mr-1"></i> Vegetables
                  </span>
                </div>
                <Link href={`/article/${article.slug}`}>
                  <h3 className="font-montserrat font-semibold text-xl mb-3 hover:text-primary transition duration-300">{article.title}</h3>
                </Link>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <Link href={`/article/${article.slug}`} className="inline-block font-semibold text-primary hover:underline">Read More</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;
