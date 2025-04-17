import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, User, ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useSearch } from '@/context/SearchContext';
import MobileMenu from '@/components/ui/mobile-menu';
import { navLinks } from '@/utils/constants';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentLocation] = useLocation();
  const { performSearch } = useSearch();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchValue);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Top bar with contact, account and cart */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+18005551234" className="text-sm hover:text-secondary transition">
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (800) 555-1234
              </span>
            </a>
            <a href="mailto:info@okkyno.com" className="text-sm hover:text-secondary transition">
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@okkyno.com
              </span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative group text-sm">
                <span className="flex items-center hover:text-secondary transition cursor-pointer">
                  <User className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">{user.firstName || user.username}</span>
                </span>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50 hidden group-hover:block">
                  {user.role === 'admin' && (
                    <Link href="/admin" className="block px-4 py-2 text-gray-800 hover:bg-light hover:text-primary transition">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href="/account" className="block px-4 py-2 text-gray-800 hover:bg-light hover:text-primary transition">
                    My Account
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-gray-800 hover:bg-light hover:text-primary transition">
                    My Orders
                  </Link>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-light hover:text-primary transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="text-sm hover:text-secondary transition">
                <span className="inline-flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Account</span>
                </span>
              </Link>
            )}
            
            <Link href="/cart" className="text-sm hover:text-secondary transition relative">
              <span className="inline-flex items-center">
                <ShoppingCart className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-secondary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-primary font-heading font-bold text-2xl md:text-3xl">OKKYNO</span>
          </Link>
          
          <div className="hidden lg:block flex-grow mx-10">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search plants, tools, and guides..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <div key={index} className="group relative">
                <Link 
                  href={link.path}
                  className={`text-dark font-semibold hover:text-primary transition py-2 ${
                    currentLocation === link.path ? 'text-primary' : ''
                  }`}
                >
                  {link.name} {link.submenu.length > 0 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {link.submenu.length > 0 && (
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50 hidden group-hover:block">
                    {link.submenu.map((sublink, subIndex) => (
                      <Link 
                        key={subIndex} 
                        href={sublink.path}
                        className="block px-4 py-2 hover:bg-light hover:text-primary transition"
                      >
                        {sublink.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          <Button
            onClick={toggleMobileMenu}
            variant="ghost"
            size="icon"
            className="lg:hidden focus:outline-none"
            aria-label="Menu"
          >
            <Menu className="h-6 w-6 text-dark" />
          </Button>
        </div>
        
        {/* Mobile search */}
        <div className="mt-4 lg:hidden">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search plants, tools, and guides..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />
    </header>
  );
}
