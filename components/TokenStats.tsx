"use client";

import { useEffect, useState } from "react";
import type { TokenStats as TokenStatsData } from "@/lib/dexscreener";
import { fetchTokenStats, formatUsd } from "@/lib/dexscreener";
import { TOKEN_MINT, TOKEN_SYMBOL } from "@/lib/constants";

const MOCK: TokenStatsData = {
  priceUsd: "0.00004200",
  priceChange24h: 12.45,
  volume24h: 824_300,
  liquidity: 412_000,
  marketCap: 4_200_000,
  pairAddress: "",
};

const isMockMint = !TOKEN_MINT || TOKEN_MINT.startsWith("PASTE");

function TrendIcon({ up }: { up: boolean }) {
  return up ? (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ) : (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

const ICONS = {
  price: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      <path d="M12 6v12M9 9h4.5a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3H15"/>
    </svg>
  ),
  change: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  volume: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="12" width="4" height="10" rx="1"/>
      <rect x="9" y="8" width="4" height="14" rx="1"/>
      <rect x="16" y="4" width="4" height="18" rx="1"/>
    </svg>
  ),
  liquidity: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/>
      <path d="M12 2c2.8 3 5 6.5 5 10"/>
      <path d="M20 4l-4 4 4 4"/>
    </svg>
  ),
};

interface CardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  up?: boolean;
  accentClass?: string;
  delay?: number;
}

function StatCard({ icon, label, value, sub, up, accentClass, delay = 0 }: CardProps) {
  return (
    <div
      className="glass-card animate-fadeInUp rounded-2xl p-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentClass ?? "bg-orange-500/10 text-orange-400"}`}>
          {icon}
        </div>
        {up !== undefined && (
          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${up ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
            <TrendIcon up={up} />
            {sub}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 font-mono text-xl font-bold text-white">{value}</p>
      {sub && up === undefined && (
        <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
      )}
    </div>
  );
}

export default function TokenStats() {
  const [stats, setStats] = useState<TokenStatsData>(MOCK);

  const load = async () => {
    if (isMockMint) return;
    const data = await fetchTokenStats(TOKEN_MINT);
    if (data) setStats(data);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000);
    return () => clearInterval(t);
  }, []);

  const up = stats.priceChange24h >= 0;
  const changeLabel = `${up ? "+" : ""}${stats.priceChange24h.toFixed(2)}%`;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        icon={ICONS.price}
        label={`${TOKEN_SYMBOL} Price`}
        value={`$${parseFloat(stats.priceUsd).toFixed(8)}`}
        sub="per token"
        accentClass="bg-orange-500/10 text-orange-400"
        delay={0}
      />
      <StatCard
        icon={ICONS.change}
        label="24h Change"
        value={changeLabel}
        sub={changeLabel}
        up={up}
        accentClass={up ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}
        delay={80}
      />
      <StatCard
        icon={ICONS.volume}
        label="24h Volume"
        value={formatUsd(stats.volume24h)}
        sub="traded today"
        accentClass="bg-purple-500/10 text-purple-400"
        delay={160}
      />
      <StatCard
        icon={ICONS.liquidity}
        label="Liquidity"
        value={formatUsd(stats.liquidity)}
        sub={formatUsd(stats.marketCap) + " mcap"}
        accentClass="bg-cyan-500/10 text-cyan-400"
        delay={240}
      />
    </div>
  );
}
