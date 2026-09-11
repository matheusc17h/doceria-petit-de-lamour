import { useState } from "react";
import "./Footer.css";
import logo1 from "../../img/logo1.png";
import { api } from "../../lib/api";

function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubscribe(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await api.subscribeNewsletter(email.trim());
      setEmail("");
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message || "Não foi possível se inscrever.");
      setStatus("error");
    }
  }

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
          {status === "done" ? (
            <p className="footer-newsletter-success">Inscrito! Fique de olho no seu e-mail. 💌</p>
          ) : (
            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="footer-newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="footer-newsletter-btn" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Enviando..." : "Receber Ofertas"}
              </button>
            </form>
          )}
          {status === "error" && <p className="footer-newsletter-error">{errorMsg}</p>}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-body">

          <div className="footer-brand">
            <img src={logo1} alt="Petit de L'Amour" className="footer-logo" />
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
            <a
              href="https://www.instagram.com/petit_de_lamour/"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              Instagram
            </a>
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