import "./Orders.css";

function Orders() {
  return (
    <>
      {/* HERO ORDERS */}
      <section className="orders-hero">
        <div className="bg-blob bg-blob--fill bg-blob--drift orders-hero-deco-1" />
        <div className="bg-blob bg-blob--ring bg-blob--pulse orders-hero-deco-2" />
        <div className="bg-blob bg-blob--fill-dark bg-blob--drift orders-hero-deco-3" />
        <div className="bg-blob bg-blob--ring bg-blob--pulse orders-hero-deco-4" />
        <div className="bg-dots orders-hero-dots-1" />
        <div className="bg-spark orders-hero-spark-1">✦</div>

        <div className="orders-hero-body">
          <div className="orders-hero-content">
            <h1 className="orders-hero-title">
              Faça sua <em>Encomenda</em>
            </h1>
            <div className="orders-hero-desc">
              <div className="orders-hero-line" />
              <p>Escolha seus produtos favoritos e encomende com facilidade para tornar seu momento especial</p>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="orders-marquee">
        <div className="orders-marquee-track">
          <div className="orders-marquee-content">
            <span>encomende agora</span><span className="orders-diamond">♦</span>
            <span>entrega refrigerada</span><span className="orders-diamond">♦</span>
            <span>feito sob encomenda</span><span className="orders-diamond">♦</span>
            <span>frete grátis acima de R$ 150</span><span className="orders-diamond">♦</span>
            <span>encomende agora</span><span className="orders-diamond">♦</span>
            <span>entrega refrigerada</span><span className="orders-diamond">♦</span>
            <span>feito sob encomenda</span><span className="orders-diamond">♦</span>
            <span>frete grátis acima de R$ 150</span><span className="orders-diamond">♦</span>
          </div>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section className="orders-section">
        <div className="orders-body">

          {/* LADO ESQUERDO — INFO */}
          <div className="orders-info">
            <span className="orders-tag">Encomenda</span>
            <h2 className="orders-info-title">
              Como fazer seu <em>pedido</em>
            </h2>
            <div className="orders-steps">
              {[
                { n: "1", t: "Preencha o formulário", d: "Nos conte o que você deseja e quando precisa." },
                { n: "2", t: "Aguarde o contato", d: "Entraremos em contato em até 24h para confirmar." },
                { n: "3", t: "Confirme e pague", d: "Após confirmar os detalhes, realizamos o pagamento." },
                { n: "4", t: "Receba com carinho", d: "Seu pedido chega fresquinho e embalado com amor." },
              ].map((step) => (
                <div className="orders-step" key={step.n}>
                  <div className="orders-step-number">{step.n}</div>
                  <div className="orders-step-text">
                    <h3>{step.t}</h3>
                    <p>{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LADO DIREITO — FORM */}
          <div className="orders-form-wrap">
            <span className="orders-tag">Seu pedido</span>
            <h2 className="orders-form-title">Preencha os dados</h2>

            <div className="orders-form">
              <div className="orders-field">
                <label>Nome completo</label>
                <input type="text" placeholder="Seu nome" />
              </div>

              <div className="orders-field">
                <label>WhatsApp</label>
                <input type="text" placeholder="(11) 99999-9999" />
              </div>

              <div className="orders-field">
                <label>Produto desejado</label>
                <select>
                  <option value="">Selecione um produto</option>
                  <option>Cones Trufados</option>
                  <option>Ovos de Páscoa</option>
                  <option>Bolos Personalizados</option>
                </select>
              </div>

              <div className="orders-field">
                <label>Data da entrega</label>
                <input type="date" />
              </div>

              <div className="orders-field orders-field-full">
                <label>Observações</label>
                <textarea placeholder="Sabores, quantidade, ocasião especial..." rows={4} />
              </div>

              <button className="orders-btn">Enviar Pedido</button>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default Orders;