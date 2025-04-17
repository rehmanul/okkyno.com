import { useState } from 'react';
import { Link } from 'wouter';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navLinks } from '@/utils/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-white border-t fixed inset-0 z-50 pt-16 overflow-y-auto">
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="container mx-auto px-4 py-3">
        <nav className="space-y-3">
          {navLinks.map((link, index) => (
            <div key={index} className="py-2 border-b">
              {link.submenu.length > 0 ? (
                <>
                  <button 
                    className="flex items-center justify-between w-full text-left font-semibold"
                    onClick={() => toggleSubmenu(link.name)}
                  >
                    <span>{link.name}</span>
                    {openSubmenus[link.name] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {openSubmenus[link.name] && (
                    <div className="mt-2 ml-4 space-y-2">
                      {link.submenu.map((sublink, subIndex) => (
                        <Link 
                          key={subIndex} 
                          href={sublink.path}
                          className="block py-1 hover:text-primary transition"
                          onClick={onClose}
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.path}
                  className="block font-semibold hover:text-primary transition"
                  onClick={onClose}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
