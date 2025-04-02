import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-montserrat font-bold text-xl mb-6">Epic Gardening</h3>
            <p className="mb-6 text-gray-300">Helping you become a better gardener with expert tips, tools, and resources to grow your own food and create beautiful gardens.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition duration-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-accent transition duration-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white hover:text-accent transition duration-300">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-white hover:text-accent transition duration-300">
                <i className="fab fa-pinterest"></i>
              </a>
              <a href="#" className="text-white hover:text-accent transition duration-300">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-montserrat font-bold text-xl mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition duration-300">About Us</Link></li>
              <li><Link href="/shop" className="text-gray-300 hover:text-white transition duration-300">Shop</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white transition duration-300">Blog</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition duration-300">Podcast</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition duration-300">Contact Us</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white transition duration-300">Gardening Guides</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-montserrat font-bold text-xl mb-6">Plant Categories</h3>
            <ul className="space-y-3">
              <li><Link href="/category/vegetables" className="text-gray-300 hover:text-white transition duration-300">Vegetables</Link></li>
              <li><Link href="/category/herbs" className="text-gray-300 hover:text-white transition duration-300">Herbs</Link></li>
              <li><Link href="/category/flowers" className="text-gray-300 hover:text-white transition duration-300">Flowers</Link></li>
              <li><Link href="/category/fruits" className="text-gray-300 hover:text-white transition duration-300">Fruits</Link></li>
              <li><Link href="/category/succulents" className="text-gray-300 hover:text-white transition duration-300">Succulents</Link></li>
              <li><Link href="/category/indoor-plants" className="text-gray-300 hover:text-white transition duration-300">Indoor Plants</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-montserrat font-bold text-xl mb-6">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-accent"></i>
                <span className="text-gray-300">1234 Garden Way<br />San Diego, CA 92101</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-accent"></i>
                <a href="mailto:info@epicgardening.com" className="text-gray-300 hover:text-white transition duration-300">info@epicgardening.com</a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-3 text-accent"></i>
                <a href="tel:+18001234567" className="text-gray-300 hover:text-white transition duration-300">(800) 123-4567</a>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-700 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} Epic Gardening. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition duration-300">Privacy Policy</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition duration-300">Terms of Service</Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition duration-300">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
