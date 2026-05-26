import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { 
  Search, Heart, ShoppingCart, Bell, MapPin, Truck, 
  Sparkles, RotateCcw, HeadphonesIcon, Zap, ChevronDown,
  Smartphone, Laptop, Gamepad2, Home, Watch, Headphones,
  Camera, Cable, Mic, X, CheckCircle2, User, Play,
  ShoppingBag, ShieldCheck, ArrowRight
} from 'lucide-react';

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

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8faff] font-sans overflow-x-hidden text-slate-800">
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
          </div>
        </div>
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
            <div className="bg-blue-50 p-1.5 rounded-full"><Sparkles className="w-4 h-4 text-blue-600" /></div>
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
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#eef3ff] via-[#f4f7ff] to-[#e8f0ff] min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-126px)] flex">
        {/* Full-width decorative background blobs */}
        <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-bl from-blue-100/70 via-blue-50/40 to-transparent pointer-events-none"></div>
        <div className="absolute top-1/3 left-[30%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[120px] pointer-events-none"></div>

        <main className="relative max-w-[1720px] mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-8 2xl:px-12 pt-2 sm:pt-4 xl:pt-6 pb-4 sm:pb-6 xl:pb-4 2xl:pb-8 flex flex-col xl:grid xl:grid-cols-[minmax(300px,360px)_minmax(560px,1fr)_minmax(220px,250px)] 2xl:grid-cols-[minmax(360px,430px)_minmax(760px,1fr)_minmax(280px,320px)] items-center xl:items-center justify-center xl:content-center gap-3 sm:gap-5 xl:gap-5 2xl:gap-10 min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-126px)]">
        
        {/* Left Column - Content */}
        <div className="w-full xl:w-auto xl:max-w-[390px] 2xl:max-w-[430px] z-20 flex flex-col items-center xl:items-start justify-center shrink-0 text-center xl:text-left mt-2 xl:mt-0">
          <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm mb-3 xl:mb-4 relative z-10">
            <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            AI-Powered Electronics Marketplace
          </div>
          
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
        <div className="w-full xl:w-auto relative z-10 flex items-center justify-center min-h-[180px] sm:min-h-[260px] md:min-h-[340px] lg:min-h-[420px] xl:min-h-[520px] 2xl:min-h-[680px] mt-1 sm:mt-2 xl:mt-0">
          
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

        {/* Right Column - Voice Panel with Magic Animated Border */}
        <div className="hidden xl:flex shrink-0 w-[240px] 2xl:w-[300px] h-[420px] 2xl:h-[560px] rounded-[32px] shadow-2xl relative overflow-hidden z-20">
          
          {/* Spinning conic gradient creates the glowing border — clipped to panel bounds by overflow-hidden */}
          <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,#3b82f6_40%,#818cf8_50%,transparent_60%)] animate-spin-slow"></div>

          {/* Inner panel — 1.5px inset reveals the spinning border edge */}
          <div className="absolute inset-[1.5px] bg-gradient-to-b from-[#0e1732] to-[#16234b] rounded-[30px] overflow-hidden flex flex-col items-center justify-between py-7 px-6">
            
            {/* Glow blobs */}
            <div className="absolute bottom-[-10%] right-[-20%] w-64 h-64 bg-blue-600/20 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute top-[20%] left-[-20%] w-40 h-40 bg-indigo-500/20 rounded-full blur-[40px] pointer-events-none"></div>

            {/* Header */}
            <div className="w-full flex justify-between items-center text-white relative z-10">
              <div>
                <p className="font-semibold text-sm">Voice Shop Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-[11px] text-slate-400">Online</span>
                </div>
              </div>
              <X className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
            </div>

            {/* Visualizer + message */}
            <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full relative z-10">
            {/* Animated Visualizer */}
            <div className="flex items-center gap-[3px] h-16 w-full justify-center px-4">
              {[35, 55, 25, 80, 45, 95, 100, 70, 45, 85, 50, 75, 30, 55, 40].map((h, i) => (
                <VisualizerBar key={i} baseHeight={h} delay={i * 0.08} />
              ))}
            </div>
            <div className="text-center text-slate-300 text-sm space-y-1 font-medium">
              <p>Hi! I'm your AI voice assistant.</p>
              <p>How can I help you shop today?</p>
            </div>
            </div>

            {/* Animated Mic Button */}
            <div className="flex flex-col items-center gap-3 relative z-10">
              <div className="relative flex items-center justify-center">
                {/* Outer pulse ring 1 */}
                <motion.div
                  className="absolute w-28 h-28 rounded-full border border-blue-400/30"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0 }}
                />
                {/* Outer pulse ring 2 */}
                <motion.div
                  className="absolute w-28 h-28 rounded-full border border-blue-400/20"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
                />
                {/* Inner glowing ring */}
                <motion.div
                  className="absolute w-24 h-24 rounded-full border-2 border-blue-500/50"
                  animate={{ scale: [1, 1.15, 1], opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                />
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.7)]"
                >
                  <Mic className="text-white w-8 h-8" />
                </motion.button>
              </div>
              <p className="text-white text-xs font-semibold tracking-wide">Tap to speak</p>
            </div>
          </div>
        </div>
      </main>
      </section>



    </div>
  );
}
