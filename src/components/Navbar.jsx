import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, ShoppingCart, Bell, ChevronDown, LogOut, Cpu, Store, Menu, X, Search, Sun, Moon, ChevronRight, ShoppingBag, PackageCheck, ShieldCheck, Clock3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { isRequestAbortError, requestJson } from '../services/httpClient';
import { serviceRegistry } from '../config/serviceRegistry';

const logoUrl = new URL('../../Media/logo (3).png', import.meta.url).href;

const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const readNotificationIds = () => {
  try {
    return JSON.parse(localStorage.getItem('techhub_read_notifications') || '[]');
  } catch {
    return [];
  }
};

const writeNotificationIds = (ids) => {
  localStorage.setItem('techhub_read_notifications', JSON.stringify(Array.from(new Set(ids)).slice(-120)));
};

const orderRef = (order) => order?.order_number || (order?.id ? `TH-${String(order.id).padStart(8, '0')}` : 'Order');

const buildNotifications = ({ user, orders = [], vendors = [], policies = [] }) => {
  if (!user) {
    return [
      {
        id: 'guest-login',
        title: 'Sign in for order updates',
        message: 'Track purchases, followed stores, and partner updates from your account.',
        time: 'Now',
        to: '/login?tab=login',
        icon: Bell,
        tone: 'blue',
      },
    ];
  }

  if (user.role === 'admin') {
    const pendingVendors = vendors.filter((vendor) => vendor.status === 'pending');
    const pendingPolicies = policies.filter((policy) => !policy.approved_by_admin);

    return [
      ...pendingVendors.slice(0, 4).map((vendor) => ({
        id: `admin-vendor-${vendor.id}-${vendor.status}`,
        title: 'Vendor approval needed',
        message: `${vendor.store_name || vendor.name || 'Vendor'} is waiting for review.`,
        time: vendor.created_at ? new Date(vendor.created_at).toLocaleDateString() : 'Pending',
        to: '/admin',
        icon: Store,
        tone: 'amber',
      })),
      ...pendingPolicies.slice(0, 4).map((policy) => ({
        id: `admin-policy-${policy.id}-${policy.updated_at || policy.created_at || 'pending'}`,
        title: 'AI policy review needed',
        message: `${policy.vendor?.store_name || policy.vendor?.name || 'Vendor'} submitted a policy for approval.`,
        time: policy.updated_at || policy.created_at ? new Date(policy.updated_at || policy.created_at).toLocaleDateString() : 'Pending',
        to: '/admin',
        icon: ShieldCheck,
        tone: 'blue',
      })),
    ];
  }

  if (user.role === 'vendor') {
    return orders.slice(0, 8).map((item) => ({
      id: `vendor-item-${item.id}-${item.status}`,
      title: item.status === 'dispatched' ? 'Item dispatched' : 'New fulfillment item',
      message: `${item.product?.title || 'Product'} for ${orderRef(item.order)} needs vendor handling.`,
      time: item.order?.created_at ? new Date(item.order.created_at).toLocaleDateString() : 'New',
      to: '/vendor',
      icon: item.status === 'dispatched' ? PackageCheck : ShoppingBag,
      tone: item.status === 'dispatched' ? 'emerald' : 'amber',
    }));
  }

  return orders.slice(0, 8).map((order) => ({
    id: `customer-order-${order.id}-${order.status}`,
    title: order.status === 'dispatched' ? 'Order dispatched' : 'Order update',
    message: `${orderRef(order)} is ${order.status || 'processing'}.`,
    time: order.created_at || order.purchase_date ? new Date(order.created_at || order.purchase_date).toLocaleDateString() : 'Recent',
    to: '/portal',
    icon: order.status === 'dispatched' ? PackageCheck : Clock3,
    tone: order.status === 'dispatched' ? 'emerald' : 'blue',
  }));
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [suggestionPool, setSuggestionPool] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState(readNotificationIds);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const searchBoxRef = useRef(null);

  // Close menus on path changes or desktop resize
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsNotificationsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle outside clicks for profile dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }

      if (!e.target.closest('.notifications-dropdown-container')) {
        setIsNotificationsOpen(false);
      }

      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setIsSuggestionsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  const unreadCount = notifications.filter((item) => !readNotifications.includes(item.id)).length;

  const loadNotifications = async () => {
    if (isNotificationsLoading) return;

    setIsNotificationsLoading(true);
    try {
      if (!user) {
        setNotifications(buildNotifications({ user }));
        return;
      }

      if (user.role === 'admin') {
        const [vendorsResult, policiesResult] = await Promise.allSettled([
          requestJson(`${serviceRegistry.catalog}/admin/vendors`, { timeoutMs: 15000 }),
          requestJson(`${serviceRegistry.catalog}/admin/vendor-policies`, { timeoutMs: 15000 }),
        ]);

        setNotifications(buildNotifications({
          user,
          vendors: vendorsResult.status === 'fulfilled' ? normalizeCollection(vendorsResult.value) : [],
          policies: policiesResult.status === 'fulfilled' ? normalizeCollection(policiesResult.value) : [],
        }));
        return;
      }

      const orders = await requestJson(`${serviceRegistry.catalog}/orders`, { timeoutMs: 15000 });
      setNotifications(buildNotifications({ user, orders: normalizeCollection(orders) }));
    } catch (error) {
      if (!isRequestAbortError(error)) {
        console.error('Failed to load notifications:', error);
      }
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  useEffect(() => {
    if (isNotificationsOpen) {
      loadNotifications();
    }
  }, [isNotificationsOpen, user?.id, user?.role]);

  useEffect(() => {
    loadNotifications();
  }, [user?.id, user?.role]);

  useEffect(() => {
    if (!isNotificationsOpen || notifications.length === 0) return;

    const nextRead = Array.from(new Set([...readNotifications, ...notifications.map((item) => item.id)]));
    setReadNotifications(nextRead);
    writeNotificationIds(nextRead);
  }, [isNotificationsOpen, notifications]);

  const loadSuggestions = async () => {
    if (suggestionPool.length > 0 || isSuggestionsLoading) return;
    setIsSuggestionsLoading(true);
    try {
      const data = await requestJson(`${serviceRegistry.catalog}/products`, {
        timeoutMs: 15000,
        omitAuth: true,
      });

      if (!Array.isArray(data)) return;

      const normalized = data.slice(0, 240).map((item) => ({
        id: item.id,
        title: item.title || 'Untitled Product',
        image: item.image || '',
        brand: item.brand || 'Tech-Hub',
        category: item.category?.name || item.category || 'Accessories',
      }));

      setSuggestionPool(normalized);
    } catch (error) {
      if (!isRequestAbortError(error)) {
        console.error('Failed to load navbar search suggestions:', error);
      }
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  useEffect(() => {
    const query = searchInput.trim().toLowerCase();

    if (suggestionPool.length === 0) {
      setFilteredSuggestions([]);
      return;
    }

    if (query.length === 0) {
      setFilteredSuggestions(suggestionPool.slice(0, 8));
      return;
    }

    const ranked = suggestionPool
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const aStarts = a.title.toLowerCase().startsWith(query) ? 1 : 0;
        const bStarts = b.title.toLowerCase().startsWith(query) ? 1 : 0;
        return bStarts - aStarts;
      })
      .slice(0, 8);

    setFilteredSuggestions(ranked);
  }, [searchInput, suggestionPool]);


  const isActive = (path) => location.pathname === path;
  const isCategoriesActive = location.pathname.startsWith('/category');
  const isVendorsActive = location.pathname.startsWith('/vendors');

  const openDealsView = () => {
    navigate('/category/All?deals=true&sort=rating');
    setIsMobileMenuOpen(false);
  };

  const submitSearch = () => {
    const query = searchInput.trim();
    setIsSuggestionsOpen(false);
    setIsMobileSearchOpen(false);
    if (!query) {
      navigate('/category/All');
      return;
    }
    navigate(`/category/All?q=${encodeURIComponent(query)}`);
    setIsMobileMenuOpen(false);
  };

  const goToSuggestion = (productId) => {
    setIsSuggestionsOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <nav className="bg-[#0b1021]/85 backdrop-blur-xl text-white py-2.5 lg:py-3.5 z-50 sticky top-0 w-full border-b border-white/[0.06] shadow-md transition-all duration-300">
        <div className="max-w-[1720px] mx-auto w-full px-3 sm:px-4 lg:px-8 2xl:px-12 flex items-center justify-between gap-2 sm:gap-3 lg:gap-5 xl:gap-7">
          
          {/* Logo and Main Desktop Links */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 xl:gap-8 min-w-0">
            <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-95">
              <img src={logoUrl} alt="Tech-Hub Logo" className="w-12 h-12 sm:w-14 sm:h-14 -ml-3.5 -mr-3 object-contain" />
              <span className="inline text-lg sm:text-xl font-bold tracking-wide">Tech-Hub</span>
            </Link>

            <div className="hidden xl:flex items-center gap-4 2xl:gap-6 text-[13px] font-medium text-slate-350 shrink-0 whitespace-nowrap">
              {/* Home */}
              <Link 
                to="/" 
                className={`hover:text-white transition-colors relative py-1 ${isActive('/') ? 'text-white font-semibold' : 'text-slate-400'}`}
              >
                Home
                {isActive('/') && <span className="absolute -bottom-4 left-0 w-full h-1 bg-blue-500 rounded-t-md"></span>}
              </Link>
              
              {/* Categories */}
              <Link 
                to="/category/All" 
                className={`hover:text-white transition-colors relative py-1 ${isCategoriesActive ? 'text-white font-semibold' : 'text-slate-400'}`}
              >
                Categories
                {isCategoriesActive && <span className="absolute -bottom-4 left-0 w-full h-1 bg-blue-500 rounded-t-md"></span>}
              </Link>
              
              {/* Deals */}
              <button
                onClick={openDealsView}
                className="hover:text-white transition-colors text-slate-400 py-1 bg-transparent border-0"
              >
                Deals
              </button>
              
              {/* Vendors */}
              <Link 
                to="/vendors" 
                className={`hover:text-white transition-colors relative py-1 ${isVendorsActive ? 'text-white font-semibold' : 'text-slate-400'}`}
              >
                Vendors
                {isVendorsActive && <span className="absolute -bottom-4 left-0 w-full h-1 bg-blue-500 rounded-t-md"></span>}
              </Link>
              
              
              <Link to="/support" className="hover:text-white transition-colors text-slate-400 py-1">Support</Link>
              <Link to="/about" className="hover:text-white transition-colors text-slate-400 py-1">About</Link>
            </div>
          </div>

          {/* Search Box */}
          <div className="hidden xl:flex items-center gap-4 flex-1 max-w-[390px] 2xl:max-w-[500px] mx-1 xl:mx-3 min-w-[220px]">
            <div ref={searchBoxRef} className="relative flex-1">
              <div className="bg-white rounded-md flex items-center overflow-hidden h-10">
              <button 
                onClick={() => navigate('/category/All')}
                className="px-3 text-slate-600 border-r border-slate-200 text-sm font-medium flex items-center gap-1 hover:bg-slate-50 h-full shrink-0"
              >
                All <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <input 
                type="text" 
                placeholder="Search for products, brands and more..." 
                className="flex-1 px-3 text-sm text-slate-800 focus:outline-none min-w-0"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setIsSuggestionsOpen(true);
                  loadSuggestions();
                }}
                onFocus={() => {
                  setIsSuggestionsOpen(true);
                  loadSuggestions();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    submitSearch();
                  }
                }}
              />
              <button 
                onClick={submitSearch}
                className="bg-blue-600 h-full px-5 hover:bg-blue-700 transition-colors shrink-0"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
              </div>

              {isSuggestionsOpen && suggestionPool.length > 0 && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 rounded-xl border border-slate-200 bg-white shadow-2xl z-[70] overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                    <p className="text-[11px] font-semibold text-slate-500">
                      {searchInput.trim().length === 0 ? 'Popular products' : 'Matching products'}
                    </p>
                  </div>

                  {filteredSuggestions.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                      {filteredSuggestions.map((item) => (
                        <button
                          key={`suggestion-${item.id}`}
                          onClick={() => goToSuggestion(item.id)}
                          className="w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-slate-50 text-left transition-colors"
                        >
                          <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <Search className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-800 truncate">{item.title}</p>
                            <p className="text-[11px] text-slate-500 truncate">{item.brand} • {item.category}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-350 shrink-0" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-5 text-center">
                      <p className="text-xs font-medium text-slate-500">No direct match. Press Enter to search all results.</p>
                    </div>
                  )}

                  <button
                    onClick={submitSearch}
                    className="w-full text-left px-3 py-2.5 border-t border-slate-100 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    {searchInput.trim().length > 0 ? `View all results for "${searchInput.trim()}"` : 'Browse all products'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4 xl:gap-4 2xl:gap-5 shrink-0">
            <div className="hidden xl:flex flex-col items-center gap-1 cursor-pointer group">
              <Heart className="w-5 h-5 text-slate-350 group-hover:text-white transition-colors" />
              <span className="text-[10px] text-slate-400 group-hover:text-white font-medium transition-colors">Wishlist</span>
            </div>
            
            <Link to="/cart" className="flex xl:flex-col items-center gap-1 cursor-pointer group relative pr-1.5 xl:pr-0">
              <div className="relative flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-slate-350 group-hover:text-white transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-[#0b1021] text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full border border-[#0b1021] flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-[10px] text-slate-400 group-hover:text-white font-medium transition-colors">Cart</span>
            </Link>

            <div className="hidden xl:flex flex-col items-center gap-1 cursor-pointer group relative notifications-dropdown-container">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen((open) => !open)}
                className="flex flex-col items-center gap-1 cursor-pointer group focus:outline-none"
                aria-label="Open notifications"
              >
                <div className="relative">
                  <Bell className="w-5 h-5 text-slate-350 group-hover:text-white transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-black min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full border border-[#0b1021]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-white font-medium transition-colors">Notifications</span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-4 w-[360px] rounded-2xl border border-white/[0.08] bg-[#0b1021]/98 shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-white">Notifications</p>
                      <p className="text-[10px] font-semibold text-slate-500">{unreadCount > 0 ? `${unreadCount} new update${unreadCount === 1 ? '' : 's'}` : 'All caught up'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={loadNotifications}
                      className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300"
                    >
                      Refresh
                    </button>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto">
                    {isNotificationsLoading && notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <div className="w-8 h-8 mx-auto rounded-full border-2 border-blue-500/30 border-t-blue-400 animate-spin" />
                        <p className="mt-3 text-xs font-bold text-slate-400">Loading updates...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell className="w-8 h-8 mx-auto text-slate-600" />
                        <p className="mt-3 text-xs font-bold text-slate-400">No notifications right now.</p>
                      </div>
                    ) : (
                      notifications.map((item) => {
                        const Icon = item.icon || Bell;
                        const toneClass = item.tone === 'amber'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                          : item.tone === 'emerald'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-300 border-blue-500/20';

                        return (
                          <Link
                            key={item.id}
                            to={item.to || '/portal'}
                            className="flex gap-3 px-4 py-3 border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.04] transition-colors"
                          >
                            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${toneClass}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-black text-white truncate">{item.title}</p>
                                {!readNotifications.includes(item.id) && (
                                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] font-medium text-slate-400 leading-snug mt-0.5">{item.message}</p>
                              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider mt-1.5">{item.time}</p>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="flex xl:flex-col items-center gap-0.5 sm:gap-1 cursor-pointer group focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-slate-350 group-hover:text-yellow-400 transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-slate-350 group-hover:text-blue-500 transition-colors" />
              )}
              <span className="hidden xl:inline text-[10px] text-slate-450 group-hover:text-white font-semibold transition-colors capitalize">
                {theme === 'dark' ? 'light' : 'dark'}
              </span>
            </button>

            {user ? (
              <div className="flex items-center gap-3.5">
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="hidden xl:inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-rose-500/20"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    Admin Panel
                  </Link>
                )}
                {user.role === 'vendor' && (
                  <Link 
                    to="/vendor" 
                    className="hidden xl:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-blue-600/20"
                  >
                    <Store className="w-3.5 h-3.5" />
                    Vendor Portal
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative profile-dropdown-container">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 hover:opacity-90 transition-all focus:outline-none"
                  >
                    <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs font-black shadow-md ${user.avatarBg}`}>
                      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <span className="hidden xl:inline text-xs font-extrabold text-slate-205">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400 hidden xl:inline" />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-56 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl z-50 text-left">
                      <div className="pb-2.5 border-b border-slate-800">
                        <p className="text-xs font-black text-white">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{user.email}</p>
                        <span className="inline-block bg-slate-800 text-slate-350 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mt-1.5">
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
                        {user.role !== 'vendor' && user.role !== 'admin' && (
                          <Link 
                            to="/portal" 
                            className="text-xs text-slate-300 hover:text-white font-bold py-2 flex items-center gap-2 transition-colors border-t border-slate-800/50 mt-1 pt-1.5"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                            Customer Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileDropdownOpen(false);
                          }}
                          className={`text-xs text-rose-400 hover:text-rose-300 font-bold py-2 flex items-center gap-2 text-left w-full transition-colors ${
                            (user.role === 'vendor' || user.role === 'admin') ? 'border-t border-slate-800/50 mt-1 pt-1.5' : ''
                          }`}
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
              <div className="hidden xl:flex items-center gap-1.5 sm:gap-3">
                <Link
                  to="/become-seller"
                  className="hidden md:inline-block border border-yellow-400/40 text-yellow-400 text-xs sm:text-sm font-semibold px-3 xl:px-4 py-1.5 sm:py-2 rounded-md hover:bg-yellow-400 hover:text-[#0b1021] transition-all whitespace-nowrap"
                >
                  Become Seller
                </Link>
                <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
                <button
                  onClick={() => navigate('/login?tab=login')}
                  className="hidden sm:inline text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors focus:outline-none"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate('/login?tab=signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-sm font-semibold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md transition-all whitespace-nowrap shadow-md shadow-blue-600/10 hover:scale-[1.02] flex items-center justify-center focus:outline-none"
                >
                  <span className="sm:hidden">Login</span>
                  <span className="hidden sm:inline">Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              className="xl:hidden inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-md border border-white/15 text-slate-300 hover:text-white hover:border-white/40 transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-white/10 mt-2 px-4 pt-3 pb-3">
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-medium text-slate-200">
              <Link to="/" className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/category/All" className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
              
              <button
                onClick={openDealsView}
                className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-colors text-left"
              >
                Deals
              </button>
              
              <Link to="/vendors" className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Vendors</Link>
              <Link to="/cart" className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-colors flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                <span>Cart</span>
                {itemCount > 0 && <span className="bg-yellow-400 text-[#0b1021] text-[10px] font-bold px-1.5 rounded-full">{itemCount}</span>}
              </Link>
              <Link to="/support" className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Support</Link>
              <Link to="/about" className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              
              {(!user || (user.role !== 'vendor' && user.role !== 'admin')) && (
                <Link to="/become-seller" className="px-3 py-2 rounded-md bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Become Seller</Link>
              )}

              <button 
                onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] text-left transition-colors flex items-center gap-1.5 focus:outline-none"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-550" />}
                <span className="capitalize">{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
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
                  <button
                    onClick={() => {
                      navigate('/login?tab=login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-white/[0.04] hover:bg-white/[0.1] text-white text-xs font-extrabold py-2.5 rounded-xl transition-all border border-white/5 text-center flex items-center justify-center"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      navigate('/login?tab=signup');
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/10 text-center flex items-center justify-center"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Search input */}
            <div className="mt-3 bg-white rounded-md flex items-center overflow-hidden h-10">
              <button 
                onClick={() => { navigate('/category/All'); setIsMobileMenuOpen(false); }}
                className="px-3 text-slate-650 border-r border-slate-200 text-sm font-medium flex items-center gap-1 hover:bg-slate-50 h-full"
              >
                All <ChevronDown className="w-4 h-4" />
              </button>
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 px-3 text-sm text-slate-800 focus:outline-none min-w-0"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setIsMobileSearchOpen(true);
                  loadSuggestions();
                }}
                onFocus={() => {
                  setIsMobileSearchOpen(true);
                  loadSuggestions();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    submitSearch();
                  }
                }}
              />
              <button 
                onClick={submitSearch}
                className="bg-blue-600 h-full px-4 hover:bg-blue-700 transition-colors"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>

            {isMobileSearchOpen && suggestionPool.length > 0 && (
              <div className="mt-2 rounded-xl border border-white/10 bg-[#0d1527]/95 backdrop-blur-xl overflow-hidden">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                    {searchInput.trim().length === 0 ? 'Popular products' : 'Matching products'}
                  </p>
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {(filteredSuggestions.length > 0 ? filteredSuggestions : suggestionPool.slice(0, 6)).map((item) => (
                    <button
                      key={`mobile-suggestion-${item.id}`}
                      onClick={() => goToSuggestion(item.id)}
                      className="w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-white/[0.06] text-left transition-colors"
                    >
                      <div className="w-9 h-9 rounded-md bg-white/[0.05] border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <Search className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                        <p className="text-[11px] text-slate-450 truncate">{item.brand} • {item.category}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
