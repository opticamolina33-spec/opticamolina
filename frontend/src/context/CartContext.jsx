import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { firstImage, splitName } from '../lib/catalog';

const CartContext = createContext(null);
const STORAGE_KEY = 'cart';

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // sin storage: el carrito vive solo en memoria
    }
  }, [items]);

  const add = (product) => {
    const { brand, model } = splitName(product);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: product.id, brand, model, nombre: product.nombre, precio: product.precio, imagen: firstImage(product), qty: 1 }];
    });
    setOpen(true);
  };

  const setQty = (id, qty) =>
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))));

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const total = items.reduce((n, i) => n + (i.precio || 0) * i.qty, 0);
    return { items, count, total, open, setOpen, add, setQty, remove, clear };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
