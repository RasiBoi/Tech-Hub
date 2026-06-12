import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Heart, ShoppingCart, Bell, MapPin, Truck, 
  Star, Cpu, RotateCcw, HeadphonesIcon, Zap, ChevronDown, ChevronLeft, ChevronRight,
  Mic, Menu, X, CheckCircle2, User, ShoppingBag, ArrowRight, Brain, LogOut, Store,
  SlidersHorizontal, Check, ShieldCheck, Share2, Plus, Minus, Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { requestJson } from '../services/httpClient';
import { serviceRegistry } from '../config/serviceRegistry';

// Detailed mapping of product images for premium gallery views
const PRODUCT_IMAGES_MAP = {
  "stand-5": [
    new URL('../../Media/product_images/baseus-metal-adjustable-laptop-stand-laptop-riser-with-adjustable-height-and-angle/image-1.jpg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-metal-adjustable-laptop-stand-laptop-riser-with-adjustable-height-and-angle/image-2.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-metal-adjustable-laptop-stand-laptop-riser-with-adjustable-height-and-angle/image-3.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-metal-adjustable-laptop-stand-laptop-riser-with-adjustable-height-and-angle/image-4.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-metal-adjustable-laptop-stand-laptop-riser-with-adjustable-height-and-angle/image-5.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-metal-adjustable-laptop-stand-laptop-riser-with-adjustable-height-and-angle/image-6.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-metal-adjustable-laptop-stand-laptop-riser-with-adjustable-height-and-angle/image-7.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-metal-adjustable-laptop-stand-laptop-riser-with-adjustable-height-and-angle/image-8.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-metal-adjustable-laptop-stand-laptop-riser-with-adjustable-height-and-angle/image-9.jpeg', import.meta.url).href
  ],
  "org-1": [
    new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png', import.meta.url).href,
    new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-2.jpg', import.meta.url).href,
    new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-3.jpg', import.meta.url).href,
    new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-4.jpg', import.meta.url).href,
    new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-5.jpg', import.meta.url).href,
    new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-6.jpg', import.meta.url).href
  ]
};

// Rich details of fallback database items
const STORE_PRODUCTS_DETAILS = {
  "stand-5": {
    id: "stand-5",
    title: "Baseus Metal Adjustable Laptop Stand",
    price: 11500,
    oldPrice: 14375,
    rating: 4.8,
    reviewsCount: 34,
    category: "Stands & Holders",
    subcategory: "Laptop Stands",
    brand: "Baseus",
    vibe: "black",
    discount: "-20%",
    live: "18 checking out right now",
    description: "Engineered from space-grade aluminum, this laptop stand offers 8 angles of adjustment to elevate your screen to the perfect ergonomic height. Featuring large anti-slip silicone cushions and a hollow airflow design, it keeps your laptop cool and stable through heavy coding sessions.",
    specs: {
      "Material": "Anodized Aluminum Alloy & Silicone",
      "Dimensions": "260mm x 220mm x 15mm (Folded)",
      "Supported sizes": "10\" to 17.3\" laptops & tablets",
      "Weight capacity": "Up to 10kg (22 lbs)",
      "Vibe suitability": "Stealth Matte Black, Minimalist Grey",
      "Features": "8-Gear adjustment, hollow thermal dissipation, dual rubber cushions"
    },
    reviews: [
      { name: "Jake M.", rating: 5, date: "3 days ago", text: "Incredibly sturdy. No wobble at all while typing. Matches my dark setup perfectly." },
      { name: "Elena R.", rating: 5, date: "1 week ago", text: "Elevates my MacBook to monitor height. Neck strain is completely gone!" },
      { name: "Tariq S.", rating: 4, date: "2 weeks ago", text: "Great build quality. A bit heavier than expected but that makes it stable." }
    ],
    miaAdvice: "This metal stand is a powerhouse for Stealth Matte Black setups. Pair it on a dark grey felt desk pad beside an anodized headphone riser for a clean, cohesive tech look. Add a monitor light bar to reduce glare and make the silver metal edges glow."
  },
  "org-1": {
    id: "org-1",
    title: "Premium Walnut Desk Organizer",
    price: 12900,
    oldPrice: 15730,
    rating: 4.9,
    reviewsCount: 19,
    category: "Desk Organizers",
    subcategory: "Wood Organizers",
    brand: "C-Level Collection",
    vibe: "walnut",
    discount: "-18%",
    live: "19 carts active",
    description: "Carved from a single block of natural North American Walnut, this luxury desk organizer holds your phone, pens, cards, and daily essentials. Finished with natural organic oils, it introduces a warm organic touch to any workspace setup.",
    specs: {
      "Material": "Solid North American Walnut Wood",
      "Dimensions": "300mm x 100mm x 25mm",
      "Compartments": "5 precision carved sections",
      "Oil finish": "100% Organic linseed oil",
      "Vibe suitability": "Walnut & Organic, Cream Minimalist",
      "Features": "Magnetic paperclip catcher, felt-lined bottom feet, natural grain uniqueness"
    },
    reviews: [
      { name: "Arthur P.", rating: 5, date: "Yesterday", text: "The wood grain is gorgeous. Fits my pens and paperclips perfectly. Worth every LKR." },
      { name: "Clara G.", rating: 5, date: "10 days ago", text: "Smells lovely of natural oils. Brings so much character to my home office." }
    ],
    miaAdvice: "Solid walnut grains look best when placed directly on a matte black felt pad or a cream mat. Avoid cluttering this piece; let its natural wood grain show. Pair with a walnut monitor stand to distribute the wood theme across your desk."
  }
};

