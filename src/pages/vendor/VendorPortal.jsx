import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutGrid, Plus, BarChart3, RotateCcw, PackageCheck, AlertCircle, RefreshCw, Cpu, Award } from 'lucide-react';

export default function VendorPortal() {
  const { user, logout } = useAuth();
  
  // Local state to simulate adding a new product
  const [products, setProducts] = useState([
    { id: 1, name: 'MagPro 3-in-1 Charging Station', category: 'Charging Stations', price: 'LKR 21,900.00', stock: 42, status: 'In Stock' },
    { id: 2, name: 'Qi2 2-in-1 Charging Dock', category: 'Charging Stations', price: 'LKR 18,900.00', stock: 15, status: 'Low Stock' },
    { id: 3, name: 'iPad Pro Dock Stand (Silver)', category: 'Stands & Holders', price: 'LKR 14,500.00', stock: 89, status: 'In Stock' }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState('Charging Stations');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdStock) return;

    const newProd = {
      id: Date.now(),
      name: newProdName,
      category: newProdCat,
      price: `LKR ${parseFloat(newProdPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      stock: parseInt(newProdStock),
      status: parseInt(newProdStock) > 10 ? 'In Stock' : 'Low Stock'
    };

    setProducts([newProd, ...products]);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdStock('');
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-[#eef2f8] font-sans text-slate-800">
      {/* Vendor Navbar */}
      <nav className="bg-slate-900 text-white py-4 px-6 sm:px-10 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 rounded-xl p-2 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-wide leading-none">{user?.storeName || 'Vendor Console'}</h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase mt-1 tracking-wider">Merchant Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2.5 bg-slate-950/40 border border-slate-800 px-3.5 py-1.5 rounded-full">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-300 capitalize">{user?.role} Access: {user?.name}</span>
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

      {/* Main Content */}
      <main className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        
        {/* Header row */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Merchant Workspace</h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
              Manage inventory catalogs, verify purchase queries, and trace store analytics.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 hover:scale-[1.01] active:scale-99"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>

        {/* Analytics blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Store Sales (LKR)', val: 'LKR 842,500.00', change: '+8.4% vs last week', icon: <BarChart3 className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50 border-blue-100' },
            { label: 'Active Listings', val: `${products.length} Products`, change: 'Synced on platform', icon: <LayoutGrid className="w-5 h-5 text-indigo-600" />, bg: 'bg-indigo-50 border-indigo-100' },
            { label: 'Orders Dispatched', val: '58 Dispatched', change: '100% on-time rate', icon: <PackageCheck className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-100' },
            { label: 'Customer Queries', val: '2 Pending', change: 'Avg response time 8m', icon: <AlertCircle className="w-5 h-5 text-rose-600" />, bg: 'bg-rose-50 border-rose-100' }
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

        {/* Dynamic add form drawer modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4">Add Listing Catalog</h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Baseus MagSafe Stand"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full bg-white border border-slate-200/80 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Price (LKR)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 18500"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full bg-white border border-slate-200/80 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Stock Count</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 45"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="w-full bg-white border border-slate-200/80 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-800"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Category</label>
                  <select
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value)}
                    className="w-full bg-white border border-slate-200/80 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-800"
                  >
                    <option value="Charging Stations">Charging Stations</option>
                    <option value="Stands & Holders">Stands & Holders</option>
                    <option value="Desk Organizers">Desk Organizers</option>
                    <option value="Desk Mats">Desk Mats</option>
                    <option value="Lighting">Lighting</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-2xl transition-all shadow-md">
                    Publish Listing
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-white border border-slate-200 text-slate-600 font-extrabold text-xs py-3.5 rounded-2xl hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Inventory manager grid */}
        <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 tracking-tight mb-6">Inventory Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-black uppercase tracking-widest text-[9px]">
                  <th className="pb-3">Product details</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Pricing</th>
                  <th className="pb-3">Stock remaining</th>
                  <th className="pb-3">Health status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <p className="font-extrabold text-slate-800 text-xs sm:text-[13px]">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">ID: P-{p.id}</p>
                    </td>
                    <td className="py-4 text-slate-500 font-semibold">{p.category}</td>
                    <td className="py-4 font-bold text-slate-800">{p.price}</td>
                    <td className="py-4 font-bold text-slate-600">{p.stock} units</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
                        p.status === 'In Stock'
                          ? 'bg-emerald-50 border-emerald-200/60 text-emerald-600'
                          : 'bg-amber-50 border-amber-200/60 text-amber-600'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-black text-[10px] px-3.5 py-1.5 rounded-lg transition-all">
                        Edit
                      </button>
                      <button
                        onClick={() => setProducts(products.filter(item => item.id !== p.id))}
                        className="bg-red-50 text-red-600 hover:bg-red-100 font-black text-[10px] px-3.5 py-1.5 rounded-lg transition-all"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
