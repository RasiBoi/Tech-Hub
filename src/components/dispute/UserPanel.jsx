import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Hash,
  Package,
  Shield,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { MS_PERERA_AVATAR } from './VoiceBubble';

export default function UserPanel({ user, recentOrders = [], aiHealthy }) {
  const displayName = user?.name || 'Customer';
  const email = user?.email || '—';
  const aiId = user?.ai_uuid || user?.aiUuid || '—';
  const role = user?.role || 'customer';

  return (
    <aside className="sup-card overflow-hidden flex flex-col h-full" style={{ boxShadow: 'var(--sup-shadow-soft)' }}>
      <div
        className="relative px-5 pt-6 pb-5"
        style={{ borderBottom: '1px solid var(--sup-line)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top right, var(--sup-accent-tint), transparent 60%)',
          }}
        />
        <div className="relative flex items-start gap-3">
          <div
            className="size-12 rounded-2xl flex items-center justify-center text-lg font-semibold sup-serif"
            style={{ background: 'var(--sup-accent)', color: 'var(--sup-on-accent)' }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold sup-ink truncate">{displayName}</h3>
            <p className="sup-eyebrow mt-1">{role}</p>
            <div className="flex items-center gap-1.5 mt-2.5">
              <span
                className="size-1.5 rounded-full"
                style={{ background: aiHealthy ? 'var(--sup-accent)' : '#d0982f' }}
              />
              <span className="text-[10px] sup-muted font-medium">
                {aiHealthy ? 'Dispute AI online' : 'Dispute AI offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="px-5 py-4 space-y-3 text-xs"
        style={{ borderBottom: '1px solid var(--sup-line)' }}
      >
        <div className="flex items-center gap-2.5 sup-ink-soft">
          <Mail className="w-3.5 h-3.5 sup-faint shrink-0" />
          <span className="truncate">{email}</span>
        </div>
        <div className="flex items-start gap-2.5 sup-ink-soft">
          <Hash className="w-3.5 h-3.5 sup-faint shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="sup-label mb-0.5">AI customer id</p>
            <code className="text-[10px] sup-muted break-all font-mono">{aiId}</code>
          </div>
        </div>
        <div className="flex items-center gap-2.5 sup-ink-soft">
          <User className="w-3.5 h-3.5 sup-faint shrink-0" />
          <span>Account #{user?.id ?? '—'}</span>
        </div>
      </div>

      <div className="px-5 py-4 flex-1 min-h-0">
        <div className="flex items-center justify-between mb-3">
          <p className="sup-label">Recent orders</p>
          <Link
            to="/portal"
            className="text-[10px] sup-accent hover:opacity-80 font-semibold"
          >
            Portal
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-[11px] sup-faint leading-relaxed">
            No recent orders synced. Ask Ms. Perera with your order number (e.g. TH-00000012).
          </p>
        ) : (
          <ul className="space-y-2">
            {recentOrders.slice(0, 4).map((o) => (
              <li
                key={o.id || o.order_number}
                className="rounded-xl px-3 py-2.5"
                style={{ background: 'var(--sup-panel-2)', border: '1px solid var(--sup-line)' }}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 sup-accent shrink-0" />
                  <span className="text-[11px] font-semibold sup-ink truncate">
                    {o.order_number || `#${o.id}`}
                  </span>
                </div>
                <p className="text-[10px] sup-muted mt-1 capitalize">
                  {o.status || 'unknown'} · LKR{' '}
                  {Number(o.total_amount || 0).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        className="px-5 py-4"
        style={{ borderTop: '1px solid var(--sup-line)', background: 'var(--sup-panel-2)' }}
      >
        <div className="flex items-center gap-3">
          <img
            src={MS_PERERA_AVATAR}
            alt=""
            className="size-10 rounded-full object-cover"
            style={{ objectPosition: 'center 22%', boxShadow: '0 0 0 1px var(--sup-accent-line)' }}
          />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold sup-ink flex items-center gap-1">
              <Sparkles className="w-3 h-3 sup-accent" />
              Ms. Perera
            </p>
            <p className="text-[10px] sup-muted leading-snug">
              Your Tech-Hub dispute specialist — chat or voice.
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] sup-faint">
          <Shield className="w-3 h-3" />
          Policy-grounded · Multi-agent · Observable
        </div>
        <Link
          to="/portal"
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold sup-accent hover:opacity-80"
        >
          Manage account <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
