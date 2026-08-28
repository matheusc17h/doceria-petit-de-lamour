import React from "react";
import "./About.css";
import logo1 from "../../img/logo1.png";

function About() {
  return (
    <>
      {/* HERO ABOUT */}
      <section className="about-hero">
        <div className="bg-blob bg-blob--fill bg-blob--drift about-hero-deco-1" />
        <div className="bg-blob bg-blob--ring bg-blob--pulse about-hero-deco-2" />
        <div className="bg-blob bg-blob--fill-dark bg-blob--drift about-hero-deco-3" />
        <div className="bg-blob bg-blob--ring bg-blob--pulse about-hero-deco-4" />
        <div className="bg-dots about-hero-dots-1" />
        <div className="bg-spark about-hero-spark-1">✦</div>

        <div className="about-hero-body">
          <div className="about-hero-content">
            <h1 className="about-hero-title">
              Sobre a <em>Petit de L'Amour</em>
            </h1>
            <div className="about-hero-desc">
              <div className="about-hero-line" />
              <p>Confeitaria artesanal que transforma ingredientes em experiências inesquecíveis</p>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="about-marquee">
        <div className="about-marquee-track">
          <div className="about-marquee-content">
            <span>nossa história</span><span className="about-diamond">♦</span>
            <span>feito com amor</span><span className="about-diamond">♦</span>
            <span>ingredientes selecionados</span><span className="about-diamond">♦</span>
            <span>artesanal de verdade</span><span className="about-diamond">♦</span>
            <span>nossa história</span><span className="about-diamond">♦</span>
            <span>feito com amor</span><span className="about-diamond">♦</span>
            <span>ingredientes selecionados</span><span className="about-diamond">♦</span>
            <span>artesanal de verdade</span><span className="about-diamond">♦</span>
          </div>
        </div>
      </section>

      {/* MISSÃO */}
      <section className="about-section">
        <div className="about-block">
          <div className="about-block-text">
            <span className="about-tag">Nossa Missão</span>
            <h2 className="about-block-title">
              Não vendemos apenas sobremesas.<br />
              <em>Criamos experiências.</em>
            </h2>
            <p className="about-block-desc">
              Transformando ingredientes em momentos especiais. Cada cone trufado,
              ovo de Páscoa de colher e bolo personalizado que criamos é feito para
              tornar seu momento mais doce e memorável.
            </p>
            <p className="about-block-desc">
              Mais do que produzir doces, nosso objetivo é encantar. Às vezes inovamos
              com receitas novas, às vezes aprimoramos clássicos, mas sempre pensando
              em quem vai saborear.
            </p>
          </div>
          <div className="about-block-image">
            <img src={logo1} alt="Petit de L'Amour" />
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="about-values">
        <div className="bg-blob bg-blob--ring bg-blob--pulse about-values-deco-1" />
        <div className="bg-blob bg-blob--fill bg-blob--drift about-values-deco-2" />
        <div className="bg-dots about-values-dots-1" />
        <div className="bg-spark about-values-spark-1">✦</div>

        <div className="about-values-body">
          <span className="about-tag">Nossa Essência</span>
          <h2 className="about-values-title">Uma visão doce do artesanal</h2>
          <div className="about-values-grid">
            {[
              { n: "01", t: "Carinho", d: "Atenção e cuidado em cada criação, do início ao fim." },
              { n: "02", t: "Respeito", d: "Ingredientes e à tradição artesanal como base de tudo." },
              { n: "03", t: "Criatividade", d: "Inovar sem exageros, sempre com equilíbrio e bom gosto." },
              { n: "04", t: "Cuidado", d: "Transformar o comum em especial é nossa razão de ser." },
            ].map((item) => (
              <div className="about-value-card" key={item.n}>
                <span className="about-value-number">{item.n}</span>
                <h3 className="about-value-title">{item.t}</h3>
                <p className="about-value-desc">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO TRABALHAMOS */}
      <section className="about-process">
        <div className="about-process-body">
          <span className="about-tag">Como Trabalhamos</span>
          <h2 className="about-process-title">Do pedido à <em>primeira mordida</em></h2>
          <div className="about-process-steps">
            {[
              { n: "1", t: "Escuta e inspiração", d: "Entendemos o momento que você quer tornar especial." },
              { n: "2", t: "Planejamento e escolha", d: "Definimos sabores, formatos e combinações que vão encantar." },
              { n: "3", t: "Produção artesanal", d: "Cada doce é feito com cuidado, do cone trufado ao bolo personalizado." },
              { n: "4", t: "Entrega de felicidade", d: "Garantimos que cada mordida seja uma experiência única." },
            ].map((step) => (
              <div className="about-step" key={step.n}>
                <div className="about-step-number">{step.n}</div>
                <div className="about-step-text">
                  <h3>{step.t}</h3>
                  <p>{step.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta-body">
          <h2 className="about-cta-title">
            Quer transformar um momento comum em <em>inesquecível?</em>
          </h2>
          <p className="about-cta-desc">
            Converse com a gente e descubra qual doce combina com a sua ocasião.
          </p>
          <button className="btn-primary-about">Fazer Pedido</button>
        </div>
      </section>
    </>
  );
}

export default About;