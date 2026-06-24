import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Store, ChevronRight, Search, Users, ShoppingBag, Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { isRequestAbortError, requestJson } from '../services/httpClient';
import { serviceRegistry } from '../config/serviceRegistry';
import { InfiniteSlider } from '../components/ui/infinite-slider';
import { MorphingCardStack } from '../components/ui/morphing-card-stack';

export default function Vendors() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [isUsingCachedData, setIsUsingCachedData] = useState(false);

  const loadVendors = useCallback(async () => {
    const cacheKey = 'techhub:vendors:approved:v1';
    const cacheTtlMs = 5 * 60 * 1000;

    let hasCachedData = false;

    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        const isValid = parsed && Array.isArray(parsed.data) && typeof parsed.timestamp === 'number';

        if (isValid && parsed.data.length > 0) {
          setVendors(parsed.data);
          setLoading(false);
          setSyncing(true);
          setIsUsingCachedData(Date.now() - parsed.timestamp >= cacheTtlMs);
          hasCachedData = true;
        }
      }
    } catch {
      // Ignore cache parsing errors and continue with a network request.
    }

    let lastError = null;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        if (!hasCachedData) {
          setLoading(true);
        }

        const data = await requestJson(`${serviceRegistry.catalog}/vendors`, {
          timeoutMs: 20000,
          omitAuth: true,
        });

        if (Array.isArray(data)) {
          setVendors(data);
          setLoadError('');
          setIsUsingCachedData(false);
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
          break;
        }
      } catch (e) {
        lastError = e;
        if (isRequestAbortError(e) && attempt === 0) {
          continue;
        }
        if (attempt === 0) {
          continue;
        }
      }
    }

    if (lastError && !hasCachedData) {
      setLoadError('Unable to load partner directory right now. Please retry.');
      console.error('Failed to load vendors:', lastError);
    }

    setLoading(false);
    setSyncing(false);
  }, []);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const filteredVendors = vendors.filter(vendor => {
    const searchLower = searchQuery.toLowerCase();
    const name = vendor.store_name || vendor.name || '';
    const desc = vendor.store_description || '';
    return (
      name.toLowerCase().includes(searchLower) ||
      desc.toLowerCase().includes(searchLower)
    );
  });

  const handleCardClick = (card) => {
    navigate(`/vendors/${card.id}`);
  };

  const stackCards = filteredVendors.map(vendor => {
    const nameStr = vendor.store_name || vendor.name || '?';
    const initials = nameStr
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return {
      id: String(vendor.id),
      title: nameStr,
      description: vendor.store_description || 'Premium workspace accessories & gear.',
      bannerUrl: vendor.banner_url,
      avatarBg: vendor.avatar_bg,
      initials: initials,
      rating: vendor.rating || 5.0,
      productsCount: vendor.products_count || 0,
      followersCount: vendor.followers_count || 0,
    };
  });

  return (
    <div className="min-h-screen bg-[#070a13] font-sans text-slate-200 overflow-x-hidden flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Breadcrumbs Bar */}
        <div className="bg-[#0b1021]/60 border-b border-white/[0.06] py-3.5">
          <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-blue-400 font-bold">Ecosystem Partners</span>
          </div>
        </div>

        {/* Page Header */}
        <header className="bg-transparent pt-10 pb-8 border-b border-white/[0.06]">
          <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="text-left">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
                  Ecosystem Partners
                </h1>
                <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                  <Store className="w-3.5 h-3.5 text-blue-400" />
                  Verified Hub
                </span>
              </div>
              <p className="mt-2.5 text-sm text-slate-400 font-medium max-w-2xl">
                Explore direct store catalog integrations, product warranties, and setups curated by official tech manufacturers.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-450" />
              <input
                type="text"
                placeholder="Search verified partners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0d1527] border border-white/[0.06] hover:border-white/15 focus:border-blue-500/50 rounded-2xl text-sm font-semibold text-white transition-all outline-none placeholder:text-slate-500"
              />
              {syncing && (
                <p className="mt-2 text-[11px] font-semibold text-slate-500">Refreshing partner directory...</p>
              )}
              {isUsingCachedData && !syncing && (
                <p className="mt-2 text-[11px] font-semibold text-amber-500">Showing cached partners while live sync is unavailable.</p>
              )}
            </div>
          </div>
        </header>

        {/* Logo Cloud Banner showing dynamic vendor brands */}
        {!loading && vendors.length > 0 && (
          <section className="bg-[#0b1021]/30 py-6 border-b border-white/[0.04] overflow-hidden">
            <div className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Verified Ecosystem Brands</p>
              <InfiniteSlider gap={36} reverse duration={40}>
                {vendors.map((v) => {
                  const nameStr = v.store_name || v.name || '?';
                  const initials = nameStr
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <div 
                      key={`slide-${v.id}`}
                      className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-[#0d1527] border border-white/[0.05] backdrop-blur-md select-none shrink-0"
                    >
                      <div className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${v.avatar_bg || 'from-blue-600 to-indigo-500'} flex items-center justify-center text-xs font-black text-white shadow-md border border-white/5`}>
                        {initials}
                      </div>
                      <span className="text-xs font-extrabold text-white tracking-wide">{nameStr}</span>
                    </div>
                  );
                })}
              </InfiniteSlider>
            </div>
          </section>
        )}

        {/* Main Content Area */}
        <main className="max-w-[1720px] mx-auto px-4 lg:px-8 2xl:px-12 py-12">
          {loading && vendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm font-medium text-slate-400">Loading verified hub directory...</p>
            </div>
          ) : loadError && vendors.length === 0 ? (
            <div className="text-center py-20 bg-[#0d1527]/20 border border-white/[0.04] rounded-3xl p-8">
              <Store className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-lg font-extrabold text-white mb-1">Directory Unavailable</h3>
              <p className="text-sm text-slate-400">{loadError}</p>
              <button
                onClick={loadVendors}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2.5 transition-colors"
              >
                Retry Loading Partners
              </button>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-20 bg-[#0d1527]/20 border border-white/[0.04] rounded-3xl p-8">
              <Store className="w-12 h-12 text-slate-650 mx-auto mb-4" />
              <h3 className="text-lg font-extrabold text-white mb-1">No Partners Found</h3>
              <p className="text-sm text-slate-400">We couldn't find any approved ecosystem partners matching your search.</p>
            </div>
          ) : (
            <div className="py-6 max-w-5xl mx-auto">
              <MorphingCardStack 
                cards={stackCards} 
                onCardClick={handleCardClick}
              />
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
