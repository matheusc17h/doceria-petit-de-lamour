import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 8 || !/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setError("A senha deve ter ao menos 8 caracteres, com letras e números.");
      return;
    }

    setBusy(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
      });
      navigate("/produtos", { replace: true });
    } catch (err) {
      setError(err.message || "Não foi possível criar a conta.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <div className="bg-blob bg-blob--fill bg-blob--drift" style={{ top: "-80px", right: "-60px", width: 260, height: 260 }} />
      <div className="bg-blob bg-blob--ring bg-blob--pulse" style={{ bottom: "-60px", left: "-40px", width: 200, height: 200 }} />

      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="auth-tag">Nova conta</span>
        <h1 className="auth-title">
          Criar <em>cadastro</em>
        </h1>
        <p className="auth-subtitle">Leva menos de um minuto. Depois é só escolher os doces.</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label htmlFor="reg-name">Nome completo</label>
          <input id="reg-name" type="text" value={form.name} onChange={update("name")} required minLength={2} />
        </div>

        <div className="auth-field">
          <label htmlFor="reg-email">E-mail</label>
          <input id="reg-email" type="email" autoComplete="email" value={form.email} onChange={update("email")} required />
        </div>

        <div className="auth-field">
          <label htmlFor="reg-phone">WhatsApp (opcional)</label>
          <input id="reg-phone" type="text" placeholder="(11) 99999-9999" value={form.phone} onChange={update("phone")} />
        </div>

        <div className="auth-field">
          <label htmlFor="reg-password">Senha</label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={update("password")}
            required
          />
        </div>

        <button className="auth-btn" type="submit" disabled={busy}>
          {busy ? "Criando..." : "Criar conta"}
        </button>

        <p className="auth-alt">
          Já tem conta? <Link to="/entrar">Entrar</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
