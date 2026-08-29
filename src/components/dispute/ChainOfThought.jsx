import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Check,
  Database,
  Globe,
  HeartPulse,
  Loader2,
  Route as RouteIcon,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';

function pickIcon(item) {
  const key = item.matchKey || '';
  if (item.type === 'tool') {
    if (key.startsWith('tool:crm') || key.startsWith('tool:order')) return HeartPulse;
    if (key.startsWith('tool:rag')) return Database;
    if (key.startsWith('tool:web')) return Globe;
    if (key.startsWith('tool:cag')) return Zap;
    return Wrench;
  }
  if (key.includes('cache')) return Zap;
  if (key.includes('recall') || key.includes('memory')) return Brain;
  if (key.includes('route') || key.includes('classif')) return RouteIcon;
  if (key.includes('synth')) return Sparkles;
  return Sparkles;
}

export default function ChainOfThought({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="flex gap-3">
      <div
        className="shrink-0 size-9 rounded-full flex items-center justify-center"
        style={{
          background: 'var(--sup-accent-tint)',
          border: '1px solid var(--sup-accent-line)',
          color: 'var(--sup-accent)',
        }}
      >
        <Brain size={16} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl rounded-tl-md px-4 py-3.5 text-sm space-y-2 flex-1 max-w-[88%]"
        style={{
          background: 'var(--sup-panel-2)',
          border: '1px solid var(--sup-line)',
          boxShadow: 'var(--sup-shadow-soft)',
        }}
      >
        <div className="sup-label mb-1 flex items-center gap-1.5">
          <span className="inline-flex size-1.5 rounded-full animate-pulse" style={{ background: 'var(--sup-accent)' }} />
          Multi-agent thinking
        </div>
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const Icon = pickIcon(item);
            const done = item.status === 'done';
            const error = item.status === 'error';
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-start gap-2.5 text-sm"
                style={{ color: done ? 'var(--sup-muted)' : 'var(--sup-ink)' }}
              >
                <div
                  className="shrink-0 mt-0.5 size-5 rounded-md flex items-center justify-center"
                  style={{
                    background: error
                      ? 'rgba(192, 83, 47, 0.14)'
                      : done
                        ? 'var(--sup-accent-tint)'
                        : 'var(--sup-accent-tint)',
                    border: `1px solid ${error ? 'rgba(192, 83, 47, 0.4)' : 'var(--sup-accent-line)'}`,
                    color: error ? '#c0532f' : 'var(--sup-accent)',
                  }}
                >
                  {item.status === 'running' ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : done ? (
                    <Check size={12} />
                  ) : (
                    <Icon size={12} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="leading-snug">
                    <span>{item.label}</span>
                    {done && typeof item.ms === 'number' && (
                      <span className="text-[10px] sup-faint ml-2">{item.ms} ms</span>
                    )}
                  </div>
                  {item.detail && done && (
                    <div className="text-[11px] sup-faint truncate">{item.detail}</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
