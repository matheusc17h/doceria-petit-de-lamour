import { useEffect, useState } from "react";
import QRCode from "qrcode";
import "./PixPayment.css";
import { generateFakePixPayload } from "../../lib/fakePix";

function formatBRL(cents) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * Tela de pagamento Pix. Hoje é FICTÍCIA (veja src/lib/fakePix.js) — dá pra
 * ligar num provedor de pagamento de verdade sem mexer no visual, só
 * trocando de onde vem `payload` (e, se quiser, a imagem do QR code).
 */
function PixPayment({ order }) {
  const payload = generateFakePixPayload(order);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(payload, { width: 220, margin: 1, color: { dark: "#2b1b22" } })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [payload]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      // navegador sem permissão de clipboard — copia via textarea temporário
      const ta = document.createElement("textarea");
      ta.value = payload;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="pix-payment">
      <span className="pix-payment-badge">Ambiente de teste · Pix fictício</span>

      <h2 className="pix-payment-title">Pague com Pix pra confirmar</h2>
      <p className="pix-payment-order">
        Pedido <strong>#{order.id.slice(0, 8)}</strong>
      </p>
      <p className="pix-payment-amount">{formatBRL(order.totalCents)}</p>

      <div className="pix-payment-qr">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code Pix" width={200} height={200} />
        ) : (
          <div className="pix-payment-qr-loading" />
        )}
      </div>

      <p className="pix-payment-hint">
        Abra o app do seu banco, escaneie o código acima ou use o Pix Copia e Cola:
      </p>

      <div className="pix-payment-code">
        <input
          type="text"
          readOnly
          value={payload}
          onFocus={(e) => e.target.select()}
          aria-label="Código Pix copia e cola"
        />
        <button type="button" onClick={handleCopy}>
          {copied ? "Copiado! ✓" : "Copiar código"}
        </button>
      </div>

      <p className="pix-payment-expiry">Esse código expira em 30 minutos.</p>
    </div>
  );
}

export default PixPayment;
