import { useEffect, useRef, useState } from "react";
import "./Header.css";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import logo from '../../img/logo.png'
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { imageFor } from "../../img/catalog";

function formatBRL(cents) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const { totalCount } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [bump, setBump] = useState(false);
  const firstRender = useRef(true);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setBump(true);
    const t = setTimeout(() => setBump(false), 300);
    return () => clearTimeout(t);
  }, [totalCount]);

  // fecha o menu de conta ao clicar fora
  useEffect(() => {
    function onClick(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // fecha a lista de resultados da busca ao clicar fora
  useEffect(() => {
    function onClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setResultsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // busca com debounce: espera parar de digitar antes de chamar a API
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(() => {
      api
        .listProducts({ search: term, perPage: 6 })
        .then((res) => setResults(res.items))
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // mantém a caixa de busca do header refletindo a URL atual — cobre link
  // direto, atualizar a página e o botão de voltar do navegador
  useEffect(() => {
    setQuery(searchParams.get("busca") ?? "");
  }, [searchParams]);

  function goToSearch(term) {
    setResultsOpen(false);
    navigate(`/produtos?busca=${encodeURIComponent(term)}`);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const term = query.trim();
    if (term) goToSearch(term);
  }

  const firstName = user?.name?.split(" ")[0] ?? "";

  function handleLogout() {
    logout();
    setAccountOpen(false);
    navigate("/");
  }

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
            {isAuthenticated && (
              <li><NavLink to="/meus-pedidos" onClick={closeMenu}>Meus Pedidos</NavLink></li>
            )}
          </ul>
        </nav>

        <div className="header-actions">
          <div className="header-search-wrap" ref={searchRef}>
            <form className="header-search" onSubmit={handleSearchSubmit}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Buscar sabor, bolo, ovo..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setResultsOpen(true);
                }}
                onFocus={() => setResultsOpen(true)}
              />
            </form>

            {resultsOpen && query.trim().length >= 2 && (
              <div className="header-search-results">
                {searching && <p className="header-search-status">Buscando...</p>}

                {!searching && results.length === 0 && (
                  <p className="header-search-status">Nenhum produto encontrado.</p>
                )}

                {!searching &&
                  results.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="header-search-item"
                      onClick={() => goToSearch(p.name)}
                    >
                      <img src={imageFor(p.imageUrl)} alt="" />
                      <span className="header-search-item-name">{p.name}</span>
                      <span className="header-search-item-price">{formatBRL(p.priceCents)}</span>
                    </button>
                  ))}

                {!searching && results.length > 0 && (
                  <button
                    type="button"
                    className="header-search-all"
                    onClick={() => goToSearch(query.trim())}
                  >
                    Ver todos os resultados para "{query.trim()}"
                  </button>
                )}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="header-account" ref={accountRef}>
              <button
                className="header-icon-btn"
                aria-label="Minha conta"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((o) => !o)}
              >
                <i className="fa-solid fa-user"></i>
              </button>
              {accountOpen && (
                <div className="header-account-menu">
                  <p className="header-account-hi">Olá, {firstName}</p>
                  <Link to="/meus-pedidos" onClick={() => setAccountOpen(false)}>
                    Meus pedidos
                  </Link>
                  <Link to="/carrinho" onClick={() => setAccountOpen(false)}>
                    Meu carrinho
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setAccountOpen(false)}>
                      Painel admin
                    </Link>
                  )}
                  <button type="button" onClick={handleLogout}>
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link className="header-icon-btn" to="/entrar" aria-label="Entrar">
              <i className="fa-solid fa-user"></i>
            </Link>
          )}

          <Link
            className={`header-icon-btn ${bump ? "header-icon-btn--bump" : ""}`}
            to="/carrinho"
            aria-label={`Carrinho${totalCount > 0 ? `, ${totalCount} ${totalCount === 1 ? "item" : "itens"}` : ""}`}
          >
            <i className="fa-solid fa-cart-shopping"></i>
            {totalCount > 0 && (
              <span className="header-cart-badge">{totalCount}</span>
            )}
          </Link>

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
