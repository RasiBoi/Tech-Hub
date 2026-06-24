import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Cpu, Users, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const pillars = [
  {
    icon: Zap,
    title: 'Curated Setup Ecosystem',
    description:
      'We build a marketplace around complete productivity setups, not random product dumps. Every category is designed for real desk workflows.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Partner Stores',
    description:
      'Vendor storefronts are quality-checked with transparent ratings, catalog consistency, and customer trust signals.',
  },
  {
    icon: Cpu,
    title: 'Performance First Platform',
    description:
      'From backend optimizations to frontend caching, we continuously improve response speed so discovery feels instant.',
  },
  {
    icon: Users,
    title: 'Community Driven Design',
    description:
      'Our roadmap is shaped by real user feedback from creators, students, and professionals building better workspaces.',
  },
];

export default function About() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-[#070a13] text-slate-100'}`}>
      <Navbar />

      <main className="flex-1">
        <section className={`border-b ${isLight ? 'border-slate-200' : 'border-white/[0.06]'} py-14 sm:py-18`}>
          <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12">
            <div className="max-w-4xl">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-black tracking-wider uppercase border ${isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-500/10 text-blue-300 border-blue-500/25'}`}>
                <Zap className="w-3.5 h-3.5" />
                About Tech-Hub
              </span>
              <h1 className={`mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Building Better Workspaces Through Smart Tech Curation
              </h1>
              <p className={`mt-5 text-sm sm:text-base max-w-3xl font-medium ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>
                Tech-Hub is a modern e-commerce platform focused on productivity accessories, ergonomic hardware,
                and setup-driven discovery. Our goal is simple: help people assemble clean, high-performance desk
                environments without wasting time.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <article
                    key={pillar.title}
                    className={`rounded-2xl border p-5 sm:p-6 transition-all ${isLight ? 'bg-white border-slate-200 shadow-[0_10px_28px_rgba(15,23,42,0.08)]' : 'bg-[#0d1527]/40 border-white/[0.08] shadow-xl backdrop-blur-sm'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-blue-500/10 text-blue-300 border border-blue-500/30'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className={`mt-4 text-lg font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {pillar.title}
                    </h2>
                    <p className={`mt-2 text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>
                      {pillar.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className={`py-4 pb-14 sm:pb-16 ${isLight ? '' : ''}`}>
          <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12">
            <div className={`rounded-3xl border p-6 sm:p-8 lg:p-10 ${isLight ? 'bg-white border-slate-200 shadow-[0_14px_34px_rgba(15,23,42,0.10)]' : 'bg-[#0b1021]/70 border-white/[0.08] shadow-2xl'}`}>
              <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Ready to Upgrade Your Setup?
              </h3>
              <p className={`mt-2 text-sm sm:text-base max-w-2xl ${isLight ? 'text-slate-600' : 'text-slate-350'}`}>
                Explore categories, compare partner stores, and build your ideal workspace with products that actually match your style.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/category/All"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black px-5 py-3 transition-colors"
                >
                  Explore Categories
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/vendors"
                  className={`inline-flex items-center gap-2 rounded-xl text-sm font-black px-5 py-3 border transition-colors ${isLight ? 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50' : 'bg-transparent text-slate-200 border-white/[0.2] hover:bg-white/[0.06]'}`}
                >
                  Browse Vendors
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
