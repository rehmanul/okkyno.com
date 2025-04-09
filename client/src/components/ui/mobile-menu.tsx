import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MobileDropdownProps {
  title: string;
  links: { href: string; label: string; icon?: string }[];
  onClose: () => void;
}

const MobileDropdown: React.FC<MobileDropdownProps> = ({ title, links, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100">
      <motion.button 
        className="w-full flex justify-between items-center py-3 px-1"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
      >
        <span className="font-inter font-semibold text-gray-800">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <i className="fas fa-chevron-down text-gray-500 text-sm"></i>
        </motion.div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-4 space-y-1 pb-3">
              {links.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    href={link.href} 
                    className="flex items-center gap-2 py-2 px-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                  >
                    {link.icon && <i className={`${link.icon} text-sm`}></i>}
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  // Backdrop variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // Menu variants
  const menuVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div 
            className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 md:hidden shadow-xl"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <Link href="/">
                    <a className="flex items-center gap-2">
                      <i className="fas fa-leaf text-primary text-xl"></i>
                      <span className="font-inter font-bold text-lg">
                        Okkyno <span className="text-primary">Gardening</span>
                      </span>
                    </a>
                  </Link>
                  <motion.button 
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <i className="fas fa-times text-gray-500"></i>
                  </motion.button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto px-4 py-2">
                <nav className="space-y-1">
                  <MobileDropdown 
                    title="Shop" 
                    links={[
                      { href: "/category/vegetables", label: "Vegetables & Herbs", icon: "fas fa-seedling" },
                      { href: "/category/flowers", label: "Flowers & Plants", icon: "fas fa-flower" },
                      { href: "/category/seeds", label: "Seeds Collection", icon: "fas fa-leaf" },
                      { href: "/category/tools", label: "Gardening Tools", icon: "fas fa-tools" }
                    ]}
                    onClose={onClose}
                  />
                  
                  <MobileDropdown 
                    title="Raised Beds" 
                    links={[
                      { href: "/category/raised-beds", label: "All Raised Beds", icon: "fas fa-border-all" },
                      { href: "/category/container-gardening", label: "Container Gardens", icon: "fas fa-box" },
                      { href: "/category/accessories", label: "Accessories", icon: "fas fa-plus" }
                    ]}
                    onClose={onClose}
                  />
                  
                  <MobileDropdown 
                    title="Guides" 
                    links={[
                      { href: "/guides/beginners", label: "Beginner's Guide", icon: "fas fa-book" },
                      { href: "/guides/seasonal", label: "Seasonal Tips", icon: "fas fa-sun" },
                      { href: "/guides/advanced", label: "Advanced Techniques", icon: "fas fa-graduation-cap" }
                    ]}
                    onClose={onClose}
                  />
                  
                  {/* Direct links */}
                  {[
                    { href: "/blog", label: "Blog", icon: "fas fa-rss" },
                    { href: "/podcast", label: "Podcast", icon: "fas fa-microphone" },
                    { href: "/about", label: "About Us", icon: "fas fa-info-circle" },
                    { href: "/contact", label: "Contact", icon: "fas fa-envelope" }
                  ].map((link, index) => (
                    <Link 
                      key={index}
                      href={link.href}
                      className="flex items-center gap-3 py-3 px-1 border-b border-gray-100 text-gray-800 hover:text-primary transition-colors"
                      onClick={onClose}
                    >
                      <i className={`${link.icon} text-gray-500`}></i>
                      <span className="font-inter font-semibold">{link.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex justify-center space-x-6">
                  <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                    <i className="fab fa-pinterest"></i>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
