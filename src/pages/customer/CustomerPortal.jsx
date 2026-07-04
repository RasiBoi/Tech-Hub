import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Home, Package, Store, Settings, Clock, Truck, CheckCircle2, 
  MapPin, Copy, ExternalLink, Trash2, ArrowLeft, Loader2, 
  ShieldCheck, AlertCircle, ShoppingBag, Eye, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { requestJson } from '../../services/httpClient';
import { serviceRegistry } from '../../config/serviceRegistry';
import Navbar from '../../components/Navbar';

export default function CustomerPortal() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('overview'); // overview | orders | vendors | settings
  const [orders, setOrders] = useState([]);
  const [followedVendors, setFollowedVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Tracking detail view
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Account details state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileAvatarBg, setProfileAvatarBg] = useState(user?.avatarBg || 'bg-gradient-to-tr from-blue-500 to-indigo-600');
  const [shippingAddress, setShippingAddress] = useState(
    localStorage.getItem(`techhub_addr_${user?.id}`) || 'No. 45, Galle Road, Colombo 03, Sri Lanka'
  );
  const [shippingPhone, setShippingPhone] = useState(
    localStorage.getItem(`techhub_phone_${user?.id}`) || '+94 77 123 4567'
  );

  const avatarOptions = [
    { name: 'Classic Blue', value: 'bg-gradient-to-tr from-blue-500 to-indigo-600' },
    { name: 'Walnut Dark', value: 'bg-gradient-to-tr from-slate-700 to-slate-900' },
    { name: 'Forest Green', value: 'bg-gradient-to-tr from-emerald-500 to-teal-600' },
    { name: 'Amber Glow', value: 'bg-gradient-to-tr from-amber-500 to-orange-600' },
    { name: 'Rose Petal', value: 'bg-gradient-to-tr from-rose-500 to-pink-600' },
    { name: 'Purple Night', value: 'bg-gradient-to-tr from-violet-600 to-fuchsia-600' },
  ];

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch user orders
      const ordersData = await requestJson(`${serviceRegistry.commerce}/orders`);
      if (ordersData) {
        setOrders(ordersData);
      }
      
      // 2. Fetch followed vendors from public vendors index (filter where is_followed is true)
      const vendorsData = await requestJson(`${serviceRegistry.catalog}/vendors`);
      if (vendorsData) {
        const followed = vendorsData.filter(v => v.is_followed);
        setFollowedVendors(followed);
      }
    } catch (e) {
      console.error('Error fetching portal data:', e);
      showToast('Failed to sync dashboard telemetry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (location.state?.openTab === 'orders') {
      setActiveTab('orders');
    }
    fetchData();
  }, [user, location.state?.openTab]);

  // Handle unfollow store directly
  const handleUnfollowStore = async (vendorId) => {
    setActionLoading(true);
    try {
      await requestJson(`${serviceRegistry.catalog}/vendors/${vendorId}/follow`, {
        method: 'POST'
      });
      showToast('Store unfollowed successfully.');
      // Update local state instantly
      setFollowedVendors(prev => prev.filter(v => v.id !== vendorId));
    } catch (e) {
      console.error(e);
      showToast('Action failed. Please try again.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Save Profile Settings
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const updatedUser = await requestJson(`${serviceRegistry.catalog}/profile`, {
        method: 'PUT',
        body: {
          name: profileName,
          avatar_bg: profileAvatarBg
        }
      });
      
      updateUser(updatedUser);
      localStorage.setItem(`techhub_addr_${user.id}`, shippingAddress);
      localStorage.setItem(`techhub_phone_${user.id}`, shippingPhone);
      
      showToast('Account credentials and delivery details updated.');
    } catch (e) {
      console.error(e);
      showToast('Failed to update profile.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Tracking code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-white flex flex-col font-sans">
      <Navbar />
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-20 right-6 z-55 flex items-center gap-2 px-5 py-3 rounded-xl border shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'error' 
            ? 'bg-rose-950/80 border-rose-800 text-rose-200' 
            : 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span className="text-xs font-bold">{toast.msg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
          <p className="text-xs text-slate-400 font-bold tracking-wider">Compiling dashboard telemetry...</p>
        </div>
      ) : (
        <div className="max-w-[1720px] mx-auto w-full px-4 lg:px-8 2xl:px-12 py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Menu */}
          <aside className="lg:col-span-1 space-y-6">
            {/* User Meta Card */}
            <div className="bg-[#0b1229]/60 border border-white/[0.04] rounded-2xl p-6 text-center shadow-lg backdrop-blur-md">
              <div className={`w-20 h-20 rounded-full mx-auto border-2 border-white/10 flex items-center justify-center text-xl font-black shadow-lg mb-4 ${user?.avatarBg}`}>
                {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <h3 className="font-bold text-base tracking-tight text-white">{user?.name}</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user?.email}</p>
              <div className="mt-3.5 inline-block bg-blue-950/40 text-blue-400 border border-blue-900/30 text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                Buyer Member
              </div>
            </div>

            {/* Sidebar Tabs */}
            <nav className="bg-[#0b1229]/40 border border-white/[0.04] rounded-2xl p-3 flex flex-row lg:flex-col gap-1 overflow-x-auto shadow-md">
              <button 
                onClick={() => { setActiveTab('overview'); setSelectedOrder(null); }}
                className={`flex-1 lg:flex-none text-left px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15' : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                Overview
              </button>

              <button 
                onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
                className={`flex-1 lg:flex-none text-left px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15' : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Package className="w-4 h-4 shrink-0" />
                Orders & Tracking
              </button>

              <button 
                onClick={() => { setActiveTab('vendors'); setSelectedOrder(null); }}
                className={`flex-1 lg:flex-none text-left px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'vendors' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15' : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Store className="w-4 h-4 shrink-0" />
                Followed Shops
              </button>

              <button 
                onClick={() => { setActiveTab('settings'); setSelectedOrder(null); }}
                className={`flex-1 lg:flex-none text-left px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'settings' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15' : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                Delivery Details
              </button>
            </nav>
          </aside>

          {/* Right Main Content */}
          <main className="lg:col-span-3 space-y-6">

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Customer Dashboard</h2>
                  <p className="text-xs text-slate-400 font-medium mt-1">Monitor setup deliveries, track shipping waybills, and manage brand follows.</p>
                </div>

                {/* Telemetry Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-[#0b1229]/60 border-l-4 border-l-emerald-500 border border-white/[0.04] rounded-2xl p-5 shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Orders Placed</p>
                    <h3 className="text-2xl font-black text-white">{orders.length} Order(s)</h3>
                    <p className="text-[9px] text-slate-400">Total transaction history</p>
                  </div>
                  <div className="bg-[#0b1229]/60 border-l-4 border-l-amber-500 border border-white/[0.04] rounded-2xl p-5 shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Followed Stores</p>
                    <h3 className="text-2xl font-black text-white">{followedVendors.length} Brands</h3>
                    <p className="text-[9px] text-slate-400">Ecosystem partner stores</p>
                  </div>
                  <div className="bg-[#0b1229]/60 border-l-4 border-l-blue-500 border border-white/[0.04] rounded-2xl p-5 shadow-sm space-y-1">
                    <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Shipping Destination</p>
                    <h3 className="text-xs font-bold text-white truncate mt-1">{shippingAddress}</h3>
                    <p className="text-[9px] text-slate-400">Default delivery address</p>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="bg-[#0b1229]/40 border border-white/[0.04] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <h3 className="text-sm font-bold text-white">Recent Purchases</h3>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="text-[11px] font-extrabold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      View all orders
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {orders.slice(0, 3).map((order) => (
                      <div 
                        key={order.id}
                        className="bg-[#0b1229]/60 border border-white/[0.03] rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/[0.08] transition-all"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-blue-950/40 border border-blue-900/35 flex items-center justify-center text-blue-400 shadow-inner">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-white">Order Ref: #{order.id}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Placed on: {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-left sm:text-right">
                            <p className="text-xs font-black text-slate-200">LKR {order.total_amount.toLocaleString()}</p>
                            <span className={`inline-block text-[9px] font-bold uppercase tracking-wider mt-1 ${
                              order.status === 'dispatched' ? 'text-emerald-400' : 'text-amber-400'
                            }`}>
                              {order.status === 'dispatched' ? 'Shipped / Dispatched' : 'Processing Order'}
                            </span>
                          </div>
                          <button 
                            onClick={() => { setSelectedOrder(order); setActiveTab('orders'); }}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg border border-white/[0.05] transition-colors"
                          >
                            Track Delivery
                          </button>
                        </div>
                      </div>
                    ))}

                    {orders.length === 0 && (
                      <div className="text-center py-10 space-y-2.5">
                        <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="text-xs text-slate-400 font-semibold">No setups or products purchased yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Order Tracking & History</h2>
                  <p className="text-xs text-slate-400 font-medium mt-1">Review your checkout transactions and follow shipping waybill logs.</p>
                </div>

                {!selectedOrder ? (
                  /* Order list Table */
                  <div className="bg-[#0b1229]/40 border border-white/[0.04] rounded-2xl overflow-hidden shadow-md">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-white/[0.02] border-b border-white/[0.05] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="py-3.5 px-6">Order Info</th>
                            <th className="py-3.5 px-6">Items Purchased</th>
                            <th className="py-3.5 px-6">Order Total</th>
                            <th className="py-3.5 px-6">Shipping Status</th>
                            <th className="py-3.5 px-6 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order, idx) => (
                            <tr 
                              key={order.id}
                              className={`border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors ${
                                idx % 2 !== 0 ? 'bg-white/[0.005]' : ''
                              }`}
                            >
                              <td className="py-4 px-6">
                                <p className="font-extrabold text-white">Ref: #{order.id}</p>
                                <p className="text-[10px] text-slate-450 mt-0.5">{new Date(order.created_at).toLocaleString()}</p>
                              </td>
                              <td className="py-4 px-6 font-medium text-slate-300">
                                {order.items?.map(i => i.product?.title || 'Tech item').join(', ') || 'Setup Accessory'}
                              </td>
                              <td className="py-4 px-6 font-extrabold text-emerald-400">
                                LKR {order.total_amount.toLocaleString()}
                              </td>
                              <td className="py-4 px-6">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  order.status === 'dispatched' 
                                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' 
                                    : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                                }`}>
                                  {order.status === 'dispatched' ? 'Shipped' : 'Processing'}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-blue-600/10 flex items-center gap-1.5 ml-auto"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Track Details
                                </button>
                              </td>
                            </tr>
                          ))}

                          {orders.length === 0 && (
                            <tr>
                              <td colSpan="5" className="text-center py-14 text-xs font-semibold text-slate-500">
                                No purchase logs available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* Visual Tracking Details Wizard */
                  <div className="bg-[#0b1229]/40 border border-white/[0.04] rounded-2xl p-6 sm:p-8 space-y-8 shadow-lg">
                    {/* Header bar */}
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                      <button 
                        onClick={() => setSelectedOrder(null)}
                        className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 bg-transparent border-0"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to history
                      </button>
                      <span className="text-xs font-black text-slate-400">Order ID: #{selectedOrder.id}</span>
                    </div>

                    {/* Order items info card */}
                    <div className="bg-[#0b1229]/70 border border-white/[0.03] rounded-xl p-5 space-y-4">
                      <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest border-b border-white/[0.04] pb-2">Products in Shipment</h3>
                      <div className="divide-y divide-white/[0.04]">
                        {selectedOrder.items?.map((item) => (
                          <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                                {item.product?.image ? (
                                  <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="w-5 h-5 text-slate-650" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-extrabold text-white truncate">{item.product?.title || 'Tech-Hub Gear'}</p>
                                <p className="text-[10px] text-slate-450 mt-0.5">Quantity: {item.quantity} Unit(s)</p>
                                <p className="text-[9px] text-slate-500 font-mono mt-0.5">Fulfilled by: {item.product?.vendor?.store_name || item.product?.vendor?.name || 'Partner Merchant'}</p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-xs font-extrabold text-emerald-400">LKR {(item.price * item.quantity).toLocaleString()}</p>
                              <span className={`inline-block text-[8px] font-black uppercase tracking-widest mt-1 px-2 py-0.5 rounded-full ${
                                item.status === 'dispatched' 
                                  ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/20' 
                                  : 'bg-amber-950/30 text-amber-400 border border-amber-900/20'
                              }`}>
                                {item.status === 'dispatched' ? 'Shipped' : 'Awaiting Dispatch'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipments timeline */}
                    <div className="space-y-6">
                      <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest">Fulfillment timeline</h3>
                      
                      <div className="relative border-l border-white/[0.06] pl-6 ml-3 space-y-8 py-2">
                        
                        {/* Step 1: Order Placed */}
                        <div className="relative">
                          {/* Dot indicator */}
                          <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 border-2 border-[#070b19]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">Order Confirmed & Placed</h4>
                            <p className="text-[10px] text-slate-450 mt-0.5">Payment verified and order submitted to merchants.</p>
                            <p className="text-[9px] text-slate-500 font-mono mt-1">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Step 2: Processing */}
                        <div className="relative">
                          <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 border-2 border-[#070b19]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">Processing & Allocation</h4>
                            <p className="text-[10px] text-slate-450 mt-0.5">Merchants are packing products and preparing courier dispatch items.</p>
                            <p className="text-[9px] text-slate-500 font-mono mt-1">Done</p>
                          </div>
                        </div>

                        {/* Step 3: Courier Dispatch */}
                        <div className="relative">
                          {selectedOrder.status === 'dispatched' ? (
                            <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 border-2 border-[#070b19]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            </div>
                          ) : (
                            <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center border-2 border-[#070b19]">
                              <Truck className="w-2.5 h-2.5 text-slate-500" />
                            </div>
                          )}
                          <div>
                            <h4 className={`text-xs font-bold ${selectedOrder.status === 'dispatched' ? 'text-white' : 'text-slate-500'}`}>
                              Shipped & Dispatched
                            </h4>
                            {selectedOrder.status === 'dispatched' ? (
                              <div className="space-y-3 mt-1.5">
                                <p className="text-[10px] text-slate-400">Logistics dispatch validated. Items are currently in transit.</p>
                                
                                <div className="bg-[#0b1229]/80 border border-white/[0.04] rounded-xl p-4 max-w-md space-y-2">
                                  <p className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Logistics Waybill Details</p>
                                  
                                  {selectedOrder.items?.filter(i => i.status === 'dispatched').map((item) => (
                                    <div key={`tracker-${item.id}`} className="flex flex-col sm:flex-row justify-between sm:items-center text-xs font-semibold py-1 gap-2">
                                      <span className="text-slate-400 truncate max-w-[150px]">{item.product?.title}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="bg-slate-850 px-2 py-0.5 rounded text-[10px] font-mono text-slate-350">{item.courier_name}</span>
                                        <div className="flex items-center gap-1.5">
                                          <code className="text-slate-200 font-mono text-[10px]">{item.tracking_code}</code>
                                          <button 
                                            onClick={() => copyToClipboard(item.tracking_code)}
                                            className="text-blue-400 hover:text-blue-300 p-1 bg-transparent border-0 cursor-pointer"
                                            title="Copy Tracking Code"
                                          >
                                            <Copy className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <p className="text-[10px] text-slate-500 mt-0.5">Awaiting merchant courier dispatch allocation.</p>
                            )}
                          </div>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="relative">
                          <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center border-2 border-[#070b19]">
                            <CheckCircle2 className="w-2.5 h-2.5 text-slate-500" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-500">Delivered</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">Package arrived safely at the default destination.</p>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Delivery Destination card */}
                    <div className="bg-[#0b1229]/30 border border-white/[0.04] rounded-xl p-5 space-y-2.5">
                      <div className="flex items-center gap-1.5 border-b border-white/[0.04] pb-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Delivery Destination</h4>
                      </div>
                      <div className="text-xs font-medium text-slate-350 space-y-1">
                        <p className="text-white font-bold">{user?.name}</p>
                        <p>{shippingAddress}</p>
                        <p>Tel: {shippingPhone}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: FOLLOWED SHOPS */}
            {activeTab === 'vendors' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Followed Ecosystem Partners</h2>
                  <p className="text-xs text-slate-400 font-medium mt-1">Review setup catalogs, brand announcements, and direct configurations from stores you follow.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {followedVendors.map((vendor) => (
                    <div 
                      key={vendor.id}
                      className="bg-[#0b1229]/60 border border-white/[0.04] rounded-2xl overflow-hidden shadow-md flex flex-col justify-between hover:border-white/[0.08] transition-all"
                    >
                      {/* Banner cover */}
                      <div className="h-24 w-full bg-slate-900 relative">
                        {vendor.cover_image_url ? (
                          <img src={vendor.cover_image_url} alt={vendor.store_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-slate-950" />
                        )}
                        <div className="absolute inset-0 bg-slate-950/30" />
                      </div>

                      {/* Store detail block */}
                      <div className="px-5 pb-5 pt-0 relative flex-1 flex flex-col justify-between">
                        {/* Logo overlay */}
                        <div className="-mt-8 mb-3 flex items-center justify-between">
                          <div className="w-14 h-14 rounded-2xl border-2 border-[#0b1229] shadow-lg flex items-center justify-center text-white text-base font-black bg-gradient-to-tr from-blue-500 to-indigo-600 overflow-hidden shrink-0">
                            {vendor.logo_url ? (
                              <img src={vendor.logo_url} alt={vendor.store_name} className="w-full h-full object-cover" />
                            ) : (
                              (vendor.store_name || vendor.name || '?').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                            )}
                          </div>
                          
                          <div className="text-right">
                            <span className="inline-block bg-[#0e1633] text-blue-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-blue-950/30">
                              Partner Shop
                            </span>
                          </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-1 flex-1">
                          <h4 className="font-extrabold text-sm text-white tracking-tight leading-snug">{vendor.store_name || vendor.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{vendor.followers_count || 0} Followers • {vendor.products_count || 0} Products</p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed italic mt-2">
                            "{vendor.company_profile || vendor.store_description || 'Workspace setup essentials.'}"
                          </p>
                        </div>

                        {/* Actions buttons */}
                        <div className="flex gap-2.5 pt-4 border-t border-white/[0.04] mt-4">
                          <Link 
                            to={`/vendors/${vendor.id}`}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] py-2 rounded-xl text-center shadow-md shadow-blue-600/5 transition-all flex items-center justify-center gap-1"
                          >
                            <Store className="w-3.5 h-3.5" />
                            Visit Store
                          </Link>
                          
                          <button
                            onClick={() => handleUnfollowStore(vendor.id)}
                            disabled={actionLoading}
                            className="bg-transparent border border-rose-900/30 text-rose-400 hover:text-white hover:bg-rose-600/10 px-3.5 py-2 rounded-xl transition-all"
                            title="Unfollow Store"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {followedVendors.length === 0 && (
                    <div className="col-span-full text-center py-16 space-y-4">
                      <Store className="w-10 h-10 text-slate-700 mx-auto" />
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400 font-extrabold">Not following any workspace stores yet.</p>
                        <p className="text-[10px] text-slate-500 font-medium">Browse verified partners to follow for customized gear.</p>
                      </div>
                      <Link 
                        to="/vendors"
                        className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-white/[0.05] transition-all"
                      >
                        Explore Partners
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Delivery Details & Profile</h2>
                  <p className="text-xs text-slate-400 font-medium mt-1">Configure account identifiers and primary shipping destination for fast checkout.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="bg-[#0b1229]/40 border border-white/[0.04] rounded-2xl p-6 sm:p-8 space-y-6 shadow-md max-w-2xl">
                  
                  {/* Account Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-[#070b19] border border-white/[0.06] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Profile Theme / Avatar bg */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">Profile Color Scheme</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {avatarOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setProfileAvatarBg(opt.value)}
                          className={`px-3.5 py-2.5 rounded-xl text-[10px] font-extrabold flex items-center justify-between border transition-all ${
                            profileAvatarBg === opt.value 
                              ? 'border-blue-500 text-white shadow-md' 
                              : 'border-white/[0.04] text-slate-400 hover:text-white bg-[#070b19]'
                          }`}
                        >
                          {opt.name}
                          <div className={`w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm ${opt.value}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Contact Phone Number</label>
                    <input 
                      type="text" 
                      required
                      value={shippingPhone} 
                      onChange={(e) => setShippingPhone(e.target.value)}
                      className="w-full bg-[#070b19] border border-white/[0.06] rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="+94 77 123 4567"
                    />
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest">Default Shipping Address</label>
                    <textarea 
                      rows="3"
                      required
                      value={shippingAddress} 
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full bg-[#070b19] border border-white/[0.06] rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
                      placeholder="Street address, City, Sri Lanka"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg shadow-blue-600/10 flex items-center justify-center gap-1.5 transition-all"
                  >
                    {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Updates
                  </button>
                </form>
              </div>
            )}

          </main>
        </div>
      )}
    </div>
  );
}
