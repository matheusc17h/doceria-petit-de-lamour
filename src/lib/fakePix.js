// ⚠️ Pix FICTÍCIO — só pra maquete visual (QR code + código "copia e cola").
// O texto abaixo tem a CARA de um payload Pix (BR Code/EMV) mas não é um
// código válido de verdade: nenhum banco vai aceitar o pagamento.
//
// Pra integrar de verdade depois:
// 1. Troque esta função por uma chamada à sua API (algo como
//    `api.createPixCharge(order.id)`), que por sua vez pede a cobrança Pix
//    a um provedor de pagamento (Mercado Pago, Efí/Gerencianet, PagSeguro,
//    Asaas, etc.) usando o CPF/CNPJ e a chave Pix reais da confeitaria.
// 2. Use o `payload` (copia-e-cola) e, se o provedor já devolver a imagem
//    pronta do QR code, troque a geração local em <PixPayment> pela URL
//    que a API retornar.
// 3. O valor da cobrança tem que vir do pedido salvo no backend (como já
//    é aqui), nunca calculado de novo só no frontend.
export function generateFakePixPayload(order) {
  const amount = (order.totalCents / 100).toFixed(2);
  const orderId = order.id.replace(/-/g, "").slice(0, 25).toUpperCase();

  return (
    "00020126580014BR.GOV.BCB.PIX" +
    `0136${orderId}` +
    "52040000" +
    "5303986" +
    `54${String(amount.length).padStart(2, "0")}${amount}` +
    "5802BR" +
    "5920PETIT DE LAMOUR" +
    "6009SAO PAULO" +
    "62070503***" +
    "6304FAKE"
  );
}
