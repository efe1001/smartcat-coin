"use client";

import { useState, useEffect, useRef } from "react";
import { useMockWallet } from "@/components/MockWalletProvider";
import { TOKEN_NAME, TOKEN_SYMBOL } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Trade",      href: "#swap" },
  { label: "Chart",      href: "#chart" },
  { label: "Tokenomics", href: "#info" },
  { label: "Explorer",   href: "https://solscan.io", external: true },
];

export default function Navbar() {
  const { publicKey, shortAddress } = useMockWallet();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [copied,   setCopied]     = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Close menu on resize to desktop
  useEffect(() => {
    function handleResize() { if (window.innerWidth >= 768) setMenuOpen(false); }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicKey.toBase58()).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="sticky top-0 z-50" ref={menuRef}>
      {/* Main bar */}
      <div className="border-b border-white/[0.05] bg-[#04080f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative animate-float">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-xl shadow-lg shadow-orange-500/30">
                🐱
              </div>
              <div className="absolute -inset-1 -z-10 rounded-xl bg-orange-500/20 blur-md" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none text-white">{TOKEN_NAME}</p>
              <p className="font-mono text-xs text-orange-400">${TOKEN_SYMBOL}</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(l => (
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

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Social — desktop only */}
            <div className="hidden items-center gap-1 md:flex">
              <a href="#" aria-label="Twitter" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.265 5.643 5.9-5.643zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="Telegram" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
              <div className="h-5 w-px bg-white/10" />
            </div>

            {/* Wallet badge with copy */}
            <button
              onClick={handleCopy}
              title="Click to copy address"
              className="flex items-center gap-2 rounded-xl border border-purple-500/25 bg-purple-500/10 px-3 py-2 transition hover:border-purple-500/40 hover:bg-purple-500/15"
            >
              <span className="text-base leading-none">👻</span>
              <span className="font-mono text-sm font-medium text-purple-300">
                {copied ? "Copied!" : shortAddress}
              </span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400 shadow shadow-green-400/50" />
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition hover:bg-white/5 hover:text-white md:hidden"
            >
              {menuOpen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="animate-slideDown border-b border-white/[0.05] bg-[#04080f]/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto max-w-7xl px-4 pb-4 pt-2">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noopener noreferrer" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="mt-3 flex items-center gap-3 border-t border-white/[0.05] pt-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.265 5.643 5.9-5.643zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
              <button
                onClick={handleCopy}
                className="ml-auto flex items-center gap-2 rounded-xl border border-purple-500/25 bg-purple-500/10 px-3 py-2 text-sm text-purple-300"
              >
                <span>👻</span>
                <span className="font-mono">{copied ? "Copied!" : shortAddress}</span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
