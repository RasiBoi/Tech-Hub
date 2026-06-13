import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Heart, ShoppingCart, Bell, MapPin, Truck, 
  Star, Cpu, RotateCcw, HeadphonesIcon, Zap, ChevronDown, ChevronLeft, ChevronRight,
  Mic, Menu, X, CheckCircle2, User, ShoppingBag, ArrowRight, Brain, LogOut, Store,
  SlidersHorizontal, ArrowUpDown, Tag, Info, Check, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { requestJson } from '../services/httpClient';
import { serviceRegistry } from '../config/serviceRegistry';

// Dynamic subcategories mapping matching the reference image's layout and exact product lists
const SUBCATEGORIES_MAP = {
  "Stands & Holders": [
    {
      name: "Book Holders",
      count: 7,
      image: new URL('../../Media/product_images/simplist-book-stand-ergonomic-portable-adjustable-book-holder-rest-for-hands-free-reading/image-1.jpg', import.meta.url).href,
      tags: ["book", "holder", "reading"]
    },
    {
      name: "Laptop Stands",
      count: 21,
      image: new URL('../../Media/product_images/baseus-metal-adjustable-laptop-stand-laptop-riser-with-adjustable-height-and-angle/image-1.jpg', import.meta.url).href,
      tags: ["laptop", "stand", "riser"]
    },
    {
      name: "Mobile & Tablet Stands",
      count: 25,
      image: new URL('../../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-1.jpg', import.meta.url).href,
      tags: ["phone", "tablet", "ipad", "holder"]
    }
  ],
  "Desk Organizers": [
    {
      name: "Wood Organizers",
      count: 8,
      image: new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png', import.meta.url).href,
      tags: ["walnut", "wood", "organizer"]
    },
    {
      name: "Pen Holders",
      count: 5,
      image: new URL('../../Media/product_images/360-rotatable-pen-holder/image-1.png', import.meta.url).href,
      tags: ["pen", "holder", "organizer"]
    },
    {
      name: "Desk Drawers",
      count: 12,
      image: new URL('../../Media/product_images/oggi-clear-drawer-organizers-trays-set/image-1.jpg', import.meta.url).href,
      tags: ["drawer", "organizer", "tray"]
    }
  ],
  "Desk Mats": [
    {
      name: "Felt Desk Mats",
      count: 14,
      image: new URL('../../Media/product_images/feltguard-pro-felt-deskmat/image-1.jpeg', import.meta.url).href,
      tags: ["felt", "mat"]
    },
    {
      name: "Leather Desk Mats",
      count: 9,
      image: new URL('../../Media/product_images/simplist-desk-mat-pro-non-slip-pu-leather-desk-pad/image-1.jpeg', import.meta.url).href,
      tags: ["leather", "mat"]
    },
    {
      name: "Cork Desk Mats",
      count: 6,
      image: new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-1.png', import.meta.url).href,
      tags: ["cork", "mat", "plus"]
    }
  ],
  "Lighting": [
    {
      name: "Desk Lamps",
      count: 11,
      image: new URL('../../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-1.webp', import.meta.url).href,
      tags: ["lamp", "eye", "light"]
    },
    {
      name: "Monitor Light Bars",
      count: 8,
      image: new URL('../../Media/product_images/mi-computer-monitor-light-bar-black/image-1.jpg', import.meta.url).href,
      tags: ["light", "bar", "monitor"]
    },
    {
      name: "Ambient Lighting",
      count: 15,
      image: new URL('../../Media/product_images/the-hive-hexagon-led-light-panel/image-1.png', import.meta.url).href,
      tags: ["rgb", "led", "panel", "ambient"]
    }
  ],
  "Clocks & Timers": [
    {
      name: "Digital Timers",
      count: 5,
      image: new URL('../../Media/product_images/baseus-heyo-rotation-countdown-timer/image-1.jpg', import.meta.url).href,
      tags: ["timer", "countdown", "rotary"]
    },
    {
      name: "Retro Pixel Clocks",
      count: 7,
      image: new URL('../../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-1.jpeg', import.meta.url).href,
      tags: ["pixel", "clock", "gate"]
    },
    {
      name: "Mechanical Clocks",
      count: 4,
      image: new URL('../../Media/product_images/midclock-classic-flip-clock/image-1.jpeg', import.meta.url).href,
      tags: ["flip", "clock", "mechanical"]
    }
  ],
  "Charging Stations": [
    {
      name: "Wireless Chargers",
      count: 18,
      image: new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-1.png', import.meta.url).href,
      tags: ["wireless", "charger", "magsafe"]
    },
    {
      name: "Multi-device Docks",
      count: 12,
      image: new URL('../../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-1.png', import.meta.url).href,
      tags: ["dock", "robot", "charging"]
    },
    {
      name: "USB-C Hub Docks",
      count: 10,
      image: new URL('../../Media/product_images/anker-332-powerexpand-5-in-1-usb-c-hub-adapter-a8355/image-1.jpg', import.meta.url).href,
      tags: ["hub", "usb-c", "adapter"]
    }
  ],
  "Monitor Raisers": [
    {
      name: "Walnut Raisers",
      count: 6,
      image: new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href,
      tags: ["walnut", "raiser", "stand"]
    },
    {
      name: "Aluminum Raisers",
      count: 8,
      image: new URL('../../Media/product_images/kalibri-ergonomic-monitor-stand-riser/image-1.jpg', import.meta.url).href,
      tags: ["aluminum", "raiser", "riser"]
    },
    {
      name: "Dual Monitor Mounts",
      count: 12,
      image: new URL('../../Media/product_images/upergo-premium-walnut-dual-monitor-riser-stand-vd-42t/image-1.png', import.meta.url).href,
      tags: ["dual", "monitor", "riser", "mount"]
    }
  ],
  "Standing Desks": [
    {
      name: "Electric standing desks",
      count: 8,
      image: new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-1.png', import.meta.url).href,
      tags: ["electric", "standing", "desk"]
    },
    {
      name: "Desk Converters",
      count: 5,
      image: new URL('../../Media/product_images/flexispot-h7-duo-height-adjustable-side-table/image-1.png', import.meta.url).href,
      tags: ["converter", "table", "adjustable"]
    }
  ],
  "Ergonomic Chairs": [
    {
      name: "Mesh Task Chairs",
      count: 12,
      image: new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-1.jpeg', import.meta.url).href,
      tags: ["mesh", "chair", "ergonomic"]
    },
    {
      name: "Office Chairs",
      count: 6,
      image: new URL('../../Media/product_images/flexispot-bs3-ergonomic-swivel-office-chair/image-1.jpeg', import.meta.url).href,
      tags: ["office", "chair", "swivel"]
    }
  ],
  "Stress Reliever": [
    {
      name: "Kinetic Toys",
      count: 8,
      image: new URL('../../Media/product_images/kinetic-roller-coaster-perpetual-motion-toy/image-1.webp', import.meta.url).href,
      tags: ["kinetic", "roller", "motion", "toy"]
    },
    {
      name: "Fidget Accents",
      count: 14,
      image: new URL('../../Media/product_images/faimocas-typhoon-fidget-spinner/image-1.jpg', import.meta.url).href,
      tags: ["fidget", "spinner"]
    }
  ],
  "Cable Managers": [
    {
      name: "Cable Boxes",
      count: 9,
      image: new URL('../../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-1.webp', import.meta.url).href,
      tags: ["box", "cable", "management"]
    },
    {
      name: "Magnetic Clips",
      count: 15,
      image: new URL('../../Media/product_images/baseus-peas-cable-clip-lv165-magnetic-cable-organizer-and-holder/image-1.jpg', import.meta.url).href,
      tags: ["clip", "magnetic", "organizer"]
    }
  ]
};

