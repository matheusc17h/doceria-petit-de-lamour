import { useMemo, useState } from "react";
import "./AdminChart.css";

const LINE_COLOR = "#b56576"; // mesmo acento rosa já usado no painel admin
const GRID_COLOR = "#eddfe4";
const AXIS_TEXT = "#8a7a80";
const INK = "#2b1b22";

function formatBRL(cents) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Formato compacto pro eixo Y (R$ 1.234 -> R$ 1,2mil), pra não competir por espaço.
function formatCompact(cents) {
  const value = cents / 100;
  if (value >= 1000) return `R$ ${(value / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}mil`;
  return `R$ ${value.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
}

function niceMax(value) {
  if (value <= 0) return 100;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
}

const WEEKDAY_SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function buildSeries(orders, days) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    buckets.push({ date, cents: 0 });
  }

  const byDay = new Map(buckets.map((b) => [b.date.toDateString(), b]));
  for (const order of orders) {
    // Só conta como faturamento o que está (ou ficou) pago — mesmo critério
    // usado no resumo do painel.
    if (order.status !== "PAID" && order.status !== "CONFIRMED") continue;
    const d = new Date(order.createdAt);
    d.setHours(0, 0, 0, 0);
    const bucket = byDay.get(d.toDateString());
    if (bucket) bucket.cents += order.totalCents;
  }

  return buckets;
}

const WIDTH = 640;
const HEIGHT = 220;
const PAD = { top: 20, right: 16, bottom: 28, left: 54 };
const INNER_W = WIDTH - PAD.left - PAD.right;
const INNER_H = HEIGHT - PAD.top - PAD.bottom;

function AdminChart({ orders, onClose }) {
  const [period, setPeriod] = useState("week"); // week | month
  const [hoverIndex, setHoverIndex] = useState(null);

  const days = period === "week" ? 7 : 30;
  const series = useMemo(() => buildSeries(orders, days), [orders, days]);

  const maxValue = useMemo(() => niceMax(Math.max(...series.map((b) => b.cents))), [series]);

  const xFor = (i) => PAD.left + (series.length === 1 ? INNER_W / 2 : (i / (series.length - 1)) * INNER_W);
  const yFor = (cents) => PAD.top + INNER_H - (cents / maxValue) * INNER_H;

  const linePath = series
    .map((b, i) => `${i === 0 ? "M" : "L"} ${xFor(i).toFixed(1)} ${yFor(b.cents).toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${xFor(series.length - 1).toFixed(1)} ${PAD.top + INNER_H} L ${xFor(0).toFixed(1)} ${PAD.top + INNER_H} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const total = series.reduce((sum, b) => sum + b.cents, 0);
  const hasData = total > 0;

  // Rótulos do eixo X: semana mostra os 7 dias; mês mostra ~1 a cada 5 pra não empilhar.
  const xLabelStep = period === "week" ? 1 : 5;

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let closest = 0;
    let closestDist = Infinity;
    series.forEach((_, i) => {
      const dist = Math.abs(xFor(i) - px);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setHoverIndex(closest);
  }

  const hovered = hoverIndex !== null ? series[hoverIndex] : null;
  const last = series[series.length - 1];

  return (
    <div className="admin-chart-overlay" onClick={onClose}>
      <div className="admin-chart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-chart-head">
          <div>
            <h2>Faturamento por dia</h2>
            <p>
              {period === "week" ? "Últimos 7 dias" : "Últimos 30 dias"} · Total{" "}
              <strong>{formatBRL(total)}</strong>
            </p>
          </div>
          <button type="button" className="admin-chart-close" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className="admin-chart-period">
          <button
            type="button"
            className={period === "week" ? "active" : ""}
            onClick={() => setPeriod("week")}
          >
            Semana
          </button>
          <button
            type="button"
            className={period === "month" ? "active" : ""}
            onClick={() => setPeriod("month")}
          >
            Mês
          </button>
        </div>

        {!hasData ? (
          <p className="admin-chart-empty">Nenhum pedido pago nesse período ainda.</p>
        ) : (
          <div className="admin-chart-svg-wrap">
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              className="admin-chart-svg"
              onMouseMove={handleMove}
              onMouseLeave={() => setHoverIndex(null)}
              role="img"
              aria-label={`Gráfico de faturamento diário, ${period === "week" ? "última semana" : "último mês"}`}
            >
              {/* linhas de grade horizontais */}
              {gridLines.map((g) => {
                const y = PAD.top + INNER_H - g * INNER_H;
                return (
                  <g key={g}>
                    <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} stroke={GRID_COLOR} strokeWidth="1" />
                    <text x={PAD.left - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize="10" fill={AXIS_TEXT}>
                      {formatCompact(maxValue * g)}
                    </text>
                  </g>
                );
              })}

              {/* rótulos do eixo X */}
              {series.map((b, i) =>
                i % xLabelStep === 0 || i === series.length - 1 ? (
                  <text
                    key={i}
                    x={xFor(i)}
                    y={HEIGHT - 8}
                    textAnchor="middle"
                    fontSize="10"
                    fill={AXIS_TEXT}
                  >
                    {period === "week" ? WEEKDAY_SHORT[b.date.getDay()] : b.date.getDate()}
                  </text>
                ) : null,
              )}

              {/* área sob a linha */}
              <path d={areaPath} fill={LINE_COLOR} opacity="0.1" stroke="none" />

              {/* linha */}
              <path d={linePath} fill="none" stroke={LINE_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

              {/* rótulo no ponto final */}
              <circle cx={xFor(series.length - 1)} cy={yFor(last.cents)} r="5" fill={LINE_COLOR} stroke="#fff" strokeWidth="2" />
              <text
                x={xFor(series.length - 1) - 6}
                y={yFor(last.cents) - 10}
                textAnchor="end"
                fontSize="11"
                fontWeight="700"
                fill={INK}
              >
                {formatCompact(last.cents)}
              </text>

              {/* crosshair + destaque do ponto sob o mouse */}
              {hovered && (
                <>
                  <line
                    x1={xFor(hoverIndex)}
                    x2={xFor(hoverIndex)}
                    y1={PAD.top}
                    y2={PAD.top + INNER_H}
                    stroke={AXIS_TEXT}
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <circle cx={xFor(hoverIndex)} cy={yFor(hovered.cents)} r="5" fill={LINE_COLOR} stroke="#fff" strokeWidth="2" />
                </>
              )}
            </svg>

            {hovered && (
              <div
                className="admin-chart-tooltip"
                style={{
                  left: `${(xFor(hoverIndex) / WIDTH) * 100}%`,
                  top: `${(yFor(hovered.cents) / HEIGHT) * 100}%`,
                }}
              >
                <div className="admin-chart-tooltip-value">{formatBRL(hovered.cents)}</div>
                <div className="admin-chart-tooltip-date">
                  {hovered.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminChart;
