"use client";

import { useState } from "react";
import { TOKEN_MINT, TOKEN_SYMBOL } from "@/lib/constants";

const isMockMint = !TOKEN_MINT || TOKEN_MINT.startsWith("PASTE");

const PERIODS = ["1H", "4H", "1D", "1W", "1M"] as const;
type Period = typeof PERIODS[number];

// Price data sets per period (0-100 normalized, trending bullish)
const DATA: Record<Period, number[]> = {
  "1H": [72,75,73,78,76,80,78,82,80,85,83,87,86,89,88,92,90,94,92,96,95,98,96,100,98,100],
  "4H": [55,52,58,56,62,60,65,63,68,66,72,70,75,73,78,76,82,80,85,83,88,86,90,89,93,92,96,95,98,100],
  "1D": [35,32,38,36,44,42,46,50,47,54,57,52,61,64,59,68,66,73,71,78,76,81,84,79,87,84,89,87,93,100],
  "1W": [20,18,25,22,30,28,35,32,40,38,45,42,50,48,55,52,60,58,65,62,70,68,75,72,80,78,85,82,90,100],
  "1M": [8,10,7,12,9,15,13,18,16,22,20,26,24,30,28,34,32,38,36,42,40,50,55,52,62,65,72,78,88,100],
};

const VOLUME: Record<Period, number[]> = {
  "1H": [40,55,35,60,45,70,50,65,55,80,60,75,65,85,70,90,75,88,80,92,85,95,88,98,90,100],
  "4H": [30,45,35,55,40,60,50,65,45,70,55,75,60,80,65,85,70,88,75,90,80,92,85,95,88,98,90,95,92,100],
  "1D": [25,40,30,50,35,55,45,60,40,65,50,70,55,75,60,80,65,82,70,85,75,88,80,90,85,88,90,92,95,100],
  "1W": [20,35,25,45,30,50,40,55,35,60,45,65,50,70,55,75,60,78,65,80,70,82,75,85,80,88,85,90,92,100],
  "1M": [15,30,20,40,25,45,35,50,30,55,40,60,45,65,50,70,55,72,60,75,65,78,70,82,75,85,80,88,90,100],
};

const TIME_LABELS: Record<Period, string[]> = {
  "1H": ["10:00","10:10","10:20","10:30","10:40","10:50"],
  "4H": ["08:00","09:00","10:00","11:00","12:00","13:00"],
  "1D": ["Mon","Tue","Wed","Thu","Fri","Sat"],
  "1W": ["Wk1","Wk2","Wk3","Wk4","Wk5","Wk6"],
  "1M": ["Jan","Feb","Mar","Apr","May","Jun"],
};

const PRICE_LABELS: Record<Period, string[]> = {
  "1H": ["$0.0000390","$0.0000400","$0.0000410","$0.0000420"],
  "4H": ["$0.0000340","$0.0000360","$0.0000380","$0.0000400","$0.0000420"],
  "1D": ["$0.0000200","$0.0000280","$0.0000360","$0.0000420"],
  "1W": ["$0.0000100","$0.0000200","$0.0000300","$0.0000420"],
  "1M": ["$0.0000050","$0.0000150","$0.0000280","$0.0000420"],
};

