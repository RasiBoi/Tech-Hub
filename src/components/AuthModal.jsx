import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Store, ShieldAlert, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'signup'
  const [role, setRole] = useState('customer'); // 'customer' | 'vendor' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else {
        if (!name || !email || !password) {
          throw new Error('All fields are required.');
        }
        if (role === 'vendor' && !storeName) {
          throw new Error('Please enter your Store Name.');
        }
        await register(name, email, password, role, storeName);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="bg-white/95 border border-slate-200/80 w-full max-w-[480px] rounded-[32px] overflow-hidden shadow-2xl relative z-10 p-6 sm:p-8 text-slate-800"
        >
          {/* Top colored brand accent bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

          {/* Header Row */}
          <div className="flex items-center justify-between mb-6 mt-1">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-600 rounded-xl p-2.5 flex items-center justify-center shadow-md shadow-blue-600/10">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">
                Tech-Hub <span className="text-blue-500">AI</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Segmented Control Tabs */}
          <div className="flex bg-slate-100/80 p-1 rounded-2xl mb-6 border border-slate-200/30">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-2xl flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="font-semibold leading-relaxed">{error}</span>
              </div>
            )}

            {/* SIGNUP: Role Selection Cards */}
            {activeTab === 'signup' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600 tracking-wide block mb-1.5">
                  Choose Account Type
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'customer', title: 'Customer', desc: 'Shop & track', icon: <User className="w-4 h-4" /> },
                    { id: 'vendor', title: 'Vendor', desc: 'Sell gadgets', icon: <Store className="w-4 h-4" /> },
                    { id: 'admin', title: 'Admin', desc: 'Manage hub', icon: <ShieldAlert className="w-4 h-4" /> }
                  ].map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setRole(card.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-[92px] ${
                        role === card.id
                          ? 'border-blue-500 bg-blue-50/30 text-blue-900 shadow-[0_4px_12px_rgba(37,99,235,0.04)]'
                          : 'border-slate-200 bg-slate-50/40 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className={`p-1.5 rounded-lg border ${
                          role === card.id 
                            ? 'bg-blue-600 border-blue-500 text-white' 
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}>
                          {card.icon}
                        </div>
                        {role === card.id && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-100" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-black leading-none">{card.title}</p>
                        <p className="text-[9px] text-slate-400 mt-1 leading-none font-semibold">{card.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form inputs */}
            <div className="space-y-3.5">
              {activeTab === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 tracking-wide block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-800"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'signup' && role === 'vendor' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 tracking-wide block mb-1">
                    Store Name
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apple Official"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-800"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 tracking-wide block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-600 tracking-wide block">
                    Password
                  </label>
                  {activeTab === 'login' && (
                    <a href="#" className="text-[10.5px] font-extrabold text-blue-600 hover:underline">
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all shadow-md shadow-blue-600/10 hover:scale-[1.01] active:scale-99 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : activeTab === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
