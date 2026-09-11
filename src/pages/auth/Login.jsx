import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Auth.css";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/produtos";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Não foi possível entrar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <div className="bg-blob bg-blob--fill bg-blob--drift" style={{ top: "-80px", left: "-60px", width: 260, height: 260 }} />
      <div className="bg-blob bg-blob--ring bg-blob--pulse" style={{ bottom: "-60px", right: "-40px", width: 200, height: 200 }} />

      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="auth-tag">Sua conta</span>
        <h1 className="auth-title">
          Bem-vinda de <em>volta</em>
        </h1>
        <p className="auth-subtitle">Entre para montar seu pedido e acompanhar suas encomendas.</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Senha</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <p className="auth-forgot">
          <Link to="/esqueci-senha">Esqueci minha senha</Link>
        </p>

        <button className="auth-btn" type="submit" disabled={busy}>
          {busy ? "Entrando..." : "Entrar"}
        </button>

        <p className="auth-alt">
          Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
