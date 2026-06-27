"use client";

import { useState, useEffect, useCallback } from "react";
import { useMockWallet } from "@/components/MockWalletProvider";
import Toast, { useToast } from "@/components/Toast";
import { getQuote, formatTokenAmount, QuoteResponse } from "@/lib/jupiter";
import { SOL_MINT, TOKEN_MINT, TOKEN_SYMBOL, DEFAULT_SLIPPAGE_BPS, IS_MOCK_MODE } from "@/lib/constants";

const isMockMint = IS_MOCK_MODE;
const MOCK_RATE = 24_500; // SMCAT per SOL

function buildMockQuote(inputMint: string, outputMint: string, sol: number, slippageBps: number): QuoteResponse {
  const out = inputMint === SOL_MINT
    ? Math.round(sol * MOCK_RATE * 1e6)
    : Math.round((sol / MOCK_RATE) * 1e9);
  return {
    inputMint, inAmount: String(Math.round(sol * 1e9)), outputMint, outAmount: String(out),
    priceImpactPct: "0.0012", routePlan: [], slippageBps, otherAmountThreshold: "0", swapMode: "ExactIn"
  };
}

const SLIPPAGE_PRESETS = [{ label: "0.5%", bps: 50 }, { label: "1%", bps: 100 }, { label: "2%", bps: 200 }];

