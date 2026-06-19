import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Zap, Heart, ShoppingCart, Bell, ChevronDown, LogOut, Cpu, Store, Menu, X, Search 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  // Close menus on path changes or desktop resize
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
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
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);


  const isActive = (path) => location.pathname === path;
  const isCategoriesActive = location.pathname.startsWith('/category');
  const isVendorsActive = location.pathname.startsWith('/vendors');

  return (
    <>
      <nav className="bg-[#0b1021]/85 backdrop-blur-xl text-white py-2.5 lg:py-3.5 z-50 sticky top-0 w-full border-b border-white/[0.06] shadow-md transition-all duration-300">
        <div className="max-w-[1720px] mx-auto w-full px-4 lg:px-8 2xl:px-12 flex items-center justify-between gap-3 lg:gap-5 xl:gap-7">
          
          {/* Logo and Main Desktop Links */}
          <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 min-w-0">
            <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-95">
              <Zap className="text-yellow-400 w-6 h-6 fill-yellow-400" />
              <span className="text-xl font-bold tracking-wide">Tech-Hub</span>
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
              <Link 
                to="/#deals" 
                className="hover:text-white transition-colors text-slate-400 py-1"
                onClick={() => {
                  const el = document.getElementById('deals');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Deals
              </Link>
              
              {/* Vendors */}
              <Link 
                to="/vendors" 
                className={`hover:text-white transition-colors relative py-1 ${isVendorsActive ? 'text-white font-semibold' : 'text-slate-400'}`}
              >
                Vendors
                {isVendorsActive && <span className="absolute -bottom-4 left-0 w-full h-1 bg-blue-500 rounded-t-md"></span>}
              </Link>
              
              
              <Link to="/category/All" className="hover:text-white transition-colors text-slate-400 py-1">Support</Link>
              <Link to="/" className="hover:text-white transition-colors text-slate-400 py-1">About</Link>
            </div>
          </div>

          {/* Search Box */}
          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-[320px] xl:max-w-[390px] 2xl:max-w-[500px] mx-1 xl:mx-3 min-w-[220px]">
            <div className="flex-1 bg-white rounded-md flex items-center overflow-hidden h-10">
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/category/All`);
                  }
                }}
              />
              <button 
                onClick={() => navigate('/category/All')}
                className="bg-blue-600 h-full px-5 hover:bg-blue-700 transition-colors shrink-0"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Icons and User Actions */}
          <div className="flex items-center gap-2 xl:gap-4 2xl:gap-5 shrink-0">
            <div className="hidden xl:flex flex-col items-center gap-1 cursor-pointer group">
              <Heart className="w-5 h-5 text-slate-350 group-hover:text-white transition-colors" />
              <span className="text-[10px] text-slate-400 group-hover:text-white font-medium transition-colors">Wishlist</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 cursor-pointer group relative">
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-slate-350 group-hover:text-white transition-colors" />
                <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-[#0b1021] text-[10px] font-bold px-1.5 rounded-full border border-[#0b1021]">2</span>
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-white font-medium transition-colors">Cart</span>
            </div>

            <div className="hidden xl:flex flex-col items-center gap-1 cursor-pointer group relative">
              <div className="relative">
                <Bell className="w-5 h-5 text-slate-350 group-hover:text-white transition-colors" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-3 h-3 flex items-center justify-center rounded-full border border-[#0b1021]"></span>
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-white font-medium transition-colors">Notifications</span>
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

                {/* Profile Dropdown */}
                <div className="relative profile-dropdown-container">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 hover:opacity-90 transition-all focus:outline-none"
                  >
                    <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs font-black shadow-md ${user.avatarBg}`}>
                      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <span className="hidden md:inline text-xs font-extrabold text-slate-205">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
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
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors focus:outline-none"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setAuthModalTab('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-md transition-all whitespace-nowrap shadow-md shadow-blue-600/10 hover:scale-[1.02] flex items-center justify-center focus:outline-none"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              className="xl:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/15 text-slate-300 hover:text-white hover:border-white/40 transition-colors focus:outline-none"
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
              
              <Link 
                to="/#deals" 
                className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-colors" 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    const el = document.getElementById('deals');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                Deals
              </Link>
              
              <Link to="/vendors" className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Vendors</Link>
              <a href="#ai" className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-colors" onClick={triggerAiAssistant}>AI Assistant</a>
              <Link to="/category/All" className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Support</Link>
              <Link to="/" className="px-3 py-2 rounded-md bg-white/[0.04] hover:bg-white/[0.1] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
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
                      setAuthModalTab('login');
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-white/[0.04] hover:bg-white/[0.1] text-white text-xs font-extrabold py-2.5 rounded-xl transition-all border border-white/5 text-center flex items-center justify-center"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalTab('signup');
                      setIsAuthModalOpen(true);
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate('/category/All');
                    setIsMobileMenuOpen(false);
                  }
                }}
              />
              <button 
                onClick={() => { navigate('/category/All'); setIsMobileMenuOpen(false); }}
                className="bg-blue-600 h-full px-4 hover:bg-blue-700 transition-colors"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Global Auth Modal integration */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
}
