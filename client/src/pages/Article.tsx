import { useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Article as ArticleType } from '@shared/schema';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';

// Component to render a placeholder skeleton while loading
const ArticleSkeleton = () => (
  <>
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      
      <div className="mb-8 flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
    </div>
    
    <Skeleton className="aspect-video w-full max-w-5xl mx-auto mb-10" />
    
    <div className="max-w-4xl mx-auto space-y-4">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-2/3" />
    </div>
  </>
);

// Date formatter helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Main Article component
const Article = () => {
  // Get article slug from URL
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug || '';
  
  // Fetch article data
  const { data: article, isLoading, error } = useQuery<ArticleType>({
    queryKey: ['/api/articles', slug],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${slug}`);
      if (!response.ok) throw new Error('Article not found');
      return response.json();
    },
    enabled: !!slug,
  });
  
  useEffect(() => {
    // Update page title when article loads
    if (article) {
      document.title = `${article.title} - Okkyno`;
    } else {
      document.title = 'Article - Okkyno';
    }
  }, [article]);
  
  // Handle error state
  if (error) {
    return (
      <div className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Article Not Found</h1>
          <p className="text-gray-600 mb-8">
            The article you're looking for doesn't exist or may have been removed.
          </p>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {isLoading ? (
        <ArticleSkeleton />
      ) : article ? (
        <>
          {/* Article header */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Link href="/blog">
                <Button variant="ghost" className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Back to Articles
                </Button>
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            
            <div className="text-lg text-gray-600 mb-8">{article.excerpt}</div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
                {article.authorName ? article.authorName.charAt(0) : 'A'}
              </div>
              <div>
                <div className="font-medium">{article.authorName || 'Garden Expert'}</div>
                <div className="text-sm text-gray-500">
                  {article.createdAt ? (
                    <>
                      {formatDate(article.createdAt)} • {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                    </>
                  ) : (
                    'Recently published'
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured image */}
          <div className="max-w-5xl mx-auto mb-10">
            <img 
              src={article.imageUrl || '/images/articles/default.svg'} 
              alt={article.title} 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          
          {/* Article content */}
          <div className="max-w-4xl mx-auto prose prose-green prose-lg lg:prose-xl">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <div className="py-10">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                </p>
                <p>
                  Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                </p>
                <h2>Getting Started</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                </p>
                <p>
                  Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                </p>
              </div>
            )}
          </div>
          
          {/* Article tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="max-w-4xl mx-auto mt-10 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Related articles placeholder */}
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-video bg-gray-200"></div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-2">Gardening</div>
                    <h3 className="font-medium mb-2">Related Article Title</h3>
                    <Link href="/blog">
                      <a className="text-primary text-sm font-medium hover:underline">Read more</a>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Article;