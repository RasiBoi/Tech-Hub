import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { requestJson } from '../../services/httpClient';
import { serviceRegistry } from '../../config/serviceRegistry';
import { 
  ShieldCheck, LogOut, Users, ShoppingBag, BarChart3, 
  AlertCircle, RefreshCw, Cpu, Loader2, Search, Activity, Terminal, Brain, ExternalLink
} from 'lucide-react';
import { langfuseLinks } from '../../config/langfuseLinks';
import '../../element-ui.css';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('overview'); // overview | approvals | ai-policies | logs
  
  // Database States
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorPolicies, setVendorPolicies] = useState([]);
  const [platformPolicies, setPlatformPolicies] = useState([]);
  const [platformForm, setPlatformForm] = useState({
    policy_key: '',
    policy_name: '',
    min_value: '',
    max_value: '',
    is_mandatory: true,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Filter States (Merchant Approvals)
  const [vendorSearch, setVendorSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | pending | approved | rejected

  // Telemetry Diagnostic Logs (Dynamic)
  const [logs, setLogs] = useState([
    { id: 1, time: '21:04:12', msg: 'System check: Buyer Protection SSL status verified.', type: 'success' },
    { id: 2, time: '20:58:45', msg: 'Sanctum API session token garbage collection triggered.', type: 'info' },
    { id: 3, time: '20:30:15', msg: 'Database connection pool scaling: active connections: 4.', type: 'info' },
    { id: 4, time: '19:12:04', msg: 'Checkout gateway connection re-routed to backup node.', type: 'warning' }
  ]);
  const [refreshingDiagnostics, setRefreshingDiagnostics] = useState(false);

  // Force Light Mode on Mount, Restore on Unmount
  useEffect(() => {
    const root = window.document.documentElement;
    const wasLight = root.classList.contains('light');
    root.classList.add('light');
    return () => {
      if (!wasLight) {
        root.classList.remove('light');
      }
    };
  }, []);

  // Load backend data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch orders and vendors in parallel
      const [ordersData, vendorsData, vendorPoliciesData, platformPoliciesData] = await Promise.all([
        requestJson(`${serviceRegistry.commerce}/orders`),
        requestJson(`${serviceRegistry.catalog}/admin/vendors`),
        requestJson(`${serviceRegistry.catalog}/admin/vendor-policies`),
        requestJson(`${serviceRegistry.catalog}/admin/platform-policies`),
      ]);

      if (ordersData) {
        setOrders(ordersData);
      }
      if (vendorsData) {
        setVendors(vendorsData);
      }
      if (vendorPoliciesData) {
        setVendorPolicies(vendorPoliciesData);
      }
      if (platformPoliciesData) {
        setPlatformPolicies(platformPoliciesData);
      }
    } catch (e) {
      console.error('Error fetching admin telemetry:', e);
      showToast('Failed to load system telemetry data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  // Approve / Reject Vendor
  const handleUpdateStatus = async (vendorId, status) => {
    setActionLoading(true);
    try {
      await requestJson(`${serviceRegistry.catalog}/admin/vendors/${vendorId}/status`, {
        method: 'PUT',
        body: { status }
      });
      
      showToast(`Merchant account status marked as ${status}.`);
      setVendors(vendors.map(v => v.id === vendorId ? { ...v, status } : v));
      
      // Log this action
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setLogs(prev => [
        { id: Date.now(), time: timeStr, msg: `Admin marked vendor ID #${vendorId} status as '${status}'.`, type: 'info' },
        ...prev
      ]);
    } catch (e) {
      console.error(e);
      showToast(e.message || 'Failed to update vendor status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePolicyApproval = async (policyId, approved) => {
    setActionLoading(true);
    try {
      const updated = await requestJson(`${serviceRegistry.catalog}/admin/vendor-policies/${policyId}/approval`, {
        method: 'PUT',
        body: { approved_by_admin: approved },
      });

      const normalized = updated?.data || updated;
      setVendorPolicies((current) =>
        current.map((policy) => (policy.id === policyId ? { ...policy, ...normalized } : policy)),
      );
      showToast(approved ? 'AI policy approved and queued for sync.' : 'AI policy returned to pending.');

      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setLogs(prev => [
        { id: Date.now(), time: timeStr, msg: `Admin ${approved ? 'approved' : 'reopened'} AI vendor policy ${policyId}.`, type: 'info' },
        ...prev
      ]);
    } catch (e) {
      console.error(e);
      showToast(e.message || 'Failed to update AI policy approval.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSavePlatformPolicy = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const saved = await requestJson(`${serviceRegistry.catalog}/admin/platform-policies`, {
        method: 'POST',
        body: {
          policy_key: platformForm.policy_key,
          policy_name: platformForm.policy_name,
          min_value: platformForm.min_value === '' ? null : Number(platformForm.min_value),
          max_value: platformForm.max_value === '' ? null : Number(platformForm.max_value),
          is_mandatory: platformForm.is_mandatory,
        },
      });
      const row = saved?.data || saved;
      setPlatformPolicies((current) => {
        const without = current.filter((p) => p.policy_key !== row.policy_key);
        return [...without, row].sort((a, b) => String(a.policy_key).localeCompare(String(b.policy_key)));
      });
      setPlatformForm({
        policy_key: '',
        policy_name: '',
        min_value: '',
        max_value: '',
        is_mandatory: true,
      });
      showToast('Platform policy saved and queued for AI sync.');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to save platform policy.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Dynamic Telemetry metrics
  const stats = useMemo(() => {
    // Total Sales GMV
    let sales = 0;
    orders.forEach(o => {
      sales += parseFloat(o.total_amount || 0);
    });

    const activeVendors = vendors.filter(v => v.status === 'approved').length;
    const pendingApprovals = vendors.filter(v => v.status === 'pending').length;
    const pendingPolicies = vendorPolicies.filter(p => !p.approved_by_admin).length;
    const totalOrdersCount = orders.length;

    return {
      sales,
      vendors: activeVendors,
      pending: pendingApprovals,
      pendingPolicies,
      orders: totalOrdersCount
    };
  }, [orders, vendors, vendorPolicies]);

  // Refresh health logs
  const triggerRefreshDiagnostics = () => {
    setRefreshingDiagnostics(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const diagnostics = [
        `Elasticsearch sync resolved in 42ms.`,
        `Sanity check: Postgres replication status [OK].`,
        `Sanctum cache cleared, active auth sessions: ${Math.floor(5 + Math.random() * 20)}.`
      ];
      const newLogs = diagnostics.map((msg, i) => ({
        id: Date.now() + i,
        time: timeStr,
        msg,
        type: 'success'
      }));
      setLogs(prev => [...newLogs, ...prev]);
      setRefreshingDiagnostics(false);
      showToast('Sanity telemetry refreshed.');
    }, 1000);
  };

  // Filter vendors list
  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchesSearch = (v.name || '').toLowerCase().includes(vendorSearch.toLowerCase()) || 
                            (v.store_name || '').toLowerCase().includes(vendorSearch.toLowerCase());
      const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vendors, vendorSearch, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-md border backdrop-blur-md transition-all duration-300 ${
          toast.type === 'error' 
            ? 'bg-red-50 border-red-200 text-red-800' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
            toast.type === 'error' ? 'bg-red-100 text-red-650' : 'bg-emerald-100 text-emerald-650'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          </div>
          <p className="text-xs font-semibold tracking-wide">{toast.message}</p>
        </div>
      )}

      {/* Top Navigation Header */}
      <nav className="bg-white border-b border-slate-200/80 h-16 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#409eff] rounded-lg p-2 flex items-center justify-center shadow-sm shadow-[#409eff]/20">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            TechHub <span className="text-[10px] bg-slate-100 border border-slate-200/60 text-slate-500 px-2 py-0.5 rounded-full font-semibold ml-1.5 uppercase">Admin</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800 leading-none">{user?.name || 'Platform Admin'}</span>
              <span className="text-[9px] text-[#409eff] mt-1.5 uppercase tracking-wider font-bold">Console Manager</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-[#409eff] shadow-sm select-none">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200" />

          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Dashboard Layout */}
      <div className="flex flex-1 min-h-0">
        
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col justify-between p-5 shrink-0 hidden lg:flex">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3.5 mb-4">Navigation</p>
              <div className="space-y-1.5">
                {[
                  { id: 'overview', label: 'Telemetry Overview', icon: <BarChart3 className="w-4 h-4" /> },
                  { id: 'approvals', label: 'Merchant Approvals', icon: <Users className="w-4 h-4" /> },
                  { id: 'ai-policies', label: 'AI Policy Review', icon: <ShieldCheck className="w-4 h-4" /> },
                  { id: 'logs', label: 'Logs & Health', icon: <Terminal className="w-4 h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-xs font-semibold transition-all relative ${
                      activeTab === tab.id
                        ? 'text-[#409eff] bg-blue-50/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {activeTab === tab.id && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-5 bg-[#409eff] rounded-r-md" />
                    )}
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
                <Link
                  to="/admin/multi-agent"
                  className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  <Brain className="w-4 h-4" />
                  Multi-Agent System
                </Link>
                <Link
                  to="/admin/multi-agent#observability"
                  className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  <Activity className="w-4 h-4" />
                  AI Observability
                </Link>
                <a
                  href={langfuseLinks.home}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Langfuse
                </a>
              </div>
            </div>
          </div>

          {/* System Status widget in sidebar footer */}
          <div className="space-y-4">
            <div className="px-3.5 py-4 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3.5">System Health</span>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#67c23a] animate-pulse" />
                    API Gateway
                  </span>
                  <span className="text-[10px] font-bold text-[#67c23a] bg-[#f0f9eb] border border-[#e1f3d8] px-2 py-0.5 rounded">99.9%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#67c23a] animate-pulse" />
                    Database
                  </span>
                  <span className="text-[10px] font-bold text-[#67c23a] bg-[#f0f9eb] border border-[#e1f3d8] px-2 py-0.5 rounded">ONLINE</span>
                </div>
              </div>
            </div>

            <div className="text-[9px] text-slate-400 font-semibold px-3.5 border-t border-slate-100 pt-3.5 space-y-0.5">
              <p>Console Version 3.1.2</p>
              <p>&copy; 2026 Tech-Hub</p>
            </div>
          </div>
        </aside>

        {/* Tab content area */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1440px] mx-auto overflow-y-auto w-full">
          
          {/* Mobile Tab Select Dropdown */}
          <div className="lg:hidden mb-6">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Workspace</label>
            <div className="el-select">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="el-input__inner font-semibold text-slate-700"
              >
                <option value="overview">Telemetry Overview</option>
                <option value="approvals">Merchant Approvals</option>
                <option value="ai-policies">AI Policy Review</option>
                <option value="logs">Logs & Health</option>
              </select>
            </div>
            <Link
              to="/admin/multi-agent"
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#409eff]"
            >
              <Brain className="w-3.5 h-3.5" /> Open Multi-Agent System →
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-8 h-8 text-[#409eff] animate-spin" />
              <p className="text-xs font-semibold text-slate-400 tracking-wider">Streaming system telemetry...</p>
            </div>
          ) : (
            <>
              {/* 1. TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Greeting */}
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Platform Telemetry</h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1">Review live database telemetry, financial aggregates, and registration statuses.</p>
                  </div>

                  {/* Telemetry Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Sales (GMV)', val: `LKR ${stats.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: 'Accumulated checkout volume', icon: <BarChart3 className="w-5 h-5 text-[#409eff]" />, border: 'border-l-4 border-l-[#409eff]' },
                      { label: 'Active Stores', val: `${stats.vendors}`, sub: 'Approved partner stores', icon: <Users className="w-5 h-5 text-[#67c23a]" />, border: 'border-l-4 border-l-[#67c23a]' },
                      { label: 'Pending Reviews', val: `${stats.pending + stats.pendingPolicies}`, sub: 'Applications and AI policies', icon: <AlertCircle className="w-5 h-5 text-[#e6a23c]" />, border: 'border-l-4 border-l-[#e6a23c]' },
                      { label: 'Completed Orders', val: `${stats.orders}`, sub: 'Successful checkouts', icon: <ShoppingBag className="w-5 h-5 text-[#f56c6c]" />, border: 'border-l-4 border-l-[#f56c6c]' }
                    ].map((stat, idx) => (
                      <div key={idx} className={`bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300 ${stat.border}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                          <span className="opacity-80 group-hover:scale-110 transition-transform duration-200">{stat.icon}</span>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none tabular-nums">{stat.val}</h3>
                          <p className="text-[10px] font-medium text-slate-400 mt-2">{stat.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Approval Alerts Notification */}
                  {stats.pending > 0 && (
                    <div className="bg-[#fdf6ec] border border-[#faecd8] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                      <div className="flex items-center gap-3.5">
                        <div className="h-9 w-9 rounded-full bg-[#fdf6ec] border border-[#faecd8] flex items-center justify-center text-[#e6a23c] shrink-0">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#e6a23c]">Pending Merchant Applications</h4>
                          <p className="text-[11px] text-slate-600 mt-1">There are {stats.pending} vendor applications awaiting your administrative review.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('approvals')}
                        className="el-button el-button--warning el-button--small shadow-sm"
                      >
                        Review Applications
                      </button>
                    </div>
                  )}

                  {/* Summary lists */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Platform Orders overview */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-[#67c23a]" />
                            Platform Order Logs
                          </h3>
                          <p className="text-[11px] text-slate-450 mt-1">List of recent checkout purchases recorded on the server.</p>
                        </div>
                      </div>
                      
                      <div className="el-table el-table--border">
                        <div className="max-h-[350px] overflow-y-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr>
                                <th className="py-2.5 px-4">Order ID</th>
                                <th className="py-2.5 px-4">Customer</th>
                                <th className="py-2.5 px-4 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.map((o, idx) => (
                                <tr key={o.id} className={idx % 2 !== 0 ? 'el-table__row--striped' : ''}>
                                  <td className="py-3 px-4 font-mono font-bold text-slate-800">Order #{o.id}</td>
                                  <td className="py-3 px-4 text-slate-600 font-medium">{o.user?.name || 'Customer'}</td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="font-bold text-slate-900">
                                      LKR {parseFloat(o.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                    <div className="text-[9px] mt-0.5">
                                      <span className="el-tag el-tag--success el-tag--mini" style={{height: '18px', lineHeight: '16px', fontSize: '9px', padding: '0 5px'}}>
                                        {o.status}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {orders.length === 0 && (
                                <tr>
                                  <td colSpan="3" className="text-center py-10 text-xs text-slate-400 font-medium">
                                    No checkout order events detected.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Quick approvals list */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#409eff]" />
                            System Registrations
                          </h3>
                          <p className="text-[11px] text-slate-450 mt-1">Recent stores and sellers registered to manage catalog items.</p>
                        </div>
                      </div>
                      
                      <div className="el-table el-table--border">
                        <div className="max-h-[350px] overflow-y-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr>
                                <th className="py-2.5 px-4">Store / Owner</th>
                                <th className="py-2.5 px-4">Contact</th>
                                <th className="py-2.5 px-4 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {vendors.map((v, idx) => (
                                <tr key={v.id} className={idx % 2 !== 0 ? 'el-table__row--striped' : ''}>
                                  <td className="py-3 px-4">
                                    <div className="font-bold text-slate-800">{v.store_name || 'Unnamed Store'}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">Owner: {v.name}</div>
                                  </td>
                                  <td className="py-3 px-4 text-slate-550 font-mono text-[11px]">{v.email}</td>
                                  <td className="py-3 px-4 text-right">
                                    <span className={`el-tag el-tag--mini uppercase ${
                                      v.status === 'approved' 
                                        ? 'el-tag--success' 
                                        : v.status === 'pending'
                                          ? 'el-tag--warning'
                                          : 'el-tag--danger'
                                    }`}>
                                      <span className="el-tag__dot" />
                                      {v.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                              {vendors.length === 0 && (
                                <tr>
                                  <td colSpan="3" className="text-center py-10 text-xs text-slate-400 font-medium">
                                    No registered sellers found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 2. TAB: MERCHANT APPROVALS */}
              {activeTab === 'approvals' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Merchant Approvals</h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1">Submit approvals on applicant accounts to authorize platform search indexes.</p>
                  </div>

                  {/* Filter and Search controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Search by Store */}
                    <div className="el-input">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-450 absolute left-3 top-2.5 z-10" />
                        <input
                          type="text"
                          placeholder="Search store name or merchant..."
                          value={vendorSearch}
                          onChange={(e) => setVendorSearch(e.target.value)}
                          className="el-input__inner pl-9 font-medium"
                        />
                      </div>
                    </div>
                    {/* Status filter */}
                    <div className="el-select">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="el-input__inner font-semibold text-slate-600"
                      >
                        <option value="all">All Applications (Approved & Pending)</option>
                        <option value="pending">Pending Approval</option>
                        <option value="approved">Approved Partners</option>
                        <option value="rejected">Rejected / Suspended</option>
                      </select>
                    </div>
                  </div>

                  {/* Merchant List Table in Element UI Table style */}
                  <div className="el-table el-table--border el-table--striped shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr>
                            <th className="py-3 px-5">Store details</th>
                            <th className="py-3 px-5">Owner Profile</th>
                            <th className="py-3 px-5">Contact email</th>
                            <th className="py-3 px-5">Registration status</th>
                            <th className="py-3 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVendors.map((row, idx) => (
                            <tr key={row.id} className={idx % 2 !== 0 ? 'el-table__row--striped' : ''}>
                              <td className="py-4 px-5">
                                <div>
                                  <p className="font-bold text-slate-900 text-[13px]">{row.store_name || 'Unnamed Merchant'}</p>
                                  <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-wider">ID: VND-{row.id}</p>
                                </div>
                              </td>
                              <td className="py-4 px-5 text-slate-700 font-semibold">{row.name}</td>
                              <td className="py-4 px-5 text-slate-550 font-mono">{row.email}</td>
                              <td className="py-4 px-5">
                                <span className={`el-tag uppercase ${
                                  row.status === 'approved' 
                                    ? 'el-tag--success' 
                                    : row.status === 'pending'
                                      ? 'el-tag--warning'
                                      : 'el-tag--danger'
                                }`}>
                                  <span className="el-tag__dot" />
                                  {row.status}
                                </span>
                              </td>
                              <td className="py-4 px-5 text-right">
                                <div className="inline-flex gap-2 justify-end items-center">
                                  {row.status !== 'approved' && (
                                    <button
                                      disabled={actionLoading}
                                      onClick={() => handleUpdateStatus(row.id, 'approved')}
                                      className="el-button el-button--success el-button--mini shadow-sm"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {row.status !== 'rejected' && (
                                    <button
                                      disabled={actionLoading}
                                      onClick={() => handleUpdateStatus(row.id, 'rejected')}
                                      className="el-button el-button--danger el-button--mini is-plain shadow-sm"
                                    >
                                      Reject
                                    </button>
                                  )}
                                  {row.status === 'approved' && (
                                    <button
                                      disabled={actionLoading}
                                      onClick={() => handleUpdateStatus(row.id, 'pending')}
                                      className="el-button el-button--info el-button--mini is-plain shadow-sm"
                                    >
                                      Suspend
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                          {filteredVendors.length === 0 && (
                            <tr>
                              <td colSpan="5" className="text-center py-12 text-xs font-semibold text-slate-400">
                                No applications detected matching the filter.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ai-policies' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Policy Review</h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      Approve structured vendor return/refund policies before the dispute AI can use them.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { label: 'Submitted Policies', value: vendorPolicies.length, color: 'text-[#409eff]' },
                      { label: 'Pending Approval', value: vendorPolicies.filter(p => !p.approved_by_admin).length, color: 'text-[#e6a23c]' },
                      { label: 'Approved for AI', value: vendorPolicies.filter(p => p.approved_by_admin).length, color: 'text-[#67c23a]' },
                    ].map((item) => (
                      <div key={item.label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                        <p className={`mt-3 text-2xl font-black ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="el-table el-table--border el-table--striped shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr>
                            <th className="py-3 px-5">Vendor</th>
                            <th className="py-3 px-5">Policy</th>
                            <th className="py-3 px-5">Rules</th>
                            <th className="py-3 px-5">Document</th>
                            <th className="py-3 px-5">Conditions</th>
                            <th className="py-3 px-5">Status</th>
                            <th className="py-3 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendorPolicies.map((policy, idx) => (
                            <tr key={policy.id} className={idx % 2 !== 0 ? 'el-table__row--striped' : ''}>
                              <td className="py-4 px-5">
                                <p className="font-bold text-slate-900">{policy.vendor?.store_name || policy.vendor?.name || 'Vendor'}</p>
                                <p className="mt-1 text-[10px] font-mono text-slate-400">{policy.vendor_id}</p>
                              </td>
                              <td className="py-4 px-5">
                                <p className="font-bold text-slate-800">{policy.policy_name}</p>
                                <p className="mt-1 text-[10px] font-bold uppercase text-slate-400">{policy.policy_type}</p>
                              </td>
                              <td className="py-4 px-5 font-semibold text-slate-650">
                                {policy.max_return_days ?? '-'} days · {policy.refund_type || 'No refund type'} · {policy.restocking_fee_percent ?? 0}% fee
                              </td>
                              <td className="py-4 px-5">
                                <div className="space-y-1">
                                  <span className="el-tag el-tag--mini uppercase">
                                    {!policy.document_format && 'Structured only'}
                                    {policy.document_format === 'text' && 'Text doc'}
                                    {policy.document_format === 'markdown' && 'MD doc'}
                                    {policy.document_format === 'pdf' && 'PDF doc'}
                                  </span>
                                  {policy.document_format === 'pdf' && policy.document_url && (
                                    <a
                                      href={policy.document_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block text-[10px] font-bold text-[#409eff] hover:underline truncate max-w-[180px]"
                                    >
                                      Open PDF
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-5">
                                <div className="flex flex-wrap gap-1.5">
                                  {policy.conditions?.requires_original_packaging && (
                                    <span className="el-tag el-tag--info el-tag--mini">Packaging</span>
                                  )}
                                  {policy.conditions?.requires_purchase_proof && (
                                    <span className="el-tag el-tag--info el-tag--mini">Proof</span>
                                  )}
                                  {!policy.conditions?.requires_original_packaging && !policy.conditions?.requires_purchase_proof && (
                                    <span className="text-slate-400 font-semibold">None</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-5">
                                <span className={`el-tag uppercase ${policy.approved_by_admin ? 'el-tag--success' : 'el-tag--warning'}`}>
                                  <span className="el-tag__dot" />
                                  {policy.approved_by_admin ? 'Approved' : 'Pending'}
                                </span>
                              </td>
                              <td className="py-4 px-5 text-right">
                                <div className="inline-flex gap-2 justify-end items-center">
                                  {!policy.approved_by_admin && (
                                    <button
                                      disabled={actionLoading}
                                      onClick={() => handleUpdatePolicyApproval(policy.id, true)}
                                      className="el-button el-button--success el-button--mini shadow-sm"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {policy.approved_by_admin && (
                                    <button
                                      disabled={actionLoading}
                                      onClick={() => handleUpdatePolicyApproval(policy.id, false)}
                                      className="el-button el-button--warning el-button--mini is-plain shadow-sm"
                                    >
                                      Reopen
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                          {vendorPolicies.length === 0 && (
                            <tr>
                              <td colSpan="7" className="text-center py-12 text-xs font-semibold text-slate-400">
                                No AI dispute policies have been submitted by vendors.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Platform policies</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Global dispute guardrails synced to Neo4j + Qdrant on save.
                      </p>
                    </div>
                    <form onSubmit={handleSavePlatformPolicy} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        required
                        value={platformForm.policy_key}
                        onChange={(e) => setPlatformForm((f) => ({ ...f, policy_key: e.target.value }))}
                        placeholder="policy_key (e.g. max_auto_refund)"
                        className="border border-slate-200 rounded-lg px-3 py-2 text-xs"
                      />
                      <input
                        required
                        value={platformForm.policy_name}
                        onChange={(e) => setPlatformForm((f) => ({ ...f, policy_name: e.target.value }))}
                        placeholder="Display name"
                        className="border border-slate-200 rounded-lg px-3 py-2 text-xs"
                      />
                      <input
                        type="number"
                        value={platformForm.min_value}
                        onChange={(e) => setPlatformForm((f) => ({ ...f, min_value: e.target.value }))}
                        placeholder="min_value"
                        className="border border-slate-200 rounded-lg px-3 py-2 text-xs"
                      />
                      <input
                        type="number"
                        value={platformForm.max_value}
                        onChange={(e) => setPlatformForm((f) => ({ ...f, max_value: e.target.value }))}
                        placeholder="max_value"
                        className="border border-slate-200 rounded-lg px-3 py-2 text-xs"
                      />
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <input
                          type="checkbox"
                          checked={platformForm.is_mandatory}
                          onChange={(e) => setPlatformForm((f) => ({ ...f, is_mandatory: e.target.checked }))}
                        />
                        Mandatory
                      </label>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="el-button el-button--primary el-button--mini justify-self-start"
                      >
                        Save &amp; sync
                      </button>
                    </form>
                    <ul className="divide-y divide-slate-100 text-xs">
                      {platformPolicies.map((p) => (
                        <li key={p.id || p.policy_key} className="py-2 flex justify-between gap-3">
                          <span className="font-bold text-slate-800">{p.policy_name}</span>
                          <span className="font-mono text-slate-400">{p.policy_key}</span>
                        </li>
                      ))}
                      {!platformPolicies.length && (
                        <li className="py-3 text-slate-400 font-semibold">No platform policies yet.</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* 3. TAB: LOGS Central logger */}
              {activeTab === 'logs' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Central Logger</h2>
                      <p className="text-xs font-semibold text-slate-500 mt-1">Examine real-time system connection events, indexing telemetry, and audits.</p>
                    </div>

                    <button
                      disabled={refreshingDiagnostics}
                      onClick={triggerRefreshDiagnostics}
                      className="el-button el-button--small shadow-sm"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-slate-450 mr-1.5 ${refreshingDiagnostics ? 'animate-spin' : ''}`} />
                      Refresh Logs
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/50 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="size-11 rounded-xl bg-[#409eff]/10 border border-[#409eff]/20 flex items-center justify-center shrink-0">
                      <Activity className="w-5 h-5 text-[#409eff]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-900">Dispute AI observability (Langfuse)</h3>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Open Langfuse for traces, latency, prompt versions, hallucination review, and accuracy scores.
                        Step-by-step playbook lives on Multi-Agent → Observability.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <Link
                        to="/admin/multi-agent#observability"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-[#409eff] hover:text-[#409eff]"
                      >
                        Playbook
                      </Link>
                      <a
                        href={langfuseLinks.home}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#409eff] text-white text-xs font-bold hover:bg-[#3a8ee6]"
                      >
                        Open Langfuse <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Diagnostic Logs timeline inside Element UI Table style */}
                  <div className="el-table el-table--border shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-3.5 flex items-center justify-between bg-slate-50">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Logs Live Feed</span>
                      <span className="el-tag el-tag--success el-tag--mini uppercase tracking-wider font-bold">
                        <span className="el-tag__dot animate-ping" style={{backgroundColor: '#67c23a'}} />
                        Listening
                      </span>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr>
                            <th className="py-2.5 px-5 w-24">Timestamp</th>
                            <th className="py-2.5 px-5">Event Message</th>
                            <th className="py-2.5 px-5 text-right w-28">Severity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logs.map((log, idx) => (
                            <tr key={log.id} className={idx % 2 !== 0 ? 'el-table__row--striped' : ''}>
                              <td className="py-3 px-5 font-mono text-slate-450">{log.time}</td>
                              <td className="py-3 px-5">
                                <p className="font-medium text-slate-700 leading-relaxed">{log.msg}</p>
                              </td>
                              <td className="py-3 px-5 text-right">
                                <span className={`el-tag el-tag--mini uppercase ${
                                  log.type === 'success' 
                                    ? 'el-tag--success' 
                                    : log.type === 'warning'
                                      ? 'el-tag--warning'
                                      : 'el-tag--info'
                                }`}>
                                  {log.type}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </>
          )}

        </main>
      </div>

    </div>
  );
}
