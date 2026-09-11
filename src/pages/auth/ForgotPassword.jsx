import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { api } from "../../lib/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState("request"); // request | reset | done
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleRequest(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.forgotPassword(email.trim());
      setStep("reset");
    } catch (err) {
      // A API nunca revela se o e-mail existe — um erro aqui só acontece
      // se o e-mail digitado for inválido (não passa nem no formato).
      setError(err.message || "Não foi possível enviar o código.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("As senhas não são iguais.");
      return;
    }
    setBusy(true);
    try {
      await api.resetPassword({ email: email.trim(), code: code.trim(), newPassword });
      setStep("done");
    } catch (err) {
      setError(err.message || "Código inválido ou expirado.");
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    setError("");
    setBusy(true);
    try {
      await api.forgotPassword(email.trim());
      setError(""); // sem erro = reenviado
    } catch (err) {
      setError(err.message || "Não foi possível reenviar o código.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <div className="bg-blob bg-blob--fill bg-blob--drift" style={{ top: "-80px", left: "-60px", width: 260, height: 260 }} />
      <div className="bg-blob bg-blob--ring bg-blob--pulse" style={{ bottom: "-60px", right: "-40px", width: 200, height: 200 }} />

      {step === "request" && (
        <form className="auth-card" onSubmit={handleRequest}>
          <span className="auth-tag">Recuperar senha</span>
          <h1 className="auth-title">
            Esqueceu sua <em>senha</em>?
          </h1>
          <p className="auth-subtitle">
            Digite seu e-mail e enviamos um código de 6 dígitos pra você criar uma nova senha.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="forgot-email">E-mail</label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn" type="submit" disabled={busy}>
            {busy ? "Enviando..." : "Enviar código"}
          </button>

          <p className="auth-alt">
            Lembrou a senha? <Link to="/entrar">Entrar</Link>
          </p>
        </form>
      )}

      {step === "reset" && (
        <form className="auth-card" onSubmit={handleReset}>
          <span className="auth-tag">Recuperar senha</span>
          <h1 className="auth-title">
            Digite o <em>código</em>
          </h1>
          <p className="auth-subtitle">
            Se <strong>{email}</strong> estiver cadastrado, enviamos um código de 6 dígitos (válido
            por 15 minutos). Confira também a caixa de spam.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="forgot-code">Código de 6 dígitos</label>
            <input
              id="forgot-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="forgot-new-password">Nova senha</label>
            <input
              id="forgot-new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="forgot-confirm-password">Confirmar nova senha</label>
            <input
              id="forgot-confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button className="auth-btn" type="submit" disabled={busy}>
            {busy ? "Confirmando..." : "Trocar senha"}
          </button>

          <p className="auth-alt">
            Não chegou? <button type="button" className="auth-link-btn" onClick={handleResend} disabled={busy}>
              Reenviar código
            </button>
            {" · "}
            <button type="button" className="auth-link-btn" onClick={() => setStep("request")}>
              Trocar e-mail
            </button>
          </p>
        </form>
      )}

      {step === "done" && (
        <div className="auth-card auth-card--center">
          <span className="auth-tag">Recuperar senha</span>
          <h1 className="auth-title">
            Senha <em>alterada</em>! 🎉
          </h1>
          <p className="auth-subtitle">Já pode entrar com sua nova senha.</p>
          <button className="auth-btn" type="button" onClick={() => navigate("/entrar")}>
            Ir para o login
          </button>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
