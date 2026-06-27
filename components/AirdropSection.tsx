"use client";

import { useState } from "react";
import Toast, { useToast } from "@/components/Toast";
import { TOKEN_SYMBOL } from "@/lib/constants";

const SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const MOCK_COUNT = "2,847";

export default function AirdropSection() {
  const [address, setAddress]     = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { toast, show: showToast, hide: hideToast } = useToast();

  const validate = (val: string) => {
    if (!val) return "Enter your Solana wallet address.";
    if (!SOLANA_ADDRESS.test(val.trim())) return "Invalid Solana address — check and try again.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(address.trim());
    if (err) { setError(err); return; }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/airdrop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: address.trim() }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setConfirmed(true);
        setAddress("");
        showToast(`You're on the ${TOKEN_SYMBOL} airdrop list!`, "success");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="mt-6">
        <div className="grad-border rounded-2xl">
          <div className="glass rounded-2xl px-6 py-8 md:px-10">

            {/* Header row */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-xl">🪂</span>
                  <h2 className="text-xl font-extrabold text-white">
                    {TOKEN_SYMBOL}{" "}
                    <span className="gradient-text">Airdrop</span>
                  </h2>
                </div>
                <p className="text-sm text-slate-400">
                  Be early. Get rewarded. Register your wallet to receive free{" "}
                  <span className="font-semibold text-orange-400">${TOKEN_SYMBOL}</span> tokens at launch.
                </p>
              </div>

              {/* Counter */}
              <div className="shrink-0 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-3 text-center">
                <p className="font-mono text-2xl font-black text-white">{MOCK_COUNT}</p>
                <p className="text-xs text-slate-500">wallets registered</p>
              </div>
            </div>

            {/* Confirmed state */}
            {confirmed ? (
              <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-500/20 text-lg text-green-400">✓</span>
                <div>
                  <p className="font-semibold text-green-300">You&apos;re on the list!</p>
                  <p className="text-xs text-green-500">We&apos;ll airdrop {TOKEN_SYMBOL} to your wallet at launch. Stay tuned.</p>
                </div>
                <button
                  onClick={() => setConfirmed(false)}
                  className="ml-auto text-xs text-green-600 underline hover:text-green-400"
                >
                  Register another
                </button>
              </div>
            ) : (
              <>
                {/* Example address — outside form */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs text-slate-500">Try example:</span>
                  <button
                    onClick={() => { setAddress("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"); setError(""); }}
                    className="cursor-pointer rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-1.5 font-mono text-xs text-orange-400 hover:bg-orange-500/10"
                  >
                    7xKXtg...sU →
                  </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter your Solana wallet address..."
                      value={address}
                      onChange={e => { setAddress(e.target.value); setError(""); }}
                      spellCheck={false}
                      autoComplete="off"
                      className={`w-full rounded-xl border bg-white/[0.03] px-4 py-3 font-mono text-sm text-white placeholder-gray-600 outline-none transition focus:bg-white/[0.05] ${
                        error
                          ? "border-red-500/40 focus:border-red-500/60"
                          : "border-white/[0.08] focus:border-orange-500/40"
                      }`}
                    />
                    {error && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                        {error}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !address}
                    className="btn-swap shrink-0 rounded-xl px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                        Joining…
                      </span>
                    ) : "Join Airdrop"}
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-slate-600">
                  🔒 Your address is only used for the airdrop. Never shared. Airdrop date TBA.
                </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />
    </>
  );
}
