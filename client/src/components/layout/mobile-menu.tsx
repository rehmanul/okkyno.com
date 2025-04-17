import { useState } from "react";
import { Link } from "wouter";

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
  
  const toggleSubmenu = (name: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="lg:hidden bg-white border-t">
      <div className="container mx-auto px-4 py-3">
        <nav className="space-y-3">
          {categories.map((category, index) => (
            <div key={index} className="py-2 border-b">
              {category.submenu ? (
                <>
                  <button
                    className="flex items-center justify-between w-full text-left"
                    onClick={() => toggleSubmenu(category.name)}
                    aria-expanded={openSubmenus[category.name]}
                  >
                    <span className="font-semibold">{category.name}</span>
                    <i className={`fas fa-chevron-${openSubmenus[category.name] ? 'up' : 'down'} text-xs`}></i>
                  </button>
                  <div
                    className={`${openSubmenus[category.name] ? 'block' : 'hidden'} mt-2 ml-4 space-y-2`}
                  >
                    {category.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.path}
                        className="block py-1 hover:text-primary transition"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={category.path}
                  className="block font-semibold hover:text-primary transition"
                >
                  {category.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
