/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ── Soft eye-friendly text palette ── */
      colors: {
        text: {
          primary:   '#dce3f0',   // warm off-white  (body text)
          heading:   '#e8edf7',   // slightly brighter heading
          secondary: '#94a3b8',   // slate-400
          muted:     '#64748b',   // slate-500
          accent:    '#3b82f6',   // blue-500
        },
        surface: {
          base:    '#070a13',
          card:    '#0d1527',
          raised:  '#111827',
        },
      },

      /* ── Font family ── */
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },

      /* ── Line heights ── */
      lineHeight: {
        relaxed: '1.65',
        snug:    '1.3',
      },

      /* ── Animations ── */
      animation: {
        "spin-slow":    "spin 8s linear infinite",
        "border-beam":  "border-beam calc(var(--duration)*1s) infinite linear",
        "fade-in":      "fadeIn 0.4s ease both",
        "slide-up":     "slideUp 0.35s ease both",
      },
      keyframes: {
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}