export default function SwapCard() {
  const { publicKey } = useMockWallet();
  const { toast, show: showToast, hide: hideToast } = useToast();

  const [isBuy, setIsBuy]               = useState(true);
  const [payAmount, setPayAmount]        = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [slippageBps, setSlippageBps]   = useState(DEFAULT_SLIPPAGE_BPS);
  const [customSlippage, setCustomSlippage] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [quote, setQuote]               = useState<QuoteResponse | null>(null);
  const [loading, setLoading]           = useState(false);
  const [flipping, setFlipping]         = useState(false);
  const [txState, setTxState]           = useState<"idle"|"confirm"|"success">("idle");
  const [error, setError]               = useState<string|null>(null);

  const inputMint  = isBuy ? SOL_MINT   : TOKEN_MINT;
  const outputMint = isBuy ? TOKEN_MINT : SOL_MINT;
  const payLabel   = isBuy ? "SOL"      : TOKEN_SYMBOL;
  const recvLabel  = isBuy ? TOKEN_SYMBOL : "SOL";

  // Compute live rate from quote, fallback to MOCK_RATE
  const rate = (() => {
    if (quote) {
      const inAmt  = parseFloat(quote.inAmount);
      const outAmt = parseFloat(quote.outAmount);
      if (isBuy) {
        const solAmt  = inAmt / 1e9;
        const smcatAmt = outAmt / 1e6;
        return `1 SOL = ${(smcatAmt / solAmt).toFixed(0)} ${TOKEN_SYMBOL}`;
      } else {
        const smcatAmt = inAmt / 1e6;
        const solAmt   = outAmt / 1e9;
        return `1 ${TOKEN_SYMBOL} = ${(solAmt / smcatAmt).toFixed(8)} SOL`;
      }
    }
    return isBuy
      ? `1 SOL = ${MOCK_RATE.toLocaleString()} ${TOKEN_SYMBOL}`
      : `1 ${TOKEN_SYMBOL} = ${(1 / MOCK_RATE).toFixed(8)} SOL`;
  })();

  // Min received = outAmount * (1 - slippage%)
  const minReceived = quote
    ? formatTokenAmount(
        String(Math.floor(parseFloat(quote.outAmount) * (1 - slippageBps / 10_000))),
        isBuy ? 6 : 9
      )
    : null;

  // Auto-quote on input change (debounced 500ms)
  useEffect(() => {
    setQuote(null);
    setReceiveAmount("");
    setError(null);
    if (!payAmount || isNaN(Number(payAmount)) || Number(payAmount) <= 0) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        if (isMockMint) {
          await new Promise(r => setTimeout(r, 400));
          const q = buildMockQuote(inputMint, outputMint, Number(payAmount), slippageBps);
          setQuote(q);
          setReceiveAmount(formatTokenAmount(q.outAmount, isBuy ? 6 : 9));
        } else {
          const lamports = Math.round(Number(payAmount) * 1e9);
          const q = await getQuote(inputMint, outputMint, lamports, slippageBps);
          setQuote(q);
          setReceiveAmount(formatTokenAmount(q.outAmount, isBuy ? 6 : 9));
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Quote failed");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [payAmount, isBuy, slippageBps]);

  const handleFlip = () => {
    setFlipping(true);
    setTimeout(() => {
      setIsBuy(b => !b);
      setPayAmount("");
      setReceiveAmount("");
      setQuote(null);
      setError(null);
      setFlipping(false);
    }, 200);
  };

  const handleSwap = useCallback(() => {
    if (!quote) return;
    setTxState("confirm");
    setTimeout(() => {
      setTxState("success");
      setPayAmount("");
      setReceiveAmount("");
      setQuote(null);
      showToast(
        `${isBuy ? "Buy" : "Sell"} confirmed! ${receiveAmount} ${recvLabel} received.`,
        "success",
        { label: "View on Solscan", href: "https://solscan.io" }
      );
    }, 1500);
  }, [quote, isBuy, receiveAmount, recvLabel, showToast]);

  const handleCustomSlippage = (val: string) => {
    setCustomSlippage(val);
    const n = parseFloat(val);
    if (!isNaN(n) && n >= 0.1 && n <= 50) {
      setSlippageBps(Math.round(n * 100));
    }
  };

  const priceImpact = quote ? parseFloat(quote.priceImpactPct) * 100 : null;
  const impactColor = !priceImpact ? "" : priceImpact < 1 ? "text-green-400" : priceImpact < 3 ? "text-yellow-400" : "text-red-400";
  const isPresetSlippage = SLIPPAGE_PRESETS.some(p => p.bps === slippageBps);

  return (
    <>
      <div id="swap" className="grad-border rounded-2xl">
        <div className="glass rounded-2xl p-5">

          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Swap</h3>
            <button
              onClick={() => setShowSettings(s => !s)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/8 hover:text-white ${showSettings ? "bg-white/8 text-white" : ""}`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
              </svg>
            </button>
          </div>

          {/* Settings panel */}
          {showSettings && (
            <div className="mb-4 rounded-xl border border-white/8 bg-white/[0.03] p-3">
              <p className="mb-2 text-xs text-gray-400">Slippage Tolerance</p>
              <div className="flex flex-wrap gap-2">
                {SLIPPAGE_PRESETS.map(opt => (
                  <button
                    key={opt.bps}
                    onClick={() => { setSlippageBps(opt.bps); setCustomSlippage(""); }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${slippageBps === opt.bps && isPresetSlippage ? "bg-orange-500 text-white" : "bg-white/5 text-gray-400 hover:text-white"}`}
                  >
                    {opt.label}
                  </button>
                ))}
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0.1"
                    max="50"
                    step="0.1"
                    placeholder="Custom %"
                    value={customSlippage}
                    onChange={e => handleCustomSlippage(e.target.value)}
                    className={`w-24 rounded-lg border bg-white/5 px-3 py-1.5 text-xs text-white placeholder-gray-600 outline-none transition focus:border-orange-500/50 ${!isPresetSlippage && customSlippage ? "border-orange-500 bg-orange-500/10" : "border-white/10"}`}
                  />
                </div>
              </div>
              {!isPresetSlippage && customSlippage && (
                <p className="mt-1.5 text-[10px] text-orange-400">Custom slippage: {(slippageBps / 100).toFixed(1)}%{slippageBps > 200 ? " — High slippage may result in a worse rate" : ""}</p>
              )}
            </div>
          )}

          {/* YOU PAY */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 transition hover:border-white/[0.12]">
            <p className="mb-2 text-xs font-medium text-gray-500">You Pay</p>
            <div className="flex items-center gap-3">
              <div className="flex shrink-0 items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                <span className="text-base">{isBuy ? "◎" : "🐱"}</span>
                <span className="text-sm font-bold text-white">{payLabel}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-500">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={payAmount}
                onChange={e => { setPayAmount(e.target.value); setTxState("idle"); }}
                className="swap-input min-w-0 flex-1 rounded-xl bg-transparent px-3 py-2 text-right text-xl font-bold text-white placeholder-gray-700"
              />
            </div>
            <p className="mt-2 text-right text-xs text-gray-600">
              {payAmount && !isNaN(Number(payAmount)) && Number(payAmount) > 0
                ? `≈ $${(Number(payAmount) * 168.32).toFixed(2)}`
                : "Enter amount"}
            </p>
          </div>

          {/* Flip button */}
          <div className="relative z-10 my-2 flex justify-center">
            <button
              onClick={handleFlip}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#04080f] text-gray-400 shadow-lg transition hover:border-orange-500/50 hover:text-orange-400 ${flipping ? "rotate-180" : ""}`}
              style={{ transition: "transform 0.2s ease, color 0.2s, border-color 0.2s" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
            </button>
          </div>

          {/* YOU RECEIVE */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 transition hover:border-white/[0.12]">
            <p className="mb-2 text-xs font-medium text-gray-500">You Receive</p>
            <div className="flex items-center gap-3">
              <div className="flex shrink-0 items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                <span className="text-base">{isBuy ? "🐱" : "◎"}</span>
                <span className="text-sm font-bold text-white">{recvLabel}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-500">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              <div className="flex-1 text-right">
                {loading ? (
                  <div className="skeleton ml-auto h-7 w-32 rounded-lg" />
                ) : (
                  <p className={`text-xl font-bold ${receiveAmount ? "text-white" : "text-gray-700"}`}>
                    {receiveAmount || "—"}
                  </p>
                )}
              </div>
            </div>
            <p className="mt-2 text-right text-xs text-gray-600">{rate}</p>
          </div>

          {/* Quote details */}
          {quote && !loading && (
            <div className="mt-3 space-y-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Price Impact</span>
                <span className={`font-semibold ${impactColor}`}>
                  {priceImpact !== null ? `${priceImpact.toFixed(3)}%` : "—"}
                  {priceImpact !== null && priceImpact < 1 && " ✓"}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Min Received</span>
                <span className="font-semibold text-gray-300">{minReceived} {recvLabel}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Route</span>
                <span className="font-semibold text-gray-300">{payLabel} → {recvLabel}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Network Fee</span>
                <span className="font-semibold text-gray-300">~$0.001</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Slippage</span>
                <span className="font-semibold text-gray-300">{(slippageBps / 100).toFixed(1)}%</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Wallet badge */}
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-purple-500/15 bg-purple-500/5 px-3 py-2 text-xs text-purple-400">
            <span>👻</span>
            <span className="font-mono">{publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-4)}</span>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            <span className="ml-auto text-purple-500">Phantom</span>
          </div>

          {/* CTA Button */}
          <button
            onClick={txState === "confirm" ? undefined : handleSwap}
            disabled={!quote || loading || txState === "confirm"}
            className={`mt-3 w-full rounded-xl py-3.5 font-bold text-white transition disabled:cursor-not-allowed ${
              txState === "confirm"
                ? "cursor-wait bg-gray-700 text-gray-400"
                : isBuy
                ? "btn-swap"
                : "btn-sell"
            }`}
          >
            {txState === "confirm"
              ? "Confirming…"
              : !quote && !loading && !payAmount
              ? `Enter amount to ${isBuy ? "buy" : "sell"}`
              : loading
              ? "Getting best rate…"
              : !quote
              ? `Enter amount to ${isBuy ? "buy" : "sell"}`
              : isBuy
              ? `Buy ${TOKEN_SYMBOL}`
              : `Sell ${TOKEN_SYMBOL}`}
          </button>

          <p className="mt-2 text-center text-[10px] text-gray-700">
            Powered by Jupiter Aggregator · Best price guaranteed
          </p>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
        action={toast.action}
      />
    </>
  );
}
