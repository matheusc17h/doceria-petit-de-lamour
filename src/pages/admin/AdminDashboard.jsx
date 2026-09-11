import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import AdminChart from "../../components/AdminChart/AdminChart";

function formatBRL(cents) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function waLink(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/55${digits}`;
}

function AdminDashboard() {
  const { isAuthenticated, isAdmin, ready } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderRequests, setOrderRequests] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersOpen, setSubscribersOpen] = useState(false);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [actionBusyId, setActionBusyId] = useState(null);
  const [toast, setToast] = useState(null);
  const [chartOpen, setChartOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      navigate("/entrar", { state: { from: "/admin" } });
      return;
    }
    if (!isAdmin) return; // trata na renderização (sem redirect: evita loop)

    let cancelled = false;
    Promise.all([
      api.adminSummary(),
      api.adminListOrders({ perPage: 100 }),
      api.adminListOrderRequests({ perPage: 100 }),
      api.adminListNewsletterSubscribers({ perPage: 500 }),
    ])
      .then(([summaryRes, ordersRes, requestsRes, subscribersRes]) => {
        if (cancelled) return;
        setSummary(summaryRes);
        setOrders(ordersRes.items);
        setOrderRequests(requestsRes.items);
        setSubscribers(subscribersRes.items);
        setStatus("ok");
      })
      .catch((e) => {
        if (cancelled) return;
        setErrorMsg(e.message);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [ready, isAuthenticated, isAdmin, navigate]);

  async function handleCopyEmails() {
    const list = subscribers.map((s) => s.email).join(", ");
    try {
      await navigator.clipboard.writeText(list);
      setToast({ type: "ok", text: `${subscribers.length} e-mail(s) copiados.` });
    } catch {
      setToast({ type: "error", text: "Não foi possível copiar. Copie manualmente da lista." });
    }
    setTimeout(() => setToast(null), 3000);
  }

  function refreshSummary() {
    api.adminSummary().then(setSummary).catch(() => {});
  }

  async function handleConfirm(orderId) {
    setActionBusyId(orderId);
    try {
      const res = await api.adminConfirmOrder(orderId);
      setOrders((current) => current.map((o) => (o.id === orderId ? res.order : o)));
      setToast({ type: "ok", text: "Pedido aceito." });
      refreshSummary();
    } catch (e) {
      setToast({ type: "error", text: e.message });
    } finally {
      setActionBusyId(null);
      setTimeout(() => setToast(null), 4000);
    }
  }

  async function handleDeny(orderId) {
    setActionBusyId(orderId);
    try {
      const res = await api.adminDenyOrder(orderId);
      setOrders((current) => current.map((o) => (o.id === orderId ? res.order : o)));
      setToast({
        type: "ok",
        text: res.refunded
          ? `Pedido negado — ${formatBRL(res.refundedCents)} estornado (simulado) pro cliente.`
          : "Pedido negado.",
      });
      refreshSummary();
    } catch (e) {
      setToast({ type: "error", text: e.message });
    } finally {
      setActionBusyId(null);
      setTimeout(() => setToast(null), 5000);
    }
  }

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter(
      (o) =>
        o.customer.name.toLowerCase().includes(term) ||
        o.customer.email.toLowerCase().includes(term) ||
        (o.customer.phone || "").includes(term),
    );
  }, [orders, search]);

  if (ready && isAuthenticated && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin">
      <span className="admin-tag">Painel administrativo</span>
      <h1 className="admin-title">
        Pedidos <em>recebidos</em>
      </h1>

      {toast && <div className={`admin-toast admin-toast--${toast.type}`}>{toast.text}</div>}

      {status === "loading" && <p className="admin-loading">Carregando...</p>}
      {status === "error" && <p className="admin-error">{errorMsg}</p>}

      {status === "ok" && (
        <>
          <div className="admin-stats">
            <div className="admin-stat">
              <span className="admin-stat-label">Pedidos</span>
              <span className="admin-stat-value">{summary.totalOrders}</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-label">Faturamento</span>
              <span className="admin-stat-value">{formatBRL(summary.totalRevenueCents)}</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-label">Clientes</span>
              <span className="admin-stat-value">{summary.uniqueCustomers}</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-label">Inscritos newsletter</span>
              <span className="admin-stat-value">{subscribers.length}</span>
            </div>
          </div>

          <button type="button" className="admin-chart-trigger" onClick={() => setChartOpen(true)}>
            📊 Analisar gráfico
          </button>

          {chartOpen && <AdminChart orders={orders} onClose={() => setChartOpen(false)} />}

          {subscribers.length > 0 && (
            <div className="admin-subscribers">
              <button
                type="button"
                className="admin-subscribers-toggle"
                onClick={() => setSubscribersOpen((o) => !o)}
              >
                📧 {subscribers.length} inscrito(s) na newsletter {subscribersOpen ? "▲" : "▼"}
              </button>
              {subscribersOpen && (
                <div className="admin-subscribers-list">
                  <button type="button" className="admin-subscribers-copy" onClick={handleCopyEmails}>
                    Copiar todos os e-mails
                  </button>
                  <ul>
                    {subscribers.map((s) => (
                      <li key={s.id}>
                        {s.email} <span>{formatDate(s.createdAt)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {orderRequests.length > 0 && (
            <div className="admin-requests">
              <h2 className="admin-subtitle">
                Pedidos de contato <em>("Faça sua Encomenda")</em>
              </h2>
              {orderRequests.map((req) => {
                const link = waLink(req.whatsapp);
                return (
                  <div className="admin-order admin-request" key={req.id}>
                    <div className="admin-order-head">
                      <div>
                        <div className="admin-order-id">{req.productCategory}</div>
                        <div className="admin-order-date">Recebido em {formatDate(req.createdAt)}</div>
                      </div>
                      <span className="order-status order-status--PENDING">{req.status}</span>
                    </div>

                    <div className="admin-order-customer">
                      <span className="admin-order-customer-name">{req.customerName}</span>
                      {link ? (
                        <a href={link} target="_blank" rel="noreferrer" className="admin-order-whatsapp">
                          <i className="fa-brands fa-whatsapp"></i> {req.whatsapp}
                        </a>
                      ) : (
                        <span className="admin-order-customer-contact">{req.whatsapp}</span>
                      )}
                      {req.deliveryDate && (
                        <span className="admin-order-customer-contact">
                          Entrega: {formatDate(req.deliveryDate).split(",")[0]}
                        </span>
                      )}
                    </div>

                    {req.notes && <p className="admin-request-notes">{req.notes}</p>}
                  </div>
                );
              })}
            </div>
          )}

          <h2 className="admin-subtitle">Pedidos do carrinho</h2>

          <input
            className="admin-search"
            type="text"
            placeholder="Buscar por nome, e-mail ou WhatsApp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredOrders.length === 0 && (
            <p className="admin-empty">
              {orders.length === 0 ? "Nenhum pedido ainda." : "Nenhum pedido bate com essa busca."}
            </p>
          )}

          {filteredOrders.map((order) => {
            const link = waLink(order.customer.phone);
            return (
              <div className="admin-order" key={order.id}>
                <div className="admin-order-head">
                  <div>
                    <div className="admin-order-id">Pedido #{order.id.slice(0, 8)}</div>
                    <div className="admin-order-date">{formatDate(order.createdAt)}</div>
                  </div>
                  <span className={`order-status order-status--${order.status}`}>{order.status}</span>
                </div>

                <div className="admin-order-customer">
                  <span className="admin-order-customer-name">{order.customer.name}</span>
                  <span className="admin-order-customer-contact">{order.customer.email}</span>
                  {order.customer.phone && (
                    link ? (
                      <a href={link} target="_blank" rel="noreferrer" className="admin-order-whatsapp">
                        <i className="fa-brands fa-whatsapp"></i> {order.customer.phone}
                      </a>
                    ) : (
                      <span className="admin-order-customer-contact">{order.customer.phone}</span>
                    )
                  )}
                </div>

                <ul className="order-items">
                  {order.items.map((it) => (
                    <li key={it.id}>
                      <span>
                        {it.quantity}× {it.productName}
                        {it.flavorName ? ` (${it.flavorName})` : ""}
                      </span>
                      <span>{formatBRL(it.subtotalCents)}</span>
                    </li>
                  ))}
                </ul>

                <div className="admin-order-total">
                  Total <strong>{formatBRL(order.totalCents)}</strong>
                </div>

                {order.status === "PAID" && (
                  <div className="admin-order-decision">
                    <button
                      type="button"
                      className="admin-order-accept"
                      disabled={actionBusyId === order.id}
                      onClick={() => handleConfirm(order.id)}
                    >
                      {actionBusyId === order.id ? "..." : "Aceitar pedido"}
                    </button>
                    <button
                      type="button"
                      className="admin-order-deny"
                      disabled={actionBusyId === order.id}
                      onClick={() => handleDeny(order.id)}
                    >
                      {actionBusyId === order.id ? "..." : "Negar pedido"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
