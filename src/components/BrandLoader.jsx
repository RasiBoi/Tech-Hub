import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* Partner brands + logos carried over from the AI-Agent UI */
const BRANDS = ['DARAZ', 'ALIBABA', 'ALIEXPRESS', 'KAPRUKA', 'SHOPIFY'];

const PARTNER_LOGOS = [
  'https://res.cloudinary.com/dvcqsinux/image/upload/v1783525808/AliExpress-Logo.wine_yhgcsb.svg',
  'https://res.cloudinary.com/dvcqsinux/image/upload/v1783525809/logo-original-Black_gvenzx.png',
  'https://res.cloudinary.com/dvcqsinux/image/upload/v1783525808/Shopify_logo_h7etzz.svg',
  'https://res.cloudinary.com/dvcqsinux/image/upload/v1783525809/Alibaba-Logo_b9rt8m.png',
  'https://res.cloudinary.com/dvcqsinux/image/upload/v1783525809/kapruka_logo_word_twbvjg.webp',
  'https://res.cloudinary.com/dvcqsinux/image/upload/v1783525808/Daraz-logo_xzddef.png',
  'https://res.cloudinary.com/dvcqsinux/image/upload/v1783525808/WooCommerce_logo__2015.svg_chblbz.webp',
];

export default function BrandLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BRANDS.length);
    }, 850);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#070a13' }}
    >
      {/* Ambient blue glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 42%, rgba(59,130,246,0.16), transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full px-6">
        {/* Brand mark */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center gap-3 mb-10 sm:mb-14"
        >
          <div
            className="size-11 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              boxShadow: '0 10px 30px -8px rgba(37,99,235,0.6)',
            }}
          >
            <span className="text-white font-black text-xl leading-none">T</span>
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">Tech-Hub</span>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.5em] mb-3 sm:mb-5"
          style={{ color: '#60a5fa' }}
        >
          Connecting to
        </motion.div>

        {/* Rolling brand name */}
        <div className="h-[72px] sm:h-[120px] md:h-[150px] w-full relative flex justify-center items-center overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_32%,black_68%,transparent_100%)]">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={index}
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -90, opacity: 0 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.28 }}
              className="absolute inset-0 flex justify-center items-center text-5xl sm:text-8xl md:text-[7rem] font-black tracking-tighter text-white"
            >
              {BRANDS[index]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress line */}
        <div className="mt-8 sm:mt-12 flex flex-col items-center gap-3">
          <div
            className="w-28 sm:w-36 h-[2px] overflow-hidden rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <motion.div
              className="h-full"
              style={{ background: '#3b82f6' }}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <div
            className="text-[10px] font-medium tracking-[0.25em] uppercase"
            style={{ color: '#64748b' }}
          >
            Establishing secure link
          </div>
        </div>
      </div>

      {/* Trusted-by partner logo strip */}
      <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 flex flex-col items-center gap-4 z-10">
        <span
          className="text-[9px] font-bold uppercase tracking-[0.3em]"
          style={{ color: '#475569' }}
        >
          Trusted by
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2.5 px-6 max-w-3xl">
          {PARTNER_LOGOS.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
              className="flex items-center justify-center h-9 px-3 rounded-lg bg-white/95"
              style={{ boxShadow: '0 4px 14px -6px rgba(0,0,0,0.5)' }}
            >
              <img
                src={src}
                alt="Partner"
                className="h-4 sm:h-5 w-auto object-contain"
                loading="eager"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
