export interface TokenStats {
  priceUsd: string;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  pairAddress: string;
}

export async function fetchTokenStats(mintAddress: string): Promise<TokenStats | null> {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${mintAddress}`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const pair = data?.pairs?.[0];
    if (!pair) return null;

    return {
      priceUsd: pair.priceUsd ?? "0",
      priceChange24h: pair.priceChange?.h24 ?? 0,
      volume24h: pair.volume?.h24 ?? 0,
      liquidity: pair.liquidity?.usd ?? 0,
      marketCap: pair.marketCap ?? 0,
      pairAddress: pair.pairAddress ?? "",
    };
  } catch {
    return null;
  }
}

export function formatUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}
