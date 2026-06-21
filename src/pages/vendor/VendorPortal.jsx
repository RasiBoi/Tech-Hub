import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { requestJson } from '../../services/httpClient';
import { serviceRegistry } from '../../config/serviceRegistry';
import { 
  LogOut, LayoutGrid, Plus, BarChart3, RotateCcw, PackageCheck, 
  AlertCircle, RefreshCw, Cpu, Award, ShoppingBag, Settings, 
  Hammer, Loader2, Search, Edit3, Trash2, CheckCircle2, ChevronRight, Truck,
  Tag, Sliders, Info, ShoppingCart, HelpCircle, Sun, Moon
} from 'lucide-react';

export default function VendorPortal() {
  const { user, logout, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('overview'); // overview | products | add | maker | orders | customize
  
  // API Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Form / Edit States
  const [editingProduct, setEditingProduct] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editSpec, setEditSpec] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  // Add Product Form State
  const [addTitle, setAddTitle] = useState('');
  const [addCategoryId, setAddCategoryId] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addStock, setAddStock] = useState('15');
  const [addSpec, setAddSpec] = useState('');
  const [addVibe, setAddVibe] = useState('minimalist');
  const [addImage, setAddImage] = useState('');
  const [addDescription, setAddDescription] = useState('');
  
  // Filter States (View Products)
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Customize Shop State
  const [shopName, setShopName] = useState(user?.storeName || '');
  const [vendorName, setVendorName] = useState(user?.name || '');
  const [shopBio, setShopBio] = useState('Premium workspace accessories & gear.');
  const [shopAvatarBg, setShopAvatarBg] = useState(user?.avatarBg || 'bg-slate-800 text-white');

  // Dispatch Courier State
  const [dispatchItem, setDispatchItem] = useState(null);
  const [courierName, setCourierName] = useState('DHL Express');
  const [trackingCode, setTrackingCode] = useState('');
  const [dispatchedTrackers, setDispatchedTrackers] = useState({}); // order_item_id -> { courier, tracking }

  // Product Maker State
  const [makerCategory, setMakerCategory] = useState('keyboard'); // keyboard | organizer | riser
  // Keyboard options
  const [kbBase, setKbBase] = useState('walnut'); // walnut | matte_black | white_acrylic | neon_glass
  const [kbSwitch, setKbSwitch] = useState('silent_brown'); // linear_red | clicky_blue | silent_brown
  const [kbKeycaps, setKbKeycaps] = useState('retro_orange'); // retro_orange | stealth_black | vaporwave
  const [kbCable, setKbCable] = useState('aviator'); // standard | aviator
  // Organizer options
  const [orgMaterial, setOrgMaterial] = useState('walnut'); // walnut | cherry | polymer | neon
  const [orgCompartments, setOrgCompartments] = useState('5_slots'); // 3_slots | 5_slots | 7_slots
  const [orgLining, setOrgLining] = useState('felt'); // none | felt | leather
  // Riser options
  const [riserWood, setRiserWood] = useState('walnut'); // walnut | cherry | metal | acrylic
  const [riserSize, setRiserSize] = useState('dual'); // single | dual
  const [riserDrawer, setRiserDrawer] = useState('walnut_drawer'); // none | walnut_drawer | acrylic_drawer

  const [makerStock, setMakerStock] = useState('15');
  const [makerPrice, setMakerPrice] = useState(0);
  const [generatedProduct, setGeneratedProduct] = useState(null);

  // Load backend data
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch categories
      const catData = await requestJson(`${serviceRegistry.catalog}/categories`);
      if (catData) {
        setCategories(catData);
        if (catData.length > 0 && !addCategoryId) {
          setAddCategoryId(catData[0].id.toString());
        }
      }
      
      // 2. Fetch products
      const prodData = await requestJson(`${serviceRegistry.catalog}/products`);
      if (prodData && user?.id) {
        // Filter products owned by this vendor
        const filteredProds = prodData.filter(
          p => p.vendor_id === user.id || p.vendor?.id === user.id
        );
        setProducts(filteredProds);
      }
      
      // 3. Fetch order items
      const ordersData = await requestJson(`${serviceRegistry.commerce}/orders`);
      if (ordersData) {
        setOrderItems(ordersData);
      }
    } catch (e) {
      console.error('Error fetching vendor data:', e);
      showToast('Failed to load dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setActionLoading(true);
    try {
      await requestJson(`${serviceRegistry.catalog}/products/${productId}`, {
        method: 'DELETE'
      });
      showToast('Listing removed successfully.');
      setProducts(products.filter(p => p.id !== productId));
    } catch (e) {
      console.error(e);
      showToast('Failed to remove listing.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Edit Product Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditTitle(product.title || product.name || '');
    setEditPrice(product.price ? product.price.toString() : '');
    setEditStock(product.stock ? product.stock.toString() : '0');
    setEditSpec(product.spec || '');
    setEditDescription(product.description || '');
  };

  // Save edited product
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle || !editPrice || !editStock) return;
    setActionLoading(true);
    try {
      const updated = await requestJson(`${serviceRegistry.catalog}/products/${editingProduct.id}`, {
        method: 'PUT',
        body: {
          title: editTitle,
          price: parseFloat(editPrice),
          stock: parseInt(editStock),
          spec: editSpec,
          description: editDescription
        }
      });
      
      showToast('Product updated successfully.');
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, title: editTitle, price: parseFloat(editPrice), stock: parseInt(editStock), spec: editSpec, description: editDescription } : p));
      setEditingProduct(null);
    } catch (e) {
      console.error(e);
      showToast('Failed to update product.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Add Product Form Submit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!addTitle || !addPrice || !addStock || !addCategoryId) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    setActionLoading(true);
    try {
      const payload = {
        title: addTitle,
        description: addDescription || 'Premium handcrafted tech workspace gear.',
        price: parseFloat(addPrice),
        stock: parseInt(addStock),
        category_id: parseInt(addCategoryId),
        spec: addSpec || 'Custom Workstation Accessory',
        vibe: addVibe || null,
        image: addImage || '../../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-1.jpg'
      };

      const newProduct = await requestJson(`${serviceRegistry.catalog}/products`, {
        method: 'POST',
        body: payload
      });

      showToast('Listing published successfully!');
      // Reset form
      setAddTitle('');
      setAddPrice('');
      setAddStock('15');
      setAddSpec('');
      setAddDescription('');
      setAddImage('');
      
      // Reload products list and go to products tab
      fetchData();
      setActiveTab('products');
    } catch (e) {
      console.error(e);
      showToast(e.message || 'Failed to publish listing.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Save Profile Settings
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!vendorName) return;
    setActionLoading(true);
    try {
      const updatedUser = await requestJson(`${serviceRegistry.catalog}/profile`, {
        method: 'PUT',
        body: {
          name: vendorName,
          store_name: shopName,
          avatar_bg: shopAvatarBg
        }
      });
      
      updateUser(updatedUser);
      showToast('Shop configurations saved.');
    } catch (e) {
      console.error(e);
      showToast('Failed to update shop details.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Auto Generate Courier Tracking Number
  const triggerCourierDispatch = (item) => {
    setDispatchItem(item);
    const courierPrefix = courierName.substring(0, 2).toUpperCase();
    const randNum = Math.floor(100000 + Math.random() * 900000);
    setTrackingCode(`${courierPrefix}-${randNum}-LK`);
  };

  // Confirm Dispatch
  const handleConfirmDispatch = (e) => {
    e.preventDefault();
    if (!trackingCode) return;
    
    setDispatchedTrackers(prev => ({
      ...prev,
      [dispatchItem.id]: {
        courier: courierName,
        tracking: trackingCode,
        timestamp: new Date().toLocaleTimeString()
      }
    }));
    
    showToast(`Courier dispatched! Tracker: ${trackingCode}`);
    setDispatchItem(null);
  };

  // Dynamic values calculated from real data
  const stats = useMemo(() => {
    let sales = 0;
    orderItems.forEach(item => {
      sales += parseFloat(item.price) * parseInt(item.quantity);
    });

    const activeListingsCount = products.length;
    const totalOrdersCount = orderItems.length;

    return {
      sales,
      listings: activeListingsCount,
      orders: totalOrdersCount
    };
  }, [products, orderItems]);

  // Preset images matching specific categories
  const imagePresets = [
    { name: 'Mechanical Keyboard (Walnut)', url: '../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png' },
    { name: 'Walnut Desk Organizer', url: '../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png' },
    { name: 'Desk Mat Pro (Cream)', url: '../../Media/product_images/simplist-desk-mat-pro-plus/image-1.png' },
    { name: 'Stealth Black lightbar', url: '../../Media/product_images/mi-computer-monitor-light-bar-black/image-1.jpg' },
    { name: 'Heyo countdown timer', url: '../../Media/product_images/baseus-heyo-rotation-countdown-timer/image-1.jpg' },
    { name: '3-in-1 Charging Dock', url: '../../Media/product_images/baseus-magpro-3-in-1-wireless-charging-station/image-1.png' },
    { name: 'Tablet Stand (Silver)', url: '../../Media/product_images/upergo-tablet-ipad-dock-stand-aluminium-silver/image-1.jpg' }
  ];

  // Visual Product Maker Logic
  const calculatedMakerPrice = useMemo(() => {
    let base = 0;
    if (makerCategory === 'keyboard') {
      base = 32000;
      if (kbBase === 'walnut') base += 10000;
      if (kbBase === 'neon_glass') base += 15000;
      if (kbSwitch === 'silent_brown') base += 2500;
      if (kbKeycaps === 'vaporwave') base += 3500;
      if (kbCable === 'aviator') base += 4000;
    } else if (makerCategory === 'organizer') {
      base = 8500;
      if (orgMaterial === 'walnut') base += 4500;
      if (orgCompartments === '5_slots') base += 2000;
      if (orgCompartments === '7_slots') base += 4500;
      if (orgLining === 'felt') base += 1500;
      if (orgLining === 'leather') base += 3500;
    } else if (makerCategory === 'riser') {
      base = 15000;
      if (riserWood === 'walnut') base += 9000;
      if (riserWood === 'metal') base += 6000;
      if (riserSize === 'dual') base += 8000;
      if (riserDrawer === 'walnut_drawer') base += 4500;
      if (riserDrawer === 'acrylic_drawer') base += 3500;
    }
    return base;
  }, [makerCategory, kbBase, kbSwitch, kbKeycaps, kbCable, orgMaterial, orgCompartments, orgLining, riserWood, riserSize, riserDrawer]);

  const handleGenerateMakerConfig = () => {
    let title = '';
    let description = '';
    let spec = '';
    let vibe = 'minimalist';
    let image = '';
    let categoryName = '';

    if (makerCategory === 'keyboard') {
      categoryName = 'Charging Stations';
      const baseLabel = kbBase === 'walnut' ? 'Walnut' : kbBase === 'matte_black' ? 'Stealth Black' : kbBase === 'white_acrylic' ? 'Minimalist White' : 'Cyberpunk Neon';
      const switchLabel = kbSwitch === 'linear_red' ? 'Linear Red' : kbSwitch === 'clicky_blue' ? 'Tactile Blue' : 'Silent Brown';
      const keycapLabel = kbKeycaps === 'retro_orange' ? 'Retro Grey-Orange' : kbKeycaps === 'stealth_black' ? 'Matte Black' : 'Vaporwave Cyan';
      const cableLabel = kbCable === 'aviator' ? 'Aviator Coiled' : 'Standard USB-C';

      title = `Tech-Hub Custom ${baseLabel} Mechanical Keyboard`;
      description = `A beautifully configured custom mechanical keyboard, boasting a premium ${baseLabel} case and frame. Powered by ${switchLabel} switches and finished with striking ${keycapLabel} keycaps, connected with a high-fidelity ${cableLabel} cable for the ultimate visual desk setup.`;
      spec = `${baseLabel} Plate | ${switchLabel} Switches | ${keycapLabel} Keycaps`;
      
      if (kbBase === 'walnut') vibe = 'walnut';
      else if (kbBase === 'matte_black') vibe = 'black';
      else if (kbBase === 'neon_glass') vibe = 'cyberpunk';
      else vibe = 'minimalist';

      image = '../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png'; // Fallback
    } else if (makerCategory === 'organizer') {
      categoryName = 'Desk Organizers';
      const matLabel = orgMaterial === 'walnut' ? 'Premium Walnut' : orgMaterial === 'cherry' ? 'Cherry Wood' : orgMaterial === 'polymer' ? 'Stealth Matte Black' : 'Cyberpunk Acrylic';
      const compLabel = orgCompartments === '3_slots' ? '3 slots' : orgCompartments === '5_slots' ? '5 slots with phone holder' : '7 slots dual-tier';
      const liningLabel = orgLining === 'felt' ? 'Soft felt lining' : orgLining === 'leather' ? 'Top-grain leather lining' : 'Natural wood grain';

      title = `Tech-Hub Custom ${matLabel} Desk Organizer`;
      description = `Declutter your creative workspace. Handcrafted custom organizer featuring ${compLabel} designed to house stationery, notebooks, and mobile phones, layered with a ${liningLabel} protective base.`;
      spec = `${matLabel} | ${compLabel} | ${orgLining !== 'none' ? liningLabel : 'No Lining'}`;

      if (orgMaterial === 'walnut') vibe = 'walnut';
      else if (orgMaterial === 'polymer') vibe = 'black';
      else if (orgMaterial === 'neon') vibe = 'cyberpunk';
      else vibe = 'minimalist';

      image = '../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png';
    } else if (makerCategory === 'riser') {
      categoryName = 'Monitor Raisers';
      const woodLabel = riserWood === 'walnut' ? 'Solid Walnut' : riserWood === 'cherry' ? 'Cherry Wood' : riserWood === 'metal' ? 'Anodized Aluminum' : 'Frosted White Acrylic';
      const sizeLabel = riserSize === 'single' ? 'Single Display' : 'Ultrawide/Dual Display';
      const drawerLabel = riserDrawer === 'walnut_drawer' ? 'integrated Walnut storage drawers' : riserDrawer === 'acrylic_drawer' ? 'integrated acrylic drawers' : 'open layout';

      title = `Tech-Hub Custom ${woodLabel} Monitor Riser`;
      description = `Ergonomically raise your monitors to eye level. Crafted from ${woodLabel} for ${sizeLabel} workspaces, finished with a beautiful ${drawerLabel} layout to store accessories.`;
      spec = `${woodLabel} Wood | ${sizeLabel} | ${drawerLabel}`;

      if (riserWood === 'walnut') vibe = 'walnut';
      else if (riserWood === 'metal') vibe = 'black';
      else if (riserWood === 'acrylic') vibe = 'minimalist';
      else vibe = 'walnut';

      image = '../../Media/product_images/upergo-premium-walnut-dual-monitor-riser-stand-vd-42t/image-1.png';
    }

    const matchedCat = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    const matchedCatId = matchedCat ? matchedCat.id : (categories.length > 0 ? categories[0].id : 1);

    setGeneratedProduct({
      title,
      description,
      spec,
      vibe,
      image,
      category_id: matchedCatId,
      price: calculatedMakerPrice,
      stock: parseInt(makerStock)
    });
  };

  const handlePublishMakerProduct = async () => {
    if (!generatedProduct) return;
    setActionLoading(true);
    try {
      await requestJson(`${serviceRegistry.catalog}/products`, {
        method: 'POST',
        body: generatedProduct
      });
      showToast('Custom crafted product published to your live store!');
      setGeneratedProduct(null);
      fetchData();
      setActiveTab('products');
    } catch (e) {
      console.error(e);
      showToast(e.message || 'Failed to publish custom product.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProductsList = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = (p.title || p.name || '').toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || (p.category_id && p.category_id.toString() === categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, categoryFilter]);

  return (
    <div className="min-h-screen bg-[#070a13] font-sans text-[#dce3f0] antialiased">
      
      {/* Dynamic Toast Alerts */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-55 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
          toast.type === 'error' 
            ? 'bg-rose-950/80 border-rose-800 text-rose-200' 
            : 'bg-[#0d1527]/90 border-white/[0.08] text-white'
        }`}>
          <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
            toast.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </div>
          <p className="text-xs font-bold tracking-wide">{toast.message}</p>
        </div>
      )}

      {/* Top Banner for Pending Approvals */}
      {user?.status === 'pending' && (
        <div className="bg-[#ffa600]/10 border-b border-[#ffa600]/20 py-2.5 px-6">
          <div className="max-w-[1720px] mx-auto flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#facc15] animate-pulse" />
              <span>
                <strong>Application Verification Pending:</strong> Your shop setup is in progress. Listings are cataloged but invisible to general customers until approved.
              </span>
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-[#ffa600]/10 text-[#facc15] font-black uppercase text-[9px] tracking-widest border border-[#ffa600]/30 animate-pulse">
              Under Review
            </div>
          </div>
        </div>
      )}

      {/* Top Control Bar */}
      <nav className="bg-[#0b1021]/80 border-b border-white/[0.06] py-3.5 px-6 sm:px-10 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl p-2 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-wide">{user?.storeName || 'Tech-Hub Vendor'}</h1>
            <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mt-0.5">Merchant Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-2.5 bg-[#0a0f1d]/60 border border-white/[0.06] px-3.5 py-1.5 rounded-full text-xs">
            <span className={`w-2 h-2 rounded-full ${user?.status === 'pending' ? 'bg-[#facc15] animate-ping' : 'bg-emerald-500'}`} />
            <span className="font-semibold text-slate-350 capitalize">{user?.role} Mode : <strong>{user?.name}</strong></span>
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

      {/* Portal Layout */}
      <div className="flex min-h-[calc(screen-65px)]">
        
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-white/[0.06] bg-[#090e1c]/40 flex flex-col justify-between p-4 shrink-0 hidden lg:flex">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3">Control Dashboard</p>
              <div className="mt-3 space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
                  { id: 'products', label: 'View Products', icon: <LayoutGrid className="w-4 h-4" /> },
                  { id: 'add', label: 'Product Adding', icon: <Plus className="w-4 h-4" /> },
                  { id: 'maker', label: 'Product Making', icon: <Hammer className="w-4 h-4" /> },
                  { id: 'orders', label: 'Order Dispatch', icon: <PackageCheck className="w-4 h-4" /> },
                  { id: 'customize', label: 'Customize Shop', icon: <Settings className="w-4 h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setEditingProduct(null);
                      setGeneratedProduct(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/5'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#12192c]/55 border border-transparent'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shop Public Preview Card */}
            <div className="p-4 rounded-2xl bg-[#0e162b]/60 border border-white/[0.06] space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${shopAvatarBg} flex items-center justify-center text-xs font-black shrink-0`}>
                  {shopName.charAt(0).toUpperCase() || 'S'}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-white truncate">{shopName || 'Unnamed Shop'}</h4>
                  <p className="text-[9px] text-slate-400 font-bold truncate">Live Public Vibe</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-450 leading-relaxed italic line-clamp-2">
                "{shopBio}"
              </p>
              <div className="border-t border-white/[0.04] pt-2.5 flex items-center justify-between text-[9px] font-bold text-slate-400">
                <span>Active Listings:</span>
                <span className="text-blue-400 font-extrabold">{products.length} Items</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-semibold px-3 space-y-1">
            <p>Tech-Hub Platform v2.4.1</p>
            <p>&copy; 2026 Tech-Hub</p>
          </div>
        </aside>

        {/* Tab content area */}
        <main className="flex-1 p-6 sm:p-10 max-w-[1440px] mx-auto overflow-y-auto w-full">
          
          {/* Mobile Tab Select Dropdown */}
          <div className="lg:hidden mb-6">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Select Dashboard Workspace</label>
            <select
              value={activeTab}
              onChange={(e) => {
                setActiveTab(e.target.value);
                setEditingProduct(null);
                setGeneratedProduct(null);
              }}
              className="w-full bg-[#0c1325] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-bold text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="overview">Overview</option>
              <option value="products">View Products</option>
              <option value="add">Product Adding</option>
              <option value="maker">Product Making (Visual config)</option>
              <option value="orders">Order Dispatch</option>
              <option value="customize">Customize Shop</option>
            </select>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Fetching store status...</p>
            </div>
          ) : (
            <>
              {/* 1. TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Greeting */}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Welcome, {user?.name || 'Partner'}</h2>
                    <p className="text-xs font-semibold text-slate-400 mt-1">Here is a summary of your workspace performance and active store inventory.</p>
                  </div>

                  {/* Dynamic Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { label: 'Store Sales (LKR)', val: `LKR ${stats.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: 'Calculated from dynamic orders', icon: <BarChart3 className="w-5 h-5 text-blue-400" /> },
                      { label: 'Active Listings', val: `${stats.listings} Products`, sub: 'Live in platform search', icon: <LayoutGrid className="w-5 h-5 text-indigo-400" /> },
                      { label: 'Orders Received', val: `${stats.orders} items`, sub: 'Placed by customers', icon: <PackageCheck className="w-5 h-5 text-emerald-400" /> }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-[#0c1325]/50 border border-white/[0.08] rounded-2xl p-5 flex items-start justify-between backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors" />
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

                  {/* Summary & Recent Orders */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Catalog Status */}
                    <div className="bg-[#0c1325]/50 border border-white/[0.08] rounded-3xl p-6 space-y-4">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Tag className="w-4 h-4 text-blue-400" />
                        Catalog Diagnostics
                      </h3>
                      <p className="text-xs text-slate-400">Review status updates for your product categories and items listed on the store index.</p>
                      
                      <div className="space-y-3 pt-2">
                        {categories.map((c) => {
                          const catProdCount = products.filter(p => p.category_id === c.id).length;
                          if (catProdCount === 0) return null;
                          return (
                            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                              <span className="text-xs font-bold text-slate-200">{c.name}</span>
                              <span className="text-[10px] font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-blue-400">
                                {catProdCount} active listings
                              </span>
                            </div>
                          );
                        })}
                        {products.length === 0 && (
                          <div className="text-center py-6 text-xs text-slate-500 font-bold">
                            No listings detected. Use Product Adding or Product Making tabs to begin!
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Orders Overview */}
                    <div className="bg-[#0c1325]/50 border border-white/[0.08] rounded-3xl p-6 space-y-4">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-emerald-400" />
                        Recent Purchases
                      </h3>
                      <p className="text-xs text-slate-400">The most recent orders placed for your merchant inventory catalog.</p>
                      
                      <div className="space-y-3 pt-2 max-h-[300px] overflow-y-auto pr-1">
                        {orderItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
                            <div>
                              <p className="font-extrabold text-slate-200">{item.product?.title || 'Unknown Product'}</p>
                              <p className="text-[10px] text-slate-450 mt-0.5">
                                Qty: {item.quantity} | Customer: {item.order?.user?.name || 'Customer'}
                              </p>
                            </div>
                            <span className="font-extrabold text-emerald-400 text-right">
                              LKR {(parseFloat(item.price) * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {orderItems.length === 0 && (
                          <div className="text-center py-8 text-xs text-slate-500 font-bold">
                            No order logs recorded.
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 2. TAB: VIEW PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Active Catalog Listings</h2>
                      <p className="text-xs font-semibold text-slate-400 mt-1">Manage and update price, stock details, or specs for your products.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('add')}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4.5 py-3 rounded-xl transition-all shadow-md active:scale-99 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Listing
                    </button>
                  </div>

                  {/* Filter / Search Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Search bar */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        placeholder="Search product title..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full bg-[#0c1325]/50 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                      />
                    </div>
                    {/* Category filter */}
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full bg-[#0c1325]/50 border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Main Product Table */}
                  <div className="bg-[#0c1325]/50 border border-white/[0.08] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/[0.06] text-slate-450 font-black uppercase tracking-wider text-[9px] bg-white/[0.01]">
                            <th className="p-4">Product Details</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Pricing</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Health Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {filteredProductsList.map((p) => {
                            const matchedCat = categories.find(cat => cat.id === p.category_id);
                            const categoryName = matchedCat ? matchedCat.name : (p.category?.name || p.category || 'Workspace Gear');
                            
                            const stockCount = p.stock || 0;
                            const healthStatus = stockCount > 10 
                              ? { label: 'In Stock', style: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' }
                              : stockCount > 0 
                                ? { label: 'Low Stock', style: 'bg-amber-500/10 border-amber-500/25 text-amber-400' }
                                : { label: 'Out of Stock', style: 'bg-rose-500/10 border-rose-500/25 text-rose-400' };

                            return (
                              <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    {p.image ? (
                                      <img 
                                        src={p.image.startsWith('http') || p.image.startsWith('../') || p.image.startsWith('/') ? p.image : `../../Media/product_images/${p.image}`} 
                                        alt={p.title} 
                                        className="w-10 h-10 rounded-lg object-cover bg-[#090f1d] border border-white/[0.06] shrink-0" 
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/[0.06] flex items-center justify-center shrink-0">
                                        <ShoppingBag className="w-5 h-5 text-slate-500" />
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                      <p className="font-extrabold text-white text-xs sm:text-[13px] truncate max-w-[200px] sm:max-w-xs">{p.title || p.name}</p>
                                      {p.spec && (
                                        <p className="text-[10px] text-slate-400 truncate mt-0.5 max-w-[200px]">{p.spec}</p>
                                      )}
                                      <p className="text-[9px] text-slate-500 mt-0.5">ID: P-{p.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 text-slate-300 font-semibold">{categoryName}</td>
                                <td className="p-4 font-black text-white">LKR {parseFloat(p.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td className="p-4 font-bold text-slate-350">{stockCount} units</td>
                                <td className="p-4">
                                  <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${healthStatus.style}`}>
                                    {healthStatus.label}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-2 shrink-0 whitespace-nowrap">
                                  <button
                                    onClick={() => openEditModal(p)}
                                    className="bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-slate-200 font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition-all"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    disabled={actionLoading}
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="bg-rose-950/40 text-rose-450 border border-rose-900/30 hover:bg-rose-950/80 font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredProductsList.length === 0 && (
                            <tr>
                              <td colSpan="6" className="text-center py-10 text-xs font-semibold text-slate-550">
                                No products found matching criteria.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Inline/Modal Edit Form Drawer */}
                  {editingProduct && (
                    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
                      <div className="bg-[#0d1527] border border-white/[0.08] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div>
                          <h3 className="text-base font-black text-white tracking-tight">Configure Listing details</h3>
                          <p className="text-[11px] text-slate-400 mt-1">Make direct updates to this public catalog entry.</p>
                        </div>
                        
                        <form onSubmit={handleSaveEdit} className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-550 uppercase tracking-widest block">Product Name / Title</label>
                            <input
                              type="text"
                              required
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-550 uppercase tracking-widest block">Price (LKR)</label>
                              <input
                                type="number"
                                required
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-550 uppercase tracking-widest block">Stock Count</label>
                              <input
                                type="number"
                                required
                                value={editStock}
                                onChange={(e) => setEditStock(e.target.value)}
                                className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-550 uppercase tracking-widest block">Specifications / Trim</label>
                            <input
                              type="text"
                              placeholder="e.g. Walnut wood grain | linear switches"
                              value={editSpec}
                              onChange={(e) => setEditSpec(e.target.value)}
                              className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-550 uppercase tracking-widest block">Product Description</label>
                            <textarea
                              rows="3"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                            />
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button 
                              type="submit" 
                              disabled={actionLoading}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              Save Configuration
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingProduct(null)}
                              className="flex-1 bg-white/[0.04] border border-white/[0.06] text-slate-300 font-extrabold text-xs py-3.5 rounded-xl hover:bg-white/[0.08] transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 3. TAB: PRODUCT ADDING */}
              {activeTab === 'add' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Create Listing Catalog</h2>
                    <p className="text-xs font-semibold text-slate-400 mt-1">Configure and publish a new workspace item directly to the online store indexes.</p>
                  </div>

                  <form onSubmit={handleAddProduct} className="bg-[#0c1325]/50 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-5 backdrop-blur-sm">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Product Name / Title <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tech-Hub Premium Desk Organizer"
                        value={addTitle}
                        onChange={(e) => setAddTitle(e.target.value)}
                        className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Price (LKR) <span className="text-rose-500">*</span></label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 14500"
                          value={addPrice}
                          onChange={(e) => setAddPrice(e.target.value)}
                          className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Initial Stock <span className="text-rose-500">*</span></label>
                        <input
                          type="number"
                          required
                          value={addStock}
                          onChange={(e) => setAddStock(e.target.value)}
                          className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Product Category <span className="text-rose-500">*</span></label>
                        <select
                          required
                          value={addCategoryId}
                          onChange={(e) => setAddCategoryId(e.target.value)}
                          className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-blue-500"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Aesthetic Vibe Setting</label>
                        <select
                          value={addVibe}
                          onChange={(e) => setAddVibe(e.target.value)}
                          className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-blue-500"
                        >
                          <option value="minimalist">Minimalist Vibe</option>
                          <option value="walnut">Walnut wood Vibe</option>
                          <option value="black">Stealth Black Vibe</option>
                          <option value="cyberpunk">Cyberpunk Neon Vibe</option>
                          <option value="">No custom theme (none)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Specifications / Trim Detail</label>
                      <input
                        type="text"
                        placeholder="e.g. Dimensions: 30x15cm | Made of pure Oak"
                        value={addSpec}
                        onChange={(e) => setAddSpec(e.target.value)}
                        className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                      />
                    </div>

                    {/* Pre-set Image Chooser */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Product Image Setup</label>
                      <input
                        type="text"
                        placeholder="Paste custom Image URL or select a preset below..."
                        value={addImage}
                        onChange={(e) => setAddImage(e.target.value)}
                        className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                      />
                      <div className="pt-2">
                        <p className="text-[9px] text-slate-400 font-bold mb-2">Preset Images Quick Select:</p>
                        <div className="flex flex-wrap gap-2">
                          {imagePresets.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setAddImage(preset.url);
                                showToast(`Preset "${preset.name}" image URL loaded.`);
                              }}
                              className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.08] text-slate-300 transition-all"
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Store Description</label>
                      <textarea
                        rows="4"
                        placeholder="Describe the product materials, highlights, and custom dimensions..."
                        value={addDescription}
                        onChange={(e) => setAddDescription(e.target.value)}
                        className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                      />
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Publish Catalog entry
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className="flex-1 bg-white/[0.04] border border-white/[0.06] text-slate-300 font-extrabold text-xs py-3.5 rounded-xl hover:bg-white/[0.08] transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 4. TAB: PRODUCT MAKING (VISUAL CONFIGURATOR) */}
              {activeTab === 'maker' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Handcrafted Product Maker</h2>
                    <p className="text-xs font-semibold text-slate-400 mt-1">Configure premium, tailor-made workstation setups and publish items instantly to store shelves.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Options Workbench */}
                    <div className="lg:col-span-7 bg-[#0c1325]/50 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-sm">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Choose Gear category</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'keyboard', label: 'Mechanical Keyboard', icon: <Cpu className="w-4 h-4" /> },
                            { id: 'organizer', label: 'Desk Organizer', icon: <Sliders className="w-4 h-4" /> },
                            { id: 'riser', label: 'Monitor Wood Riser', icon: <Tag className="w-4 h-4" /> }
                          ].map(t => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => {
                                setMakerCategory(t.id);
                                setGeneratedProduct(null);
                              }}
                              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border text-center transition-all ${
                                makerCategory === t.id
                                  ? 'bg-blue-600/10 border-blue-500/40 text-blue-400 font-black shadow-lg shadow-blue-500/5'
                                  : 'bg-[#070a13]/40 border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/[0.1] font-bold'
                              }`}
                            >
                              {t.icon}
                              <span className="text-[10px]">{t.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dynamic options based on Category Selection */}
                      <div className="border-t border-white/[0.04] pt-5 space-y-5">
                        
                        {/* CATEGORY: KEYBOARD OPTIONS */}
                        {makerCategory === 'keyboard' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Base Plate Vibe</label>
                                <select
                                  value={kbBase}
                                  onChange={(e) => { setKbBase(e.target.value); setGeneratedProduct(null); }}
                                  className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-300 focus:outline-none"
                                >
                                  <option value="walnut">Premium Solid Walnut Base (+ LKR 10,000)</option>
                                  <option value="matte_black">Stealth Black Aluminum (+ LKR 8,000)</option>
                                  <option value="white_acrylic">Polar White Frosted Acrylic (+ LKR 5,000)</option>
                                  <option value="neon_glass">Cyberpunk Electroluminescent Glass (+ LKR 15,000)</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Mechanical Switches</label>
                                <select
                                  value={kbSwitch}
                                  onChange={(e) => { setKbSwitch(e.target.value); setGeneratedProduct(null); }}
                                  className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-300 focus:outline-none"
                                >
                                  <option value="linear_red">Gateron Linear Red (Quiet, gaming)</option>
                                  <option value="clicky_blue">Cherry MX Clicky Blue (Typist, crisp)</option>
                                  <option value="silent_brown">Luxe Silent Tactile Brown (+ LKR 2,500)</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Keycap Aesthetics</label>
                                <select
                                  value={kbKeycaps}
                                  onChange={(e) => { setKbKeycaps(e.target.value); setGeneratedProduct(null); }}
                                  className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-300 focus:outline-none"
                                >
                                  <option value="retro_orange">Retro Grey-Orange (Classic workspace)</option>
                                  <option value="stealth_black">Stealth Matte Black (Chamber look)</option>
                                  <option value="vaporwave">Vaporwave Cyan-Magenta Neon (+ LKR 3,500)</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Aviator Coiled Cable</label>
                                <select
                                  value={kbCable}
                                  onChange={(e) => { setKbCable(e.target.value); setGeneratedProduct(null); }}
                                  className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-300 focus:outline-none"
                                >
                                  <option value="standard">Standard Matte USB-C Cable</option>
                                  <option value="aviator">Hand-Coiled Aviator Cable (+ LKR 4,000)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CATEGORY: ORGANIZER OPTIONS */}
                        {makerCategory === 'organizer' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Wood / Shell material</label>
                                <select
                                  value={orgMaterial}
                                  onChange={(e) => { setOrgMaterial(e.target.value); setGeneratedProduct(null); }}
                                  className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-300 focus:outline-none"
                                >
                                  <option value="walnut">Pure Walnut Finish Base (+ LKR 4,500)</option>
                                  <option value="cherry">Rich Cherry Red Wood Base (+ LKR 3,000)</option>
                                  <option value="polymer">Black Fireproof Polymer</option>
                                  <option value="neon">Hexagon Glowing Acrylic (+ LKR 5,000)</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Compartment slots</label>
                                <select
                                  value={orgCompartments}
                                  onChange={(e) => { setOrgCompartments(e.target.value); setGeneratedProduct(null); }}
                                  className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-300 focus:outline-none"
                                >
                                  <option value="3_slots">3 Slots Layout (Sleek, minimalist)</option>
                                  <option value="5_slots">5 Slots with Integrated Stand (+ LKR 2,000)</option>
                                  <option value="7_slots">7 Slots Dual-Tier Master Organizer (+ LKR 4,500)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Internal Lining Protection</label>
                              <select
                                value={orgLining}
                                onChange={(e) => { setOrgLining(e.target.value); setGeneratedProduct(null); }}
                                  className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-300 focus:outline-none"
                              >
                                <option value="none">No Lining (Raw wood finish)</option>
                                <option value="felt">Soft protective felt lining (+ LKR 1,500)</option>
                                <option value="leather">Premium PU Leather Lining (+ LKR 3,500)</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* CATEGORY: RISER OPTIONS */}
                        {makerCategory === 'riser' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Wood Board / Base Trim</label>
                                <select
                                  value={riserWood}
                                  onChange={(e) => { setRiserWood(e.target.value); setGeneratedProduct(null); }}
                                  className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-300 focus:outline-none"
                                >
                                  <option value="walnut">Pure Solid Walnut Board (+ LKR 9,000)</option>
                                  <option value="cherry">Handmade Cherry Wood Board (+ LKR 6,500)</option>
                                  <option value="metal">Anodized matte-black metal Board (+ LKR 6,000)</option>
                                  <option value="acrylic">Minimalist Frosted White Acrylic Base</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Size Dimensions</label>
                                <select
                                  value={riserSize}
                                  onChange={(e) => { setRiserSize(e.target.value); setGeneratedProduct(null); }}
                                  className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-300 focus:outline-none"
                                >
                                  <option value="single">Single Monitor Size</option>
                                  <option value="dual">Ultrawide / Dual Monitor Layout (+ LKR 8,000)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Integrated Drawers</label>
                              <select
                                value={riserDrawer}
                                onChange={(e) => { setRiserDrawer(e.target.value); setGeneratedProduct(null); }}
                                className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-300 focus:outline-none"
                              >
                                <option value="none">Open Storage shelf (no drawers)</option>
                                <option value="walnut_drawer">Integrated Walnut Drawer unit (+ LKR 4,500)</option>
                                <option value="acrylic_drawer">Integrated Acrylic slide drawer (+ LKR 3,500)</option>
                              </select>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Initial Stock</label>
                            <input
                              type="number"
                              value={makerStock}
                              onChange={(e) => { setMakerStock(e.target.value); setGeneratedProduct(null); }}
                              className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-300 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Calculated Price (LKR)</label>
                            <div className="w-full bg-[#070a13]/80 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs font-black text-blue-400">
                              LKR {calculatedMakerPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateMakerConfig}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md active:scale-99"
                      >
                        Generate Configuration & Preview
                      </button>
                    </div>

                    {/* Configuration Live Preview Card */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                      
                      <div className="bg-[#0c1325]/50 border border-white/[0.08] rounded-3xl p-6 backdrop-blur-sm flex-1 flex flex-col justify-between space-y-6">
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Workspace Gear Mockup</p>
                          
                          {generatedProduct ? (
                            <div className="space-y-5">
                              {/* Virtual Render View */}
                              <div className="border border-white/[0.08] rounded-2xl bg-[#070a13] p-5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                                
                                <div className="space-y-4">
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/25 text-[8px] font-black text-blue-400 uppercase tracking-wider">
                                    {generatedProduct.vibe} vibe active
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-black text-white leading-snug">{generatedProduct.title}</h4>
                                    <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Custom Build Serial : #{Math.floor(1000 + Math.random() * 9000)}</p>
                                  </div>

                                  <div className="border-t border-white/[0.04] pt-3 text-[10px] text-slate-400 space-y-1.5 leading-relaxed">
                                    <p><strong>Config Details:</strong> {generatedProduct.spec}</p>
                                    <p className="line-clamp-3 italic text-slate-450 mt-1">"{generatedProduct.description}"</p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1 bg-white/[0.01] border border-white/[0.04] rounded-xl p-3.5">
                                <div className="flex justify-between text-[11px]">
                                  <span className="text-slate-400 font-bold">Configured Price:</span>
                                  <span className="text-white font-black">LKR {generatedProduct.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-[11px] mt-1.5">
                                  <span className="text-slate-400 font-bold">Release Inventory:</span>
                                  <span className="text-white font-black">{generatedProduct.stock} Units</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="border border-dashed border-white/[0.1] rounded-2xl py-14 flex flex-col items-center justify-center text-center px-4 space-y-3">
                              <HelpCircle className="w-8 h-8 text-slate-500" />
                              <div className="space-y-1">
                                <h4 className="text-xs font-black text-slate-350">No Active Configuration</h4>
                                <p className="text-[10px] text-slate-500 leading-normal max-w-xs">Select options and click "Generate Configuration" to view details and check specifications.</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {generatedProduct && (
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={handlePublishMakerProduct}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Publish Custom Gear to Catalog
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* 5. TAB: ORDER DISPATCH */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Order Fulfillment Control</h2>
                    <p className="text-xs font-semibold text-slate-400 mt-1">Review orders containing your products and process courier shipping dispatches.</p>
                  </div>

                  <div className="bg-[#0c1325]/50 border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/[0.06] text-slate-450 font-black uppercase tracking-wider text-[9px] bg-white/[0.01]">
                            <th className="p-4">Fulfillment Details</th>
                            <th className="p-4">Customer Details</th>
                            <th className="p-4">Product Purchased</th>
                            <th className="p-4">Earnings</th>
                            <th className="p-4">Status / Tracking</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {orderItems.map((item) => {
                            const isDispatched = !!dispatchedTrackers[item.id];
                            const tracker = dispatchedTrackers[item.id];

                            return (
                              <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                                <td className="p-4">
                                  <p className="font-extrabold text-white">Order Item ID: #{item.id}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5">Order Ref: #{item.order_id}</p>
                                </td>
                                <td className="p-4">
                                  <p className="font-bold text-slate-200">{item.order?.user?.name || 'Valued Customer'}</p>
                                  <p className="text-[9px] text-slate-400 mt-0.5">{item.order?.user?.email || 'N/A'}</p>
                                </td>
                                <td className="p-4">
                                  <p className="font-extrabold text-slate-300 max-w-[200px] truncate">{item.product?.title || 'Tech-Hub Gear'}</p>
                                  <p className="text-[10px] text-slate-450 mt-0.5">Quantity: {item.quantity} Unit(s)</p>
                                </td>
                                <td className="p-4">
                                  <p className="font-black text-white">LKR {(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                                  <p className="text-[9px] text-slate-550 mt-0.5">LKR {parseFloat(item.price).toLocaleString()} each</p>
                                </td>
                                <td className="p-4">
                                  {isDispatched ? (
                                    <div className="space-y-1">
                                      <span className="inline-flex items-center gap-1 text-[8px] font-black px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 uppercase tracking-widest">
                                        Dispatched
                                      </span>
                                      <p className="text-[9px] font-bold text-slate-400">{tracker.courier}</p>
                                      <p className="text-[9px] text-slate-500">{tracker.tracking}</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <span className="inline-flex items-center gap-1 text-[8px] font-black px-2 py-0.5 rounded bg-[#facc15]/10 border border-[#facc15]/25 text-[#facc15] uppercase tracking-widest">
                                        Awaiting Dispatch
                                      </span>
                                      <p className="text-[9px] text-slate-450">Pending vendor fulfillment</p>
                                    </div>
                                  )}
                                </td>
                                <td className="p-4 text-right">
                                  {isDispatched ? (
                                    <div className="text-[10px] text-slate-500 font-bold flex items-center justify-end gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                      Processed
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => triggerCourierDispatch(item)}
                                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] px-3.5 py-2 rounded-xl transition-all border border-blue-500/20 flex items-center gap-1.5 ml-auto"
                                    >
                                      <Truck className="w-3.5 h-3.5" />
                                      Dispatch Courier
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          {orderItems.length === 0 && (
                            <tr>
                              <td colSpan="6" className="text-center py-10 text-xs font-semibold text-slate-550">
                                No orders found for your shop items yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Dispatch Courier Modal */}
                  {dispatchItem && (
                    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
                      <div className="bg-[#0d1527] border border-white/[0.08] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div>
                          <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                            <Truck className="w-5 h-5 text-blue-400" />
                            Courier Dispatch Setup
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-1">Configure courier details to mark Order #{dispatchItem.id} as shipped.</p>
                        </div>

                        <form onSubmit={handleConfirmDispatch} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-550 uppercase tracking-widest block">Choose Courier Partner</label>
                            <select
                              value={courierName}
                              onChange={(e) => {
                                setCourierName(e.target.value);
                                const prefix = e.target.value.substring(0, 2).toUpperCase();
                                const randNum = Math.floor(100000 + Math.random() * 900000);
                                setTrackingCode(`${prefix}-${randNum}-LK`);
                              }}
                              className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-bold text-slate-350 focus:outline-none focus:border-blue-500"
                            >
                              <option value="DHL Express">DHL Express Partner</option>
                              <option value="Fedex Express">Fedex World Freight</option>
                              <option value="Citypak Courier">Citypak Sri Lanka</option>
                              <option value="Domex Logistics">Domex Logistics Delivery</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-550 uppercase tracking-widest block">Generated Tracking Code</label>
                            <input
                              type="text"
                              required
                              value={trackingCode}
                              onChange={(e) => setTrackingCode(e.target.value)}
                              className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-blue-500 text-blue-400 tracking-wider"
                            />
                          </div>

                          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[10px] text-slate-400 leading-relaxed space-y-1">
                            <p><strong>Courier:</strong> {courierName}</p>
                            <p><strong>Item Title:</strong> {dispatchItem.product?.title}</p>
                            <p><strong>Destination:</strong> Verified Platform Checkout Address</p>
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button
                              type="submit"
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md"
                            >
                              Confirm Shipment
                            </button>
                            <button
                              type="button"
                              onClick={() => setDispatchItem(null)}
                              className="flex-1 bg-white/[0.04] border border-white/[0.06] text-slate-300 font-extrabold text-xs py-3.5 rounded-xl hover:bg-white/[0.08] transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 6. TAB: CUSTOMIZE SHOP */}
              {activeTab === 'customize' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Shop Presentation Customizer</h2>
                    <p className="text-xs font-semibold text-slate-400 mt-1">Configure your public storefront branding, bio, and display colors.</p>
                  </div>

                  <form onSubmit={handleSaveProfile} className="bg-[#0c1325]/50 border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-5 backdrop-blur-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Store Display Name</label>
                        <input
                          type="text"
                          required
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Public Merchant Owner Name</label>
                        <input
                          type="text"
                          required
                          value={vendorName}
                          onChange={(e) => setVendorName(e.target.value)}
                          className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Avatar Theme Color</label>
                      <div className="flex gap-2">
                        {[
                          { label: 'Deep Rose', value: 'bg-rose-600 text-white' },
                          { label: 'Ocean Blue', value: 'bg-blue-600 text-white' },
                          { label: 'Emerald Green', value: 'bg-emerald-600 text-white' },
                          { label: 'Amber Orange', value: 'bg-amber-600 text-white' },
                          { label: 'Stealth Slate', value: 'bg-slate-800 text-white' }
                        ].map((colorOpt) => (
                          <button
                            key={colorOpt.value}
                            type="button"
                            onClick={() => setShopAvatarBg(colorOpt.value)}
                            className={`flex-1 text-[10px] font-bold py-2.5 rounded-lg border transition-all ${
                              shopAvatarBg === colorOpt.value
                                ? 'bg-blue-600/10 border-blue-500/40 text-blue-400'
                                : 'bg-[#070a13] border-white/[0.06] text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span className="inline-block w-2.5 h-2.5 rounded-full mr-1 bg-current" style={{ backgroundColor: colorOpt.value.split(' ')[0].replace('bg-', '') }} />
                            {colorOpt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Shop Bio Description</label>
                      <textarea
                        rows="3"
                        value={shopBio}
                        onChange={(e) => setShopBio(e.target.value)}
                        className="w-full bg-[#070a13] border border-white/[0.08] rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 text-slate-200"
                      />
                    </div>

                    {/* Public preview card mockup */}
                    <div className="pt-2">
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-3">Live Public Preview</p>
                      <div className="bg-[#070a13] border border-white/[0.06] p-4.5 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${shopAvatarBg} flex items-center justify-center font-black text-sm`}>
                            {shopName.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-white leading-none">{shopName || 'Shop Name'}</h4>
                            <p className="text-[10px] text-slate-450 mt-1.5 font-bold flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-blue-400" />
                              Tech-Hub Authorized Merchant ({vendorName})
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[9px] font-black text-emerald-400 uppercase tracking-wider">
                            Verified Store
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Save Store Configurations
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </>
          )}

        </main>
      </div>

    </div>
  );
}
