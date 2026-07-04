import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Phone, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Heart,
  Instagram,
  Facebook
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Perfume } from "./perfumesData.js";
import whatsappLogo from "./assets/images/whatsapp_logo.png";
import LandingHero from "./components/LandingHero.js";
import PerfumeCatalog from "./components/PerfumeCatalog.js";
import CartDrawer, { CartItem } from "./components/CartDrawer.js";

type Tab = "home" | "catalog" | "contact";

export default function App() {
  const getInitialTab = (): Tab => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "catalog" || hash === "contact" || hash === "home") {
      return hash as Tab;
    }
    return "home";
  };

  const [activeTab, setActiveTab] = useState<Tab>(getInitialTab);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Synchronise state with URL hash change (e.g. back/forward browser buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "catalog" || hash === "contact" || hash === "home") {
        setActiveTab(hash as Tab);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Update hash when active tab changes
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  // Load cart on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("debs_scent_story_cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to read cart from localstorage", e);
    }
  }, []);

  // Save cart changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem("debs_scent_story_cart", JSON.stringify(newCart));
    } catch (e) {
      console.warn("Failed to write cart to localstorage", e);
    }
  };

  const handleAddPerfumeToCart = (perfume: Perfume) => {
    const existing = cart.find(item => item.perfume.id === perfume.id);
    if (existing) {
      const updated = cart.map(item => 
        item.perfume.id === perfume.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
      saveCart(updated);
    } else {
      saveCart([...cart, { perfume, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (perfumeId: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.perfume.id === perfumeId) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : item;
      }
      return item;
    });
    saveCart(updated);
  };

  const handleRemoveItem = (perfumeId: string) => {
    const updated = cart.filter(item => item.perfume.id !== perfumeId);
    saveCart(updated);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollAndSetTab = (tab: Tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col justify-between selection:bg-burgundy-100 selection:text-burgundy-950 font-sans">
      
      {/* Top Bar Brand Header */}
      <div className="bg-burgundy-950 text-white py-4 px-4 text-center border-b border-burgundy-900/40">
        <button 
          onClick={() => scrollAndSetTab("home")} 
          className="flex flex-col items-center mx-auto focus:outline-none text-center cursor-pointer group"
        >
          <span className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-widest text-gold-200 group-hover:text-white transition uppercase">
            Debs Scent Story
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-gold-500 tracking-widest uppercase font-mono mt-1">
            The Perfume Plug
          </span>
        </button>
      </div>

      {/* Primary Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md z-40 border-b border-neutral-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-neutral-600">
            {[
              { id: "home", label: "Home" },
              { id: "catalog", label: "Scent Collections" },
              { id: "contact", label: "Contact Plug" }
            ].map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => scrollAndSetTab(link.id as Tab)}
                className={`py-2 transition-all relative cursor-pointer ${
                  activeTab === link.id 
                    ? "text-burgundy-800 font-bold" 
                    : "hover:text-burgundy-800"
                }`}
              >
                <span>{link.label}</span>
                {activeTab === link.id && (
                  <motion.div 
                    layoutId="activeTabUnderline" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-burgundy-800 rounded-full" 
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Header Action Items */}
          <div className="flex items-center gap-3 ml-auto">
            
            {/* Shopping Cart Bag Indicator */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 rounded-xl border border-neutral-200 transition shrink-0 cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-burgundy-800 text-white text-[10px] font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-white animate-scale-in">
                  {totalCartItems}
                </span>
              )}
            </button>

          </div>

        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* 1. HOME VIEW */}
            {activeTab === "home" && (
              <LandingHero 
                onNavigateToCatalog={() => scrollAndSetTab("catalog")}
              />
            )}

            {/* 2. CATALOG VIEW */}
            {activeTab === "catalog" && (
              <div className="space-y-10">
                <div className="text-center space-y-2 max-w-xl mx-auto">
                  <span className="text-3xs font-mono font-bold text-burgundy-800 tracking-widest uppercase">Curated Catalog</span>
                  <h2 className="text-3xl font-serif text-neutral-900 font-bold tracking-wide">
                    Our Exquisite Collections
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Explore our pure designer perfume oils, rich Middle Eastern blends, and luxurious sprays. Select your favorites and order effortlessly.
                  </p>
                </div>
                <PerfumeCatalog 
                  onAddPerfumeToCart={handleAddPerfumeToCart}
                  cartItemIds={cart.map(item => item.perfume.id)}
                />
              </div>
            )}

            {/* 4. CONTACT PLUG VIEW */}
            {activeTab === "contact" && (
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-2 max-w-xl mx-auto">
                  <span className="text-3xs font-mono font-bold text-burgundy-800 tracking-widest uppercase">Connect With Us</span>
                  <h2 className="text-3xl font-serif text-neutral-900 font-bold tracking-wide">
                    Get In Touch
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Need advice? Speak directly with Debs Scent Story or complete your customized orders instantly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Direct info matching flyer */}
                  <div className="bg-burgundy-800 text-white rounded-3xl p-8 md:p-10 shadow-lg space-y-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />
                    
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold text-gold-200 tracking-widest uppercase font-mono">
                        Direct Lines
                      </span>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight">
                        Reach Your Perfume Plug
                      </h3>
                      <p className="text-xs text-neutral-200 font-light leading-relaxed">
                        We process bulk deals, wholesale perfume oil packages, gift hampers, and custom individual fragrance orders directly via WhatsApp and phone calls.
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-burgundy-700">
                      {/* WhatsApp */}
                      <a
                        href="https://wa.me/2348176016513"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-4 bg-emerald-600 hover:bg-emerald-500 p-4 rounded-2xl transition shadow-xs group"
                      >
                        <div className="bg-white/10 p-2.5 rounded-xl text-white flex items-center justify-center">
                          <img src={whatsappLogo} alt="WhatsApp" className="w-5 h-5 object-contain rounded-xs" />
                        </div>
                        <div>
                          <span className="text-3xs font-mono uppercase tracking-wider text-emerald-100 block">WhatsApp Us</span>
                          <span className="font-bold text-sm">0817 601 6513</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-emerald-200 ml-auto group-hover:translate-x-1 transition" />
                      </a>

                      {/* Hotline call */}
                      <a
                        href="tel:07062143381"
                        className="flex items-center gap-4 bg-white text-burgundy-800 p-4 rounded-2xl hover:bg-neutral-50 transition shadow-xs group"
                      >
                        <div className="bg-burgundy-50 p-2.5 rounded-xl text-burgundy-800">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-3xs font-mono uppercase tracking-wider text-neutral-400 block">Direct Call Line</span>
                          <span className="font-bold text-sm text-neutral-900">0706 214 3381</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-burgundy-800 ml-auto group-hover:translate-x-1 transition" />
                      </a>
                    </div>

                    <p className="text-3xs text-neutral-300 italic text-center pt-2">
                      "Smell unforgettable! Because first impressions should last"
                    </p>
                  </div>

                  {/* Right Column: General Information */}
                  <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm space-y-6">
                    <h4 className="font-serif text-lg font-bold text-neutral-900">Boutique Details</h4>
                    
                    <div className="space-y-4 text-xs">
                      {/* Location info */}
                      <div className="flex gap-3.5 items-start">
                        <div className="p-2 bg-neutral-50 rounded-lg text-neutral-500 mt-0.5 border border-neutral-150">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-neutral-800 block">Headquarters</span>
                          <span className="text-neutral-400 mt-0.5 block leading-relaxed">
                            Debs Scent Story Boutique, Abuja, Federal Capital Territory, Nigeria.
                          </span>
                        </div>
                      </div>

                      {/* Hours */}
                      <div className="flex gap-3.5 items-start">
                        <div className="p-2 bg-neutral-50 rounded-lg text-neutral-500 mt-0.5 border border-neutral-150">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-neutral-800 block">Boutique Hours</span>
                          <span className="text-neutral-400 mt-0.5 block leading-relaxed">
                            Monday - Saturday: 8:00 AM - 7:00 PM <br />
                            Sunday: 12:00 PM - 5:00 PM (WhatsApp orders only)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* FAQ Quick block */}
                    <div className="pt-4 border-t border-neutral-100 space-y-3">
                      <h5 className="font-serif text-xs font-bold text-neutral-800 uppercase tracking-wider">Quick Info</h5>
                      <ul className="space-y-2 text-2xs text-neutral-400 list-disc pl-4 leading-relaxed">
                        <li><strong>Concentrated Oils:</strong> Our perfume oils are 100% pure concentrate with absolute zero additives, staying on clothes for over 48 hours.</li>
                        <li><strong>Middle East Imports:</strong> All of our premium Oud formulations come factory-sealed from prestigious Dubai boutique houses.</li>
                        <li><strong>Delivery:</strong> We deliver via trusted local dispatch riders in Lagos (same-day options available) and reliable park transit nationwide.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer styled like flyer footer */}
      <footer className="bg-burgundy-950 text-white mt-16 border-t border-burgundy-900">
        
        {/* Top visual block mirroring the flyer red bar */}
        <div className="bg-burgundy-800 py-8 px-4 text-center border-b border-burgundy-950 relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-3 relative z-10">
            <h3 className="font-serif font-bold text-lg md:text-2xl tracking-wide uppercase text-gold-100">
              Smell Unforgettable! Because First Impressions Should Last.
            </h3>
            <p className="text-3xs md:text-2xs font-mono tracking-widest text-gold-200 uppercase">
              Debs Scent Story - Your Quality Perfume Plug
            </p>
          </div>
          {/* subtle shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-pulse pointer-events-none" />
        </div>

        {/* Footer info Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-neutral-300 text-xs">
          
          {/* Col 1: About */}
          <div className="space-y-3 text-center md:text-left">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">
              DEBS SCENT STORY
            </h4>
            <p className="text-2xs text-neutral-400 leading-relaxed max-w-xs mx-auto md:mx-0">
              Our boutique specialize in curating quality designer perfume alternatives, concentrated perfume oils, and luxurious Arabian Oud formulations at extremely budget-friendly prices.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3 text-center">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">
              Boutique Map
            </h4>
            <div className="flex flex-col gap-2 font-semibold">
              <button onClick={() => scrollAndSetTab("home")} className="hover:text-gold-500 transition">Home</button>
              <button onClick={() => scrollAndSetTab("catalog")} className="hover:text-gold-500 transition">Scent Collections</button>
              <button onClick={() => scrollAndSetTab("contact")} className="hover:text-gold-500 transition">Contact Scent Plug</button>
            </div>
          </div>

          {/* Col 3: Contact details directly from poster */}
          <div className="space-y-3 text-center md:text-right">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">
              Hotline Plugs
            </h4>
            <div className="space-y-2 text-2xs text-neutral-400">
              <p className="flex justify-center md:justify-end items-center gap-2">
                <span>WhatsApp:</span>
                <a href="https://wa.me/2348176016513" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-bold">
                  08176016513
                </a>
              </p>
              <p className="flex justify-center md:justify-end items-center gap-2">
                <span>Hotline call:</span>
                <a href="tel:07062143381" className="text-gold-500 hover:underline font-bold">
                  07062143381
                </a>
              </p>
              <div className="flex justify-center md:justify-end gap-3 pt-2">
                <a href="#" className="hover:text-white transition"><Instagram className="w-4 h-4" /></a>
                <a href="#" className="hover:text-white transition"><Facebook className="w-4 h-4" /></a>
              </div>
            </div>
          </div>

        </div>

        {/* Legal copyrights */}
        <div className="border-t border-burgundy-900/40 py-6 px-4 text-center text-3xs text-neutral-400">
          <p>© {new Date().getFullYear()} Debs Scent Story. All Rights Reserved. Smell unforgettable!</p>
          <p className="mt-1 text-[8px] opacity-40">Designed for elite fragrance lovers in Nigeria and beyond.</p>
        </div>

      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Floating Cart Button for Mobile */}
      {totalCartItems > 0 && !isCartOpen && (
        <motion.button
          id="floating-cart-btn"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={() => setIsCartOpen(true)}
          className="md:hidden fixed bottom-6 right-6 bg-burgundy-800 hover:bg-burgundy-700 active:bg-burgundy-900 text-white p-4 rounded-full shadow-2xl z-40 cursor-pointer border border-burgundy-700/50 flex items-center justify-center"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-white text-burgundy-800 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-burgundy-800 shadow-sm">
            {totalCartItems}
          </span>
        </motion.button>
      )}

    </div>
  );
}
