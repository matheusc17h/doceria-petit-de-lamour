import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null); // cart view do backend, ou null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setCart(await api.getCart());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // recarrega o carrinho sempre que o login muda
  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addProduct(product, quantity = 1) {
    setLoading(true);
    setError(null);
    try {
      setCart(await api.addCartItem(product.id, quantity));
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(itemId) {
    setLoading(true);
    try {
      setCart(await api.removeCartItem(itemId));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateQty(itemId, quantity) {
    if (quantity <= 0) return removeItem(itemId);
    setLoading(true);
    try {
      setCart(await api.updateCartItem(itemId, quantity));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function clearCart() {
    setLoading(true);
    try {
      setCart(await api.clearCart());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.createOrder();
      await refresh(); // carrinho volta vazio
      return res.order;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  const items = cart?.items ?? [];
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalCents = cart?.totalCents ?? 0;

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        totalCents,
        loading,
        error,
        refresh,
        addProduct,
        updateQty,
        removeItem,
        clearCart,
        checkout,
      }}
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
