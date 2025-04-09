import { Link } from "wouter";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <Link href="/">
              <a className="flex items-center gap-2 mb-6">
                <i className="fas fa-leaf text-primary text-2xl"></i>
                <span className="font-inter font-bold text-xl">
                  Okkyno <span className="text-primary">Gardening</span>
                </span>
              </a>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6">
              Transform your space into a thriving garden oasis. Get expert tips, grow fresh vegetables, 
              and create beautiful landscapes with our comprehensive gardening guides.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: "facebook-f", url: "#" },
                { icon: "instagram", url: "#" },
                { icon: "youtube", url: "#" },
                { icon: "pinterest", url: "#" }
              ].map((social, index) => (
                <motion.a
                  key={social.icon}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className={`fab fa-${social.icon}`}></i>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-inter font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Shop", href: "/shop" },
                { label: "Blog", href: "/blog" },
                { label: "Podcast", href: "/podcast" },
                { label: "Contact", href: "/contact" },
                { label: "Gardening Guides", href: "/guides" }
              ].map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-2">
                      <i className="fas fa-chevron-right text-xs"></i>
                      {link.label}
                    </a>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-inter font-bold text-lg mb-6">Plant Categories</h3>
            <ul className="space-y-3">
              {[
                { label: "Vegetables", href: "/category/vegetables" },
                { label: "Herbs", href: "/category/herbs" },
                { label: "Flowers", href: "/category/flowers" },
                { label: "Fruits", href: "/category/fruits" },
                { label: "Succulents", href: "/category/succulents" },
                { label: "Indoor Plants", href: "/category/indoor-plants" }
              ].map((category, index) => (
                <motion.li
                  key={category.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={category.href}>
                    <a className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-2">
                      <i className="fas fa-leaf text-xs"></i>
                      {category.label}
                    </a>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-inter font-bold text-lg mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start gap-3"
                whileHover={{ x: 5 }}
              >
                <i className="fas fa-map-marker-alt mt-1 text-primary"></i>
                <span className="text-gray-400">
                  123 Garden Street<br />
                  San Francisco, CA 94105
                </span>
              </motion.li>
              <motion.li 
                className="flex items-center gap-3"
                whileHover={{ x: 5 }}
              >
                <i className="fas fa-envelope text-primary"></i>
                <a 
                  href="mailto:hello@okkyno.com" 
                  className="text-gray-400 hover:text-primary transition-colors duration-300"
                >
                  hello@okkyno.com
                </a>
              </motion.li>
              <motion.li 
                className="flex items-center gap-3"
                whileHover={{ x: 5 }}
              >
                <i className="fas fa-phone text-primary"></i>
                <a 
                  href="tel:+14155551234" 
                  className="text-gray-400 hover:text-primary transition-colors duration-300"
                >
                  (415) 555-1234
                </a>
              </motion.li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 py-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-inter font-bold text-xl mb-4">Join Our Newsletter</h3>
            <p className="text-gray-400 mb-6">
              Subscribe to receive gardening tips, exclusive offers, and updates from Okkyno Gardening
            </p>
            <form className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
              />
              <motion.button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Okkyno Gardening. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Shipping Policy", href: "/shipping" },
                { label: "Refund Policy", href: "/refund" }
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <a className="text-gray-400 hover:text-primary text-sm transition-colors duration-300">
                    {link.label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
