import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, ArrowRight, Zap, ShieldCheck, DollarSign, 
  ChevronDown, Award, TrendingUp, Users, Heart
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const sellerVideoUrl = new URL('../../Media/2ce03433-a612-48e7-9c75-05b1c7704e60.webm', import.meta.url).href;

const MERCHANTS = [
  {
    id: 1,
    name: "Colombo Desk Setups",
    coverImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    since: "2022",
    tagline: "Premium walnut workspace accessories and monitor stands.",
    successMetric: "LKR 4.5M GMV",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    owner: "Dilhan Perera"
  },
  {
    id: 2,
    name: "Keychron Sri Lanka",
    coverImage: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop",
    since: "2023",
    tagline: "Mechanical keyboards and tactile desk tools.",
    successMetric: "12,000+ Orders",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=150&auto=format&fit=crop",
    owner: "Rumesh Perera"
  },
  {
    id: 3,
    name: "Aura Smart Lights",
    coverImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=600&auto=format&fit=crop",
    since: "2024",
    tagline: "Intelligent ambient lighting for home workspaces.",
    successMetric: "99.4% Rating",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    owner: "Nadini Senanayake"
  },
  {
    id: 4,
    name: "Acoustic Audio LKR",
    coverImage: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=600&auto=format&fit=crop",
    since: "2021",
    tagline: "Studio grade studio monitors and headphones.",
    successMetric: "LKR 12.8M Sales",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    owner: "Kevin Silva"
  }
];

