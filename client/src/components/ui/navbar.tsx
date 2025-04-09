import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import MobileMenu from "./mobile-menu";
import SearchDialog from "./search-dialog";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Navigation */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="hidden md:flex space-x-6 text-sm">
            <Link href="/about">
              <span className="hover:text-secondary transition-colors duration-200 flex items-center gap-2 cursor-pointer">
                <i className="fas fa-info-circle"></i>
                <span>About</span>
              </span>
            </Link>
            <Link href="/contact">
              <span className="hover:text-secondary transition-colors duration-200 flex items-center gap-2 cursor-pointer">
                <i className="fas fa-envelope"></i>
                <span>Contact</span>
              </span>
            </Link>
            <Link href="/shop">
              <span className="hover:text-secondary transition-colors duration-200 flex items-center gap-2 cursor-pointer">
                <i className="fas fa-store"></i>
                <span>Shop</span>
              </span>
            </Link>
          </div>
          <div className="flex space-x-6 text-sm ml-auto">
            {[
              { icon: "facebook-f", url: "#" },
              { icon: "instagram", url: "#" },
              { icon: "youtube", url: "#" },
              { icon: "pinterest", url: "#" }
            ].map((social) => (
              <motion.span
                key={social.icon}
                className="hover:text-secondary transition-colors duration-200 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className={`fab fa-${social.icon}`}></i>
              </motion.span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <motion.div 
        className="container mx-auto px-4 py-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <motion.button 
              className="mr-4 md:hidden text-gray-600 hover:text-primary transition-colors"
              onClick={toggleMobileMenu}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-bars text-xl"></i>
            </motion.button>
            <Link href="/">
              <span className="flex items-center gap-2 cursor-pointer">
                <i className="fas fa-leaf text-primary text-2xl"></i>
                <span className="font-inter font-bold text-xl md:text-2xl text-gray-900">
                  Okkyno <span className="text-primary">Gardening</span>
                </span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <div className="group relative">
              <Link href="/shop">
                <span className="font-inter font-semibold text-gray-700 hover:text-primary transition-colors duration-200 flex items-center gap-1 cursor-pointer">
                  Shop
                  <i className="fas fa-chevron-down text-xs transition-transform group-hover:rotate-180"></i>
                </span>
              </Link>
              <motion.div 
                className="absolute bg-white shadow-lg rounded-lg p-4 mt-2 w-56 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200"
                initial={false}
              >
                <div className="space-y-2">
                  {[
                    { label: "Vegetables & Herbs", href: "/category/vegetables" },
                    { label: "Flowers & Plants", href: "/category/flowers" },
                    { label: "Seeds Collection", href: "/category/seeds" },
                    { label: "Gardening Tools", href: "/category/tools" }
                  ].map((item) => (
                    <Link key={item.href} href={item.href}>
                      <span className="block py-2 px-3 rounded-md hover:bg-gray-50 text-gray-700 hover:text-primary transition-colors cursor-pointer">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="group relative">
              <Link href="/raised-beds">
                <span className="font-inter font-semibold text-gray-700 hover:text-primary transition-colors duration-200 flex items-center gap-1 cursor-pointer">
                  Raised Beds
                  <i className="fas fa-chevron-down text-xs transition-transform group-hover:rotate-180"></i>
                </span>
              </Link>
              <motion.div 
                className="absolute bg-white shadow-lg rounded-lg p-4 mt-2 w-56 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200"
                initial={false}
              >
                <div className="space-y-2">
                  {[
                    { label: "All Raised Beds", href: "/category/raised-beds" },
                    { label: "Container Gardens", href: "/category/container-gardening" },
                    { label: "Accessories", href: "/category/accessories" }
                  ].map((item) => (
                    <Link key={item.href} href={item.href}>
                      <span className="block py-2 px-3 rounded-md hover:bg-gray-50 text-gray-700 hover:text-primary transition-colors cursor-pointer">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="group relative">
              <Link href="/guides">
                <span className="font-inter font-semibold text-gray-700 hover:text-primary transition-colors duration-200 flex items-center gap-1 cursor-pointer">
                  Guides
                  <i className="fas fa-chevron-down text-xs transition-transform group-hover:rotate-180"></i>
                </span>
              </Link>
              <motion.div 
                className="absolute bg-white shadow-lg rounded-lg p-4 mt-2 w-56 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200"
                initial={false}
              >
                <div className="space-y-2">
                  {[
                    { label: "Beginner's Guide", href: "/guides/beginners" },
                    { label: "Seasonal Tips", href: "/guides/seasonal" },
                    { label: "Advanced Techniques", href: "/guides/advanced" }
                  ].map((item) => (
                    <Link key={item.href} href={item.href}>
                      <span className="block py-2 px-3 rounded-md hover:bg-gray-50 text-gray-700 hover:text-primary transition-colors cursor-pointer">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            <Link href="/blog">
              <span className="font-inter font-semibold text-gray-700 hover:text-primary transition-colors duration-200 cursor-pointer">
                Blog
              </span>
            </Link>
            
            <Link href="/podcast">
              <span className="font-inter font-semibold text-gray-700 hover:text-primary transition-colors duration-200 cursor-pointer">
                Podcast
              </span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-6">
            <motion.button 
              className="text-gray-600 hover:text-primary transition-colors"
              onClick={toggleSearch}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Search"
            >
              <i className="fas fa-search text-xl"></i>
            </motion.button>
            <Link href="/cart">
              <motion.span 
                className="text-gray-600 hover:text-primary transition-colors relative cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-shopping-cart text-xl"></i>
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
      
      {/* Search Dialog */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
