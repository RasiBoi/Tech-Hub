import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { requestJson } from '../services/httpClient';
import { serviceRegistry } from '../config/serviceRegistry';

const formatCurrency = (value) =>
  `LKR ${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

const normalizeLookupText = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const hasLiveCatalogId = (item) => {
  const productId = Number(item?.id);
  return Number.isInteger(productId) && productId > 0;
};

const resolveCatalogProduct = (item, catalogProducts) => {
  if (hasLiveCatalogId(item)) {
    return { id: Number(item.id) };
  }

  const itemTitle = normalizeLookupText(item?.title || item?.name);
  const itemCategory = normalizeLookupText(item?.category?.name || item?.category);

  if (!itemTitle) return null;

  return catalogProducts.find((product) => {
    const productTitle = normalizeLookupText(product?.title || product?.name);
    const productCategory = normalizeLookupText(product?.category?.name || product?.category);

    if (!productTitle) return false;
    if (productTitle === itemTitle) return true;
    if (itemCategory && productCategory && itemCategory !== productCategory) return false;

    return productTitle.includes(itemTitle) || itemTitle.includes(productTitle);
  }) || null;
};

const resolveOrderItems = async (checkoutItems) => {
  const needsCatalogLookup = checkoutItems.some((item) => !hasLiveCatalogId(item));
  const catalogProducts = needsCatalogLookup
    ? await requestJson(`${serviceRegistry.catalog}/products`, { omitAuth: true })
    : [];

  return checkoutItems.map((item) => {
    const product = resolveCatalogProduct(item, catalogProducts);

    if (!product?.id) {
      throw new Error(
        `"${item.title || 'This item'}" is not connected to a live catalog product. Remove it and add the product again from the catalog.`,
      );
    }

    return {
      product_id: Number(product.id),
      quantity: Number(item.quantity || 1),
    };
  });
};

export default function Cart() {
  const { user } = useAuth();
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const directItems = location.state?.mode === 'buy-now' ? location.state.items || [] : null;
  const checkoutItems = directItems || items;
  const isDirectCheckout = Boolean(directItems);

  const [shippingName, setShippingName] = useState(user?.name || '');
  const [shippingPhone, setShippingPhone] = useState(
    user?.id ? localStorage.getItem(`techhub_phone_${user.id}`) || '' : '',
  );
  const [shippingAddress, setShippingAddress] = useState(
    user?.id ? localStorage.getItem(`techhub_addr_${user.id}`) || '' : '',
  );
  const [paymentMethod, setPaymentMethod] = useState('Demo Card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const summary = useMemo(() => {
    const subtotal = checkoutItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
    const delivery = subtotal > 0 ? 450 : 0;
    const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.015) : 0;

    return {
      subtotal,
      delivery,
      serviceFee,
      total: subtotal + delivery + serviceFee,
    };
  }, [checkoutItems]);

  const submitOrder = async (event) => {
    event.preventDefault();

    if (!user) {
      navigate('/login?tab=login', {
        state: {
          from: isDirectCheckout ? location.pathname : '/cart',
          checkoutState: location.state || null,
        },
      });
      return;
    }

    if (checkoutItems.length === 0) {
      setMessage({ type: 'error', text: 'Your cart is empty.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const orderItems = await resolveOrderItems(checkoutItems);

      if (user?.id) {
        localStorage.setItem(`techhub_addr_${user.id}`, shippingAddress);
        localStorage.setItem(`techhub_phone_${user.id}`, shippingPhone);
      }

      await requestJson(`${serviceRegistry.commerce}/orders`, {
        method: 'POST',
        body: {
          items: orderItems,
          payment_method: paymentMethod,
          shipping_name: shippingName,
          shipping_phone: shippingPhone,
          shipping_address: shippingAddress,
        },
      });

      if (!isDirectCheckout) {
        clearCart();
      }

      navigate('/portal', { state: { openTab: 'orders' } });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Checkout failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 font-sans">
      <Navbar />

      <main className="max-w-[1480px] mx-auto px-4 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <Link to="/category/All" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white">
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue shopping
            </Link>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
              {isDirectCheckout ? 'Buy Now Checkout' : 'Shopping Cart'}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-400">
              Demo payment is recorded as paid and creates real order records for customer and vendor dashboards.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-black uppercase tracking-wider text-emerald-300">
            <ShieldCheck className="w-4 h-4" />
            Demo Payment
          </div>
        </div>

        {message && (
          <div className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold ${
            message.type === 'error'
              ? 'border-rose-500/25 bg-rose-500/10 text-rose-200'
              : 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200'
          }`}>
            {message.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <form onSubmit={submitOrder} className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <section className="xl:col-span-8 space-y-4">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d1527]/70 shadow-xl overflow-hidden">
              <div className="border-b border-white/[0.06] px-5 py-4 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-widest text-white">Items</h2>
                <span className="text-xs font-bold text-slate-400">{checkoutItems.length} product(s)</span>
              </div>

              {checkoutItems.length > 0 ? (
                <div className="divide-y divide-white/[0.06]">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
                      <div className="w-full sm:w-24 h-24 rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-8 h-8 text-slate-600" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-extrabold text-white leading-snug">{item.title}</h3>
                        <p className="mt-1 text-[11px] font-semibold text-slate-450">{item.brand}</p>
                        <p className="mt-2 text-sm font-black text-rose-400">{formatCurrency(item.price)}</p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
                          <button
                            type="button"
                            disabled={isDirectCheckout}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-sm font-black text-white">{item.quantity}</span>
                          <button
                            type="button"
                            disabled={isDirectCheckout}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right min-w-28">
                          <p className="text-sm font-black text-emerald-400">{formatCurrency(item.price * item.quantity)}</p>
                          {!isDirectCheckout && (
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 hover:text-rose-300"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-650" />
                  <p className="mt-3 text-sm font-bold text-slate-400">No items ready for checkout.</p>
                  <Link to="/category/All" className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-black text-white hover:bg-blue-700">
                    Browse products
                  </Link>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Truck, title: 'Vendor dispatch', text: 'Each vendor sees only items they need to fulfill.' },
                { icon: CreditCard, title: 'Fake payment', text: 'No payment gateway or real card charge is used.' },
                { icon: Package, title: 'Order tracking', text: 'Customers can track order items in the portal.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/[0.06] bg-[#0d1527]/50 p-4">
                  <item.icon className="w-5 h-5 text-blue-400" />
                  <h3 className="mt-3 text-xs font-black text-white">{item.title}</h3>
                  <p className="mt-1 text-[11px] font-medium leading-relaxed text-slate-450">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="xl:col-span-4 rounded-2xl border border-white/[0.08] bg-[#0d1527]/80 p-5 shadow-xl sticky top-24">
            <h2 className="text-sm font-black uppercase tracking-widest text-white">Checkout</h2>
            {!user && (
              <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs font-bold leading-relaxed text-amber-100">
                Sign in before placing an order. Your cart stays saved on this device.
              </div>
            )}

            <div className="mt-5 space-y-3">
              <input
                type="text"
                required
                value={shippingName}
                onChange={(event) => setShippingName(event.target.value)}
                placeholder="Full name"
                className="w-full rounded-xl border border-white/[0.08] bg-[#070a13] px-4 py-3 text-xs font-bold text-white outline-none focus:border-blue-500"
              />
              <input
                type="text"
                required
                value={shippingPhone}
                onChange={(event) => setShippingPhone(event.target.value)}
                placeholder="Phone number"
                className="w-full rounded-xl border border-white/[0.08] bg-[#070a13] px-4 py-3 text-xs font-bold text-white outline-none focus:border-blue-500"
              />
              <textarea
                rows="3"
                required
                value={shippingAddress}
                onChange={(event) => setShippingAddress(event.target.value)}
                placeholder="Delivery address"
                className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#070a13] px-4 py-3 text-xs font-bold leading-relaxed text-white outline-none focus:border-blue-500"
              />
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-[#070a13] px-4 py-3 text-xs font-bold text-white outline-none focus:border-blue-500"
              >
                <option>Demo Card</option>
                <option>Cash on Delivery</option>
                <option>Demo Bank Transfer</option>
              </select>
            </div>

            <div className="mt-6 space-y-3 border-t border-white/[0.06] pt-5 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery</span>
                <span>{formatCurrency(summary.delivery)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Service fee</span>
                <span>{formatCurrency(summary.serviceFee)}</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.06] pt-4 text-lg font-black text-white">
                <span>Total</span>
                <span>{formatCurrency(summary.total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || checkoutItems.length === 0}
              className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-600/10 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {user ? 'Place Demo Order' : 'Login to Place Order'}
            </button>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  );
}
