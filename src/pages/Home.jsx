import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, animate, AnimatePresence } from 'framer-motion';
import { 
  Search, Heart, ShoppingCart, Bell, MapPin, Truck, 
  Star, Cpu, RotateCcw, HeadphonesIcon, Zap, ChevronDown, ChevronLeft, ChevronRight,
  Mic, Menu, X, CheckCircle2, User, Play,
  ShoppingBag, ShieldCheck, ArrowRight, Brain, Flame, Terminal,
  Check, Activity, Plus, MessageSquare, Award, FileText, ExternalLink, LogOut, Store
} from 'lucide-react';
import { useAiServiceStatus } from '../hooks/useAiServiceStatus';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/AuthModal';
import { Link, useNavigate } from 'react-router-dom';
import { requestJson } from '../services/httpClient';
import { serviceRegistry } from '../config/serviceRegistry';
import { askAiAssistant } from '../services/aiService';
import { Carousel, CarouselContent, CarouselItem } from '../components/ui/carousel';
import { CircularTestimonials } from '../components/ui/circular-testimonials';

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

const TESTIMONIALS_DATA = [
  {
    name: 'Sarah Johnson',
    role: 'Lead Architect',
    location: 'New York, USA',
    rating: 5,
    text: 'Tech-Hub AI made shopping so easy! The AI recommendation engine matched my walnut workspace styling parameters exactly, and delivery was incredibly fast.',
    initials: 'SJ',
    avatarBg: 'bg-blue-500/10 text-blue-600 border-blue-200/40'
  },
  {
    name: 'Michael Chen',
    role: 'Software Engineer',
    location: 'Toronto, Canada',
    rating: 5,
    text: 'Amazing customer experience. I ordered the standing desk setup set, and the returns process for a minor accessory exchange was completely automated and hassle-free.',
    initials: 'MC',
    avatarBg: 'bg-indigo-500/10 text-indigo-600 border-indigo-200/40'
  },
  {
    name: 'Priya Sharma',
    role: 'Product Designer',
    location: 'Mumbai, India',
    rating: 5,
    text: "The absolute best curated workspace marketplace I've used. I love the visual aesthetic categories and buying complete setup bundles saves so much time.",
    initials: 'PS',
    avatarBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/45'
  },
  {
    name: 'David Wilson',
    role: 'DevOps Lead',
    location: 'London, UK',
    rating: 5,
    text: 'Mia, the AI assistant, is insanely smart. She suggested specific monitor mounts matching my desk depth parameters and got everything right on the first try.',
    initials: 'DW',
    avatarBg: 'bg-amber-500/10 text-amber-600 border-amber-200/40'
  }
];

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
    const vendorProds = dbProducts.filter(p => p.vendor && p.vendor.name.toLowerCase().includes(vendor.name.toLowerCase().split(' ')[0]));
    
    if (vendorProds.length === 0) return vendor;
    
    return {
      ...vendor,
      products: vendorProds.slice(0, 3).map(p => ({
        title: p.title,
        price: `LKR ${Number(p.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        spec: p.spec || 'Premium Accessory',
        image: p.image
      }))
    };
  });
};

const HERO_SLIDES = [
  {
    title: (
      <>
        Shop Smarter with <br className="hidden sm:block" />
        <span className="text-blue-600 font-extrabold">AI-Powered</span> <br className="hidden sm:block" />
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
        <span className="text-slate-900 font-extrabold">Matte Black</span> <br className="hidden sm:block" />
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const aiServiceStatus = useAiServiceStatus();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [followedVendors, setFollowedVendors] = useState({});
  const [openDropdownVendor, setOpenDropdownVendor] = useState(null);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);
  const testimonialContainerRef = useRef(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [api, setApi] = useState(null);

  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrentHeroSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const timer = setInterval(() => {
      api.scrollNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [api]);

  const scrollToTestimonial = (idx) => {
    setActiveTestimonialIdx(idx);
    if (testimonialContainerRef.current) {
      const cardWidth = testimonialContainerRef.current.offsetWidth;
      testimonialContainerRef.current.scrollTo({
        left: idx * cardWidth,
        behavior: 'smooth'
      });
    }
  };

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
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Database States
  const [allDbProducts, setAllDbProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const prodData = await requestJson(`${serviceRegistry.catalog}/products`);
        setAllDbProducts(prodData);
      } catch (e) {
        console.error('Failed to load products from database', e);
      }

      try {
        const catData = await requestJson(`${serviceRegistry.catalog}/categories`);
        setDbCategories(catData);
      } catch (e) {
        console.error('Failed to load categories from database', e);
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

  useEffect(() => {
    const closeMenuOnDesktop = () => {
      if (window.innerWidth >= 1280) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', closeMenuOnDesktop);
    return () => window.removeEventListener('resize', closeMenuOnDesktop);
  }, []);

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

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden text-slate-800">
      {/* 1. Top Navbar */}
      <nav className="bg-[#0b1021]/85 backdrop-blur-xl text-white py-2.5 lg:py-3.5 z-50 sticky top-0 w-full border-b border-white/[0.06] shadow-md transition-all duration-300">
        <div className="max-w-[1720px] mx-auto w-full px-4 lg:px-8 2xl:px-12 flex items-center justify-between gap-3 lg:gap-5 xl:gap-7">
          <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <Zap className="text-yellow-400 w-6 h-6 fill-yellow-400" />
              <span className="text-xl font-bold tracking-wide">Tech-Hub</span>
            </div>

            <div className="hidden xl:flex items-center gap-4 2xl:gap-6 text-[13px] font-medium text-slate-300 shrink-0 whitespace-nowrap">
              <a href="#" className="text-white relative">Home<span className="absolute -bottom-4 left-0 w-full h-1 bg-blue-500 rounded-t-md"></span></a>
              <a href="#" className="hover:text-white transition-colors">Categories</a>
              <a href="#" className="hover:text-white transition-colors">Deals</a>
              <a href="#" className="hover:text-white transition-colors">Vendors</a>
              <a href="#" className="hover:text-white transition-colors">AI Assistant</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">About</a>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-[320px] xl:max-w-[390px] 2xl:max-w-[500px] mx-1 xl:mx-3 min-w-[220px]">
            <div className="flex-1 bg-white rounded-md flex items-center overflow-hidden h-10">
              <button className="px-3 text-slate-600 border-r border-slate-200 text-sm font-medium flex items-center gap-1 hover:bg-slate-50 h-full">
                All <ChevronDown className="w-4 h-4" />
              </button>
              <input 
                type="text" 
                placeholder="Search for products, brands and more..." 
                className="flex-1 px-3 text-sm text-slate-800 focus:outline-none"
              />
              <button className="bg-blue-600 h-full px-5 hover:bg-blue-700 transition-colors">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 xl:gap-4 2xl:gap-5 shrink-0">
            <div className="hidden xl:flex flex-col items-center gap-1 cursor-pointer group">
              <Heart className="w-5 h-5 text-slate-300 group-hover:text-white" />
              <span className="text-[10px] text-slate-400 group-hover:text-white font-medium">Wishlist</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer group relative">
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-slate-300 group-hover:text-white" />
                <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-[#0b1021] text-[10px] font-bold px-1.5 rounded-full border border-[#0b1021]">2</span>
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-white font-medium">Cart</span>
            </div>
            <div className="hidden xl:flex flex-col items-center gap-1 cursor-pointer group relative">
              <div className="relative">
                <Bell className="w-5 h-5 text-slate-300 group-hover:text-white" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-3 h-3 flex items-center justify-center rounded-full border border-[#0b1021]"></span>
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-white font-medium">Notifications</span>
            </div>

            {user ? (
              <div className="flex items-center gap-3.5">
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="hidden md:inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-rose-500/20"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}
                {user.role === 'vendor' && (
                  <Link 
                    to="/vendor" 
                    className="hidden md:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-blue-600/20"
                  >
                    <Store className="w-3.5 h-3.5" />
                    Vendor Portal
                  </Link>
                )}

                {/* Profile Avatar trigger */}
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
                          <Link 
                            to="/admin" 
                            className="text-xs text-slate-300 hover:text-white font-bold py-2 flex items-center gap-2 transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <Cpu className="w-3.5 h-3.5 text-rose-500" />
                            Admin Dashboard
                          </Link>
                        )}
                        {user.role === 'vendor' && (
                          <Link 
                            to="/vendor" 
                            className="text-xs text-slate-300 hover:text-white font-bold py-2 flex items-center gap-2 transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
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
                  className="hidden md:inline-block border border-yellow-400/40 text-yellow-400 text-xs sm:text-sm font-semibold px-3 xl:px-4 py-1.5 sm:py-2 rounded-md hover:bg-yellow-400 hover:text-[#0b1021] transition-all whitespace-nowrap"
                >
                  Become Seller
                </button>
                <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-md transition-all whitespace-nowrap shadow-md shadow-blue-600/10 hover:scale-[1.02] flex items-center justify-center"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              className="xl:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/15 text-slate-300 hover:text-white hover:border-white/40 transition-colors"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            className="xl:hidden border-t border-white/10 mt-2 px-4 pt-3 pb-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-medium text-slate-200">
              {['Home', 'Categories', 'Deals', 'Vendors', 'AI Assistant', 'Support', 'About'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Mobile Auth actions */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-md ${user.avatarBg}`}>
                      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">{user.name}</p>
                      <span className="inline-block bg-white/[0.08] text-slate-300 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white text-center text-xs font-extrabold py-2.5 rounded-xl transition-all shadow-md"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {user.role === 'vendor' && (
                      <Link
                        to="/vendor"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center text-xs font-extrabold py-2.5 rounded-xl transition-all shadow-md"
                      >
                        Vendor Portal
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-white/[0.04] hover:bg-white/[0.1] text-rose-400 text-xs font-extrabold py-2.5 rounded-xl transition-all border border-white/5"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-white/[0.04] hover:bg-white/[0.1] text-white text-xs font-extrabold py-2.5 rounded-xl transition-all border border-white/5 text-center flex items-center justify-center"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/10 text-center flex items-center justify-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-3 bg-white rounded-md flex items-center overflow-hidden h-10">
              <button className="px-3 text-slate-600 border-r border-slate-200 text-sm font-medium flex items-center gap-1 hover:bg-slate-50 h-full">
                All <ChevronDown className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 px-3 text-sm text-slate-800 focus:outline-none"
              />
              <button className="bg-blue-600 h-full px-4 hover:bg-blue-700 transition-colors">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* 2. Sub header features */}
      <div className="bg-white border-b border-slate-200 shadow-sm relative z-40 w-full hidden sm:block">
        <div className="max-w-[1440px] mx-auto w-full py-2 lg:py-3 px-4 lg:px-10 flex justify-between items-center text-xs lg:text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-slate-500 text-xs">Deliver to</p>
              <p className="font-semibold text-slate-800 flex items-center gap-1">Sri Lanka <ChevronDown className="w-3 h-3 text-slate-400" /></p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-full"><Truck className="w-4 h-4 text-blue-600" /></div>
            <div>
              <p className="font-semibold text-slate-800">Free Shipping</p>
              <p className="text-slate-500 text-xs text-left">On orders over LKR.50000.00</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 border-l border-r border-slate-200 px-6">
            <div className="bg-blue-50 p-1.5 rounded-full"><Brain className="w-4 h-4 text-blue-600" /></div>
            <div>
              <p className="font-semibold text-slate-800">AI-Powered Recommendations</p>
              <p className="text-slate-500 text-xs text-left">Personalized for you</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-full"><RotateCcw className="w-4 h-4 text-blue-600" /></div>
            <div>
              <p className="font-semibold text-slate-800">Easy Returns</p>
              <p className="text-slate-500 text-xs text-left">30-day return policy</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-full"><HeadphonesIcon className="w-4 h-4 text-blue-600" /></div>
            <div>
              <p className="font-semibold text-slate-800">24/7 AI Support</p>
              <p className="text-slate-500 text-xs text-left">We're here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Hero Section — full-width background, constrained content */}
      <section className="relative w-full overflow-hidden bg-white flex xl:min-h-[calc(100vh-126px)]">
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>

        <main className="relative max-w-[1720px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-8 2xl:px-12 pt-2 sm:pt-4 xl:pt-6 pb-4 sm:pb-6 xl:pb-4 2xl:pb-8 flex flex-col xl:grid xl:grid-cols-[minmax(300px,360px)_minmax(560px,1fr)_minmax(250px,280px)] 2xl:grid-cols-[minmax(360px,430px)_minmax(760px,1fr)_minmax(280px,320px)] items-center xl:items-center justify-start xl:justify-center gap-3 sm:gap-5 xl:gap-5 2xl:gap-10 xl:min-h-[calc(100vh-126px)]">
        
        {/* Left Column - Content */}
        <div className="order-1 w-full xl:w-auto xl:max-w-[390px] 2xl:max-w-[430px] z-20 flex flex-col items-center xl:items-start justify-center shrink-0 text-center xl:text-left mt-2 xl:mt-0 min-h-[380px] sm:min-h-[440px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="flex flex-col items-center xl:items-start w-full text-center xl:text-left"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] 2xl:text-[56px] leading-[1.1] font-bold text-slate-900 mb-2 xl:mb-4 tracking-tight relative z-10">
                {HERO_SLIDES[currentHeroSlide].title}
              </h1>
              
              <p className="text-[13px] sm:text-base text-slate-500 mb-4 xl:mb-6 max-w-[280px] sm:max-w-sm mx-auto xl:mx-0 leading-relaxed relative z-10">
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
              className={`${HERO_SLIDES[currentHeroSlide].accentClass} text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-semibold shadow-lg transition-all active:scale-95 text-xs sm:text-sm whitespace-nowrap flex-1 sm:flex-none`}
            >
              Shop Now
            </button>
            <button
              onClick={() => {
                setAuthModalTab('signup');
                setIsAuthModalOpen(true);
              }}
              className="bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-350 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-semibold shadow-sm transition-all active:scale-95 text-xs sm:text-sm whitespace-nowrap flex-1 sm:flex-none"
            >
              Become Seller
            </button>
          </div>
          
          {/* Stats - 2×2 on mobile, row on xl */}
          <div className="grid grid-cols-2 sm:grid-cols-4 2xl:flex 2xl:items-center pt-3 sm:pt-4 border-t border-slate-200/60 w-full relative z-10 gap-x-2 gap-y-2 sm:gap-4 2xl:gap-0 2xl:divide-x 2xl:divide-slate-200 px-2 sm:px-0 mt-auto">
            <div className="flex items-center gap-2 2xl:gap-2.5 2xl:pr-5 bg-white/50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
              <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg shrink-0"><ShoppingBag className="w-4 h-4" /></div>
              <div>
                <p className="font-bold text-[13px] sm:text-sm text-slate-800 leading-tight"><AnimatedStat target={50} suffix="K+" /></p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Products</p>
              </div>
            </div>
            <div className="flex items-center gap-2 2xl:gap-2.5 2xl:px-5 bg-white/50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
              <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg shrink-0"><User className="w-4 h-4" /></div>
              <div>
                <p className="font-bold text-[13px] sm:text-sm text-slate-800 leading-tight"><AnimatedStat target={5} suffix="K+" /></p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Vendors</p>
              </div>
            </div>
            <div className="flex items-center gap-2 2xl:gap-2.5 2xl:px-5 bg-white/50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
              <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg shrink-0"><Truck className="w-4 h-4" /></div>
              <div>
                <p className="font-bold text-[13px] sm:text-sm text-slate-800 leading-tight"><AnimatedStat target={1} suffix="M+" /></p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Orders</p>
              </div>
            </div>
            <div className="flex items-center gap-2 2xl:gap-2.5 2xl:pl-5 bg-white/50 sm:bg-transparent p-2 sm:p-0 rounded-lg">
              <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg shrink-0"><CheckCircle2 className="w-4 h-4" /></div>
              <div>
                <p className="font-bold text-[13px] sm:text-sm text-slate-800 leading-tight"><AnimatedStat target={98} suffix="%" /></p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium whitespace-nowrap">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Hero Visual & Pedestal */}
        <div className="order-3 xl:order-2 w-full xl:w-auto relative z-10 flex items-center justify-center min-h-[220px] sm:min-h-[300px] md:min-h-[380px] lg:min-h-[460px] xl:min-h-[500px] 2xl:min-h-[660px] mt-1 sm:mt-2 xl:mt-0 select-none">
          <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/22 blur-[55px] pointer-events-none sm:h-[360px] sm:w-[360px] sm:blur-[80px] xl:h-[440px] xl:w-[440px] xl:blur-[100px]"></div>
          <div className="absolute left-1/2 top-[48%] h-[180px] w-[82%] max-w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(191,219,254,0.85)_0%,rgba(219,234,254,0.45)_42%,rgba(238,242,248,0)_74%)] pointer-events-none sm:h-[220px] xl:h-[280px]"></div>
          <div className="absolute left-1/2 bottom-[8%] h-[120px] w-[72%] max-w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(96,165,250,0.22)_0%,rgba(191,219,254,0.12)_48%,rgba(238,242,248,0)_76%)] blur-[18px] pointer-events-none"></div>
          
          {/* ── Circular ring pattern ── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden 2xl:overflow-visible">
            {[620, 520, 420, 320, 220].map((size, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-blue-300/25 hidden sm:block"
                style={{ width: size, height: size }}
              />
            ))}
            {[240, 170, 110].map((size, i) => (
              <div
                key={`mobile-${i}`}
                className="absolute rounded-full border border-blue-300/25 sm:hidden"
                style={{ width: size, height: size }}
              />
            ))}
            {/* Radial dot grid */}
            <svg className="absolute w-[300px] h-[300px] sm:w-[520px] sm:h-[520px] xl:w-[580px] xl:h-[580px] opacity-[0.12] hidden sm:block" viewBox="0 0 480 480">
              {Array.from({ length: 10 }).map((_, row) =>
                Array.from({ length: 10 }).map((_, col) => (
                  <circle
                    key={`${row}-${col}`}
                    cx={col * 48 + 24}
                    cy={row * 48 + 24}
                    r="2"
                    fill="#3b82f6"
                  />
                ))
              )}
            </svg>
            
            {/* Central glow dynamically styled */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHeroSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className={`absolute w-[230px] sm:w-[360px] xl:w-[400px] h-[230px] sm:h-[360px] xl:h-[400px] ${HERO_SLIDES[currentHeroSlide].glowColor} rounded-full blur-[40px] sm:blur-[60px]`}
              />
            </AnimatePresence>
          </div>

          {/* Pedestal Base ellipse */}
          <div className="absolute bottom-[2%] sm:bottom-[8%] left-1/2 -translate-x-1/2 w-[88%] sm:w-[78%] xl:w-[74%] h-6 sm:h-10 bg-blue-300/20 rounded-full blur-[15px] sm:blur-[20px] pointer-events-none z-0"></div>

          {/* Main Hero Image Carousel */}
          <Carousel setApi={setApi} className="w-[90%] max-w-[320px] sm:max-w-[450px] md:max-w-[620px] lg:max-w-[720px] xl:max-w-[760px] 2xl:max-w-[980px] h-[190px] sm:h-[260px] md:h-[360px] lg:h-[440px] xl:h-[500px] 2xl:h-[600px] relative z-10 -mt-2 2xl:-mt-6 flex items-center justify-center" opts={{ loop: true }}>
            <CarouselContent className="-ml-0 h-full">
              {HERO_SLIDES.map((slide, idx) => (
                <CarouselItem key={idx} className="pl-0 flex items-center justify-center h-full">
                  <img 
                    src={slide.image} 
                    alt="Workspace Theme Showcase" 
                    className="max-h-full max-w-full object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Slide Specific Floating Elements (Placed outside Carousel to avoid clipping) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Floating Element 1: AI Picks */}
              <FloatingElement className="hidden xl:block absolute top-[8%] left-[2%] 2xl:left-[6%] z-20 xl:scale-90 2xl:scale-100 origin-top-left" delay={0.2} yOffset={10}>
                <div className="bg-white/95 backdrop-blur-xl border border-white/80 p-3 rounded-2xl shadow-xl flex flex-col gap-2 w-48 2xl:w-56">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-600">{HERO_SLIDES[currentHeroSlide].floaters.aiPicks.title}</span>
                    <X className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                  </div>
                  <p className="text-[9px] text-slate-400 -mt-1">Handpicked match</p>
                  <div className="flex gap-2 mt-0.5">
                    <div className="bg-slate-50 rounded-xl flex-1 h-14 overflow-hidden border border-slate-100">
                      <img src={HERO_SLIDES[currentHeroSlide].floaters.aiPicks.p1} className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-slate-50 rounded-xl flex-1 h-14 overflow-hidden border border-slate-100">
                      <img src={HERO_SLIDES[currentHeroSlide].floaters.aiPicks.p2} className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-slate-50 rounded-xl flex-1 h-14 overflow-hidden border border-slate-100">
                      <img src={HERO_SLIDES[currentHeroSlide].floaters.aiPicks.p3} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </FloatingElement>

              {/* Floating Element 2: Deal of the Day */}
              <FloatingElement className="hidden xl:block absolute bottom-[20%] left-[1%] 2xl:left-[5%] z-20 xl:scale-90 2xl:scale-100 origin-bottom-left" delay={0.4} yOffset={12}>
                <div className={`bg-gradient-to-br ${HERO_SLIDES[currentHeroSlide].floaters.deal.gradient} p-4 rounded-[1.25rem] shadow-xl text-white text-left max-w-[124px] 2xl:max-w-[140px] transform hover:-translate-y-1 transition-transform border`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block backdrop-blur-sm truncate max-w-[90px]">{HERO_SLIDES[currentHeroSlide].floaters.deal.label}</span>
                    <X className="w-3.5 h-3.5 text-white/80 cursor-pointer -mr-1" />
                  </div>
                  <p className="text-[10px] text-white/90 mt-2 font-medium">Up to</p>
                  <p className="text-3xl font-black leading-none my-1 tracking-tight drop-shadow-sm pb-1">{HERO_SLIDES[currentHeroSlide].floaters.deal.off}</p>
                  <p className="text-[9px] text-white/80 font-medium bg-black/10 px-2 py-0.5 rounded-full w-fit mt-1">{HERO_SLIDES[currentHeroSlide].floaters.deal.desc}</p>
                </div>
              </FloatingElement>

              {/* Floating Element 3: Live Order Tracking */}
              <FloatingElement className="hidden xl:block absolute top-[9%] right-[2%] 2xl:right-[6%] z-20 xl:scale-90 2xl:scale-100 origin-top-right" delay={0.6} yOffset={10}>
                <div className="bg-emerald-400/95 backdrop-blur-xl p-3.5 rounded-[1.25rem] shadow-xl shadow-emerald-500/20 text-white w-48 2xl:w-56 border border-white/10">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      {HERO_SLIDES[currentHeroSlide].floaters.track.title}
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-white inline-block"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                      />
                    </span>
                    <X className="w-3.5 h-3.5 text-white/80 cursor-pointer" />
                  </div>
                  <p className="text-[9px] text-emerald-50 font-medium mb-1 tracking-wide">{HERO_SLIDES[currentHeroSlide].floaters.track.order}</p>
                  <div className="flex justify-between items-center mb-2 mt-1.5 bg-black/10 p-1.5 rounded-lg">
                    <p className="text-[11px] font-bold">{HERO_SLIDES[currentHeroSlide].floaters.track.status}</p>
                    <motion.div
                      className="bg-white/25 p-1 rounded-full"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    >
                      <Truck className="w-3 h-3 text-white" />
                    </motion.div>
                  </div>
                  <p className="text-[9px] text-emerald-100 font-semibold mb-1.5">{HERO_SLIDES[currentHeroSlide].floaters.track.time}</p>
                  <div className="relative h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                      initial={{ width: '0%' }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </FloatingElement>

              {/* Floating Element 4: Fast Delivery */}
              <FloatingElement className="hidden xl:block absolute bottom-[17%] right-[1%] 2xl:right-[5%] z-20 xl:scale-90 2xl:scale-100 origin-bottom-right" delay={0.8} yOffset={14}>
                <div className={`bg-gradient-to-r ${HERO_SLIDES[currentHeroSlide].floaters.delivery.gradient} p-3.5 rounded-[1.25rem] shadow-xl text-white flex flex-col transform hover:-translate-y-1 transition-transform border backdrop-blur-md`}>
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-90 inline-block mb-1 bg-black/10 px-2 py-0.5 rounded-full w-fit">{HERO_SLIDES[currentHeroSlide].floaters.delivery.title}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-xl font-black tracking-tight drop-shadow-sm">{HERO_SLIDES[currentHeroSlide].floaters.delivery.time}</p>
                    <Truck className="w-5 h-5 opacity-95 ml-1" />
                  </div>
                  <p className="text-[9px] bg-black/20 font-medium rounded-full px-2 py-0.5 w-fit mt-1.5 border border-white/10">{HERO_SLIDES[currentHeroSlide].floaters.delivery.desc}</p>
                </div>
              </FloatingElement>
            </motion.div>
          </AnimatePresence>

          {/* Left/Right Navigation Arrows */}
          <button
            onClick={() => api?.scrollPrev()}
            className="absolute left-2 sm:left-4 z-30 w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-slate-200 flex items-center justify-center shadow-md active:scale-95 transition-all text-slate-700 hover:text-slate-900 focus:outline-none top-1/2 -translate-y-1/2"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => api?.scrollNext()}
            className="absolute right-2 sm:right-4 z-30 w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-slate-200 flex items-center justify-center shadow-md active:scale-95 transition-all text-slate-700 hover:text-slate-900 focus:outline-none top-1/2 -translate-y-1/2"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom Dot indicators */}
          <div className="absolute bottom-[2%] sm:bottom-[8%] left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-slate-950/10 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200/10">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => api?.scrollTo(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentHeroSlide === idx ? 'bg-blue-600 w-6' : 'bg-slate-400 hover:bg-slate-600'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Voice Assistant Card */}
        <div className="order-2 xl:hidden w-full max-w-[560px] mt-2 mb-1 relative z-20">
          <div className="rounded-[28px] p-[1.5px] bg-[conic-gradient(from_0deg_at_50%_50%,#1e40af_0%,#3b82f6_35%,#0ea5e9_65%,#1e40af_100%)] shadow-[0_20px_45px_rgba(30,64,175,0.25)]">
            <div className="rounded-[27px] bg-gradient-to-b from-[#101d3f] via-[#13295f] to-[#1a2d62] px-4 py-4 sm:px-5 sm:py-5 text-white flex flex-col justify-between min-h-[250px]">
              
              {isChatActive ? (
                <>
                  {/* Header */}
                  <div className="w-full flex justify-between items-center text-white pb-2.5 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                        <Brain className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-extrabold text-xs">Mia Chat Assistant</p>
                        <p className="text-[8px] text-emerald-400 font-bold leading-none">ACTIVE</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsChatActive(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Chat Messages Log */}
                  <div className="flex-1 w-full overflow-y-auto my-3 pr-1 space-y-2.5 text-left text-xs text-white max-h-[220px]">
                    {chatMessages.map((msg, mIdx) => (
                      <div key={mIdx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-2.5 rounded-2xl max-w-[90%] leading-relaxed ${
                          msg.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white/10 text-slate-100 rounded-tl-none border border-white/5'
                        }`}>
                          {msg.text}
                        </div>
                        
                        {msg.recommendations && msg.recommendations.length > 0 && (
                          <div className="w-full mt-2 space-y-2">
                            {msg.recommendations.map(p => (
                              <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-2 flex items-center gap-2">
                                <img src={p.image} className="w-8 h-8 rounded bg-white p-0.5 object-contain shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-[10px] text-white truncate">{p.title}</p>
                                  <p className="text-[9px] text-blue-400">LKR {Number(p.price).toLocaleString()}</p>
                                </div>
                                <button
                                  onClick={() => {
                                    if (p.vibe) {
                                      handleVibeChange(p.vibe);
                                    }
                                    showToast(`Added ${p.title} to setup!`);
                                  }}
                                  className="p-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold"
                                >
                                  Add
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isChatTyping && (
                      <div className="flex items-center gap-1.5 text-slate-400 italic pl-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-75" />
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-150" />
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <form 
                    onSubmit={handleSendChatMessage}
                    className="w-full flex items-center bg-white/5 border border-white/10 p-1 rounded-xl focus-within:border-blue-500/50"
                  >
                    <input 
                      type="text"
                      placeholder="Type your message..."
                      value={chatMessageInput}
                      onChange={(e) => setChatMessageInput(e.target.value)}
                      className="flex-1 bg-transparent border-0 text-white text-xs px-2.5 py-1.5 focus:ring-0 focus:outline-none placeholder-slate-500"
                    />
                    <button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md"
                    >
                      Send
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Voice Shop Assistant</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${aiServiceStatus.indicatorClass}`}></span>
                        <span className="text-[11px] text-slate-300">{aiServiceStatus.label}</span>
                      </div>
                    </div>
                    <Cpu className="w-4 h-4 text-blue-200" />
                  </div>

                  <div className="mt-4 flex items-center gap-3 sm:gap-4">
                    <div className="w-[90px] h-[90px] sm:w-[96px] sm:h-[96px] rounded-2xl bg-gradient-to-b from-[#2a3f78] to-[#1a2f64] border border-white/10 overflow-hidden shrink-0 shadow-[0_10px_20px_rgba(15,23,42,0.35)]">
                      <img
                        src="https://res.cloudinary.com/ddarldtbb/image/upload/v1779814719/i_need_this_girl_alone_202605262138-removebg-preview_czgnx1.png"
                        alt="AI assistant avatar"
                        className="w-full h-full object-cover scale-[1.15]"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[13px] text-slate-100 leading-relaxed">Hi, I am Mia. I can find best deals and compare products instantly.</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] px-2 py-1 rounded-full bg-blue-500/20 border border-blue-300/25">Deals</span>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-blue-500/20 border border-blue-300/25">Compare</span>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-blue-500/20 border border-blue-300/25">Tracking</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-[3px] h-9">
                    {[35, 55, 25, 80, 45, 95, 100, 70, 45, 85, 50, 75, 30, 55, 40].map((h, i) => (
                      <VisualizerBar key={`mobile-viz-${i}`} baseHeight={h} delay={i * 0.08} />
                    ))}
                  </div>

                  <div className="mt-2 flex items-center justify-center">
                    <motion.button
                      onClick={() => setIsChatActive(true)}
                      whileTap={{ scale: 0.95 }}
                      className="relative w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.6)]"
                    >
                      <Mic className="text-white w-6 h-6" />
                    </motion.button>
                  </div>
                  <p className="text-center text-[11px] text-blue-100 font-medium mt-1">Tap to speak</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Voice Panel with Magic Animated Border */}
        <div className="order-4 xl:order-3 hidden xl:flex shrink-0 self-center w-[276px] 2xl:w-[308px] h-[470px] 2xl:h-[540px] rounded-[32px] shadow-2xl relative overflow-hidden z-20 xl:mt-0">

          {/* Spinning conic gradient creates the glowing border — clipped to panel bounds by overflow-hidden */}
          <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,#3b82f6_40%,#818cf8_50%,transparent_60%)] animate-spin-slow"></div>

          {/* Inner panel — 1.5px inset reveals the spinning border edge */}
          <div className="absolute inset-[1.5px] bg-gradient-to-b from-[#0e1732] to-[#16234b] rounded-[30px] overflow-hidden flex flex-col items-center justify-between py-5 2xl:py-7 px-5 2xl:px-6">

            {/* Glow blobs */}
            <div className="absolute bottom-[-10%] right-[-20%] w-64 h-64 bg-blue-600/20 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute top-[20%] left-[-20%] w-40 h-40 bg-indigo-500/20 rounded-full blur-[40px] pointer-events-none"></div>

            {isChatActive ? (
              <>
                {/* Header */}
                <div className="w-full flex justify-between items-center text-white relative z-10 border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                      <Brain className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs">Mia Chat Assistant</p>
                      <p className="text-[8px] text-emerald-400 font-bold leading-none">ACTIVE</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsChatActive(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Chat Messages Log */}
                <div className="flex-1 w-full overflow-y-auto my-3 pr-1 space-y-2.5 text-left text-xs text-white relative z-10 scrollbar-thin scrollbar-thumb-blue-600/30">
                  {chatMessages.map((msg, mIdx) => (
                    <div key={mIdx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-2.5 rounded-2xl max-w-[90%] leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white/10 text-slate-100 rounded-tl-none border border-white/5'
                      }`}>
                        {msg.text}
                      </div>
                      
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="w-full mt-2 space-y-2">
                          {msg.recommendations.map(p => (
                            <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-2 flex items-center gap-2">
                              <img src={p.image} className="w-8 h-8 rounded bg-white p-0.5 object-contain shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-[10px] text-white truncate">{p.title}</p>
                                <p className="text-[9px] text-blue-400">LKR {Number(p.price).toLocaleString()}</p>
                              </div>
                              <button
                                onClick={() => {
                                  if (p.vibe) {
                                    handleVibeChange(p.vibe);
                                  }
                                  showToast(`Added ${p.title} to setup!`);
                                }}
                                className="p-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold"
                              >
                                Add
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isChatTyping && (
                    <div className="flex items-center gap-1.5 text-slate-400 italic pl-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-75" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-150" />
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <form 
                  onSubmit={handleSendChatMessage}
                  className="w-full flex items-center bg-white/5 border border-white/10 p-1 rounded-xl focus-within:border-blue-500/50 relative z-10"
                >
                  <input 
                    type="text"
                    placeholder="Type your message..."
                    value={chatMessageInput}
                    onChange={(e) => setChatMessageInput(e.target.value)}
                    className="flex-1 bg-transparent border-0 text-white text-xs px-2.5 py-1.5 focus:ring-0 focus:outline-none placeholder-slate-500"
                  />
                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md"
                  >
                    Send
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* Header */}
                <div className="w-full flex justify-between items-center text-white relative z-10">
                  <div>
                    <p className="font-semibold text-sm">Voice Shop Assistant</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${aiServiceStatus.indicatorClass}`}></span>
                      <span className="text-[11px] text-slate-400">{aiServiceStatus.label}</span>
                    </div>
                  </div>
                  <X className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                </div>

                {/* Avatar + visualizer + message */}
                <div className="flex-1 flex flex-col items-center justify-center gap-3 w-full relative z-10">
                  <div className="absolute inset-x-4 top-[12%] h-24 bg-blue-500/15 blur-2xl pointer-events-none"></div>

                  <motion.div
                    className="relative mt-1"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  >
                    <motion.div
                      className="absolute -inset-1 rounded-[30px] bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-indigo-400/20 blur-md"
                      animate={{ opacity: [0.45, 0.85, 0.45], scale: [0.98, 1.02, 0.98] }}
                      transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                    />

                    <motion.div
                      className="absolute inset-0 rounded-[28px] border border-blue-300/40"
                      animate={{
                        boxShadow: [
                          "0 0 0 rgba(59,130,246,0.1)",
                          "0 0 20px rgba(59,130,246,0.35)",
                          "0 0 0 rgba(59,130,246,0.1)",
                        ],
                      }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    />

                    <div className="relative w-[136px] 2xl:w-[176px] h-[136px] 2xl:h-[176px] rounded-[24px] 2xl:rounded-[28px] bg-gradient-to-b from-[#21366d]/90 via-[#1a2c5e]/95 to-[#13224a] border border-white/10 overflow-hidden flex items-end justify-center shadow-[0_20px_40px_rgba(2,6,23,0.45)]">
                      <img
                        src="https://res.cloudinary.com/ddarldtbb/image/upload/v1779814719/i_need_this_girl_alone_202605262138-removebg-preview_czgnx1.png"
                        alt="AI assistant avatar"
                        className="w-[124%] h-[124%] object-contain -mb-1 2xl:-mb-2 drop-shadow-[0_12px_26px_rgba(59,130,246,0.45)]"
                      />
                    </div>

                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 2xl:px-3 py-1 rounded-full bg-blue-500/20 border border-blue-300/30 backdrop-blur-md whitespace-nowrap flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-blue-200" />
                      <p className="text-[9px] 2xl:text-[10px] font-semibold text-blue-100 tracking-wide">Mia • Smart Concierge</p>
                    </div>
                  </motion.div>

                  <div className="flex items-center gap-[3px] h-9 2xl:h-11 w-full justify-center px-2 2xl:px-3 opacity-90 mt-1">
                    {[35, 55, 25, 80, 45, 95, 100, 70, 45, 85, 50, 75, 30, 55, 40].map((h, i) => (
                      <VisualizerBar key={i} baseHeight={h} delay={i * 0.08} />
                    ))}
                  </div>

                  <p className="text-[11px] 2xl:text-xs text-slate-200 font-medium leading-relaxed text-center px-2">Ask for deals, specs, and best product match.</p>

                  <div className="flex items-center justify-center gap-1.5 text-[9px] 2xl:text-[10px] text-blue-100">
                    <span className="px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/10">Deals</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/10">Compare</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/10">Track</span>
                  </div>
                </div>

                {/* Animated Mic Button */}
                <div className="flex flex-col items-center gap-1.5 relative z-10 pb-0.5">
                  <div className="relative flex items-center justify-center w-full">
                    <div className="absolute w-24 h-12 2xl:w-36 2xl:h-16 rounded-full bg-blue-500/15 blur-xl"></div>

                    <motion.div
                      className="absolute w-14 h-14 2xl:w-20 2xl:h-20 rounded-full border border-blue-400/30"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0 }}
                    />

                    <motion.div
                      className="absolute w-14 h-14 2xl:w-20 2xl:h-20 rounded-full border border-blue-400/20"
                      animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
                    />

                    <motion.div
                      className="absolute w-12 h-12 2xl:w-16 2xl:h-16 rounded-full border-2 border-blue-500/50"
                      animate={{ scale: [1, 1.15, 1], opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    />

                    <motion.button
                      onClick={() => setIsChatActive(true)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative w-11 h-11 2xl:w-14 2xl:h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.65)]"
                    >
                      <Mic className="text-white w-4 h-4 2xl:w-6 2xl:h-6" />
                    </motion.button>
                  </div>

                  <p className="text-blue-100 text-[10px] 2xl:text-[11px] font-semibold tracking-wide">Tap to speak</p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      </section>

      {/* 4. Categories + Flash Deals Section */}
      <section className="relative bg-white overflow-hidden pt-4 sm:pt-5 pb-10 sm:pb-12 border-t border-slate-200/80">
        <div className="relative max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12">
          <div className="mb-3 flex items-center justify-end">
            <Link
              to="/category/All"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
            >
              View More Categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="grid min-w-max grid-flow-col auto-cols-[140px] sm:auto-cols-[152px] lg:auto-cols-[164px]">
                {(dbCategories.length > 0 ? dbCategories : curatedCategories).map((category, index) => (
                  <Link
                    key={category.name}
                    to={`/category/${encodeURIComponent(category.name)}`}
                    className="block"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                      whileHover={{ y: -2 }}
                      className="group px-3 sm:px-3.5 py-2 text-center border-r border-slate-300/80 last:border-r-0 cursor-pointer"
                    >
                      <div className="h-[112px] sm:h-[124px] w-full rounded-xl bg-white/80 p-2 flex items-center justify-center shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="max-h-full max-w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                        />
                      </div>
                      <p className="mt-3 text-[12px] sm:text-[13px] font-semibold leading-tight text-slate-900">{category.name}</p>
                    </motion.div>
                  </Link>
                ))}

                <Link to="/category/All" className="inline-block">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.35, delay: 0.38 }}
                    whileHover={{ y: -2 }}
                    className="px-3 py-2 text-center cursor-pointer"
                  >
                    <div className="h-[112px] sm:h-[124px] w-full flex items-center justify-center">
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg shadow-black/20">
                        <ArrowRight className="h-7 w-7" />
                      </span>
                    </div>
                    <p className="mt-3 text-[12px] sm:text-[13px] font-semibold text-slate-900">More Categories</p>
                  </motion.div>
                </Link>
              </div>
          </div>

          <div className="mt-6 p-1 sm:p-0">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[26px] leading-none font-bold text-slate-900">
                  Today's Flash Deals
                </h3>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500">
                  {["05", "42", "18"].map((unit) => (
                    <span key={unit} className="rounded-md border border-rose-100 bg-rose-50 px-2 py-1 leading-none">{unit}</span>
                  ))}
                </div>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
              >
                View All Deals
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
              {(allDbProducts.length > 0 ? compileDeals(allDbProducts) : flashDeals).map((deal, index) => (
                <motion.article
                  key={deal.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.22 }}
                  transition={{ duration: 0.42, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/88 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm flex flex-col justify-between"
                >
                  <Link to={`/product/${deal.id}`} className="block">
                    <div className="absolute left-3 top-3 rounded-md bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white z-10">
                      {deal.discount}
                    </div>

                    <div className="h-44 rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-2 flex items-center justify-center">
                      <img src={deal.image} alt={deal.title} className="max-h-full max-w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-105" />
                    </div>

                    <h4 className="mt-2.5 text-[12px] font-semibold leading-snug text-slate-800 min-h-[38px] group-hover:text-blue-600 transition-colors">{deal.title}</h4>

                    <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                      <span className="font-semibold text-slate-700">{deal.rating}</span>
                      <span className="text-slate-400">({deal.live})</span>
                    </div>

                    <div className="mt-2 flex items-end gap-2 pb-1">
                      <p className="text-base font-extrabold text-rose-600">{deal.price}</p>
                      <p className="pb-0.5 text-[11px] text-slate-400 line-through">{deal.oldPrice}</p>
                    </div>
                  </Link>

                  <div className="mt-2.5 flex gap-2 relative z-10">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showToast(`"${deal.title}" added to setup!`);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-blue-100 bg-blue-50 px-2 py-2 text-[11px] font-bold text-blue-700 transition-colors hover:bg-blue-600 hover:text-white shadow-sm"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Quick add
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showToast("Added to wishlist!");
                      }}
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-colors"
                    >
                      <Heart className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/45 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs sm:text-sm text-slate-600">
                312 deals were updated in the last hour. Prices can shift in real-time.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
              >
                See all live deals
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Curate Your Workspace — Setup Curation Hub */}
      <section id="curation-hub" className="relative bg-white pb-16 pt-12 border-t border-slate-200/80">
        
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[450px] h-[450px] bg-indigo-400/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12 relative z-10">
          
          {/* Header */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5 tracking-tight">
                Curate Your Workspace
              </h3>
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200/80 px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                <Brain className="w-3.5 h-3.5 text-blue-600" />
                Concierge picks
              </span>
            </div>
            <span className="h-6 w-[1px] bg-slate-300 hidden sm:block"></span>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              Pick a theme below and watch our desk stylists handpick the perfect gear for your setup.
            </p>
          </div>

          {/* 5-Column Grid Layout: Beautiful cover image cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            
            {/* Card 1: Recently Viewed */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: 0.05 }}
              className="bg-white rounded-3xl border border-slate-200/60 p-4 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[540px] group overflow-hidden"
            >
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">Your Activity</span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">Recently Viewed</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-3 leading-snug">Still thinking about this?</h4>
                </div>

                <div className="my-2 relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50/60 p-2 flex flex-col items-center justify-center">
                  <div className="h-48 w-full rounded-xl overflow-hidden bg-white border border-slate-200/50 flex items-center justify-center relative">
                    <img src={activeVibe.recentlyViewed.image} alt={activeVibe.recentlyViewed.title} className="max-h-full max-w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute bottom-2 left-2 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-sm">
                      {activeVibe.recentlyViewed.timeText}
                    </span>
                  </div>
                  <div className="w-full mt-3 text-left">
                    <p className="text-[9px] font-bold text-slate-400 leading-none uppercase tracking-wider">{activeVibe.recentlyViewed.category}</p>
                    <h5 className="text-[13px] font-bold text-slate-800 truncate mt-1">{activeVibe.recentlyViewed.title}</h5>
                    <p className="text-[13px] font-black text-blue-600 mt-0.5">{activeVibe.recentlyViewed.price}</p>
                  </div>
                </div>

                <div className="mt-2 bg-blue-50/40 border border-blue-100/50 rounded-xl p-2.5 text-[10px] text-slate-500 italic leading-relaxed">
                  "You viewed this item recently. It complements your current {activeVibe.name} space configuration perfectly."
                </div>
              </div>

              <button className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                View Specs
              </button>
            </motion.div>

            {/* Card 2: Handpicked For You */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: 0.1 }}
              className="bg-white rounded-3xl border border-slate-200/60 p-4 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[540px] group overflow-hidden"
            >
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">Stylist's Selection</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                      <Zap className="w-2.5 h-2.5 fill-indigo-100 text-indigo-600" />
                      Handpicked For You
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-3 leading-snug">Matches your aesthetic vibe</h4>
                </div>

                <div className="my-2 relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50/60 p-2 flex flex-col items-center justify-center">
                  <div className="h-48 w-full rounded-xl overflow-hidden bg-white border border-slate-200/50 flex items-center justify-center">
                    <img src={activeVibe.handpicked.image} alt={activeVibe.handpicked.title} className="max-h-full max-w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="w-full mt-3 text-left">
                    <h5 className="text-[13px] font-bold text-slate-800 truncate">{activeVibe.handpicked.title}</h5>
                    <p className="text-[13px] font-black text-indigo-600 mt-0.5">{activeVibe.handpicked.price}</p>
                  </div>
                </div>

                <div className="mt-2 bg-indigo-50/30 border border-indigo-100/50 rounded-xl p-2.5 text-[10px] text-slate-600 leading-relaxed">
                  <strong>Stylist Tip:</strong> {activeVibe.handpicked.tip}
                </div>
              </div>

              <button className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border border-indigo-100 bg-indigo-50/50 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors">
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </button>
            </motion.div>

            {/* Card 3: Frequently Bought Together */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: 0.15 }}
              className="bg-white rounded-3xl border border-slate-200/60 p-4 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[540px] group overflow-hidden"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">Workspace Set</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">Perfect Desk Bundle</span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mb-2.5 leading-snug">Bundle setup and save 15%</h4>
                
                {/* Connected list of items */}
                <div className="space-y-2 relative">
                  {currentBundleItems.map((item) => {
                    const isChecked = selectedBundleItems.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                          isChecked 
                            ? 'border-amber-400/40 bg-amber-50/30' 
                            : 'border-slate-100 opacity-60 hover:opacity-85'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h5 className="text-[11px] font-bold text-slate-800 truncate leading-tight">{item.title}</h5>
                          <p className="text-[10px] font-semibold text-slate-500 mt-0.5">LKR {item.price.toLocaleString()}</p>
                        </div>

                        <button
                          onClick={() => handleToggleBundleItem(item.id)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                            isChecked 
                              ? 'bg-amber-500 border-amber-400 text-white' 
                              : 'border-slate-300 bg-white hover:border-slate-400'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Details */}
              <div className="mt-2 bg-slate-50 border border-slate-100 rounded-2xl p-2.5">
                <div className="space-y-1 text-[10px] font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>Items Checked ({selectedBundleItems.length}):</span>
                    <span>LKR {rawBundleTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Desk Set Discount (15%):</span>
                    <span>- LKR {bundleSavings.toLocaleString()}</span>
                  </div>
                  <hr className="border-slate-200 my-1" />
                  <div className="flex justify-between items-end text-slate-800">
                    <span className="font-extrabold">Total Setup Price:</span>
                    <span className="text-[13px] font-black text-slate-900 leading-none">
                      LKR {bundleFinalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  disabled={selectedBundleItems.length === 0}
                  onClick={handleBuyBundle}
                  className={`w-full mt-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isBundleAdded
                      ? 'bg-emerald-600 text-white'
                      : selectedBundleItems.length === 0
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200/80'
                        : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-98 shadow-sm'
                  }`}
                >
                  {isBundleAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Bundle Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Buy Setup Set
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Card 4: Trending Now */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: 0.2 }}
              className="bg-white rounded-3xl border border-slate-200/60 p-4 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[540px] group overflow-hidden"
            >
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">Trending Choice</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">
                      <Flame className="w-3 h-3 fill-rose-500 text-rose-500 animate-pulse" />
                      Trending Setup Item
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-3 leading-snug">Popular in this setup style</h4>
                </div>

                <div className="my-2 relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50/60 p-2 flex flex-col items-center justify-center">
                  <div className="h-48 w-full rounded-xl overflow-hidden bg-white border border-slate-200/50 flex items-center justify-center">
                    <img src={activeVibe.trending.image} alt={activeVibe.trending.title} className="max-h-full max-w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="w-full mt-3 text-left">
                    <h5 className="text-[13px] font-bold text-slate-800 truncate">{activeVibe.trending.title}</h5>
                    <p className="text-[13px] font-black text-rose-600 mt-0.5">{activeVibe.trending.price}</p>
                  </div>
                </div>

                <div className="mt-2 bg-rose-50/30 border border-rose-100/50 rounded-xl p-2.5 text-[10px] text-slate-600 leading-relaxed flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{activeVibe.trending.socialText}</span>
                </div>
              </div>

              <button className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                Quick Look
              </button>
            </motion.div>

            {/* Card 5: Vibe Selector */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: 0.25 }}
              className="rounded-3xl relative overflow-hidden bg-gradient-to-b from-blue-50/30 via-white to-white text-slate-800 p-4 shadow-[0_4px_24px_rgba(37,99,235,0.03)] border border-blue-100 flex flex-col justify-between h-[540px]"
            >
              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 w-full flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500/10 p-1.5 rounded-lg border border-blue-500/20">
                        <Brain className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs tracking-wide text-slate-800">Workspace Stylist</h4>
                        <p className="text-[9px] text-slate-500">Interactive Curation</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span className="text-[8px] font-bold text-emerald-600 tracking-wider">ACTIVE</span>
                    </div>
                  </div>

                  <p className="text-[11.5px] text-slate-500 leading-normal my-2.5">
                    Pick your preferred setup theme. Our visual catalog will automatically filter and update setup items in real-time.
                  </p>

                  {/* Curation Buttons */}
                  <div className="space-y-2 mt-3">
                    {[
                      { id: 'walnut', name: '🌿 Walnut & Organic' },
                      { id: 'minimalist', name: '☁️ Cream Minimalist' },
                      { id: 'black', name: '🖤 Stealth Matte Black' },
                      { id: 'cyberpunk', name: '🌈 Cyberpunk RGB' }
                    ].map((theme) => {
                      const isSelected = workspaceVibe === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => handleVibeChange(theme.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.2)]'
                              : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-xs font-bold">{theme.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Styled explanation box */}
                <div className="mt-4 bg-slate-50 border border-slate-100 rounded-2xl p-3 text-[10px] text-slate-500 leading-normal min-h-[96px] flex items-center">
                  {isCurationLoading ? (
                    <span className="text-slate-400 italic animate-pulse w-full text-center">Loading setup options...</span>
                  ) : (
                    <span>{activeVibe.description}</span>
                  )}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 6. Featured Vendors Section */}
      <section className="relative bg-white py-20 border-t border-slate-200/80 overflow-hidden">
        {/* Soft ambient branding glows */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12 relative z-10">
          
          {/* Header */}
          <div className="mb-14 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5 tracking-tight">
                  Featured Ecosystem Partners
                </h3>
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200/80 px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                  <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                  Ecosystem Hub
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2.5">
                Explore premium products and official hardware integrations curated directly from our official brand partners.
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 shrink-0 self-start sm:self-center"
            >
              View All Partners
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Testimonial Showcase */}
          <div className="flex items-center justify-center w-full min-h-[450px] relative">
            <CircularTestimonials
              testimonials={compileVendorsData(VENDORS_DATA, allDbProducts).map(vendor => {
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
              })}
              autoplay={true}
              colors={{
                name: "#0f172a", // slate-900
                designation: "#2563eb", // blue-600
                testimony: "#334155", // slate-700
                arrowBackground: "#0f172a", // slate-900
                arrowForeground: "#ffffff", // white
                arrowHoverBackground: "#2563eb", // blue-600
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


      {/* 7. Why Shop with Tech-Hub AI Values Section */}
      <section className="relative bg-white pb-16 pt-10 border-t border-slate-200/80">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Shop with <span className="text-blue-600">Tech-Hub AI</span>
            </h3>
            <p className="text-sm text-slate-500 mt-2.5 leading-relaxed">
              We integrate state-of-the-art artificial intelligence at every step of your buying cycle, ensuring the ultimate security, delivery, and personalization.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: 'AI Product Discovery',
                desc: 'Mia, our smart neural recommendation engine, parses your workspace aesthetic and parameters to curate perfect gadget sets.',
                icon: <Brain className="w-6 h-6 text-blue-500" />,
                bgGrad: 'from-blue-500/5 to-cyan-500/5 hover:border-blue-500/20',
                colSpan: 'md:col-span-2'
              },
              {
                title: 'Smart Returns',
                desc: 'Hassle-free automated return flows. Get instant returns validation, label generation, and refund approvals in seconds.',
                icon: <RotateCcw className="w-6 h-6 text-indigo-500" />,
                bgGrad: 'from-indigo-500/5 to-purple-500/5 hover:border-indigo-500/20',
                colSpan: 'md:col-span-1'
              },
              {
                title: 'Verified Vendors',
                desc: 'Every merchant undergoes strict KYC verification. Buy with absolute confidence knowing all items are 100% genuine.',
                icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
                bgGrad: 'from-emerald-500/5 to-teal-500/5 hover:border-emerald-500/20',
                colSpan: 'md:col-span-1'
              },
              {
                title: 'Fast Delivery',
                desc: 'Intelligent route optimization and shipping partnerships mean we guarantee exact delivery windows and tracking updates.',
                icon: <Truck className="w-6 h-6 text-amber-500" />,
                bgGrad: 'from-amber-500/5 to-orange-500/5 hover:border-amber-500/20',
                colSpan: 'md:col-span-2'
              },
              {
                title: 'Warranty Protection',
                desc: 'Tech-Hub certified extended coverage plans. Hassle-free repairs & replacements with quick vendor coordination.',
                icon: <CheckCircle2 className="w-6 h-6 text-rose-500" />,
                bgGrad: 'from-rose-500/5 to-pink-500/5 hover:border-rose-500/20',
                colSpan: 'md:col-span-1'
              },
              {
                title: '24/7 AI Support',
                desc: 'Instant text & voice assistance to resolve queries, compare device specifications, or assist in tracking your packages.',
                icon: <HeadphonesIcon className="w-6 h-6 text-violet-500" />,
                bgGrad: 'from-violet-500/5 to-fuchsia-500/5 hover:border-violet-500/20',
                colSpan: 'md:col-span-2'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                whileHover={{ y: -6 }}
                className={`bg-white rounded-3xl border border-slate-200/60 p-6 flex flex-col sm:flex-row gap-4 transition-all duration-300 hover:shadow-lg shadow-sm bg-gradient-to-br ${feature.bgGrad} ${feature.colSpan}`}
              >
                <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-100 flex items-center justify-center h-12 w-12 shrink-0 group-hover:scale-105 transition-transform self-start">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-base">{feature.title}</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. What Our Customers Say (Testimonials Carousel) */}
      <section className="relative bg-white py-16 border-t border-slate-200/60">
        <div className="absolute top-[10%] left-[-5%] w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[70px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-5%] w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[70px] pointer-events-none" />

        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12 relative z-10">
          
          {/* Header */}
          <div className="mb-10 text-center max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What Our Customers Say
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">
              Read real reviews from architects, engineers, and designers styling their workspaces.
            </p>
          </div>

          {/* Testimonial snap-scroll container */}
          <div 
            ref={testimonialContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible"
          >
            {TESTIMONIALS_DATA.map((t, idx) => (
              <div 
                key={idx}
                className="min-w-full sm:min-w-[50%] lg:min-w-0 snap-center bg-white rounded-3xl border border-slate-200/60 p-6 shadow-[0_4px_20px_rgba(15,23,42,0.01)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                  {/* Feedback text */}
                  <p className="text-xs sm:text-[13px] font-semibold text-slate-600 leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>

                {/* Profile row */}
                <div className="flex items-center gap-3.5 mt-6 border-t border-slate-100 pt-4">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-black shrink-0 ${t.avatarBg}`}>
                    {t.initials}
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-800 leading-none">{t.name}</h5>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">{t.role} • {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination dots (only visible on mobile/tablet) */}
          <div className="flex items-center justify-center gap-2 mt-4 lg:hidden">
            {TESTIMONIALS_DATA.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToTestimonial(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeTestimonialIdx === idx ? 'bg-blue-600 w-5' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 9. Stay Updated with Latest Tech Deals (Newsletter Bar) */}
      <section className="relative bg-white py-8">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 rounded-[32px] border border-blue-900/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Glowing Background Blob */}
            <div className="absolute -right-24 -top-24 w-72 h-72 bg-blue-600/10 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3.5 shrink-0 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                <svg className="w-8 h-8 text-blue-400 relative z-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">Stay Updated with Latest Tech Deals</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  Get exclusive offers, new arrivals & tech news delivered to your inbox.
                </p>
              </div>
            </div>

            {/* Form input fields */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!subscriberEmail) return;
                showToast(`Successfully subscribed ${subscriberEmail} to tech deals!`);
                setSubscriberEmail('');
              }}
              className="w-full lg:w-auto flex items-center bg-white/5 border border-white/10 p-1.5 rounded-2xl relative z-10 max-w-xl group focus-within:border-blue-500/50 transition-all duration-300 shadow-inner"
            >
              <input
                type="email"
                required
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-transparent border-0 text-white placeholder-slate-500 text-xs px-4 py-3.5 focus:ring-0 focus:outline-none min-w-[200px] sm:min-w-[320px]"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-6 py-3.5 rounded-xl transition-all shadow-md hover:scale-[1.02] active:scale-98 shrink-0"
              >
                Subscribe
              </button>
            </form>

          </div>
        </div>
      </section>

      {/* 10. Ecosystem Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 relative overflow-hidden">
        {/* Ambient bottom glow */}
        <div className="absolute bottom-0 right-[10%] w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12 relative z-10">
          
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-900">
            
            {/* Logo Column */}
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 rounded-xl p-2 flex items-center justify-center shadow-md shadow-blue-600/10">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-black text-white tracking-tight">Tech-Hub <span className="text-blue-500">AI</span></span>
              </div>
              <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-xs">
                AI-powered electronics marketplace connecting buyers with trusted vendors worldwide.
              </p>
              
              {/* Social links */}
              <div className="flex items-center gap-3 mt-6">
                {[
                  { icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ), label: 'Facebook' },
                  { icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  ), label: 'Twitter' },
                  { icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  ), label: 'Instagram' },
                  { icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  ), label: 'LinkedIn' }
                ].map((s, sIdx) => (
                  <a
                    key={sIdx}
                    href="#"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-full border border-slate-900 bg-slate-950 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-400 transition-all hover:scale-105"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            {[
              {
                title: 'Company',
                links: ['About Us', 'Careers', 'Press & Media', 'Investor Relations', 'Contact Us']
              },
              {
                title: 'Categories',
                links: ['Smartphones', 'Laptops', 'Gaming', 'Smart Home', 'Accessories']
              },
              {
                title: 'Support',
                links: ['Help Center', 'Returns & Refunds', 'Shipping Info', 'Warranty', 'Track Order']
              },
              {
                title: 'Vendors',
                links: ['Become a Seller', 'Seller Dashboard', 'Vendor Support', 'Seller Resources', 'Partner Program']
              }
            ].map((col, idx) => (
              <div key={idx} className="col-span-1">
                <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">{col.title}</h5>
                <ul className="space-y-3">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a href="#" className="text-xs text-slate-400 hover:text-blue-400 transition-colors font-semibold">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>

          {/* Bottom Copyright & Trust Metrics */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 pt-6">
            
            {/* Copyright */}
            <p className="text-[11px] font-bold text-slate-500 order-3 md:order-1 text-center md:text-left">
              © 2026 Tech-Hub AI. All rights reserved. Built with pride for tech enthusiasts.
            </p>

            {/* Trust Metrics */}
            <div className="flex flex-wrap items-center justify-center gap-6 order-1 md:order-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                Secure Payments
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
                Buyer Protection
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <Bell className="w-4 h-4 text-amber-500 shrink-0" />
                Privacy Protected
              </span>
            </div>

            {/* Payment badges */}
            <div className="flex items-center gap-2 order-2 md:order-3">
              {/* Visa */}
              <div className="h-6 w-9 rounded bg-[#1A1F71] flex items-center justify-center shrink-0 border border-white/5 shadow-sm">
                <span className="text-[7.5px] font-black text-white italic tracking-tighter">VISA</span>
              </div>
              {/* Mastercard */}
              <div className="h-6 w-9 rounded bg-[#161B22] flex items-center justify-center gap-[-4px] shrink-0 border border-white/5 shadow-sm p-1">
                <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] mr-[-4px]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F00] opacity-90" />
              </div>
              {/* PayPal */}
              <div className="h-6 w-9 rounded bg-[#003087] flex items-center justify-center shrink-0 border border-white/5 shadow-sm">
                <span className="text-[7px] font-extrabold text-white italic tracking-tight flex items-center">
                  <span className="text-[#0079C1]">Pay</span>Pal
                </span>
              </div>
              {/* Apple Pay */}
              <div className="h-6 w-9 rounded bg-white flex items-center justify-center gap-0.5 shrink-0 border border-slate-200 shadow-sm px-1.5">
                <svg className="w-2.5 h-2.5 text-black fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.28-.58 2.94-1.39z" />
                </svg>
                <span className="text-[7.5px] font-black text-black leading-none">Pay</span>
              </div>
            </div>

          </div>

        </div>
      </footer>

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

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />

    </div>
  );
}
