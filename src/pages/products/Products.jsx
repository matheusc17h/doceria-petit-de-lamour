import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { imageFor } from "../../img/catalog";

function formatBRL(cents) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const SECTIONS = [
  { key: "cones", tag: "Mais Pedidos", title: ["Cones", "Trufados"] },
  { key: "bolos", tag: "Sob Encomenda", title: ["Bolos", "Artesanais"], alt: true },
  { key: "ovos", tag: "Páscoa", title: ["Ovos de Páscoa", "Trufados"] },
];

function ProductCard({ product }) {
  const { addProduct } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleAdd() {
    if (!isAuthenticated) {
      navigate("/entrar", { state: { from: "/produtos" } });
      return;
    }
    setBusy(true);
    try {
      await addProduct(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch {
      /* erro já é exposto pelo contexto do carrinho */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="products-card">
      <div className="products-card-img">
        <img src={imageFor(product.imageUrl)} alt={product.name} />
        <button
          className={`products-card-btn ${added ? "products-card-btn--added" : ""}`}
          onClick={handleAdd}
          disabled={busy}
        >
          {added ? "✓ Adicionado" : busy ? "Adicionando..." : "+ Pedido"}
        </button>
      </div>
      <div className="products-card-content">
        <h3 className="products-card-name">{product.name}</h3>
        <div className="products-card-rating">
          ⭐⭐⭐⭐⭐ <span>240 avaliações</span>
        </div>
        <div className="products-card-price">
          {formatBRL(product.priceCents)} <span>no Pix</span>
        </div>
      </div>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .listProducts({ perPage: 100 })
      .then((res) => {
        if (cancelled) return;
        setProducts(res.items);
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
  }, []);

  const byCategory = useMemo(() => {
    const map = { cones: [], bolos: [], ovos: [], outros: [] };
    for (const p of products) {
      (map[p.category] ?? map.outros).push(p);
    }
    return map;
  }, [products]);

  return (
    <>
      {/* HERO */}
      <section className="products-hero">
        <div className="bg-blob bg-blob--fill bg-blob--drift products-hero-deco-1" />
        <div className="bg-blob bg-blob--ring bg-blob--pulse products-hero-deco-2" />
        <div className="bg-blob bg-blob--fill-dark bg-blob--drift products-hero-deco-3" />
        <div className="bg-dots products-hero-dots-1" />
        <div className="bg-spark products-hero-spark-1">✦</div>

        <div className="products-hero-body">
          <div className="products-hero-content">
            <h1 className="products-hero-title">
              Nosso <em>Cardápio</em>
            </h1>
            <div className="products-hero-desc">
              <div className="products-hero-line" />
              <p>Confeitaria artesanal que transforma ingredientes em experiências inesquecíveis</p>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="products-marquee">
        <div className="products-marquee-track">
          <div className="products-marquee-content">
            <span>cones trufados</span><span className="products-diamond">♦</span>
            <span>bolos artesanais</span><span className="products-diamond">♦</span>
            <span>ovos de páscoa</span><span className="products-diamond">♦</span>
            <span>feitos sob encomenda</span><span className="products-diamond">♦</span>
            <span>cones trufados</span><span className="products-diamond">♦</span>
            <span>bolos artesanais</span><span className="products-diamond">♦</span>
            <span>ovos de páscoa</span><span className="products-diamond">♦</span>
            <span>feitos sob encomenda</span><span className="products-diamond">♦</span>
          </div>
        </div>
      </section>

      {status === "loading" && (
        <section className="products-section">
          <div className="products-section-body">
            <p style={{ textAlign: "center", opacity: 0.6 }}>Carregando cardápio...</p>
          </div>
        </section>
      )}

      {status === "error" && (
        <section className="products-section">
          <div className="products-section-body">
            <p style={{ textAlign: "center", color: "#b00020" }}>
              Não foi possível carregar o cardápio: {errorMsg}
            </p>
          </div>
        </section>
      )}

      {status === "ok" &&
        SECTIONS.map((section) => {
          const list = byCategory[section.key];
          if (!list || list.length === 0) return null;
          return (
            <section
              key={section.key}
              className={`products-section ${section.alt ? "products-section-alt" : ""}`}
            >
              {section.alt && (
                <>
                  <div className="bg-blob bg-blob--fill-dark bg-blob--drift products-alt-deco-1" />
                  <div className="bg-blob bg-blob--ring bg-blob--pulse products-alt-deco-2" />
                  <div className="bg-dots products-alt-dots-1" />
                  <div className="bg-spark products-alt-spark-1">✦</div>
                </>
              )}
              <div className="products-section-body">
                <div className="products-section-header">
                  <span className="products-tag">{section.tag}</span>
                  <h2 className="products-section-title">
                    {section.title[0]} <em>{section.title[1]}</em>
                  </h2>
                </div>
                <div className="products-grid">
                  {list.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
    </>
  );
}

export default Products;
