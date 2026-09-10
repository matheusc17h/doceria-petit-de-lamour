import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyOrders.css";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

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

function MyOrders() {
  const { isAuthenticated, ready } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      navigate("/entrar", { state: { from: "/meus-pedidos" } });
      return;
    }
    let cancelled = false;
    api
      .listOrders()
      .then((res) => {
        if (cancelled) return;
        setOrders(res.items);
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
  }, [ready, isAuthenticated, navigate]);

  return (
    <div className="myorders">
      <span className="myorders-tag">Histórico</span>
      <h1 className="myorders-title">
        Meus <em>pedidos</em>
      </h1>

      {status === "loading" && <p style={{ opacity: 0.6 }}>Carregando...</p>}
      {status === "error" && <p style={{ color: "#b00020" }}>{errorMsg}</p>}

      {status === "ok" && orders.length === 0 && (
        <div className="myorders-empty">
          <p>Você ainda não fez nenhum pedido.</p>
          <Link to="/produtos">Ver o cardápio</Link>
        </div>
      )}

      {status === "ok" &&
        orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-card-head">
              <div>
                <div className="order-card-id">Pedido #{order.id.slice(0, 8)}</div>
                <div className="order-card-date">{formatDate(order.createdAt)}</div>
              </div>
              <span className={`order-status order-status--${order.status}`}>{order.status}</span>
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
            <div className="order-card-total">
              Total <strong>{formatBRL(order.totalCents)}</strong>
            </div>
          </div>
        ))}
    </div>
  );
}

export default MyOrders;