function buildPath(data: number[], W: number, H: number) {
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - (v / 100) * H,
  }));

  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const mx = (prev.x + curr.x) / 2;
    d += ` C ${mx.toFixed(1)} ${prev.y.toFixed(1)} ${mx.toFixed(1)} ${curr.y.toFixed(1)} ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }
  return { d, pts };
}

export default function PriceChart() {
  const [period, setPeriod] = useState<Period>("1D");

  if (!isMockMint) {
    return (
      <div id="chart" className="overflow-hidden rounded-2xl border border-white/[0.06]">
        <iframe
          src={`https://dexscreener.com/solana/${TOKEN_MINT}?embed=1&theme=dark&trades=0&info=0`}
          width="100%"
          height="460"
          style={{ border: "none" }}
          title="Smartcat Coin Price Chart"
          allowFullScreen
        />
      </div>
    );
  }

  const W = 540;
  const H = 180;
  const VH = 50;
  const priceData = DATA[period];
  const volData   = VOLUME[period];

  const { d: pricePath, pts } = buildPath(priceData, W, H);
  const fillPath = pricePath + ` L ${W} ${H} L 0 ${H} Z`;
  const lastPt = pts[pts.length - 1];
  const firstPt = pts[0];
  const isUp = priceData[priceData.length - 1] >= priceData[0];

  const strokeColor = isUp ? "#f97316" : "#ef4444";
  const gradStart  = isUp ? "rgba(249,115,22,0.25)" : "rgba(239,68,68,0.25)";

  return (
    <div id="chart" className="glass-card rounded-2xl overflow-hidden">
      {/* Chart header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">{TOKEN_SYMBOL}/SOL</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isUp ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
              {isUp ? "▲" : "▼"} {isUp ? "+12.45%" : "-5.23%"}
            </span>
          </div>
          <p className="mt-0.5 font-mono text-2xl font-bold text-white">$0.0000420</p>
        </div>
        <div className="flex gap-1 rounded-xl bg-white/[0.04] p-1">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${period === p ? "bg-orange-500 text-white shadow" : "text-gray-500 hover:text-white"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="px-2 pt-4 pb-2">
        <svg viewBox={`0 0 ${W + 60} ${H + VH + 40}`} width="100%" preserveAspectRatio="none" style={{ height: "260px" }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={gradStart} />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
            <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(249,115,22,0.4)" />
              <stop offset="100%" stopColor="rgba(249,115,22,0.05)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((f, i) => (
            <line
              key={i}
              x1="0" y1={H * f} x2={W} y2={H * f}
              stroke="rgba(255,255,255,0.04)" strokeWidth="1"
            />
          ))}

          {/* Fill */}
          <path d={fillPath} fill="url(#priceGrad)" />

          {/* Price line */}
          <path d={pricePath} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Last price dot */}
          <circle cx={lastPt.x} cy={lastPt.y} r="4" fill={strokeColor} />
          <circle cx={lastPt.x} cy={lastPt.y} r="8" fill={strokeColor} fillOpacity="0.2">
            <animate attributeName="r" values="4;10;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Price label */}
          <rect x={lastPt.x + 6} y={lastPt.y - 10} width="70" height="18" rx="4" fill={strokeColor} fillOpacity="0.15" />
          <text x={lastPt.x + 10} y={lastPt.y + 3} fill={strokeColor} fontSize="9" fontFamily="monospace" fontWeight="600">$0.0000420</text>

          {/* Volume bars */}
          {volData.map((v, i) => {
            const bx = (i / (volData.length - 1)) * W - 5;
            const bh = (v / 100) * VH;
            return (
              <rect
                key={i}
                x={bx} y={H + 10 + (VH - bh)}
                width={Math.max(W / volData.length - 2, 4)}
                height={bh}
                rx="2"
                fill="url(#volGrad)"
              />
            );
          })}

          {/* Time labels */}
          {TIME_LABELS[period].map((label, i) => {
            const x = (i / (TIME_LABELS[period].length - 1)) * W;
            return (
              <text key={i} x={x} y={H + VH + 28} textAnchor="middle" fill="#475569" fontSize="9" fontFamily="sans-serif">
                {label}
              </text>
            );
          })}

          {/* Price axis labels */}
          {PRICE_LABELS[period].map((label, i) => {
            const y = H - (i / (PRICE_LABELS[period].length - 1)) * H;
            return (
              <text key={i} x={W + 4} y={y + 3} fill="#475569" fontSize="8" fontFamily="monospace">
                {label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Volume label */}
      <p className="pb-3 pl-5 text-xs text-gray-600">Volume (24H)</p>
    </div>
  );
}
