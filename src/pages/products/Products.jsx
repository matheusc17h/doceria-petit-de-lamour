import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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

// Cardápio fixo, usado só quando o backend não responde (ex.: site
// publicado sem o backend hospedado em algum lugar público ainda). Mesmo
// formato que a API devolve, pra passar pelo mesmo <ProductCard>.
const FALLBACK_PRODUCTS = [
  { id: "cone-1", name: "Kinder Bueno", priceCents: 1500, category: "cones", imageUrl: "cone-kinder.png" },
  { id: "cone-2", name: "Ovomaltine", priceCents: 1500, category: "cones", imageUrl: "cone-ovomaltine.png" },
  { id: "cone-3", name: "Ouro Branco", priceCents: 1500, category: "cones", imageUrl: "cone-ourob.png" },
  { id: "cone-4", name: "Ferrero Rocher", priceCents: 1500, category: "cones", imageUrl: "cone-ferrero1.png" },
  { id: "cone-5", name: "Cookies & Cream", priceCents: 1500, category: "cones", imageUrl: "logo2.png" },
  { id: "cone-6", name: "Prestígio", priceCents: 1500, category: "cones", imageUrl: "logo2.png" },
  { id: "cone-7", name: "Maracujá", priceCents: 1500, category: "cones", imageUrl: "logo2.png" },
  { id: "cone-8", name: "Morango", priceCents: 1500, category: "cones", imageUrl: "logo2.png" },
  { id: "bolo-1", name: "Brigadeiro Gourmet", priceCents: 12000, category: "bolos", imageUrl: "bolo1.png" },
  { id: "bolo-2", name: "Morango com Leite Ninho", priceCents: 13000, category: "bolos", imageUrl: "bolo2.png" },
  { id: "bolo-3", name: "Chocolate", priceCents: 11000, category: "bolos", imageUrl: "bolo3.png" },
  { id: "bolo-4", name: "Baunilha", priceCents: 11000, category: "bolos", imageUrl: "bolo3.png" },
  { id: "ovo-1", name: "Brigadeiro Gourmet", priceCents: 4500, category: "ovos", imageUrl: "logo2.png" },
  { id: "ovo-2", name: "Prestígio", priceCents: 4500, category: "ovos", imageUrl: "logo2.png" },
  { id: "ovo-3", name: "Ninho com Morango", priceCents: 5000, category: "ovos", imageUrl: "logo2.png" },
  { id: "ovo-4", name: "Kinder Bueno", priceCents: 5500, category: "ovos", imageUrl: "logo2.png" },
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
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("busca") ?? "";

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    const term = search.trim();
    setStatus("loading");
    api
      .listProducts({ perPage: 100, ...(term ? { search: term } : {}) })
      .then((res) => {
        if (cancelled) return;
        setProducts(res.items);
        setStatus("ok");
      })
      .catch((e) => {
        if (cancelled) return;
        // Backend fora do ar (rede/timeout) — mostra o cardápio fixo (ou o
        // cardápio fixo filtrado, se tinha busca) em vez de deixar a página
        // vazia. Erros do próprio servidor (validação, etc.) continuam indo
        // pra tela de erro normalmente.
        if (e.code === "NETWORK") {
          const fallback = term
            ? FALLBACK_PRODUCTS.filter((p) => p.name.toLowerCase().includes(term.toLowerCase()))
            : FALLBACK_PRODUCTS;
          setProducts(fallback);
          setStatus("ok");
          return;
        }
        setErrorMsg(e.message);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [search]);

  function clearSearch() {
    setSearchParams({});
  }

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

      {search.trim() && status !== "loading" && (
        <div className="products-search-banner">
          <p>
            Resultados para <strong>"{search.trim()}"</strong>
          </p>
          <button type="button" onClick={clearSearch}>
            Ver cardápio completo
          </button>
        </div>
      )}

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

      {status === "ok" && products.length === 0 && (
        <section className="products-section">
          <div className="products-section-body">
            <p className="products-empty">
              Nenhum produto encontrado pra "{search.trim()}".{" "}
              <Link to="/produtos">Ver cardápio completo</Link>
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
