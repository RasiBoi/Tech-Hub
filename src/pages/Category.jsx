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
import { requestJson } from '../services/httpClient';
import { serviceRegistry } from '../config/serviceRegistry';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
  const navigate = useNavigate();

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
    
    const handleGlobalToast = (e) => {
      showToast(e.detail);
    };
    window.addEventListener('show-toast', handleGlobalToast);
    
    return () => {
      window.removeEventListener('show-toast', handleGlobalToast);
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
    <div className="min-h-screen bg-[#070a13] font-sans text-slate-200">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0d1527]/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/[0.08] max-w-sm"
          >
            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-sm font-bold tracking-wide">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      {/* 2. Breadcrumbs Bar (Matching Reference Screenshot) */}
      <div className="bg-[#0b1021]/60 border-b border-white/[0.06] py-3.5">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <Link to="/category/All" className="hover:text-blue-400 transition-colors">Categories</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          {activeCategoryName !== 'All Categories' && (
            <>
              <span className="text-slate-500">Workspace curation</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </>
          )}
          <span className="text-blue-400 font-bold">{activeCategoryName}</span>
        </div>
      </div>

      {/* 3. Category Header Title & Filter Meta Row */}
      <header className="bg-transparent pt-8 pb-6 border-b border-white/[0.06]">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
              {activeCategoryName}
            </h1>
            <p className="mt-2 text-sm text-slate-400 font-medium">
              Curate your premium workstation with selected, high-performance office design accessories.
            </p>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-5 border-t border-white/[0.06] pt-4 md:pt-0 md:border-0">
            <span className="text-xs sm:text-sm text-slate-350 font-bold bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-400" />
              Showing 1-{categoryProducts.length} of {categoryProducts.length} results
            </span>

            <div className="flex items-center gap-2 bg-[#0d1527]/70 backdrop-blur-xl border border-white/[0.08] rounded-xl px-3 py-1.5 shadow-sm">
              <ArrowUpDown className="w-4 h-4 text-slate-450" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs sm:text-sm font-semibold bg-transparent text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="popularity" className="bg-[#0b1021] text-slate-200">Sort by popularity</option>
                <option value="price-asc" className="bg-[#0b1021] text-slate-200">Price: Low to High</option>
                <option value="price-desc" className="bg-[#0b1021] text-slate-200">Price: High to Low</option>
                <option value="rating" className="bg-[#0b1021] text-slate-200">Sort by rating</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* 4. Subcategories Grid or Main Categories Grid */}
      {activeCategoryName === 'All Categories' ? (
        <section className="bg-transparent py-10 border-b border-white/[0.06] shadow-inner">
          <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-405 flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                Explore Premium Workspace Categories
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentCategories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1527]/40 group cursor-pointer aspect-[4/3] flex flex-col justify-end shadow-sm hover:border-white/[0.2] hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Centered Preview Image */}
                  <div className="absolute inset-0 flex items-center justify-center p-6 pb-20 bg-gradient-to-b from-[#111827]/80 to-[#0d1527]/80">
                    <img 
                      src={cat.image} 
                      alt={cat.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Bottom Panel */}
                  <div className="relative bg-[#0b1021]/90 border-t border-white/[0.08] p-4 text-center z-10 shadow-lg">
                    <h3 className="text-xs font-black text-white tracking-wide uppercase">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none flex items-center justify-center gap-1 group-hover:text-blue-300">
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
          <section className="bg-transparent py-10 border-b border-white/[0.06] shadow-inner">
            <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-450" />
                  Select Subcategory Inside {activeCategoryName}
                </h2>
                {selectedSubcategory && (
                  <button 
                    onClick={() => setSelectedSubcategory(null)}
                    className="text-xs font-extrabold text-blue-400 hover:text-blue-300 flex items-center gap-1 border border-blue-500/30 rounded-lg px-2.5 py-1 bg-blue-500/10"
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
                      className={`relative overflow-hidden rounded-2xl border bg-[#0d1527]/40 group cursor-pointer aspect-[4/3] flex flex-col justify-end shadow-sm transition-all duration-300 ${
                        isActive 
                          ? 'border-blue-500 shadow-blue-500/20 shadow-md ring-2 ring-blue-500/20' 
                          : 'border-white/[0.08] hover:border-white/[0.2] hover:shadow-md'
                      }`}
                      onClick={() => setSelectedSubcategory(isActive ? null : sub.name)}
                    >
                      {/* Centered Preview Image */}
                      <div className="absolute inset-0 flex items-center justify-center p-6 pb-20 bg-gradient-to-b from-[#111827]/80 to-[#0d1527]/80">
                        <img 
                          src={sub.image} 
                          alt={sub.name}
                          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Bottom Overlay Panel */}
                      <div className="relative bg-[#0b1021]/90 border-t border-white/[0.08] p-4 text-center z-10 shadow-lg">
                        <h3 className="text-xs font-black text-white tracking-wide uppercase">
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
          <aside className="w-full lg:w-72 bg-[#0d1527]/70 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-6 shadow-2xl sticky top-24 shrink-0 z-20">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
              <span className="text-sm font-black text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                Refine Workspace Setup
              </span>
              <button 
                onClick={() => {
                  setSelectedSubcategory(null);
                  setSelectedVibe('all');
                  setSelectedBrand('all');
                  setPriceRange(200000);
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-450 transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Price Filter */}
            <div className="mb-6 pb-6 border-b border-white/[0.08]">
              <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3">Price Limit (LKR)</h3>
              <input 
                type="range" 
                min="1000" 
                max="200000" 
                step="5000"
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between items-center mt-2 text-xs font-semibold text-slate-400">
                <span>LKR 1,000</span>
                <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md border border-blue-500/20">Max: LKR {priceRange.toLocaleString()}</span>
              </div>
            </div>

            {/* Vibes Filter */}
            <div className="mb-6 pb-6 border-b border-white/[0.08]">
              <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3">Workspace Vibe</h3>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'all', label: 'All Vibes', bg: 'bg-white/5 border-white/5 text-slate-300' },
                  { id: 'walnut', label: 'Walnut & Organic', bg: 'bg-amber-500/10 border-amber-500/20 text-amber-300' },
                  { id: 'minimalist', label: 'Cream Minimalist', bg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' },
                  { id: 'black', label: 'Stealth Matte Black', bg: 'bg-slate-900 border-slate-800 text-slate-400' },
                  { id: 'cyberpunk', label: 'Cyberpunk RGB', bg: 'bg-purple-500/10 border-purple-500/20 text-purple-300' }
                ].map(vibe => {
                  const isSelected = selectedVibe === vibe.id;
                  let selectedBorder = '';
                  if (isSelected) {
                    if (vibe.id === 'walnut') selectedBorder = 'border-amber-500 ring-2 ring-amber-500/20';
                    else if (vibe.id === 'minimalist') selectedBorder = 'border-cyan-400 ring-2 ring-cyan-400/20';
                    else if (vibe.id === 'black') selectedBorder = 'border-slate-400 ring-2 ring-slate-450/20';
                    else if (vibe.id === 'cyberpunk') selectedBorder = 'border-purple-500 ring-2 ring-purple-500/20';
                    else selectedBorder = 'border-blue-500 ring-2 ring-blue-500/20';
                  }

                  return (
                    <button
                      key={vibe.id}
                      onClick={() => setSelectedVibe(vibe.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all ${
                        isSelected 
                          ? `${vibe.bg} ${selectedBorder} shadow-sm` 
                          : 'border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.06] text-slate-400'
                      }`}
                    >
                      <span>{vibe.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-inherit" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3">Brands</h3>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <button
                  onClick={() => setSelectedBrand('all')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all ${
                    selectedBrand === 'all' 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                      : 'border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.06] text-slate-400'
                  }`}
                >
                  All Brands
                  {selectedBrand === 'all' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </button>
                {uniqueBrands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all ${
                      selectedBrand === brand 
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                        : 'border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.06] text-slate-400'
                    }`}
                  >
                    {brand}
                    {selectedBrand === brand && <Check className="w-3.5 h-3.5 text-blue-400" />}
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

                  // Resolve style vibe tag styles dynamically
                  let vibeTagStyle = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                  if (prod.vibe === 'walnut') {
                    vibeTagStyle = 'bg-amber-500/10 text-amber-300 border border-amber-500/20';
                  } else if (prod.vibe === 'minimalist') {
                    vibeTagStyle = 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20';
                  } else if (prod.vibe === 'black') {
                    vibeTagStyle = 'bg-slate-800 text-slate-300 border border-slate-700';
                  } else if (prod.vibe === 'cyberpunk') {
                    vibeTagStyle = 'bg-purple-500/10 text-purple-300 border border-purple-500/20';
                  }

                  return (
                    <motion.article
                      key={prod.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
                      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1527]/40 p-3.5 shadow-xl hover:border-white/[0.2] hover:shadow-[0_12px_30px_rgba(30,50,90,0.15)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                    >
                      <Link to={`/product/${prod.id}`} className="block">
                        {/* Discount Tag */}
                        <div className="absolute left-3.5 top-3.5 rounded-md bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white z-10 shadow-sm shadow-rose-500/10">
                          {prod.discount || '-15%'}
                        </div>

                        {/* Product Image Frame */}
                        <div className="h-48 rounded-xl border border-white/[0.06] bg-[#111827] relative overflow-hidden">
                          <img 
                            src={prod.image} 
                            alt={prod.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        </div>

                        {/* Category and brand meta */}
                        <div className="mt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                          <span>{prod.brand || 'Premium Brand'}</span>
                          <span className="h-1.5 w-[1px] bg-white/[0.15]"></span>
                          <span>{prod.subcategory || activeCategoryName}</span>
                        </div>

                        <h4 className="mt-1 text-sm font-bold leading-snug text-white min-h-[42px] group-hover:text-blue-400 transition-colors">
                          {prod.title}
                        </h4>

                        {/* Rating block */}
                        <div className="mt-2.5 flex items-center gap-1 text-[11px] text-amber-400">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-slate-200">{prod.rating || '4.8'}</span>
                          <span className="text-slate-400 font-medium">({prod.live || 'Active deal'})</span>
                        </div>

                        {/* Pricing and Action bottom */}
                        <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-end justify-between">
                          <div>
                            <p className="text-lg font-black text-rose-400 tracking-tight leading-none">{priceFormatted}</p>
                            <p className="text-[10px] text-slate-500 line-through mt-1">{oldPriceFormatted}</p>
                          </div>

                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${vibeTagStyle}`}>
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
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#0d1527]/85 hover:bg-blue-600 hover:text-white px-3 py-2.5 text-xs font-extrabold text-white transition-all shadow-sm active:scale-95"
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
                          className="rounded-xl border border-white/[0.08] bg-[#0d1527]/85 p-2.5 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#0d1527]/70 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-12 text-center shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-slate-400 mx-auto mb-4">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No products match your filters</h3>
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

      <Footer />

    </div>
  );
}
