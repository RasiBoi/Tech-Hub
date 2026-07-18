import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Heart, ShoppingCart, Bell, MapPin, Truck, 
  Star, Cpu, RotateCcw, HeadphonesIcon, Zap, ChevronDown, ChevronLeft, ChevronRight,
  Mic, Menu, X, CheckCircle2, User, ShoppingBag, ArrowRight, Brain, LogOut, Store,
  SlidersHorizontal, Check, ShieldCheck, Share2, Plus, Minus, Info, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { isRequestAbortError, requestJson } from '../services/httpClient';
import { serviceRegistry } from '../config/serviceRegistry';
import { resolveProductGallery, resolveProductImage } from '../lib/media';
import { enrichProductMeta, getProductBrandName, getProductCategoryName, getProductSubcategory } from '../lib/productMeta';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Detailed mapping of product images for premium gallery views
const PRODUCT_IMAGES_MAP = {
  "stand-1": [
    new URL('../../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-1.jpg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-2.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-3.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-4.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-5.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-6.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-7.jpeg', import.meta.url).href
  ],
  "stand-2": [
    new URL('../../Media/product_images/ugreen-aluminum-foldable-laptop-stand/image-1.jpg', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-aluminum-foldable-laptop-stand/image-2.jpg', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-aluminum-foldable-laptop-stand/image-3.jpg', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-aluminum-foldable-laptop-stand/image-4.jpg', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-aluminum-foldable-laptop-stand/image-5.jpg', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-aluminum-foldable-laptop-stand/image-6.jpg', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-aluminum-foldable-laptop-stand/image-7.jpeg', import.meta.url).href
  ],
  "stand-3": [
    new URL('../../Media/product_images/simplist-book-stand-ergonomic-portable-adjustable-book-holder-rest-for-hands-free-reading/image-1.jpg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-book-stand-ergonomic-portable-adjustable-book-holder-rest-for-hands-free-reading/image-2.jpg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-book-stand-ergonomic-portable-adjustable-book-holder-rest-for-hands-free-reading/image-3.jpg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-book-stand-ergonomic-portable-adjustable-book-holder-rest-for-hands-free-reading/image-4.jpg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-book-stand-ergonomic-portable-adjustable-book-holder-rest-for-hands-free-reading/image-5.jpg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-book-stand-ergonomic-portable-adjustable-book-holder-rest-for-hands-free-reading/image-6.jpg', import.meta.url).href
  ],
  "stand-4": [
    new URL('../../Media/product_images/upergo-tablet-ipad-dock-stand-aluminium-silver/image-1.jpg', import.meta.url).href,
    new URL('../../Media/product_images/upergo-tablet-ipad-dock-stand-aluminium-silver/image-2.jpg', import.meta.url).href,
    new URL('../../Media/product_images/upergo-tablet-ipad-dock-stand-aluminium-silver/image-3.jpg', import.meta.url).href,
    new URL('../../Media/product_images/upergo-tablet-ipad-dock-stand-aluminium-silver/image-4.jpg', import.meta.url).href,
    new URL('../../Media/product_images/upergo-tablet-ipad-dock-stand-aluminium-silver/image-5.jpg', import.meta.url).href,
    new URL('../../Media/product_images/upergo-tablet-ipad-dock-stand-aluminium-silver/image-6.jpg', import.meta.url).href
  ],
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
  ],
  "org-2": [
    new URL('../../Media/product_images/premium-walnut-business-card-holder-c-level-collection/image-1.png', import.meta.url).href,
    new URL('../../Media/product_images/premium-walnut-business-card-holder-c-level-collection/image-2.jpg', import.meta.url).href,
    new URL('../../Media/product_images/premium-walnut-business-card-holder-c-level-collection/image-3.jpg', import.meta.url).href,
    new URL('../../Media/product_images/premium-walnut-business-card-holder-c-level-collection/image-4.jpg', import.meta.url).href,
    new URL('../../Media/product_images/premium-walnut-business-card-holder-c-level-collection/image-5.jpg', import.meta.url).href,
    new URL('../../Media/product_images/premium-walnut-business-card-holder-c-level-collection/image-6.png', import.meta.url).href
  ],
  "org-3": [
    new URL('../../Media/product_images/oggi-clear-drawer-organizers-trays-set/image-1.jpg', import.meta.url).href,
    new URL('../../Media/product_images/oggi-clear-drawer-organizers-trays-set/image-2.jpg', import.meta.url).href,
    new URL('../../Media/product_images/oggi-clear-drawer-organizers-trays-set/image-3.jpg', import.meta.url).href,
    new URL('../../Media/product_images/oggi-clear-drawer-organizers-trays-set/image-4.jpg', import.meta.url).href,
    new URL('../../Media/product_images/oggi-clear-drawer-organizers-trays-set/image-5.jpg', import.meta.url).href,
    new URL('../../Media/product_images/oggi-clear-drawer-organizers-trays-set/image-6.jpg', import.meta.url).href
  ],
  "mat-1": [
    new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-1.png', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-2.png', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-3.png', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-4.png', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-5.png', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-6.png', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-plus/image-7.png', import.meta.url).href
  ],
  "mat-2": [
    new URL('../../Media/product_images/feltguard-pro-felt-deskmat/image-1.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/feltguard-pro-felt-deskmat/image-2.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/feltguard-pro-felt-deskmat/image-3.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/feltguard-pro-felt-deskmat/image-4.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/feltguard-pro-felt-deskmat/image-5.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/feltguard-pro-felt-deskmat/image-6.jpg', import.meta.url).href,
    new URL('../../Media/product_images/feltguard-pro-felt-deskmat/image-7.jpg', import.meta.url).href,
    new URL('../../Media/product_images/feltguard-pro-felt-deskmat/image-8.jpg', import.meta.url).href
  ],
  "mat-3": [
    new URL('../../Media/product_images/simplist-desk-mat-pro-non-slip-pu-leather-desk-pad/image-1.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-non-slip-pu-leather-desk-pad/image-2.jpg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-non-slip-pu-leather-desk-pad/image-3.jpg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-non-slip-pu-leather-desk-pad/image-4.jpg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-non-slip-pu-leather-desk-pad/image-5.jpg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-non-slip-pu-leather-desk-pad/image-6.jpg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-non-slip-pu-leather-desk-pad/image-7.jpg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-non-slip-pu-leather-desk-pad/image-8.jpg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-non-slip-pu-leather-desk-pad/image-9.jpg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-non-slip-pu-leather-desk-pad/image-10.jpg', import.meta.url).href,
    new URL('../../Media/product_images/simplist-desk-mat-pro-non-slip-pu-leather-desk-pad/image-11.jpg', import.meta.url).href
  ],
  "light-1": [
    new URL('../../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-1.webp', import.meta.url).href,
    new URL('../../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-2.webp', import.meta.url).href,
    new URL('../../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-3.webp', import.meta.url).href,
    new URL('../../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-4.webp', import.meta.url).href,
    new URL('../../Media/product_images/baseus-smart-eye-foldable-desk-lamp/image-5.webp', import.meta.url).href
  ],
  "light-2": [
    new URL('../../Media/product_images/mi-computer-monitor-light-bar-black/image-1.jpg', import.meta.url).href,
    new URL('../../Media/product_images/mi-computer-monitor-light-bar-black/image-2.jpg', import.meta.url).href,
    new URL('../../Media/product_images/mi-computer-monitor-light-bar-black/image-3.jpg', import.meta.url).href,
    new URL('../../Media/product_images/mi-computer-monitor-light-bar-black/image-4.jpg', import.meta.url).href,
    new URL('../../Media/product_images/mi-computer-monitor-light-bar-black/image-5.jpg', import.meta.url).href,
    new URL('../../Media/product_images/mi-computer-monitor-light-bar-black/image-6.jpg', import.meta.url).href,
    new URL('../../Media/product_images/mi-computer-monitor-light-bar-black/image-7.jpeg', import.meta.url).href
  ],
  "light-3": [
    new URL('../../Media/product_images/the-hive-hexagon-led-light-panel/image-1.png', import.meta.url).href,
    new URL('../../Media/product_images/the-hive-hexagon-led-light-panel/image-2.png', import.meta.url).href,
    new URL('../../Media/product_images/the-hive-hexagon-led-light-panel/image-3.png', import.meta.url).href,
    new URL('../../Media/product_images/the-hive-hexagon-led-light-panel/image-4.png', import.meta.url).href,
    new URL('../../Media/product_images/the-hive-hexagon-led-light-panel/image-5.png', import.meta.url).href,
    new URL('../../Media/product_images/the-hive-hexagon-led-light-panel/image-6.webp', import.meta.url).href,
    new URL('../../Media/product_images/the-hive-hexagon-led-light-panel/image-7.webp', import.meta.url).href,
    new URL('../../Media/product_images/the-hive-hexagon-led-light-panel/image-8.webp', import.meta.url).href,
    new URL('../../Media/product_images/the-hive-hexagon-led-light-panel/image-9.webp', import.meta.url).href,
    new URL('../../Media/product_images/the-hive-hexagon-led-light-panel/image-10.webp', import.meta.url).href
  ],
  "clock-1": [
    new URL('../../Media/product_images/baseus-heyo-rotation-countdown-timer/image-1.jpg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-heyo-rotation-countdown-timer/image-2.jpg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-heyo-rotation-countdown-timer/image-3.jpg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-heyo-rotation-countdown-timer/image-4.jpg', import.meta.url).href
  ],
  "clock-2": [
    new URL('../../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-1.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-2.png', import.meta.url).href,
    new URL('../../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-3.png', import.meta.url).href,
    new URL('../../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-4.png', import.meta.url).href,
    new URL('../../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-5.png', import.meta.url).href,
    new URL('../../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-6.png', import.meta.url).href,
    new URL('../../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-7.png', import.meta.url).href,
    new URL('../../Media/product_images/divoom-times-gate-pixel-art-informative-display/image-8.png', import.meta.url).href
  ],
  "charge-1": [
    new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-1.png', import.meta.url).href,
    new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-2.jpg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-3.webp', import.meta.url).href,
    new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-4.jpg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-5.jpg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-6.jpg', import.meta.url).href,
    new URL('../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-7.jpg', import.meta.url).href
  ],
  "charge-2": [
    new URL('../../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-1.png', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-2.png', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-3.webp', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-4.png', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-5.webp', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-6.webp', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-7.webp', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-8.webp', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-qi2-2-in-1-wireless-robot-charging-station/image-9.webp', import.meta.url).href
  ],
  "raiser-1": [
    new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-2.jpg', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-3.jpg', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-4.jpg', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-5.jpg', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-6.jpg', import.meta.url).href,
    new URL('../../Media/product_images/ugreen-monitor-raiser-stand/image-7.jpg', import.meta.url).href
  ],
  "raiser-2": [
    new URL('../../Media/product_images/upergo-premium-walnut-dual-monitor-riser-stand-vd-42t/image-1.png', import.meta.url).href,
    new URL('../../Media/product_images/upergo-premium-walnut-dual-monitor-riser-stand-vd-42t/image-2.png', import.meta.url).href,
    new URL('../../Media/product_images/upergo-premium-walnut-dual-monitor-riser-stand-vd-42t/image-3.png', import.meta.url).href,
    new URL('../../Media/product_images/upergo-premium-walnut-dual-monitor-riser-stand-vd-42t/image-4.png', import.meta.url).href,
    new URL('../../Media/product_images/upergo-premium-walnut-dual-monitor-riser-stand-vd-42t/image-5.png', import.meta.url).href,
    new URL('../../Media/product_images/upergo-premium-walnut-dual-monitor-riser-stand-vd-42t/image-6.png', import.meta.url).href,
    new URL('../../Media/product_images/upergo-premium-walnut-dual-monitor-riser-stand-vd-42t/image-7.png', import.meta.url).href
  ],
  "desk-1": [
    new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-1.png', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-2.png', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-3.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-4.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-5.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-6.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-7.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-8.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-9.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-10.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-11.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-12.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-e7-height-adjustable-ergonomic-standing-desk/image-13.jpg', import.meta.url).href
  ],
  "chair-1": [
    new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-1.jpeg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-2.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-3.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-4.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-5.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-6.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-7.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-8.jpg', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-9.png', import.meta.url).href,
    new URL('../../Media/product_images/flexispot-c7-premium-ergonomic-chair/image-10.png', import.meta.url).href
  ],
  "stress-1": [
    new URL('../../Media/product_images/kinetic-roller-coaster-perpetual-motion-toy/image-1.webp', import.meta.url).href,
    new URL('../../Media/product_images/kinetic-roller-coaster-perpetual-motion-toy/image-2.webp', import.meta.url).href,
    new URL('../../Media/product_images/kinetic-roller-coaster-perpetual-motion-toy/image-3.webp', import.meta.url).href,
    new URL('../../Media/product_images/kinetic-roller-coaster-perpetual-motion-toy/image-4.jpg', import.meta.url).href,
    new URL('../../Media/product_images/kinetic-roller-coaster-perpetual-motion-toy/image-5.jpg', import.meta.url).href,
    new URL('../../Media/product_images/kinetic-roller-coaster-perpetual-motion-toy/image-6.jpg', import.meta.url).href
  ],
  "cable-1": [
    new URL('../../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-1.webp', import.meta.url).href,
    new URL('../../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-2.webp', import.meta.url).href,
    new URL('../../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-3.webp', import.meta.url).href,
    new URL('../../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-4.webp', import.meta.url).href,
    new URL('../../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-5.webp', import.meta.url).href,
    new URL('../../Media/product_images/fasola-cable-management-box-for-power-strips-and-electrical-cords-organize-and-conceal-wires/image-6.webp', import.meta.url).href
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

export default function Product() {
  const { productId } = useParams();
  const { user, logout } = useAuth();
  const { addItem } = useCart();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();



  // Product purchase control states
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Space Grey');
  const [selectedVibe, setSelectedVibe] = useState('Stealth Black');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  // Interactive bundle selections
  const [checkedBundleItems, setCheckedBundleItems] = useState({});

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);

  // Database States
  const [allDbProducts, setAllDbProducts] = useState([]);
  const [selectedDbProduct, setSelectedDbProduct] = useState(null);
  const [selectedProductStatus, setSelectedProductStatus] = useState('idle');
  const [dbCategories, setDbCategories] = useState([]);
  const isDatabaseProductId = /^\d+$/.test(String(productId));

  useEffect(() => {
    // Reset options on product change
    setQuantity(1);
    setActiveImageIdx(0);
    setActiveTab('description');
    setSelectedDbProduct(null);
    setSelectedProductStatus(isDatabaseProductId ? 'loading' : 'idle');
  }, [productId]);

  useEffect(() => {
    let ignoreResult = false;

    const loadData = async () => {
      // Fetch selected product directly so a stale list never opens the wrong detail page.
      const [selectedResult, prodResult, catResult] = await Promise.allSettled([
        isDatabaseProductId
          ? requestJson(`${serviceRegistry.catalog}/products/${productId}`)
          : Promise.resolve(null),
        requestJson(`${serviceRegistry.catalog}/products`),
        requestJson(`${serviceRegistry.catalog}/categories`),
      ]);

      if (ignoreResult) return;

      if (selectedResult.status === 'fulfilled' && selectedResult.value) {
        const selectedProduct = enrichProductMeta(selectedResult.value);
        if (String(selectedProduct.id) === String(productId)) {
          setSelectedDbProduct(selectedProduct);
          setSelectedProductStatus('loaded');
        } else {
          setSelectedDbProduct(null);
          setSelectedProductStatus('error');
        }
      } else {
        setSelectedDbProduct(null);
        setSelectedProductStatus(isDatabaseProductId ? 'error' : 'idle');
        if (selectedResult.status === 'rejected' && !isRequestAbortError(selectedResult.reason)) {
          console.error('Failed to load selected product from database', selectedResult.reason);
        }
      }

      if (prodResult.status === 'fulfilled' && prodResult.value?.length > 0) {
        setAllDbProducts(prodResult.value.map(enrichProductMeta));
      } else if (prodResult.status === 'rejected' && !isRequestAbortError(prodResult.reason)) {
        console.error('Failed to load products from database', prodResult.reason);
      }

      if (catResult.status === 'fulfilled' && catResult.value?.length > 0) {
        setDbCategories(catResult.value);
      } else if (catResult.status === 'rejected' && !isRequestAbortError(catResult.reason)) {
        console.error('Failed to load categories from database', catResult.reason);
      }
    };
    loadData();

    const handleGlobalToast = (e) => {
      showToast(e.detail);
    };
    window.addEventListener('show-toast', handleGlobalToast);

    return () => {
      ignoreResult = true;
      window.removeEventListener('show-toast', handleGlobalToast);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [productId]);

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
    const routeSelectedProduct = selectedDbProduct && String(selectedDbProduct.id) === String(productId)
      ? selectedDbProduct
      : null;
    const listMatch = rawProducts.find(p => String(p.id) === productId);
    const baseProd = routeSelectedProduct || listMatch || (!isDatabaseProductId ? rawProducts[0] : null);

    if (!baseProd) {
      return null;
    }
    
    // Resolve full detailed specs mapping
    const detailedSpecs = STORE_PRODUCTS_DETAILS[baseProd.id] || {
      id: baseProd.id,
      title: baseProd.title,
      price: typeof baseProd.price === 'string' ? parseFloat(baseProd.price.replace(/[^\d.]/g, '')) : Number(baseProd.price),
      oldPrice: baseProd.old_price 
        ? Number(baseProd.old_price) 
        : (typeof baseProd.price === 'string' ? parseFloat(baseProd.price.replace(/[^\d.]/g, '')) * 1.25 : Number(baseProd.price) * 1.25),
      rating: baseProd.rating || 4.8,
      reviewsCount: baseProd.reviewsCount || 12,
      image: resolveProductImage(baseProd),
      category: getProductCategoryName(baseProd) || "Workspace Accessories",
      subcategory: getProductSubcategory(baseProd) || "Desk Accessory",
      brand: getProductBrandName(baseProd),
      vibe: baseProd.vibe || "minimalist",
      discount: baseProd.old_price 
        ? `-${Math.round((1 - (typeof baseProd.price === 'string' ? parseFloat(baseProd.price.replace(/[^\d.]/g, '')) : Number(baseProd.price)) / Number(baseProd.old_price)) * 100)}%`
        : (baseProd.discount || "-15%"),
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
  }, [productId, allDbProducts, selectedDbProduct, isDatabaseProductId]);

  // Resolve active gallery images list
  const productImages = useMemo(() => {
    if (!productInfo) {
      return [];
    }

    // If specific mapping exists, return it
    if (PRODUCT_IMAGES_MAP[productInfo.id]) {
      return PRODUCT_IMAGES_MAP[productInfo.id];
    }
     
    // Otherwise, generate a list of 4 thumbnails using the base product image
    const rawProducts = allDbProducts.length > 0 ? allDbProducts : STATIC_PRODUCTS_FALLBACK;
    const routeSelectedProduct = selectedDbProduct && String(selectedDbProduct.id) === String(productId)
      ? selectedDbProduct
      : null;
    const listMatch = rawProducts.find(p => String(p.id) === productId);
    const baseProd = routeSelectedProduct || listMatch || (!isDatabaseProductId ? rawProducts[0] : null);
    return resolveProductGallery(baseProd);
  }, [productId, productInfo, allDbProducts, selectedDbProduct, isDatabaseProductId]);

  // Resolve related products (same category or vibe)
  const relatedProducts = useMemo(() => {
    if (!productInfo) {
      return [];
    }

    const rawProducts = allDbProducts.length > 0 ? allDbProducts : STATIC_PRODUCTS_FALLBACK;
    return rawProducts
      .filter(p => String(p.id) !== String(productInfo.id) && (getProductCategoryName(p) === productInfo.category || p.vibe === productInfo.vibe || getProductSubcategory(p) === productInfo.subcategory))
      .slice(0, 4);
  }, [productInfo, allDbProducts]);

  // Curated bundle items (must be different from the main product, match vibe or category)
  const bundleItems = useMemo(() => {
    if (!productInfo) {
      return [];
    }

    const rawProducts = allDbProducts.length > 0 ? allDbProducts : STATIC_PRODUCTS_FALLBACK;
    let items = rawProducts.filter(p => String(p.id) !== String(productInfo.id) && p.vibe === productInfo.vibe);
    if (items.length < 2) {
      const categoryItems = rawProducts.filter(p => String(p.id) !== String(productInfo.id) && getProductCategoryName(p) === productInfo.category && !items.find(it => it.id === p.id));
      items = [...items, ...categoryItems];
    }
    if (items.length < 2) {
      const otherItems = rawProducts.filter(p => p.id !== productInfo.id && !items.find(it => it.id === p.id));
      items = [...items, ...otherItems];
    }
    return items.slice(0, 2);
  }, [productInfo, allDbProducts]);

  // Initialize bundle item selections when product changes
  useEffect(() => {
    if (bundleItems.length > 0) {
      const initial = {};
      bundleItems.forEach(item => {
        initial[item.id] = true; // Pre-select to encourage purchases
      });
      setCheckedBundleItems(initial);
    }
  }, [productId, bundleItems]);

  // Calculate bundle price and discount (10% off)
  const bundlePrices = useMemo(() => {
    if (!productInfo) {
      return { subtotal: 0, discount: 0, total: 0 };
    }

    const basePrice = Number(productInfo.price);
    let extraPrice = 0;
    bundleItems.forEach(item => {
      if (checkedBundleItems[item.id]) {
        extraPrice += Number(item.price);
      }
    });
    const subtotal = basePrice + extraPrice;
    const discount = subtotal * 0.10;
    const total = subtotal - discount;
    return { subtotal, discount, total };
  }, [productInfo, bundleItems, checkedBundleItems]);

  // Resolve dynamic colors and glows based on the vibe
  const vibeStyle = useMemo(() => {
    const vibe = (productInfo?.vibe || 'minimalist').toLowerCase();
    if (vibe.includes('walnut') || vibe.includes('wood') || vibe.includes('organic')) {
      return {
        glow: 'bg-amber-500/20',
        glowLight: 'bg-amber-500/5',
        text: 'text-amber-400',
        textHover: 'hover:text-amber-300',
        border: 'border-amber-500/30',
        borderHover: 'hover:border-amber-500/50',
        bg: 'bg-amber-500/10',
        badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        button: 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20 focus:ring-amber-500/50',
        tabActive: 'text-amber-400 border-amber-500',
        tabLine: 'bg-amber-500',
        accentGlow: 'from-amber-600/10 to-transparent'
      };
    } else if (vibe.includes('cyberpunk') || vibe.includes('rgb')) {
      return {
        glow: 'bg-purple-500/20',
        glowLight: 'bg-purple-500/5',
        text: 'text-purple-400',
        textHover: 'hover:text-purple-300',
        border: 'border-purple-500/30',
        borderHover: 'hover:border-purple-500/50',
        bg: 'bg-purple-500/10',
        badge: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
        button: 'bg-purple-600 hover:bg-purple-700 text-white font-black shadow-lg shadow-purple-600/20 focus:ring-purple-500/50',
        tabActive: 'text-purple-400 border-purple-500',
        tabLine: 'bg-purple-500',
        accentGlow: 'from-purple-600/10 to-transparent'
      };
    } else { // minimalist / black / standard
      return {
        glow: 'bg-blue-500/20',
        glowLight: 'bg-blue-500/5',
        text: 'text-blue-400',
        textHover: 'hover:text-blue-300',
        border: 'border-white/10',
        borderHover: 'hover:border-blue-500/35',
        bg: 'bg-blue-500/10',
        badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
        button: 'bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-600/20 focus:ring-blue-500/50',
        tabActive: 'text-blue-400 border-blue-500',
        tabLine: 'bg-blue-500',
        accentGlow: 'from-blue-600/10 to-transparent'
      };
    }
  }, [productInfo?.vibe]);

  const cartProduct = useMemo(() => ({
    id: productInfo?.id,
    title: productInfo?.title,
    price: productInfo?.price,
    image: productImages[0],
    stock: productInfo?.stock || 0,
    brand: productInfo?.brand,
    category: productInfo?.category,
  }), [productImages, productInfo]);

  const handleAddToCart = () => {
    if (!productInfo) return;
    addItem(cartProduct, quantity);
    showToast(`Added ${quantity}x "${productInfo.title}" to cart.`);
  };

  const handleBuyNow = () => {
    if (!productInfo) return;
    navigate('/cart', {
      state: {
        mode: 'buy-now',
        items: [{ ...cartProduct, quantity }],
      },
    });
  };

  if (!productInfo) {
    return (
      <div className={`min-h-screen font-sans ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-[#070a13] text-slate-100'}`}>
        <Navbar />
        <main className="min-h-[70vh] max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 py-16 flex items-center justify-center">
          <div className={`w-full max-w-md rounded-2xl border p-8 text-center ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0c1325]/70 border-white/[0.08] shadow-2xl'}`}>
            {selectedProductStatus === 'error' ? (
              <>
                <Info className={`w-8 h-8 mx-auto mb-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                <h1 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Product not found</h1>
                <p className={`text-sm mt-2 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>This product is no longer available in the catalog.</p>
                <Link to="/category/All" className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 text-xs font-black uppercase tracking-widest transition-colors">
                  Browse Products
                </Link>
              </>
            ) : (
              <>
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
                <h1 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>Loading product</h1>
                <p className={`text-sm mt-2 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Fetching the selected catalog item.</p>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-[#070a13] text-slate-100'}`}>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl flex items-center gap-3 border max-w-sm ${isLight ? 'bg-white text-slate-900 border-slate-200 shadow-xl' : 'bg-[#0d1527] text-white border-white/[0.08] shadow-2xl'}`}
          >
            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-sm font-bold tracking-wide">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      {/* 2. Breadcrumbs Bar */}
      <div className={`border-b py-3.5 backdrop-blur-md ${isLight ? 'bg-white/90 border-slate-200' : 'bg-[#0b1021]/50 border-white/[0.06]'}`}>
        <div className={`max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 flex flex-wrap items-center gap-2 text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <ChevronRight className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />
          <Link to="/category/All" className="hover:text-blue-400 transition-colors">Categories</Link>
          <ChevronRight className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />
          <Link to={`/category/${encodeURIComponent(productInfo.category)}`} className="hover:text-blue-400 transition-colors">{productInfo.category}</Link>
          <ChevronRight className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />
          <span className={isLight ? 'text-slate-500' : 'text-slate-500'}>{productInfo.subcategory}</span>
          <ChevronRight className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-600'}`} />
          <span className={`${vibeStyle.text} font-bold`}>{productInfo.title}</span>
        </div>
      </div>

      {/* 3. Main Product details block (2 Column Grid) */}
      <main className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 py-10 relative">
        
        {/* Dynamic Vibe ambient background glow */}
        <div className={`absolute top-[10%] left-[20%] w-[350px] h-[350px] rounded-full blur-[130px] opacity-15 pointer-events-none transition-all duration-700 ${vibeStyle.glow}`}></div>
        <div className={`absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full blur-[140px] opacity-10 pointer-events-none transition-all duration-700 ${vibeStyle.glow}`}></div>

        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 rounded-3xl p-6 md:p-8 relative z-10 ${isLight ? 'bg-white border border-slate-200 shadow-xl' : 'bg-[#0c1325]/40 border border-white/[0.08] shadow-2xl backdrop-blur-xl'}`}>
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-4">
            
            {/* Large Active Preview Frame */}
            <div className={`rounded-2xl aspect-[4/3] flex items-center justify-center p-0 relative group overflow-hidden select-none ${isLight ? 'border border-slate-200 bg-gradient-to-b from-slate-100 to-white' : 'border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent'}`}>
              
              {/* Product Background reflection glow */}
              <div className={`absolute w-[60%] h-[60%] rounded-full blur-[80px] opacity-10 pointer-events-none transition-all duration-700 ${vibeStyle.glow}`}></div>

              <motion.img 
                key={activeImageIdx}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                src={productImages[activeImageIdx] || productImages[0] || productInfo.image} 
                alt={productInfo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 relative z-10"
              />
              
              <div className="absolute right-4 top-4 flex flex-col gap-2 z-20">
                <button className={`rounded-full border p-2.5 hover:text-rose-500 hover:scale-105 shadow-md active:scale-95 transition-all ${isLight ? 'border-slate-200 bg-white text-slate-500' : 'border-white/10 bg-slate-900/80 backdrop-blur-md text-slate-400'}`}>
                  <Heart className="h-4.5 w-4.5" />
                </button>
                <button className={`rounded-full border p-2.5 hover:text-blue-500 hover:scale-105 shadow-md active:scale-95 transition-all ${isLight ? 'border-slate-200 bg-white text-slate-500' : 'border-white/10 bg-slate-900/80 backdrop-blur-md text-slate-400'}`}>
                  <Share2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Thumbnail selector row */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
              {productImages.map((imgUrl, idx) => {
                const isSelected = activeImageIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`h-20 w-20 rounded-xl border shrink-0 p-1 flex items-center justify-center overflow-hidden transition-all ${
                      isSelected 
                        ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5' 
                        : isLight
                          ? 'border-slate-300 bg-white hover:border-slate-400'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
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
                <span className="h-2 w-[1px] bg-slate-700"></span>
                <span>{productInfo.subcategory}</span>
              </div>

              {/* Product Title */}
              <h1 className={`text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {productInfo.title}
              </h1>

              {/* Rating block */}
              <div className={`flex items-center gap-3 mt-3 pb-4 border-b ${isLight ? 'border-slate-200' : 'border-white/[0.08]'}`}>
                <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-lg">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{productInfo.rating}</span>
                </div>
                <span className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{productInfo.reviewsCount} verified reviews</span>
                <span className="h-3 w-[1px] bg-white/[0.08]"></span>
                <span className="text-xs text-rose-400 font-extrabold animate-pulse">{productInfo.live}</span>
              </div>

              {/* Pricing section */}
              <div className={`mt-5 rounded-2xl border p-4 flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/10'}`}>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Store Price</p>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-rose-500 tracking-tight">
                      LKR {Number(productInfo.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className={`text-xs line-through ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                      LKR {Number(productInfo.oldPrice).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
                <div className="bg-rose-500/20 text-rose-300 border border-rose-500/30 font-black text-xs px-3 py-1.5 rounded-lg shadow-sm">
                  {productInfo.discount} OFF
                </div>
              </div>

              {/* Product summary */}
              <p className={`mt-5 text-sm leading-relaxed font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {productInfo.description}
              </p>

              {/* Options selection */}
              <div className="mt-6 space-y-4">
                {/* Color option selection */}
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-wider mb-2 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Select Color</h3>
                  <div className="flex gap-2">
                    {['Space Grey', 'Matte Black', 'Silver'].map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedColor === color 
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-sm' 
                            : isLight
                              ? 'border-slate-300 hover:border-slate-400 text-slate-700 bg-white'
                              : 'border-white/10 hover:border-white/20 text-slate-300 bg-white/[0.01]'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aesthetic vibe style option */}
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-wider mb-2 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Setup Vibe Style</h3>
                  <div className="flex gap-2">
                    {['Stealth Black', 'Cream Minimalist', 'Walnut & Wood'].map(vibeStyleOption => (
                      <button
                        key={vibeStyleOption}
                        onClick={() => setSelectedVibe(vibeStyleOption)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedVibe === vibeStyleOption 
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-sm' 
                            : isLight
                              ? 'border-slate-300 hover:border-slate-400 text-slate-700 bg-white'
                              : 'border-white/10 hover:border-white/20 text-slate-300 bg-white/[0.01]'
                        }`}
                      >
                        {vibeStyleOption}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity and CTA purchase blocks */}
            <div className={`mt-8 pt-6 border-t ${isLight ? 'border-slate-200' : 'border-white/[0.08]'}`}>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Quantity adjuster */}
                <div className={`flex items-center border rounded-xl p-1 shrink-0 ${isLight ? 'border-slate-300 bg-white' : 'border-white/10 bg-white/[0.02]'}`}>
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className={`p-2 rounded-lg transition-colors ${isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className={`w-10 text-center text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className={`p-2 rounded-lg transition-colors ${isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to cart button */}
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 w-full text-xs uppercase tracking-widest py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-all ${vibeStyle.button}`}
                >
                  <ShoppingCart className="w-4.5 h-4.5 fill-current" />
                  Add to Cart
                </button>

                {/* Buy now button */}
                <button 
                  onClick={handleBuyNow}
                  className={`w-full sm:w-auto font-black text-xs uppercase tracking-widest py-3.5 px-6 rounded-2xl active:scale-98 transition-all whitespace-nowrap ${isLight ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-white hover:bg-slate-200 text-[#070a13]'}`}
                >
                  Buy Now
                </button>
              </div>

              {/* Trust markers */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-5 text-[11px] font-semibold text-slate-400">
                <span className="flex items-center gap-1"><Truck className="w-4 h-4 text-emerald-400" /> Free Shipping</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 1-Year Warranty</span>
                <span className="flex items-center gap-1"><RotateCcw className="w-4 h-4 text-emerald-400" /> 30-Day returns</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* 4. Tabs & Stylist advice card grid */}
      <section className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 py-6 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Product Tabs details */}
          <div className={`xl:col-span-8 rounded-3xl p-6 md:p-8 ${isLight ? 'bg-white border border-slate-200 shadow-xl' : 'bg-[#0c1325]/40 border border-white/[0.08] backdrop-blur-xl shadow-2xl'}`}>
            <div className={`flex border-b pb-3 gap-6 mb-6 ${isLight ? 'border-slate-200' : 'border-white/[0.08]'}`}>
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
                      ? vibeStyle.text 
                      : isLight
                        ? 'text-slate-500 hover:text-slate-800'
                        : 'text-slate-500 hover:text-slate-350'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="productTabLine" className={`absolute bottom-0 inset-x-0 h-1 rounded-full ${vibeStyle.tabLine}`} />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className={`text-sm leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
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
                <div className={`overflow-hidden border rounded-2xl ${isLight ? 'border-slate-200' : 'border-white/[0.08]'}`}>
                  <table className="w-full text-left text-xs md:text-sm font-medium">
                    <tbody>
                      {Object.entries(productInfo.specs).map(([key, val], idx) => (
                        <tr key={key} className={idx % 2 === 0 ? (isLight ? 'bg-slate-50' : 'bg-white/[0.02]') : 'bg-transparent'}>
                          <td className={`p-3.5 font-black border-b w-1/3 ${isLight ? 'text-slate-900 border-slate-200' : 'text-white border-white/[0.08]'}`}>{key}</td>
                          <td className={`p-3.5 border-b ${isLight ? 'text-slate-600 border-slate-200' : 'text-slate-400 border-white/[0.08]'}`}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {productInfo.reviews.map((rev, idx) => (
                    <div key={idx} className={`pb-6 border-b last:pb-0 last:border-0 ${isLight ? 'border-slate-200' : 'border-white/[0.08]'}`}>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <p className={`font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>{rev.name}</p>
                          <div className="flex gap-0.5 text-amber-400 mt-1">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <span className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{rev.date}</span>
                      </div>
                      <p className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{rev.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Block: Mia Concierge advice card */}
          <div className={`xl:col-span-4 rounded-3xl p-6 md:p-8 relative overflow-hidden shrink-0 ${isLight ? 'bg-white border border-slate-200 shadow-xl' : 'bg-gradient-to-br from-[#0e1732]/70 to-[#16234b]/70 border border-white/[0.1] shadow-2xl backdrop-blur-xl'}`}>
            {/* Hologram active overlay */}
            <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-blue-500/15 rounded-full blur-[60px] animate-pulse pointer-events-none"></div>
            
            <div className={`flex items-center justify-between mb-6 relative z-10 pb-4 border-b ${isLight ? 'border-slate-200' : 'border-white/[0.08]'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center relative overflow-hidden">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <div className="absolute inset-0 bg-blue-400/10 animate-ping rounded-xl pointer-events-none"></div>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-blue-400 leading-none">Stylist Concierge</p>
                  <h4 className={`text-sm font-extrabold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>Mia's Workspace Advice</h4>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">Hologram Active</span>
              </div>
            </div>

            {/* Bubble style advice */}
            <div className={`relative rounded-2xl p-5 mb-6 text-sm leading-relaxed font-medium overflow-hidden shadow-inner ${isLight ? 'bg-slate-50 border border-slate-200 text-slate-700' : 'bg-white/[0.03] border border-white/10 text-slate-200'}`}>
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-scan"></div>
              "{productInfo.miaAdvice}"
              <div className={`absolute bottom-[-8px] left-8 w-4 h-4 border-r border-b rotate-45 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0e1732] border-white/10'}`}></div>
            </div>

            {/* Concierge Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#21366d]/90 to-[#13224a] border border-white/10 overflow-hidden flex items-end justify-center relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src="https://res.cloudinary.com/ddarldtbb/image/upload/v1779814719/i_need_this_girl_alone_202605262138-removebg-preview_czgnx1.png"
                  alt="Mia Concierge Avatar"
                  className="w-[124%] h-[124%] object-contain -mb-1 relative z-10 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div>
                <p className={`text-xs font-black flex items-center gap-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Mia Concierge
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-500/20" />
                </p>
                <p className={`text-[10px] font-bold mt-0.5 uppercase tracking-wide ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Workspace Curation Specialist</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Dynamic Bundle Builder Section */}
      {bundleItems.length > 0 && (
        <section className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 py-10 relative z-10">
          <div className={`rounded-3xl p-6 md:p-8 ${isLight ? 'bg-white border border-slate-200 shadow-xl' : 'bg-[#0d1527]/40 backdrop-blur-xl border border-white/[0.08] shadow-2xl'}`}>
            <h3 className={`text-xl font-black tracking-tight mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Complete the Workspace Setup</h3>
            <p className={`text-sm mb-6 font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Get Mia's handpicked aesthetic workspace accessories and save 10% on the bundle.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Bundle items list */}
              <div className="lg:col-span-8 flex flex-col md:flex-row items-center gap-6">
                
                {/* Main Product Card */}
                <div className={`w-full md:w-1/3 rounded-2xl p-4 flex flex-col items-center relative ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-white/[0.03] border border-white/10'}`}>
                  <div className="absolute top-3 left-3 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                    This Item
                  </div>
                  <div className="h-28 w-28 flex items-center justify-center p-0 mb-3 bg-gradient-to-b from-white/[0.05] to-transparent rounded-xl overflow-hidden">
                    <img src={productInfo.image || productImages[0]} alt={productInfo.title} className="w-full h-full object-cover" />
                  </div>
                  <h4 className={`text-xs font-black text-center line-clamp-1 w-full ${isLight ? 'text-slate-900' : 'text-white'}`}>{productInfo.title}</h4>
                  <p className="text-sm font-black text-rose-500 mt-2">LKR {Number(productInfo.price).toLocaleString('en-US')}</p>
                </div>
                
                {/* Plus Icon */}
                <Plus className="w-5 h-5 text-slate-500 shrink-0 hidden md:block" />
                
                {/* Extra Item 1 */}
                {bundleItems[0] && (
                  <div 
                    onClick={() => {
                      const id = bundleItems[0].id;
                      setCheckedBundleItems(prev => ({ ...prev, [id]: !prev[id] }));
                    }}
                    className={`w-full md:w-1/3 border rounded-2xl p-4 flex flex-col items-center cursor-pointer transition-all duration-350 relative select-none ${
                      checkedBundleItems[bundleItems[0].id] 
                        ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/5' 
                        : isLight
                          ? 'border-slate-300 hover:border-slate-400 bg-white'
                          : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
                    }`}
                  >
                    <div className="absolute top-3 left-3">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        checkedBundleItems[bundleItems[0].id] ? 'bg-blue-500 border-blue-500' : 'border-white/20'
                      }`}>
                        {checkedBundleItems[bundleItems[0].id] && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                      </div>
                    </div>
                    <div className="h-28 w-28 flex items-center justify-center p-0 mb-3 bg-gradient-to-b from-white/[0.05] to-transparent rounded-xl overflow-hidden">
                      <img src={resolveProductImage(bundleItems[0])} alt={bundleItems[0].title} className="w-full h-full object-cover" />
                    </div>
                    <h4 className={`text-xs font-black text-center line-clamp-1 w-full ${isLight ? 'text-slate-900' : 'text-white'}`}>{bundleItems[0].title}</h4>
                    <p className={`text-sm font-black mt-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>LKR {Number(bundleItems[0].price).toLocaleString('en-US')}</p>
                  </div>
                )}
                
                {/* Plus Icon */}
                {bundleItems[1] && <Plus className="w-5 h-5 text-slate-500 shrink-0 hidden md:block" />}
                
                {/* Extra Item 2 */}
                {bundleItems[1] && (
                  <div 
                    onClick={() => {
                      const id = bundleItems[1].id;
                      setCheckedBundleItems(prev => ({ ...prev, [id]: !prev[id] }));
                    }}
                    className={`w-full md:w-1/3 border rounded-2xl p-4 flex flex-col items-center cursor-pointer transition-all duration-350 relative select-none ${
                      checkedBundleItems[bundleItems[1].id] 
                        ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/5' 
                        : isLight
                          ? 'border-slate-300 hover:border-slate-400 bg-white'
                          : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
                    }`}
                  >
                    <div className="absolute top-3 left-3">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        checkedBundleItems[bundleItems[1].id] ? 'bg-blue-500 border-blue-500' : 'border-white/20'
                      }`}>
                        {checkedBundleItems[bundleItems[1].id] && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                      </div>
                    </div>
                    <div className="h-28 w-28 flex items-center justify-center p-0 mb-3 bg-gradient-to-b from-white/[0.05] to-transparent rounded-xl overflow-hidden">
                      <img src={resolveProductImage(bundleItems[1])} alt={bundleItems[1].title} className="w-full h-full object-cover" />
                    </div>
                    <h4 className={`text-xs font-black text-center line-clamp-1 w-full ${isLight ? 'text-slate-900' : 'text-white'}`}>{bundleItems[1].title}</h4>
                    <p className={`text-sm font-black mt-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>LKR {Number(bundleItems[1].price).toLocaleString('en-US')}</p>
                  </div>
                )}
                
              </div>
              
              {/* Bundle Checkout Box */}
              <div className={`lg:col-span-4 rounded-2xl p-5 md:p-6 shadow-xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-white/[0.03] border border-white/10'}`}>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Setup Bundle Summary</p>
                <div className={`space-y-2.5 pb-4 border-b text-xs ${isLight ? 'border-slate-200' : 'border-white/[0.08]'}`}>
                  <div className={`flex justify-between ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    <span>Selected Items Subtotal</span>
                    <span>LKR {bundlePrices.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-extrabold">
                    <span>Bundle Discount (10% Off)</span>
                    <span>-LKR {bundlePrices.discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="pt-4 flex justify-between items-baseline mb-5">
                  <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Final Bundle Price</span>
                  <span className="text-2xl font-black text-emerald-400 tracking-tight">
                    LKR {bundlePrices.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button
                  onClick={() => {
                    addItem(cartProduct, 1);
                    const selectedBundleItems = bundleItems.filter(item => checkedBundleItems[item.id]);
                    selectedBundleItems.forEach(item => addItem(item, 1));
                    showToast(`Added setup bundle (${selectedBundleItems.length + 1} items) to your cart.`);
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-[#070a13] font-black text-xs uppercase tracking-widest py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/10 active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4 fill-current" />
                  Add Setup Bundle to Cart
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 py-10 relative z-10">
          <h2 className={`text-2xl font-black tracking-tight mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>Related Accessories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(prod => {
              const priceFormatted = typeof prod.price === 'string' 
                ? prod.price 
                : `LKR ${Number(prod.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

              return (
                <Link 
                  key={prod.id} 
                  to={`/product/${prod.id}`}
                  className={`group relative overflow-hidden rounded-2xl border p-3.5 shadow-sm hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between ${isLight ? 'border-slate-200 bg-white hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)]' : 'border-white/[0.08] bg-[#0c1325]/40 hover:shadow-[0_12px_28px_rgba(0,0,0,0.2)] backdrop-blur-md'}`}
                >
                  <div>
                    <div className={`h-44 rounded-xl border p-0 flex items-center justify-center overflow-hidden relative ${isLight ? 'border-slate-200 bg-slate-100' : 'border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent'}`}>
                      <img src={resolveProductImage(prod)} alt={prod.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 relative z-10" />
                    </div>
                    <div className={`mt-3 flex items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                      <span>{prod.brand}</span>
                    </div>
                    <h3 className={`mt-1 text-xs font-bold leading-snug transition-colors line-clamp-2 min-h-[32px] ${isLight ? 'text-slate-800 group-hover:text-blue-600' : 'text-slate-300 group-hover:text-blue-400'}`}>
                      {prod.title}
                    </h3>
                  </div>

                  <div className={`mt-4 pt-3 border-t flex items-center justify-between ${isLight ? 'border-slate-200' : 'border-white/[0.08]'}`}>
                    <span className={`text-xs font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{priceFormatted}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${isLight ? 'bg-slate-100 border border-slate-200 text-slate-700' : 'bg-white/5 border border-white/10 text-slate-300'}`}>
                      {prod.vibe}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <Footer />

    </div>
  );
}
