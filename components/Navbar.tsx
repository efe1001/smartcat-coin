"use client";

import { useMockWallet } from "@/components/MockWalletProvider";
import { TOKEN_NAME, TOKEN_SYMBOL } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Trade",       href: "#swap" },
  { label: "Chart",       href: "#chart" },
  { label: "Tokenomics",  href: "#info" },
  { label: "Explorer",    href: "https://solscan.io", external: true },
];

export default function Navbar() {
  const { shortAddress } = useMockWallet();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[#04080f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative animate-float">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-xl shadow-lg shadow-orange-500/30">
              🐱
            </div>
            <div className="absolute -inset-1 rounded-xl bg-orange-500/20 blur-md -z-10" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-white">{TOKEN_NAME}</p>
            <p className="font-mono text-xs text-orange-400">${TOKEN_SYMBOL}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Social icons */}
          <div className="hidden items-center gap-1 md:flex">
            <a href="#" aria-label="Twitter" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.265 5.643 5.9-5.643zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" aria-label="Telegram" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
          </div>

          <div className="hidden h-5 w-px bg-white/10 md:block" />

          {/* Wallet badge */}
          <div className="flex items-center gap-2 rounded-xl border border-purple-500/25 bg-purple-500/10 px-3 py-2">
            <span className="text-base leading-none">👻</span>
            <span className="font-mono text-sm font-medium text-purple-300">{shortAddress}</span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400 shadow shadow-green-400/50" />
          </div>
        </div>
      </div>
    </header>
  );
}