export default function BecomeSeller() {
  // Calculator States
  const [avgPrice, setAvgPrice] = useState(15000); 
  const [monthlyOrders, setMonthlyOrders] = useState(120); 

  // Calculated values
  const monthlyGmv = avgPrice * monthlyOrders;
  const platformFee = monthlyGmv * 0.05; 
  const netEarnings = monthlyGmv - platformFee;

  // Active Merchant for Interactive Showcase
  const [activeMerchantId, setActiveMerchantId] = useState(1);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "How much does it cost to sell on Tech-Hub?",
      a: "There are absolutely no setup costs, listing fees, or monthly subscription plans. We operate on a success-based model, charging a flat 5% commission on completed sales. You only pay when you make money."
    },
    {
      q: "How do payouts work for Sri Lankan bank accounts?",
      a: "All earnings are settled directly to your designated bank account every 14 days (bi-weekly). We support all major commercial banks in Sri Lanka with automated bank transfers."
    },
    {
      q: "Can I sell without a registered business?",
      a: "Yes! You can sign up as an Individual Seller. You do not need business registration (BR) documents to get started. You can upgrade to a Registered Company account later as you grow."
    },
    {
      q: "How are products delivered to customers?",
      a: "We are integrated with Sri Lanka's leading delivery networks. When an order is placed, you can generate a shipping label in one click from your Seller Dashboard. The courier will pick up the package from your location."
    },
    {
      q: "What products are allowed on Tech-Hub?",
      a: "We focus exclusively on consumer electronics, smart home devices, workspace ergonomics, developer hardware, computer components, accessories, and audio gear."
    }
  ];

  // Framer Motion Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 80, damping: 15 } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-[#dce3f0] font-sans selection:bg-blue-500/30 selection:text-[#e8edf7] overflow-x-hidden">
      <Navbar />

      {/* 1. Hero Section with Background Video */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-16">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src={sellerVideoUrl} type="video/webm" />
          </video>
          {/* High-quality dark glassmorphic overlays */}
          <div className="absolute inset-0 video-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070a13]/40 via-transparent to-[#070a13]" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-[20%] left-[10%] w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-10" />
        <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-10" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/25 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6 shadow-lg shadow-blue-500/5 backdrop-blur-md"
          >
            <Store className="w-3.5 h-3.5" />
            Sell on Tech-Hub
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 70, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6"
          >
            Bring your tech business <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">to the next level.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 70, delay: 0.35 }}
            className="text-base sm:text-lg text-slate-355 max-w-2xl leading-relaxed mb-10 text-slate-300"
          >
            Join Sri Lanka's premium electronics marketplace. List your products, reach tech enthusiasts nationwide, and manage orders with an intuitive dashboard.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 70, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center"
          >
            <Link
              to="/login?tab=signup&role=vendor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/35 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Store className="w-4 h-4" />
              Create Vendor Account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.15] text-slate-200 font-bold text-sm px-8 py-4 rounded-2xl transition-all backdrop-blur-md"
            >
              Calculate Potential Earnings
            </a>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 70, delay: 0.65 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mt-20 pt-8 border-t border-white/[0.06] w-full max-w-4xl"
          >
            {[
              { val: "5,000+", label: "Active Vendors" },
              { val: "LKR 2.4B+", label: "Total Sales GMV" },
              { val: "50,000+", label: "Monthly Buyers" },
              { val: "5% Flat", label: "Lowest Commission" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-black text-white">{stat.val}</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. Value Propositions Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={fadeInUp}
        className="py-24 border-t border-white/[0.06] relative"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Everything you need to sell gadgets successfully.
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Unlike generic platforms, Tech-Hub is tailored specifically for consumer electronics and workspace hardware.
            </p>
          </div>

          {/* Grid */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <DollarSign className="w-6 h-6 text-blue-400" />,
                title: "0% Commission Startup",
                desc: "Get your business running without fees. Enjoy 0% commission on your first 10 successful sales. No hidden charges."
              },
              {
                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                title: "Smart Product Matches",
                desc: "Our matching engine pairs your listed items with customers searching for matching vibes (minimalist, walnut desk setup, etc.)."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
                title: "Seller Insurance & Safety",
                desc: "Get full chargeback protection and coverage for delivery damage. We hold funds in escrow until the product arrives safely."
              },
              {
                icon: <Users className="w-6 h-6 text-indigo-400" />,
                title: "Direct Client Chat",
                desc: "Talk to customers directly via live message. Clear technical queries, share setup tips, and build long-term relationships."
              },
              {
                icon: <Award className="w-6 h-6 text-blue-400" />,
                title: "Official Partner Status",
                desc: "Sellers with 98%+ positive feedback unlock the 'Ecosystem Partner' badge, boosting search ranking and buyer trust."
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-purple-400" />,
                title: "Sri Lanka's Largest Gadget Audience",
                desc: "Connect instantly with thousands of software engineers, creators, and professionals who actively build high-end workspaces."
              }
            ].map((prop, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.015, borderColor: "rgba(59, 130, 246, 0.3)" }}
                className="bg-[#0d1527]/50 border border-white/[0.06] rounded-3xl p-8 hover:bg-[#0d1527]/85 transition-all duration-300 group shadow-md cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/5 border border-white/[0.06] flex items-center justify-center mb-6 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                  {prop.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{prop.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{prop.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 3. Steps Onboarding */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={fadeInUp}
        className="py-24 border-t border-white/[0.06] bg-[#090e1a]/30 relative"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 rounded-full mb-6 inline-block">
                Onboarding Flow
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-6">
                Setting up your store takes less than 10 minutes.
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mb-10 leading-relaxed">
                We've simplified the seller onboarding experience down to three intuitive steps. No coding, no complicated setup, and no tech experience required.
              </p>
              
              <div className="space-y-8">
                {[
                  { step: "01", t: "Submit Application", d: "Click Create Vendor Account, input your personal info, choose your store name, and list your brand category." },
                  { step: "02", t: "List Your Gadgets", d: "Upload photos, specs, and prices. Utilize our integrated AI tool to automatically write description tags." },
                  { step: "03", t: "Go Live & Get Paid", d: "Receive orders instantly. Coupon/shipping labels are generated automatically. Payouts arrive directly every 14 days." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <span className="text-2xl font-black text-blue-500/30 leading-none shrink-0">{item.step}</span>
                    <div>
                      <h4 className="text-base font-extrabold text-white mb-2">{item.t}</h4>
                      <p className="text-xs sm:text-sm text-slate-450 leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Graphic/Mockup of vendor Portal */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-blue-600/10 rounded-[32px] blur-3xl pointer-events-none" />
              <div className="bg-[#0d1527]/70 border border-white/[0.08] rounded-[32px] p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-xl">
                {/* Mock Dashboard Header */}
                <div className="flex items-center justify-between pb-6 border-b border-white/[0.06] mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Store className="w-4.5 h-4.5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">Gadget Store Dashboard</p>
                      <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online & Live
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-lg text-slate-400 font-bold">
                    This Month
                  </span>
                </div>

                {/* Mock Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#070a13]/80 border border-white/[0.05] rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Sales</p>
                    <p className="text-lg font-black text-white mt-1">LKR 438,200</p>
                    <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
                      +18.4% vs last month
                    </span>
                  </div>
                  <div className="bg-[#070a13]/80 border border-white/[0.05] rounded-2xl p-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Orders Fulfill</p>
                    <p className="text-lg font-black text-white mt-1">34</p>
                    <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-0.5 mt-1">
                      100% success rate
                    </span>
                  </div>
                </div>

                {/* Mock Recent Sales list */}
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-3.5">Recent Orders</p>
                  <div className="space-y-3">
                    {[
                      { item: "Keychron K2 Mechanical Keyboard", price: "LKR 28,500", date: "Just now", status: "Ready to Ship" },
                      { item: "Felt Desk Mat (Dark Grey)", price: "LKR 5,800", date: "2 mins ago", status: "Courier Picked Up" },
                      { item: "Luxe Monitor Arm Stand", price: "LKR 14,900", date: "1 hour ago", status: "Delivered" }
                    ].map((order, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[11px]">
                        <div>
                          <p className="font-extrabold text-white">{order.item}</p>
                          <p className="text-slate-500 mt-0.5">{order.date} • {order.price}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          order.status === "Ready to Ship" 
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                            : order.status === "Delivered" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* 4. Interactive Potential Earnings Calculator */}
      <motion.section 
        id="calculator" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={fadeInUp}
        className="py-24 border-t border-white/[0.06] relative"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 rounded-full mb-4 inline-block">
              Revenue Estimator
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              See what you could earn on Tech-Hub.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              Use our interactive estimator tool to calculate potential monthly profits based on sales volume.
            </p>
          </div>

          <div className="bg-[#0d1527]/50 border border-white/[0.08] backdrop-blur-xl rounded-[32px] p-6 sm:p-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            
            {/* Sliders (Left Column) */}
            <div className="md:col-span-7 space-y-8">
              {/* Slider 1: Avg Price */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-350">Average Item Selling Price</span>
                  <span className="font-black text-white text-base">LKR {avgPrice.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="2000" 
                  max="200000" 
                  step="1000"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                  <span>LKR 2,000</span>
                  <span>LKR 100,000</span>
                  <span>LKR 200,000</span>
                </div>
              </div>

              {/* Slider 2: Monthly Orders */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-350">Estimated Monthly Orders</span>
                  <span className="font-black text-white text-base">{monthlyOrders} orders</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="500" 
                  step="5"
                  value={monthlyOrders}
                  onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                  <span>5 orders</span>
                  <span>250 orders</span>
                  <span>500 orders</span>
                </div>
              </div>
            </div>

            {/* Calculations Panel (Right Column) */}
            <div className="md:col-span-5 bg-[#070a13]/90 border border-white/[0.06] rounded-[24px] p-6 sm:p-8 flex flex-col justify-between h-full">
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estimated Monthly Volume</p>
                  <p className="text-xl font-extrabold text-white mt-1">LKR {monthlyGmv.toLocaleString()}</p>
                </div>
                
                <div className="flex justify-between items-center text-xs pb-4 border-b border-white/[0.06]">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    Tech-Hub flat commission (5%)
                  </span>
                  <span className="font-bold text-red-400">- LKR {platformFee.toLocaleString()}</span>
                </div>

                <div className="pt-2">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Your Potential Earnings</p>
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={netEarnings}
                      initial={{ scale: 0.96, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 180, damping: 10 }}
                      className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mt-1.5 drop-shadow"
                    >
                      LKR {netEarnings.toLocaleString()}
                    </motion.p>
                  </AnimatePresence>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold">Net payout after platform commission</p>
                </div>
              </div>

              <Link
                to="/login?tab=signup&role=vendor"
                className="mt-8 w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs py-4 rounded-xl text-center transition-all shadow-md shadow-blue-600/25 block hover:scale-[1.01] active:scale-99"
              >
                Claim 0% Commission Code
              </Link>
            </div>

          </div>
        </div>
      </motion.section>

      {/* 5. Join an All-Star Lineup (Shopify-Style Fan-Out Cards Component) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={fadeInUp}
        className="py-24 border-t border-white/[0.06] bg-[#090e1a]/30 relative overflow-hidden"
      >
        {/* Ambient background glows */}
        <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 rounded-full mb-4 inline-block">
              All-Star Lineup
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Join Sri Lanka's leading tech brands.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              See how independent workspace and hardware brands are scaling their operations on Tech-Hub. Click any card to expand their success card.
            </p>
          </div>

          {/* Overlapping Cards Container */}
          <div className="flex flex-nowrap md:flex-wrap items-center justify-center gap-4 sm:gap-6 py-10 overflow-x-auto no-scrollbar px-4 min-h-[460px]">
            {MERCHANTS.map((merchant) => {
              const isActive = activeMerchantId === merchant.id;
              
              return (
                <motion.div
                  layout
                  key={merchant.id}
                  onClick={() => setActiveMerchantId(merchant.id)}
                  transition={{ type: "spring", stiffness: 160, damping: 18 }}
                  className={`relative shrink-0 rounded-[32px] shadow-2xl overflow-hidden cursor-pointer ${
                    isActive 
                      ? "w-[320px] sm:w-[500px] h-[400px] bg-white text-slate-800 border border-slate-100 z-20" 
                      : "w-[160px] sm:w-[200px] h-[360px] bg-[#0d1527]/80 border border-white/[0.06] hover:border-blue-500/30 hover:scale-[1.03] text-slate-400 hover:text-white z-10 backdrop-blur-md"
                  }`}
                  style={{
                    transformOrigin: "bottom center"
                  }}
                  whileHover={!isActive ? { y: -8 } : {}}
                >
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      /* Active Detailed Card Layout */
                      <motion.div
                        key="active"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-white via-slate-50 to-slate-100"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
                              <Store className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-black text-slate-900 text-xs sm:text-sm tracking-tight">{merchant.name}</span>
                          </div>
                          <span className="inline-flex bg-slate-900 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                            SINCE {merchant.since}
                          </span>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-auto items-center">
                          <div className="space-y-3">
                            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                              {merchant.tagline}
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="font-bold">Growth Metric:</span> {merchant.successMetric}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span className="font-bold">Shipping:</span> Integrated island-wide network
                              </div>
                            </div>
                          </div>

                          <div className="relative h-32 sm:h-40 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                            <img 
                              src={merchant.coverImage} 
                              alt={merchant.name} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                        </div>

                        {/* Footer (Owner profile) */}
                        <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-1">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                              <img src={merchant.avatar} alt={merchant.owner} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-900 leading-none">{merchant.owner}</p>
                              <span className="text-[8px] font-bold text-slate-400 mt-0.5 block">Founder</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-450 flex items-center gap-1.5">
                            Active Setup <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      /* Inactive Simple Cover Card Layout */
                      <motion.div
                        key="inactive"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full relative"
                      >
                        {/* Cover Image Background */}
                        <img 
                          src={merchant.coverImage} 
                          alt={merchant.name} 
                          className="w-full h-full object-cover opacity-30 grayscale hover:opacity-50 hover:grayscale-0 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070a13] via-[#070a13]/70 to-transparent" />
                        
                        {/* Info Overlays */}
                        <div className="absolute inset-x-4 bottom-5 space-y-2">
                          <span className="inline-block bg-white/5 border border-white/10 text-white text-[8px] font-black tracking-wider px-2 py-0.5 rounded-full">
                            SINCE {merchant.since}
                          </span>
                          <h3 className="text-xs sm:text-sm font-black text-white leading-tight tracking-tight">
                            {merchant.name}
                          </h3>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* 6. FAQ Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={fadeInUp}
        className="py-24 border-t border-white/[0.06] relative"
      >
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 rounded-full mb-4 inline-block">
              Support Center
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Everything you need to know about setting up your gadget shop.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-[#0d1527]/30 border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-[#0d1527]/60 transition-colors"
                  >
                    <span className="text-sm font-extrabold text-white pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-400 border-t border-white/[0.04] leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* 7. Bottom CTA Card */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={fadeInUp}
        className="py-20 border-t border-white/[0.06] relative overflow-hidden"
      >
        {/* Glow orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[130px] pointer-events-none" />
        
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="bg-gradient-to-br from-[#0d1527]/90 via-[#0a1020]/95 to-[#0b1b36]/90 border border-white/[0.08] backdrop-blur-xl rounded-[32px] p-10 sm:p-16 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            {/* ambient blue glow */}
            <div className="absolute -right-24 -bottom-24 w-72 h-72 bg-blue-600/10 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Launch your gadget shop on Tech-Hub.
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mb-10 leading-relaxed">
                Apply today, list your first set of gadgets, and start making sales with Sri Lanka's premium tech-oriented buyer community.
              </p>
              
              <Link
                to="/login?tab=signup&role=vendor"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Store className="w-4 h-4" />
                Start Selling Today
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
