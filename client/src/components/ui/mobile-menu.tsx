import { useState } from "react";
import { Link } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MobileDropdownProps {
  title: string;
  links: { href: string; label: string }[];
}

const MobileDropdown: React.FC<MobileDropdownProps> = ({ title, links }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b pb-2">
      <div className="flex justify-between items-center py-2">
        <span className="font-montserrat font-semibold">{title}</span>
        <button 
          className="mobile-dropdown-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className={`fas ${isOpen ? 'fa-minus' : 'fa-plus'} text-sm`}></i>
        </button>
      </div>
      <div className={`pl-4 space-y-2 mt-2 ${isOpen ? 'block' : 'hidden'}`}>
        {links.map((link, index) => (
          <Link 
            key={index}
            href={link.href} 
            className="block py-1 hover:text-primary"
            onClick={(e) => e.stopPropagation()}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  return (
    <div 
      className={`fixed inset-0 bg-white z-50 md:hidden p-4 w-4/5 h-full overflow-y-auto transition-transform duration-300 ease-in-out ${
        isOpen ? 'transform-none' : 'transform -translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="font-montserrat font-bold text-xl text-primary">Epic Gardening</Link>
        <button onClick={onClose}>
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      <nav className="space-y-4">
        <MobileDropdown 
          title="Shop" 
          links={[
            { href: "/category/vegetables", label: "Vegetables" },
            { href: "/category/flowers", label: "Flowers" },
            { href: "/category/seeds", label: "Seeds" },
            { href: "/category/seed-starting", label: "Seed Starting" }
          ]} 
        />
        
        <MobileDropdown 
          title="Raised Beds" 
          links={[
            { href: "/category/raised-beds", label: "All Raised Beds" },
            { href: "/category/container-gardening", label: "Container Gardening" },
            { href: "/product/round-short-metal-raised-bed", label: "Round Beds" },
            { href: "/product/medium-tall-metal-raised-bed", label: "Tall Beds" }
          ]} 
        />
        
        <MobileDropdown 
          title="Guides" 
          links={[
            { href: "/article/growing-yellow-bush-beans", label: "Growing Beans" },
            { href: "/article/growing-beautiful-nasturtiums", label: "Growing Nasturtiums" },
            { href: "/article/raised-bed-gardening-benefits-practices", label: "Raised Bed Guide" },
            { href: "/blog", label: "View All Articles" }
          ]} 
        />
        
        <Link href="/blog" className="block py-2 font-montserrat font-semibold border-b pb-2">Blog</Link>
        <Link href="/podcast" className="block py-2 font-montserrat font-semibold border-b pb-2">Podcast</Link>
        <Link href="/about" className="block py-2 font-montserrat font-semibold border-b pb-2">About</Link>
        <Link href="/contact" className="block py-2 font-montserrat font-semibold border-b pb-2">Contact</Link>
        <Link href="/shop" className="block py-2 font-montserrat font-semibold border-b pb-2">Shop</Link>
      </nav>
    </div>
  );
};

export default MobileMenu;
