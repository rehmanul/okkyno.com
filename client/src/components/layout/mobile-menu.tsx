import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";

type MenuItem = {
  name: string;
  path: string;
  submenu?: MenuItem[];
};

type MobileMenuProps = {
  isOpen: boolean;
  categories: MenuItem[];
};

export default function MobileMenu({ isOpen, categories }: MobileMenuProps) {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state on component mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (!mounted) return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, mounted]);
  
  const toggleSubmenu = (name: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  
  if (!mounted) return null;
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => document.dispatchEvent(new CustomEvent('close-mobile-menu'))}
        />
      )}
      
      {/* Side drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-50 lg:hidden shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg">Menu</h2>
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={() => document.dispatchEvent(new CustomEvent('close-mobile-menu'))}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-60px)] pb-20">
          <nav className="p-4">
            {categories.map((category, index) => (
              <div key={index} className="py-2 border-b">
                {category.submenu ? (
                  <>
                    <button
                      className="flex items-center justify-between w-full text-left py-2"
                      onClick={() => toggleSubmenu(category.name)}
                      aria-expanded={openSubmenus[category.name]}
                    >
                      <span className="font-semibold text-lg">{category.name}</span>
                      {openSubmenus[category.name] ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      )}
                    </button>
                    <div
                      className={`${openSubmenus[category.name] ? 'block' : 'hidden'} mt-1 ml-4 space-y-2`}
                    >
                      {category.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.path}
                          className="block py-2 hover:text-primary transition"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={category.path}
                    className="block font-semibold text-lg py-2 hover:text-primary transition"
                  >
                    {category.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
