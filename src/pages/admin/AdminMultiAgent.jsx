import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  Brain,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  ExternalLink,
  FileText,
  Globe,
  Layers,
  Loader2,
  MessageSquareWarning,
  Network,
  RefreshCw,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { langfuseLinks } from '../../config/langfuseLinks';
import {
  checkAiServiceHealth,
  fetchAiConfig,
  fetchAiReadiness,
} from '../../services/aiService';

const LANGFUSE_URL = langfuseLinks.home;

const OBS_STEPS = [
  {
    id: 'traces',
    title: '1. Open live traces',
    body: 'Send a /support chat (or voice turn), then open Traces. Confirm user_id = customer ai_uuid and session_id groups the thread.',
    href: langfuseLinks.traces,
    icon: Activity,
  },
  {
    id: 'latency',
    title: '2. Check latency',
    body: 'Inside a trace: recall → router → tools → synthesis timings. Voice: first_token_ms / agent_total_ms on voice_pipeline. Flag p95 spikes vs baseline.',
    href: langfuseLinks.traces,
    icon: Clock,
  },
  {
    id: 'prompts',
    title: '3. Prompt Management',
    body: 'Prompts → dispute-agent-system / router / synthesiser. Edit production version only after review. Set LANGFUSE_PROMPTS=true on AI-Agent to serve from Langfuse.',
    href: langfuseLinks.prompts,
    icon: FileText,
  },
  {
    id: 'hallucination',
    title: '4. Spot hallucination',
    body: 'Compare synthesis output vs tool/GraphRAG spans. Wrong order_id, invented policy, or refund not in tool JSON = hallucination. Leave a comment on the span.',
    href: langfuseLinks.traces,
    icon: MessageSquareWarning,
  },
  {
    id: 'accuracy',
    title: '5. Score accuracy',
    body: 'Use Scores (or annotation): correctness 0–1, hallucination yes/no, policy_cited yes/no. Review weekly; tune prompts when scores drop.',
    href: langfuseLinks.scores,
    icon: Target,
  },
  {
    id: 'sessions',
    title: '6. Sessions view',
    body: 'Sessions groups multi-turn disputes and voice-<room> calls. Replay full conversation before changing prompts.',
    href: langfuseLinks.sessions,
    icon: Users,
  },
];

const AGENTS = [
  {
    id: 'router',
    name: 'Query Router',
    role: 'Intent classification & tool selection',
    icon: Route,
    color: 'text-sky-600',
    bg: 'bg-sky-50 border-sky-200',
  },
  {
    id: 'classification',
    name: 'Classification Agent',
    role: 'Dispute type + severity scoring',
    icon: Layers,
    color: 'text-violet-600',
    bg: 'bg-violet-50 border-violet-200',
  },
  {
    id: 'investigation',
    name: 'Investigation Agent',
    role: 'Hybrid GraphRAG policy lookup',
    icon: Database,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
  },
  {
    id: 'resolution',
    name: 'Resolution Agent',
    role: 'Decision, refund calc, confirmation',
    icon: ShieldCheck,
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
  },
  {
    id: 'escalation',
    name: 'Escalation Agent',
    role: 'Human handoff / high-risk claims',
    icon: Globe,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
  },
  {
    id: 'voice',
    name: 'Voice Pipeline',
    role: 'LiveKit realtime · Ms. Perera',
    icon: Sparkles,
    color: 'text-teal-600',
    bg: 'bg-teal-50 border-teal-200',
  },
];

const PIPELINE = [
  'Semantic cache (CAG)',
  'Short / long-term memory',
  'Customer context',
  'Router → tools',
  'Multi-agent synthesis',
  'Langfuse trace',
];

function StatusPill({ ok, label }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
        ok
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-amber-50 text-amber-700 border-amber-200'
      }`}
    >
      <span className={`size-1.5 rounded-full ${ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      {label}
    </span>
  );
}

