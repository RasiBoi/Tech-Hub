import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Activity, Bell } from 'lucide-react';

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
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 relative overflow-hidden text-slate-400">
      {/* Ambient bottom glow */}
      <div className="absolute bottom-0 right-[10%] w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 2xl:px-12 relative z-10">
        
        {/* Newsletter Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 rounded-[32px] border border-blue-900/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
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

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex items-center bg-white/5 border border-white/10 p-1.5 rounded-2xl relative z-10 max-w-xl group focus-within:border-blue-500/50 transition-all duration-300 shadow-inner">
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
              className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs px-6 py-3.5 rounded-xl transition-all shadow-md hover:scale-[1.02] active:scale-98 shrink-0 focus:outline-none"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-900">
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
            
            {/* Social Icons */}
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
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
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
                { label: 'Become a Seller', to: '/login' },
                { label: 'Seller Dashboard', to: '/vendor' },
                { label: 'Partner Program', to: '/vendors' },
                { label: 'Explore Partners', to: '/vendors' }
              ]
            }
          ].map((col, idx) => (
            <div key={idx} className="col-span-1">
              <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">{col.title}</h5>
              <ul className="space-y-3">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link to={link.to} className="text-xs text-slate-400 hover:text-blue-400 transition-colors font-semibold">
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
            © 2026 Tech-Hub AI. All rights reserved. Built with pride for tech enthusiasts.
          </p>

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
            <div className="h-6 w-9 rounded bg-[#1A1F71] flex items-center justify-center shrink-0 border border-white/5 shadow-sm">
              <span className="text-[7.5px] font-black text-white italic tracking-tighter">VISA</span>
            </div>
            <div className="h-6 w-9 rounded bg-[#161B22] flex items-center justify-center gap-[-4px] shrink-0 border border-white/5 shadow-sm p-1">
              <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] mr-[-4px]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F00] opacity-90" />
            </div>
            <div className="h-6 w-9 rounded bg-[#003087] flex items-center justify-center shrink-0 border border-white/5 shadow-sm">
              <span className="text-[7px] font-extrabold text-white italic tracking-tight flex items-center">
                <span className="text-[#0079C1]">Pay</span>Pal
              </span>
            </div>
            <div className="h-6 w-9 rounded bg-white flex items-center justify-center gap-0.5 shrink-0 border border-slate-200 shadow-sm px-1.5">
              <svg className="w-2.5 h-2.5 text-black fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.28-.58 2.94-1.39z" />
              </svg>
              <span className="text-[7.5px] font-black text-black leading-none">Pay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Toast Alert */}
      {showSubscribedToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 z-50 border border-slate-800/80">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold">Successfully subscribed to tech deals!</span>
        </div>
      )}
    </footer>
  );
}
