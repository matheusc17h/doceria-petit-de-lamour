import "./Footer.css";

function Footer() {
  return (
    <>
      {/* NEWSLETTER */}
      <section className="footer-newsletter">
        <div className="footer-newsletter-body">
          <div className="footer-newsletter-text">
            <span className="footer-tag">Exclusivo</span>
            <h2 className="footer-newsletter-title">
              Receba <em>Ofertas Especiais</em>
            </h2>
            <p className="footer-newsletter-desc">
              Inscreva-se e ganhe acesso a descontos exclusivos, novidades da nossa doceria e lançamentos irresistíveis.
            </p>
          </div>
          <div className="footer-newsletter-form">
            <input type="email" placeholder="Seu melhor e-mail" className="footer-newsletter-input" />
            <button className="footer-newsletter-btn">Receber Ofertas</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-body">

          <div className="footer-brand">
            <img src="/src/img/logo1.png" alt="Petit de L'Amour" className="footer-logo" />
            <p className="footer-brand-desc">
              Pequenas criações feitas para transformar qualquer ocasião em algo especial.
            </p>
          </div>

          <div className="footer-col">
            <h3 className="footer-col-title">Atendimento</h3>
            <p>Encomendas personalizadas sob pedido</p>
            <p>Segunda a Sábado: 9h às 18h</p>
            <p>Cada detalhe feito com carinho 💕</p>
          </div>

          <div className="footer-col">
            <h3 className="footer-col-title">Redes Sociais</h3>
            <a href="#" className="footer-link">Instagram</a>
            <a href="#" className="footer-link">WhatsApp</a>
          </div>

          <div className="footer-col">
            <h3 className="footer-col-title">Pagamento</h3>
            <p>Aceitamos Pix ou dinheiro</p>
            <p>50% antecipado para confirmação</p>
            <p>Restante na entrega</p>
          </div>

          <div className="footer-col">
            <h3 className="footer-col-title">Entrega</h3>
            <p>Parceiros terceirizados</p>
            <p>Frete calculado por localização</p>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2025 Petit de L'Amour · Todos os direitos reservados</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;