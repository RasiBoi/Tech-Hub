import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Star, User, ShoppingBag, ArrowRight, ShieldCheck, Activity, Bell, 
  MapPin, CheckCircle2, ChevronRight, Store, ShoppingCart, Heart 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { requestJson } from '../services/httpClient';
import { serviceRegistry } from '../config/serviceRegistry';
import { Link } from 'react-router-dom';

const VENDORS_DATA = [
  {
    id: 'apple',
    name: 'Apple Store',
    tagline: 'Official premium computing & mobile ecosystems.',
    rating: 4.9,
    reviews: 2408,
    productsCount: 142,
    baseFollowers: 15400,
    bannerUrl: 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?q=80&w=1368&auto=format&fit=crop',
    logoSvg: (
      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.28-.58 2.94-1.39z" />
      </svg>
    ),
    products: [
      {
        id: 'charge-2',
        title: 'Qi2 2-in-1 Charging Dock',
        price: 18900,
        spec: '15W Fast Wireless',
        vibe: 'black',
        rating: 4.9,
        image: new URL('../../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-1.png', import.meta.url).href
      },
      {
        id: 'stand-3',
        title: 'Tablet iPad Dock Stand',
        price: 14500,
        spec: '360° Riser Base',
        vibe: 'minimalist',
        rating: 4.8,
        image: new URL('../../Media/product_images/upergo-tablet-ipad-dock-stand-aluminium-silver/image-1.jpg', import.meta.url).href
      },
      {
        id: 'charge-1',
        title: 'MagPro 3-in-1 Charger',
        price: 21900,
        spec: 'Qi2 MagSafe Mount',
        vibe: 'minimalist',
        rating: 4.8,
        image: new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-1.png', import.meta.url).href
      }
    ]
  },
  {
    id: 'samsung',
    name: 'Samsung Official',
    tagline: 'Industry-leading premium displays and visual hardware.',
    rating: 4.8,
    reviews: 1954,
    productsCount: 96,
    baseFollowers: 12800,
    bannerUrl: 'https://images.unsplash.com/photo-1628749528992-f5702133b686?q=80&w=1368&auto=format&fit=crop',
    logoSvg: (
      <svg className="w-16 h-8 text-white" viewBox="0 0 100 30" fill="currentColor">
        <ellipse cx="50" cy="15" rx="48" ry="14" transform="rotate(-10 50 15)" fill="#074CA1" />
        <text x="50" y="19" fontFamily="Impact, Arial Black, sans-serif" fontSize="10" fill="white" textAnchor="middle" letterSpacing="0.4">SAMSUNG</text>
      </svg>
    ),
    products: [
      {
        id: 'arm-1',
        title: 'Kaloc Premium Monitor Arm',
        price: 16500,
        spec: 'Heavy Duty Gas Spring',
        vibe: 'black',
        rating: 4.7,
        image: new URL('../../Media/product_images/kaloc-xs100g-premium-aluminum-monitor-arm/image-1.png', import.meta.url).href
      },
      {
        id: 'raiser-1',
        title: 'Monitor Raiser Stand',
        price: 18900,
        spec: 'Walnut Wood Drawer',
        vibe: 'walnut',
        rating: 4.7,
        image: new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href
      },
      {
        id: 'raiser-2',
        title: 'Premium Dual Monitor Stand',
        price: 35000,
        spec: 'Desk Space Optimizer',
        vibe: 'walnut',
        rating: 4.9,
        image: new URL('../../Media/product_images/upergo-premium-walnut-dual-monitor-riser-stand-vd-42t/image-1.png', import.meta.url).href
      }
    ]
  },
  {
    id: 'dell',
    name: 'Dell Partner',
    tagline: 'Professional performance laptop mounts and docking.',
    rating: 4.7,
    reviews: 1102,
    productsCount: 64,
    baseFollowers: 9500,
    bannerUrl: 'https://images.unsplash.com/photo-1524267213992-b76e8577d046?q=80&w=1368&auto=format&fit=crop',
    logoSvg: (
      <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10.5" />
        <path d="M7.5 9h1.5c.8 0 1.2.4 1.2 1.2v1.6c0 .8-.4 1.2-1.2 1.2H7.5V9zm.8 3.2h.7c.3 0 .4-.1.4-.4V10.2c0-.3-.1-.4-.4-.4h-.7v2.4z" fill="currentColor" stroke="none" />
        <g transform="translate(10.2, 10.8) rotate(-22) translate(-1, -1)">
          <path d="M0 0h2v.7H.7v.5h1v.6h-1v.6h1.3v.7H0V0z" fill="currentColor" stroke="none" />
        </g>
        <path d="M13.4 9v4H15v.8h-2.4V9h.8z" fill="currentColor" stroke="none" />
        <path d="M15.8 9v4H17.4v.8h-2.4V9h.8z" fill="currentColor" stroke="none" />
      </svg>
    ),
    products: [
      {
        id: 'stand-1',
        title: 'N3 Laptop Stand',
        price: 9500,
        spec: 'Foldable Riser Bracket',
        vibe: 'minimalist',
        rating: 4.8,
        image: new URL('../../Media/product_images/n3-laptop-stand/image-1.jpg', import.meta.url).href
      },
      {
        id: 'stand-2',
        title: 'Ugreen Vertical Laptop Stand',
        price: 7500,
        spec: 'Gravity Lock Spacer',
        vibe: 'minimalist',
        rating: 4.8,
        image: new URL('../../Media/product_images/ugreen-vertical-laptop-stand-adjustable-laptop-holder/image-1.jpg', import.meta.url).href
      },
      {
        id: 'stand-4',
        title: 'Portable Adjustable Laptop Stand',
        price: 11900,
        spec: 'Ergonomic Aluminium Base',
        vibe: 'minimalist',
        rating: 4.7,
        image: new URL('../../Media/product_images/upergo-portable-laptop-stand/image-1.jpeg', import.meta.url).href
      }
    ]
  },
  {
    id: 'sony',
    name: 'Sony Store',
    tagline: 'Premium studio monitoring audio and soundscapes.',
    rating: 4.8,
    reviews: 1304,
    productsCount: 58,
    baseFollowers: 11200,
    bannerUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1368&auto=format&fit=crop',
    logoSvg: (
      <svg className="w-16 h-4 text-white" viewBox="0 0 100 24" fill="currentColor">
        <path d="M19.3 5.4c-.1-1.3-1.1-2.1-3-2.1-2.2 0-3.3 1.1-3.3 2.3 0 3.3 7 2.9 7 7.7 0 2.8-2.2 4.6-5.8 4.6-3.8 0-5.7-1.5-5.9-4.2h2.2c.2 1.6 1.5 2.4 3.7 2.4 2.3 0 3.6-1.1 3.6-2.5 0-3.6-7-3-7-7.7 0-2.5 2.1-4.4 5.5-4.4 3.4 0 5.4 1.4 5.6 3.8l-2.6.4z"/>
        <path d="M34.7 17.7c-3.8 0-6.2-2.7-6.2-6.5s2.4-6.5 6.2-6.5 6.2 2.7 6.2 6.5-2.4 6.5-6.2 6.5zm0-10.7c-2.3 0-3.7 1.8-3.7 4.2s1.4 4.2 3.7 4.2 3.7-1.8 3.7-4.2-1.4-4.2-3.7-4.2z"/>
        <path d="M46.7 5.1v12.2h2.3V7.9l7.7 9.4h2.1V5.1h-2.3v9.4l-7.7-9.4h-2.1z"/>
        <path d="M69.8 11.2V5.1h-2.3v6.1l-4.7-6.1h-2.4l5.9 7.4v5.2h2.3v-5.2l5.9-7.4h-2.4l-4.7 6.1z"/>
      </svg>
    ),
    products: [
      {
        id: 'speaker-3',
        title: 'Edifier Studio Monitors',
        price: 55000,
        spec: 'Studio Acoustic Audio',
        vibe: 'minimalist',
        rating: 4.8,
        image: new URL('../../Media/product_images/edifier-mr4-studio-monitors/image-1.png', import.meta.url).href
      },
      {
        id: 'speaker-1',
        title: 'Divoom Retro Speaker',
        price: 31500,
        spec: 'Pixel Art Smart Alarm',
        vibe: 'cyberpunk',
        rating: 4.8,
        image: new URL('../../Media/product_images/divoom-ditoo-pro-retro-pixel-art-bluetooth-speaker/image-1.jpeg', import.meta.url).href
      },
      {
        id: 'speaker-2',
        title: 'Divoom Tiivoo Speaker',
        price: 29900,
        spec: 'Retro Cabinet Design',
        vibe: 'cyberpunk',
        rating: 4.7,
        image: new URL('../../Media/product_images/divoom-tiivoo-2-photo-album-bluetooth-speaker/image-1.jpeg', import.meta.url).href
      }
    ]
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi Store',
    tagline: 'Smart IoT home widgets, office lights, and workspace utilities.',
    rating: 4.7,
    reviews: 1482,
    productsCount: 110,
    baseFollowers: 13700,
    bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1368&auto=format&fit=crop',
    logoSvg: (
      <svg className="w-8 h-8 rounded-xl overflow-hidden" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="7" fill="#FF6700" />
        <path d="M7.2 8.5h1.5v5.8H7.2zm2.5 0h3c1.2 0 2.2.8 2.2 2.1v3.7h-1.5v-3.7c0-.5-.4-.9-.9-.9h-1.3v4.6H9.7zm6.2 0h1.5V11H19v1.2h-1.6v2.1h-1.5z" fill="white" />
      </svg>
    ),
    products: [
      {
        id: 'light-2',
        title: 'Mi Monitor Light Bar',
        price: 15900,
        spec: 'Asymmetric Eye Protection',
        vibe: 'black',
        rating: 4.8,
        image: new URL('../../Media/product_images/mi-computer-monitor-light-bar-black/image-1.jpg', import.meta.url).href
      },
      {
        id: 'light-3',
        title: 'Mi Smart Desk Lamp',
        price: 19900,
        spec: 'Wi-Fi Intelligent Control',
        vibe: 'minimalist',
        rating: 4.8,
        image: new URL('../../Media/product_images/mi-1s-smart-led-desk-lamp/image-1.png', import.meta.url).href
      },
      {
        id: 'timer-1',
        title: 'Baseus Countdown Timer',
        price: 4900,
        spec: 'Heyo Rotary Control Dial',
        vibe: 'minimalist',
        rating: 4.8,
        image: new URL('../../Media/product_images/baseus-heyo-rotation-countdown-timer/image-1.jpg', import.meta.url).href
      }
    ]
  },
  {
    id: 'beats',
    name: 'Beats Official',
    tagline: 'Signature acoustic headphone stands and audiophile mounts.',
    rating: 4.6,
    reviews: 820,
    productsCount: 42,
    baseFollowers: 8900,
    bannerUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1368&auto=format&fit=crop',
    logoSvg: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#E02229" />
        <path d="M12 4.5a7.5 7.5 0 0 0-7.5 7.5V12a7.5 7.5 0 0 0 12.8 5.3l-1.4-1.4A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 5.5 5.5V12a5.5 5.5 0 0 1-5.5 5.5c-3 0-5.5-2.5-5.5-5.5h-2a7.5 7.5 0 0 0 7.5 7.5 7.5 7.5 0 0 0 7.5-7.5v-.5a7.5 7.5 0 0 0-7.5-7.5z" fill="white" />
      </svg>
    ),
    products: [
      {
        id: 'walnut-headphone',
        title: 'Walnut Headphone Stand',
        price: 9500,
        spec: 'Solid Walnut Base',
        vibe: 'walnut',
        rating: 4.7,
        image: new URL('../../Media/product_images/walnut-luxe-headphone-stand/image-1.jpeg', import.meta.url).href
      },
      {
        id: 'headphone-2',
        title: 'Apex Solid Walnut Stand',
        price: 12900,
        spec: 'Premium Wood Hanger',
        vibe: 'walnut',
        rating: 4.8,
        image: new URL('../../Media/product_images/the-apex-stand-solid-walnut-wood-headphone-holder-stand-for-minimalist-desk-setups/image-1.png', import.meta.url).href
      },
      {
        id: 'headphone-3',
        title: 'Solo Headset Stand',
        price: 8500,
        spec: 'Universal Metal Bracket',
        vibe: 'black',
        rating: 4.7,
        image: new URL('../../Media/product_images/simplist-solo-headset-holder-detachable-aluminum-alloy-portable-headphone-stand/image-1.jpg', import.meta.url).href
      }
    ]
  }
];

