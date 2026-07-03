import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, ShoppingBag, Heart, ShoppingCart, Users, ArrowLeft, 
  Search, ShieldCheck, CheckCircle2, ChevronRight, Store, Loader2, Info, FileText
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { isRequestAbortError, requestJson } from '../services/httpClient';
import { serviceRegistry } from '../config/serviceRegistry';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function VendorStore() {
  const { vendorId } = useParams();
  const { user: currentUser } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  // States
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  
  // Interactive / Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);
  const [activeStoreSection, setActiveStoreSection] = useState('products');

  // Global toast listener
  useEffect(() => {
    const handleGlobalToast = (e) => {
      showToast(e.detail);
    };
    window.addEventListener('show-toast', handleGlobalToast);
    return () => window.removeEventListener('show-toast', handleGlobalToast);
  }, []);

  const showToast = (msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Fetch Vendor Details and Products in parallel
  useEffect(() => {
    const fetchVendorData = async () => {
      setLoading(true);
      setProductsLoading(true);

      const [vendorResult, productsResult] = await Promise.allSettled([
        requestJson(`${serviceRegistry.catalog}/vendors/${vendorId}`),
        requestJson(`${serviceRegistry.catalog}/products?vendor_id=${vendorId}`),
      ]);

      if (vendorResult.status === 'fulfilled' && vendorResult.value) {
        const data = vendorResult.value;
        setVendor(data);
        setIsFollowing(!!data.is_followed);
        setFollowersCount(Number(data.followers_count || 0));
      } else if (vendorResult.status === 'rejected' && !isRequestAbortError(vendorResult.reason)) {
        console.error('Failed to load vendor storefront:', vendorResult.reason);
      }

      if (productsResult.status === 'fulfilled' && Array.isArray(productsResult.value)) {
        setProducts(productsResult.value);
      } else if (productsResult.status === 'rejected' && !isRequestAbortError(productsResult.reason)) {
        console.error('Failed to load vendor products:', productsResult.reason);
      }

      setLoading(false);
      setProductsLoading(false);
    };
    fetchVendorData();
  }, [vendorId, currentUser]);

  // Toggle Follow Handler
  const handleFollowToggle = async () => {
    if (!currentUser) {
      showToast('Please log in to follow stores!');
      return;
    }
    setFollowLoading(true);
    try {
      const res = await requestJson(`${serviceRegistry.catalog}/vendors/${vendorId}/follow`, {
        method: 'POST'
      });
      if (res) {
        setIsFollowing(res.is_followed);
        setFollowersCount(res.followers_count);
        showToast(res.is_followed ? `You are now following ${vendor.store_name || vendor.name}!` : `Unfollowed store`);
      }
    } catch (e) {
      console.error('Follow request failed:', e);
      showToast('Failed to follow store.');
    } finally {
      setFollowLoading(false);
    }
  };

  // Get unique categories of products in store
  const categories = useMemo(() => {
    const list = new Set();
    products.forEach(p => {
      if (p.category && p.category.name) {
        list.add(p.category.name);
      }
    });
    return ['all', ...Array.from(list)];
  }, [products]);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || (p.category && p.category.name === selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${isLight ? 'bg-slate-100' : 'bg-[#070a13]'}`}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className={`text-sm font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Entering dynamic storefront...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className={`min-h-screen flex flex-col justify-between ${isLight ? 'bg-slate-100' : 'bg-[#070a13]'}`}>
        <Navbar />
        <div className="text-center py-40">
          <Info className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Storefront Not Found</h2>
          <p className={`mb-6 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>This seller account might be under review or does not exist.</p>
          <Link to="/vendors" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md">
            Return to Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const shopTheme = vendor?.shop_theme || 'element';
  const themeAccent = {
    element: {
      text: 'text-[#409eff]',
      bg: 'bg-[#409eff]',
      border: 'border-[#409eff]',
      borderB: 'border-b-[#409eff]',
      hoverBg: 'hover:bg-[#409eff]/90',
      badge: 'bg-[#409eff]/10 text-[#409eff] border-[#409eff]/20'
    },
    walnut: {
      text: 'text-amber-600',
      bg: 'bg-amber-700',
      border: 'border-amber-700',
      borderB: 'border-b-amber-700',
      hoverBg: 'hover:bg-amber-800',
      badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    },
    forest: {
      text: 'text-emerald-600',
      bg: 'bg-emerald-600',
      border: 'border-emerald-600',
      borderB: 'border-b-emerald-600',
      hoverBg: 'hover:bg-emerald-700',
      badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    },
    amber: {
      text: 'text-amber-500',
      bg: 'bg-amber-500',
      border: 'border-amber-500',
      borderB: 'border-b-amber-500',
      hoverBg: 'hover:bg-amber-600',
      badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    },
    rose: {
      text: 'text-rose-500',
      bg: 'bg-rose-500',
      border: 'border-rose-500',
      borderB: 'border-b-rose-500',
      hoverBg: 'hover:bg-rose-600',
      badge: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    }
  }[shopTheme] || {
    text: 'text-blue-500',
    bg: 'bg-blue-600',
    border: 'border-blue-600',
    borderB: 'border-b-blue-600',
    hoverBg: 'hover:bg-blue-700',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };

  const initials = (vendor.store_name || vendor.name || '?')
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden flex flex-col justify-between ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-[#070a13] text-slate-200'}`}>
      <div>
        <Navbar />

        {/* Store Banner Hero Section */}
        <section className={`relative h-[280px] sm:h-[350px] border-b flex items-end ${isLight ? 'border-slate-200 bg-slate-200/30' : 'border-white/[0.06]'}`}>
          {/* Banner Image Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center select-none" 
            style={{ backgroundImage: `url(${vendor.cover_image_url || vendor.banner_url || 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?q=80&w=1368&auto=format&fit=crop'})` }}
          >
            <div className={`absolute inset-0 ${isLight ? 'bg-gradient-to-t from-slate-100 via-slate-100/80 to-transparent' : 'bg-gradient-to-t from-[#070a13] via-[#070a13]/85 to-transparent'}`}></div>
            <div className={`absolute inset-0 ${isLight ? 'bg-gradient-to-r from-slate-100/70 to-slate-100/10' : 'bg-gradient-to-r from-[#070a13]/70 to-[#070a13]/20'}`}></div>
          </div>

          <div className="max-w-[1720px] mx-auto w-full px-4 lg:px-8 2xl:px-12 pb-8 sm:pb-12 relative z-10">
            {/* Back to directory */}
            <Link 
              to="/vendors" 
              className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors mb-6 backdrop-blur-md px-3 py-1.5 rounded-lg border self-start ${isLight ? 'text-slate-600 hover:text-slate-900 bg-white/90 border-slate-200' : 'text-slate-450 hover:text-white bg-slate-950/40 border-white/[0.04]'}`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Directory
            </Link>

            {/* Vendor Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-6 text-left">
                {/* Store Initials / Logo */}
                {vendor.logo_url ? (
                  <img
                    src={vendor.logo_url}
                    alt={vendor.store_name || vendor.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover bg-slate-100 border-2 border-white/10 shadow-2xl shrink-0"
                  />
                ) : (
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr ${vendor.avatar_bg || 'from-blue-600 to-indigo-500'} flex items-center justify-center text-3xl sm:text-4xl font-black text-white shadow-2xl border-2 border-white/10 shrink-0`}>
                    {initials}
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {vendor.store_name || vendor.name}
                    </h1>
                    <span className={`inline-flex items-center gap-1 border px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${themeAccent.badge}`}>
                      <ShieldCheck className="w-3 h-3" />
                      Verified Store
                    </span>
                  </div>
                  <p className={`mt-2 text-xs sm:text-sm font-medium max-w-xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {vendor.store_description || 'Premium workspace accessories & gear.'}
                  </p>
                </div>
              </div>

              {/* Follow & Metrics Action Box */}
              <div className="flex items-center gap-4 flex-wrap sm:shrink-0">
                {/* Metrics */}
                <div className={`flex items-center gap-3.5 backdrop-blur-md px-4 py-2.5 rounded-2xl text-xs font-semibold ${isLight ? 'bg-white/90 border border-slate-200 text-slate-600' : 'bg-slate-950/50 border border-white/[0.06] text-slate-355'}`}>
                  <div className="flex items-center gap-1 border-r border-white/10 pr-3.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{vendor.rating} Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{followersCount.toLocaleString()} Followers</span>
                  </div>
                </div>

                {/* Follow Button */}
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isFollowing
                      ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30'
                      : `${themeAccent.bg} ${themeAccent.hoverBg} text-white border ${themeAccent.border}/30 active:scale-95`
                  } disabled:opacity-50`}
                >
                  {isFollowing ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <Store className="w-4 h-4" />
                      Follow Store
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Store Catalog Section */}
        <main className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 py-10">
          {/* Main Store Navigation Tabs */}
          <div className={`flex border-b mb-8 gap-6 ${isLight ? 'border-slate-200' : 'border-white/[0.06]'}`}>
            <button
              onClick={() => setActiveStoreSection('products')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all -mb-px flex items-center gap-2 ${
                activeStoreSection === 'products'
                  ? `${themeAccent.borderB} ${themeAccent.text} font-black`
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setActiveStoreSection('about')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all -mb-px flex items-center gap-2 ${
                activeStoreSection === 'about'
                  ? `${themeAccent.borderB} ${themeAccent.text} font-black`
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Store Info & Policies
            </button>
          </div>

          {activeStoreSection === 'products' ? (
            <>
              {/* Filtering and Search Controls */}
              <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 mb-8 ${isLight ? 'border-slate-200' : 'border-white/[0.06]'}`}>
                {/* Category tabs */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all capitalize ${
                        selectedCategory === cat
                          ? `${themeAccent.bg} text-white border-transparent shadow-md shadow-blue-500/5`
                          : isLight
                            ? 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400'
                            : 'bg-[#0d1527]/40 border-white/[0.06] text-slate-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      {cat === 'all' ? 'All Products' : cat}
                    </button>
                  ))}
                </div>

                {/* Search within store */}
                <div className="relative w-full md:w-72">
                  <Search className={`absolute left-3.5 top-3 w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-slate-450'}`} />
                  <input
                    type="text"
                    placeholder="Search store inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs font-semibold outline-none transition-all ${isLight ? 'bg-white border-slate-300 hover:border-slate-400 focus:border-blue-500 text-slate-900 placeholder:text-slate-500' : 'bg-[#0d1527]/30 border-white/[0.06] hover:border-white/12 focus:border-blue-500/40 text-white placeholder:text-slate-500'}`}
                  />
                </div>
              </div>

              {/* Active Inventory Display */}
              {productsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
                  <p className="text-xs font-semibold text-slate-400">Loading catalog items...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className={`text-center py-20 border rounded-3xl p-6 ${isLight ? 'bg-white border-slate-200' : 'bg-[#0d1527]/10 border-white/[0.04]'}`}>
                  <ShoppingBag className="w-10 h-10 text-slate-655 mx-auto mb-3" />
                  <h3 className={`text-base font-extrabold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>No Listings Found</h3>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-450'}`}>This store doesn't have any matching products listed in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((prod) => {
                      const priceFormatted = `LKR ${Number(prod.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                      const oldPriceFormatted = `LKR ${(Number(prod.price) * 1.25).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

                      let vibeBadgeStyle = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                      if (prod.vibe === 'walnut') {
                        vibeBadgeStyle = 'bg-amber-500/10 text-amber-300 border border-amber-500/20';
                      } else if (prod.vibe === 'minimalist') {
                        vibeBadgeStyle = 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20';
                      } else if (prod.vibe === 'black') {
                        vibeBadgeStyle = 'bg-slate-800 text-slate-355 border border-slate-700';
                      } else if (prod.vibe === 'cyberpunk') {
                        vibeBadgeStyle = 'bg-purple-500/10 text-purple-300 border border-purple-500/20';
                      }

                      return (
                        <motion.article
                          key={prod.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ y: -5 }}
                          className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 flex flex-col justify-between text-left ${isLight ? 'border-slate-200 bg-white shadow-md hover:border-slate-300' : 'border-white/[0.08] bg-[#0d1527]/40 shadow-xl hover:border-white/[0.2]'}`}
                        >
                          <Link to={`/product/${prod.id}`} className="block">
                            {/* Image Frame */}
                            <div className="h-48 rounded-xl border border-white/[0.06] bg-[#111827] relative overflow-hidden">
                              {prod.image ? (
                                <img 
                                  src={prod.image} 
                                  alt={prod.title} 
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                  <ShoppingBag className="w-8 h-8" />
                                </div>
                              )}
                            </div>

                            {/* Specs & Info */}
                            <div className="mt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                              <span>{prod.category?.name || 'Accessory'}</span>
                              {prod.spec && (
                                <>
                                  <span className="h-1.5 w-[1px] bg-white/[0.15]"></span>
                                  <span className="truncate max-w-[100px]">{prod.spec}</span>
                                </>
                              )}
                            </div>

                            <h4 className={`mt-1.5 text-sm font-extrabold leading-snug min-h-[40px] transition-colors line-clamp-2 ${isLight ? 'text-slate-900 group-hover:text-blue-650' : 'text-white group-hover:text-blue-400'}`}>
                              {prod.title}
                            </h4>

                            {/* Star Ratings */}
                            <div className="mt-2.5 flex items-center gap-1 text-[10px] text-amber-400">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-205'}`}>{prod.rating}</span>
                              <span className={`font-semibold ${isLight ? 'text-slate-500' : 'text-slate-450'}`}>({prod.reviews_count || 12} reviews)</span>
                            </div>

                            {/* Pricing */}
                            <div className={`mt-4 pt-3 border-t flex items-end justify-between ${isLight ? 'border-slate-200' : 'border-white/[0.08]'}`}>
                              <div>
                                <p className="text-base font-black text-rose-400 tracking-tight leading-none">{priceFormatted}</p>
                                <p className="text-[10px] text-slate-550 line-through mt-1.5">{oldPriceFormatted}</p>
                              </div>
                              {prod.vibe && (
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${vibeBadgeStyle}`}>
                                  {prod.vibe}
                                </span>
                              )}
                            </div>
                          </Link>

                          {/* Footer Actions */}
                          <div className="mt-4 flex gap-2 relative z-10">
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                showToast(`"${prod.title}" added to setup!`);
                              }}
                              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-extrabold transition-all active:scale-95 ${
                                isLight 
                                  ? `border-slate-200 bg-slate-100 hover:${themeAccent.bg} hover:text-white text-slate-800` 
                                  : `border-white/[0.08] bg-[#0d1527]/80 hover:${themeAccent.bg} hover:text-white text-white`
                              }`}
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Add to Setup
                            </button>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                showToast('Added to wishlist!');
                              }}
                              className={`rounded-xl border p-2 transition-all active:scale-95 ${isLight ? 'border-slate-200 bg-slate-100 text-slate-500 hover:text-rose-500 hover:border-rose-300' : 'border-white/[0.08] bg-[#0d1527]/80 text-slate-400 hover:text-rose-500 hover:border-rose-500/30'}`}
                            >
                              <Heart className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.article>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left animate-in fade-in duration-300">
              {/* Left Column: Company Profile */}
              <div className="lg:col-span-2 space-y-6">
                <div className={`p-6 sm:p-8 rounded-3xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#0d1527]/45 border-white/[0.08]'}`}>
                  <h3 className={`text-lg font-black mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Company Profile</h3>
                  <p className={`text-xs leading-relaxed whitespace-pre-line ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {vendor.company_profile || vendor.store_description || 'Premium workspace accessories & gear.'}
                  </p>
                </div>
              </div>

              {/* Right Column: Policies & Terms */}
              <div className="space-y-6">
                <div className={`p-6 sm:p-8 rounded-3xl border ${isLight ? 'bg-white border-slate-200' : 'bg-[#0d1527]/45 border-white/[0.08]'}`}>
                  <h3 className={`text-lg font-black mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>Store Policies & Terms</h3>
                  
                  {vendor.policy_type === 'pdf' ? (
                    <div className="space-y-4">
                      {vendor.policy_pdf_url ? (
                        <div className="space-y-4">
                          <div className={`flex items-center gap-3.5 p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#111827]/60 border-white/[0.06]'}`}>
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-450 shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-800' : 'text-white'}`}>Terms_&_Conditions.pdf</p>
                              <p className="text-[10px] text-slate-450 mt-0.5">Official Store Policy Document</p>
                            </div>
                          </div>
                          <a
                            href={vendor.policy_pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-white ${themeAccent.bg} ${themeAccent.hoverBg} shadow-md shadow-blue-500/10`}
                          >
                            <FileText className="w-4 h-4" />
                            View/Download Policy PDF
                          </a>
                        </div>
                      ) : (
                        <p className={`text-xs font-semibold ${isLight ? 'text-slate-550' : 'text-slate-450'}`}>No policy document has been uploaded by the vendor.</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vendor.policy_text ? (
                        <div className={`p-4 rounded-2xl border max-h-[300px] overflow-y-auto font-mono text-[11px] leading-relaxed whitespace-pre-line ${isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#111827]/60 border-white/[0.06] text-slate-300'}`}>
                          {vendor.policy_text}
                        </div>
                      ) : (
                        <p className={`text-xs font-semibold ${isLight ? 'text-slate-550' : 'text-slate-450'}`}>No terms or conditions text has been defined by the vendor.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* Dynamic Toast Alert Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0d1527]/90 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/[0.08] max-w-sm"
          >
            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xs font-black tracking-wide leading-none">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