// Fallback dynamic database populated with real folders
const STATIC_PRODUCTS_FALLBACK = [
  {
    id: "stand-1",
    title: "Baseus Foldable Desktop Phone Stand",
    price: 3600,
    rating: 4.8,
    reviewsCount: 34,
    image: new URL('../../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-1.jpg', import.meta.url).href,
    category: "Stands & Holders",
    subcategory: "Mobile & Tablet Stands",
    brand: "Baseus",
    vibe: "minimalist",
    discount: "-21%",
    live: "34 watching"
  },
  {
    id: "stand-2",
    title: "Ugreen Foldable Aluminum Laptop Stand",
    price: 9800,
    rating: 4.9,
    reviewsCount: 42,
    image: new URL('../../Media/product_images/ugreen-aluminum-foldable-laptop-stand/image-1.jpg', import.meta.url).href,
    category: "Stands & Holders",
    subcategory: "Laptop Stands",
    brand: "Ugreen",
    vibe: "minimalist",
    discount: "-15%",
    live: "12 in carts"
  },
  {
    id: "stand-3",
    title: "Simplist Portable Book Stand",
    price: 6400,
    rating: 4.7,
    reviewsCount: 28,
    image: new URL('../../Media/product_images/simplist-book-stand-ergonomic-portable-adjustable-book-holder-rest-for-hands-free-reading/image-1.jpg', import.meta.url).href,
    category: "Stands & Holders",
    subcategory: "Book Holders",
    brand: "Simplist",
    vibe: "walnut",
    discount: "-10%",
    live: "5 sold today"
  },
  {
    id: "stand-4",
    title: "Upergo Tablet iPad Dock Stand",
    price: 14500,
    rating: 4.8,
    reviewsCount: 19,
    image: new URL('../../Media/product_images/upergo-tablet-ipad-dock-stand-aluminium-silver/image-1.jpg', import.meta.url).href,
    category: "Stands & Holders",
    subcategory: "Mobile & Tablet Stands",
    brand: "Upergo",
    vibe: "minimalist",
    discount: "-5%",
    live: "2 left in stock"
  },
  {
    id: "stand-5",
    title: "Baseus Metal Adjustable Laptop Stand",
    price: 11500,
    rating: 4.7,
    reviewsCount: 52,
    image: new URL('../../Media/product_images/baseus-metal-adjustable-laptop-stand-laptop-riser-with-adjustable-height-and-angle/image-1.jpg', import.meta.url).href,
    category: "Stands & Holders",
    subcategory: "Laptop Stands",
    brand: "Baseus",
    vibe: "black",
    discount: "-20%",
    live: "18 checking out"
  },
  {
    id: "org-1",
    title: "Premium Walnut Desk Organizer",
    price: 12900,
    rating: 4.8,
    reviewsCount: 19,
    image: new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png', import.meta.url).href,
    category: "Desk Organizers",
    subcategory: "Wood Organizers",
    brand: "C-Level Collection",
    vibe: "walnut",
    discount: "-18%",
    live: "19 carts"
  },
  {
    id: "mat-1",
    title: "Simplist Desk Mat Pro Plus (Cream)",
    price: 6400,
    rating: 4.7,
    reviewsCount: 42,
    image: new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-1.png', import.meta.url).href,
    category: "Desk Mats",
    subcategory: "Cork Desk Mats",
    brand: "Simplist",
    vibe: "minimalist",
    discount: "-30%",
    live: "42 sold today"
  },
  {
    id: "light-1",
    title: "Baseus Smart Eye Foldable Desk Lamp",
    price: 12800,
    rating: 4.8,
    reviewsCount: 11,
    image: new URL('../../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-1.webp', import.meta.url).href,
    category: "Lighting",
    subcategory: "Desk Lamps",
    brand: "Baseus",
    vibe: "minimalist",
    discount: "-25%",
    live: "11 on checkout"
  }
];

