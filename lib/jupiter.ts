import { JUPITER_QUOTE_API, JUPITER_SWAP_API, DEFAULT_SLIPPAGE_BPS } from "./constants";

export interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  priceImpactPct: string;
  routePlan: unknown[];
  slippageBps: number;
  otherAmountThreshold: string;
  swapMode: string;
  contextSlot?: number;
  timeTaken?: number;
}

export async function getQuote(
  inputMint: string,
  outputMint: string,
  amountLamports: number,
  slippageBps = DEFAULT_SLIPPAGE_BPS
): Promise<QuoteResponse> {
  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: amountLamports.toString(),
    slippageBps: slippageBps.toString(),
  });

  const res = await fetch(`/api/quote?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to fetch quote");
  }
  return res.json();
}

export async function getSwapTransaction(
  quoteResponse: QuoteResponse,
  userPublicKey: string
): Promise<string> {
  const res = await fetch("/api/swap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quoteResponse, userPublicKey }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to get swap transaction");
  }
  const data = await res.json();
  return data.swapTransaction as string;
}

export function lamportsFromSol(sol: number): number {
  return Math.round(sol * 1e9);
}

export function formatTokenAmount(raw: string, decimals = 6): string {
  const val = Number(raw) / 10 ** decimals;
  return val.toLocaleString("en-US", { maximumFractionDigits: 4 });
}
