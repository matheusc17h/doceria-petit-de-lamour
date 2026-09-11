import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found">
      <span className="not-found-tag">Ops</span>
      <h1 className="not-found-title">
        Página não <em>encontrada</em>
      </h1>
      <p>O endereço que você tentou acessar não existe ou foi movido.</p>
      <Link to="/" className="not-found-cta">
        Voltar pro início
      </Link>
    </div>
  );
}

export default NotFound;
