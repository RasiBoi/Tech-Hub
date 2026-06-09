import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, LogOut, Users, ShoppingBag, BarChart3, AlertCircle, RefreshCw, Cpu, Award } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Admin Navbar */}
      <nav className="bg-slate-900 text-white py-4 px-6 sm:px-10 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="bg-rose-500 rounded-xl p-2 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-wide leading-none">Tech-Hub Admin</h1>
            <p className="text-[10px] text-rose-400 font-bold uppercase mt-1 tracking-wider">Control Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2.5 bg-slate-950/40 border border-slate-800 px-3.5 py-1.5 rounded-full">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-300 capitalize">{user?.role} Mode: {user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-700"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
              Real-time platform telemetry, merchant approvals, and system sanity diagnostics.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 animate-spin" />
            Refresh Telemetry
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Platform Sales', val: 'LKR 4,892,150.00', change: '+14.2% vs last week', icon: <BarChart3 className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50 border-blue-100' },
            { label: 'Active Registered Vendors', val: '24 Vendors', change: '+3 new today', icon: <Users className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100' },
            { label: 'Pending Approvals', val: '5 Applications', change: 'Require action', icon: <AlertCircle className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50 border-amber-100' },
            { label: 'Total Completed Orders', val: '1,842 Orders', change: '99.2% success rate', icon: <ShoppingBag className="w-5 h-5 text-indigo-600" />, bg: 'bg-indigo-50 border-indigo-100' }
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex items-start justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{card.label}</p>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">{card.val}</h3>
                  <p className="text-[10px] font-bold text-slate-500 mt-2">{card.change}</p>
                </div>
              </div>
              <div className={`p-3 rounded-2xl border ${card.bg} shrink-0`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Multi-Pane Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Vendor Approvals (2/3 width) */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200/60 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">Pending Merchant Approvals</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[9px]">
                    <th className="pb-3">Applicant / Store</th>
                    <th className="pb-3">Contact Email</th>
                    <th className="pb-3">Requested Tier</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { store: 'Sony Authorized Store', cat: 'Audio Accessories', email: 'merchant-sony@techhub.com', tier: 'Verified Partner', status: 'Pending Review' },
                    { store: 'Matrix Laptops Corp', cat: 'Premium Hardware', email: 'matrix-sys@techhub.com', tier: 'Standard Seller', status: 'Pending Review' },
                    { store: 'PixelGadget Labs', cat: 'Stress Relievers & Toys', email: 'pixel-labs@techhub.com', tier: 'Standard Seller', status: 'Verification' }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <div>
                          <p className="font-extrabold text-slate-800 text-xs sm:text-[13px]">{row.store}</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1">{row.cat}</p>
                        </div>
                      </td>
                      <td className="py-4 text-slate-500 font-semibold">{row.email}</td>
                      <td className="py-4 font-bold text-slate-600">{row.tier}</td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/60 text-amber-600 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] px-3.5 py-1.5 rounded-lg transition-all shadow-sm">
                          Approve
                        </button>
                        <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-black text-[10px] px-3.5 py-1.5 rounded-lg transition-all">
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Telemetry & Logs (1/3 width) */}
          <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">Platform Logs & Health</h3>
            
            <div className="space-y-4">
              {[
                { time: '14:22:18', msg: 'Vercel static build trigger resolved successfully.', status: 'info', bg: 'text-blue-500 bg-blue-50' },
                { time: '14:18:04', msg: 'System check: Buyer Protection SSL status verified.', status: 'success', bg: 'text-emerald-500 bg-emerald-50' },
                { time: '13:58:45', msg: 'New Vendor registered: Samsung Official.', status: 'info', bg: 'text-blue-500 bg-blue-50' },
                { time: '12:04:12', msg: 'Checkout gateway connection re-routed to backup node.', status: 'warning', bg: 'text-amber-500 bg-amber-50' }
              ].map((log, i) => (
                <div key={i} className="flex gap-3 text-xs border-b border-slate-50 pb-3 last:border-b-0 last:pb-0">
                  <span className="text-slate-400 font-mono shrink-0 pt-0.5">{log.time}</span>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-600 leading-normal">{log.msg}</p>
                    <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.2 rounded ${log.bg}`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
