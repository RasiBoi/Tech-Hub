import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { 
  Search, Heart, ShoppingCart, Bell, MapPin, Truck, 
  Star, Cpu, RotateCcw, HeadphonesIcon, Zap, ChevronDown,
  Mic, Menu, X, CheckCircle2, User, Play,
  ShoppingBag, ShieldCheck, ArrowRight, Brain, Flame, Terminal,
  Check, Activity, Plus, MessageSquare, Award, FileText, ExternalLink
} from 'lucide-react';
import { useAiServiceStatus } from './hooks/useAiServiceStatus';

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
      image: new URL('../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href,
      price: 'LKR 18,900.00',
      category: 'Monitor Raiser',
      timeText: 'Viewed 2h ago'
    },
    handpicked: {
      title: 'Premium Walnut Desk Organizer',
      image: new URL('../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png', import.meta.url).href,
      price: 'LKR 12,900.00',
      tip: 'Solid walnut wood grains look best when placed directly on a matte black or dark grey felt desk mat.'
    },
    bundle: [
      {
        id: 'walnut-organizer',
        title: 'Premium Walnut Desk Organizer',
        price: 12900,
        image: new URL('../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png', import.meta.url).href,
      },
      {
        id: 'walnut-raiser',
        title: 'Ugreen Walnut Monitor Raiser Stand',
        price: 18900,
        image: new URL('../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href,
      },
      {
        id: 'walnut-headphone',
        title: 'Walnut Luxe Headphone Stand',
        price: 9500,
        image: new URL('../Media/product_images/walnut-luxe-headphone-stand/image-1.jpeg', import.meta.url).href,
      }
    ],
    trending: {
      title: 'FlexiSpot E7 Ergonomic standing desk',
      image: new URL('../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-1.png', import.meta.url).href,
      price: 'LKR 185,000.00',
      socialText: '42 users styled this desk this week'
    }
  },
  minimalist: {
    name: 'Cream Minimalist',
    description: 'A bright, clean space focused on warm cream desk mats, white matte charging docks, and smart lighting to reduce mental clutter.',
    recentlyViewed: {
      title: 'Baseus Smart Eye Foldable Desk Lamp',
      image: new URL('../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-1.webp', import.meta.url).href,
      price: 'LKR 12,800.00',
      category: 'Desk Lamp',
      timeText: 'Viewed 4h ago'
    },
    handpicked: {
      title: 'Simplist Desk Mat Pro Plus',
      image: new URL('../Media/product_images/simplist-desk-mat-pro-plus/image-1.png', import.meta.url).href,
      price: 'LKR 6,400.00',
      tip: 'Cream and grey desk mat textures add visual warmth while keeping mouse movement smooth and precise.'
    },
    bundle: [
      {
        id: 'min-desk-mat',
        title: 'Simplist Desk Mat Pro Plus',
        price: 6400,
        image: new URL('../Media/product_images/simplist-desk-mat-pro-plus/image-1.png', import.meta.url).href,
      },
      {
        id: 'min-charger',
        title: 'Baseus MagPro 3-in-1 Charging Station',
        price: 21900,
        image: new URL('../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-1.png', import.meta.url).href,
      },
      {
        id: 'min-cable-box',
        title: 'Fasola Cable Management Box (White)',
        price: 4500,
        image: new URL('../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-1.webp', import.meta.url).href,
      }
    ],
    trending: {
      title: 'FlexiSpot C7 Premium Ergonomic Chair',
      image: new URL('../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-1.jpeg', import.meta.url).href,
      price: 'LKR 98,500.00',
      socialText: '84 minimalists added this to their setup today'
    }
  },
  black: {
    name: 'Stealth Matte Black',
    description: 'A stealthy, high-focus productivity look composed of black anodized metals, matte cable managers, and clean direct task lights.',
    recentlyViewed: {
      title: 'Ugreen Aluminum Monitor Raiser (Black)',
      image: new URL('../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href,
      price: 'LKR 18,900.00',
      category: 'Monitor Raiser',
      timeText: 'Viewed 1d ago'
    },
    handpicked: {
      title: 'Baseus Smart Eye Desk Lamp (Black)',
      image: new URL('../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-2.webp', import.meta.url).href,
      price: 'LKR 12,800.00',
      tip: 'Task lights create targeted illumination on dark desk pads, keeping the surrounding room stealthy and relaxed.'
    },
    bundle: [
      {
        id: 'black-lamp',
        title: 'Baseus Smart Eye Desk Lamp (Black)',
        price: 12800,
        image: new URL('../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-2.webp', import.meta.url).href,
      },
      {
        id: 'black-raiser',
        title: 'Ugreen Aluminum Monitor Raiser (Black)',
        price: 18900,
        image: new URL('../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href,
      },
      {
        id: 'black-cable-box',
        title: 'Fasola Cable Management Box (Black)',
        price: 4500,
        image: new URL('../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-1.webp', import.meta.url).href,
      }
    ],
    trending: {
      title: 'Ugreen Qi2 2-in-1 Robot Charging Dock',
      image: new URL('../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-1.png', import.meta.url).href,
      price: 'LKR 18,900.00',
      socialText: '112 programmers bought this setup accent item'
    }
  },
  cyberpunk: {
    name: 'Cyberpunk RGB',
    description: 'A high-energy, retro-futuristic style with customizable pixel displays, colorful speakers, and vibrant glowing widgets.',
    recentlyViewed: {
      title: 'Divoom Times Gate Digital Clock',
      image: new URL('../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-1.jpeg', import.meta.url).href,
      price: 'LKR 42,900.00',
      category: 'Smart Clock',
      timeText: 'Viewed 10m ago'
    },
    handpicked: {
      title: 'Divoom Ditoo Retro Pixel Speaker',
      image: new URL('../Media/product_images/divoom-ditoo-pro-retro-pixel-art-bluetooth-speaker/image-1.jpeg', import.meta.url).href,
      price: 'LKR 31,500.00',
      tip: 'The retro screen matches perfectly with secondary ambient RGB backlighting for maximum desktop energy.'
    },
    bundle: [
      {
        id: 'cyber-speaker',
        title: 'Divoom Ditoo Retro Speaker',
        price: 31500,
        image: new URL('../Media/product_images/divoom-ditoo-pro-retro-pixel-art-bluetooth-speaker/image-1.jpeg', import.meta.url).href,
      },
      {
        id: 'cyber-clock',
        title: 'Divoom Times Gate Digital Clock',
        price: 42900,
        image: new URL('../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-1.jpeg', import.meta.url).href,
      },
      {
        id: 'cyber-toy',
        title: 'Kinetic Roller Coaster Perpetual Motion',
        price: 14500,
        image: new URL('../Media/product_images/kinetic-roller-coaster-perpetual-motion-toy/image-1.webp', import.meta.url).href,
      }
    ],
    trending: {
      title: 'Baseus rotation Countdown Timer',
      image: new URL('../Media/product_images/baseus-heyo-rotation-countdown-timer/image-1.jpg', import.meta.url).href,
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
    stageBg: 'from-slate-950 via-slate-900 to-black border-slate-800/80',
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
        image: new URL('../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-1.png', import.meta.url).href
      },
      {
        title: 'Tablet iPad Dock Stand',
        price: 'LKR 14,500.00',
        spec: '360° Riser Base',
        image: new URL('../Media/product_images/upergo-tablet-ipad-dock-stand-aluminium-silver/image-1.jpg', import.meta.url).href
      },
      {
        title: 'MagPro 3-in-1 Charger',
        price: 'LKR 21,900.00',
        spec: 'Qi2 MagSafe Mount',
        image: new URL('../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-1.png', import.meta.url).href
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
    stageBg: 'from-slate-950 via-blue-950/40 to-slate-950 border-blue-900/30',
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
        image: new URL('../Media/product_images/kaloc-xs100g-premium-aluminum-monitor-arm/image-1.png', import.meta.url).href
      },
      {
        title: 'Monitor Raiser Stand',
        price: 'LKR 18,900.00',
        spec: 'Walnut Wood Drawer',
        image: new URL('../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href
      },
      {
        title: 'Premium Dual Monitor Stand',
        price: 'LKR 35,000.00',
        spec: 'Desk Space Optimizer',
        image: new URL('../Media/product_images/upergo-premium-walnut-dual-monitor-riser-stand-vd-42t/image-1.png', import.meta.url).href
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
    stageBg: 'from-slate-950 via-cyan-950/40 to-slate-950 border-cyan-900/30',
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
        image: new URL('../Media/product_images/n3-laptop-stand/image-1.jpg', import.meta.url).href
      },
      {
        title: 'Ugreen Vertical Laptop Stand',
        price: 'LKR 7,500.00',
        spec: 'Gravity Lock Spacer',
        image: new URL('../Media/product_images/ugreen-vertical-laptop-stand-adjustable-laptop-holder/image-1.jpg', import.meta.url).href
      },
      {
        title: 'Portable Adjustable Laptop Stand',
        price: 'LKR 11,900.00',
        spec: 'Ergonomic Aluminium Base',
        image: new URL('../Media/product_images/upergo-portable-laptop-stand/image-1.jpeg', import.meta.url).href
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
    stageBg: 'from-zinc-950 via-zinc-900 to-slate-950 border-zinc-800/80',
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
        image: new URL('../Media/product_images/edifier-mr4-studio-monitors/image-1.png', import.meta.url).href
      },
      {
        title: 'Divoom Retro Speaker',
        price: 'LKR 31,500.00',
        spec: 'Pixel Art Smart Alarm',
        image: new URL('../Media/product_images/divoom-ditoo-pro-retro-pixel-art-bluetooth-speaker/image-1.jpeg', import.meta.url).href
      },
      {
        title: 'Divoom Tiivoo Speaker',
        price: 'LKR 29,900.00',
        spec: 'Retro Cabinet Design',
        image: new URL('../Media/product_images/divoom-tiivoo-2-photo-album-bluetooth-speaker/image-1.jpeg', import.meta.url).href
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
    stageBg: 'from-slate-950 via-orange-950/30 to-slate-950 border-orange-900/30',
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
        image: new URL('../Media/product_images/mi-computer-monitor-light-bar-black/image-1.jpg', import.meta.url).href
      },
      {
        title: 'Mi Smart Desk Lamp',
        price: 'LKR 19,900.00',
        spec: 'Wi-Fi Intelligent Control',
        image: new URL('../Media/product_images/mi-1s-smart-led-desk-lamp/image-1.png', import.meta.url).href
      },
      {
        title: 'Baseus Countdown Timer',
        price: 'LKR 4,900.00',
        spec: 'Heyo Rotary Control Dial',
        image: new URL('../Media/product_images/baseus-heyo-rotation-countdown-timer/image-1.jpg', import.meta.url).href
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
    stageBg: 'from-slate-950 via-red-950/30 to-slate-950 border-red-900/30',
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
        image: new URL('../Media/product_images/walnut-luxe-headphone-stand/image-1.jpeg', import.meta.url).href
      },
      {
        title: 'Apex Solid Walnut Stand',
        price: 'LKR 12,900.00',
        spec: 'Premium Wood Hanger',
        image: new URL('../Media/product_images/the-apex-stand-solid-walnut-wood-headphone-holder-stand-for-minimalist-desk-setups/image-1.png', import.meta.url).href
      },
      {
        title: 'Solo Headset Stand',
        price: 'LKR 8,500.00',
        spec: 'Universal Metal Bracket',
        image: new URL('../Media/product_images/simplist-solo-headset-holder-detachable-aluminum-alloy-portable-headphone-stand/image-1.jpg', import.meta.url).href
      }
    ]
  }
];

const formatNumber = (num) => num.toLocaleString();

export default function App() {
  const aiServiceStatus = useAiServiceStatus();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [followedVendors, setFollowedVendors] = useState({});
  const [openDropdownVendor, setOpenDropdownVendor] = useState(null);
  const [activeVendorId, setActiveVendorId] = useState('apple');
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);

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

  // Workspace Curation Theme State
  const [workspaceVibe, setWorkspaceVibe] = useState('walnut');
  const [isCurationLoading, setIsCurationLoading] = useState(false);
  const activeVibe = VIBE_DATASETS[workspaceVibe];

  const [selectedBundleItems, setSelectedBundleItems] = useState([]);
  const [isBundleAdded, setIsBundleAdded] = useState(false);

  // Sync selected bundle items when vibe changes
  useEffect(() => {
    if (activeVibe && activeVibe.bundle) {
      setSelectedBundleItems(activeVibe.bundle.map(item => item.id));
    }
    setIsBundleAdded(false);
  }, [workspaceVibe]);

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
      image: new URL('../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-1.jpg', import.meta.url).href,
    },
    {
      name: 'Desk Organizers',
      count: '2,186',
      image: new URL('../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png', import.meta.url).href,
    },
    {
      name: 'Desk Mats',
      count: '4,702',
      image: new URL('../Media/product_images/simplist-desk-mat-pro-plus/image-1.png', import.meta.url).href,
    },
    {
      name: 'Lighting',
      count: '1,944',
      image: new URL('../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-1.webp', import.meta.url).href,
    },
    {
      name: 'Clocks & Timers',
      count: '1,325',
      image: new URL('../Media/product_images/baseus-heyo-rotation-countdown-timer/image-1.jpg', import.meta.url).href,
    },
    {
      name: 'Charging Stations',
      count: '2,497',
      image: new URL('../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-1.png', import.meta.url).href,
    },
    {
      name: 'Monitor Raisers',
      count: '1,807',
      image: new URL('../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href,
    },
    {
      name: 'Standing Desks',
      count: '1,152',
      image: new URL('../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-1.png', import.meta.url).href,
    },
    {
      name: 'Ergonomic Chairs',
      count: '968',
      image: new URL('../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-1.jpeg', import.meta.url).href,
    },
    {
      name: 'Stress Reliever',
      count: '864',
      image: new URL('../Media/product_images/kinetic-roller-coaster-perpetual-motion-toy/image-1.webp', import.meta.url).href,
    },
    {
      name: 'Cable Managers',
      count: '1,143',
      image: new URL('../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-1.webp', import.meta.url).href,
    },
  ];

  const flashDeals = [
    {
      id: 'stand-foldable',
      title: 'Baseus Foldable Desktop Phone Stand',
      image: new URL('../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-2.jpeg', import.meta.url).href,
      discount: '-21%',
      price: 'LKR 24.90',
      oldPrice: 'LKR 31.50',
      rating: '4.8',
      live: '34 watching',
    },
    {
      id: 'desk-organizer',
      title: 'Premium Walnut Desk Organizer',
      image: new URL('../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-2.jpg', import.meta.url).href,
      discount: '-18%',
      price: 'LKR 39.00',
      oldPrice: 'LKR 47.90',
      rating: '4.8',
      live: '19 carts',
    },
    {
      id: 'desk-mat',
      title: 'Simplist Desk Mat Pro Plus',
      image: new URL('../Media/product_images/simplist-desk-mat-pro-plus/image-2.png', import.meta.url).href,
      discount: '-30%',
      price: 'LKR 21.90',
      oldPrice: 'LKR 31.30',
      rating: '4.7',
      live: '42 sold today',
    },
    {
      id: 'desk-lamp',
      title: 'Baseus Smart Eye Foldable Desk Lamp',
      image: new URL('../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-2.webp', import.meta.url).href,
      discount: '-25%',
      price: 'LKR 44.00',
      oldPrice: 'LKR 58.80',
      rating: '4.8',
      live: '11 on checkout',
    },
    {
      id: 'charging-station',
      title: 'Baseus MagPro 3-in-1 Charging Station',
      image: new URL('../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-2.jpg', import.meta.url).href,
      discount: '-20%',
      price: 'LKR 69.00',
      oldPrice: 'LKR 86.50',
      rating: '4.8',
      live: '36 wishlisted',
    },
    {
      id: 'monitor-raiser',
      title: 'Ugreen Aluminum Monitor Raiser Stand',
      image: new URL('../Media/product_images/ugreen-monitor-raiser-stand/image-2.jpg', import.meta.url).href,
      discount: '-30%',
      price: 'LKR 58.00',
      oldPrice: 'LKR 82.90',
      rating: '4.7',
      live: '8 left',
    },
  ];

  return (
    <div className="min-h-screen bg-[#eef2f8] font-sans overflow-x-hidden text-slate-800">
      {/* 1. Top Navbar */}
      <nav className="bg-[#0b1021] text-white py-2 lg:py-3 z-50 relative w-full">
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
            <button className="border border-yellow-400 text-yellow-400 text-xs sm:text-sm font-semibold px-3 xl:px-4 py-1.5 sm:py-2 rounded-md hover:bg-yellow-400 hover:text-[#0b1021] transition-colors whitespace-nowrap">
              Become Seller
            </button>

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
            <div className="grid grid-cols-2 gap-2 text-sm font-medium text-slate-200">
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
      <section className="relative w-full overflow-hidden bg-[#eef2f8] flex xl:min-h-[calc(100vh-126px)]">
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-b from-transparent to-[#eef2f8] pointer-events-none"></div>

        <main className="relative max-w-[1720px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-8 2xl:px-12 pt-2 sm:pt-4 xl:pt-6 pb-4 sm:pb-6 xl:pb-4 2xl:pb-8 flex flex-col xl:grid xl:grid-cols-[minmax(300px,360px)_minmax(560px,1fr)_minmax(250px,280px)] 2xl:grid-cols-[minmax(360px,430px)_minmax(760px,1fr)_minmax(280px,320px)] items-center xl:items-center justify-start xl:justify-center gap-3 sm:gap-5 xl:gap-5 2xl:gap-10 xl:min-h-[calc(100vh-126px)]">
        
        {/* Left Column - Content */}
        <div className="order-1 w-full xl:w-auto xl:max-w-[390px] 2xl:max-w-[430px] z-20 flex flex-col items-center xl:items-start justify-center shrink-0 text-center xl:text-left mt-2 xl:mt-0">
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] 2xl:text-[56px] leading-[1.1] font-bold text-slate-900 mb-2 xl:mb-4 tracking-tight relative z-10">
            Shop Smarter with <br className="hidden sm:block" />
            <span className="text-blue-600">AI-Powered</span> <br className="hidden sm:block" />
            Electronics Marketplace
          </h1>
          
          <p className="text-[13px] sm:text-base text-slate-500 mb-4 xl:mb-6 max-w-[280px] sm:max-w-sm mx-auto xl:mx-0 leading-relaxed relative z-10">
            Discover thousands of gadgets from trusted vendors with personalized recommendations, instant support, smart returns, and real-time delivery intelligence.
          </p>
          
          <div className="flex items-center justify-center xl:justify-start gap-2.5 sm:gap-3 mb-4 xl:mb-6 relative z-10 w-full sm:w-auto px-4 sm:px-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-7 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95 text-xs sm:text-sm whitespace-nowrap flex-1 sm:flex-none">
              Shop Now
            </button>
            <button className="bg-white border-2 border-blue-100 text-blue-600 hover:border-blue-600 px-4 sm:px-7 py-2.5 sm:py-3 rounded-[11px] font-semibold shadow-sm transition-all active:scale-95 text-xs sm:text-sm whitespace-nowrap flex-1 sm:flex-none">
              Become Seller
            </button>
          </div>
          
          {/* Stats - 2×2 on mobile, row on xl */}
          <div className="grid grid-cols-2 sm:grid-cols-4 2xl:flex 2xl:items-center pt-3 sm:pt-4 border-t border-slate-200/60 w-full relative z-10 gap-x-2 gap-y-2 sm:gap-4 2xl:gap-0 2xl:divide-x 2xl:divide-slate-200 px-2 sm:px-0">
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
        <div className="order-3 xl:order-2 w-full xl:w-auto relative z-10 flex items-center justify-center min-h-[160px] sm:min-h-[240px] md:min-h-[320px] lg:min-h-[400px] xl:min-h-[500px] 2xl:min-h-[660px] mt-1 sm:mt-2 xl:mt-0">
          <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/22 blur-[55px] pointer-events-none sm:h-[360px] sm:w-[360px] sm:blur-[80px] xl:h-[440px] xl:w-[440px] xl:blur-[100px]"></div>
          <div className="absolute left-1/2 top-[48%] h-[180px] w-[82%] max-w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(191,219,254,0.85)_0%,rgba(219,234,254,0.45)_42%,rgba(238,242,248,0)_74%)] pointer-events-none sm:h-[220px] xl:h-[280px]"></div>
          <div className="absolute left-1/2 bottom-[8%] h-[120px] w-[72%] max-w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(96,165,250,0.22)_0%,rgba(191,219,254,0.12)_48%,rgba(238,242,248,0)_76%)] blur-[18px] pointer-events-none"></div>
          
          {/* ── Circular ring pattern (concentric rings behind image) ── */}
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
            {/* Central glow */}
            <div className="absolute w-[230px] sm:w-[360px] xl:w-[400px] h-[230px] sm:h-[360px] xl:h-[400px] bg-blue-400/20 rounded-full blur-[40px] sm:blur-[60px]"></div>
          </div>

          {/* Pedestal Base ellipse */}
          <div className="absolute bottom-[2%] sm:bottom-[8%] left-1/2 -translate-x-1/2 w-[88%] sm:w-[78%] xl:w-[74%] h-6 sm:h-10 bg-blue-300/20 rounded-full blur-[15px] sm:blur-[20px] pointer-events-none z-0"></div>

          {/* Main Hero Image */}
          <img 
            src="https://res.cloudinary.com/ddarldtbb/image/upload/f_auto,q_auto/A_3D_commercial_product_photography_202605252017-removebg-preview_qtiikr" 
            alt="Electronics Collection" 
            className="w-[90%] max-w-[320px] sm:max-w-[450px] md:max-w-[620px] lg:max-w-[720px] xl:max-w-[760px] 2xl:max-w-[980px] h-auto object-contain relative z-10 -mt-2 2xl:-mt-6"
          />

          {/* Floating Element 1: AI Picks */}
          <FloatingElement className="hidden xl:block absolute top-[8%] left-[2%] 2xl:left-[6%] z-20 xl:scale-90 2xl:scale-100 origin-top-left" delay={0.2} yOffset={10}>
            <div className="bg-white/95 backdrop-blur-xl border border-white/80 p-3 rounded-2xl shadow-xl flex flex-col gap-2 w-48 2xl:w-56">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-blue-600">AI Picks for You</span>
                <X className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
              </div>
              <p className="text-[9px] text-slate-400 -mt-1">Based on your activity</p>
              <div className="flex gap-2 mt-0.5">
                <div className="bg-slate-50 rounded-xl flex-1 h-14 overflow-hidden border border-slate-100">
                  <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop" alt="Watch" className="w-full h-full object-cover" />
                </div>
                <div className="bg-slate-50 rounded-xl flex-1 h-14 overflow-hidden border border-slate-100">
                  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop" alt="Headphones" className="w-full h-full object-cover" />
                </div>
                <div className="bg-slate-50 rounded-xl flex-1 h-14 overflow-hidden border border-slate-100">
                  <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop" alt="Phone" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </FloatingElement>

          {/* Floating Element 2: Deal of the Day */}
          <FloatingElement className="hidden xl:block absolute bottom-[20%] left-[1%] 2xl:left-[5%] z-20 xl:scale-90 2xl:scale-100 origin-bottom-left" delay={0.4} yOffset={12}>
            <div className="bg-gradient-to-br from-red-500 to-rose-600 p-4 rounded-[1.25rem] shadow-xl shadow-red-500/30 text-white text-left max-w-[124px] 2xl:max-w-[140px] transform hover:-translate-y-1 transition-transform border border-white/10">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block backdrop-blur-sm">Deal of the Day</span>
                <X className="w-3.5 h-3.5 text-white/80 cursor-pointer -mr-1" />
              </div>
              <p className="text-[10px] text-white/90 mt-2 font-medium">Up to</p>
              <p className="text-3xl font-black leading-none my-1 tracking-tight drop-shadow-sm pb-1">60% OFF</p>
              <p className="text-[9px] text-white/80 font-medium bg-black/10 px-2 py-0.5 rounded-full w-fit mt-1">Limited time offer</p>
            </div>
          </FloatingElement>

          {/* Floating Element 3: Live Order Tracking */}
          <FloatingElement className="hidden xl:block absolute top-[9%] right-[2%] 2xl:right-[6%] z-20 xl:scale-90 2xl:scale-100 origin-top-right" delay={0.6} yOffset={10}>
            <div className="bg-emerald-400/95 backdrop-blur-xl p-3.5 rounded-[1.25rem] shadow-xl shadow-emerald-500/20 text-white w-48 2xl:w-56 border border-white/10">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  Live Order Tracking
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-white inline-block"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                  />
                </span>
                <X className="w-3.5 h-3.5 text-white/80 cursor-pointer" />
              </div>
              <p className="text-[9px] text-emerald-50 font-medium mb-1 tracking-wide">Order #EX784312</p>
              <div className="flex justify-between items-center mb-2 mt-1.5 bg-black/10 p-1.5 rounded-lg">
                <p className="text-[11px] font-bold">In Transit</p>
                <motion.div
                  className="bg-white/25 p-1 rounded-full"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                >
                  <Truck className="w-3 h-3 text-white" />
                </motion.div>
              </div>
              <p className="text-[9px] text-emerald-100 font-semibold mb-1.5">Arriving in 2 Days</p>
              {/* Animated progress track */}
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
            <div className="bg-gradient-to-r from-orange-400 to-amber-500 p-3.5 rounded-[1.25rem] shadow-xl shadow-orange-500/20 text-white flex flex-col transform hover:-translate-y-1 transition-transform border border-orange-300 backdrop-blur-md">
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-90 inline-block mb-1 bg-black/10 px-2 py-0.5 rounded-full w-fit">Fast Delivery</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-xl font-black tracking-tight drop-shadow-sm">2-3 Days</p>
                <Truck className="w-5 h-5 opacity-95 ml-1" />
              </div>
              <p className="text-[9px] bg-black/20 font-medium rounded-full px-2 py-0.5 w-fit mt-1.5 border border-white/10">Express Shipping</p>
            </div>
          </FloatingElement>

        </div>

        {/* Mobile/Tablet Voice Assistant Card */}
        <div className="order-2 xl:hidden w-full max-w-[560px] mt-2 mb-1 relative z-20">
          <div className="rounded-[28px] p-[1.5px] bg-[conic-gradient(from_0deg_at_50%_50%,#1e40af_0%,#3b82f6_35%,#0ea5e9_65%,#1e40af_100%)] shadow-[0_20px_45px_rgba(30,64,175,0.25)]">
            <div className="rounded-[27px] bg-gradient-to-b from-[#101d3f] via-[#13295f] to-[#1a2d62] px-4 py-4 sm:px-5 sm:py-5 text-white">
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
                <div className="flex-1">
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
                  whileTap={{ scale: 0.95 }}
                  className="relative w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.6)]"
                >
                  <Mic className="text-white w-6 h-6" />
                </motion.button>
              </div>
              <p className="text-center text-[11px] text-blue-100 font-medium mt-1">Tap to speak</p>
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
              <div className="absolute inset-x-4 top-[12%] h-24 bg-blue-500/10 blur-2xl pointer-events-none"></div>

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
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-11 h-11 2xl:w-14 2xl:h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.65)]"
                >
                  <Mic className="text-white w-4 h-4 2xl:w-6 2xl:h-6" />
                </motion.button>
              </div>

              <p className="text-blue-100 text-[10px] 2xl:text-[11px] font-semibold tracking-wide">Tap to speak</p>
            </div>
          </div>
        </div>
      </main>
      </section>

      {/* 4. Categories + Flash Deals Section */}
      <section className="relative bg-[#eef2f8] overflow-hidden pt-4 sm:pt-5 pb-10 sm:pb-12 border-t border-slate-200/80">
        <div className="relative max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12">
          <div className="mb-3 flex items-center justify-end">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
            >
              View More Categories
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="grid min-w-max grid-flow-col auto-cols-[126px] sm:auto-cols-[138px] lg:auto-cols-[146px]">
                {curatedCategories.map((category, index) => (
                  <motion.button
                    key={category.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                    whileHover={{ y: -2 }}
                    className="group px-3 sm:px-3.5 py-2 text-center border-r border-slate-300/80 last:border-r-0"
                  >
                    <div className="h-[96px] sm:h-[104px] w-full rounded-xl bg-white/80 p-1 flex items-center justify-center shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                      />
                    </div>
                    <p className="mt-3 text-[12px] sm:text-[13px] font-semibold leading-tight text-slate-900">{category.name}</p>
                  </motion.button>
                ))}

                <motion.button
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, delay: 0.38 }}
                  whileHover={{ y: -2 }}
                  className="px-3 py-2 text-center"
                >
                  <div className="h-[96px] sm:h-[104px] w-full flex items-center justify-center">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg shadow-black/20">
                      <ArrowRight className="h-7 w-7" />
                    </span>
                  </div>
                  <p className="mt-3 text-[12px] sm:text-[13px] font-semibold text-slate-900">More Categories</p>
                </motion.button>
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
              <a href="#" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800">
                View All Deals
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
              {flashDeals.map((deal, index) => (
                <motion.article
                  key={deal.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.22 }}
                  transition={{ duration: 0.42, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/88 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm"
                >
                  <div className="absolute left-3 top-3 rounded-md bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {deal.discount}
                  </div>
                  <button className="absolute right-3 top-3 rounded-full border border-slate-200 bg-white/90 p-1 text-slate-400 hover:text-rose-500 transition-colors">
                    <Heart className="h-3.5 w-3.5" />
                  </button>

                  <div className="h-28 rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-2">
                    <img src={deal.image} alt={deal.title} className="h-full w-full rounded-lg object-cover" />
                  </div>

                  <h4 className="mt-2.5 text-[12px] font-semibold leading-snug text-slate-800 min-h-[38px]">{deal.title}</h4>

                  <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    <span className="font-semibold text-slate-700">{deal.rating}</span>
                    <span className="text-slate-400">({deal.live})</span>
                  </div>

                  <div className="mt-2 flex items-end gap-2">
                    <p className="text-base font-extrabold text-rose-600">{deal.price}</p>
                    <p className="pb-0.5 text-[11px] text-slate-400 line-through">{deal.oldPrice}</p>
                  </div>

                  <button className="mt-2.5 inline-flex w-full items-center justify-center gap-1 rounded-xl border border-blue-100 bg-blue-50 px-2 py-2 text-[11px] font-bold text-blue-700 transition-colors hover:bg-blue-600 hover:text-white">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Quick add
                  </button>
                </motion.article>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/45 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs sm:text-sm text-slate-600">
                312 deals were updated in the last hour. Prices can shift in real-time.
              </p>
              <a href="#" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800">
                See all live deals
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Curate Your Workspace — Setup Curation Hub */}
      <section className="relative bg-[#eef2f8] pb-16 pt-12 border-t border-slate-200/80">
        
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
              className="bg-white rounded-3xl border border-slate-200/60 p-4 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[490px] group overflow-hidden"
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
                  <div className="h-36 w-full rounded-xl overflow-hidden bg-white border border-slate-200/50 flex items-center justify-center relative">
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
              className="bg-white rounded-3xl border border-slate-200/60 p-4 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[490px] group overflow-hidden"
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
                  <div className="h-36 w-full rounded-xl overflow-hidden bg-white border border-slate-200/50 flex items-center justify-center">
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
              className="bg-white rounded-3xl border border-slate-200/60 p-4 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[490px] group overflow-hidden"
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
                  onClick={() => {
                    setIsBundleAdded(true);
                    setTimeout(() => setIsBundleAdded(false), 2200);
                  }}
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
              className="bg-white rounded-3xl border border-slate-200/60 p-4 shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[490px] group overflow-hidden"
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
                  <div className="h-36 w-full rounded-xl overflow-hidden bg-white border border-slate-200/50 flex items-center justify-center">
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
              className="rounded-3xl relative overflow-hidden bg-gradient-to-b from-blue-50/30 via-white to-white text-slate-800 p-4 shadow-[0_4px_24px_rgba(37,99,235,0.03)] border border-blue-100 flex flex-col justify-between h-[490px]"
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
      <section className="relative bg-[#f8fafc] py-16 border-t border-slate-200/80">
        {/* Soft Ambient glow behind the split console */}
        <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[5%] w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12 relative z-10">
          
          {/* Header */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5 tracking-tight">
                  Featured Vendors
                </h3>
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200/80 px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                  <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                  Ecosystem Hub
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2.5">
                Connect and browse official vendor storefronts integrated into unified workspace setups.
              </p>
            </div>
            <a href="#" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-800 group shrink-0 self-start sm:self-center">
              View All Partners
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Interactive Split-Pane Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Sidebar: Brand selector buttons (4 columns on lg) */}
            <div className="lg:col-span-4 flex flex-col gap-3.5 w-full">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1 pl-1">Partner Directory</p>
              
              {VENDORS_DATA.map((vendor) => {
                const isActive = activeVendorId === vendor.id;
                const isFollowed = !!followedVendors[vendor.id];
                return (
                  <button
                    key={vendor.id}
                    onClick={() => setActiveVendorId(vendor.id)}
                    className={`relative w-full text-left p-4 rounded-3xl border transition-all duration-300 flex items-center justify-between group overflow-hidden ${
                      isActive
                        ? 'bg-white border-slate-300 shadow-[0_12px_24px_rgba(15,23,42,0.04)] -translate-x-1 lg:-translate-x-2'
                        : 'bg-white/60 border-slate-200/70 hover:bg-white hover:border-slate-300 hover:shadow-[0_8px_16px_rgba(15,23,42,0.02)]'
                    }`}
                  >
                    {/* Active highlight line indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 rounded-r-md"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

                    <div className="flex items-center gap-3.5">
                      {/* Logo Ring */}
                      <div className={`w-12 h-12 rounded-xl bg-slate-50 border flex items-center justify-center p-1.5 transition-all duration-300 shrink-0 ${
                        isActive ? 'border-slate-300/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]' : 'border-slate-200/60'
                      }`}>
                        {vendor.logoSvg}
                      </div>

                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 leading-tight flex items-center gap-1.5">
                          {vendor.name}
                          {isFollowed && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" title="Following" />
                          )}
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500 stroke-[1.5]" />
                          <span className="text-[11px] font-bold text-slate-700">{vendor.rating}</span>
                          <span className="text-[9px] text-slate-400">({vendor.reviews})</span>
                        </div>
                      </div>
                    </div>

                    {/* Followers count compact badge */}
                    <div className="text-right shrink-0">
                      <p className="text-[9px] font-bold text-slate-400">Followers</p>
                      <p className="text-xs font-black text-slate-800 mt-0.5">
                        {formatNumber(vendor.baseFollowers + (isFollowed ? 1 : 0))}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Panel: Dynamic Dark Showcase Stage (8 columns on lg) */}
            <div className="lg:col-span-8 w-full h-full">
              {VENDORS_DATA.map((vendor) => {
                if (vendor.id !== activeVendorId) return null;
                const isFollowed = !!followedVendors[vendor.id];
                return (
                  <motion.div
                    key={vendor.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className={`w-full bg-gradient-to-br rounded-[40px] border p-8 flex flex-col justify-between shadow-[0_24px_50px_rgba(15,23,42,0.1)] relative overflow-hidden backdrop-blur-md h-[610px] ${vendor.stageBg}`}
                  >
                    {/* Glowing Accent Ambient Blob */}
                    <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${vendor.glowGrad} opacity-[0.08] rounded-full blur-[50px] pointer-events-none`} />
                    <div className={`absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-br ${vendor.glowGrad} opacity-[0.08] rounded-full blur-[50px] pointer-events-none`} />

                    <div className="relative z-10">
                      
                      {/* Stage Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100/95 flex items-center justify-center p-2 shadow-md shrink-0">
                            {vendor.logoSvg}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-black text-white">{vendor.name}</h3>
                              <span className="text-[8px] tracking-wider uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-md font-black">
                                Verified Partner
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{vendor.tagline}</p>
                          </div>
                        </div>

                        {/* Stage Follow Action */}
                        <button
                          onClick={() => handleToggleFollowVendor(vendor.id, vendor.name)}
                          className={`px-5 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 self-start sm:self-center shrink-0 ${
                            isFollowed
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-md'
                              : 'bg-white text-slate-900 hover:bg-slate-100 hover:scale-[1.02] active:scale-98 shadow-sm'
                          }`}
                        >
                          {isFollowed ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Following Partner</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Follow Brand</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Partners Catalog Shelf title */}
                      <div className="mt-6 flex justify-between items-center mb-4">
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Featured Partner Catalog</p>
                        <p className="text-[10px] text-slate-500 font-bold">Showing 3 of {vendor.productsCount} items</p>
                      </div>

                      {/* Product Shelf Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {vendor.products.map((product, idx) => (
                          <div
                            key={idx}
                            className="bg-white/5 border border-white/10 rounded-3xl p-3.5 flex flex-col justify-between h-[230px] transition-all duration-300 hover:bg-white/10 hover:border-white/20 group/item relative"
                          >
                            <div className="h-24 w-full bg-white rounded-2xl flex items-center justify-center p-2 border border-white/5 overflow-hidden shadow-inner">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="max-h-full max-w-full object-contain mix-blend-multiply group-hover/item:scale-110 transition-transform duration-500"
                              />
                            </div>
                            
                            <div className="mt-3">
                              <h5 className="text-[11px] font-extrabold text-white leading-snug truncate" title={product.title}>
                                {product.title}
                              </h5>
                              <p className="text-[9px] font-black text-blue-400 tracking-wide uppercase mt-0.5 leading-none">
                                {product.spec}
                              </p>
                            </div>

                            <div className="flex justify-between items-center mt-2.5">
                              <span className="text-xs font-black text-white">{product.price || 'LKR 12,900'}</span>
                              <button
                                onClick={() => showToast(`Added ${product.title} to your workspace setup!`)}
                                className="w-7 h-7 rounded-xl bg-white/10 hover:bg-blue-600 text-white flex items-center justify-center border border-white/10 transition-all hover:scale-105 active:scale-95"
                                title="Add to Workspace Setup"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Visit Store Action Row */}
                    <div className="relative flex items-center vendor-dropdown-container mt-6">
                      <button
                        onClick={() => showToast(`Opening storepage for ${vendor.name}...`)}
                        className="flex-1 bg-white hover:bg-slate-100 text-slate-900 active:scale-99 py-3 px-5 rounded-l-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <ShoppingBag className="w-4 h-4 text-slate-800" />
                        Visit Official Store
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownVendor(openDropdownVendor === vendor.id ? null : vendor.id);
                        }}
                        className={`px-4 py-3 rounded-r-2xl border-l border-slate-200 text-slate-800 transition-all flex items-center justify-center shadow-md ${
                          openDropdownVendor === vendor.id
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white hover:bg-slate-100'
                        }`}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdownVendor === vendor.id ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {openDropdownVendor === vendor.id && (
                        <div className="absolute right-0 bottom-full mb-3 w-56 rounded-2xl bg-white border border-slate-200/80 p-2 shadow-[0_15px_30px_rgba(15,23,42,0.12)] z-40 animate-in fade-in slide-in-from-bottom-2 duration-150">
                          {[
                            { label: 'Browse Catalog', icon: <ExternalLink className="w-3.5 h-3.5" /> },
                            { label: 'Chat with Agent', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                            { label: 'Certificates', icon: <Award className="w-3.5 h-3.5" /> },
                            { label: 'Write Review', icon: <FileText className="w-3.5 h-3.5" /> }
                          ].map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => {
                                showToast(`${opt.label} clicked for ${vendor.name}`);
                                setOpenDropdownVendor(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors group"
                            >
                              <span className="text-slate-400 group-hover:text-blue-500 transition-colors shrink-0">{opt.icon}</span>
                              <span>{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                  </motion.div>
                );
              })}
            </div>

          </div>
          
        </div>
      </section>

      {/* 7. Why Shop with Tech-Hub AI Values Section */}
      <section className="relative bg-gradient-to-b from-[#eef2f8] to-[#f4f7fc] pb-16 pt-10 border-t border-slate-200/80">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: 'AI Product Discovery',
                desc: 'Mia, our smart neural recommendation engine, parses your workspace aesthetic and parameters to curate perfect gadget sets.',
                icon: <Brain className="w-6 h-6 text-blue-500" />,
                bgGrad: 'from-blue-500/5 to-cyan-500/5 hover:border-blue-500/20'
              },
              {
                title: 'Smart Returns',
                desc: 'Hassle-free automated return flows. Get instant returns validation, label generation, and refund approvals in seconds.',
                icon: <RotateCcw className="w-6 h-6 text-indigo-500" />,
                bgGrad: 'from-indigo-500/5 to-purple-500/5 hover:border-indigo-500/20'
              },
              {
                title: 'Verified Vendors',
                desc: 'Every merchant undergoes strict KYC verification. Buy with absolute confidence knowing all items are 100% genuine.',
                icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
                bgGrad: 'from-emerald-500/5 to-teal-500/5 hover:border-emerald-500/20'
              },
              {
                title: 'Fast Delivery',
                desc: 'Intelligent route optimization and shipping partnerships mean we guarantee exact delivery windows and tracking updates.',
                icon: <Truck className="w-6 h-6 text-amber-500" />,
                bgGrad: 'from-amber-500/5 to-orange-500/5 hover:border-amber-500/20'
              },
              {
                title: 'Warranty Protection',
                desc: 'Tech-Hub certified extended coverage plans. Hassle-free repairs & replacements with quick vendor coordination.',
                icon: <CheckCircle2 className="w-6 h-6 text-rose-500" />,
                bgGrad: 'from-rose-500/5 to-pink-500/5 hover:border-rose-500/20'
              },
              {
                title: '24/7 AI Support',
                desc: 'Instant text & voice assistance to resolve queries, compare device specifications, or assist in tracking your packages.',
                icon: <HeadphonesIcon className="w-6 h-6 text-violet-500" />,
                bgGrad: 'from-violet-500/5 to-fuchsia-500/5 hover:border-violet-500/20'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                whileHover={{ y: -6 }}
                className={`bg-white rounded-3xl border border-slate-200/60 p-6 flex gap-4 transition-all duration-300 hover:shadow-lg shadow-sm bg-gradient-to-br ${feature.bgGrad}`}
              >
                <div className="bg-white rounded-2xl p-3 shadow-md border border-slate-100 flex items-center justify-center h-12 w-12 shrink-0 group-hover:scale-105 transition-transform">
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

    </div>
  );
}
