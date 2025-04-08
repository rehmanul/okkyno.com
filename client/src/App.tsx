import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Product from "@/pages/Product";
import Category from "@/pages/Category";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Blog from "@/pages/Blog";
import Article from "@/pages/Article";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import { CartProvider } from "@/contexts/CartContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:slug" component={Product} />
      <Route path="/category/:slug">
        {(params) => <Category routeParams={params} />}
      </Route>
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/blog" component={Blog} />
      <Route path="/article/:slug" component={Article} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/guides" component={Blog} />
      <Route path="/vegetables">
        {() => <Category slug="vegetables" />}
      </Route>
      <Route path="/herbs">
        {() => <Category slug="herbs" />}
      </Route>
      <Route path="/fruits">
        {() => <Category slug="fruits" />}
      </Route>
      <Route path="/flowers">
        {() => <Category slug="flowers" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router />
        <Toaster />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
