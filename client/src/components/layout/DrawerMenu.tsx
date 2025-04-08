import { Link } from "wouter";
import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Menu,
  X,
  Home,
  Leaf,
  Sun,
  Shovel,
  ShoppingBasket,
  BookOpen,
  Mail,
  Info,
  Facebook,
  Instagram,
  Youtube,
  Twitter
} from "lucide-react";

const categories = [
  { name: "Vegetables", slug: "vegetables" },
  { name: "Flowers", slug: "flowers" },
  { name: "Herbs", slug: "herbs" },
  { name: "Container Gardening", slug: "container-gardening" },
  { name: "Tools", slug: "tools" },
  { name: "Fertilizers", slug: "fertilizers" },
  { name: "Pest Control", slug: "pest-control" },
  { name: "Grow Lights", slug: "grow-lights" },
];

const guides = [
  { name: "Beginners Guide", slug: "beginners-guide" },
  { name: "Growing Vegetables", slug: "growing-vegetables" },
  { name: "Growing Herbs", slug: "growing-herbs" },
  { name: "Composting", slug: "composting" },
  { name: "Seasonal Gardening", slug: "seasonal-gardening" },
];

export default function DrawerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 text-primary">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px] overflow-y-auto">
        <SheetHeader className="text-left border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetClose asChild>
              <Link href="/">
                <img src="/images/okkyno-logo.svg" alt="Okkyno.com" className="h-10" />
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col py-4 space-y-4">
          <SheetClose asChild>
            <Link href="/">
              <div className="flex items-center px-4 py-2 text-sm hover:bg-muted rounded-md cursor-pointer">
                <Home className="mr-2 h-5 w-5" />
                <span>Home</span>
              </div>
            </Link>
          </SheetClose>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="shop">
              <AccordionTrigger className="px-4 py-2 text-sm hover:bg-muted rounded-md">
                <div className="flex items-center">
                  <ShoppingBasket className="mr-2 h-5 w-5" />
                  <span>Shop</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-7 flex flex-col space-y-1">
                  {categories.map((category) => (
                    <SheetClose asChild key={category.slug}>
                      <Link href={`/categories/${category.slug}`}>
                        <div className="flex items-center py-2 px-4 text-sm hover:bg-muted rounded-md cursor-pointer">
                          <ChevronRight className="mr-1 h-3 w-3" />
                          <span>{category.name}</span>
                        </div>
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="plants">
              <AccordionTrigger className="px-4 py-2 text-sm hover:bg-muted rounded-md">
                <div className="flex items-center">
                  <Leaf className="mr-2 h-5 w-5" />
                  <span>Plants</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-7 flex flex-col space-y-1">
                  <SheetClose asChild>
                    <Link href="/plants/vegetables">
                      <div className="flex items-center py-2 px-4 text-sm hover:bg-muted rounded-md cursor-pointer">
                        <ChevronRight className="mr-1 h-3 w-3" />
                        <span>Vegetables</span>
                      </div>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/plants/fruits">
                      <div className="flex items-center py-2 px-4 text-sm hover:bg-muted rounded-md cursor-pointer">
                        <ChevronRight className="mr-1 h-3 w-3" />
                        <span>Fruits</span>
                      </div>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/plants/herbs">
                      <div className="flex items-center py-2 px-4 text-sm hover:bg-muted rounded-md cursor-pointer">
                        <ChevronRight className="mr-1 h-3 w-3" />
                        <span>Herbs</span>
                      </div>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/plants/flowers">
                      <div className="flex items-center py-2 px-4 text-sm hover:bg-muted rounded-md cursor-pointer">
                        <ChevronRight className="mr-1 h-3 w-3" />
                        <span>Flowers</span>
                      </div>
                    </Link>
                  </SheetClose>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="garden-tips">
              <AccordionTrigger className="px-4 py-2 text-sm hover:bg-muted rounded-md">
                <div className="flex items-center">
                  <Sun className="mr-2 h-5 w-5" />
                  <span>Garden Tips</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-7 flex flex-col space-y-1">
                  {guides.map((guide) => (
                    <SheetClose asChild key={guide.slug}>
                      <Link href={`/guides/${guide.slug}`}>
                        <div className="flex items-center py-2 px-4 text-sm hover:bg-muted rounded-md cursor-pointer">
                          <ChevronRight className="mr-1 h-3 w-3" />
                          <span>{guide.name}</span>
                        </div>
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tools">
              <AccordionTrigger className="px-4 py-2 text-sm hover:bg-muted rounded-md">
                <div className="flex items-center">
                  <Shovel className="mr-2 h-5 w-5" />
                  <span>Tools & Equipment</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-7 flex flex-col space-y-1">
                  <SheetClose asChild>
                    <Link href="/tools/hand-tools">
                      <div className="flex items-center py-2 px-4 text-sm hover:bg-muted rounded-md cursor-pointer">
                        <ChevronRight className="mr-1 h-3 w-3" />
                        <span>Hand Tools</span>
                      </div>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/tools/power-tools">
                      <div className="flex items-center py-2 px-4 text-sm hover:bg-muted rounded-md cursor-pointer">
                        <ChevronRight className="mr-1 h-3 w-3" />
                        <span>Power Tools</span>
                      </div>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/tools/watering">
                      <div className="flex items-center py-2 px-4 text-sm hover:bg-muted rounded-md cursor-pointer">
                        <ChevronRight className="mr-1 h-3 w-3" />
                        <span>Watering</span>
                      </div>
                    </Link>
                  </SheetClose>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <SheetClose asChild>
            <Link href="/blog">
              <div className="flex items-center px-4 py-2 text-sm hover:bg-muted rounded-md cursor-pointer">
                <BookOpen className="mr-2 h-5 w-5" />
                <span>Blog</span>
              </div>
            </Link>
          </SheetClose>
          
          <SheetClose asChild>
            <Link href="/contact">
              <div className="flex items-center px-4 py-2 text-sm hover:bg-muted rounded-md cursor-pointer">
                <Mail className="mr-2 h-5 w-5" />
                <span>Contact</span>
              </div>
            </Link>
          </SheetClose>
          
          <SheetClose asChild>
            <Link href="/about">
              <div className="flex items-center px-4 py-2 text-sm hover:bg-muted rounded-md cursor-pointer">
                <Info className="mr-2 h-5 w-5" />
                <span>About</span>
              </div>
            </Link>
          </SheetClose>
        </div>
        
        <div className="border-t pt-4 mt-2">
          <div className="flex space-x-4 justify-center">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary">
              <Youtube className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}