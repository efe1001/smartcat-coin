"use client";

import { useState, useEffect } from "react";
import { TOKEN_SYMBOL } from "@/lib/constants";

interface PriceData {
  usd: number;
  usd_24h_change: number;
}

interface Prices {
  solana?: PriceData | null;
  bitcoin?: PriceData | null;
  ethereum?: PriceData | null;
}

function fmt(n: number, decimals = 2) {
  return n >= 1000 ? n.toLocaleString("en-US", { maximumFractionDigits: 0 }) : n.toFixed(decimals);
}

function changeLabel(pct: number) {
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
}

export default function MarqueeBar() {
  const [prices, setPrices] = useState<Prices>({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/prices");
        if (res.ok) setPrices(await res.json());
      } catch { /* silent — show static fallback */ }
    }
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, []);

  const sol = prices.solana;
  const btc = prices.bitcoin;
  const eth = prices.ethereum;

  const ITEMS = [
    {
      label: `${TOKEN_SYMBOL}/SOL`,
      value: "$0.0000420",
      change: "+12.45%",
      up: true,
    },
    {
      label: "SOL/USD",
      value: sol ? `$${fmt(sol.usd)}` : "—",
      change: sol ? changeLabel(sol.usd_24h_change) : "—",
      up: sol ? sol.usd_24h_change >= 0 : true,
    },
    {
      label: "BTC/USD",
      value: btc ? `$${fmt(btc.usd)}` : "—",
      change: btc ? changeLabel(btc.usd_24h_change) : "—",
      up: btc ? btc.usd_24h_change >= 0 : false,
    },
    {
      label: "ETH/USD",
      value: eth ? `$${fmt(eth.usd)}` : "—",
      change: eth ? changeLabel(eth.usd_24h_change) : "—",
      up: eth ? eth.usd_24h_change >= 0 : true,
    },
    { label: `${TOKEN_SYMBOL} Holders`, value: "2,847",  change: "+124 today", up: true },
    { label: "24h Volume",             value: "$824K",   change: "+31%",       up: true },
    { label: "Liquidity",              value: "$412K",   change: "Locked",     up: true },
    { label: "Market Cap",             value: "$4.2M",   change: "+15%",       up: true },
  ];

  const DOUBLED = [...ITEMS, ...ITEMS];

  return (
    <div className="overflow-hidden border-b border-white/5 bg-white/[0.015] py-2">
      <div className="flex animate-marquee whitespace-nowrap">
        {DOUBLED.map((item, i) => (
          <div key={i} className="mx-6 flex items-center gap-2 text-xs">
            <span className="font-medium text-gray-400">{item.label}</span>
            <span className="font-mono font-semibold text-white">{item.value}</span>
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
              item.up ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            }`}>
              {item.change}
            </span>
            <span className="text-white/10">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
