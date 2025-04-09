import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { CartProvider } from "./contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

// Components
import Navbar from "./components/ui/navbar";
import Footer from "./components/ui/footer";

// Pages
import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Shop from "./pages/shop";
import Blog from "./pages/blog";
import Podcast from "./pages/podcast";
import Product from "./pages/product";
import Article from "./pages/article";
import Category from "./pages/category";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Guides from "./pages/guides";
import GuideCategory from "./pages/guide-category";
import GuideDetail from "./pages/guide-detail";
import NotFound from "./pages/not-found";

// Types for pages with slug props
interface SlugPageProps {
  slug: string;
}

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <AnimatePresence mode="wait">
        <main className="flex-grow">
          <Switch>
            <Route path="/">
              {() => (
                <PageWrapper>
                  <Home />
                </PageWrapper>
              )}
            </Route>
            <Route path="/about">
              {() => (
                <PageWrapper>
                  <About />
                </PageWrapper>
              )}
            </Route>
            <Route path="/contact">
              {() => (
                <PageWrapper>
                  <Contact />
                </PageWrapper>
              )}
            </Route>
            <Route path="/shop">
              {() => (
                <PageWrapper>
                  <Shop />
                </PageWrapper>
              )}
            </Route>
            <Route path="/blog">
              {() => (
                <PageWrapper>
                  <Blog />
                </PageWrapper>
              )}
            </Route>
            <Route path="/guides">
              {() => (
                <PageWrapper>
                  <Guides />
                </PageWrapper>
              )}
            </Route>
            <Route path="/guides/category/:slug">
              {(params) => (
                <PageWrapper>
                  <GuideCategory />
                </PageWrapper>
              )}
            </Route>
            <Route path="/guides/:slug">
              {(params) => (
                <PageWrapper>
                  <GuideDetail />
                </PageWrapper>
              )}
            </Route>
            <Route path="/podcast">
              {() => (
                <PageWrapper>
                  <Podcast />
                </PageWrapper>
              )}
            </Route>
            <Route path="/product/:slug">
              {(params) => (
                <PageWrapper>
                  <Product {...params as SlugPageProps} />
                </PageWrapper>
              )}
            </Route>
            <Route path="/article/:slug">
              {(params) => (
                <PageWrapper>
                  <Article {...params as SlugPageProps} />
                </PageWrapper>
              )}
            </Route>
            <Route path="/category/:slug">
              {(params) => (
                <PageWrapper>
                  <Category {...params as SlugPageProps} />
                </PageWrapper>
              )}
            </Route>
            <Route path="/cart">
              {() => (
                <PageWrapper>
                  <Cart />
                </PageWrapper>
              )}
            </Route>
            <Route path="/checkout">
              {() => (
                <PageWrapper>
                  <Checkout />
                </PageWrapper>
              )}
            </Route>
            <Route>
              {() => (
                <PageWrapper>
                  <NotFound />
                </PageWrapper>
              )}
            </Route>
          </Switch>
        </main>
      </AnimatePresence>
      <Footer />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
