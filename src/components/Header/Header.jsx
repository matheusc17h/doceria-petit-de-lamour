import { useState } from "react";
import "./Header.css";
import { Link, NavLink } from "react-router-dom";
import logo from '../../img/logo.png'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="header-announce">
        <span>Entrega Refrigerada</span>
        <span className="header-announce-diamond">♦</span>
        <span>Frete Grátis acima de R$ 150</span>
        <span className="header-announce-diamond">♦</span>
        <span>Feito sob Encomenda</span>
      </div>

      <header className="header">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logo} alt="Petit de L'Amour" />
        </Link>

        <nav className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
          <ul>
            <li><NavLink to="/" end onClick={closeMenu}>Início</NavLink></li>
            <li><NavLink to="/produtos" onClick={closeMenu}>Nosso Cardápio</NavLink></li>
            <li><NavLink to="/encomendas" onClick={closeMenu}>Faça seu Pedido</NavLink></li>
            <li><NavLink to="/sobre" onClick={closeMenu}>Sobre</NavLink></li>
          </ul>
        </nav>

        <div className="header-actions">
          <div className="header-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Buscar sabor, bolo, ovo..." />
          </div>

          <button className="header-icon-btn" aria-label="Minha conta">
            <i className="fa-solid fa-user"></i>
          </button>

          <button className="header-icon-btn" aria-label="Carrinho">
            <i className="fa-solid fa-cart-shopping"></i>
          </button>

          <button
            className="header-menu-toggle"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>
        </div>
      </header>

      {menuOpen && <div className="header-menu-overlay" onClick={closeMenu} />}
    </>
  );
}

export default Header;