// Fallback high-fidelity products list populated with real store files
const STATIC_PRODUCTS_FALLBACK = [
  // stands & holders
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

  // desk organizers
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
    id: "org-2",
    title: "Premium Walnut Business Card Holder",
    price: 4900,
    rating: 4.6,
    reviewsCount: 11,
    image: new URL('../../Media/product_images/premium-walnut-business-card-holder-c-level-collection/image-1.png', import.meta.url).href,
    category: "Desk Organizers",
    subcategory: "Wood Organizers",
    brand: "C-Level Collection",
    vibe: "walnut",
    discount: "-15%",
    live: "Active discount"
  },
  {
    id: "org-3",
    title: "Oggi Clear Drawer Organizers Trays Set",
    price: 7500,
    rating: 4.7,
    reviewsCount: 23,
    image: new URL('../../Media/product_images/oggi-clear-drawer-organizers-trays-set/image-1.jpg', import.meta.url).href,
    category: "Desk Organizers",
    subcategory: "Desk Drawers",
    brand: "Oggi",
    vibe: "minimalist",
    discount: "-12%",
    live: "Popular"
  },

  // desk mats
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
    id: "mat-2",
    title: "Feltguard Pro Felt Deskmat",
    price: 5800,
    rating: 4.6,
    reviewsCount: 31,
    image: new URL('../../Media/product_images/feltguard-pro-felt-deskmat/image-1.jpeg', import.meta.url).href,
    category: "Desk Mats",
    subcategory: "Felt Desk Mats",
    brand: "Feltguard",
    vibe: "walnut",
    discount: "-25%",
    live: "Hot seller"
  },
  {
    id: "mat-3",
    title: "Simplist Top Grain Leather Desk Mat",
    price: 14500,
    rating: 4.9,
    reviewsCount: 55,
    image: new URL('../../Media/product_images/simplist-desk-mat-pro-non-slip-pu-leather-desk-pad/image-1.jpeg', import.meta.url).href,
    category: "Desk Mats",
    subcategory: "Leather Desk Mats",
    brand: "Simplist",
    vibe: "black",
    discount: "-10%",
    live: "Premium selection"
  },

  // lighting
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
  },
  {
    id: "light-2",
    title: "Mi Computer Monitor Light Bar",
    price: 15900,
    rating: 4.9,
    reviewsCount: 84,
    image: new URL('../../Media/product_images/mi-computer-monitor-light-bar-black/image-1.jpg', import.meta.url).href,
    category: "Lighting",
    subcategory: "Monitor Light Bars",
    brand: "Xiaomi",
    vibe: "black",
    discount: "-15%",
    live: "Trending #1"
  },
  {
    id: "light-3",
    title: "The Hive Hexagon LED Panel Set",
    price: 24500,
    rating: 4.7,
    reviewsCount: 39,
    image: new URL('../../Media/product_images/the-hive-hexagon-led-light-panel/image-1.png', import.meta.url).href,
    category: "Lighting",
    subcategory: "Ambient Lighting",
    brand: "The Hive",
    vibe: "cyberpunk",
    discount: "-20%",
    live: "RGB Sync"
  },

  // clocks & timers
  {
    id: "clock-1",
    title: "Baseus Heyo Rotation Countdown Timer",
    price: 4900,
    rating: 4.8,
    reviewsCount: 72,
    image: new URL('../../Media/product_images/baseus-heyo-rotation-countdown-timer/image-1.jpg', import.meta.url).href,
    category: "Clocks & Timers",
    subcategory: "Digital Timers",
    brand: "Baseus",
    vibe: "cyberpunk",
    discount: "-10%",
    live: "72 wishlisted"
  },
  {
    id: "clock-2",
    title: "Divoom Times Gate Pixel Art Display",
    price: 42900,
    rating: 4.9,
    reviewsCount: 112,
    image: new URL('../../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-1.jpeg', import.meta.url).href,
    category: "Clocks & Timers",
    subcategory: "Retro Pixel Clocks",
    brand: "Divoom",
    vibe: "cyberpunk",
    discount: "-15%",
    live: "Hot item"
  },

  // charging stations
  {
    id: "charge-1",
    title: "Baseus MagPro 3-in-1 Charging Station",
    price: 21900,
    rating: 4.8,
    reviewsCount: 36,
    image: new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-1.png', import.meta.url).href,
    category: "Charging Stations",
    subcategory: "Wireless Chargers",
    brand: "Baseus",
    vibe: "minimalist",
    discount: "-20%",
    live: "36 wishlisted"
  },
  {
    id: "charge-2",
    title: "Ugreen Qi2 2-in-1 Wireless Robot Charger",
    price: 18900,
    rating: 4.9,
    reviewsCount: 112,
    image: new URL('../../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-1.png', import.meta.url).href,
    category: "Charging Stations",
    subcategory: "Multi-device Docks",
    brand: "Ugreen",
    vibe: "black",
    discount: "-15%",
    live: "Fast charge"
  },

  // monitor raisers
  {
    id: "raiser-1",
    title: "Ugreen Walnut Monitor Raiser Stand",
    price: 18900,
    rating: 4.7,
    reviewsCount: 8,
    image: new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href,
    category: "Monitor Raisers",
    subcategory: "Walnut Raisers",
    brand: "Ugreen",
    vibe: "walnut",
    discount: "-30%",
    live: "8 left"
  },
  {
    id: "raiser-2",
    title: "Upergo Premium Walnut Dual Riser",
    price: 35000,
    rating: 4.9,
    reviewsCount: 15,
    image: new URL('../../Media/product_images/upergo-premium-walnut-dual-monitor-riser-stand-vd-42t/image-1.png', import.meta.url).href,
    category: "Monitor Raisers",
    subcategory: "Dual Monitor Mounts",
    brand: "Upergo",
    vibe: "walnut",
    discount: "-10%",
    live: "High demand"
  },

  // standing desks
  {
    id: "desk-1",
    title: "FlexiSpot E7 Ergonomic Standing Desk",
    price: 185000,
    rating: 4.9,
    reviewsCount: 84,
    image: new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-1.png', import.meta.url).href,
    category: "Standing Desks",
    subcategory: "Electric standing desks",
    brand: "FlexiSpot",
    vibe: "walnut",
    discount: "-12%",
    live: "Free delivery"
  },

  // ergonomic chairs
  {
    id: "chair-1",
    title: "FlexiSpot C7 Premium Ergonomic Chair",
    price: 98500,
    rating: 4.9,
    reviewsCount: 124,
    image: new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-1.jpeg', import.meta.url).href,
    category: "Ergonomic Chairs",
    subcategory: "Mesh Task Chairs",
    brand: "FlexiSpot",
    vibe: "minimalist",
    discount: "-25%",
    live: "84 bought today"
  },

  // stress reliever
  {
    id: "stress-1",
    title: "Kinetic Roller Coaster Perpetual Toy",
    price: 14500,
    rating: 4.7,
    reviewsCount: 18,
    image: new URL('../../Media/product_images/kinetic-roller-coaster-perpetual-motion-toy/image-1.webp', import.meta.url).href,
    category: "Stress Reliever",
    subcategory: "Kinetic Toys",
    brand: "Kinetic",
    vibe: "cyberpunk",
    discount: "-15%",
    live: "Relaxing desk toy"
  },

  // cable managers
  {
    id: "cable-1",
    title: "Fasola Cable Management Box (White)",
    price: 4500,
    rating: 4.8,
    reviewsCount: 22,
    image: new URL('../../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-1.webp', import.meta.url).href,
    category: "Cable Managers",
    subcategory: "Cable Boxes",
    brand: "Fasola",
    vibe: "minimalist",
    discount: "-10%",
    live: "9 left"
  }
];

