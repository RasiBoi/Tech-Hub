import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, animate, AnimatePresence } from 'framer-motion';
import { 
  Search, Heart, ShoppingCart, Bell, MapPin, Truck, 
  Star, Cpu, RotateCcw, HeadphonesIcon, Zap, ChevronDown, ChevronLeft, ChevronRight,
  Mic, Menu, X, CheckCircle2, User, Play,
  ShoppingBag, ShieldCheck, ArrowRight, Flame, Terminal,
  Check, Activity, Plus, MessageSquare, Award, FileText, ExternalLink, LogOut, Store
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { isRequestAbortError, requestJson } from '../services/httpClient';
import { serviceRegistry } from '../config/serviceRegistry';
import { Carousel, CarouselContent, CarouselItem } from '../components/ui/carousel';
import { CircularTestimonials } from '../components/ui/circular-testimonials';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const heroVideoUrl = new URL('../../Media/3a9ee91e97524aa3be25136c7e08ec15.HD-1080p-7.2Mbps-42808719.mp4', import.meta.url).href;
const sellerVideoUrl = new URL('../../Media/2ce03433-a612-48e7-9c75-05b1c7704e60.webm', import.meta.url).href;

/* ── Smooth floating wrapper ─────────────────────────────── */
const FloatingElement = ({ children, className, delay = 0, yOffset = 15 }) => (
  <div className={className}>
    <motion.div
      animate={{ y: [-yOffset, 0, -yOffset] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  </div>
);

/* ── Single animated visualizer bar ─────────────────────── */
const VisualizerBar = ({ baseHeight, delay }) => (
  <motion.div
    className="w-[3px] rounded-full bg-gradient-to-t from-blue-600 to-blue-300"
    animate={{
      height: [
        `${baseHeight * 0.3}%`,
        `${baseHeight}%`,
        `${baseHeight * 0.6}%`,
        `${baseHeight * 0.9}%`,
        `${baseHeight * 0.4}%`,
        `${baseHeight * 0.7}%`,
        `${baseHeight * 0.3}%`,
      ],
      opacity: [0.6, 1, 0.8, 1, 0.7, 1, 0.6],
    }}
    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", delay }}
  />
);

/* ── Counting stat number ────────────────────────────────── */
const AnimatedStat = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
};

const VIBE_DATASETS = {
  walnut: {
    name: 'Walnut & Organic',
    description: 'A warm, organic aesthetic featuring solid walnut wood organizers, rich leather textures, and premium acoustic stands.',
    recentlyViewed: {
      title: 'Ugreen Walnut Monitor Raiser Stand',
      image: new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href,
      price: 'LKR 18,900.00',
      category: 'Monitor Raiser',
      timeText: 'Viewed 2h ago'
    },
    handpicked: {
      title: 'Premium Walnut Desk Organizer',
      image: new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png', import.meta.url).href,
      price: 'LKR 12,900.00',
      tip: 'Solid walnut wood grains look best when placed directly on a matte black or dark grey felt desk mat.'
    },
    bundle: [
      {
        id: 'walnut-organizer',
        title: 'Premium Walnut Desk Organizer',
        price: 12900,
        image: new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png', import.meta.url).href,
      },
      {
        id: 'walnut-raiser',
        title: 'Ugreen Walnut Monitor Raiser Stand',
        price: 18900,
        image: new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href,
      },
      {
        id: 'walnut-headphone',
        title: 'Walnut Luxe Headphone Stand',
        price: 9500,
        image: new URL('../../Media/product_images/walnut-luxe-headphone-stand/image-1.jpeg', import.meta.url).href,
      }
    ],
    trending: {
      title: 'FlexiSpot E7 Ergonomic standing desk',
      image: new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-1.png', import.meta.url).href,
      price: 'LKR 185,000.00',
      socialText: '42 users styled this desk this week'
    }
  },
  minimalist: {
    name: 'Cream Minimalist',
    description: 'A bright, clean space focused on warm cream desk mats, white matte charging docks, and smart lighting to reduce mental clutter.',
    recentlyViewed: {
      title: 'Baseus Smart Eye Foldable Desk Lamp',
      image: new URL('../../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-1.webp', import.meta.url).href,
      price: 'LKR 12,800.00',
      category: 'Desk Lamp',
      timeText: 'Viewed 4h ago'
    },
    handpicked: {
      title: 'Simplist Desk Mat Pro Plus',
      image: new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-1.png', import.meta.url).href,
      price: 'LKR 6,400.00',
      tip: 'Cream and grey desk mat textures add visual warmth while keeping mouse movement smooth and precise.'
    },
    bundle: [
      {
        id: 'min-desk-mat',
        title: 'Simplist Desk Mat Pro Plus',
        price: 6400,
        image: new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-1.png', import.meta.url).href,
      },
      {
        id: 'min-charger',
        title: 'Baseus MagPro 3-in-1 Charging Station',
        price: 21900,
        image: new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-1.png', import.meta.url).href,
      },
      {
        id: 'min-cable-box',
        title: 'Fasola Cable Management Box (White)',
        price: 4500,
        image: new URL('../../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-1.webp', import.meta.url).href,
      }
    ],
    trending: {
      title: 'FlexiSpot C7 Premium Ergonomic Chair',
      image: new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-1.jpeg', import.meta.url).href,
      price: 'LKR 98,500.00',
      socialText: '84 minimalists added this to their setup today'
    }
  },
  black: {
    name: 'Stealth Matte Black',
    description: 'A stealthy, high-focus productivity look composed of black anodized metals, matte cable managers, and clean direct task lights.',
    recentlyViewed: {
      title: 'Ugreen Aluminum Monitor Raiser (Black)',
      image: new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href,
      price: 'LKR 18,900.00',
      category: 'Monitor Raiser',
      timeText: 'Viewed 1d ago'
    },
    handpicked: {
      title: 'Baseus Smart Eye Desk Lamp (Black)',
      image: new URL('../../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-2.webp', import.meta.url).href,
      price: 'LKR 12,800.00',
      tip: 'Task lights create targeted illumination on dark desk pads, keeping the surrounding room stealthy and relaxed.'
    },
    bundle: [
      {
        id: 'black-lamp',
        title: 'Baseus Smart Eye Desk Lamp (Black)',
        price: 12800,
        image: new URL('../../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-2.webp', import.meta.url).href,
      },
      {
        id: 'black-raiser',
        title: 'Ugreen Aluminum Monitor Raiser (Black)',
        price: 18900,
        image: new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href,
      },
      {
        id: 'black-cable-box',
        title: 'Fasola Cable Management Box (Black)',
        price: 4500,
        image: new URL('../../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-1.webp', import.meta.url).href,
      }
    ],
    trending: {
      title: 'Ugreen Qi2 2-in-1 Robot Charging Dock',
      image: new URL('../../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-1.png', import.meta.url).href,
      price: 'LKR 18,900.00',
      socialText: '112 programmers bought this setup accent item'
    }
  },
  cyberpunk: {
    name: 'Cyberpunk RGB',
    description: 'A high-energy, retro-futuristic style with customizable pixel displays, colorful speakers, and vibrant glowing widgets.',
    recentlyViewed: {
      title: 'Divoom Times Gate Digital Clock',
      image: new URL('../../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-1.jpeg', import.meta.url).href,
      price: 'LKR 42,900.00',
      category: 'Smart Clock',
      timeText: 'Viewed 10m ago'
    },
    handpicked: {
      title: 'Divoom Ditoo Retro Pixel Speaker',
      image: new URL('../../Media/product_images/divoom-ditoo-pro-retro-pixel-art-bluetooth-speaker/image-1.jpeg', import.meta.url).href,
      price: 'LKR 31,500.00',
      tip: 'The retro screen matches perfectly with secondary ambient RGB backlighting for maximum desktop energy.'
    },
    bundle: [
      {
        id: 'cyber-speaker',
        title: 'Divoom Ditoo Retro Speaker',
        price: 31500,
        image: new URL('../../Media/product_images/divoom-ditoo-pro-retro-pixel-art-bluetooth-speaker/image-1.jpeg', import.meta.url).href,
      },
      {
        id: 'cyber-clock',
        title: 'Divoom Times Gate Digital Clock',
        price: 42900,
        image: new URL('../../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-1.jpeg', import.meta.url).href,
      },
      {
        id: 'cyber-toy',
        title: 'Kinetic Roller Coaster Perpetual Motion',
        price: 14500,
        image: new URL('../../Media/product_images/kinetic-roller-coaster-perpetual-motion-toy/image-1.webp', import.meta.url).href,
      }
    ],
    trending: {
      title: 'Baseus rotation Countdown Timer',
      image: new URL('../../Media/product_images/baseus-heyo-rotation-countdown-timer/image-1.jpg', import.meta.url).href,
      price: 'LKR 4,900.00',
      socialText: '72 collectors wishlisted this countdown widget'
    }
  }
};

const VENDORS_DATA = [
  {
    id: 'apple',
    name: 'Apple Store',
    tagline: 'Official premium computing & mobile ecosystems.',
    rating: 4.9,
    reviews: 2408,
    productsCount: 142,
    baseFollowers: 15400,
    cardBg: 'from-slate-50/70 via-slate-50/20 to-white hover:border-slate-300',
    hoverGlow: 'hover:shadow-[0_20px_50px_rgba(15,23,42,0.04)]',
    stageBg: 'from-slate-50 via-slate-100/40 to-slate-200/10 border-slate-200/60',
    glowGrad: 'from-slate-400 to-slate-200',
    logoSvg: (
      <svg className="w-8 h-8 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.28-.58 2.94-1.39z" />
      </svg>
    ),
    products: [
      {
        title: 'Qi2 2-in-1 Charging Dock',
        price: 'LKR 18,900.00',
        spec: '15W Fast Wireless',
        image: new URL('../../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-1.png', import.meta.url).href
      },
      {
        title: 'Tablet iPad Dock Stand',
        price: 'LKR 14,500.00',
        spec: '360° Riser Base',
        image: new URL('../../Media/product_images/upergo-tablet-ipad-dock-stand-aluminium-silver/image-1.jpg', import.meta.url).href
      },
      {
        title: 'MagPro 3-in-1 Charger',
        price: 'LKR 21,900.00',
        spec: 'Qi2 MagSafe Mount',
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
    cardBg: 'from-blue-50/30 via-blue-50/5 to-white hover:border-blue-300/80',
    hoverGlow: 'hover:shadow-[0_20px_50px_rgba(7,76,161,0.05)]',
    stageBg: 'from-blue-50/50 via-blue-50/20 to-white border-blue-100/60',
    glowGrad: 'from-blue-600 to-indigo-500',
    logoSvg: (
      <svg className="w-16 h-8 text-[#074CA1]" viewBox="0 0 100 30" fill="currentColor">
        <ellipse cx="50" cy="15" rx="48" ry="14" transform="rotate(-10 50 15)" fill="#074CA1" />
        <text x="50" y="19" fontFamily="Impact, Arial Black, sans-serif" fontSize="10" fill="white" textAnchor="middle" letterSpacing="0.4">SAMSUNG</text>
      </svg>
    ),
    products: [
      {
        title: 'Kaloc Premium Monitor Arm',
        price: 'LKR 16,500.00',
        spec: 'Heavy Duty Gas Spring',
        image: new URL('../../Media/product_images/kaloc-xs100g-premium-aluminum-monitor-arm/image-1.png', import.meta.url).href
      },
      {
        title: 'Monitor Raiser Stand',
        price: 'LKR 18,900.00',
        spec: 'Walnut Wood Drawer',
        image: new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href
      },
      {
        title: 'Premium Dual Monitor Stand',
        price: 'LKR 35,000.00',
        spec: 'Desk Space Optimizer',
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
    cardBg: 'from-cyan-50/30 via-cyan-50/5 to-white hover:border-cyan-300/80',
    hoverGlow: 'hover:shadow-[0_20px_50px_rgba(0,107,206,0.05)]',
    stageBg: 'from-cyan-50/50 via-cyan-50/20 to-white border-cyan-100/60',
    glowGrad: 'from-cyan-500 to-blue-500',
    logoSvg: (
      <svg className="w-9 h-9 text-[#006BCE]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
        title: 'N3 Laptop Stand',
        price: 'LKR 9,500.00',
        spec: 'Foldable Riser Bracket',
        image: new URL('../../Media/product_images/n3-laptop-stand/image-1.jpg', import.meta.url).href
      },
      {
        title: 'Ugreen Vertical Laptop Stand',
        price: 'LKR 7,500.00',
        spec: 'Gravity Lock Spacer',
        image: new URL('../../Media/product_images/ugreen-vertical-laptop-stand-adjustable-laptop-holder/image-1.jpg', import.meta.url).href
      },
      {
        title: 'Portable Adjustable Laptop Stand',
        price: 'LKR 11,900.00',
        spec: 'Ergonomic Aluminium Base',
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
    cardBg: 'from-slate-100/40 via-slate-50/10 to-white hover:border-slate-400/80',
    hoverGlow: 'hover:shadow-[0_20px_50px_rgba(15,23,42,0.06)]',
    stageBg: 'from-slate-100/60 via-slate-50 to-white border-slate-200/80',
    glowGrad: 'from-slate-900 to-slate-600',
    logoSvg: (
      <svg className="w-16 h-4 text-slate-800" viewBox="0 0 100 24" fill="currentColor">
        <path d="M19.3 5.4c-.1-1.3-1.1-2.1-3-2.1-2.2 0-3.3 1.1-3.3 2.3 0 3.3 7 2.9 7 7.7 0 2.8-2.2 4.6-5.8 4.6-3.8 0-5.7-1.5-5.9-4.2h2.2c.2 1.6 1.5 2.4 3.7 2.4 2.3 0 3.6-1.1 3.6-2.5 0-3.6-7-3-7-7.7 0-2.5 2.1-4.4 5.5-4.4 3.4 0 5.4 1.4 5.6 3.8l-2.6.4z"/>
        <path d="M34.7 17.7c-3.8 0-6.2-2.7-6.2-6.5s2.4-6.5 6.2-6.5 6.2 2.7 6.2 6.5-2.4 6.5-6.2 6.5zm0-10.7c-2.3 0-3.7 1.8-3.7 4.2s1.4 4.2 3.7 4.2 3.7-1.8 3.7-4.2-1.4-4.2-3.7-4.2z"/>
        <path d="M46.7 5.1v12.2h2.3V7.9l7.7 9.4h2.1V5.1h-2.3v9.4l-7.7-9.4h-2.1z"/>
        <path d="M69.8 11.2V5.1h-2.3v6.1l-4.7-6.1h-2.4l5.9 7.4v5.2h2.3v-5.2l5.9-7.4h-2.4l-4.7 6.1z"/>
      </svg>
    ),
    products: [
      {
        title: 'Edifier Studio Monitors',
        price: 'LKR 55,000.00',
        spec: 'Studio Acoustic Audio',
        image: new URL('../../Media/product_images/edifier-mr4-studio-monitors/image-1.png', import.meta.url).href
      },
      {
        title: 'Divoom Retro Speaker',
        price: 'LKR 31,500.00',
        spec: 'Pixel Art Smart Alarm',
        image: new URL('../../Media/product_images/divoom-ditoo-pro-retro-pixel-art-bluetooth-speaker/image-1.jpeg', import.meta.url).href
      },
      {
        title: 'Divoom Tiivoo Speaker',
        price: 'LKR 29,900.00',
        spec: 'Retro Cabinet Design',
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
    cardBg: 'from-orange-50/20 via-orange-50/5 to-white hover:border-orange-300/80',
    hoverGlow: 'hover:shadow-[0_20px_50px_rgba(255,103,0,0.05)]',
    stageBg: 'from-orange-50/40 via-orange-50/15 to-white border-orange-100/50',
    glowGrad: 'from-orange-500 to-amber-500',
    logoSvg: (
      <svg className="w-8 h-8 rounded-xl overflow-hidden" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="7" fill="#FF6700" />
        <path d="M7.2 8.5h1.5v5.8H7.2zm2.5 0h3c1.2 0 2.2.8 2.2 2.1v3.7h-1.5v-3.7c0-.5-.4-.9-.9-.9h-1.3v4.6H9.7zm6.2 0h1.5V11H19v1.2h-1.6v2.1h-1.5z" fill="white" />
      </svg>
    ),
    products: [
      {
        title: 'Mi Monitor Light Bar',
        price: 'LKR 15,900.00',
        spec: 'Asymmetric Eye Protection',
        image: new URL('../../Media/product_images/mi-computer-monitor-light-bar-black/image-1.jpg', import.meta.url).href
      },
      {
        title: 'Mi Smart Desk Lamp',
        price: 'LKR 19,900.00',
        spec: 'Wi-Fi Intelligent Control',
        image: new URL('../../Media/product_images/mi-1s-smart-led-desk-lamp/image-1.png', import.meta.url).href
      },
      {
        title: 'Baseus Countdown Timer',
        price: 'LKR 4,900.00',
        spec: 'Heyo Rotary Control Dial',
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
    cardBg: 'from-red-50/15 via-red-50/5 to-white hover:border-red-300/80',
    hoverGlow: 'hover:shadow-[0_20px_50px_rgba(224,34,41,0.05)]',
    stageBg: 'from-red-50/30 via-red-50/10 to-white border-red-100/40',
    glowGrad: 'from-red-600 to-rose-500',
    logoSvg: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#E02229" />
        <path d="M12 4.5a7.5 7.5 0 0 0-7.5 7.5V12a7.5 7.5 0 0 0 12.8 5.3l-1.4-1.4A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 5.5 5.5V12a5.5 5.5 0 0 1-5.5 5.5c-3 0-5.5-2.5-5.5-5.5h-2a7.5 7.5 0 0 0 7.5 7.5 7.5 7.5 0 0 0 7.5-7.5v-.5a7.5 7.5 0 0 0-7.5-7.5z" fill="white" />
      </svg>
    ),
    products: [
      {
        title: 'Walnut Headphone Stand',
        price: 'LKR 9,500.00',
        spec: 'Solid Walnut Base',
        image: new URL('../../Media/product_images/walnut-luxe-headphone-stand/image-1.jpeg', import.meta.url).href
      },
      {
        title: 'Apex Solid Walnut Stand',
        price: 'LKR 12,900.00',
        spec: 'Premium Wood Hanger',
        image: new URL('../../Media/product_images/the-apex-stand-solid-walnut-wood-headphone-holder-stand-for-minimalist-desk-setups/image-1.png', import.meta.url).href
      },
      {
        title: 'Solo Headset Stand',
        price: 'LKR 8,500.00',
        spec: 'Universal Metal Bracket',
        image: new URL('../../Media/product_images/simplist-solo-headset-holder-detachable-aluminum-alloy-portable-headphone-stand/image-1.jpg', import.meta.url).href
      }
    ]
  }
];

const formatNumber = (num) => num.toLocaleString();


const compileVibeData = (vibeName, productsList) => {
  const fallback = VIBE_DATASETS[vibeName];
  if (!productsList || productsList.length === 0) return fallback;

  // Filter products by vibe
  const vibeProducts = productsList.filter(p => p.vibe === vibeName);
  if (vibeProducts.length === 0) return fallback;

  const bundle = vibeProducts.slice(0, 3).map(p => ({
    id: String(p.id),
    title: p.title,
    price: Number(p.price),
    image: p.image
  }));

  const trendingProduct = vibeProducts.find(p => p.category?.name === 'Standing Desks' || p.category?.name === 'Ergonomic Chairs') || vibeProducts[3] || vibeProducts[0];
  const handpickedProduct = vibeProducts.find(p => p.category?.name === 'Desk Organizers') || vibeProducts[1] || vibeProducts[0];
  const recentlyViewedProduct = vibeProducts.find(p => p.category?.name === 'Monitor Raisers') || vibeProducts[2] || vibeProducts[0];

  return {
    name: fallback.name,
    description: fallback.description,
    recentlyViewed: {
      title: recentlyViewedProduct.title,
      image: recentlyViewedProduct.image,
      price: `LKR ${Number(recentlyViewedProduct.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      category: recentlyViewedProduct.category?.name || 'Monitor Raiser',
      timeText: 'Viewed recently'
    },
    handpicked: {
      title: handpickedProduct.title,
      image: handpickedProduct.image,
      price: `LKR ${Number(handpickedProduct.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      tip: fallback.handpicked.tip
    },
    bundle: bundle,
    trending: {
      title: trendingProduct.title,
      image: trendingProduct.image,
      price: `LKR ${Number(trendingProduct.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      socialText: fallback.trending.socialText
    }
  };
};

const compileDeals = (productsList) => {
  return productsList.slice(0, 6).map((p, idx) => {
    const discounts = ['-20%', '-15%', '-25%', '-30%'];
    const discountPercent = parseInt(discounts[idx % 4]);
    const oldPrice = Number(p.price) / (1 - (discountPercent / -100));
    return {
      id: String(p.id),
      title: p.title,
      image: p.image,
      discount: discounts[idx % 4],
      price: `LKR ${Number(p.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      oldPrice: `LKR ${oldPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      rating: String(p.rating || '4.8'),
      live: `${Math.floor(Math.random() * 40) + 10} watching`
    };
  });
};

const compileVendorsData = (staticVendors, dbProducts) => {
  if (!dbProducts || dbProducts.length === 0) return staticVendors;
  
  return staticVendors.map(vendor => {
    // Find products in dbProducts belonging to this vendor
    const vendorProds = dbProducts.filter(p => {
      if (!p) return false;
      let pVendor = '';
      if (p.vendor) {
        if (typeof p.vendor === 'object') {
          pVendor = p.vendor.name || p.vendor.id || '';
        } else {
          pVendor = String(p.vendor);
        }
      }
      return pVendor.toLowerCase().includes(vendor.name.toLowerCase().split(' ')[0]);
    });
    
    if (vendorProds.length === 0) return vendor;
    
    return {
      ...vendor,
      products: vendorProds.slice(0, 3).map(p => {
        const parsedPrice = typeof p.price === 'string'
          ? parseFloat(p.price.replace(/[^\d.]/g, ''))
          : Number(p.price || 0);
        return {
          title: p.title || 'Premium Accessory',
          price: `LKR ${parsedPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          spec: p.spec || 'Premium Accessory',
          image: p.image
        };
      })
    };
  });
};

const HERO_SLIDES = [
  {
    title: (
      <>
        Shop Smarter with <br className="hidden sm:block" />
        <span className="text-blue-600 font-extrabold">Smart</span> <br className="hidden sm:block" />
        Workspace Catalog
      </>
    ),
    description: "Discover premium walnut wood, natural leather, and ambient lighting accessories tailored to your workspace aesthetic.",
    accentClass: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30",
    image: "https://res.cloudinary.com/ddarldtbb/image/upload/f_auto,q_auto/A_3D_commercial_product_photography_202605252017-removebg-preview_qtiikr",
    accentText: "text-blue-600",
    glowColor: "bg-blue-300/22",
    theme: "walnut",
    floaters: {
      aiPicks: {
        title: "AI Picks: Walnut",
        p1: new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png', import.meta.url).href,
        p2: new URL('../../Media/product_images/walnut-luxe-headphone-stand/image-1.jpeg', import.meta.url).href,
        p3: new URL('../../Media/product_images/upergo-premium-walnut-dual-monitor-riser-stand-vd-42t/image-1.png', import.meta.url).href,
      },
      deal: {
        label: "Walnut Spec Offer",
        off: "15% OFF",
        desc: "Discount on Full Set",
        gradient: "from-amber-700 to-amber-900 shadow-amber-900/30 border-amber-600/30"
      },
      track: {
        title: "Live Order Tracking",
        order: "Order #WA55928",
        status: "Processing",
        time: "Arriving tomorrow"
      },
      delivery: {
        title: "Free Delivery",
        time: "Same Day",
        desc: "Premium Shipping",
        gradient: "from-amber-500 to-orange-600 shadow-amber-500/20 border-amber-300"
      }
    }
  },
  {
    title: (
      <>
        Stealth Mode: <br className="hidden sm:block" />
        <span className="text-slate-100 font-extrabold">Matte Black</span> <br className="hidden sm:block" />
        Workspace Gear
      </>
    ),
    description: "Sleek, minimalist dark setup accessories, mechanical keyboards, and matte black mounts built for style and focus.",
    accentClass: "bg-slate-900 hover:bg-slate-800 shadow-slate-900/30",
    image: new URL('../../Media/stealth_black_hero.png', import.meta.url).href,
    accentText: "text-slate-950",
    glowColor: "bg-indigo-300/22",
    theme: "black",
    floaters: {
      aiPicks: {
        title: "Stealth Mode Picks",
        p1: new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-1.png', import.meta.url).href,
        p2: new URL('../../Media/product_images/mi-computer-monitor-light-bar-black/image-1.jpg', import.meta.url).href,
        p3: new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-1.png', import.meta.url).href,
      },
      deal: {
        label: "Stealth Bundle Sale",
        off: "25% OFF",
        desc: "Stealth Black Edition",
        gradient: "from-slate-700 to-slate-900 shadow-slate-900/30 border-slate-600/30"
      },
      track: {
        title: "Live Order Tracking",
        order: "Order #ST11943",
        status: "Shipped",
        time: "Arriving in 1 Day"
      },
      delivery: {
        title: "Fast Delivery",
        time: "1-2 Days",
        desc: "Priority Shipping",
        gradient: "from-slate-600 to-slate-800 shadow-slate-700/20 border-slate-500"
      }
    }
  },
  {
    title: (
      <>
        Cream & Pure <br className="hidden sm:block" />
        <span className="text-amber-600 font-extrabold">Minimalist</span> <br className="hidden sm:block" />
        Desktop Organizers
      </>
    ),
    description: "Soft, warm tones, clean desktop arrangements, and elegant accessories designed to keep your mind clear and creative.",
    accentClass: "bg-amber-600 hover:bg-amber-700 shadow-amber-600/30",
    image: new URL('../../Media/minimalist_hero.png', import.meta.url).href,
    accentText: "text-amber-600",
    glowColor: "bg-amber-300/22",
    theme: "minimalist",
    floaters: {
      aiPicks: {
        title: "Minimalist Cream Picks",
        p1: new URL('../../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-1.webp', import.meta.url).href,
        p2: new URL('../../Media/product_images/baseus-heyo-rotation-countdown-timer/image-1.jpg', import.meta.url).href,
        p3: new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href,
      },
      deal: {
        label: "Minimal Focus Sale",
        off: "20% OFF",
        desc: "Limited time discount",
        gradient: "from-amber-400 to-amber-600 shadow-amber-600/30 border-amber-300/30"
      },
      track: {
        title: "Live Order Tracking",
        order: "Order #MI88942",
        status: "In Transit",
        time: "Arriving in 3 Days"
      },
      delivery: {
        title: "Standard Shipping",
        time: "Free",
        desc: "Eco-friendly Courier",
        gradient: "from-emerald-400 to-teal-500 shadow-emerald-500/20 border-emerald-300"
      }
    }
  },
  {
    title: (
      <>
        Futuristic Battle <br className="hidden sm:block" />
        <span className="text-purple-600 font-extrabold">Cyberpunk RGB</span> <br className="hidden sm:block" />
        Gaming Ecosystems
      </>
    ),
    description: "Vibrant neon lighting, high-performance charging mounts, and custom gaming gear designed for maximum style and speed.",
    accentClass: "bg-purple-600 hover:bg-purple-700 shadow-purple-600/30",
    image: new URL('../../Media/cyberpunk_hero.png', import.meta.url).href,
    accentText: "text-purple-600",
    glowColor: "bg-purple-300/22",
    theme: "cyberpunk",
    floaters: {
      aiPicks: {
        title: "Cyberpunk RGB Picks",
        p1: new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-1.png', import.meta.url).href,
        p2: new URL('../../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-1.jpeg', import.meta.url).href,
        p3: new URL('../../Media/product_images/divoom-ditoo-pro-retro-pixel-art-bluetooth-speaker/image-1.jpeg', import.meta.url).href,
      },
      deal: {
        label: "Neon Flash Sale",
        off: "40% OFF",
        desc: "Hourly deal",
        gradient: "from-purple-500 to-indigo-600 shadow-purple-500/30 border-purple-400/30"
      },
      track: {
        title: "Live Order Tracking",
        order: "Order #CY2077",
        status: "Out for Delivery",
        time: "Arriving in 2 Hours"
      },
      delivery: {
        title: "Hyper Delivery",
        time: "Instant",
        desc: "Drone Shipping",
        gradient: "from-fuchsia-500 to-purple-600 shadow-purple-500/20 border-fuchsia-400"
      }
    }
  }
];

export default function Home() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();
  const [showWelcomeOffer, setShowWelcomeOffer] = useState(false);
  const [followedVendors, setFollowedVendors] = useState({});
  const [openDropdownVendor, setOpenDropdownVendor] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const popupSeenKey = 'techhub_offer_popup_seen';
    if (sessionStorage.getItem(popupSeenKey) === '1') return;

    const timer = setTimeout(() => {
      setShowWelcomeOffer(true);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleFollowVendor = (vendorId, vendorName) => {
    setFollowedVendors(prev => {
      const updated = { ...prev, [vendorId]: !prev[vendorId] };
      showToast(updated[vendorId] ? `You are now following ${vendorName}` : `Unfollowed ${vendorName}`);
      return updated;
    });
  };

  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (!e.target.closest('.vendor-dropdown-container')) {
        setOpenDropdownVendor(null);
      }
    };
    
    const handleHashScroll = () => {
      if (window.location.hash === '#deals') {
        setTimeout(() => {
          const el = document.getElementById('deals');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    };

    const handleVibeEvent = (e) => {
      handleVibeChange(e.detail);
    };

    const handleToastEvent = (e) => {
      showToast(e.detail);
    };

    document.addEventListener('click', handleGlobalClick);
    window.addEventListener('hashchange', handleHashScroll);
    window.addEventListener('change-vibe', handleVibeEvent);
    window.addEventListener('show-toast', handleToastEvent);
    
    // Trigger scroll on initial load if hash is present
    handleHashScroll();

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('hashchange', handleHashScroll);
      window.removeEventListener('change-vibe', handleVibeEvent);
      window.removeEventListener('show-toast', handleToastEvent);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Database States
  const [allDbProducts, setAllDbProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      // Fetch products and categories in parallel for faster page load
      const [prodResult, catResult] = await Promise.allSettled([
        requestJson(`${serviceRegistry.catalog}/products`),
        requestJson(`${serviceRegistry.catalog}/categories`),
      ]);

      if (prodResult.status === 'fulfilled' && prodResult.value) {
        setAllDbProducts(prodResult.value);
      } else if (prodResult.status === 'rejected' && !isRequestAbortError(prodResult.reason)) {
        console.error('Failed to load products from database', prodResult.reason);
      }

      if (catResult.status === 'fulfilled' && catResult.value) {
        setDbCategories(catResult.value);
      } else if (catResult.status === 'rejected' && !isRequestAbortError(catResult.reason)) {
        console.error('Failed to load categories from database', catResult.reason);
      }
    };
    loadData();
  }, []);

  // Chatbot Assistant State
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'mia', text: 'Hi! I am Mia, your smart workspace concierge. Ask me for styling suggestions (e.g. walnut, minimalist, black, cyberpunk) or specific accessories.' }
  ]);
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatMessageInput.trim()) return;

    const userMsgText = chatMessageInput;
    const userMsg = { id: `msg_${Date.now()}`, sender: 'user', text: userMsgText };
    setChatMessages(prev => [...prev, userMsg]);
    setChatMessageInput('');
    setIsChatTyping(true);
    setIsChatActive(true); // ensure it remains open

    try {
      const response = await askAiAssistant(userMsgText);
      const miaMsg = {
        id: `msg_${Date.now()}_mia`,
        sender: 'mia',
        text: response.response,
        recommendations: response.recommendations
      };
      
      setChatMessages(prev => [...prev, miaMsg]);

      // If a vibe is suggested, auto-switch to it
      if (response.vibeSuggested) {
        handleVibeChange(response.vibeSuggested);
        showToast(`Mia suggested switching to ${response.vibeSuggested} vibe!`);
      }
    } catch (err) {
      console.error('Chat AI failed', err);
      const errMsg = {
        id: `msg_${Date.now()}_err`,
        sender: 'mia',
        text: 'Sorry, I encountered an issue connecting to the recommendation service. Please try again.'
      };
      setChatMessages(prev => [...prev, errMsg]);
    } finally {
      setIsChatTyping(false);
    }
  };

  // Workspace Curation Theme State
  const [workspaceVibe, setWorkspaceVibe] = useState('walnut');
  const [isCurationLoading, setIsCurationLoading] = useState(false);
  const activeVibe = compileVibeData(workspaceVibe, allDbProducts);

  const [selectedBundleItems, setSelectedBundleItems] = useState([]);
  const [isBundleAdded, setIsBundleAdded] = useState(false);

  // Sync selected bundle items when vibe changes
  useEffect(() => {
    if (activeVibe && activeVibe.bundle) {
      setSelectedBundleItems(activeVibe.bundle.map(item => item.id));
    }
    setIsBundleAdded(false);
  }, [workspaceVibe, allDbProducts]);

  const currentBundleItems = activeVibe ? activeVibe.bundle : [];
  const rawBundleTotal = currentBundleItems
    .filter(item => selectedBundleItems.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  const bundleDiscountPercent = selectedBundleItems.length === 3 ? 15 : selectedBundleItems.length === 2 ? 5 : 0;
  const bundleSavings = rawBundleTotal * (bundleDiscountPercent / 100);
  const bundleFinalTotal = rawBundleTotal - bundleSavings;

  const handleToggleBundleItem = (itemId) => {
    if (selectedBundleItems.includes(itemId)) {
      setSelectedBundleItems(selectedBundleItems.filter(id => id !== itemId));
    } else {
      setSelectedBundleItems([...selectedBundleItems, itemId]);
    }
    setIsBundleAdded(false);
  };

  const handleVibeChange = (vibeId) => {
    setIsCurationLoading(true);
    setWorkspaceVibe(vibeId);
    setTimeout(() => {
      setIsCurationLoading(false);
    }, 450);
  };

  const handleBuyBundle = async () => {
    if (!user) {
      navigate('/login');
      showToast('Please login to place an order.');
      return;
    }
    setIsCurationLoading(true);
    try {
      const items = selectedBundleItems.map(id => {
        const p = allDbProducts.find(prod => String(prod.id) === id);
        return {
          product_id: p ? p.id : parseInt(id),
          quantity: 1
        };
      });

      await requestJson(`${serviceRegistry.commerce}/orders`, {
        method: 'POST',
        body: { items }
      });

      setIsBundleAdded(true);
      showToast('Order placed successfully! Setup bundle is on the way.');
      setTimeout(() => setIsBundleAdded(false), 2200);
    } catch (e) {
      showToast(e.message || 'Failed to place order.');
    } finally {
      setIsCurationLoading(false);
    }
  };

  const curatedCategories = [
    {
      name: 'Stands & Holders',
      count: '3,248',
      image: new URL('../../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-1.jpg', import.meta.url).href,
    },
    {
      name: 'Desk Organizers',
      count: '2,186',
      image: new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png', import.meta.url).href,
    },
    {
      name: 'Desk Mats',
      count: '4,702',
      image: new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-1.png', import.meta.url).href,
    },
    {
      name: 'Lighting',
      count: '1,944',
      image: new URL('../../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-1.webp', import.meta.url).href,
    },
    {
      name: 'Clocks & Timers',
      count: '1,325',
      image: new URL('../../Media/product_images/baseus-heyo-rotation-countdown-timer/image-1.jpg', import.meta.url).href,
    },
    {
      name: 'Charging Stations',
      count: '2,497',
      image: new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-1.png', import.meta.url).href,
    },
    {
      name: 'Monitor Raisers',
      count: '1,807',
      image: new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href,
    },
    {
      name: 'Standing Desks',
      count: '1,152',
      image: new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-1.png', import.meta.url).href,
    },
    {
      name: 'Ergonomic Chairs',
      count: '968',
      image: new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-1.jpeg', import.meta.url).href,
    },
    {
      name: 'Stress Reliever',
      count: '864',
      image: new URL('../../Media/product_images/kinetic-roller-coaster-perpetual-motion-toy/image-1.webp', import.meta.url).href,
    },
    {
      name: 'Cable Managers',
      count: '1,143',
      image: new URL('../../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-1.webp', import.meta.url).href,
    },
  ];

  const featuredPartnerTestimonials = compileVendorsData(VENDORS_DATA, allDbProducts).map(vendor => {
    const vendorImages = {
      apple: 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?q=80&w=1368&auto=format&fit=crop',
      samsung: 'https://images.unsplash.com/photo-1628749528992-f5702133b686?q=80&w=1368&auto=format&fit=crop',
      dell: 'https://images.unsplash.com/photo-1524267213992-b76e8577d046?q=80&w=1368&auto=format&fit=crop',
      sony: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1368&auto=format&fit=crop',
      xiaomi: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1368&auto=format&fit=crop',
      beats: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1368&auto=format&fit=crop'
    };

    return {
      name: vendor.name,
      designation: 'Official Partner',
      quote: vendor.tagline,
      src: vendorImages[vendor.id] || 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?q=80&w=1368&auto=format&fit=crop',
      id: vendor.id,
      rating: vendor.rating,
      reviews: vendor.reviews,
      productsCount: vendor.productsCount,
      baseFollowers: vendor.baseFollowers,
      logoSvg: vendor.logoSvg,
      isFollowed: !!followedVendors[vendor.id],
      onFollow: () => handleToggleFollowVendor(vendor.id, vendor.name),
      onVisit: () => showToast(`Opening storefront for ${vendor.name}...`)
    };
  });

  const flashDeals = [
    {
      id: 'stand-1',
      title: 'Baseus Foldable Desktop Phone Stand',
      image: new URL('../../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-2.jpeg', import.meta.url).href,
      discount: '-21%',
      price: 'LKR 24.90',
      oldPrice: 'LKR 31.50',
      rating: '4.8',
      live: '34 watching',
    },
    {
      id: 'org-1',
      title: 'Premium Walnut Desk Organizer',
      image: new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-2.jpg', import.meta.url).href,
      discount: '-18%',
      price: 'LKR 39.00',
      oldPrice: 'LKR 47.90',
      rating: '4.8',
      live: '19 carts',
    },
    {
      id: 'mat-1',
      title: 'Simplist Desk Mat Pro Plus',
      image: new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-2.png', import.meta.url).href,
      discount: '-30%',
      price: 'LKR 21.90',
      oldPrice: 'LKR 31.30',
      rating: '4.7',
      live: '42 sold today',
    },
    {
      id: 'light-1',
      title: 'Baseus Smart Eye Foldable Desk Lamp',
      image: new URL('../../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-2.webp', import.meta.url).href,
      discount: '-25%',
      price: 'LKR 44.00',
      oldPrice: 'LKR 58.80',
      rating: '4.8',
      live: '11 on checkout',
    },
    {
      id: 'charge-1',
      title: 'Baseus MagPro 3-in-1 Charging Station',
      image: new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-2.jpg', import.meta.url).href,
      discount: '-20%',
      price: 'LKR 69.00',
      oldPrice: 'LKR 86.50',
      rating: '4.8',
      live: '36 wishlisted',
    },
    {
      id: 'raiser-1',
      title: 'Ugreen Aluminum Monitor Raiser Stand',
      image: new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-2.jpg', import.meta.url).href,
      discount: '-30%',
      price: 'LKR 58.00',
      oldPrice: 'LKR 82.90',
      rating: '4.7',
      live: '8 left',
    },
  ];

  const homeOfferBanners = [
    {
      id: 'payday-sale',
      title: 'Payday Sale',
      subtitle: 'Save up to 35% on workspace bestsellers',
      cta: 'Shop Payday Deals',
      to: '/category/All?deals=true&sort=rating',
      image: new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-1.png', import.meta.url).href,
      gradient: 'from-amber-400/25 via-orange-400/15 to-yellow-300/25',
    },
    {
      id: 'weekend-offer',
      title: 'Weekend Bundle Offer',
      subtitle: 'Get extra 10% off when you buy 3 setup items',
      cta: 'Claim Offer',
      to: '/category/All?q=desk%20setup',
      image: new URL('../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png', import.meta.url).href,
      gradient: 'from-blue-500/20 via-indigo-500/10 to-cyan-400/20',
    },
  ];

  const closeWelcomeOffer = () => {
    setShowWelcomeOffer(false);
    sessionStorage.setItem('techhub_offer_popup_seen', '1');
  };

  return (
    <div className="min-h-screen bg-[#070a13] font-sans overflow-x-hidden text-slate-200">
      
      {/* 1. Top Navbar */}
      <Navbar />

      {/* 2. Sub header features */}
      <div className={`border-b shadow-sm relative z-40 w-full hidden sm:block ${isLight ? 'bg-white border-slate-200' : 'bg-[#0b1021]/60 border-white/[0.06]'}`}>
        <div className="max-w-[1440px] mx-auto w-full py-2 lg:py-3 px-4 lg:px-10 flex justify-between items-center text-xs lg:text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Deliver to</p>
              <p className={`font-semibold flex items-center gap-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Sri Lanka <ChevronDown className="w-3 h-3 text-slate-500" /></p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <div className="bg-white/5 border border-white/10 p-1.5 rounded-full"><Truck className="w-4 h-4 text-blue-400" /></div>
            <div>
              <p className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Free Shipping</p>
              <p className="text-slate-500 text-xs text-left">On orders over LKR.50000.00</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 border-l border-r border-white/[0.08] px-6">
            <div className="bg-white/5 border border-white/10 p-1.5 rounded-full"><ShieldCheck className="w-4 h-4 text-blue-400" /></div>
            <div>
              <p className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Smart Recommendations</p>
              <p className="text-slate-500 text-xs text-left">Personalized for you</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="bg-white/5 border border-white/10 p-1.5 rounded-full"><RotateCcw className="w-4 h-4 text-blue-400" /></div>
            <div>
              <p className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Easy Returns</p>
              <p className="text-slate-500 text-xs text-left">30-day return policy</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <div className="bg-white/5 border border-white/10 p-1.5 rounded-full"><HeadphonesIcon className="w-4 h-4 text-blue-400" /></div>
            <div>
              <p className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>24/7 Support</p>
              <p className="text-slate-505 text-xs text-left">We're here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Hero Section — full-width video background, constrained content */}
      <section className="always-dark relative w-full overflow-hidden bg-slate-950 flex xl:min-h-[calc(100vh-126px)]">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
        {/* Glassmorphic overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-slate-950/85 z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-b from-transparent to-[#070a13] pointer-events-none z-10"></div>

        <main className="relative max-w-[1720px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-8 2xl:px-12 pt-16 sm:pt-20 xl:pt-6 pb-4 sm:pb-6 xl:pb-4 2xl:pb-8 grid grid-cols-1 xl:grid-cols-2 items-center justify-start xl:justify-center gap-10 xl:min-h-[calc(100vh-126px)] z-20">
        
          {/* Left Column - Content */}
          <div className="w-full xl:max-w-[650px] 2xl:max-w-[720px] z-20 flex flex-col items-center xl:items-start justify-center text-center xl:text-left min-h-[380px] sm:min-h-[440px] xl:pr-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHeroSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="flex flex-col items-center xl:items-start w-full text-center xl:text-left"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] 2xl:text-[56px] leading-[1.1] font-bold text-white mb-2 xl:mb-4 tracking-tight relative z-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  {HERO_SLIDES[currentHeroSlide].title}
                </h1>
                
                <p className="text-[13px] sm:text-base text-slate-200 mb-4 xl:mb-6 max-w-[280px] sm:max-w-sm mx-auto xl:mx-0 leading-relaxed relative z-10 drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)]">
                  {HERO_SLIDES[currentHeroSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex items-center justify-center xl:justify-start gap-2.5 sm:gap-3 mb-4 xl:mb-6 relative z-10 w-full sm:w-auto px-4 sm:px-0">
              <button
                onClick={() => {
                  handleVibeChange(HERO_SLIDES[currentHeroSlide].theme);
                  const el = document.getElementById('curation-hub');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`${HERO_SLIDES[currentHeroSlide].accentClass} text-white px-7 sm:px-9 py-2.5 sm:py-3 rounded-full font-semibold shadow-lg transition-all active:scale-95 text-xs sm:text-sm whitespace-nowrap`}
              >
                Shop Now
              </button>
            </div>

            
            {/* Stats - 2×2 on mobile, row on xl */}
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:flex xl:items-center w-full relative z-10 gap-2 sm:gap-3 xl:gap-4 px-2 sm:px-0 mt-auto">
              <div className="flex items-center gap-2 xl:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-md rounded-xl bg-slate-950/80 border border-white/10">
                <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 p-1.5 rounded-lg shrink-0"><ShoppingBag className="w-4 h-4" /></div>
                <div>
                  <p className="font-bold text-[13px] sm:text-sm text-white leading-tight"><AnimatedStat target={50} suffix="K+" /></p>
                  <p className="text-[9px] sm:text-[10px] font-medium text-slate-400">Products</p>
                </div>
              </div>
              <div className="flex items-center gap-2 xl:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-md rounded-xl bg-slate-950/80 border border-white/10">
                <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 p-1.5 rounded-lg shrink-0"><User className="w-4 h-4" /></div>
                <div>
                  <p className="font-bold text-[13px] sm:text-sm text-white leading-tight"><AnimatedStat target={5} suffix="K+" /></p>
                  <p className="text-[9px] sm:text-[10px] font-medium text-slate-400">Vendors</p>
                </div>
              </div>
              <div className="flex items-center gap-2 xl:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-md rounded-xl bg-slate-950/80 border border-white/10">
                <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 p-1.5 rounded-lg shrink-0"><Truck className="w-4 h-4" /></div>
                <div>
                  <p className="font-bold text-[13px] sm:text-sm text-white leading-tight"><AnimatedStat target={1} suffix="M+" /></p>
                  <p className="text-[9px] sm:text-[10px] font-medium text-slate-400">Orders</p>
                </div>
              </div>
              <div className="flex items-center gap-2 xl:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-md rounded-xl bg-slate-950/80 border border-white/10">
                <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 p-1.5 rounded-lg shrink-0"><CheckCircle2 className="w-4 h-4" /></div>
                <div>
                  <p className="font-bold text-[13px] sm:text-sm text-white leading-tight"><AnimatedStat target={98} suffix="%" /></p>
                  <p className="text-[9px] sm:text-[10px] font-medium whitespace-nowrap text-slate-400">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>

        </main>
      </section>

      {/* 4. Categories + Flash Deals Section */}
      <section id="deals" className="relative bg-transparent overflow-hidden pt-8 sm:pt-10 pb-12 sm:pb-16 border-t border-white/[0.06]">
        {/* Ambient glows matching hero */}
        <div className="absolute top-0 left-[15%] w-[500px] h-[300px] bg-blue-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-[10%] w-[400px] h-[300px] bg-indigo-500/[0.04] rounded-full blur-[80px] pointer-events-none" />
        <div className="relative max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12">

          {/* ── Offer Banners ─────────────────────────────────── */}
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {homeOfferBanners.map((offer) => (
              <Link
                key={offer.id}
                to={offer.to}
                className={`group relative overflow-hidden rounded-2xl border ${isLight ? 'border-slate-200 bg-white' : 'border-white/[0.08] bg-[#0d1527]/80'} shadow-lg`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${offer.gradient} pointer-events-none`} />
                <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className={`text-[10px] uppercase tracking-[0.16em] font-black ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>Limited Time</p>
                    <h4 className={`text-lg sm:text-xl font-extrabold leading-tight mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{offer.title}</h4>
                    <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{offer.subtitle}</p>
                    <span className="inline-flex items-center gap-1.5 mt-3 text-xs sm:text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                      {offer.cta}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border shrink-0 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.12] bg-white/[0.04]'}`}>
                    <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ── Section Header ───────────────────────────────── */}
          <div className="mb-6 sm:mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Browse Categories</h3>
            </div>
            <Link
              to="/category/All"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all backdrop-blur-md ${
                isLight 
                  ? 'border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-500/40 hover:bg-blue-50 hover:text-blue-600' 
                  : 'border-white/[0.08] bg-white/[0.04] text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400'
              }`}
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* ── Category Pills Row ───────────────────────────── */}
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-2">
            <div className="flex gap-3 sm:gap-4 min-w-max">
              {(dbCategories.length > 0 ? dbCategories : curatedCategories).map((category, index) => (
                <Link
                  key={category.name}
                  to={`/category/${encodeURIComponent(category.name)}`}
                  className="block flex-shrink-0"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    whileHover={{ y: -5, scale: 1.05 }}
                    className="group relative flex flex-col items-center gap-3 cursor-pointer"
                  >
                    {/* Image tile with premium hover glow */}
                    <div className={`relative w-[120px] sm:w-[136px] lg:w-[150px] h-[100px] sm:h-[114px] lg:h-[126px] rounded-2xl overflow-hidden border shadow-xl group-hover:border-blue-500/60 group-hover:shadow-[0_0_24px_rgba(59,130,246,0.25)] transition-all duration-300 ${
                      isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.1]'
                    }`}>
                      {/* Dark tint that fades on hover to reveal bright image */}
                      <div className={`absolute inset-0 ${isLight ? 'bg-slate-100/10' : 'bg-[#0d1527]/55'} z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-350`} />
                      <img
                        src={category.image}
                        alt={category.name}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.12] ${isLight ? 'opacity-90 group-hover:opacity-100' : 'mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:opacity-100'}`}
                      />
                      {/* Bottom gradient — lightens on hover */}
                      <div className={`absolute inset-0 z-20 pointer-events-none transition-all duration-350 ${
                        isLight 
                          ? 'bg-gradient-to-t from-slate-200/80 via-slate-100/10 to-transparent group-hover:from-slate-200/40' 
                          : 'bg-gradient-to-t from-[#050810]/75 via-[#0a1020]/30 to-transparent group-hover:from-[#050810]/30 group-hover:via-transparent'
                      }`} />
                      {/* Active glow ring */}
                      <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-blue-500/70 ring-offset-0 transition-all duration-300 z-30 pointer-events-none" />
                    </div>
                    {/* Label */}
                    <p className="text-[12px] sm:text-[13px] font-semibold leading-tight text-slate-400 group-hover:text-blue-400 transition-colors text-center whitespace-nowrap">{category.name}</p>
                  </motion.div>
                </Link>
              ))}

              {/* See More tile */}
              <Link to="/category/All" className="flex-shrink-0 block">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.3, delay: 0.44 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  className="group flex flex-col items-center gap-3 cursor-pointer"
                >
                  <div className={`relative w-[120px] sm:w-[136px] lg:w-[150px] h-[100px] sm:h-[114px] lg:h-[126px] rounded-2xl overflow-hidden border flex items-center justify-center ${
                    isLight 
                      ? 'border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50' 
                      : 'border-white/[0.1] bg-gradient-to-br from-blue-600/20 to-indigo-600/10'
                  }`}>
                    <div className="flex flex-col items-center gap-2">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/90 text-white shadow-lg shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
                        <ArrowRight className="h-6 w-6" />
                      </span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/0 group-hover:border-blue-500/40 transition-all duration-300 pointer-events-none" />
                  </div>
                  <p className="text-[12px] sm:text-[13px] font-semibold text-slate-400 group-hover:text-blue-400 transition-colors text-center whitespace-nowrap">All Categories</p>
                </motion.div>
              </Link>
            </div>
          </div>

          {/* ── Flash Deals ──────────────────────────────────── */}
          <div className="mt-12 sm:mt-14">

            {/* Header with live countdown */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-7">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4 text-rose-400 fill-rose-500/50" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Today's Flash Deals</h3>
                </div>
                {/* Countdown timer — dramatic version */}
                <div className="flex items-center gap-1.5">
                  {['05', '42', '18'].map((unit, i) => (
                    <React.Fragment key={unit}>
                      <span className="flex flex-col items-center justify-center w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm font-black tabular-nums leading-none">
                        {unit}
                      </span>
                      {i < 2 && <span className="text-rose-400/60 font-bold text-sm">:</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <Link
                to="/category/All?deals=true&sort=rating"
                className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] text-slate-300 px-4 py-2 text-sm font-semibold hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 transition-all backdrop-blur-md"
              >
                View All Deals
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Deal Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
              {(allDbProducts.length > 0 ? compileDeals(allDbProducts) : flashDeals).map((deal, index) => (
                <motion.article
                  key={deal.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#0e1528]/80 to-[#070a13]/90 shadow-xl backdrop-blur-sm flex flex-col hover:border-white/[0.18] hover:shadow-[0_16px_40px_rgba(15,30,70,0.3)] transition-all duration-300"
                >
                  {/* Subtle inner glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-blue-500/0 group-hover:from-blue-500/[0.04] group-hover:to-indigo-500/[0.04] transition-all duration-500 pointer-events-none rounded-2xl" />

                  <Link to={`/product/${deal.id}`} className="block flex-1 p-3">
                    {/* Discount Badge */}
                    <div className="absolute left-3 top-3 z-20 flex items-center gap-1">
                      <span className="rounded-lg bg-rose-500 px-2 py-1 text-[10px] font-extrabold text-white shadow-lg shadow-rose-500/30">
                        {deal.discount}
                      </span>
                    </div>

                    {/* Product Image — premium dark card treatment */}
                    <div className="relative h-40 sm:h-44 rounded-xl overflow-hidden" style={{background: 'linear-gradient(135deg, #0f1a2e 0%, #0a1220 100%)'}}>
                      {/* Subtle vignette for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07091a]/50 via-transparent to-transparent z-10 pointer-events-none" />
                      {/* Dark semi-transparent overlay that mutes white backgrounds without hiding the product */}
                      <div className="absolute inset-0 bg-[#08102a]/35 z-[8] pointer-events-none group-hover:bg-transparent transition-colors duration-300" />
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="absolute inset-0 w-full h-full object-contain p-4 transition-all duration-400 group-hover:scale-[1.07] opacity-85 group-hover:opacity-100"
                      />
                    </div>

                    <h4 className="mt-3 text-[12px] font-semibold leading-snug text-slate-200 min-h-[36px] group-hover:text-white transition-colors">{deal.title}</h4>

                    <div className="mt-2 flex items-center gap-1 text-[11px]">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                      <span className="font-bold text-amber-400">{deal.rating}</span>
                      <span className="text-slate-500 ml-0.5 truncate">· {deal.live}</span>
                    </div>

                    <div className="mt-2 flex items-baseline gap-2">
                      <p className="text-[15px] font-extrabold text-white">{deal.price}</p>
                      <p className="text-[11px] text-slate-500 line-through">{deal.oldPrice}</p>
                    </div>
                  </Link>

                  {/* Action bar */}
                  <div className="px-3 pb-3 pt-2 border-t border-white/[0.06] flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showToast(`"${deal.title}" added to cart!`);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600/90 hover:bg-blue-500 py-2 text-[11px] font-bold text-white transition-all active:scale-95 shadow-sm shadow-blue-600/20"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Quick add
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showToast('Added to wishlist!');
                      }}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2 text-slate-500 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/[0.08] transition-all"
                    >
                      <Heart className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Bottom status bar */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-gradient-to-r from-[#0d1527]/70 via-[#0a1122]/60 to-[#0d1527]/70 px-5 py-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <p className="text-xs sm:text-sm text-slate-400">
                  <span className="text-emerald-400 font-bold">312 deals</span> were updated in the last hour. Prices shift in real-time.
                </p>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] text-slate-300 px-4 py-2 text-sm font-semibold hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all backdrop-blur-md"
              >
                See all live deals
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Become a Seller — CTA Section */}
      <section className="relative overflow-hidden border-t border-white/[0.06] py-14 sm:py-16">
        {/* Single subtle ambient glow matching the hero */}
        <div className="absolute top-0 right-[20%] w-[500px] h-[400px] bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12 z-10">

          {/* Main banner — video background card */}
          <div className="always-dark relative overflow-hidden rounded-2xl border border-white/[0.12]">
            {/* Background video */}
            <video
              src={sellerVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark overlay — keeps text readable, matches site navy palette */}
            <div className={`absolute inset-0 backdrop-blur-[1px] ${isLight ? 'bg-[#020814]/70' : 'bg-[#060c1a]/80'}`} />
            {/* Subtle dot-grid texture on top of video */}
            <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)', backgroundSize: '28px 28px'}} />
            {/* Left accent bar */}
            <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-blue-400/80 rounded-full z-20" />

            <div className="relative z-10 flex flex-col lg:flex-row">

              {/* Left — content */}
              <div className="flex-1 px-10 sm:px-12 lg:px-14 py-12 sm:py-14">

                {/* Section badge — exact same style as other sections */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                    <Store className="w-3 h-3" />
                    Vendor Programme
                  </span>
                  <span className={`flex items-center gap-1.5 text-[11px] font-semibold ${isLight ? 'text-slate-200' : 'text-slate-400'}`}>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Applications open
                  </span>
                </div>

                {/* Headline — same weight/size as other section headings */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight mb-3">
                  Sell on Tech-Hub.<br />
                  <span className="text-blue-400">Reach more customers.</span>
                </h2>

                <p className={`text-sm leading-relaxed mb-8 max-w-[440px] ${isLight ? 'text-slate-100' : 'text-slate-400'}`}>
                  List your products, manage orders, and track earnings — all from a single seller dashboard built for Sri Lanka's growing tech market.
                </p>

                {/* Feature list — clean, icon-led rows matching site style */}
                <div className="space-y-3 mb-9">
                  {[
                    { icon: <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0" />, text: 'No setup fee. Approved and live within 24 hours.' },
                    { icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />, text: 'Payouts every 14 days with full fraud protection.' },
                    { icon: <Activity className="w-3.5 h-3.5 text-blue-400 shrink-0" />, text: 'Smart product recommendations drive your sales.' },
                  ].map((item) => (
                    <div key={item.text} className={`flex items-center gap-3 text-[13px] ${isLight ? 'text-slate-100' : 'text-slate-300'}`}>
                      <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      {item.text}
                    </div>
                  ))}
                </div>

                {/* CTAs — primary matches site's blue button style */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/become-seller"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/25"
                  >
                    <Store className="w-4 h-4" />
                    Start Selling
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/vendors"
                    className={`inline-flex items-center gap-2 border font-semibold text-sm px-5 py-2.5 rounded-xl transition-all ${isLight ? 'border-white/20 bg-slate-900/40 hover:bg-slate-900/55 text-slate-100 hover:text-white' : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.15] text-slate-300 hover:text-white'}`}
                  >
                    View Partners
                  </Link>
                </div>
              </div>

              {/* Divider */}
              <div className={`hidden lg:block w-px my-10 ${isLight ? 'bg-white/20' : 'bg-white/[0.06]'}`} />

              {/* Right — stats in the same dark card style */}
              <div className="hidden lg:flex flex-col justify-center px-12 py-12 gap-6 min-w-[280px]">
                {[
                  { icon: <Store className="w-4 h-4 text-blue-400" />, value: '5,000+', label: 'Active Vendors' },
                  { icon: <ShoppingCart className="w-4 h-4 text-blue-400" />, value: '1M+ Orders', label: 'Processed' },
                  { icon: <Star className="w-4 h-4 text-blue-400 fill-blue-400/30" />, value: '98%', label: 'Seller Satisfaction' },
                  { icon: <ShieldCheck className="w-4 h-4 text-blue-400" />, value: '14-day', label: 'Guaranteed Payout' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isLight ? 'bg-[#0a1020]/85 border border-white/20' : 'bg-[#0a1020] border border-white/[0.07]'}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-base font-extrabold text-white leading-none">{stat.value}</p>
                      <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-200' : 'text-slate-500'}`}>{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. Featured Vendors Section */}
      <section className="relative bg-transparent py-20 border-t border-white/[0.06] overflow-hidden">
        {/* Soft ambient branding glows */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12 relative z-10">
          
          {/* Header */}
          <div className="mb-14 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
                  Featured Ecosystem Partners
                </h3>
                <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                  <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  Ecosystem Hub
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-2.5">
                Explore premium products and official hardware integrations curated directly from our official brand partners.
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0d1527]/70 text-slate-300 px-4 py-2 text-sm font-semibold hover:border-white/[0.2] hover:bg-[#0d1527]/90 hover:text-white transition-all shadow-sm backdrop-blur-md shrink-0 self-start sm:self-center"
            >
              View All Partners
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Mobile Partner Cards */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {featuredPartnerTestimonials.slice(0, 3).map((partner) => (
              <div
                key={`mobile-partner-${partner.id}`}
                className="rounded-2xl border border-white/[0.08] bg-[#0d1527]/70 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={partner.src}
                    alt={partner.name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-white truncate">{partner.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{partner.quote}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-amber-400 font-bold">{partner.rating} ★</span>
                  <Link
                    to="/vendors"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-1.5 transition-colors"
                  >
                    View
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Showcase (desktop/tablet) */}
          <div className="hidden md:flex items-center justify-center w-full min-h-[380px] lg:min-h-[450px] relative">
            <CircularTestimonials
              testimonials={featuredPartnerTestimonials}
              autoplay={true}
              colors={{
                name: theme === 'light' ? '#1d1d1f' : '#ffffff',
                designation: theme === 'light' ? '#3b82f6' : '#60a5fa',
                testimony: theme === 'light' ? '#6e6e73' : '#cbd5e1',
                arrowBackground: theme === 'light' ? '#ffffff' : '#0d1527',
                arrowForeground: theme === 'light' ? '#1d1d1f' : '#ffffff',
                arrowHoverBackground: theme === 'light' ? '#3b82f6' : '#2563eb',
              }}
              fontSizes={{
                name: "30px",
                designation: "14px",
                quote: "18px",
              }}
            />
          </div>
        </div>
      </section>

      {/* 9. Ecosystem Footer */}
      <Footer />

      {/* Global Toast Notification */}
      {toastMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 z-50 border border-slate-800/80"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </motion.div>
      )}

      {/* Startup Offer Popup */}
      <AnimatePresence>
        {showWelcomeOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/55 backdrop-blur-[1px] z-[90] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${isLight ? 'border-slate-200 bg-white' : 'border-white/[0.1] bg-[#0d1527]'}`}
            >
              <button
                onClick={closeWelcomeOffer}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${isLight ? 'border-slate-200 hover:bg-slate-100 text-slate-600' : 'border-white/10 hover:bg-white/10 text-slate-300'}`}
                aria-label="Close offer popup"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.16em] font-black text-rose-400">Welcome Offer</p>
                <h3 className={`text-xl sm:text-2xl font-extrabold mt-1.5 leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Get extra 15% off your first tech setup order
                </h3>
                <p className={`text-sm mt-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Use code <span className="font-black text-blue-400">WELCOME15</span> during checkout. Valid today only.
                </p>

                <div className={`mt-4 rounded-xl border px-3 py-2 ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/[0.08] bg-white/[0.03]'}`}>
                  <p className={`text-[11px] font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Offer applies to desk setup products, stands, lighting, and accessories.
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2.5">
                  <Link
                    to="/category/All?deals=true&sort=rating"
                    onClick={closeWelcomeOffer}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    View Offers
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={closeWelcomeOffer}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${isLight ? 'border-slate-200 text-slate-700 hover:bg-slate-100' : 'border-white/10 text-slate-300 hover:bg-white/10'}`}
                  >
                    Later
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
