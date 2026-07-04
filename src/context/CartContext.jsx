import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'techhub_cart';

const normalizeProduct = (product) => {
  if (!product) return null;

  const numericPrice =
    typeof product.price === 'string'
      ? Number.parseFloat(product.price.replace(/[^\d.]/g, ''))
      : Number(product.price || 0);

  return {
    id: product.id,
    title: product.title || product.name || 'Tech-Hub Product',
    price: Number.isFinite(numericPrice) ? numericPrice : 0,
    image: product.image || '',
    stock: Number(product.stock || 0),
    vendor: product.vendor || null,
    category: product.category || null,
    brand: product.brand || product.vendor?.store_name || product.vendor?.name || 'Tech-Hub',
  };
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, quantity = 1) => {
    const normalized = normalizeProduct(product);
    if (!normalized || !normalized.id) return;

    const nextQuantity = Math.max(1, Number.parseInt(quantity, 10) || 1);
    setItems((current) => {
      const existing = current.find((item) => String(item.id) === String(normalized.id));
      if (!existing) {
        return [...current, { ...normalized, quantity: nextQuantity }];
      }

      return current.map((item) =>
        String(item.id) === String(normalized.id)
          ? { ...item, quantity: item.quantity + nextQuantity }
          : item,
      );
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    const nextQuantity = Math.max(1, Number.parseInt(quantity, 10) || 1);
    setItems((current) =>
      current.map((item) =>
        String(item.id) === String(productId) ? { ...item, quantity: nextQuantity } : item,
      ),
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((current) => current.filter((item) => String(item.id) !== String(productId)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

    return {
      items,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [addItem, clearCart, items, removeItem, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
