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
          title="Plants" 
          links={[
            { href: "/category/vegetables", label: "Vegetables" },
            { href: "/category/herbs", label: "Herbs" },
            { href: "/category/flowers", label: "Flowers" },
            { href: "/category/indoor-plants", label: "Indoor Plants" }
          ]} 
        />
        
        <MobileDropdown 
          title="Tools" 
          links={[
            { href: "/category/hand-tools", label: "Hand Tools" },
            { href: "/category/power-tools", label: "Power Tools" },
            { href: "/category/watering", label: "Watering" },
            { href: "/category/storage", label: "Storage" }
          ]} 
        />
        
        <MobileDropdown 
          title="Guides" 
          links={[
            { href: "/article/vegetable-garden-basics-for-beginners", label: "Beginner's Guide" },
            { href: "/blog", label: "Seasonal Planting" },
            { href: "/blog", label: "Pest Control" },
            { href: "/blog", label: "Composting" }
          ]} 
        />
        
        <Link href="/blog" className="block py-2 font-montserrat font-semibold border-b pb-2">Blog</Link>
        <Link href="#" className="block py-2 font-montserrat font-semibold border-b pb-2">Podcast</Link>
        <Link href="/about" className="block py-2 font-montserrat font-semibold border-b pb-2">About</Link>
        <Link href="/contact" className="block py-2 font-montserrat font-semibold border-b pb-2">Contact</Link>
        <Link href="/shop" className="block py-2 font-montserrat font-semibold border-b pb-2">Shop</Link>
      </nav>
    </div>
  );
};

export default MobileMenu;