export default function Product() {
  const { productId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  // Product purchase control states
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Space Grey');
  const [selectedVibe, setSelectedVibe] = useState('Stealth Black');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);

  // Database States
  const [allDbProducts, setAllDbProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    // Reset options on product change
    setQuantity(1);
    setActiveImageIdx(0);
    setActiveTab('description');
  }, [productId]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const prodData = await requestJson(`${serviceRegistry.catalog}/products`);
        if (prodData && prodData.length > 0) {
          setAllDbProducts(prodData);
        }
      } catch (e) {
        console.error('Failed to load products from database', e);
      }
      try {
        const catData = await requestJson(`${serviceRegistry.catalog}/categories`);
        if (catData && catData.length > 0) {
          setDbCategories(catData);
        }
      } catch (e) {
        console.error('Failed to load categories from database', e);
      }
    };
    loadData();

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Compile active product details
  const productInfo = useMemo(() => {
    const rawProducts = allDbProducts.length > 0 ? allDbProducts : STATIC_PRODUCTS_FALLBACK;
    const baseProd = rawProducts.find(p => String(p.id) === productId) || rawProducts[0];
    
    // Resolve full detailed specs mapping
    const detailedSpecs = STORE_PRODUCTS_DETAILS[baseProd.id] || {
      id: baseProd.id,
      title: baseProd.title,
      price: typeof baseProd.price === 'string' ? parseFloat(baseProd.price.replace(/[^\d.]/g, '')) : Number(baseProd.price),
      oldPrice: typeof baseProd.price === 'string' ? parseFloat(baseProd.price.replace(/[^\d.]/g, '')) * 1.25 : Number(baseProd.price) * 1.25,
      rating: baseProd.rating || 4.8,
      reviewsCount: baseProd.reviewsCount || 12,
      category: baseProd.category?.name || baseProd.category || "Workspace Accessories",
      subcategory: baseProd.subcategory || "Desk Accessory",
      brand: baseProd.brand || "Premium Brand",
      vibe: baseProd.vibe || "minimalist",
      discount: baseProd.discount || "-15%",
      live: baseProd.live || "8 viewing now",
      description: `${baseProd.title} brings top-tier productivity, premium aesthetics, and tactile pleasure to your home office setup. Crafted using durable materials and designed with high ergonomics in mind.`,
      specs: {
        "Brand": baseProd.brand || "Premium Accessories",
        "Material": baseProd.vibe === 'walnut' ? 'Solid Walnut Wood' : 'Aluminum & Silicone',
        "Dimensions": "Standard desk sizing fit",
        "Suitability": `${baseProd.vibe || 'minimalist'} desktop aesthetics`,
        "Warranty": "1-Year Warranty",
        "Return policy": "30-Day Easy Returns"
      },
      reviews: [
        { name: "Alex K.", rating: 5, date: "4 days ago", text: "Item arrived super fast. Packaging was premium and clean. Exceeded my expectations!" },
        { name: "Maya L.", rating: 4, date: "2 weeks ago", text: "Really clean aesthetics. Looks great on my setup mat." }
      ],
      miaAdvice: `Styling tip: This ${baseProd.vibe} themed item matches beautifully with desk mats of similar tones. Pair it with a complementary cable box to hide any visible cords.`
    };

    return detailedSpecs;
  }, [productId, allDbProducts]);

  // Resolve active gallery images list
  const productImages = useMemo(() => {
    // If specific mapping exists, return it
    if (PRODUCT_IMAGES_MAP[productInfo.id]) {
      return PRODUCT_IMAGES_MAP[productInfo.id];
    }
    
    // Otherwise, generate a list of 4 thumbnails using the base product image
    const rawProducts = allDbProducts.length > 0 ? allDbProducts : STATIC_PRODUCTS_FALLBACK;
    const baseProd = rawProducts.find(p => String(p.id) === productId) || rawProducts[0];
    const baseImage = baseProd.image;
    
    return [baseImage, baseImage, baseImage, baseImage];
  }, [productId, productInfo, allDbProducts]);

  // Resolve related products (same category or vibe)
  const relatedProducts = useMemo(() => {
    const rawProducts = allDbProducts.length > 0 ? allDbProducts : STATIC_PRODUCTS_FALLBACK;
    return rawProducts
      .filter(p => p.id !== productInfo.id && (p.category === productInfo.category || p.vibe === productInfo.vibe))
      .slice(0, 4);
  }, [productInfo, allDbProducts]);

  const handleAddToCart = () => {
    showToast(`Added ${quantity}x "${productInfo.title}" (${selectedColor}) to setup!`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800">

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/[0.08] max-w-sm"
          >
            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-sm font-bold tracking-wide">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialTab={authModalTab} 
      />

      {/* 1. Header Navigation Bar */}
      <nav className="bg-[#0b1021]/95 backdrop-blur-xl text-white py-2.5 lg:py-3.5 z-50 sticky top-0 w-full border-b border-white/[0.06] shadow-md transition-all duration-300">
        <div className="max-w-[1720px] mx-auto w-full px-4 lg:px-8 2xl:px-12 flex items-center justify-between gap-3 lg:gap-5 xl:gap-7">
          
          {/* Logo */}
          <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 min-w-0">
            <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-95">
              <Zap className="text-yellow-400 w-6 h-6 fill-yellow-400" />
              <span className="text-xl font-bold tracking-wide">Tech-Hub</span>
            </Link>

            {/* Menu Links */}
            <div className="hidden xl:flex items-center gap-4 2xl:gap-6 text-[13px] font-medium text-slate-300 shrink-0 whitespace-nowrap">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/category/All" className="hover:text-white transition-colors">Categories</Link>
              <Link to="/" className="hover:text-white transition-colors">Deals</Link>
              <Link to="/" className="hover:text-white transition-colors">Vendors</Link>
              <Link to="/" className="hover:text-white transition-colors">AI Assistant</Link>
              <Link to="/" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>

          {/* Search Box */}
          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-[320px] xl:max-w-[390px] 2xl:max-w-[500px] mx-1 xl:mx-3 min-w-[220px]">
            <div className="flex-1 bg-white rounded-md flex items-center overflow-hidden h-10">
              <button className="px-3 text-slate-600 border-r border-slate-200 text-sm font-medium flex items-center gap-1 hover:bg-slate-50 h-full">
                All <ChevronDown className="w-4 h-4" />
              </button>
              <input 
                type="text" 
                placeholder="Search for products, brands..." 
                className="flex-1 px-3 text-sm text-slate-800 focus:outline-none"
              />
              <button className="bg-blue-600 h-full px-5 hover:bg-blue-700 transition-colors">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Icons and Auth */}
          <div className="flex items-center gap-2 xl:gap-4 2xl:gap-5 shrink-0">
            <div className="flex flex-col items-center gap-1 cursor-pointer group relative">
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-slate-300 group-hover:text-white" />
                <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-[#0b1021] text-[10px] font-bold px-1.5 rounded-full border border-[#0b1021]">2</span>
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-white font-medium">Cart</span>
            </div>

            {user ? (
              <div className="flex items-center gap-3.5">
                <div className="relative profile-dropdown-container">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 hover:opacity-90 transition-all focus:outline-none"
                  >
                    <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs font-black shadow-md ${user.avatarBg}`}>
                      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <span className="hidden md:inline text-xs font-extrabold text-slate-200">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-56 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl z-50 text-left">
                      <div className="pb-2.5 border-b border-slate-800">
                        <p className="text-xs font-black text-white">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{user.email}</p>
                        <span className="inline-block bg-slate-800 text-slate-300 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-1.5">
                          {user.role}
                        </span>
                      </div>
                      
                      <div className="pt-2 flex flex-col gap-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 font-bold py-2 flex items-center gap-2 text-left w-full transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthModalTab('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-md transition-all shadow-md shadow-blue-600/10 hover:scale-[1.02]"
                >
                  Sign Up
                </button>
              </div>
            )}

            <button
              className="xl:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/15 text-slate-300 hover:text-white hover:border-white/40 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Breadcrumbs Bar */}
      <div className="bg-white border-b border-slate-200/60 py-3.5">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/category/All" className="hover:text-blue-600 transition-colors">Categories</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to={`/category/${encodeURIComponent(productInfo.category)}`} className="hover:text-blue-600 transition-colors">{productInfo.category}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">{productInfo.subcategory}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-bold">{productInfo.title}</span>
        </div>
      </div>

      {/* 3. Main Product details block (2 Column Grid) */}
      <main className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-sm">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-4">
            
            {/* Large Active Preview Frame */}
            <div className="border border-slate-200/60 rounded-2xl bg-gradient-to-b from-slate-50 to-white aspect-[4/3] flex items-center justify-center p-8 relative group overflow-hidden select-none">
              <motion.img 
                key={activeImageIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                src={productImages[activeImageIdx]} 
                alt={productInfo.title}
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              
              <div className="absolute right-4 top-4 flex flex-col gap-2">
                <button className="rounded-full border border-slate-200 bg-white/95 p-2 text-slate-400 hover:text-rose-500 hover:scale-105 shadow-sm active:scale-95 transition-all">
                  <Heart className="h-4.5 w-4.5" />
                </button>
                <button className="rounded-full border border-slate-200 bg-white/95 p-2 text-slate-400 hover:text-blue-500 hover:scale-105 shadow-sm active:scale-95 transition-all">
                  <Share2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Thumbnail selector row */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
              {productImages.map((imgUrl, idx) => {
                const isSelected = activeImageIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-20 w-20 rounded-xl border-2 shrink-0 bg-white p-1 flex items-center justify-center overflow-hidden transition-all ${
                      isSelected 
                        ? 'border-blue-500 ring-2 ring-blue-500/10' 
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={imgUrl} className="max-h-full max-w-full object-contain" alt="thumbnail" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Specs & Options */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between">
            <div>
              {/* Brand and category info */}
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                <span>{productInfo.brand}</span>
                <span className="h-2 w-[1px] bg-slate-300"></span>
                <span>{productInfo.subcategory}</span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {productInfo.title}
              </h1>

              {/* Rating block */}
              <div className="flex items-center gap-3 mt-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                  <span className="text-xs font-bold text-slate-800">{productInfo.rating}</span>
                </div>
                <span className="text-xs text-slate-400 font-semibold">{productInfo.reviewsCount} verified reviews</span>
                <span className="h-3 w-[1px] bg-slate-200"></span>
                <span className="text-xs text-rose-500 font-extrabold animate-pulse">{productInfo.live}</span>
              </div>

              {/* Pricing section */}
              <div className="mt-5 bg-slate-50/50 rounded-2xl border border-slate-100 p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Store Price</p>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-rose-600 tracking-tight">
                      LKR {Number(productInfo.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      LKR {Number(productInfo.oldPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
                <div className="bg-rose-500 text-white font-black text-xs px-3 py-1.5 rounded-lg shadow-sm">
                  {productInfo.discount} OFF
                </div>
              </div>

              {/* Product summary */}
              <p className="mt-5 text-sm leading-relaxed text-slate-500 font-medium">
                {productInfo.description}
              </p>

              {/* Options selection */}
              <div className="mt-6 space-y-4">
                {/* Color option selection */}
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Select Color</h3>
                  <div className="flex gap-2">
                    {['Space Grey', 'Matte Black', 'Silver'].map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedColor === color 
                            ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm' 
                            : 'border-slate-200 hover:border-slate-350 text-slate-600 bg-white'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aesthetic vibe style option */}
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Setup Vibe Style</h3>
                  <div className="flex gap-2">
                    {['Stealth Black', 'Cream Minimalist', 'Walnut & Wood'].map(vibeStyle => (
                      <button
                        key={vibeStyle}
                        onClick={() => setSelectedVibe(vibeStyle)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedVibe === vibeStyle 
                            ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm' 
                            : 'border-slate-200 hover:border-slate-350 text-slate-600 bg-white'
                        }`}
                      >
                        {vibeStyle}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity and CTA purchase blocks */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Quantity adjuster */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50/50 p-1 shrink-0">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-extrabold text-slate-800">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to setup button */}
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-3 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/10 active:scale-98 transition-all"
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                  Add to Setup
                </button>

                {/* Buy now button */}
                <button 
                  onClick={() => showToast("Redirecting to checkout...")}
                  className="w-full sm:w-auto bg-[#0f172a] hover:bg-slate-800 text-white font-extrabold text-sm py-3 px-6 rounded-2xl active:scale-98 transition-all whitespace-nowrap"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust markers */}
              <div className="flex items-center gap-5 mt-5 text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1"><Truck className="w-4 h-4 text-emerald-500" /> Free Shipping</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 1-Year Warranty</span>
                <span className="flex items-center gap-1"><RotateCcw className="w-4 h-4 text-emerald-500" /> 30-Day returns</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* 4. Tabs & Stylist advice card grid */}
      <section className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Product Tabs details */}
          <div className="xl:col-span-8 bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex border-b border-slate-100 pb-3 gap-6 mb-6">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specs', label: 'Specifications' },
                { id: 'reviews', label: `Reviews (${productInfo.reviews.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm font-black uppercase tracking-wider relative pb-3 transition-colors ${
                    activeTab === tab.id 
                      ? 'text-blue-600' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="productTabLine" className="absolute bottom-0 inset-x-0 h-1 bg-blue-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="text-sm leading-relaxed text-slate-600">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <p className="font-medium">{productInfo.description}</p>
                  <p className="font-medium">Every detail has been calculated for premium productivity and minimalism. Designed for software engineers, designers, and keyboard enthusiasts looking to clear physical clutter and reduce ergonomic stress.</p>
                  <ul className="list-disc pl-5 space-y-2 font-medium">
                    <li>Premium structural materials designed for daily wear.</li>
                    <li>Sleek integration into popular styling vibes (Walnut, Black, Minimalist).</li>
                    <li>Designed, packaged, and shipped with eco-friendly materials.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="overflow-hidden border border-slate-100 rounded-2xl">
                  <table className="w-full text-left text-xs md:text-sm font-medium">
                    <tbody>
                      {Object.entries(productInfo.specs).map(([key, val], idx) => (
                        <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                          <td className="p-3.5 font-black text-slate-900 border-b border-slate-100/50 w-1/3">{key}</td>
                          <td className="p-3.5 text-slate-500 border-b border-slate-100/50">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {productInfo.reviews.map((rev, idx) => (
                    <div key={idx} className="pb-6 border-b border-slate-100 last:pb-0 last:border-0">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <p className="font-extrabold text-slate-900">{rev.name}</p>
                          <div className="flex gap-0.5 text-amber-500 mt-1">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 font-semibold">{rev.date}</span>
                      </div>
                      <p className="text-slate-500 font-medium">{rev.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Block: Mia Concierge advice card */}
          <div className="xl:col-span-4 bg-gradient-to-br from-[#0e1732] to-[#16234b] text-white border border-white/[0.08] rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden shrink-0">
            <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-blue-600/10 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10 pb-4 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-400 leading-none">Stylist Concierge</p>
                <h4 className="text-sm font-extrabold text-white mt-1">Mia's Workspace Advice</h4>
              </div>
            </div>

            {/* Bubble style advice */}
            <div className="relative bg-white/[0.05] border border-white/10 rounded-2xl p-5 mb-6 text-sm leading-relaxed text-slate-200 font-medium">
              "{productInfo.miaAdvice}"
              <div className="absolute bottom-[-8px] left-8 w-4 h-4 bg-[#121f43] border-r border-b border-white/10 rotate-45"></div>
            </div>

            {/* Concierge Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#21366d]/90 to-[#13224a] border border-white/10 overflow-hidden flex items-end justify-center">
                <img
                  src="https://res.cloudinary.com/ddarldtbb/image/upload/v1779814719/i_need_this_girl_alone_202605262138-removebg-preview_czgnx1.png"
                  alt="Mia Concierge Avatar"
                  className="w-[124%] h-[124%] object-contain -mb-1"
                />
              </div>
              <div>
                <p className="text-xs font-black text-white">Mia Concierge</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">Workspace Curation Specialist</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 py-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6">Related Accessories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(prod => {
              const priceFormatted = typeof prod.price === 'string' 
                ? prod.price 
                : `LKR ${Number(prod.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

              return (
                <Link 
                  key={prod.id} 
                  to={`/product/${prod.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 rounded-xl border border-slate-100 bg-slate-50/50 p-3 flex items-center justify-center overflow-hidden">
                      <img src={prod.image} alt={prod.title} className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                      <span>{prod.brand}</span>
                    </div>
                    <h3 className="mt-1 text-xs font-bold leading-snug text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[32px]">
                      {prod.title}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{priceFormatted}</span>
                    <span className="text-[9px] font-black bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-blue-700 uppercase tracking-widest">
                      {prod.vibe}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Footer */}
      <footer className="bg-[#0b1021] text-slate-400 py-12 border-t border-white/[0.05]">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <Zap className="text-yellow-400 w-5 h-5 fill-yellow-400" />
              <span className="text-lg font-bold">Tech-Hub</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Tech-Hub is an AI-powered marketplace specializing in custom workspace aesthetics. Build your dream setup today.
            </p>
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4">Categories</h4>
            <div className="flex flex-col gap-2 text-xs">
              <Link to="/category/Stands%20%26%20Holders" className="hover:text-white transition-colors">Stands & Holders</Link>
              <Link to="/category/Desk%20Organizers" className="hover:text-white transition-colors">Desk Organizers</Link>
              <Link to="/category/Desk%20Mats" className="hover:text-white transition-colors">Desk Mats</Link>
              <Link to="/category/Lighting" className="hover:text-white transition-colors">Lighting</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4">Support</h4>
            <div className="flex flex-col gap-2 text-xs">
              <span className="hover:text-white transition-colors cursor-pointer">Help Center</span>
              <span className="hover:text-white transition-colors cursor-pointer">Returns & Exchanges</span>
              <span className="hover:text-white transition-colors cursor-pointer">Shipping Rates</span>
            </div>
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4">Company</h4>
            <div className="flex flex-col gap-2 text-xs">
              <span className="hover:text-white transition-colors cursor-pointer">About Us</span>
              <span className="hover:text-white transition-colors cursor-pointer">Our Story</span>
              <span className="hover:text-white transition-colors cursor-pointer">Careers</span>
            </div>
          </div>
        </div>
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 mt-12 pt-6 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-600 gap-4">
          <p>© 2026 Tech-Hub Inc. All rights reserved. Built with Advanced AI.</p>
        </div>
      </footer>

    </div>
  );
}
