"use client";

import { useState } from "react";
import { TOKEN_MINT, TOKEN_SYMBOL } from "@/lib/constants";

const isMockMint = !TOKEN_MINT || TOKEN_MINT.startsWith("PASTE");
const DISPLAY = isMockMint
  ? "TBA — Coming Soon"
  : `${TOKEN_MINT.slice(0, 8)}...${TOKEN_MINT.slice(-8)}`;

const SOLSCAN_URL = isMockMint
  ? null
  : `https://solscan.io/token/${TOKEN_MINT}`;

export default function ContractAddress() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (isMockMint) return;
    navigator.clipboard.writeText(TOKEN_MINT).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto mt-5 flex max-w-lg flex-col items-center gap-2 sm:flex-row sm:gap-0">
      <div className="flex w-full items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm sm:rounded-r-none sm:border-r-0">
        {/* CA label */}
        <span className="shrink-0 border-r border-white/[0.08] px-3 py-2.5 font-mono text-[11px] font-bold tracking-widest text-orange-400">
          CA
        </span>

        {/* Address */}
        <span
          className={`flex-1 select-all overflow-hidden text-ellipsis whitespace-nowrap px-3 py-2.5 font-mono text-sm ${
            isMockMint ? "text-gray-600 italic" : "text-white"
          }`}
          title={isMockMint ? undefined : TOKEN_MINT}
        >
          {DISPLAY}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex w-full shrink-0 sm:w-auto">
        <button
          onClick={handleCopy}
          disabled={isMockMint}
          title={isMockMint ? "Mint address not set yet" : "Copy contract address"}
          className={`flex flex-1 items-center justify-center gap-1.5 border px-4 py-2.5 text-xs font-semibold transition sm:flex-none sm:rounded-none sm:border-r-0 ${
            isMockMint
              ? "cursor-not-allowed border-white/[0.08] bg-white/[0.03] text-gray-700"
              : copied
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-white/[0.08] bg-white/[0.03] text-gray-400 hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy
            </>
          )}
        </button>

        {SOLSCAN_URL ? (
          <a
            href={SOLSCAN_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="View on Solscan"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-r-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-gray-400 transition hover:bg-white/[0.06] hover:text-white sm:flex-none"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Solscan
          </a>
        ) : (
          <span className="flex flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-r-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-gray-700 sm:flex-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Solscan
          </span>
        )}
      </div>
    </div>
  );
}