export default function Category() {
  const { categoryName } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  // Interactive filtering states
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedVibe, setSelectedVibe] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState(200000); // max default

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);

  // Database States
  const [allDbProducts, setAllDbProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    // Reset filters when category changes
    setSelectedSubcategory(null);
    setSelectedVibe('all');
    setSelectedBrand('all');
    setSortBy('popularity');
    setPriceRange(200000);
  }, [categoryName]);

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

  // Resolve subcategories and categories list
  const currentCategories = useMemo(() => {
    const curatedList = [
      { name: 'Stands & Holders', image: new URL('../../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-1.jpg', import.meta.url).href },
      { name: 'Desk Organizers', image: new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png', import.meta.url).href },
      { name: 'Desk Mats', image: new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-1.png', import.meta.url).href },
      { name: 'Lighting', image: new URL('../../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-1.webp', import.meta.url).href },
      { name: 'Clocks & Timers', image: new URL('../../Media/product_images/baseus-heyo-rotation-countdown-timer/image-1.jpg', import.meta.url).href },
      { name: 'Charging Stations', image: new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-1.png', import.meta.url).href },
      { name: 'Monitor Raisers', image: new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href },
      { name: 'Standing Desks', image: new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-1.png', import.meta.url).href },
      { name: 'Ergonomic Chairs', image: new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-1.jpeg', import.meta.url).href },
      { name: 'Stress Reliever', image: new URL('../../Media/product_images/kinetic-roller-coaster-perpetual-motion-toy/image-1.webp', import.meta.url).href },
      { name: 'Cable Managers', image: new URL('../../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-1.webp', import.meta.url).href }
    ];
    return dbCategories.length > 0 ? dbCategories : curatedList;
  }, [dbCategories]);

  // Decode selected category name
  const activeCategoryName = useMemo(() => {
    if (!categoryName || categoryName.toLowerCase() === 'all') return 'All Categories';
    // Match exact casing from lists
    const match = currentCategories.find(c => c.name.toLowerCase() === decodeURIComponent(categoryName).toLowerCase());
    return match ? match.name : decodeURIComponent(categoryName);
  }, [categoryName, currentCategories]);

  // Subcategories mapping matching active category
  const subcategories = useMemo(() => {
    if (activeCategoryName === 'All Categories') {
      return [];
    }
    return SUBCATEGORIES_MAP[activeCategoryName] || [];
  }, [activeCategoryName]);

  // Compile full products array
  const categoryProducts = useMemo(() => {
    const rawProducts = allDbProducts.length > 0 ? allDbProducts : STATIC_PRODUCTS_FALLBACK;
    
    // Filter by main category first
    let filtered = rawProducts;
    if (activeCategoryName !== 'All Categories') {
      filtered = rawProducts.filter(p => {
        const pCat = p.category?.name || p.category || '';
        return pCat.toLowerCase() === activeCategoryName.toLowerCase();
      });
    }

    // Filter by selected subcategory
    if (selectedSubcategory) {
      filtered = filtered.filter(p => {
        const pSub = p.subcategory || '';
        return pSub.toLowerCase() === selectedSubcategory.toLowerCase();
      });
    }

    // Filter by Vibe
    if (selectedVibe !== 'all') {
      filtered = filtered.filter(p => (p.vibe || '').toLowerCase() === selectedVibe.toLowerCase());
    }

    // Filter by Brand
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p => (p.brand || '').toLowerCase().includes(selectedBrand.toLowerCase()));
    }

    // Filter by Price Range
    filtered = filtered.filter(p => {
      const priceVal = typeof p.price === 'string' ? parseFloat(p.price.replace(/[^\d.]/g, '')) : Number(p.price);
      return priceVal <= priceRange;
    });

    // Sorting logic
    return [...filtered].sort((a, b) => {
      const priceA = typeof a.price === 'string' ? parseFloat(a.price.replace(/[^\d.]/g, '')) : Number(a.price);
      const priceB = typeof b.price === 'string' ? parseFloat(b.price.replace(/[^\d.]/g, '')) : Number(b.price);
      
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return Number(b.rating || 0) - Number(a.rating || 0);
      // default: popularity (highest ratings/reviews count first)
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });
  }, [allDbProducts, activeCategoryName, selectedSubcategory, selectedVibe, selectedBrand, sortBy, priceRange]);

  // Extract unique brands for filtering sidebar
  const uniqueBrands = useMemo(() => {
    const rawProducts = allDbProducts.length > 0 ? allDbProducts : STATIC_PRODUCTS_FALLBACK;
    const catProds = activeCategoryName === 'All Categories' 
      ? rawProducts 
      : rawProducts.filter(p => (p.category?.name || p.category || '').toLowerCase() === activeCategoryName.toLowerCase());
    
    const brands = catProds.map(p => p.brand || 'Premium Brand').filter((v, i, self) => self.indexOf(v) === i && v);
    return brands.length > 0 ? brands : ['Baseus', 'Ugreen', 'Upergo', 'Divoom', 'FlexiSpot'];
  }, [allDbProducts, activeCategoryName]);

  // Quick add to cart
  const handleQuickAdd = (productTitle) => {
    showToast(`"${productTitle}" added to cart!`);
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

      {/* Auth Modal integration */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialTab={authModalTab} 
      />

      {/* 1. Header Navigation Bar (Consistent with Home.jsx) */}
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
              <Link to="/category/All" className="text-white relative">Categories<span className="absolute -bottom-4 left-0 w-full h-1 bg-blue-500 rounded-t-md"></span></Link>
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
                        {user.role === 'admin' && (
                          <Link to="/admin" className="text-xs text-slate-300 hover:text-white font-bold py-2 flex items-center gap-2 transition-colors">
                            <Cpu className="w-3.5 h-3.5 text-rose-500" />
                            Admin Dashboard
                          </Link>
                        )}
                        {user.role === 'vendor' && (
                          <Link to="/vendor" className="text-xs text-slate-300 hover:text-white font-bold py-2 flex items-center gap-2 transition-colors">
                            <Store className="w-3.5 h-3.5 text-blue-500" />
                            Vendor Portal
                          </Link>
                        )}
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
                    setAuthModalTab('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="hidden md:inline-block border border-yellow-400/40 text-yellow-400 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-md hover:bg-yellow-400 hover:text-[#0b1021] transition-all whitespace-nowrap"
                >
                  Become Seller
                </button>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-md transition-all shadow-md shadow-blue-600/10 hover:scale-[1.02] flex items-center justify-center"
                >
                  Sign Up
                </Link>
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            className="xl:hidden border-t border-white/10 mt-2 px-4 pt-3 pb-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-medium text-slate-200">
              {['Home', 'Categories', 'Deals', 'Vendors', 'AI Assistant', 'Support'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Categories' ? '/category/All' : '/'}
                  className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-colors text-left"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      {/* 2. Breadcrumbs Bar (Matching Reference Screenshot) */}
      <div className="bg-white border-b border-slate-200/60 py-3.5">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/category/All" className="hover:text-blue-600 transition-colors">Categories</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          {activeCategoryName !== 'All Categories' && (
            <>
              <span className="text-slate-400">Workspace curation</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </>
          )}
          <span className="text-blue-600 font-bold">{activeCategoryName}</span>
        </div>
      </div>

      {/* 3. Category Header Title & Filter Meta Row (Reference: Stands & Holders header) */}
      <header className="bg-white pt-8 pb-6 border-b border-slate-200/50">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
              {activeCategoryName}
            </h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Curate your premium workstation with selected, high-performance office design accessories.
            </p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-5 border-t border-slate-100 pt-4 md:pt-0 md:border-0">
            <span className="text-xs sm:text-sm text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-400" />
              Showing 1-{categoryProducts.length} of {categoryProducts.length} results
            </span>

            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs sm:text-sm font-semibold bg-transparent text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="popularity">Sort by popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Sort by rating</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* 4. Subcategories Grid or Main Categories Grid */}
      {activeCategoryName === 'All Categories' ? (
        <section className="bg-white py-10 border-b border-slate-200/60 shadow-inner">
          <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                Explore Premium Workspace Categories
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentCategories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/20 group cursor-pointer aspect-[4/3] flex flex-col justify-end shadow-sm hover:border-slate-350 hover:shadow-md hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Centered Preview Image */}
                  <div className="absolute inset-0 flex items-center justify-center p-6 pb-20 bg-white">
                    <img 
                      src={cat.image} 
                      alt={cat.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Bottom White Overlay Panel */}
                  <div className="relative bg-white border-t border-slate-100 p-4 text-center z-10 shadow-lg">
                    <h3 className="text-xs font-black text-slate-900 tracking-wide uppercase">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none flex items-center justify-center gap-1 group-hover:text-blue-700">
                      Explore category <ArrowRight className="w-3.5 h-3.5" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        subcategories.length > 0 && (
          <section className="bg-white py-10 border-b border-slate-200/60 shadow-inner">
            <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  Select Subcategory Inside {activeCategoryName}
                </h2>
                {selectedSubcategory && (
                  <button 
                    onClick={() => setSelectedSubcategory(null)}
                    className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1 border border-blue-200 rounded-lg px-2.5 py-1 bg-blue-50/50"
                  >
                    Clear filter
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {subcategories.map((sub, idx) => {
                  const isActive = selectedSubcategory === sub.name;
                  return (
                    <motion.div
                      key={sub.name}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.2 }}
                      className={`relative overflow-hidden rounded-2xl border bg-slate-50/20 group cursor-pointer aspect-[4/3] flex flex-col justify-end shadow-sm transition-all duration-300 ${
                        isActive 
                          ? 'border-blue-500 shadow-blue-500/10 shadow-md ring-2 ring-blue-500/20' 
                          : 'border-slate-200/80 hover:border-slate-350 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedSubcategory(isActive ? null : sub.name)}
                    >
                      {/* Centered Preview Image */}
                      <div className="absolute inset-0 flex items-center justify-center p-6 pb-20 bg-white">
                        <img 
                          src={sub.image} 
                          alt={sub.name}
                          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Bottom White Overlay Panel */}
                      <div className="relative bg-white border-t border-slate-100 p-4 text-center z-10 shadow-lg">
                        <h3 className="text-xs font-black text-slate-900 tracking-wide uppercase">
                          {sub.name}
                        </h3>
                        <p className="mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                          {sub.count} Products
                        </p>
                      </div>

                      {/* Active highlight bar */}
                      {isActive && (
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-500 z-20" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )
      )}

      {/* 5. Main Content: Filter Sidebar + Products Grid */}
      <main className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar Filter Section */}
          <aside className="w-full lg:w-72 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm sticky top-24 shrink-0 z-20">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-500" />
                Refine Workspace Setup
              </span>
              <button 
                onClick={() => {
                  setSelectedSubcategory(null);
                  setSelectedVibe('all');
                  setSelectedBrand('all');
                  setPriceRange(200000);
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-500 transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Price Filter */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">Price Limit (LKR)</h3>
              <input 
                type="range" 
                min="1000" 
                max="200000" 
                step="5000"
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between items-center mt-2 text-xs font-semibold text-slate-500">
                <span>LKR 1,000</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">Max: LKR {priceRange.toLocaleString()}</span>
              </div>
            </div>

            {/* Vibes Filter (Aligning with Homepage curate hub) */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">Workspace Vibe</h3>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'all', label: 'All Vibes', bg: 'bg-slate-100 text-slate-700' },
                  { id: 'walnut', label: 'Walnut & Organic', bg: 'bg-amber-100 text-amber-800' },
                  { id: 'minimalist', label: 'Cream Minimalist', bg: 'bg-slate-100 text-slate-800 border-slate-300' },
                  { id: 'black', label: 'Stealth Matte Black', bg: 'bg-slate-900 text-white' },
                  { id: 'cyberpunk', label: 'Cyberpunk RGB', bg: 'bg-purple-100 text-purple-800' }
                ].map(vibe => (
                  <button
                    key={vibe.id}
                    onClick={() => setSelectedVibe(vibe.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all ${
                      selectedVibe === vibe.id 
                        ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm' 
                        : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>{vibe.label}</span>
                    {selectedVibe === vibe.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">Brands</h3>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedBrand('all')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all ${
                    selectedBrand === 'all' 
                      ? 'border-blue-500 bg-blue-50 text-blue-800' 
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  All Brands
                  {selectedBrand === 'all' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                {uniqueBrands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all ${
                      selectedBrand === brand 
                        ? 'border-blue-500 bg-blue-50 text-blue-800' 
                        : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {brand}
                    {selectedBrand === brand && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Products list */}
          <section className="flex-1 w-full">
            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {categoryProducts.map((prod, index) => {
                  const priceFormatted = typeof prod.price === 'string' 
                    ? prod.price 
                    : `LKR ${Number(prod.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

                  const oldPriceFormatted = prod.oldPrice 
                    ? prod.oldPrice 
                    : `LKR ${(Number(prod.price) * 1.25).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

                  return (
                    <motion.article
                      key={prod.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                    >
                      <Link to={`/product/${prod.id}`} className="block">
                        {/* Discount Tag */}
                        <div className="absolute left-3.5 top-3.5 rounded-md bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white z-10 shadow-sm shadow-rose-500/10">
                          {prod.discount || '-15%'}
                        </div>

                        {/* Product Image Frame */}
                        <div className="h-48 rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-3 flex items-center justify-center relative overflow-hidden">
                          <img 
                            src={prod.image} 
                            alt={prod.title} 
                            className="max-h-full max-w-full rounded-lg object-contain transition-transform duration-500 group-hover:scale-105" 
                          />
                        </div>

                        {/* Category and brand meta */}
                        <div className="mt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                          <span>{prod.brand || 'Premium Brand'}</span>
                          <span className="h-1.5 w-[1px] bg-slate-300"></span>
                          <span>{prod.subcategory || activeCategoryName}</span>
                        </div>

                        <h4 className="mt-1 text-sm font-bold leading-snug text-slate-800 min-h-[42px] group-hover:text-blue-600 transition-colors">
                          {prod.title}
                        </h4>

                        {/* Rating block */}
                        <div className="mt-2.5 flex items-center gap-1 text-[11px] text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                          <span className="font-semibold text-slate-700">{prod.rating || '4.8'}</span>
                          <span className="text-slate-400 font-medium">({prod.live || 'Active deal'})</span>
                        </div>

                        {/* Pricing and Action bottom */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                          <div>
                            <p className="text-lg font-black text-rose-600 tracking-tight leading-none">{priceFormatted}</p>
                            <p className="text-[10px] text-slate-400 line-through mt-1">{oldPriceFormatted}</p>
                          </div>

                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase tracking-widest border border-blue-100">
                            {prod.vibe || 'minimalist'}
                          </span>
                        </div>
                      </Link>

                      <div className="mt-3.5 flex gap-2 relative z-10">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleQuickAdd(prod.title);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-600 hover:text-white px-3 py-2.5 text-xs font-extrabold text-blue-700 transition-all shadow-sm active:scale-95"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Setup
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            showToast("Added to wishlist!");
                          }}
                          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No products match your filters</h3>
                <p className="mt-1.5 text-sm text-slate-400">Try adjusting your price slider or choosing a different style vibe.</p>
                <button
                  onClick={() => {
                    setSelectedSubcategory(null);
                    setSelectedVibe('all');
                    setSelectedBrand('all');
                    setPriceRange(200000);
                  }}
                  className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </section>

        </div>
      </main>

      {/* 6. Footer (Matching existing design structure) */}
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
              <span className="hover:text-white transition-colors cursor-pointer">Live Chat</span>
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
              <span className="hover:text-white transition-colors cursor-pointer">Press kit</span>
            </div>
          </div>
        </div>
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 mt-12 pt-6 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-600 gap-4">
          <p>© 2026 Tech-Hub Inc. All rights reserved. Built with Advanced AI.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Sitemap</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
