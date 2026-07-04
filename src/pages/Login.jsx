import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ImageSlider } from "@/components/ui/image-slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, User, Store, CheckCircle2, ShieldAlert } from "lucide-react";
import Home from "./Home";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query params
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') === 'signup' ? 'signup' : 'login';
  const initialRole = queryParams.get('role') === 'vendor' ? 'vendor' : 'customer';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync tab/role from url changes if any
  useEffect(() => {
    setActiveTab(initialTab);
    setRole(initialRole);
  }, [location.search, initialTab, initialRole]);

  // Get redirect path
  const from =
    typeof location.state?.from === 'string'
      ? location.state.from
      : location.state?.from?.pathname || "/";
  const redirectState = location.state?.checkoutState || null;

  const redirectUser = (user) => {
    if (from !== "/") {
      navigate(from, { replace: true, state: redirectState });
    } else if (user.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (user.role === "vendor") {
      navigate("/vendor", { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (activeTab === 'login') {
        const user = await login(email, password);
        redirectUser(user);
      } else {
        if (!name || !email || !password) {
          throw new Error('All fields are required.');
        }
        if (role === 'vendor' && !storeName) {
          throw new Error('Please enter your Store Name.');
        }
        const user = await register(name, email, password, role, storeName);
        redirectUser(user);
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Replaced model portraits with high-quality tech workspace & gadget images
  const images = [
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1000&auto=format&fit=crop"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
      },
    },
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background: Blurred E-Commerce site */}
      <div className="absolute inset-0 filter blur-[12px] opacity-85 pointer-events-none select-none overflow-hidden scale-[1.02]">
        <Home />
      </div>

      {/* Glassmorphic Overlay Layer */}
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            navigate("/");
          }
        }}
        className="absolute inset-0 flex items-start lg:items-center justify-center bg-[#070a13]/70 backdrop-blur-[16px] p-3 sm:p-4 lg:p-6 z-50 cursor-pointer overflow-y-auto"
      >
        <motion.div 
          className="relative w-full max-w-5xl min-h-[560px] lg:min-h-0 lg:h-[760px] max-h-[calc(100vh-1.5rem)] grid grid-cols-1 lg:grid-cols-2 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08] bg-[#0d1527]/95 text-[#dce3f0] cursor-default my-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Close button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-6 right-6 z-50 p-2 rounded-full text-slate-450 hover:text-white border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] active:bg-white/[0.1] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Close auth screen"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left side: Image Slider */}
          <div className="hidden lg:block relative w-full h-full border-r border-white/[0.06]">
            <ImageSlider images={images} interval={4000} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-8 left-8 z-10 flex items-center gap-2">
              <span className="text-xl font-black text-white drop-shadow">
                Tech-Hub
              </span>
            </div>
          </div>

          {/* Right side: Form Panel (Redesigned with Dark Glassmorphic Theme) */}
          <div className="w-full h-full bg-[#0a0f1d]/50 text-[#dce3f0] flex flex-col items-center justify-center p-5 sm:p-7 md:p-10 overflow-y-auto no-scrollbar">
            <motion.div 
              key={activeTab} // reset animation when tab changes
              className="w-full max-w-sm"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 variants={itemVariants} className="text-3xl font-black tracking-tight mb-1 text-white">
                {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
              </motion.h1>
              <motion.p variants={itemVariants} className="text-slate-400 mb-6 text-xs font-semibold">
                {activeTab === 'login' ? 'Enter your credentials to access your account.' : 'Join Sri Lanka\'s leading tech ecosystem today.'}
              </motion.p>

              {error && (
                <motion.div 
                  variants={itemVariants}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-2xl flex items-start gap-2 mb-4"
                >
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{error}</span>
                </motion.div>
              )}

              {/* Segmented Control Tabs */}
              <motion.div variants={itemVariants} className="flex bg-[#070a13]/60 p-1 rounded-2xl mb-6 border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                    activeTab === 'login'
                      ? 'bg-[#0d1527] text-white border border-white/[0.08] shadow-md font-extrabold'
                      : 'text-slate-450 hover:text-white'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                    activeTab === 'signup'
                      ? 'bg-[#0d1527] text-white border border-white/[0.08] shadow-md font-extrabold'
                      : 'text-slate-450 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </motion.div>

              {/* SIGNUP: Role Selection Cards */}
              {activeTab === 'signup' && (
                <motion.div variants={itemVariants} className="space-y-2 mb-5">
                  <label className="text-[11px] font-bold text-slate-400 tracking-wide block">
                    Choose Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'customer', title: 'Customer', desc: 'Shop tech items', icon: <User className="w-4 h-4" /> },
                      { id: 'vendor', title: 'Vendor', desc: 'Sell workspace gear', icon: <Store className="w-4 h-4" /> }
                    ].map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setRole(card.id)}
                        className={`p-3 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-[85px] ${
                          role === card.id
                            ? 'border-blue-500 bg-blue-600/10 text-white shadow-sm font-bold'
                            : 'border-white/[0.08] bg-white/[0.01] text-slate-400 hover:bg-white/[0.04] hover:border-white/[0.15]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className={`p-1 rounded-lg border ${
                            role === card.id 
                              ? 'bg-blue-600 border-blue-500 text-white' 
                              : 'bg-white/[0.02] border-white/[0.08] text-slate-400'
                          }`}>
                            {card.icon}
                          </div>
                          {role === card.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black leading-none text-white">{card.title}</p>
                          <p className="text-[9px] text-slate-500 mt-1 leading-none font-semibold">{card.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Form Input Fields */}
              <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'signup' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold text-slate-300">Full Name</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-2xl py-5 border-white/[0.08] bg-white/[0.02] text-white placeholder-slate-500 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50 focus:bg-white/[0.04] transition-all"
                      required 
                    />
                  </div>
                )}

                {activeTab === 'signup' && role === 'vendor' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="storeName" className="text-xs font-bold text-slate-300">Store Name</Label>
                    <Input 
                      id="storeName" 
                      type="text" 
                      placeholder="e.g. Nexus Electronics" 
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="rounded-2xl py-5 border-white/[0.08] bg-white/[0.02] text-white placeholder-slate-500 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50 focus:bg-white/[0.04] transition-all"
                      required 
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-300">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="m@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-2xl py-5 border-white/[0.08] bg-white/[0.02] text-white placeholder-slate-500 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50 focus:bg-white/[0.04] transition-all"
                    required 
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-bold text-slate-300">Password</Label>
                    {activeTab === 'login' && (
                      <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-bold text-blue-400 hover:underline">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-2xl py-5 border-white/[0.08] bg-white/[0.02] text-white placeholder-slate-500 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50 focus:bg-white/[0.04] transition-all"
                    required 
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full rounded-2xl py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs mt-4 shadow-lg shadow-blue-650/15">
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : activeTab === 'login' ? (
                    "Log In"
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.form>

              {/* Login / Register Toggle Footer Links */}
              <motion.div variants={itemVariants} className="text-center text-xs text-slate-400 mt-6 font-semibold">
                {activeTab === 'login' ? (
                  <>
                    Don't have an account?{" "}
                    <button onClick={() => { setActiveTab('signup'); setError(''); }} className="font-bold text-blue-400 hover:underline focus:outline-none">
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button onClick={() => { setActiveTab('login'); setError(''); }} className="font-bold text-blue-400 hover:underline focus:outline-none">
                      Log in
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
