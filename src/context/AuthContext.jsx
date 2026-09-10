import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "../lib/api";

const AuthContext = createContext(null);
const USER_KEY = "petit-de-lamour-user";

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    /* ignora */
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser);
  // "ready" = já terminamos de revalidar o token guardado (evita piscar telas)
  const [ready, setReady] = useState(!getToken());

  useEffect(() => {
    if (!getToken()) {
      setReady(true);
      return;
    }
    let cancelled = false;
    api
      .me()
      .then((res) => {
        if (cancelled) return;
        setUser(res.customer);
        storeUser(res.customer);
      })
      .catch(() => {
        if (cancelled) return;
        setToken(null);
        storeUser(null);
        setUser(null);
      })
      .finally(() => !cancelled && setReady(true));
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email, password) {
    const res = await api.login(email, password);
    setToken(res.token);
    setUser(res.customer);
    storeUser(res.customer);
    return res.customer;
  }

  async function register({ name, email, password, phone }) {
    await api.register({ name, email, password, ...(phone ? { phone } : {}) });
    return login(email, password);
  }

  function logout() {
    setToken(null);
    storeUser(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, ready, isAuthenticated: !!user, isAdmin: user?.role === "ADMIN", login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de um AuthProvider");
  return ctx;
}
