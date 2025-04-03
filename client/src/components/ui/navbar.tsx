import { useState } from "react";
import { Link, useLocation } from "wouter";
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
          <div className="hidden md:flex space-x-4 text-sm">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/shop" className="hover:underline">Shop</Link>
          </div>
          <div className="flex space-x-4 text-sm ml-auto">
            <a href="#" className="hover:underline flex items-center">
              <i className="fab fa-facebook-f mr-1"></i>
            </a>
            <a href="#" className="hover:underline flex items-center">
              <i className="fab fa-instagram mr-1"></i>
            </a>
            <a href="#" className="hover:underline flex items-center">
              <i className="fab fa-youtube mr-1"></i>
            </a>
            <a href="#" className="hover:underline flex items-center">
              <i className="fab fa-pinterest mr-1"></i>
            </a>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            className="mr-2 md:hidden"
            onClick={toggleMobileMenu}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <Link href="/" className="font-montserrat font-bold text-xl md:text-2xl text-primary">
            Epic Gardening
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <div className="dropdown relative group">
            <Link href="/category/vegetables" className="font-montserrat font-semibold hover:text-primary flex items-center">
              Plants <i className="fas fa-chevron-down ml-1 text-xs"></i>
            </Link>
            <div className="dropdown-menu absolute bg-white shadow-lg p-4 mt-2 w-48 rounded-md z-50 hidden group-hover:block">
              <Link href="/category/vegetables" className="block py-2 hover:text-primary">Vegetables</Link>
              <Link href="/category/herbs" className="block py-2 hover:text-primary">Herbs</Link>
              <Link href="/category/flowers" className="block py-2 hover:text-primary">Flowers</Link>
              <Link href="/category/indoor-plants" className="block py-2 hover:text-primary">Indoor Plants</Link>
            </div>
          </div>
          <div className="dropdown relative group">
            <Link href="/category/hand-tools" className="font-montserrat font-semibold hover:text-primary flex items-center">
              Tools <i className="fas fa-chevron-down ml-1 text-xs"></i>
            </Link>
            <div className="dropdown-menu absolute bg-white shadow-lg p-4 mt-2 w-48 rounded-md z-50 hidden group-hover:block">
              <Link href="/category/hand-tools" className="block py-2 hover:text-primary">Hand Tools</Link>
              <Link href="/category/power-tools" className="block py-2 hover:text-primary">Power Tools</Link>
              <Link href="/category/watering" className="block py-2 hover:text-primary">Watering</Link>
              <Link href="/category/storage" className="block py-2 hover:text-primary">Storage</Link>
            </div>
          </div>
          <div className="dropdown relative group">
            <Link href="/blog" className="font-montserrat font-semibold hover:text-primary flex items-center">
              Guides <i className="fas fa-chevron-down ml-1 text-xs"></i>
            </Link>
            <div className="dropdown-menu absolute bg-white shadow-lg p-4 mt-2 w-48 rounded-md z-50 hidden group-hover:block">
              <Link href="/article/vegetable-garden-basics-for-beginners" className="block py-2 hover:text-primary">Beginner's Guide</Link>
              <Link href="/blog" className="block py-2 hover:text-primary">Seasonal Planting</Link>
              <Link href="/blog" className="block py-2 hover:text-primary">Pest Control</Link>
              <Link href="/blog" className="block py-2 hover:text-primary">Composting</Link>
            </div>
          </div>
          <Link href="/blog" className="font-montserrat font-semibold hover:text-primary">Blog</Link>
          <Link href="#" className="font-montserrat font-semibold hover:text-primary">Podcast</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button 
            className="text-lg hover:text-primary transition-colors" 
            onClick={toggleSearch}
            aria-label="Search"
          >
            <i className="fas fa-search"></i>
          </button>
          <Link href="/cart" className="text-lg hover:text-primary transition-colors">
            <i className="fas fa-shopping-cart"></i>
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* Search Dialog */}
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Navbar;
