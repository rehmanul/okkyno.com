import { Link } from "wouter";
import { useState } from "react";
import DrawerMenu from "./DrawerMenu";
import ShoppingCart from "./ShoppingCart";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="site-header bg-white sticky top-0 z-40">
      {/* Announcement Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-sm md:text-base font-medium">Up To 35% Off Garden Beds!</p>
            <div className="hidden md:flex space-x-6">
              <Link href="/planner">
                <span className="text-white hover:text-gray-200 text-sm cursor-pointer flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z"/>
                    <path d="M7 11h10v2H7z"/>
                  </svg>
                  Garden Planner
                </span>
              </Link>
              <Link href="/store-finder">
                <span className="text-white hover:text-gray-200 text-sm cursor-pointer flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Find a store
                </span>
              </Link>
              <Link href="/quiz">
                <span className="text-white hover:text-gray-200 text-sm cursor-pointer flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"/>
                  </svg>
                  Quiz
                </span>
              </Link>
              <Link href="/contact">
                <span className="text-white hover:text-gray-200 text-sm cursor-pointer flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
                  </svg>
                  Support
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="py-4 shadow-sm bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Mobile Menu Button */}
            <div className="block md:hidden">
              <DrawerMenu />
            </div>
            
            {/* Logo */}
            <Link href="/">
              <span className="flex items-center cursor-pointer">
                <img src="/images/okkyno-logo.svg" alt="Okkyno.com" className="h-12" />
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/shop">
                <span className="font-medium hover:text-primary transition-colors cursor-pointer">Shop</span>
              </Link>
              <div className="group relative">
                <span className="font-medium hover:text-primary transition-colors cursor-pointer">Plants</span>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50 invisible group-hover:visible transition-all">
                  <Link href="/vegetables">
                    <span className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer">Vegetables</span>
                  </Link>
                  <Link href="/herbs">
                    <span className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer">Herbs</span>
                  </Link>
                  <Link href="/fruits">
                    <span className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer">Fruits</span>
                  </Link>
                  <Link href="/flowers">
                    <span className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer">Flowers</span>
                  </Link>
                </div>
              </div>
              <Link href="/guides">
                <span className="font-medium hover:text-primary transition-colors cursor-pointer">Growing Guides</span>
              </Link>
              <Link href="/blog">
                <span className="font-medium hover:text-primary transition-colors cursor-pointer">Blog</span>
              </Link>
              <Link href="/about">
                <span className="font-medium hover:text-primary transition-colors cursor-pointer">About</span>
              </Link>
            </nav>
            
            {/* Search & Cart */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                {isSearchOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md p-2 w-72">
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="flex-1 p-2 border rounded-l-md focus:outline-none"
                      />
                      <Button className="rounded-l-none">Search</Button>
                    </div>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
              <ShoppingCart />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search field (only shown when search is open on mobile) */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3 bg-white border-t">
          <div className="flex">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 p-2 border rounded-l-md focus:outline-none"
            />
            <Button className="rounded-l-none">Search</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;