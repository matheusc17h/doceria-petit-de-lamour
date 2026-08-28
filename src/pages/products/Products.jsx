import "./Products.css";

const cones = [
  { id: 1, name: "Kinder Bueno", price: "R$ 15,00", img: "/src/img/cone-kinder.png" },
  { id: 2, name: "Ovomaltine", price: "R$ 15,00", img: "/src/img/cone-ovomaltine.png" },
  { id: 3, name: "Ouro Branco", price: "R$ 15,00", img: "/src/img/cone-ourob.png" },
  { id: 4, name: "Ferrero Rocher", price: "R$ 15,00", img: "/src/img/cone-ferrero1.png" },
  { id: 5, name: "Cookies & Cream", price: "R$ 15,00", img: "/src/img/logo2.png" },
  { id: 6, name: "Prestígio", price: "R$ 15,00", img: "/src/img/logo2.png" },
  { id: 7, name: "Maracujá", price: "R$ 15,00", img: "/src/img/logo2.png" },
  { id: 8, name: "Morango", price: "R$ 15,00", img: "/src/img/logo2.png" },
];

const bolos = [
  { id: 1, name: "Brigadeiro Gourmet", price: "R$ 120,00", img: "/src/img/bolo1.png" },
  { id: 2, name: "Morango com Leite Ninho", price: "R$ 130,00", img: "/src/img/bolo2.png" },
  { id: 3, name: "Chocolate", price: "R$ 110,00", img: "/src/img/bolo3.png" },
  { id: 4, name: "Baunilha", price: "R$ 110,00", img: "/src/img/bolo4.png" },
];

const ovos = [
  { id: 1, name: "Brigadeiro Gourmet", price: "R$ 45,00", img: "/src/img/logo2.png" },
  { id: 2, name: "Prestígio", price: "R$ 45,00", img: "/src/img/logo2.png" },
  { id: 3, name: "Ninho com Morango", price: "R$ 50,00", img: "/src/img/logo2.png" },
  { id: 4, name: "Kinder Bueno", price: "R$ 55,00", img: "/src/img/logo2.png" },
];

function ProductCard({ name, price, img }) {
  return (
    <div className="products-card">
      <div className="products-card-img">
        <img src={img} alt={name} />
        <button className="products-card-btn">+ Pedido</button>
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
            {cones.map((p) => <ProductCard key={p.id} {...p} />)}
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
            {bolos.map((p) => <ProductCard key={p.id} {...p} />)}
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
            {ovos.map((p) => <ProductCard key={p.id} {...p} />)}
          </div>
        </div>
      </section>
    </>
  );
}

export default Products;