import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { api } from "../../lib/api";
import { imageFor } from "../../img/catalog";

function formatBRL(cents) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Cart() {
  const { isAuthenticated, ready } = useAuth();
  const { items, totalCents, loading, error, updateQty, removeItem, clearCart, checkout } = useCart();
  const navigate = useNavigate();

  const [imgMap, setImgMap] = useState({});
  const [placedOrder, setPlacedOrder] = useState(null);

  // busca as imagens dos produtos uma vez para enfeitar o carrinho
  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .listProducts({ perPage: 100 })
      .then((res) => {
        const map = {};
        for (const p of res.items) map[p.id] = p.imageUrl;
        setImgMap(map);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const isEmpty = useMemo(() => items.length === 0, [items]);

  async function handleCheckout() {
    try {
      const order = await checkout();
      setPlacedOrder(order);
    } catch {
      /* erro exposto pelo contexto */
    }
  }

  if (ready && !isAuthenticated) {
    return (
      <div className="cart">
        <span className="cart-tag">Carrinho</span>
        <h1 className="cart-title">
          Seu <em>carrinho</em>
        </h1>
        <div className="cart-empty">
          <p>Você precisa entrar na sua conta para montar um pedido.</p>
          <Link to="/entrar" state={{ from: "/carrinho" }}>
            Entrar
          </Link>
        </div>
      </div>
    );
  }

  if (placedOrder) {
    return (
      <div className="cart">
        <div className="cart-success">
          <h2>Pedido realizado! 🎉</h2>
          <p>
            Pedido <strong>#{placedOrder.id.slice(0, 8)}</strong> — total{" "}
            {formatBRL(placedOrder.totalCents)}.
          </p>
          <button className="cart-cta" onClick={() => navigate("/meus-pedidos")}>
            Ver meus pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <span className="cart-tag">Carrinho</span>
      <h1 className="cart-title">
        Seu <em>carrinho</em>
      </h1>

      {error && <div className="cart-error">{error}</div>}

      {isEmpty ? (
        <div className="cart-empty">
          <p>Seu carrinho está vazio.</p>
          <Link to="/produtos">Ver o cardápio</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={imageFor(imgMap[item.productId])} alt={item.productName} />
                <div>
                  <div className="cart-item-name">
                    {item.productName}
                    {item.flavorName ? ` — ${item.flavorName}` : ""}
                  </div>
                  <div className="cart-item-unit">{formatBRL(item.unitPriceCents)} / un.</div>
                </div>
                <div className="cart-qty">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    disabled={loading}
                    aria-label="Diminuir"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    disabled={loading}
                    aria-label="Aumentar"
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-subtotal">{formatBRL(item.subtotalCents)}</div>
                <button
                  className="cart-item-remove"
                  onClick={() => removeItem(item.id)}
                  disabled={loading}
                >
                  remover
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="cart-total">
              Total <strong>{formatBRL(totalCents)}</strong>
            </div>
            <div className="cart-actions">
              <button className="cart-clear" onClick={clearCart} disabled={loading}>
                Esvaziar
              </button>
              <button className="cart-checkout" onClick={handleCheckout} disabled={loading}>
                {loading ? "Processando..." : "Finalizar pedido"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
