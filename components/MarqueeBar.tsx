"use client";

import { TOKEN_SYMBOL } from "@/lib/constants";

const ITEMS = [
  { label: `${TOKEN_SYMBOL}/SOL`, value: "$0.0000420", change: "+12.45%", up: true },
  { label: "SOL/USD",             value: "$168.32",    change: "+3.21%",  up: true },
  { label: "BTC/USD",             value: "$97,420",    change: "-0.84%",  up: false },
  { label: "ETH/USD",             value: "$3,812",     change: "+1.23%",  up: true },
  { label: `${TOKEN_SYMBOL} Holders`, value: "2,847",  change: "+124 today", up: true },
  { label: "24h Volume",          value: "$824K",      change: "+31%",    up: true },
  { label: "Liquidity",           value: "$412K",      change: "Locked",  up: true },
  { label: "Market Cap",          value: "$4.2M",      change: "+15%",    up: true },
];

const DOUBLED = [...ITEMS, ...ITEMS];

export default function MarqueeBar() {
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
