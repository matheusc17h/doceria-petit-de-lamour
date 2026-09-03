import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "petit-de-lamour-cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage indisponível (modo privado, etc.) — ignora
    }
  }, [items]);

  // category + id juntos formam a chave, porque os ids se repetem entre
  // cones/bolos/ovos (ex: cone id 1 e bolo id 1 são produtos diferentes)
  function addItem({ id, name, price, img, category }) {
    const key = `${category}::${id}`;
    setItems((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) =>
          item.key === key ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...current, { key, id, name, price, img, category, qty: 1 }];
    });
  }

  function removeItem(key) {
    setItems((current) => current.filter((item) => item.key !== key));
  }

  function updateQty(key, qty) {
    if (qty <= 0) return removeItem(key);
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, qty } : item))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de um CartProvider");
  return ctx;
}