export default function AdminMultiAgent() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [healthy, setHealthy] = useState(false);
  const [config, setConfig] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ok, cfg, ready] = await Promise.all([
        checkAiServiceHealth(),
        fetchAiConfig().catch(() => null),
        fetchAiReadiness().catch(() => null),
      ]);
      setHealthy(ok);
      setConfig(cfg);
      setReadiness(ready);
    } catch (e) {
      setError(e.message || 'Failed to load AI telemetry');
      setHealthy(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (window.location.hash === '#observability') {
      const el = document.getElementById('observability');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading]);

  useEffect(() => {
    const root = window.document.documentElement;
    const wasLight = root.classList.contains('light');
    root.classList.add('light');
    return () => {
      if (!wasLight) root.classList.remove('light');
    };
  }, []);

  const probes = readiness?.probes || readiness?.checks || {};
  const probeRows = Object.entries(probes).length
    ? Object.entries(probes)
    : [
        ['api', healthy],
        ['qdrant', readiness?.qdrant ?? null],
        ['neo4j', readiness?.neo4j ?? null],
        ['supabase', readiness?.supabase ?? null],
        ['redis', readiness?.redis ?? null],
      ].filter(([, v]) => v !== null && v !== undefined);

  const tools = config?.tools || config?.enabled_tools || {};
  const toolRows = Object.entries(tools);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      <nav className="bg-white border-b border-slate-200/80 h-16 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#409eff] rounded-lg p-2 flex items-center justify-center shadow-sm shadow-[#409eff]/20">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            Multi-Agent Ops
            <span className="text-[10px] bg-slate-100 border border-slate-200/60 text-slate-500 px-2 py-0.5 rounded-full font-semibold ml-1.5 uppercase">
              Admin
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="text-xs font-semibold text-slate-500 hover:text-[#409eff] inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Console
          </Link>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-800 leading-none">
              {user?.name || 'Platform Admin'}
            </span>
            <span className="text-[9px] text-[#409eff] mt-1.5 uppercase tracking-wider font-bold">
              Agent Ops
            </span>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout();
              window.location.href = '/';
            }}
            className="text-[11px] font-semibold text-slate-400 hover:text-red-500"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1 min-h-0">
        <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col p-5 shrink-0 hidden lg:flex">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3.5 mb-4">
            AI Workspace
          </p>
          <div className="space-y-1.5">
            <div className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-xs font-semibold text-[#409eff] bg-blue-50/50 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-5 bg-[#409eff] rounded-r-md" />
              <Workflow className="w-4 h-4" />
              Multi-Agent System
            </div>
            <Link
              to="/admin"
              className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <Cpu className="w-4 h-4" />
              Main Console
            </Link>
            <a
              href="#observability"
              className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <Activity className="w-4 h-4" />
              Observability playbook
            </a>
            <a
              href={langfuseLinks.traces}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <Activity className="w-4 h-4" />
              Langfuse Traces
              <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
            </a>
            <Link
              to="/support"
              className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <Sparkles className="w-4 h-4" />
              Open Support UI
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-6 sm:p-8 max-w-[1440px] mx-auto overflow-y-auto w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Multi-Agentic Dispute System
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                Operational view of the Tech-Hub ↔ DisputeAI stack — agents, readiness probes,
                models, and Langfuse observability.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusPill ok={healthy} label={healthy ? 'AI healthy' : 'AI degraded'} />
              <button
                type="button"
                onClick={load}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Refresh
              </button>
              <a
                href={LANGFUSE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#409eff] text-white text-xs font-bold shadow-sm shadow-[#409eff]/25 hover:bg-[#3a8ee6]"
              >
                Open Langfuse <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Langfuse quick links */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2">
                Open in Langfuse
              </span>
              {[
                { label: 'Dashboard', href: langfuseLinks.home },
                { label: 'Traces', href: langfuseLinks.traces },
                { label: 'Sessions', href: langfuseLinks.sessions },
                { label: 'Prompts', href: langfuseLinks.prompts },
                { label: 'Scores', href: langfuseLinks.scores },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700 hover:border-[#409eff] hover:text-[#409eff] hover:bg-blue-50/50"
                >
                  {link.label}
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              ))}
            </div>
            {!langfuseLinks.hasProject && (
              <p className="mt-2 text-[10px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                Tip: set <code className="font-mono">VITE_LANGFUSE_PROJECT_ID</code> in Tech-Hub
                .env so Traces / Prompts / Scores open straight into your project.
              </p>
            )}
          </section>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 font-semibold">
              {error}
            </div>
          )}

          {/* Agent cards */}
          <section>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              Agent roster
            </h2>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {AGENTS.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div
                    key={agent.id}
                    className={`rounded-2xl border p-4 ${agent.bg} transition hover:shadow-sm`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl bg-white/80 border border-white ${agent.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{agent.name}</h3>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {agent.role}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Pipeline */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Network className="w-4 h-4 text-[#409eff]" />
              <h2 className="text-sm font-bold text-slate-900">Request pipeline</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {PIPELINE.map((step, i) => (
                <React.Fragment key={step}>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700">
                    {i + 1}. {step}
                  </span>
                  {i < PIPELINE.length - 1 && (
                    <span className="text-slate-300 self-center text-xs">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Readiness table */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">Infrastructure readiness</h2>
                <StatusPill ok={healthy} label={healthy ? 'Ready' : 'Check'} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="px-5 py-3">Service</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={3} className="px-5 py-8 text-center text-slate-400 text-xs">
                          <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                          Probing…
                        </td>
                      </tr>
                    )}
                    {!loading && probeRows.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-5 py-8 text-center text-slate-400 text-xs">
                          No readiness payload — health only: {healthy ? 'OK' : 'DOWN'}
                        </td>
                      </tr>
                    )}
                    {!loading &&
                      probeRows.map(([name, value]) => {
                        const ok =
                          value === true ||
                          value === 'ok' ||
                          value === 'ready' ||
                          value?.status === 'ok' ||
                          value?.ok === true;
                        return (
                          <tr key={name} className="border-t border-slate-100 hover:bg-slate-50/80">
                            <td className="px-5 py-3 font-semibold text-slate-800 capitalize">
                              {name.replace(/_/g, ' ')}
                            </td>
                            <td className="px-5 py-3">
                              <StatusPill ok={!!ok} label={ok ? 'OK' : 'Issue'} />
                            </td>
                            <td className="px-5 py-3 text-xs text-slate-500 font-mono max-w-[200px] truncate">
                              {typeof value === 'object'
                                ? JSON.stringify(value)
                                : String(value)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Models / tools table */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-900">Models & tools</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    <tr>
                      <th className="px-5 py-3">Key</th>
                      <th className="px-5 py-3">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-100">
                      <td className="px-5 py-3 font-semibold text-slate-800">Chat model</td>
                      <td className="px-5 py-3 text-xs font-mono text-slate-600">
                        {config?.chat_model || config?.models?.chat || '—'}
                      </td>
                    </tr>
                    <tr className="border-t border-slate-100">
                      <td className="px-5 py-3 font-semibold text-slate-800">Router model</td>
                      <td className="px-5 py-3 text-xs font-mono text-slate-600">
                        {config?.router_model || config?.models?.router || '—'}
                      </td>
                    </tr>
                    {toolRows.length === 0 && (
                      <tr className="border-t border-slate-100">
                        <td colSpan={2} className="px-5 py-6 text-xs text-slate-400 text-center">
                          Tool inventory unavailable from /config
                        </td>
                      </tr>
                    )}
                    {toolRows.map(([name, enabled]) => (
                      <tr key={name} className="border-t border-slate-100 hover:bg-slate-50/80">
                        <td className="px-5 py-3 font-semibold text-slate-800 capitalize">
                          {name.replace(/_/g, ' ')}
                        </td>
                        <td className="px-5 py-3">
                          <StatusPill
                            ok={!!enabled}
                            label={enabled ? 'Enabled' : 'Disabled'}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Observability playbook */}
          <section id="observability" className="scroll-mt-24 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Observability playbook
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  Step-by-step: traces → latency → prompts → hallucination check → accuracy scores.
                  Full write-up:{' '}
                  <span className="font-mono text-[10px] text-slate-400">
                    AI-Agent/docs/LANGFUSE_PROMPTS_AND_OBSERVABILITY.md
                  </span>
                </p>
              </div>
              <a
                href={LANGFUSE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shrink-0"
              >
                Launch Langfuse dashboard <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {OBS_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <a
                    key={step.id}
                    href={step.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-[#409eff]/50 hover:shadow-md transition text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-[#409eff] group-hover:bg-[#409eff] group-hover:text-white transition">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          {step.title}
                          <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-80" />
                        </h3>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-emerald-900 leading-relaxed space-y-1">
                <p className="font-bold">Weekly accuracy loop</p>
                <p>
                  Sample 10 /support traces → score correctness + hallucination → if average
                  correctness &lt; 0.8 or hallucination rate rises, re-sync Tech-Hub prompts (
                  <code className="font-mono text-[10px]">scripts/sync_langfuse_prompts.py</code>
                  ) and retest the same golden questions.
                </p>
              </div>
            </div>
          </section>

          {/* Langfuse card */}
          <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/40 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="size-12 rounded-2xl bg-[#409eff]/10 border border-[#409eff]/20 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 text-[#409eff]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-slate-900">Langfuse observability</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Traces, prompt versions, latency, and scores for the multi-agent graph land in
                Langfuse. Use the playbook above, then open the project dashboard for live runs.
              </p>
              <code className="mt-2 inline-block text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded-md px-2 py-1 truncate max-w-full">
                {LANGFUSE_URL}
              </code>
            </div>
            <a
              href={LANGFUSE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shrink-0"
            >
              Launch Langfuse <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </section>
        </main>
      </div>
    </div>
  );
}
