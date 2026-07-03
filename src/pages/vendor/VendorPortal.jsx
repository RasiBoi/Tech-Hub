import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { requestJson } from '../../services/httpClient';
import { serviceRegistry } from '../../config/serviceRegistry';
import { 
  LogOut, LayoutGrid, Plus, BarChart3, RotateCcw, PackageCheck, 
  AlertCircle, RefreshCw, Cpu, Award, ShoppingBag, Settings, 
  Hammer, Loader2, Search, Edit3, Trash2, CheckCircle2, ChevronRight, Truck,
  Tag, Sliders, Info, ShoppingCart, HelpCircle, Sun, Moon,
  Upload, ImageIcon, X, Users, FileText, Palette, BookOpen
} from 'lucide-react';
import '../../element-ui.css';

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
  const [addImageFile, setAddImageFile] = useState(null);       // File object from <input type="file">
  const [addImagePreview, setAddImagePreview] = useState('');   // Object URL for live preview
  
  // Filter States (View Products)
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Customize Shop State
  const [shopName, setShopName] = useState(user?.storeName || '');
  const [vendorName, setVendorName] = useState(user?.name || '');
  const [shopBio, setShopBio] = useState('Premium workspace accessories & gear.');
  const [shopAvatarBg, setShopAvatarBg] = useState(user?.avatarBg || 'bg-slate-800 text-white');

  // New customization settings states
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [shopTheme, setShopTheme] = useState('element');
  const [companyProfile, setCompanyProfile] = useState('');
  const [policyType, setPolicyType] = useState('text');
  const [policyText, setPolicyText] = useState('');
  const [policyPdfUrl, setPolicyPdfUrl] = useState('');
  const [followersList, setFollowersList] = useState([]);
  const [activeCustomizeSubTab, setActiveCustomizeSubTab] = useState('branding');
  const [uploadingField, setUploadingField] = useState(null); // 'logo' | 'cover' | 'policy'

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
      // Fetch all data in parallel — categories, products, and orders simultaneously
      const [catResult, prodResult, ordersResult] = await Promise.allSettled([
        requestJson(`${serviceRegistry.catalog}/categories`),
        requestJson(`${serviceRegistry.catalog}/products`),
        requestJson(`${serviceRegistry.commerce}/orders`),
      ]);

      if (catResult.status === 'fulfilled' && catResult.value) {
        setCategories(catResult.value);
        if (catResult.value.length > 0 && !addCategoryId) {
          setAddCategoryId(catResult.value[0].id.toString());
        }
      }

      if (prodResult.status === 'fulfilled' && prodResult.value && user?.id) {
        const filteredProds = prodResult.value.filter(
          p => p.vendor_id === user.id || p.vendor?.id === user.id
        );
        setProducts(filteredProds);
      }

      if (ordersResult.status === 'fulfilled' && ordersResult.value) {
        setOrderItems(ordersResult.value);
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
    if (user?.id) {
      fetchSettingsAndFollowers();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user || user.status !== 'pending') return;

    const pollInterval = setInterval(async () => {
      try {
        const profile = await requestJson(`${serviceRegistry.catalog}/me`);
        if (profile && profile.status !== 'pending') {
          updateUser(profile);
          showToast('Your merchant account has been approved! Dashboard unlocked.');
        }
      } catch (e) {
        console.error('Failed to poll user status:', e);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [user?.status, updateUser]);

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
      await requestJson(`${serviceRegistry.catalog}/products/${editingProduct.id}`, {
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
      // Use the file preview URL if a file was chosen, otherwise fall back to the pasted URL
      const resolvedImage =
        addImagePreview ||
        addImage ||
        '../../Media/product_images/baseus-foldable-desktop-phone-stand-portable-and-adjustable-universal-holder-for-phones-tablets-and-ipads/image-1.jpg';

      const payload = {
        title: addTitle,
        description: addDescription || 'Premium handcrafted tech workspace gear.',
        price: parseFloat(addPrice),
        stock: parseInt(addStock),
        category_id: parseInt(addCategoryId),
        spec: addSpec || 'Custom Workstation Accessory',
        vibe: addVibe || null,
        image: resolvedImage,
      };

      await requestJson(`${serviceRegistry.catalog}/products`, {
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
      setAddImageFile(null);
      if (addImagePreview) URL.revokeObjectURL(addImagePreview);
      setAddImagePreview('');

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


  // Load settings and followers
  const fetchSettingsAndFollowers = async () => {
    if (!user || user.role !== 'vendor') return;
    try {
      const settings = await requestJson(`${serviceRegistry.catalog}/vendor/settings`);
      if (settings) {
        setCoverImageUrl(settings.cover_image_url || '');
        setLogoUrl(settings.logo_url || '');
        setShopTheme(settings.shop_theme || 'element');
        setCompanyProfile(settings.company_profile || '');
        setPolicyType(settings.policy_type || 'text');
        setPolicyText(settings.policy_text || '');
        setPolicyPdfUrl(settings.policy_pdf_url || '');
      }

      const followers = await requestJson(`${serviceRegistry.catalog}/vendor/followers`);
      if (followers) {
        setFollowersList(followers);
      }
    } catch (e) {
      console.error('Error fetching settings/followers:', e);
    }
  };

  // Helper function to upload files to backend
  const handleFileUpload = async (file, field) => {
    setUploadingField(field);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('techhub_token');
      const response = await fetch(`${serviceRegistry.catalog}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'File upload failed');
      }
      
      const res = await response.json();
      const uploadedUrl = res.data?.url || res.url;

      if (field === 'logo') {
        setLogoUrl(uploadedUrl);
        showToast('Logo uploaded successfully.');
      } else if (field === 'cover') {
        setCoverImageUrl(uploadedUrl);
        showToast('Cover image uploaded successfully.');
      } else if (field === 'policy') {
        setPolicyPdfUrl(uploadedUrl);
        showToast('Terms & Conditions PDF uploaded successfully.');
      }
    } catch (e) {
      console.error(e);
      showToast(e.message || 'Failed to upload file.', 'error');
    } finally {
      setUploadingField(null);
    }
  };

  // Handle Save Settings (updates profile + vendor settings)
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!vendorName) return;
    setActionLoading(true);
    try {
      // 1. Update basic profile
      const updatedUser = await requestJson(`${serviceRegistry.catalog}/profile`, {
        method: 'PUT',
        body: {
          name: vendorName,
          store_name: shopName,
          avatar_bg: shopAvatarBg
        }
      });
      updateUser(updatedUser);

      // 2. Update vendor settings
      const updatedSettings = await requestJson(`${serviceRegistry.catalog}/vendor/settings`, {
        method: 'PUT',
        body: {
          cover_image_url: coverImageUrl,
          logo_url: logoUrl,
          shop_theme: shopTheme,
          company_profile: companyProfile,
          policy_type: policyType,
          policy_text: policyText,
          policy_pdf_url: policyPdfUrl
        }
      });

      if (updatedSettings) {
        setCoverImageUrl(updatedSettings.cover_image_url || '');
        setLogoUrl(updatedSettings.logo_url || '');
        setShopTheme(updatedSettings.shop_theme || 'element');
        setCompanyProfile(updatedSettings.company_profile || '');
        setPolicyType(updatedSettings.policy_type || 'text');
        setPolicyText(updatedSettings.policy_text || '');
        setPolicyPdfUrl(updatedSettings.policy_pdf_url || '');
      }

      showToast('Shop configurations and interface settings saved successfully!');
    } catch (e) {
      console.error(e);
      showToast(e.message || 'Failed to update shop settings.', 'error');
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
  const handleConfirmDispatch = async (e) => {
    e.preventDefault();
    if (!trackingCode || !dispatchItem) return;
    
    setActionLoading(true);
    try {
      await requestJson(`${serviceRegistry.commerce}/order-items/${dispatchItem.id}/dispatch`, {
        method: 'PUT',
        body: {
          courier_name: courierName,
          tracking_code: trackingCode
        }
      });
      
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
      fetchData();
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to dispatch courier.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Dynamic Telemetry metrics
  const stats = useMemo(() => {
    let sales = 0;
    let totalOrdersCount = 0;
    
    orderItems.forEach(item => {
      // Find matches for this vendor
      if (item.product?.vendor_id === user?.id || item.product?.vendor?.id === user?.id) {
        sales += parseFloat(item.price || 0) * parseInt(item.quantity || 1);
        totalOrdersCount += 1;
      }
    });

    const activeListingsCount = products.length;

    return {
      sales,
      listings: activeListingsCount,
      orders: totalOrdersCount
    };
  }, [products, orderItems, user]);

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
    let chosenCategoryId = 1;

    if (categories.length > 0) {
      chosenCategoryId = categories[0].id;
    }

    if (makerCategory === 'keyboard') {
      categoryName = 'Keyboards';
      const baseLabel = kbBase === 'walnut' ? 'Walnut Wood' : kbBase === 'matte_black' ? 'Stealth Black' : kbBase === 'white_acrylic' ? 'Minimalist White' : 'Cyberpunk Neon';
      const switchLabel = kbSwitch === 'linear_red' ? 'Linear Red' : kbSwitch === 'clicky_blue' ? 'Tactile Blue' : 'Silent Brown';
      const keycapLabel = kbKeycaps === 'retro_orange' ? 'Retro Orange' : kbKeycaps === 'stealth_black' ? 'Stealth Black' : 'Vaporwave';
      const cableLabel = kbCable === 'aviator' ? 'Coiled Aviator Cable' : 'Standard USB-C';
      
      title = `Custom ${baseLabel} Mech Keyboard`;
      description = `A custom-crafted mechanical keyboard built on a premium ${baseLabel} case base. Equipped with high-performance ${switchLabel} switches and premium ${keycapLabel} layout keycaps. Connected via a high-end ${cableLabel} matching workspace aesthetics.`;
      spec = `${switchLabel} switches | ${keycapLabel} caps | ${baseLabel}`;
      vibe = kbBase === 'neon_glass' ? 'cyberpunk' : kbBase === 'walnut' ? 'walnut' : kbBase === 'matte_black' ? 'black' : 'minimalist';
      image = kbBase === 'walnut' 
        ? '../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png' 
        : '../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png';
    } else if (makerCategory === 'organizer') {
      categoryName = 'Desk Organizers';
      const matLabel = orgMaterial === 'walnut' ? 'Walnut wood' : orgMaterial === 'cherry' ? 'Cherry wood' : orgMaterial === 'polymer' ? 'Matte Polymer' : 'Cyberpunk Neon Acrylic';
      const slotsLabel = orgCompartments === '3_slots' ? '3 Slots' : orgCompartments === '5_slots' ? '5 Compartments' : '7 XL Slots';
      const liningLabel = orgLining === 'felt' ? 'wool felt lining' : orgLining === 'leather' ? 'saddle leather padding' : 'unlined base';
      
      title = `Handcrafted ${matLabel} Desk Caddy`;
      description = `An elegant desktop organizer custom configured with ${slotsLabel} to hold workstation accessories. Finished with a premium protective ${liningLabel} to safeguard tools.`;
      spec = `${slotsLabel} | ${matLabel} | ${orgLining !== 'none' ? liningLabel : 'Classic finish'}`;
      vibe = orgMaterial === 'neon' ? 'cyberpunk' : orgMaterial === 'walnut' ? 'walnut' : 'minimalist';
      image = '../../Media/product_images/premium-walnut-desk-organizer-the-c-level-collection/image-1.png';
    } else if (makerCategory === 'riser') {
      categoryName = 'Monitor Stands';
      const woodLabel = riserWood === 'walnut' ? 'Walnut Wood' : riserWood === 'cherry' ? 'Cherry Wood' : riserWood === 'metal' ? 'Anodized Aluminum' : 'Frosted Acrylic';
      const sizeLabel = riserSize === 'single' ? 'Single Monitor' : 'Dual Monitor XL';
      const drawerLabel = riserDrawer === 'none' ? 'open storage slot' : riserDrawer === 'walnut_drawer' ? 'walnut wood storage drawer' : 'frosted acrylic storage drawer';
      
      title = `Premium ${woodLabel} Monitor Riser`;
      description = `An ergonomic workspace addition configured for ${sizeLabel} setups. Made of high-quality ${woodLabel} and integrated with a custom ${drawerLabel} for desktop item storage.`;
      spec = `${sizeLabel} | ${woodLabel} | Drawer: ${riserDrawer}`;
      vibe = riserWood === 'walnut' ? 'walnut' : riserWood === 'acrylic' ? 'cyberpunk' : 'minimalist';
      image = '../../Media/product_images/ugreen-monitor-raiser-stand/image-1.png';
    }

    const matchedCat = categories.find(c => c.name.toLowerCase().includes(categoryName.toLowerCase().substring(0, 5)));
    if (matchedCat) {
      chosenCategoryId = matchedCat.id;
    }

    setGeneratedProduct({
      title,
      description,
      price: calculatedMakerPrice,
      stock: parseInt(makerStock),
      category_id: chosenCategoryId,
      spec,
      vibe,
      image
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

  // Filter vendors list
  const filteredProductsList = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = (p.title || p.name || '').toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || (p.category_id && p.category_id.toString() === categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [products, productSearch, categoryFilter]);

  // Filter orders containing this vendor's products
  const vendorOrdersList = useMemo(() => {
    return orderItems.filter(item => {
      return item.product?.vendor_id === user?.id || item.product?.vendor?.id === user?.id;
    });
  }, [orderItems, user]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      
      {/* Dynamic Toast Alerts */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-55 flex items-center gap-3 px-4 py-3 rounded-lg shadow-md border backdrop-blur-md transition-all duration-300 ${
          toast.type === 'error' 
            ? 'bg-red-50 border-red-200 text-red-800' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
            toast.type === 'error' ? 'bg-red-100 text-red-650' : 'bg-emerald-100 text-emerald-650'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          </div>
          <p className="text-xs font-semibold tracking-wide">{toast.message}</p>
        </div>
      )}

      {/* Top Banner for Pending Approvals */}
      {user?.status === 'pending' && (
        <div className="bg-[#fdf6ec] border-b border-[#faecd8] py-3 px-6 shadow-sm">
          <div className="max-w-[1720px] mx-auto flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#e6a23c] animate-pulse" />
              <span className="text-[#e6a23c] font-medium">
                <strong>Application Verification Pending:</strong> Your shop setup is in progress. Listings are cataloged but invisible to general customers until approved.
              </span>
            </div>
            <div className="px-3 py-0.5 rounded-full bg-[#fdf6ec] text-[#e6a23c] font-bold uppercase text-[9px] tracking-widest border border-[#faecd8] animate-pulse">
              Under Review
            </div>
          </div>
        </div>
      )}

      {/* Top Control Bar */}
      <nav className="bg-white border-b border-slate-200/80 h-16 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 bg-slate-50 shrink-0 shadow-sm">
              <img src={logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="bg-[#409eff] rounded-lg p-2 flex items-center justify-center shadow-sm shadow-[#409eff]/20 shrink-0">
              <Cpu className="w-4 h-4 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">{user?.storeName || 'Tech-Hub Vendor'}</h1>
            <p className="text-[9px] text-[#409eff] font-bold uppercase tracking-wider mt-0.5">Merchant Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-2.5 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs">
            <span className={`w-2 h-2 rounded-full ${user?.status === 'pending' ? 'bg-[#e6a23c] animate-pulse' : 'bg-[#67c23a]'}`} />
            <span className="font-semibold text-slate-600 capitalize">{user?.role} Mode : <strong>{user?.name}</strong></span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-100 hover:bg-red-50 text-slate-650 hover:text-red-650 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border border-slate-200 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            Logout
          </button>
        </div>
      </nav>

      {/* Portal Layout */}
      <div className="flex flex-1 min-h-0">
        
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col justify-between p-5 shrink-0 hidden lg:flex">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3.5 mb-4">Control Dashboard</p>
              <div className="space-y-1.5">
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
              </div>
            </div>

            {/* Shop Public Preview Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2.5">
                {logoUrl ? (
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200/80 bg-slate-50 shrink-0 shadow-sm">
                    <img src={logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`w-8 h-8 rounded-lg ${shopAvatarBg} flex items-center justify-center text-xs font-bold shrink-0 shadow-sm`}>
                    {shopName.charAt(0).toUpperCase() || 'S'}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{shopName || 'Unnamed Shop'}</h4>
                  <p className="text-[9px] text-slate-400 font-bold truncate">Live Public Vibe</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed italic line-clamp-2">
                "{shopBio}"
              </p>
              <div className="border-t border-slate-200 pt-2.5 flex items-center justify-between text-[9px] font-bold text-slate-400">
                <span>Active Listings:</span>
                <span className="text-[#409eff] font-bold">{products.length} Items</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-semibold px-3.5 border-t border-slate-100 pt-3.5 space-y-0.5">
            <p>Tech-Hub Platform v2.4.1</p>
            <p>&copy; 2026 Tech-Hub</p>
          </div>
        </aside>

        {/* Tab content area */}
        <main className="flex-1 p-6 sm:p-8 max-w-[1440px] mx-auto overflow-y-auto w-full">
          
          {/* Mobile Tab Select Dropdown */}
          <div className="lg:hidden mb-6">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Dashboard Workspace</label>
            <div className="el-select">
              <select
                value={activeTab}
                onChange={(e) => {
                  setActiveTab(e.target.value);
                  setEditingProduct(null);
                  setGeneratedProduct(null);
                }}
                className="el-input__inner font-semibold text-slate-700"
              >
                <option value="overview">Overview</option>
                <option value="products">View Products</option>
                <option value="add">Product Adding</option>
                <option value="maker">Product Making (Visual config)</option>
                <option value="orders">Order Dispatch</option>
                <option value="customize">Customize Shop</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-8 h-8 text-[#409eff] animate-spin" />
              <p className="text-xs font-semibold text-slate-400 tracking-wider">Fetching store status...</p>
            </div>
          ) : (
            <>
              {/* 1. TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Greeting */}
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Welcome, {user?.name || 'Partner'}</h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1">Here is a summary of your workspace performance and active store inventory.</p>
                  </div>

                  {/* Dynamic Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { label: 'Store Sales (LKR)', val: `LKR ${stats.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: 'Calculated from dynamic orders', icon: <BarChart3 className="w-5 h-5 text-[#409eff]" />, border: 'border-l-4 border-l-[#409eff]' },
                      { label: 'Active Listings', val: `${stats.listings} Products`, sub: 'Live in platform search', icon: <LayoutGrid className="w-5 h-5 text-[#67c23a]" />, border: 'border-l-4 border-l-[#67c23a]' },
                      { label: 'Orders Received', val: `${stats.orders} items`, sub: 'Placed by customers', icon: <PackageCheck className="w-5 h-5 text-[#e6a23c]" />, border: 'border-l-4 border-l-[#e6a23c]' }
                    ].map((stat, idx) => (
                      <div key={idx} className={`bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between shadow-sm relative overflow-hidden group hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-300 ${stat.border}`}>
                        <div className="space-y-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-none">{stat.val}</h3>
                            <p className="text-[10px] font-semibold text-slate-400 mt-2">{stat.sub}</p>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0 group-hover:scale-115 transition-transform duration-200">
                          {stat.icon}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Recent Orders */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Catalog Status */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#409eff]" />
                        Catalog Diagnostics
                      </h3>
                      <p className="text-xs text-slate-500">Review status updates for your product categories and items listed on the store index.</p>
                      
                      <div className="el-table el-table--border">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr>
                              <th className="py-2 px-4">Category Name</th>
                              <th className="py-2 px-4 text-right">Active Listings</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map((c, idx) => {
                              const catProdCount = products.filter(p => p.category_id === c.id).length;
                              if (catProdCount === 0) return null;
                              return (
                                <tr key={c.id} className={idx % 2 !== 0 ? 'el-table__row--striped' : ''}>
                                  <td className="py-2.5 px-4 font-bold text-slate-800">{c.name}</td>
                                  <td className="py-2.5 px-4 text-right">
                                    <span className="el-tag el-tag--success el-tag--mini font-bold">
                                      {catProdCount} active listings
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                            {products.length === 0 && (
                              <tr>
                                <td colSpan="2" className="text-center py-6 text-xs text-slate-400 font-semibold">
                                  No listings detected. Use Product Adding or Product Making tabs to begin!
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Recent Orders Overview */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-[#67c23a]" />
                        Recent Purchases
                      </h3>
                      <p className="text-xs text-slate-500">The most recent orders placed for your merchant inventory catalog.</p>
                      
                      <div className="el-table el-table--border">
                        <div className="max-h-[300px] overflow-y-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr>
                                <th className="py-2 px-4">Product / Customer</th>
                                <th className="py-2 px-4 text-right">Total Earnings</th>
                              </tr>
                            </thead>
                            <tbody>
                              {vendorOrdersList.map((item, idx) => (
                                <tr key={item.id} className={idx % 2 !== 0 ? 'el-table__row--striped' : ''}>
                                  <td className="py-2.5 px-4">
                                    <div className="font-bold text-slate-800 truncate max-w-[200px]">{item.product?.title || 'Unknown Product'}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                      Qty: {item.quantity} | Customer: {item.order?.user?.name || 'Customer'}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-4 text-right font-bold text-[#67c23a]">
                                    LKR {(parseFloat(item.price) * item.quantity).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                              {vendorOrdersList.length === 0 && (
                                <tr>
                                  <td colSpan="2" className="text-center py-8 text-xs text-slate-400 font-semibold">
                                    No order logs recorded.
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

              {/* 2. TAB: VIEW PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Catalog Listings</h2>
                      <p className="text-xs font-semibold text-slate-500 mt-1">Manage and update price, stock details, or specs for your products.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('add')}
                      className="el-button el-button--primary shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Listing
                    </button>
                  </div>

                  {/* Filter / Search Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Search bar */}
                    <div className="el-input">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-450 absolute left-3 top-2.5 z-10" />
                        <input
                          type="text"
                          placeholder="Search product title..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="el-input__inner pl-9 font-medium"
                        />
                      </div>
                    </div>
                    {/* Category filter */}
                    <div className="el-select">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="el-input__inner font-semibold text-slate-650"
                      >
                        <option value="all">All Categories</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Main Product Table in Element UI table style */}
                  <div className="el-table el-table--border el-table--striped shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr>
                            <th className="py-3 px-5">Product Details</th>
                            <th className="py-3 px-5">Category</th>
                            <th className="py-3 px-5">Pricing</th>
                            <th className="py-3 px-5">Stock</th>
                            <th className="py-3 px-5">Health Status</th>
                            <th className="py-3 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProductsList.map((p, idx) => {
                            const matchedCat = categories.find(cat => cat.id === p.category_id);
                            const categoryName = matchedCat ? matchedCat.name : (p.category?.name || p.category || 'Workspace Gear');
                            
                            const stockCount = p.stock || 0;
                            const healthStatus = stockCount > 10 
                              ? { label: 'In Stock', tagClass: 'el-tag--success' }
                              : stockCount > 0 
                                ? { label: 'Low Stock', tagClass: 'el-tag--warning' }
                                : { label: 'Out of Stock', tagClass: 'el-tag--danger' };

                            return (
                              <tr key={p.id} className={idx % 2 !== 0 ? 'el-table__row--striped' : ''}>
                                <td className="py-4 px-5">
                                  <div className="flex items-center gap-3">
                                    {p.image ? (
                                      <img 
                                        src={p.image.startsWith('http') || p.image.startsWith('../') || p.image.startsWith('/') ? p.image : `../../Media/product_images/${p.image}`} 
                                        alt={p.title} 
                                        className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0" 
                                      />
                                    ) : (
                                      <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                        <ShoppingBag className="w-5 h-5 text-slate-400" />
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                      <p className="font-bold text-slate-900 text-[13px] truncate max-w-[200px] sm:max-w-xs">{p.title || p.name}</p>
                                      {p.spec && (
                                        <p className="text-[10px] text-slate-500 truncate mt-0.5 max-w-[200px]">{p.spec}</p>
                                      )}
                                      <p className="text-[9px] text-slate-400 mt-1 uppercase font-mono tracking-wider">ID: P-{p.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-5 text-slate-650 font-semibold">{categoryName}</td>
                                <td className="py-4 px-5 font-bold text-slate-900">LKR {parseFloat(p.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td className="py-4 px-5 font-semibold text-slate-650">{stockCount} units</td>
                                <td className="py-4 px-5">
                                  <span className={`el-tag uppercase ${healthStatus.tagClass}`}>
                                    <span className="el-tag__dot" />
                                    {healthStatus.label}
                                  </span>
                                </td>
                                <td className="py-4 px-5 text-right">
                                  <div className="inline-flex gap-2 justify-end items-center">
                                    <button
                                      onClick={() => openEditModal(p)}
                                      className="el-button el-button--primary el-button--mini shadow-sm"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      disabled={actionLoading}
                                      onClick={() => handleDeleteProduct(p.id)}
                                      className="el-button el-button--danger el-button--mini is-plain shadow-sm"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredProductsList.length === 0 && (
                            <tr>
                              <td colSpan="6" className="text-center py-12 text-xs font-semibold text-slate-400">
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
                    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 max-w-lg w-full shadow-lg relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 tracking-tight">Configure Listing details</h3>
                          <p className="text-[11px] text-slate-500 mt-1">Make direct updates to this public catalog entry.</p>
                        </div>
                        
                        <form onSubmit={handleSaveEdit} className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block">Product Name / Title</label>
                            <div className="el-input">
                              <input
                                type="text"
                                required
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="el-input__inner font-medium"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block">Price (LKR)</label>
                              <div className="el-input">
                                <input
                                  type="number"
                                  required
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                  className="el-input__inner font-medium"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block">Stock Count</label>
                              <div className="el-input">
                                <input
                                  type="number"
                                  required
                                  value={editStock}
                                  onChange={(e) => setEditStock(e.target.value)}
                                  className="el-input__inner font-medium"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block">Specifications / Trim</label>
                            <div className="el-input">
                              <input
                                type="text"
                                placeholder="e.g. Walnut wood grain | linear switches"
                                value={editSpec}
                                onChange={(e) => setEditSpec(e.target.value)}
                                className="el-input__inner font-medium"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block">Product Description</label>
                            <textarea
                              rows="3"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="el-input__inner h-auto py-2 font-medium"
                            />
                          </div>

                          <div className="flex gap-3 pt-3">
                            <button 
                              type="submit" 
                              disabled={actionLoading}
                              className="flex-1 el-button el-button--primary shadow-sm"
                            >
                              {actionLoading && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                              Save Configuration
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingProduct(null)}
                              className="flex-1 el-button is-plain"
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
                <div className="space-y-6">

                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 border border-blue-100">
                          <Plus className="w-4 h-4 text-[#409eff]" />
                        </span>
                        New Product Listing
                      </h2>
                      <p className="text-xs font-medium text-slate-500 mt-1 ml-9.5">
                        Fill in the details below and publish your product directly to the live store catalog.
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Catalog
                    </span>
                  </div>

                  <form onSubmit={handleAddProduct} className="space-y-5">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

                      {/* ─── LEFT COLUMN: Image Upload ─── */}
                      <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Product Image</p>

                            {/* Upload Zone */}
                            <div
                              className="relative group"
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (file && file.type.startsWith('image/')) {
                                  setAddImageFile(file);
                                  if (addImagePreview) URL.revokeObjectURL(addImagePreview);
                                  setAddImagePreview(URL.createObjectURL(file));
                                  setAddImage('');
                                }
                              }}
                            >
                              {/* Preview or placeholder */}
                              <div className={`w-full aspect-square rounded-xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all duration-200 ${
                                addImagePreview || addImage
                                  ? 'border-transparent'
                                  : 'border-slate-200 bg-slate-50 group-hover:border-[#409eff] group-hover:bg-blue-50/30'
                              }`}>
                                {addImagePreview ? (
                                  <img
                                    src={addImagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                ) : addImage ? (
                                  <img
                                    src={addImage}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                ) : (
                                  <div className="flex flex-col items-center gap-3 px-4 py-8 text-center select-none pointer-events-none">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                                      <ImageIcon className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-slate-500">Drag & drop image here</p>
                                      <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 10 MB</p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Clear button when preview active */}
                              {(addImagePreview || addImage) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (addImagePreview) URL.revokeObjectURL(addImagePreview);
                                    setAddImagePreview('');
                                    setAddImageFile(null);
                                    setAddImage('');
                                  }}
                                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 border border-slate-200 shadow-sm flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-slate-500 transition-all"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* File chooser button */}
                            <label className="mt-3 flex items-center justify-center gap-2 w-full cursor-pointer el-button el-button--primary is-plain el-button--small shadow-sm">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Choose File</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setAddImageFile(file);
                                    if (addImagePreview) URL.revokeObjectURL(addImagePreview);
                                    setAddImagePreview(URL.createObjectURL(file));
                                    setAddImage('');
                                  }
                                }}
                              />
                            </label>

                            {/* OR divider */}
                            <div className="flex items-center gap-2 my-3">
                              <div className="flex-1 h-px bg-slate-100" />
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">or paste URL</span>
                              <div className="flex-1 h-px bg-slate-100" />
                            </div>

                            <div className="el-input">
                              <input
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                value={addImage}
                                onChange={(e) => {
                                  setAddImage(e.target.value);
                                  // Clear file when URL is typed
                                  if (addImagePreview) URL.revokeObjectURL(addImagePreview);
                                  setAddImagePreview('');
                                  setAddImageFile(null);
                                }}
                                className="el-input__inner font-medium text-xs"
                              />
                            </div>
                          </div>

                          {/* Preset thumbnails */}
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Quick Presets</p>
                            <div className="grid grid-cols-3 gap-1.5">
                              {imagePresets.map((preset, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  title={preset.name}
                                  onClick={() => {
                                    setAddImage(preset.url);
                                    if (addImagePreview) URL.revokeObjectURL(addImagePreview);
                                    setAddImagePreview('');
                                    setAddImageFile(null);
                                  }}
                                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                                    addImage === preset.url
                                      ? 'border-[#409eff] shadow-md shadow-blue-100'
                                      : 'border-transparent hover:border-slate-300'
                                  }`}
                                >
                                  <img
                                    src={preset.url}
                                    alt={preset.name}
                                    className="w-full h-full object-cover bg-slate-100"
                                    onError={(e) => {
                                      e.target.parentNode.innerHTML = `<div class="w-full h-full bg-slate-100 flex items-center justify-center text-[8px] text-slate-400 font-semibold p-1 text-center">${preset.name}</div>`;
                                    }}
                                  />
                                  {addImage === preset.url && (
                                    <div className="absolute inset-0 bg-[#409eff]/20 flex items-center justify-center">
                                      <CheckCircle2 className="w-4 h-4 text-[#409eff]" />
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ─── RIGHT COLUMN: Product Details ─── */}
                      <div className="lg:col-span-2 space-y-4">

                        {/* Section: Core Details */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
                            Core Details
                          </p>

                          {/* Product Title */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-600 tracking-wide block">
                              Product Name / Title <span className="text-rose-500">*</span>
                            </label>
                            <div className="el-input">
                              <input
                                type="text"
                                required
                                placeholder="e.g. Tech-Hub Premium Walnut Desk Organizer"
                                value={addTitle}
                                onChange={(e) => setAddTitle(e.target.value)}
                                className="el-input__inner font-medium"
                              />
                            </div>
                          </div>

                          {/* Price + Stock */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-600 tracking-wide block">
                                Price (LKR) <span className="text-rose-500">*</span>
                              </label>
                              <div className="el-input relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">Rs.</span>
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  step="0.01"
                                  placeholder="14500"
                                  value={addPrice}
                                  onChange={(e) => setAddPrice(e.target.value)}
                                  className="el-input__inner font-medium pl-10"
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-600 tracking-wide block">
                                Initial Stock <span className="text-rose-500">*</span>
                              </label>
                              <div className="el-input relative">
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  value={addStock}
                                  onChange={(e) => setAddStock(e.target.value)}
                                  className="el-input__inner font-medium"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">units</span>
                              </div>
                            </div>
                          </div>

                          {/* Category + Vibe */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-600 tracking-wide block">
                                Category <span className="text-rose-500">*</span>
                              </label>
                              <div className="el-select">
                                <select
                                  required
                                  value={addCategoryId}
                                  onChange={(e) => setAddCategoryId(e.target.value)}
                                  className="el-input__inner font-semibold text-slate-700"
                                >
                                  <option value="">Select category…</option>
                                  {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-600 tracking-wide block">Aesthetic Vibe</label>
                              <div className="el-select">
                                <select
                                  value={addVibe}
                                  onChange={(e) => setAddVibe(e.target.value)}
                                  className="el-input__inner font-semibold text-slate-700"
                                >
                                  <option value="minimalist">🎨 Minimalist</option>
                                  <option value="walnut">🪵 Walnut Wood</option>
                                  <option value="black">🖤 Stealth Black</option>
                                  <option value="cyberpunk">🌐 Cyberpunk Neon</option>
                                  <option value="">— No Theme</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section: Specifications */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
                            Specifications & Description
                          </p>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-600 tracking-wide block">Specifications / Trim Detail</label>
                            <div className="el-input">
                              <input
                                type="text"
                                placeholder="e.g. Dimensions: 30×15 cm | Pure Oak Wood | Anti-slip base"
                                value={addSpec}
                                onChange={(e) => setAddSpec(e.target.value)}
                                className="el-input__inner font-medium"
                              />
                            </div>
                            <p className="text-[10px] text-slate-400">Separate attributes with a pipe  |  character.</p>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-600 tracking-wide block">Store Description</label>
                            <textarea
                              rows="5"
                              placeholder="Describe the product materials, unique highlights, ergonomic benefits, and custom dimensions…"
                              value={addDescription}
                              onChange={(e) => setAddDescription(e.target.value)}
                              className="el-input__inner h-auto py-3 font-medium resize-none w-full"
                            />
                          </div>
                        </div>

                        {/* Action Footer */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                          <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                            Your listing will be live immediately after publishing.
                          </p>
                          <div className="flex gap-3 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => setActiveTab('products')}
                              className="flex-1 sm:flex-none el-button is-plain px-5"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={actionLoading}
                              className="flex-1 sm:flex-none el-button el-button--primary shadow-sm px-8 font-bold"
                            >
                              {actionLoading
                                ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin inline" />Publishing…</>
                                : <><Plus className="w-3.5 h-3.5 mr-1.5 inline" />Publish Listing</>
                              }
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </form>
                </div>
              )}



              {/* 4. TAB: PRODUCT MAKING (VISUAL CONFIGURATOR) */}
              {activeTab === 'maker' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Handcrafted Product Maker</h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1">Configure premium, tailor-made workstation setups and publish items instantly to store shelves.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Visual configurator controls */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-6 shadow-sm">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Product Type</h3>
                        <div className="flex gap-2.5 mt-3.5">
                          {[
                            { id: 'keyboard', label: 'Mechanical Keyboard', desc: 'Custom mechanical switches & caps' },
                            { id: 'organizer', label: 'Desk Caddy', desc: 'Handcrafted accessory trays' },
                            { id: 'riser', label: 'Monitor Stand Riser', desc: 'Ergonomic dual/single risers' }
                          ].map((catOption) => (
                            <button
                              key={catOption.id}
                              type="button"
                              onClick={() => {
                                setMakerCategory(catOption.id);
                                setGeneratedProduct(null);
                              }}
                              className={`flex-1 p-3.5 rounded-xl border text-left transition-all ${
                                makerCategory === catOption.id
                                  ? 'border-[#409eff] bg-blue-50/20 text-[#409eff] shadow-sm'
                                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-650'
                              }`}
                            >
                              <span className="block text-xs font-bold">{catOption.label}</span>
                              <span className="block text-[9px] text-slate-400 mt-1 font-medium leading-relaxed">{catOption.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Options dynamic fields */}
                      <div className="space-y-5">
                        <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest">Configuration Specifications</h3>

                        {makerCategory === 'keyboard' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Case Base Material</label>
                              <div className="el-select">
                                <select value={kbBase} onChange={(e) => { setKbBase(e.target.value); setGeneratedProduct(null); }} className="el-input__inner font-semibold text-slate-650">
                                  <option value="walnut">Solid Walnut wood (LKR +10,000)</option>
                                  <option value="matte_black">Anodized Stealth Black (LKR +0)</option>
                                  <option value="white_acrylic">Frosted White Acrylic (LKR +0)</option>
                                  <option value="neon_glass">Handmade Cyber Neon Glass (LKR +15,000)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mechanical Switch Profile</label>
                              <div className="el-select">
                                <select value={kbSwitch} onChange={(e) => { setKbSwitch(e.target.value); setGeneratedProduct(null); }} className="el-input__inner font-semibold text-slate-650">
                                  <option value="silent_brown">Silent Tactile Browns (LKR +2,500)</option>
                                  <option value="linear_red">Ultra-fast Linear Reds (LKR +0)</option>
                                  <option value="clicky_blue">Classic Tactile Clicky Blues (LKR +0)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Keycap Aesthetics Layout</label>
                              <div className="el-select">
                                <select value={kbKeycaps} onChange={(e) => { setKbKeycaps(e.target.value); setGeneratedProduct(null); }} className="el-input__inner font-semibold text-slate-650">
                                  <option value="retro_orange">Retro Orange Classic (LKR +0)</option>
                                  <option value="stealth_black">Stealth Black Minimal (LKR +0)</option>
                                  <option value="vaporwave">Vaporwave Neon PBT (LKR +3,500)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">USB Cable Layout</label>
                              <div className="el-select">
                                <select value={kbCable} onChange={(e) => { setKbCable(e.target.value); setGeneratedProduct(null); }} className="el-input__inner font-semibold text-slate-650">
                                  <option value="standard">Standard Black USB-C (LKR +0)</option>
                                  <option value="aviator">Custom Coiled Cable with Aviator connector (LKR +4,000)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {makerCategory === 'organizer' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Material Composition</label>
                              <div className="el-select">
                                <select value={orgMaterial} onChange={(e) => { setOrgMaterial(e.target.value); setGeneratedProduct(null); }} className="el-input__inner font-semibold text-slate-650">
                                  <option value="walnut">Premium Walnut Wood (LKR +4,500)</option>
                                  <option value="cherry">Rich Cherry Wood (LKR +0)</option>
                                  <option value="polymer">Impact Matte Polymer (LKR +0)</option>
                                  <option value="neon">Cyberpunk Neon Acrylic (LKR +0)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tray Compartments</label>
                              <div className="el-select">
                                <select value={orgCompartments} onChange={(e) => { setOrgCompartments(e.target.value); setGeneratedProduct(null); }} className="el-input__inner font-semibold text-slate-650">
                                  <option value="3_slots">3 Slots Layout (LKR +0)</option>
                                  <option value="5_slots">5 Slots layout (LKR +2,000)</option>
                                  <option value="7_slots">7 XL Organizer slots (LKR +4,500)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Internal Slot Lining</label>
                              <div className="el-select">
                                <select value={orgLining} onChange={(e) => { setOrgLining(e.target.value); setGeneratedProduct(null); }} className="el-input__inner font-semibold text-slate-650">
                                  <option value="felt">Premium Wool Felt (LKR +1,500)</option>
                                  <option value="leather">Luxury Saddle Leather (LKR +3,500)</option>
                                  <option value="none">No lining (wooden base) (LKR +0)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {makerCategory === 'riser' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ergonomic Riser Wood</label>
                              <div className="el-select">
                                <select value={riserWood} onChange={(e) => { setRiserWood(e.target.value); setGeneratedProduct(null); }} className="el-input__inner font-semibold text-slate-650">
                                  <option value="walnut">American Walnut (LKR +9,000)</option>
                                  <option value="cherry">Rich Wild Cherry (LKR +0)</option>
                                  <option value="metal">Space Gray Aluminum (LKR +6,000)</option>
                                  <option value="acrylic">Frosted Cyberpunk Acrylic (LKR +0)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ergonomic Width</label>
                              <div className="el-select">
                                <select value={riserSize} onChange={(e) => { setRiserSize(e.target.value); setGeneratedProduct(null); }} className="el-input__inner font-semibold text-slate-650">
                                  <option value="single">Single Monitor Stand (LKR +0)</option>
                                  <option value="dual">Dual Monitor stand XL (LKR +8,000)</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Integrated Drawer Slot</label>
                              <div className="el-select">
                                <select value={riserDrawer} onChange={(e) => { setRiserDrawer(e.target.value); setGeneratedProduct(null); }} className="el-input__inner font-semibold text-slate-650">
                                  <option value="none">No Drawer (open shelf) (LKR +0)</option>
                                  <option value="walnut_drawer">Matching Wooden Drawer (LKR +4,500)</option>
                                  <option value="acrylic_drawer">Frosted Acrylic Drawer (LKR +3,500)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Stock Quantity</label>
                          <div className="el-input">
                            <input
                              type="number"
                              value={makerStock}
                              onChange={(e) => { setMakerStock(e.target.value); setGeneratedProduct(null); }}
                              className="el-input__inner font-medium"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Production Cost</p>
                          <h4 className="text-xl font-bold text-[#67c23a] mt-1">LKR {calculatedMakerPrice.toLocaleString()}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={handleGenerateMakerConfig}
                          className="el-button el-button--primary shadow-sm"
                        >
                          Generate Specifications
                        </button>
                      </div>
                    </div>

                    {/* Generator Preview Output Panel */}
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest border-b border-slate-100 pb-2">Specification Output</h3>

                        {generatedProduct ? (
                          <div className="space-y-4">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                              <h4 className="text-sm font-bold text-slate-800 leading-snug">{generatedProduct.title}</h4>
                              <p className="text-[11px] text-slate-500 leading-relaxed italic">"{generatedProduct.description}"</p>
                              
                              <div className="border-t border-slate-200/60 pt-2 space-y-1 text-[10px] font-semibold text-slate-450">
                                <p>Pricing: <span className="text-slate-850">LKR {generatedProduct.price.toLocaleString()}</span></p>
                                <p>Initial Stock: <span className="text-slate-850">{generatedProduct.stock} Units</span></p>
                                <p>Specs: <span className="text-slate-850">{generatedProduct.spec}</span></p>
                                <p>Theme: <span className="text-slate-850 capitalize">{generatedProduct.vibe || 'N/A'}</span></p>
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={actionLoading}
                              onClick={handlePublishMakerProduct}
                              className="w-full el-button el-button--success shadow-sm flex items-center justify-center gap-1.5"
                            >
                              {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                              Publish Configured Listing
                            </button>
                          </div>
                        ) : (
                          <div className="py-14 text-center text-slate-400 font-semibold text-xs leading-relaxed space-y-2">
                            <Sliders className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p>Configure custom specifications</p>
                            <p className="text-[10px] font-medium text-slate-400">Press "Generate Specifications" to compile listings data.</p>
                          </div>
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
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Order Fulfillment Control</h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1">Review orders containing your products and process courier shipping dispatches.</p>
                  </div>

                  <div className="el-table el-table--border el-table--striped shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr>
                            <th className="py-3 px-5">Fulfillment Details</th>
                            <th className="py-3 px-5">Customer Details</th>
                            <th className="py-3 px-5">Product Purchased</th>
                            <th className="py-3 px-5">Earnings</th>
                            <th className="py-3 px-5">Status / Tracking</th>
                            <th className="py-3 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vendorOrdersList.map((item, idx) => {
                            const isDispatched = item.status === 'dispatched' || !!dispatchedTrackers[item.id];
                            const tracker = item.status === 'dispatched' 
                              ? { courier: item.courier_name, tracking: item.tracking_code }
                              : dispatchedTrackers[item.id];

                            return (
                              <tr key={item.id} className={idx % 2 !== 0 ? 'el-table__row--striped' : ''}>
                                <td className="py-4 px-5">
                                  <p className="font-bold text-slate-900">Order Item ID: #{item.id}</p>
                                  <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-wider">Ref: #{item.order_id}</p>
                                </td>
                                <td className="py-4 px-5">
                                  <p className="font-semibold text-slate-700">{item.order?.user?.name || 'Valued Customer'}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{item.order?.user?.email || 'N/A'}</p>
                                </td>
                                <td className="py-4 px-5">
                                  <p className="font-bold text-slate-800 max-w-[200px] truncate">{item.product?.title || 'Tech-Hub Gear'}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5">Quantity: {item.quantity} Unit(s)</p>
                                </td>
                                <td className="py-4 px-5">
                                  <p className="font-bold text-[#67c23a]">LKR {(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                                  <p className="text-[9px] text-slate-450 mt-0.5">LKR {parseFloat(item.price).toLocaleString()} each</p>
                                </td>
                                <td className="py-4 px-5">
                                  {isDispatched ? (
                                    <div className="space-y-1">
                                      <span className="el-tag el-tag--success el-tag--mini uppercase tracking-wider font-bold">
                                        Dispatched
                                      </span>
                                      <p className="text-[9px] font-bold text-slate-500">{tracker.courier}</p>
                                      <p className="text-[9px] text-slate-400 font-mono">{tracker.tracking}</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-1">
                                      <span className="el-tag el-tag--warning el-tag--mini uppercase tracking-wider font-bold">
                                        Awaiting Dispatch
                                      </span>
                                      <p className="text-[9px] text-slate-450">Pending vendor fulfillment</p>
                                    </div>
                                  )}
                                </td>
                                <td className="py-4 px-5 text-right">
                                  {isDispatched ? (
                                    <div className="text-[10px] text-slate-400 font-bold flex items-center justify-end gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                      Processed
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => triggerCourierDispatch(item)}
                                      className="el-button el-button--primary el-button--mini shadow-sm flex items-center gap-1.5 ml-auto"
                                    >
                                      <Truck className="w-3.5 h-3.5" />
                                      Dispatch Courier
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          {vendorOrdersList.length === 0 && (
                            <tr>
                              <td colSpan="6" className="text-center py-10 text-xs font-semibold text-slate-400">
                                No customer orders recorded.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Dispatch Courier Dialog Modal */}
                  {dispatchItem && (
                    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-lg relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 tracking-tight">Fulfill Order Item #{dispatchItem.id}</h3>
                          <p className="text-[11px] text-slate-500 mt-1">Assign a logistics partner and tracking code to dispatch shipment.</p>
                        </div>

                        <form onSubmit={handleConfirmDispatch} className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block">Courier Logistics Service</label>
                            <div className="el-select">
                              <select 
                                value={courierName} 
                                onChange={(e) => setCourierName(e.target.value)} 
                                className="el-input__inner font-semibold text-slate-650"
                              >
                                <option value="DHL Express">DHL Express Courier</option>
                                <option value="FedEx Ground">FedEx International</option>
                                <option value="Sri Lanka Post">Sri Lanka Post Registered</option>
                                <option value="Pronto Lanka">Pronto Domestic</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-455 uppercase tracking-widest block">Waybill / Tracking Code</label>
                            <div className="el-input">
                              <input
                                type="text"
                                required
                                value={trackingCode}
                                onChange={(e) => setTrackingCode(e.target.value)}
                                className="el-input__inner font-mono font-medium"
                              />
                            </div>
                          </div>

                          <div className="flex gap-3 pt-3">
                            <button 
                              type="submit" 
                              className="flex-1 el-button el-button--primary shadow-sm"
                            >
                              Fulfill Dispatch
                            </button>
                            <button
                              type="button"
                              onClick={() => setDispatchItem(null)}
                              className="flex-1 el-button is-plain"
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
                <div className="max-w-4xl mx-auto space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Shop Configurations</h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1">Customize public profile settings, aesthetic branding, upload policies, and view followers.</p>
                  </div>

                  {/* Sub-tabs menu */}
                  <div className="flex border-b border-slate-200/80 bg-white rounded-t-xl px-4 pt-2 gap-2 shadow-sm">
                    {[
                      { id: 'branding', label: 'Branding & Theme', icon: <Palette className="w-4 h-4" /> },
                      { id: 'profile', label: 'Company Profile', icon: <BookOpen className="w-4 h-4" /> },
                      { id: 'policies', label: 'Store Policies', icon: <FileText className="w-4 h-4" /> },
                      { id: 'followers', label: 'Shop Followers', icon: <Users className="w-4 h-4" /> }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveCustomizeSubTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 -mb-px ${
                          activeCustomizeSubTab === tab.id
                            ? 'border-[#409eff] text-[#409eff] font-black'
                            : 'border-transparent text-slate-650 hover:text-slate-900 hover:border-slate-200'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                        {tab.id === 'followers' && followersList.length > 0 && (
                          <span className="bg-blue-100 text-[#409eff] px-2.5 py-0.5 rounded-full text-[9px] font-black">
                            {followersList.length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 border-t-0 rounded-b-xl p-6 sm:p-8 space-y-6 shadow-sm">
                    {/* SUBTAB: BRANDING & THEME */}
                    {activeCustomizeSubTab === 'branding' && (
                      <div className="space-y-6 animate-in fade-in duration-200">
                        {/* Cover Image Upload */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cover Banner Image</label>
                          <div className="relative h-48 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group flex items-center justify-center">
                            {coverImageUrl ? (
                              <img src={coverImageUrl} alt="Cover Banner" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-center text-slate-400">
                                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                <p className="text-xs font-semibold">No cover image uploaded</p>
                              </div>
                            )}
                            {uploadingField === 'cover' && (
                              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold">
                                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Uploading Cover...
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <label className="flex items-center gap-1.5 cursor-pointer el-button el-button--primary is-plain el-button--small shadow-sm">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{coverImageUrl ? 'Change Banner' : 'Upload Banner'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => {
                                  if (e.target.files[0]) handleFileUpload(e.target.files[0], 'cover');
                                }}
                              />
                            </label>
                            {coverImageUrl && (
                              <button
                                type="button"
                                onClick={() => setCoverImageUrl('')}
                                className="el-button el-button--danger is-plain el-button--small shadow-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Logo Upload */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Shop Logo</label>
                          <div className="flex items-center gap-5">
                            <div className="relative w-20 h-20 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                              {logoUrl ? (
                                <img src={logoUrl} alt="Shop Logo" className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-[20px] font-black text-slate-300">
                                  {shopName ? shopName.charAt(0).toUpperCase() : 'S'}
                                </div>
                              )}
                              {uploadingField === 'logo' && (
                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-white">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                </div>
                              )}
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex gap-2">
                                <label className="flex items-center gap-1.5 cursor-pointer el-button el-button--primary is-plain el-button--small shadow-sm">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>{logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={(e) => {
                                      if (e.target.files[0]) handleFileUpload(e.target.files[0], 'logo');
                                    }}
                                  />
                                </label>
                                {logoUrl && (
                                  <button
                                    type="button"
                                    onClick={() => setLogoUrl('')}
                                    className="el-button el-button--danger is-plain el-button--small shadow-sm"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400">Square layout recommended (PNG or JPG).</p>
                            </div>
                          </div>
                        </div>

                        {/* Shop Theme */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Shop Theme Profile</label>
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                            {[
                              { id: 'element', name: 'Element Blue', class: 'bg-[#409eff] text-white', desc: 'Modern and professional' },
                              { id: 'walnut', name: 'Walnut Dark', class: 'bg-[#1e293b] text-white', desc: 'Cozy and warm wood aesthetic' },
                              { id: 'forest', name: 'Forest Green', class: 'bg-[#67c23a] text-white', desc: 'Organic and earthy vibe' },
                              { id: 'amber', name: 'Amber Glow', class: 'bg-[#e6a23c] text-white', desc: 'Premium workspace accent' },
                              { id: 'rose', name: 'Rose Petal', class: 'bg-[#f56c6c] text-white', desc: 'Warm and vibrant styling' }
                            ].map((themeOpt) => (
                              <button
                                key={themeOpt.id}
                                type="button"
                                onClick={() => {
                                  setShopTheme(themeOpt.id);
                                  // Map theme to avatar bg for backwards compatibility
                                  setShopAvatarBg(themeOpt.class);
                                  showToast(`Shop theme selected: ${themeOpt.name}`);
                                }}
                                className={`p-3 text-[10px] rounded-lg border text-left flex flex-col justify-between transition-all ${
                                  shopTheme === themeOpt.id
                                    ? 'border-[#409eff] bg-blue-50/10 shadow-sm shadow-[#409eff]/15 scale-102 ring-1 ring-[#409eff]'
                                    : 'border-slate-200 bg-white hover:border-slate-350'
                                }`}
                              >
                                <span className="flex items-center font-bold text-slate-800">
                                  <span className={`inline-block w-2 h-2 rounded-full ${themeOpt.class.split(' ')[0]} mr-1.5`} />
                                  {themeOpt.name.split(' ')[0]}
                                </span>
                                <span className="block text-[8px] text-slate-400 mt-1 leading-snug">{themeOpt.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUBTAB: COMPANY PROFILE */}
                    {activeCustomizeSubTab === 'profile' && (
                      <div className="space-y-5 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Public Store Name</label>
                            <div className="el-input">
                              <input
                                type="text"
                                required
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                className="el-input__inner font-medium text-xs"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Merchant Manager Name</label>
                            <div className="el-input">
                              <input
                                type="text"
                                required
                                value={vendorName}
                                onChange={(e) => setVendorName(e.target.value)}
                                className="el-input__inner font-medium text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Store Slogan & Bio</label>
                          <input
                            type="text"
                            value={shopBio}
                            onChange={(e) => setShopBio(e.target.value)}
                            className="el-input__inner font-medium text-xs"
                            placeholder="e.g. Premium workspace accessories & gear."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Detailed Company Profile</label>
                          <textarea
                            rows="6"
                            value={companyProfile}
                            onChange={(e) => setCompanyProfile(e.target.value)}
                            className="el-input__inner h-auto py-3 font-medium text-xs resize-none"
                            placeholder="Describe your company history, design values, materials sourcing, and what sets your brand apart..."
                          />
                        </div>
                      </div>
                    )}

                    {/* SUBTAB: STORE POLICIES */}
                    {activeCustomizeSubTab === 'policies' && (
                      <div className="space-y-5 animate-in fade-in duration-200">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Policy & Terms Upload Type</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-slate-700">
                              <input
                                type="radio"
                                name="policyType"
                                value="text"
                                checked={policyType === 'text'}
                                onChange={() => setPolicyType('text')}
                                className="text-[#409eff] focus:ring-[#409eff]"
                              />
                              <span>Rich Text Policy</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-slate-700">
                              <input
                                type="radio"
                                name="policyType"
                                value="pdf"
                                checked={policyType === 'pdf'}
                                onChange={() => setPolicyType('pdf')}
                                className="text-[#409eff] focus:ring-[#409eff]"
                              />
                              <span>PDF Document Upload</span>
                            </label>
                          </div>
                        </div>

                        {policyType === 'text' ? (
                          <div className="space-y-1 animate-in fade-in duration-150">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Terms, Conditions & Return Policies (Text)</label>
                            <textarea
                              rows="8"
                              value={policyText}
                              onChange={(e) => setPolicyText(e.target.value)}
                              className="el-input__inner h-auto py-3 font-medium text-xs font-mono"
                              placeholder="Write your shop's terms and conditions, return policy, and dispatch times..."
                            />
                          </div>
                        ) : (
                          <div className="space-y-4 animate-in fade-in duration-150">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Policy Document (PDF)</label>
                            
                            {policyPdfUrl ? (
                              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shrink-0">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate">Store_Policy_Terms.pdf</p>
                                    <a
                                      href={policyPdfUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] font-bold text-[#409eff] hover:underline"
                                    >
                                      View Uploaded PDF
                                    </a>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setPolicyPdfUrl('')}
                                  className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline"
                                >
                                  Remove File
                                </button>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100/50 transition-colors">
                                <Upload className="w-8 h-8 text-slate-355 mx-auto mb-2 animate-bounce duration-1000" />
                                <p className="text-xs font-semibold text-slate-500">Upload Terms & Conditions PDF</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Maximum size 10MB</p>
                              </div>
                            )}

                            {uploadingField === 'policy' && (
                              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-550 py-2">
                                <Loader2 className="w-4 h-4 animate-spin text-[#409eff]" />
                                Uploading PDF file...
                              </div>
                            )}

                            {!policyPdfUrl && (
                              <label className="flex items-center justify-center gap-1.5 w-full cursor-pointer el-button el-button--primary is-plain el-button--small shadow-sm">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Choose PDF File</span>
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  className="sr-only"
                                  onChange={(e) => {
                                    if (e.target.files[0]) handleFileUpload(e.target.files[0], 'policy');
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* SUBTAB: SHOP FOLLOWERS */}
                    {activeCustomizeSubTab === 'followers' && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest">Store Followers ({followersList.length})</h3>
                          <p className="text-[10px] text-slate-400 font-medium">List of users who follow your store catalog updates.</p>
                        </div>

                        {followersList.length > 0 ? (
                          <div className="el-table el-table--border el-table--striped">
                            <div className="max-h-[350px] overflow-y-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr>
                                    <th className="py-2.5 px-4">User Details</th>
                                    <th className="py-2.5 px-4">Email</th>
                                    <th className="py-2.5 px-4 text-right">Followed Since</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {followersList.map((follower, idx) => (
                                    <tr key={follower.id} className={idx % 2 !== 0 ? 'el-table__row--striped' : ''}>
                                      <td className="py-3 px-4">
                                        <div className="flex items-center gap-2.5">
                                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 bg-slate-700`}>
                                            {follower.name.charAt(0).toUpperCase()}
                                          </div>
                                          <span className="font-bold text-slate-800">{follower.name}</span>
                                        </div>
                                      </td>
                                      <td className="py-3 px-4 font-semibold text-slate-650">{follower.email}</td>
                                      <td className="py-3 px-4 text-right text-slate-450 font-medium">
                                        {new Date(follower.created_at || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="py-16 text-center text-slate-400 font-semibold text-xs leading-relaxed space-y-2">
                            <Users className="w-8 h-8 text-slate-350 mx-auto mb-1" />
                            <p>No followers yet</p>
                            <p className="text-[10px] font-medium text-slate-400">Share your store catalog link to attract followers!</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action buttons (only show if not followers list sub-tab) */}
                    {activeCustomizeSubTab !== 'followers' && (
                      <div className="pt-4 border-t border-slate-100 flex gap-4">
                        <button
                          type="submit"
                          disabled={actionLoading || uploadingField !== null}
                          className="flex-1 el-button el-button--primary shadow-sm font-bold"
                        >
                          {actionLoading && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin inline" />}
                          Save Configurations
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('overview')}
                          className="flex-1 el-button is-plain"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
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
