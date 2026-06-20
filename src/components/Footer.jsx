import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Activity, Bell, Mail, ArrowRight, Zap } from 'lucide-react';

export default function Footer() {
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [showSubscribedToast, setShowSubscribedToast] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscriberEmail.trim()) return;
    setShowSubscribedToast(true);
    setSubscriberEmail('');
    setTimeout(() => {
      setShowSubscribedToast(false);
    }, 3000);
  };

  return (
    <footer className="bg-[#070a13] border-t border-white/[0.06] pt-16 pb-8 relative overflow-hidden text-slate-400">
      {/* Ambient bottom glows */}
      <div className="absolute bottom-0 right-[15%] w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-0 left-[10%] w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Subtle Dot Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12 relative z-10">
        
        {/* Newsletter Bar */}
        <div className="bg-gradient-to-br from-[#0d1527]/90 via-[#090e1a]/95 to-[#0b1b36]/90 border border-white/[0.08] backdrop-blur-xl rounded-[32px] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
          <div className="absolute -right-24 -top-24 w-72 h-72 bg-blue-600/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden backdrop-blur-md">
              <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
              <Mail className="w-6 h-6 text-blue-400 relative z-10" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight">Stay Updated with Latest Tech Deals</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                Get exclusive offers, new arrivals & tech news delivered to your inbox.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex items-center bg-[#070a13]/60 border border-white/[0.08] p-1.5 rounded-2xl relative z-10 max-w-xl group focus-within:border-blue-500/40 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all duration-300 shadow-inner backdrop-blur-md">
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
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md shadow-blue-600/25 hover:scale-[1.02] active:scale-[0.98] shrink-0 focus:outline-none flex items-center gap-1.5"
            >
              Subscribe
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-white/[0.06]">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 hover:opacity-95 transition-opacity">
              <Zap className="text-yellow-400 w-6 h-6 fill-yellow-400 filter drop-shadow-[0_2px_8px_rgba(234,179,8,0.3)]" />
              <span className="text-xl font-bold tracking-wide text-white">Tech-Hub</span>
            </Link>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed max-w-xs">
              AI-powered electronics marketplace connecting buyers with trusted vendors worldwide.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 mt-6">
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
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
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
                  className="w-9 h-9 rounded-xl border border-white/[0.08] bg-[#0d1527]/50 hover:bg-blue-600 hover:border-blue-500 hover:text-white flex items-center justify-center text-slate-400 transition-all hover:scale-105 shadow-sm hover:shadow-blue-600/20"
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
              links: [
                { label: 'About Us', to: '/' },
                { label: 'Careers', to: '/' },
                { label: 'Press & Media', to: '/' },
                { label: 'Contact Us', to: '/' }
              ]
            },
            {
              title: 'Categories',
              links: [
                { label: 'Smartphones', to: '/category/All' },
                { label: 'Laptops', to: '/category/All' },
                { label: 'Accessories', to: '/category/All' },
                { label: 'Stands & Holders', to: '/category/Stands%20%26%20Holders' }
              ]
            },
            {
              title: 'Support',
              links: [
                { label: 'Help Center', to: '/category/All' },
                { label: 'Returns & Refunds', to: '/category/All' },
                { label: 'Shipping Info', to: '/category/All' },
                { label: 'Warranty', to: '/category/All' }
              ]
            },
            {
              title: 'Vendors',
              links: [
                { label: 'Become a Seller', to: '/become-seller' },
                { label: 'Seller Dashboard', to: '/vendor' },
                { label: 'Partner Program', to: '/vendors' },
                { label: 'Explore Partners', to: '/vendors' }
              ]
            }
          ].map((col, idx) => (
            <div key={idx} className="col-span-1">
              <h5 className="text-[11px] font-bold text-white uppercase tracking-widest mb-4">{col.title}</h5>
              <ul className="space-y-3">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      to={link.to} 
                      className="text-xs text-slate-400 hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 font-semibold inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright and metrics */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 pt-6">
          <p className="text-[11px] font-bold text-slate-500 order-3 md:order-1 text-center md:text-left">
            © 2026 Tech-Hub. All rights reserved. Built with pride for tech enthusiasts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 order-1 md:order-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] font-bold text-slate-350 shadow-sm hover:border-white/[0.1] hover:bg-white/[0.04] transition-all">
              <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
              Secure Payments
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] font-bold text-slate-350 shadow-sm hover:border-white/[0.1] hover:bg-white/[0.04] transition-all">
              <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
              Buyer Protection
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-[11px] font-bold text-slate-350 shadow-sm hover:border-white/[0.1] hover:bg-white/[0.04] transition-all">
              <Bell className="w-4 h-4 text-amber-500 shrink-0" />
              Privacy Protected
            </span>
          </div>

          {/* Payment badges */}
          <div className="flex items-center gap-2 order-2 md:order-3">
            <div className="h-7 w-11 rounded-lg bg-[#0d1527]/80 border border-white/[0.08] flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 hover:border-white/[0.15]">
              <span className="text-[9px] font-black text-white/90 italic tracking-tighter">VISA</span>
            </div>
            <div className="h-7 w-11 rounded-lg bg-[#0d1527]/80 border border-white/[0.08] flex items-center justify-center gap-[-4px] shrink-0 shadow-sm p-1 transition-all duration-300 hover:border-white/[0.15]">
              <div className="w-3 h-3 rounded-full bg-[#EB001B]/80 mr-[-3px]" />
              <div className="w-3 h-3 rounded-full bg-[#FF5F00]/80 opacity-90" />
            </div>
            <div className="h-7 w-11 rounded-lg bg-[#0d1527]/80 border border-white/[0.08] flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 hover:border-white/[0.15]">
              <span className="text-[8px] font-extrabold text-white/90 italic tracking-tight flex items-center">
                <span className="text-[#3b82f6]">Pay</span>Pal
              </span>
            </div>
            <div className="h-7 w-11 rounded-lg bg-[#0d1527]/80 border border-white/[0.08] flex items-center justify-center gap-0.5 shrink-0 shadow-sm px-1.5 transition-all duration-300 hover:border-white/[0.15]">
              <svg className="w-3 h-3 text-white/90 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.28-.58 2.94-1.39z" />
              </svg>
              <span className="text-[9px] font-black text-white/90 leading-none">Pay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Toast Alert */}
      {showSubscribedToast && (
        <div className="fixed bottom-6 right-6 bg-[#0d1527] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 z-50 border border-white/[0.08]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold">Successfully subscribed to tech deals!</span>
        </div>
      )}
    </footer>
  );
}
