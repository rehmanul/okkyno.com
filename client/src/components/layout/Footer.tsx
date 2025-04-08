import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube, Leaf, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Information */}
          <div>
            <Link href="/">
              <span className="flex items-center cursor-pointer">
                <img src="/images/okkyno-logo.svg" alt="Okkyno.com" className="h-12 invert" />
              </span>
            </Link>
            <p className="mt-4 text-gray-300">
              Providing high-quality gardening products and expert advice to help you grow a thriving garden.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Leaf className="mr-2 h-5 w-5 text-primary" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li><Link href="/shop"><span className="text-gray-300 hover:text-primary cursor-pointer transition-colors">Shop</span></Link></li>
              <li><Link href="/guides"><span className="text-gray-300 hover:text-primary cursor-pointer transition-colors">Gardening Guides</span></Link></li>
              <li><Link href="/blog"><span className="text-gray-300 hover:text-primary cursor-pointer transition-colors">Blog</span></Link></li>
              <li><Link href="/about"><span className="text-gray-300 hover:text-primary cursor-pointer transition-colors">About Us</span></Link></li>
              <li><Link href="/contact"><span className="text-gray-300 hover:text-primary cursor-pointer transition-colors">Contact</span></Link></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Leaf className="mr-2 h-5 w-5 text-primary" />
              Product Categories
            </h4>
            <ul className="space-y-3">
              <li><Link href="/category/vegetables"><span className="text-gray-300 hover:text-primary cursor-pointer transition-colors">Vegetables</span></Link></li>
              <li><Link href="/category/flowers"><span className="text-gray-300 hover:text-primary cursor-pointer transition-colors">Flowers</span></Link></li>
              <li><Link href="/category/tools"><span className="text-gray-300 hover:text-primary cursor-pointer transition-colors">Gardening Tools</span></Link></li>
              <li><Link href="/category/container-gardening"><span className="text-gray-300 hover:text-primary cursor-pointer transition-colors">Container Gardening</span></Link></li>
              <li><Link href="/category/herbs"><span className="text-gray-300 hover:text-primary cursor-pointer transition-colors">Herbs</span></Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Mail className="mr-2 h-5 w-5 text-primary" />
              Stay Updated
            </h4>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for gardening tips, new products, and special offers.
            </p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 w-full rounded-md focus:outline-none text-gray-900"
              />
              <Button 
                type="submit" 
                className="w-full"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Okkyno.com. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy"><span className="text-gray-400 hover:text-primary cursor-pointer transition-colors text-sm">Privacy Policy</span></Link>
              <Link href="/terms"><span className="text-gray-400 hover:text-primary cursor-pointer transition-colors text-sm">Terms of Service</span></Link>
              <Link href="/shipping"><span className="text-gray-400 hover:text-primary cursor-pointer transition-colors text-sm">Shipping Policy</span></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;