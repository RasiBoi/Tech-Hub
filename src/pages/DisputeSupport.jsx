import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Send,
  Loader2,
  ArrowLeft,
  Phone,
  X,
  Menu,
  Shield,
  ArrowUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MessageBubble from '../components/dispute/MessageBubble';
import ChainOfThought from '../components/dispute/ChainOfThought';
import VoiceRoom from '../components/dispute/VoiceRoom';
import UserPanel from '../components/dispute/UserPanel';
import { MS_PERERA_AVATAR } from '../components/dispute/VoiceBubble';
import { useAuth } from '../context/AuthContext';
import { useAiHealth } from '../hooks/useAiHealth';
import { requestJson } from '../services/httpClient';
import { serviceRegistry } from '../config/serviceRegistry';
import {
  askDisputeAssistant,
  createDisputeSession,
  fetchDisputeSessionTurns,
  getAiHealthLabel,
  isAiOnline,
  listDisputeSessions,
  mintDisputeChatToken,
} from '../services/aiService';

const THINKING_STAGES = [
  { id: 'cache', label: 'Checking semantic cache', matchKey: 'stage:cache' },
  { id: 'memory', label: 'Recalling conversation memory', matchKey: 'stage:recall_st' },
  { id: 'route', label: 'Classifying dispute intent', matchKey: 'stage:route' },
  { id: 'tools', label: 'Retrieving orders & policies', matchKey: 'stage:tools' },
  { id: 'synth', label: 'Synthesising response', matchKey: 'stage:synth' },
];

const SAMPLE_PROMPTS = [
  'Where is my recent order?',
  'I received a damaged product — what should I do?',
  'What is the return policy for electronics?',
  'Can I cancel an order that has not shipped yet?',
];

