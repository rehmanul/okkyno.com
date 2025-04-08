import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const ProductCard = ({ product }: { product: Product }) => {
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <Link href={`/product/${product.slug}`}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-64 object-cover"
          />
        </Link>
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {product.isBestSeller && (
            <Badge variant="destructive">Best Seller</Badge>
          )}
          {product.isNew && (
            <Badge>New</Badge>
          )}
          {product.salePrice && (
            <Badge variant="outline" className="bg-white">
              Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
            </Badge>
          )}
        </div>
      </div>
      <CardHeader className="pb-2">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-lg hover:text-primary transition-colors">{product.name}</h3>
        </Link>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground flex-grow">
        <p>{product.shortDescription}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 border-t">
        <div>
          {product.salePrice ? (
            <div className="flex items-center">
              <span className="font-bold text-lg text-primary">${product.salePrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through ml-2">${product.price.toFixed(2)}</span>
            </div>
          ) : (
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
          )}
        </div>
        <Button size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};

const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Take only first 4 products
  const featuredProducts = products?.slice(0, 4) || [];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="font-bold text-2xl md:text-3xl mb-4 md:mb-0">Top Gardening Products</h2>
          <Link href="/shop">
            <Button variant="link" className="font-semibold text-primary p-0">
              View All Products →
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardHeader>
                  <Skeleton className="h-5 w-3/4 mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-9 w-20" />
                </CardFooter>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-full text-center">
              <p className="text-red-500">Failed to load products. Please try again later.</p>
            </div>
          ) : (
            featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;