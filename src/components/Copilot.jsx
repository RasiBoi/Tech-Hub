import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, X, Send, Sparkles, ArrowUpRight, Search } from 'lucide-react';

/* Quick navigation shortcuts */
const QUICK = [
  { label: "Today's deals", to: '/category/All?deals=true&sort=rating' },
  { label: 'Browse catalog', to: '/category/All' },
  { label: 'Vendors', to: '/vendors' },
  { label: 'Become a seller', to: '/become-seller' },
  { label: 'My cart', to: '/cart' },
  { label: 'Dispute support', to: '/support' },
];

/* Rule-based navigation intents (keyword → destination) */
const INTENTS = [
  {
    keys: ['deal', 'offer', 'discount', 'sale', 'flash', 'promo', 'cheap'],
    to: '/category/All?deals=true&sort=rating',
    reply: "Here are today's best deals.",
  },
  {
    keys: ['become seller', 'become a seller', 'start selling', 'sell on', 'merchant', 'register vendor', 'open a store'],
    to: '/become-seller',
    reply: 'Nice — here is how to start selling on Tech-Hub.',
  },
  {
    keys: ['vendor', 'seller', 'store', 'brands', 'shops'],
    to: '/vendors',
    reply: 'Opening our verified vendors.',
  },
  {
    keys: ['cart', 'basket', 'checkout'],
    to: '/cart',
    reply: 'Taking you to your cart.',
  },
  {
    keys: ['support', 'dispute', 'return', 'refund', 'damaged', 'complaint', 'order problem', 'where is my order', 'track order', 'issue with'],
    to: '/support',
    reply: 'For orders, returns & refunds, Ms. Perera — our dispute specialist — can help.',
  },
  {
    keys: ['about', 'company', 'story', 'who are you'],
    to: '/about',
    reply: 'Here is more about Tech-Hub.',
  },
  {
    keys: ['account', 'profile', 'my orders', 'portal', 'dashboard', 'my order'],
    to: '/portal',
    reply: 'Opening your account portal.',
  },
  {
    keys: ['login', 'sign in', 'log in', 'signin'],
    to: '/login',
    reply: 'Taking you to sign in.',
  },
  {
    keys: ['home', 'homepage', 'main page', 'landing'],
    to: '/',
    reply: 'Back to the homepage.',
  },
  {
    keys: ['category', 'categories', 'browse', 'catalog', 'all products', 'shop'],
    to: '/category/All',
    reply: 'Browse the full catalog here.',
  },
];

function resolveIntent(text) {
  const t = text.toLowerCase().trim();
  for (const intent of INTENTS) {
    if (intent.keys.some((k) => t.includes(k))) {
      return { to: intent.to, reply: intent.reply, label: 'Open' };
    }
  }
  const q = encodeURIComponent(text.trim());
  return {
    to: `/category/All?q=${q}`,
    reply: `Let me search the catalog for “${text.trim()}”.`,
    label: 'View results',
  };
}

export default function Copilot() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm Navi, your Tech-Hub copilot. Tell me where you'd like to go or what you're looking for — I'll take you there.",
    },
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Keep the copilot out of the dedicated dispute-support experience
  if (location.pathname.startsWith('/support')) return null;

  const go = (to) => {
    navigate(to);
    setOpen(false);
  };

  const send = (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text) return;
    setInput('');
    const { to, reply, label } = resolveIntent(text);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text },
      { role: 'assistant', text: reply, action: { label, to } },
    ]);
  };

  return (
    <>
      {/* Floating launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-[60] size-14 rounded-full flex items-center justify-center text-white shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              boxShadow: '0 14px 40px -10px rgba(37,99,235,0.7)',
            }}
            aria-label="Open Tech-Hub Copilot"
          >
            <span className="absolute inset-0 rounded-full bg-blue-500/40 animate-ping [animation-duration:2.5s]" />
            <Compass className="relative w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-5 right-5 z-[60] w-[calc(100vw-2.5rem)] sm:w-[380px] h-[560px] max-h-[calc(100vh-2.5rem)] flex flex-col rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            style={{ background: 'rgba(11,17,32,0.97)', backdropFilter: 'blur(20px)' }}
          >
            {/* Header */}
            <div className="relative shrink-0 px-4 py-3.5 border-b border-white/10 flex items-center gap-3">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(120% 140% at 100% 0%, rgba(59,130,246,0.16), transparent 60%)' }}
              />
              <div
                className="relative size-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="relative flex-1 min-w-0">
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  Tech-Hub Copilot
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </span>
                </p>
                <p className="text-[11px] text-slate-400">Navigation assistant</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close copilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-white/[0.05] border border-white/10 text-slate-200 rounded-bl-md'
                    }`}
                  >
                    <p className="m-0">{m.text}</p>
                    {m.action && (
                      <button
                        type="button"
                        onClick={() => go(m.action.to)}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 hover:text-blue-200 transition-colors"
                      >
                        {m.action.label} <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Quick shortcuts (shown early) */}
              {messages.length <= 2 && (
                <div className="pt-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-0.5">
                    Quick links
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK.map((q) => (
                      <button
                        key={q.to}
                        type="button"
                        onClick={() => go(q.to)}
                        className="text-left text-xs text-slate-300 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 hover:border-blue-500/40 hover:bg-blue-500/10 transition-colors"
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="shrink-0 p-3 border-t border-white/10 flex items-center gap-2"
            >
              <div className="flex-1 flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/10 px-3.5 py-2 focus-within:border-blue-500/50 transition-colors">
                <Search className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Where do you want to go?"
                  className="flex-1 bg-transparent border-0 outline-none text-sm text-white placeholder:text-slate-500"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className="size-9 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