export default function DisputeSupport() {
  const { user } = useAuth();
  const userId = user?.ai_uuid || user?.aiUuid;
  const [chatToken, setChatToken] = useState(null);
  const [tokenExp, setTokenExp] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState(null);
  const { health: aiHealth } = useAiHealth();
  const aiOnline = isAiOnline(aiHealth);
  const aiLabel = getAiHealthLabel(aiHealth);
  const aiDegraded = aiOnline && (aiHealth.status === 'degraded' || aiHealth.neo4j === 'unavailable');
  const aiAccent = !aiOnline ? '#d0982f' : aiDegraded ? '#d0982f' : 'var(--sup-accent)';
  const [thoughts, setThoughts] = useState([]);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const endRef = useRef(null);
  const stageTimer = useRef(null);

  const ensureToken = useCallback(async () => {
    if (chatToken && tokenExp > Date.now() / 1000 + 60) return chatToken;
    const minted = await mintDisputeChatToken();
    setChatToken(minted.token);
    setTokenExp(minted.expires_at);
    return minted.token;
  }, [chatToken, tokenExp]);

  const refreshSessions = useCallback(
    async (token) => {
      if (!userId) return [];
      const data = await listDisputeSessions({ userId, chatToken: token });
      const list = data?.sessions || data || [];
      const normalized = Array.isArray(list) ? list : [];
      setSessions(normalized);
      return normalized;
    },
    [userId],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!userId) {
        setBooting(false);
        return;
      }
      try {
        const [ordersData] = await Promise.all([
          requestJson(`${serviceRegistry.commerce}/orders`).catch(() => null),
        ]);
        if (!cancelled) {
          const orders = Array.isArray(ordersData)
            ? ordersData
            : ordersData?.data || [];
          setRecentOrders(orders.slice(0, 6));
        }
        const token = await ensureToken();
        const list = await refreshSessions(token);
        if (cancelled) return;
        if (list?.length) {
          setActiveSessionId(list[0].session_id);
        } else {
          const created = await createDisputeSession({
            userId,
            title: 'New dispute conversation',
            chatToken: token,
          });
          setActiveSessionId(created.session_id);
          await refreshSessions(token);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setError(e.message || 'Failed to start dispute chat');
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!userId || !activeSessionId) return;
      try {
        const token = await ensureToken();
        const data = await fetchDisputeSessionTurns({
          sessionId: activeSessionId,
          userId,
          chatToken: token,
        });
        if (cancelled) return;
        const turns = data?.turns || [];
        setMessages(
          turns.map((t, i) => ({
            id: `${activeSessionId}-${i}`,
            role: t.role,
            content: t.content,
            meta: t.meta || null,
          })),
        );
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeSessionId, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thoughts]);

  useEffect(() => {
    if (!voiceOpen) return undefined;
    const id = window.setInterval(() => {
      ensureToken().then((token) => refreshSessions(token)).catch(() => {});
    }, 4000);
    return () => clearInterval(id);
  }, [voiceOpen, ensureToken, refreshSessions]);

  const startStages = () => {
    const seeded = THINKING_STAGES.map((s, i) => ({
      id: s.id,
      label: s.label,
      matchKey: s.matchKey,
      type: 'stage',
      status: i === 0 ? 'running' : 'pending',
      ms: undefined,
      detail: '',
    }));
    setThoughts(seeded);
    let i = 0;
    const started = Date.now();
    stageTimer.current = window.setInterval(() => {
      i = Math.min(i + 1, THINKING_STAGES.length - 1);
      setThoughts((prev) =>
        prev.map((row, idx) => {
          if (idx < i) {
            return {
              ...row,
              status: 'done',
              ms: row.ms ?? 180 + idx * 90 + Math.floor(Math.random() * 80),
            };
          }
          if (idx === i) return { ...row, status: 'running' };
          return row;
        }),
      );
      if (i >= THINKING_STAGES.length - 1) {
        // keep last running until response
      }
      void started;
    }, 550);
  };

  const stopStages = () => {
    if (stageTimer.current) {
      clearInterval(stageTimer.current);
      stageTimer.current = null;
    }
    setThoughts((prev) =>
      prev.map((row) =>
        row.status === 'running' || row.status === 'pending'
          ? { ...row, status: 'done', ms: row.ms ?? 120 }
          : row,
      ),
    );
    window.setTimeout(() => setThoughts([]), 400);
  };

  const handleNewSession = async () => {
    try {
      const token = await ensureToken();
      const created = await createDisputeSession({
        userId,
        title: 'New dispute conversation',
        chatToken: token,
      });
      setActiveSessionId(created.session_id);
      setMessages([]);
      setSidebarOpen(false);
      await refreshSessions(token);
    } catch (e) {
      setError(e.message || 'Could not create session');
    }
  };

  const handleSend = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading || !activeSessionId || !userId) return;

    setInput('');
    setError(null);
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', content: text }]);
    setLoading(true);
    startStages();

    try {
      const token = await ensureToken();
      const started = performance.now();
      const res = await askDisputeAssistant({
        userId,
        sessionId: activeSessionId,
        message: text,
        chatToken: token,
      });
      const answer = res?.answer || res?.response || res?.message || 'No response received.';
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: answer,
          meta: {
            route: res?.route || res?.routes?.[0],
            latency_ms: res?.latency_ms ?? performance.now() - started,
          },
        },
      ]);
      await refreshSessions(token);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Dispute AI request failed');
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content:
            'Sorry — I could not reach the dispute assistant. Check that the AI service is running.',
        },
      ]);
    } finally {
      stopStages();
      setLoading(false);
    }
  };

  const activeSession = sessions.find((s) => s.session_id === activeSessionId);

  return (
    <div className="support-shell min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-3 sm:px-6 py-5 sm:py-8 flex flex-col min-h-0">
        {/* Header */}
        <header
          className="sup-card shrink-0 mb-4 sm:mb-5 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 sm:py-4"
          style={{ boxShadow: 'var(--sup-shadow-soft)' }}
        >
          <button
            type="button"
            className="lg:hidden sup-btn-ghost p-2 rounded-xl"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="relative shrink-0">
            <img
              src={MS_PERERA_AVATAR}
              alt="Ms. Perera"
              className="size-11 sm:size-12 rounded-full object-cover"
              style={{ objectPosition: 'center 22%', boxShadow: '0 0 0 1px var(--sup-line)' }}
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2"
              style={{
                background: aiAccent,
                borderColor: 'var(--sup-panel)',
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="sup-eyebrow mb-1.5">Support Desk</p>
            <h1 className="sup-serif text-lg sm:text-[22px] leading-none truncate">Dispute Support</h1>
            <p className="text-[11px] sm:text-xs sup-muted truncate mt-1.5">
              {activeSession?.title || 'Multi-agent order & policy assistant · Ms. Perera'}
            </p>
          </div>

          <div
            className={`hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full ${
              aiOnline ? 'sup-pill sup-pill-online' : 'sup-pill'
            }`}
            title={
              aiHealth.neo4j && aiHealth.neo4j !== 'not_configured'
                ? `Neo4j: ${aiHealth.neo4j}`
                : undefined
            }
          >
            <span
              className="size-1.5 rounded-full"
              style={{ background: aiAccent }}
            />
            {aiLabel}
          </div>

          <button
            type="button"
            onClick={() => setVoiceOpen(true)}
            className="sup-btn inline-flex items-center justify-center gap-2 size-11 sm:size-auto sm:h-11 sm:px-5 rounded-full text-xs sm:text-sm font-semibold shrink-0"
            style={{ boxShadow: 'var(--sup-shadow-soft)' }}
          >
            <Phone size={15} />
            <span className="hidden sm:inline">Talk to Ms. Perera</span>
          </button>
        </header>

        <div className="flex-1 grid lg:grid-cols-[236px_1fr_280px] gap-4 sm:gap-5 min-h-[70vh] relative">
          {/* Sessions sidebar */}
          <aside
            className={`${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 transition-transform absolute lg:relative inset-y-0 left-0 z-30 lg:z-0 w-[236px] sup-card p-4 sm:p-5 flex flex-col h-full`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="sup-label">Conversations</h2>
              <button
                type="button"
                onClick={handleNewSession}
                className="sup-btn-ghost size-8 rounded-xl inline-flex items-center justify-center"
                title="New conversation"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto -mx-1 px-1 space-y-1.5">
              {sessions.map((s) => {
                const isActive = activeSessionId === s.session_id;
                const isVoice = String(s.session_id || '').startsWith('voice-');
                return (
                  <button
                    key={s.session_id}
                    type="button"
                    onClick={() => {
                      setActiveSessionId(s.session_id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition border ${
                      isActive
                        ? 'sup-row-active'
                        : 'border-transparent sup-ink-soft hover:border-[color:var(--sup-line)]'
                    }`}
                  >
                    <span className="line-clamp-2 font-medium flex items-center gap-1.5">
                      {isVoice && <Phone className="w-3 h-3 shrink-0 sup-accent" />}
                      {s.title || s.session_id}
                    </span>
                  </button>
                );
              })}
              {!sessions.length && (
                <p className="text-[11px] sup-faint px-1 leading-relaxed">
                  No conversations yet. Start by asking a question.
                </p>
              )}
            </div>
            <Link
              to="/portal"
              className="mt-4 text-[11px] sup-muted hover:text-[color:var(--sup-accent)] inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back to portal
            </Link>
          </aside>

          {sidebarOpen && (
            <button
              type="button"
              className="absolute inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-sm rounded-2xl"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Chat column */}
          <section
            className="sup-card flex flex-col overflow-hidden min-h-[65vh] relative"
            style={{ boxShadow: 'var(--sup-shadow)' }}
          >
            <div className="flex-1 overflow-y-auto px-4 sm:px-7 py-6 sm:py-8 pb-40">
              {booting && (
                <div className="flex items-center gap-2 sup-muted text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" /> Connecting to Ms. Perera…
                </div>
              )}
              {!booting && !userId && (
                <p className="text-sm" style={{ color: '#b4802a' }}>
                  Your account is missing an AI identity (<code>ai_uuid</code>). Please re-login
                  after backend migrations.
                </p>
              )}
              {!booting && messages.length === 0 && userId && (
                <div className="max-w-2xl mx-auto text-center py-6 sm:py-12 space-y-6 animate-fade-in flex flex-col items-center">
                  <div className="relative">
                    <div
                      className="absolute -inset-2 rounded-full blur-2xl"
                      style={{ background: 'var(--sup-accent-tint)' }}
                    />
                    <img
                      src={MS_PERERA_AVATAR}
                      alt="Ms. Perera"
                      className="relative size-24 sm:size-28 rounded-full object-cover"
                      style={{
                        objectPosition: 'center 22%',
                        boxShadow: 'var(--sup-shadow), 0 0 0 1px var(--sup-line)',
                      }}
                    />
                    <span
                      className="absolute bottom-1.5 right-1.5 size-4 rounded-full border-2"
                      style={{ background: 'var(--sup-accent)', borderColor: 'var(--sup-panel)' }}
                    />
                  </div>
                  <div className="space-y-3">
                    <p className="sup-eyebrow">Ms. Perera · Dispute Resolution Specialist</p>
                    <h2 className="sup-serif text-[28px] sm:text-[38px] leading-[1.08]">
                      How can I help you
                      <br className="hidden sm:block" /> today?
                    </h2>
                    <p className="text-sm sup-muted max-w-lg mx-auto leading-relaxed">
                      Hi{user?.name ? `, ${String(user.name).split(' ')[0]}` : ''} — I&apos;m your
                      Tech-Hub dispute specialist. I resolve orders, returns, refunds and
                      damaged-item claims, grounded in your real profile and approved vendor
                      policies. Ask me anything, by chat or voice.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {['Order tracking', 'Returns & refunds', 'Damaged items', 'Vendor policies'].map(
                      (cap) => (
                        <span
                          key={cap}
                          className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                          style={{
                            background: 'var(--sup-accent-tint)',
                            color: 'var(--sup-accent-ink)',
                            border: '1px solid var(--sup-accent-line)',
                          }}
                        >
                          {cap}
                        </span>
                      ),
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2.5 text-left w-full max-w-xl pt-1">
                    {SAMPLE_PROMPTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSend(s)}
                        className="sup-chip group rounded-2xl px-4 py-3.5 text-xs sm:text-[13px] flex items-center justify-between gap-3"
                      >
                        <span className="leading-snug">{s}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-5 sm:space-y-6 max-w-3xl mx-auto w-full">
                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
                {loading && <ChainOfThought items={thoughts} />}
                {error && (
                  <p className="text-xs px-2" style={{ color: '#c0532f' }}>
                    {error}
                  </p>
                )}
                <div ref={endRef} />
              </div>
            </div>

            {/* Composer */}
            <div
              className="absolute bottom-0 left-0 right-0 pt-14 pb-4 sm:pb-5 px-3 sm:px-7 pointer-events-none z-10"
              style={{ backgroundImage: 'linear-gradient(to top, var(--sup-panel) 55%, transparent)' }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="sup-card-raised w-full max-w-3xl mx-auto pointer-events-auto flex items-center gap-2.5 rounded-full pl-5 pr-2 py-2"
                style={{ boxShadow: 'var(--sup-shadow-soft)' }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    user?.name
                      ? `Ask Ms. Perera, ${String(user.name).split(' ')[0]}…`
                      : 'Describe your dispute or ask about a policy…'
                  }
                  className="sup-input-bare flex-1 text-sm py-1.5"
                  disabled={loading || booting || !userId}
                />
                <button
                  type="submit"
                  disabled={loading || booting || !input.trim() || !userId}
                  className="sup-btn size-10 rounded-full inline-flex items-center justify-center shrink-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
              <p className="text-[10px] sup-faint mt-2.5 text-center max-w-3xl mx-auto flex items-center justify-center gap-1.5">
                <Shield className="w-3 h-3" />
                Policy-grounded · secure session{' '}
                <code className="sup-muted">
                  {activeSessionId ? String(activeSessionId).slice(0, 18) : '—'}
                </code>
              </p>
            </div>
          </section>

          {/* User panel */}
          <div className="hidden lg:block min-h-0">
            <UserPanel user={user} recentOrders={recentOrders} aiHealth={aiHealth} />
          </div>
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {voiceOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-surface-base/95 sm:bg-black/60 backdrop-blur-lg flex items-stretch sm:items-center sm:justify-center"
          >
            <button
              type="button"
              onClick={() => setVoiceOpen(false)}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 p-2 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
            <div className="w-full sm:w-[480px] sm:max-h-[90vh] sm:bg-surface-card sm:rounded-3xl sm:shadow-2xl sm:border sm:border-white/10 flex flex-col overflow-hidden">
              <VoiceRoom
                userId={userId}
                onClose={() => {
                  setVoiceOpen(false);
                  ensureToken().then((token) => refreshSessions(token)).catch(() => {});
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
