import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight, CalendarIcon, MessageSquare } from 'lucide-react';
import { BlogPost } from '@shared/schema';
import { formatShortDate, truncateText } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedBlogs() {
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    queryFn: async () => {
      const response = await fetch('/api/blog?limit=3');
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      return response.json();
    }
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-heading font-bold">Latest From The Blog</h2>
            <Link href="/blog" className="text-primary hover:underline font-semibold">
              View All Articles <ArrowRight className="h-4 w-4 ml-1 inline" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <Skeleton className="h-4 w-24 mr-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !posts) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-heading font-bold">Latest From The Blog</h2>
            <Link href="/blog" className="text-primary hover:underline font-semibold">
              View All Articles <ArrowRight className="h-4 w-4 ml-1 inline" />
            </Link>
          </div>
          <div className="text-center text-gray-500 py-8">
            Unable to load blog posts. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-heading font-bold">Latest From The Blog</h2>
          <Link href="/blog" className="text-primary hover:underline font-semibold">
            View All Articles <ArrowRight className="h-4 w-4 ml-1 inline" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <Link href={`/blog/${post.slug}`}>
                <a className="block">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.imageUrl || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2 text-sm text-gray-600">
                      <span className="mr-4 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" /> 
                        {formatShortDate(post.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" /> 
                        {post.commentCount} Comments
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-2 hover:text-primary transition">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt || truncateText(post.content.replace(/<[^>]*>/g, ''), 150)}
                    </p>
                    <span className="text-primary font-semibold hover:underline">Read More</span>
                  </div>
                </a>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
