import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

const STATE_COLORS = {
  idle: { primary: '#64748b', secondary: '#94a3b8', glow: 'rgba(100,116,139,0.35)' },
  listening: { primary: '#38bdf8', secondary: '#7dd3fc', glow: 'rgba(56,189,248,0.45)' },
  thinking: { primary: '#60a5fa', secondary: '#93c5fd', glow: 'rgba(96,165,250,0.4)' },
  speaking: { primary: '#34d399', secondary: '#6ee7b7', glow: 'rgba(52,211,153,0.45)' },
  error: { primary: '#f87171', secondary: '#fca5a5', glow: 'rgba(248,113,113,0.4)' },
};

export const MS_PERERA_AVATAR = '/ms-perera-avatar.png';

/**
 * Audio-reactive Ms. Perera avatar — inspired by AI-Agent/ui VoiceBubble,
 * restyled for Tech-Hub dark ecommerce theme.
 */
export default function VoiceBubble({ state = 'idle', amplitude = 0, size = 160, label }) {
  const raw = useMotionValue(0);
  const smoothed = useSpring(raw, { stiffness: 200, damping: 25, mass: 0.4 });

  useEffect(() => {
    if (state === 'listening' || state === 'speaking') {
      raw.set(Math.min(1, Math.max(0, amplitude)));
    }
  }, [amplitude, state, raw]);

  useEffect(() => {
    if (state === 'listening' || state === 'speaking') return undefined;
    let cancelled = false;
    let t = 0;
    const tick = () => {
      if (cancelled) return;
      t += 0.04;
      const wave =
        state === 'thinking'
          ? 0.35 + 0.25 * Math.sin(t * 3.0)
          : 0.1 + 0.07 * Math.sin(t * 1.2);
      raw.set(wave);
      requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [state, raw]);

  const colors = STATE_COLORS[state] || STATE_COLORS.idle;
  const half = size / 2;
  const avatarR = size * 0.42;
  const borderWidth = 3;

  const ring1R = useTransform(smoothed, (a) => avatarR + 6 + a * 12);
  const ring2R = useTransform(smoothed, (a) => avatarR + 14 + a * 20);
  const ring3R = useTransform(smoothed, (a) => avatarR + 22 + a * 28);
  const ring1Opacity = useTransform(smoothed, (a) => 0.5 + a * 0.4);
  const ring2Opacity = useTransform(smoothed, (a) => 0.3 + a * 0.3);
  const ring3Opacity = useTransform(smoothed, (a) => 0.15 + a * 0.2);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 overflow-visible pointer-events-none"
        >
          <defs>
            <filter id="thAvatarGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <motion.circle
            cx={half}
            cy={half}
            r={ring3R}
            fill="none"
            stroke={colors.secondary}
            strokeWidth={1.5}
            style={{ opacity: ring3Opacity }}
            filter="url(#thAvatarGlow)"
          />
          <motion.circle
            cx={half}
            cy={half}
            r={ring2R}
            fill="none"
            stroke={colors.primary}
            strokeWidth={2}
            style={{ opacity: ring2Opacity }}
          />
          <motion.circle
            cx={half}
            cy={half}
            r={ring1R}
            fill="none"
            stroke={colors.primary}
            strokeWidth={borderWidth}
            style={{ opacity: ring1Opacity }}
          />
        </svg>

        <div
          className="absolute rounded-full overflow-hidden shadow-lg shadow-blue-500/10 flex items-center justify-center bg-surface-card"
          style={{
            width: avatarR * 2,
            height: avatarR * 2,
            border: `${borderWidth}px solid ${colors.primary}`,
          }}
        >
          <img
            src={MS_PERERA_AVATAR}
            alt="Ms. Perera"
            className="w-full h-full object-cover select-none pointer-events-none scale-110"
            style={{ objectPosition: 'center 12%' }}
          />
        </div>
      </div>

      {label && (
        <span
          className="text-[10px] uppercase tracking-[0.22em] font-bold"
          style={{ color: colors.primary }}
        >
          {label}
        </span>
      )}

      {(state === 'speaking' || state === 'listening') && (
        <div className="flex items-center justify-center gap-[3px] h-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{ width: 3, backgroundColor: colors.primary }}
              animate={{
                height: [6, 14 + Math.random() * 10, 6, 18 + Math.random() * 6, 6],
              }}
              transition={{
                duration: 0.8 + i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
