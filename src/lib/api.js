// Camada única de acesso à API do backend (backend-julia).
// Base URL vem de VITE_API_URL (.env); cai para localhost:3389 em dev.

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3389";
const TOKEN_KEY = "petit-de-lamour-token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* localStorage indisponível — ignora */
  }
}

/** Erro com o status HTTP e o código retornado pela API. */
export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function request(method, path, body) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Não foi possível falar com o servidor. Ele está rodando?", 0, "NETWORK");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      data?.message || `Erro ${res.status}`,
      res.status,
      data?.error || "UNKNOWN",
    );
  }
  return data;
}

export const api = {
  // ---------- auth ----------
  register: (dados) => request("POST", "/customers", dados),
  login: (email, password) => request("POST", "/sessions", { email, password }),
  me: () => request("GET", "/me"),
  forgotPassword: (email) => request("POST", "/password/forgot", { email }),
  resetPassword: (dados) => request("POST", "/password/reset", dados),

  // ---------- catálogo ----------
  listProducts: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.category) qs.set("category", params.category);
    if (params.search) qs.set("search", params.search);
    if (params.perPage) qs.set("perPage", params.perPage);
    const q = qs.toString();
    return request("GET", `/products${q ? `?${q}` : ""}`);
  },
  getProduct: (id) => request("GET", `/products/${id}`),
  listFlavors: () => request("GET", "/flavors"),

  // ---------- carrinho ----------
  getCart: () => request("GET", "/cart"),
  addCartItem: (productId, quantity = 1, flavorId = null) =>
    request("POST", "/cart/items", { productId, quantity, flavorId }),
  updateCartItem: (itemId, quantity) =>
    request("PATCH", `/cart/items/${itemId}`, { quantity }),
  removeCartItem: (itemId) => request("DELETE", `/cart/items/${itemId}`),
  clearCart: () => request("DELETE", "/cart"),

  // ---------- pedidos ----------
  createOrder: () => request("POST", "/orders"),
  listOrders: () => request("GET", "/orders"),
  getOrder: (id) => request("GET", `/orders/${id}`),

  // ---------- admin ----------
  adminSummary: () => request("GET", "/admin/orders/summary"),
  adminListOrders: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", params.page);
    if (params.perPage) qs.set("perPage", params.perPage);
    const q = qs.toString();
    return request("GET", `/admin/orders${q ? `?${q}` : ""}`);
  },
  adminGetOrder: (id) => request("GET", `/admin/orders/${id}`),
};

export { BASE as API_BASE };