export default function Vendors() {
  const [selectedVendorId, setSelectedVendorId] = useState('apple');
  const [followedVendors, setFollowedVendors] = useState({});
  const [allDbProducts, setAllDbProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);

  // Global toast listener
  useEffect(() => {
    const handleGlobalToast = (e) => {
      showToast(e.detail);
    };
    window.addEventListener('show-toast', handleGlobalToast);
    return () => window.removeEventListener('show-toast', handleGlobalToast);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const prodData = await requestJson(`${serviceRegistry.catalog}/products`);
        if (Array.isArray(prodData)) {
          setAllDbProducts(prodData);
        }
      } catch (e) {
        console.error('Failed to load database products in vendors view', e);
      }
    };
    loadProducts();
  }, []);

  const showToast = (msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleFollow = (vendorId, vendorName) => {
    setFollowedVendors(prev => {
      const isFollowing = !prev[vendorId];
      showToast(isFollowing ? `You are now following ${vendorName}!` : `Unfollowed ${vendorName}`);
      return { ...prev, [vendorId]: isFollowing };
    });
  };

  // Compile active vendor data merging DB products if available
  const vendors = useMemo(() => {
    return VENDORS_DATA.map(vendor => {
      // Find products in allDbProducts belonging to this vendor
      const dbProds = Array.isArray(allDbProducts)
        ? allDbProducts.filter(p => {
            if (!p) return false;
            let pVendor = '';
            if (p.vendor) {
              if (typeof p.vendor === 'object') {
                pVendor = p.vendor.name || p.vendor.id || '';
              } else {
                pVendor = String(p.vendor);
              }
            }
            return typeof pVendor === 'string' && pVendor.toLowerCase().includes(vendor.id.toLowerCase());
          })
        : [];
      
      const mergedProducts = dbProds.length > 0 
        ? dbProds.map(p => {
            const parsedPrice = typeof p.price === 'string' 
              ? parseFloat(p.price.replace(/[^\d.]/g, '')) 
              : Number(p.price || 0);
            return {
              id: String(p.id),
              title: p.title || 'Premium Accessory',
              price: isNaN(parsedPrice) ? 0 : parsedPrice,
              spec: p.spec || 'Premium Integration',
              vibe: p.vibe || 'minimalist',
              rating: Number(p.rating || 4.8),
              image: p.image
            };
          })
        : vendor.products;

      return {
        ...vendor,
        products: mergedProducts,
        followersCount: vendor.baseFollowers + (followedVendors[vendor.id] ? 1 : 0),
        isFollowed: !!followedVendors[vendor.id]
      };
    });
  }, [allDbProducts, followedVendors]);

  const activeVendor = useMemo(() => {
    return vendors.find(v => v.id === selectedVendorId) || vendors[0];
  }, [vendors, selectedVendorId]);

  return (
    <div className="min-h-screen bg-[#070a13] font-sans text-slate-200 overflow-x-hidden flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Breadcrumbs Bar */}
        <div className="bg-[#0b1021]/60 border-b border-white/[0.06] py-3.5">
          <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-blue-400 font-bold">Ecosystem Partners</span>
          </div>
        </div>

        {/* Page Header */}
        <header className="bg-transparent pt-8 pb-6 border-b border-white/[0.06]">
          <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
                Ecosystem Partners
              </h1>
              <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                <Store className="w-3.5 h-3.5 text-blue-400" />
                Verified Hub
              </span>
            </div>
            <p className="mt-2.5 text-sm text-slate-400 font-medium">
              Explore direct store catalog integrations, product warranties, and setups curated by official tech manufacturers.
            </p>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Sidebar: Partners list */}
            <aside className="lg:col-span-4 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 px-1">
                 E-Commerce Partners ({vendors.length})
              </h3>
              
              <div className="space-y-3.5">
                {vendors.map((vendor) => {
                  const isSelected = vendor.id === selectedVendorId;
                  return (
                    <motion.div
                      key={vendor.id}
                      onClick={() => setSelectedVendorId(vendor.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 relative overflow-hidden flex items-center justify-between shadow-lg ${
                        isSelected 
                          ? 'bg-[#0d1527] border-blue-500/50 shadow-blue-500/5 ring-1 ring-blue-500/30' 
                          : 'bg-[#0d1527]/40 border-white/[0.06] hover:border-white/20 hover:bg-[#0d1527]/70'
                      }`}
                    >
                      {/* Left side brand details */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 flex items-center justify-center shrink-0">
                          {vendor.logoSvg}
                        </div>
                        <div className="min-w-0 text-left">
                          <h4 className="font-extrabold text-sm text-white flex items-center gap-2 truncate">
                            {vendor.name}
                            {vendor.isFollowed && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-450 truncate mt-0.5">{vendor.tagline}</p>
                          
                          {/* Metrics row */}
                          <div className="flex items-center gap-2 mt-2 text-[10px] font-semibold text-slate-400 flex-wrap">
                            <span className="flex items-center gap-0.5 text-amber-400 shrink-0">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {vendor.rating}
                            </span>
                            <span className="text-white/10 shrink-0">•</span>
                            <span className="shrink-0">{vendor.products.length} Items</span>
                            <span className="text-white/10 shrink-0">•</span>
                            <span className="shrink-0">{vendor.followersCount.toLocaleString()} Followers</span>
                          </div>
                        </div>
                      </div>

                      {/* Select Chevron */}
                      <div className="shrink-0 pl-2">
                        <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isSelected ? 'text-blue-400 translate-x-0.5' : 'text-slate-500'}`} />
                      </div>
                      
                      {/* Top highlight bar */}
                      {isSelected && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </aside>

            {/* Right Storefront: Partner Catalog */}
            <section className="lg:col-span-8 space-y-6">
              
              {/* Partner Showcase Banner Card */}
              <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl h-[220px] flex flex-col justify-end p-6 sm:p-8">
                {/* Background Banner Image */}
                <div className="absolute inset-0 bg-cover bg-center select-none" style={{ backgroundImage: `url(${activeVendor.bannerUrl})` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#070a13] via-[#070a13]/85 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a13] via-transparent to-[#070a13]/40"></div>
                </div>

                {/* Banner Content Details */}
                <div className="relative z-10 text-left max-w-lg">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md flex items-center justify-center p-1.5 shrink-0 shadow-lg">
                      {activeVendor.logoSvg}
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-white leading-none">{activeVendor.name}</h2>
                      <p className="text-[11px] text-blue-400 font-extrabold uppercase tracking-widest mt-1">Official Hardware Partner</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    {activeVendor.tagline} Styling setups using {activeVendor.name} gear ensures seamless functional synergy and visual cohesion.
                  </p>
                  
                  {/* Banner buttons */}
                  <div className="flex items-center gap-3 mt-4 flex-wrap">
                    <button
                      onClick={() => handleToggleFollow(activeVendor.id, activeVendor.name)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                        activeVendor.isFollowed 
                          ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-400' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/30 active:scale-95'
                      }`}
                    >
                      {activeVendor.isFollowed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Following
                        </>
                      ) : (
                        <>
                          <User className="w-3.5 h-3.5" />
                          Follow Store
                        </>
                      )}
                    </button>
                    <span className="text-xs text-slate-400 font-semibold bg-[#070a13]/80 border border-white/[0.06] backdrop-blur-md px-3 py-2 rounded-xl">
                      {activeVendor.followersCount.toLocaleString()} followers
                    </span>
                  </div>
                </div>
              </div>

              {/* Vendor Products Grid Title */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-left">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-405 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                  Store Inventory ({activeVendor.products.length})
                </h3>
                <span className="text-xs font-bold text-slate-400">All products include brand warranty</span>
              </div>

              {/* Active Vendor Inventory Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeVendor.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {activeVendor.products.map((prod) => {
                    const priceFormatted = `LKR ${Number(prod.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                    const oldPriceFormatted = `LKR ${(Number(prod.price) * 1.25).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

                    let vibeBadgeStyle = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                    if (prod.vibe === 'walnut') {
                      vibeBadgeStyle = 'bg-amber-500/10 text-amber-300 border border-amber-500/20';
                    } else if (prod.vibe === 'minimalist') {
                      vibeBadgeStyle = 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20';
                    } else if (prod.vibe === 'black') {
                      vibeBadgeStyle = 'bg-slate-800 text-slate-300 border border-slate-700';
                    } else if (prod.vibe === 'cyberpunk') {
                      vibeBadgeStyle = 'bg-purple-500/10 text-purple-300 border border-purple-500/20';
                    }

                    return (
                      <motion.article
                        key={prod.id}
                        whileHover={{ y: -4 }}
                        className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1527]/40 p-3.5 shadow-xl hover:border-white/[0.2] transition-all duration-300 flex flex-col justify-between"
                      >
                        <Link to={`/product/${prod.id}`} className="block">
                          {/* Image Box */}
                          <div className="h-44 rounded-xl border border-white/[0.06] bg-[#111827] relative overflow-hidden">
                            <img 
                              src={prod.image} 
                              alt={prod.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                          </div>

                          {/* Brand Info */}
                          <div className="mt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                            <span>{activeVendor.name}</span>
                            <span className="h-1.5 w-[1px] bg-white/[0.15]"></span>
                            <span>{prod.spec}</span>
                          </div>

                          <h4 className="mt-1 text-sm font-bold leading-snug text-white min-h-[42px] group-hover:text-blue-400 transition-colors text-left">
                            {prod.title}
                          </h4>

                          {/* Star Ratings */}
                          <div className="mt-2.5 flex items-center gap-1 text-[11px] text-amber-400">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-slate-200">{prod.rating}</span>
                            <span className="text-slate-400 font-medium">(Verified Purchase)</span>
                          </div>

                          {/* Prices */}
                          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-end justify-between">
                            <div className="text-left">
                              <p className="text-base font-black text-rose-400 tracking-tight leading-none">{priceFormatted}</p>
                              <p className="text-[10px] text-slate-500 line-through mt-1">{oldPriceFormatted}</p>
                            </div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${vibeBadgeStyle}`}>
                              {prod.vibe}
                            </span>
                          </div>
                        </Link>

                        {/* Actions */}
                        <div className="mt-3.5 flex gap-2 relative z-10">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              showToast(`"${prod.title}" added to setup!`);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#0d1527]/85 hover:bg-blue-600 hover:text-white px-3 py-2 text-xs font-extrabold text-white transition-all shadow-sm active:scale-95"
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
                            className="rounded-xl border border-white/[0.08] bg-[#0d1527]/85 p-2 text-slate-400 hover:text-rose-500 hover:border-rose-500/30 transition-all"
                          >
                            <Heart className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </section>

          </div>
        </main>
      </div>

      <Footer />

      {/* Global Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-45 bg-[#0d1527]/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/[0.08] max-w-sm"
          >
            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-sm font-bold tracking-wide">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
