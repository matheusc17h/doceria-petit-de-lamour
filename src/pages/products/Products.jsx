import { useState } from "react";
import "./Products.css";
import { useCart } from "../../context/CartContext";
import coneKinder from "../../img/cone-kinder.png";
import coneOvomaltine from "../../img/cone-ovomaltine.png";
import coneOuroBranco from "../../img/cone-ourob.png";
import coneFerrero from "../../img/cone-ferrero1.png";
import logo2 from "../../img/logo2.png";
import bolo1 from "../../img/bolo1.png";
import bolo2 from "../../img/bolo2.png";
import bolo3 from "../../img/bolo3.png";

const cones = [
  { id: 1, name: "Kinder Bueno", price: "R$ 15,00", img: coneKinder },
  { id: 2, name: "Ovomaltine", price: "R$ 15,00", img: coneOvomaltine },
  { id: 3, name: "Ouro Branco", price: "R$ 15,00", img: coneOuroBranco },
  { id: 4, name: "Ferrero Rocher", price: "R$ 15,00", img: coneFerrero },
  { id: 5, name: "Cookies & Cream", price: "R$ 15,00", img: logo2 },
  { id: 6, name: "Prestígio", price: "R$ 15,00", img: logo2 },
  { id: 7, name: "Maracujá", price: "R$ 15,00", img: logo2 },
  { id: 8, name: "Morango", price: "R$ 15,00", img: logo2 },
];

const bolos = [
  { id: 1, name: "Brigadeiro Gourmet", price: "R$ 120,00", img: bolo1 },
  { id: 2, name: "Morango com Leite Ninho", price: "R$ 130,00", img: bolo2 },
  { id: 3, name: "Chocolate", price: "R$ 110,00", img: bolo3 },
  { id: 4, name: "Baunilha", price: "R$ 110,00", img: bolo3 },
];

const ovos = [
  { id: 1, name: "Brigadeiro Gourmet", price: "R$ 45,00", img: logo2 },
  { id: 2, name: "Prestígio", price: "R$ 45,00", img: logo2 },
  { id: 3, name: "Ninho com Morango", price: "R$ 50,00", img: logo2 },
  { id: 4, name: "Kinder Bueno", price: "R$ 55,00", img: logo2 },
];

function ProductCard({ id, name, price, img, category }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ id, name, price, img, category });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="products-card">
      <div className="products-card-img">
        <img src={img} alt={name} />
        <button
          className={`products-card-btn ${added ? "products-card-btn--added" : ""}`}
          onClick={handleAdd}
        >
          {added ? "✓ Adicionado" : "+ Pedido"}
        </button>
      </div>
      <div className="products-card-content">
        <h3 className="products-card-name">{name}</h3>
        <div className="products-card-rating">⭐⭐⭐⭐⭐ <span>240 avaliações</span></div>
        <div className="products-card-price">
          {price} <span>no Pix</span>
        </div>
      </div>
    </div>
  );
}

function Products() {
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

      {/* CONES */}
      <section className="products-section">
        <div className="products-section-body">
          <div className="products-section-header">
            <span className="products-tag">Mais Pedidos</span>
            <h2 className="products-section-title">Cones <em>Trufados</em></h2>
          </div>
          <div className="products-grid">
            {cones.map((p) => <ProductCard key={p.id} {...p} category="cones" />)}
          </div>
        </div>
      </section>

      {/* BOLOS */}
      <section className="products-section products-section-alt">
        <div className="bg-blob bg-blob--fill-dark bg-blob--drift products-alt-deco-1" />
        <div className="bg-blob bg-blob--ring bg-blob--pulse products-alt-deco-2" />
        <div className="bg-dots products-alt-dots-1" />
        <div className="bg-spark products-alt-spark-1">✦</div>

        <div className="products-section-body">
          <div className="products-section-header">
            <span className="products-tag">Sob Encomenda</span>
            <h2 className="products-section-title">Bolos <em>Artesanais</em></h2>
          </div>
          <div className="products-grid">
            {bolos.map((p) => <ProductCard key={p.id} {...p} category="bolos" />)}
          </div>
        </div>
      </section>

      {/* OVOS */}
      <section className="products-section">
        <div className="products-section-body">
          <div className="products-section-header">
            <span className="products-tag">Páscoa</span>
            <h2 className="products-section-title">Ovos de Páscoa <em>Trufados</em></h2>
          </div>
          <div className="products-grid">
            {ovos.map((p) => <ProductCard key={p.id} {...p} category="ovos" />)}
          </div>
        </div>
      </section>
    </>
  );
}

export default Products;