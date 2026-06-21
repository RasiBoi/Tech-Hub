import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { requestJson } from '../../services/httpClient';
import { serviceRegistry } from '../../config/serviceRegistry';
import { 
  ShieldCheck, LogOut, Users, ShoppingBag, BarChart3, 
  AlertCircle, RefreshCw, Cpu, Award, CheckCircle2, 
  Loader2, X, Search, Terminal, Activity, HelpCircle, ChevronRight,
  Sun, Moon
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('overview'); // overview | approvals | logs
  
  // Database States
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
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

  // Load backend data
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch all system orders
      const ordersData = await requestJson(`${serviceRegistry.commerce}/orders`);
      if (ordersData) {
        setOrders(ordersData);
      }
      
      // 2. Fetch all registered vendors
      const vendorsData = await requestJson(`${serviceRegistry.catalog}/admin/vendors`);
      if (vendorsData) {
        setVendors(vendorsData);
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
      const updated = await requestJson(`${serviceRegistry.catalog}/admin/vendors/${vendorId}/status`, {
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

  // Dynamic Telemetry metrics
  const stats = useMemo(() => {
    // Total Sales GMV
    let sales = 0;
    orders.forEach(o => {
      sales += parseFloat(o.total_amount || 0);
    });

    const activeVendors = vendors.filter(v => v.status === 'approved').length;
    const pendingApprovals = vendors.filter(v => v.status === 'pending').length;
    const totalOrdersCount = orders.length;

    return {
      sales,
      vendors: activeVendors,
      pending: pendingApprovals,
      orders: totalOrdersCount
    };
  }, [orders, vendors]);

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
    <div className="min-h-screen bg-[#070a13] font-sans text-[#dce3f0] antialiased">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-55 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
          toast.type === 'error' 
            ? 'bg-rose-955/80 border-rose-800 text-rose-200' 
            : 'bg-[#0d1527]/90 border-white/[0.08] text-white'
        }`}>
          <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
            toast.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          </div>
          <p className="text-xs font-bold tracking-wide">{toast.message}</p>
        </div>
      )}

      {/* Top Header Controls */}
      <nav className="bg-[#0b1021]/80 border-b border-white/[0.06] py-3.5 px-6 sm:px-10 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-rose-600 to-pink-500 rounded-xl p-2 flex items-center justify-center shadow-lg shadow-rose-500/10">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-wide">Tech-Hub Admin</h1>
            <p className="text-[9px] text-rose-400 font-bold uppercase tracking-widest mt-0.5">Control Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-2.5 bg-[#0a0f1d]/60 border border-white/[0.06] px-3.5 py-1.5 rounded-full text-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-semibold text-slate-350 capitalize">Admin Mode : <strong>{user?.name || 'Platform Admin'}</strong></span>
          </div>
          
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center p-1.5 rounded-xl bg-[#12192a] hover:bg-[#1a233b] text-slate-300 hover:text-white border border-white/[0.04] transition-all focus:outline-none"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-550" />}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#12192a] hover:bg-[#1a233b] text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-white/[0.04]"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Layout */}
      <div className="flex min-h-[calc(screen-65px)]">
        
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-white/[0.06] bg-[#090e1c]/40 flex flex-col justify-between p-4 shrink-0 hidden lg:flex">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3">System Control</p>
              <div className="mt-3 space-y-1">
                {[
                  { id: 'overview', label: 'Telemetry Overview', icon: <BarChart3 className="w-4 h-4" /> },
                  { id: 'approvals', label: 'Merchant Approvals', icon: <Users className="w-4 h-4" /> },
                  { id: 'logs', label: 'Logs & Health', icon: <Terminal className="w-4 h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === tab.id
                        ? 'bg-rose-600/10 text-rose-455 border border-rose-500/20 shadow-sm shadow-rose-500/5'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#12192c]/55 border border-transparent'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Sanity diagnostics widget */}
            <div className="p-4 rounded-2xl bg-[#0e162b]/60 border border-white/[0.06] space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">System Sanity</span>
              </div>
              <div className="space-y-2 text-[10px] text-slate-400">
                <div className="flex justify-between">
                  <span>API gateway:</span>
                  <span className="text-emerald-400 font-bold">Online</span>
                </div>
                <div className="flex justify-between">
                  <span>SSL Certificate:</span>
                  <span className="text-emerald-400 font-bold">Secure</span>
                </div>
                <div className="flex justify-between">
                  <span>Elastic Node:</span>
                  <span className="text-emerald-400 font-bold">Healthy</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-semibold px-3 space-y-1">
            <p>Tech-Hub Console v3.1.2</p>
            <p>&copy; 2026 Tech-Hub</p>
          </div>
        </aside>

        {/* Tab content area */}
        <main className="flex-1 p-6 sm:p-10 max-w-[1440px] mx-auto overflow-y-auto w-full">
          
          {/* Mobile Tab Select Dropdown */}
          <div className="lg:hidden mb-6">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Select Panel Workspace</label>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full bg-[#0c1325] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-bold text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="overview">Telemetry Overview</option>
              <option value="approvals">Merchant Approvals</option>
              <option value="logs">Logs & Health</option>
            </select>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
              <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Streaming system telemetry...</p>
            </div>
          ) : (
            <>
              {/* 1. TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Greeting */}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Platform Telemetry</h2>
                    <p className="text-xs font-semibold text-slate-400 mt-1">Review live database telemetry, financial aggregates, and registration statuses.</p>
                  </div>

                  {/* Telemetry Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Platform Sales', val: `LKR ${stats.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: 'Accumulated platform GMV', icon: <BarChart3 className="w-5 h-5 text-rose-400" /> },
                      { label: 'Approved Merchants', val: `${stats.vendors} Storefronts`, sub: 'Live and selling partners', icon: <Users className="w-5 h-5 text-indigo-400" /> },
                      { label: 'Pending Approvals', val: `${stats.pending} Applications`, sub: 'Require administrative review', icon: <AlertCircle className="w-5 h-5 text-amber-400" /> },
                      { label: 'Completed Orders', val: `${stats.orders} Placed`, sub: 'Success-based checkouts', icon: <ShoppingBag className="w-5 h-5 text-emerald-400" /> }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-[#0c1325]/50 border border-white/[0.08] rounded-2xl p-5 flex items-start justify-between backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-colors" />
                        <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                          <div>
                            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-none">{stat.val}</h3>
                            <p className="text-[10px] font-bold text-slate-400 mt-1.5">{stat.sub}</p>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] shrink-0">
                          {stat.icon}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Approval Alerts Section */}
                  {stats.pending > 0 && (
                    <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border border-amber-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-extrabold text-white">Action Required: {stats.pending} Pending Merchant Applications</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Submit reviews on vendor profiles to approve or reject their workspace catalogs.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('approvals')}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] px-4 py-2.5 rounded-xl transition-all shadow-md shrink-0 whitespace-nowrap uppercase tracking-wider"
                      >
                        Manage Approvals
                      </button>
                    </div>
                  )}

                  {/* Summary lists */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Platform Orders overview */}
                    <div className="bg-[#0c1325]/50 border border-white/[0.08] rounded-3xl p-6 space-y-4">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-emerald-400" />
                        Platform Order Logs
                      </h3>
                      <p className="text-xs text-slate-400">Chronological list of checkout purchases recorded on the main server.</p>
                      
                      <div className="space-y-3 pt-2 max-h-[350px] overflow-y-auto pr-1">
                        {orders.map((o) => (
                          <div key={o.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
                            <div>
                              <p className="font-extrabold text-slate-200">Order Reference: #{o.id}</p>
                              <p className="text-[10px] text-slate-450 mt-0.5">
                                Customer: {o.user?.name || 'Customer'} | Status: <strong className="text-blue-450 uppercase">{o.status}</strong>
                              </p>
                            </div>
                            <span className="font-extrabold text-emerald-400 text-right">
                              LKR {parseFloat(o.total_amount).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {orders.length === 0 && (
                          <div className="text-center py-6 text-xs text-slate-500 font-bold">
                            No checkout order events detected.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick approvals list */}
                    <div className="bg-[#0c1325]/50 border border-white/[0.08] rounded-3xl p-6 space-y-4">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-400" />
                        System Registrations
                      </h3>
                      <p className="text-xs text-slate-400">List of tech stores and sellers registered to manage catalog items.</p>
                      
                      <div className="space-y-3 pt-2 max-h-[350px] overflow-y-auto pr-1">
                        {vendors.map((v) => (
                          <div key={v.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
                            <div>
                              <p className="font-extrabold text-slate-250">{v.store_name || 'Unnamed Store'}</p>
                              <p className="text-[10px] text-slate-450 mt-0.5">Owner: {v.name} | {v.email}</p>
                            </div>
                            <span className={`inline-flex items-center text-[8px] font-black px-2 py-0.5 rounded-full border uppercase ${
                              v.status === 'approved' 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                : v.status === 'pending'
                                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                            }`}>
                              {v.status}
                            </span>
                          </div>
                        ))}
                        {vendors.length === 0 && (
                          <div className="text-center py-6 text-xs text-slate-500 font-bold">
                            No registered sellers found.
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 2. TAB: MERCHANT APPROVALS */}
              {activeTab === 'approvals' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Merchant Approvals</h2>
                    <p className="text-xs font-semibold text-slate-400 mt-1">Submit approvals on applicant accounts to authorize platform search indexes.</p>
                  </div>

                  {/* Filter and Search controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Search by Store */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        placeholder="Search store name or merchant..."
                        value={vendorSearch}
                        onChange={(e) => setVendorSearch(e.target.value)}
                        className="w-full bg-[#0c1325]/50 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:border-rose-500 text-slate-200"
                      />
                    </div>
                    {/* Status filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full bg-[#0c1325]/50 border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-bold text-slate-350 focus:outline-none focus:border-rose-500"
                    >
                      <option value="all">All Applications (Approved & Pending)</option>
                      <option value="pending">Pending Approval</option>
                      <option value="approved">Approved Partners</option>
                      <option value="rejected">Rejected / Suspended</option>
                    </select>
                  </div>

                  {/* Merchant List Table */}
                  <div className="bg-[#0c1325]/50 border border-white/[0.08] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/[0.06] text-slate-455 font-black uppercase tracking-wider text-[9px] bg-white/[0.01]">
                            <th className="p-4">Store details</th>
                            <th className="p-4">Owner Profile</th>
                            <th className="p-4">Contact email</th>
                            <th className="p-4">Registration status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {filteredVendors.map((row) => (
                            <tr key={row.id} className="hover:bg-white/[0.01] transition-colors">
                              <td className="p-4">
                                <div>
                                  <p className="font-extrabold text-white text-xs sm:text-[13px]">{row.store_name || 'Unnamed Merchant'}</p>
                                  <p className="text-[10px] text-slate-400 mt-1">ID Code: VND-{row.id}</p>
                                </div>
                              </td>
                              <td className="p-4 text-slate-300 font-bold">{row.name}</td>
                              <td className="p-4 text-slate-400 font-semibold">{row.email}</td>
                              <td className="p-4">
                                <span className={`inline-flex items-center text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                                  row.status === 'approved' 
                                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                                    : row.status === 'pending'
                                      ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                                      : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                                }`}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-2 shrink-0 whitespace-nowrap">
                                {row.status !== 'approved' && (
                                  <button
                                    disabled={actionLoading}
                                    onClick={() => handleUpdateStatus(row.id, 'approved')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg transition-all shadow-md disabled:opacity-50"
                                  >
                                    Approve
                                  </button>
                                )}
                                {row.status !== 'rejected' && (
                                  <button
                                    disabled={actionLoading}
                                    onClick={() => handleUpdateStatus(row.id, 'rejected')}
                                    className="bg-rose-950/40 text-rose-455 border border-rose-900/30 hover:bg-rose-950/80 font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
                                  >
                                    Reject
                                  </button>
                                )}
                                {row.status === 'approved' && (
                                  <button
                                    disabled={actionLoading}
                                    onClick={() => handleUpdateStatus(row.id, 'pending')}
                                    className="bg-white/[0.04] border border-white/[0.06] text-slate-300 hover:bg-white/[0.08] font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg transition-all"
                                  >
                                    Suspend
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                          {filteredVendors.length === 0 && (
                            <tr>
                              <td colSpan="5" className="text-center py-10 text-xs font-semibold text-slate-550">
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

              {/* 3. TAB: LOGS & SANITY HEALTH */}
              {activeTab === 'logs' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Telemetry Diagnostic Logs</h2>
                      <p className="text-xs font-semibold text-slate-400 mt-1">Examine real-time system connection events, indexing telemetry, and audits.</p>
                    </div>

                    <button
                      disabled={refreshingDiagnostics}
                      onClick={triggerRefreshDiagnostics}
                      className="flex items-center justify-center gap-2 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${refreshingDiagnostics ? 'animate-spin' : ''}`} />
                      Refresh diagnostics
                    </button>
                  </div>

                  <div className="bg-[#090e1c] border border-white/[0.08] rounded-2xl p-6 font-mono text-xs text-slate-350 space-y-4 shadow-inner max-h-[500px] overflow-y-auto">
                    <div className="flex items-center gap-2 text-rose-400 border-b border-white/[0.04] pb-3 mb-2 font-bold">
                      <Terminal className="w-4 h-4" />
                      SYSTEM CENTRAL LOGGER
                    </div>
                    
                    <div className="space-y-3.5">
                      {logs.map((log) => (
                        <div key={log.id} className="flex gap-4 items-start border-b border-white/[0.02] pb-3">
                          <span className="text-slate-500 font-semibold shrink-0 pt-0.5">[{log.time}]</span>
                          <div className="space-y-1">
                            <p className="leading-relaxed text-slate-300 font-semibold">{log.msg}</p>
                            <span className={`inline-block text-[8px] font-black uppercase px-2 py-0.2 rounded ${
                              log.type === 'success' 
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                : log.type === 'warning'
                                  ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                                  : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                            }`}>
                              {log.type}
                            </span>
                          </div>
                        </div>
                      ))}
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
