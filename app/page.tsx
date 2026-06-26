import Navbar from "@/components/Navbar";
import MarqueeBar from "@/components/MarqueeBar";
import TokenStats from "@/components/TokenStats";
import PriceChart from "@/components/PriceChart";
import SwapCard from "@/components/SwapCard";
import { TOKEN_NAME, TOKEN_SYMBOL } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarqueeBar />
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">

        {/* Hero */}
        <section className="animate-fadeInUp mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-1.5 text-xs font-medium text-orange-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
            Live on Solana · Powered by Jupiter
          </div>
          <h1 className="mb-3 text-5xl font-extrabold tracking-tight text-white md:text-6xl">
            Trade{" "}
            <span className="gradient-text">{TOKEN_NAME}</span>
          </h1>
          <p className="mx-auto max-w-md text-base text-slate-400">
            Buy and sell <span className="font-semibold text-orange-400">${TOKEN_SYMBOL}</span> instantly.
            Best price across all Solana DEXes via Jupiter aggregation.
          </p>
        </section>

        {/* Stats */}
        <section className="mb-6">
          <TokenStats />
        </section>

        {/* Chart + Swap */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
          <PriceChart />
          <SwapCard />
        </section>

        {/* Token info */}
        <section id="info" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: "🔒",
              title: "Liquidity Locked",
              desc: "100% of liquidity locked for 180 days. Verified on Raydium.",
              accent: "text-green-400",
              bg: "bg-green-500/5 border-green-500/10",
            },
            {
              icon: "🔥",
              title: "Deflationary Supply",
              desc: "2% of every transaction is burned, reducing supply forever.",
              accent: "text-orange-400",
              bg: "bg-orange-500/5 border-orange-500/10",
            },
            {
              icon: "🌐",
              title: "Community Owned",
              desc: "No team allocation. 100% of tokens distributed to the community.",
              accent: "text-purple-400",
              bg: "bg-purple-500/5 border-purple-500/10",
            },
          ].map((item) => (
            <div key={item.title} className={`glass-card rounded-2xl border p-5 ${item.bg}`}>
              <div className="mb-3 text-2xl">{item.icon}</div>
              <h3 className={`mb-1 font-bold ${item.accent}`}>{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* How to buy */}
        <section className="mt-6 glass-card rounded-2xl p-6">
          <h2 className="mb-5 text-xl font-bold text-white">How to Buy {TOKEN_SYMBOL}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {[
              { step: "01", title: "Get a Wallet",  desc: "Download Phantom or Solflare from their official sites." },
              { step: "02", title: "Buy SOL",        desc: "Purchase SOL on any exchange and send to your wallet." },
              { step: "03", title: "Connect",        desc: "Click the wallet button and connect to this page." },
              { step: "04", title: "Swap",           desc: "Enter the amount of SOL and confirm your swap." },
            ].map((s) => (
              <div key={s.step} className="relative pl-10">
                <span className="absolute left-0 top-0 font-mono text-3xl font-black text-white/5">{s.step}</span>
                <h4 className="mb-1 font-semibold text-white">{s.title}</h4>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-white/[0.05] py-6">
        <div className="mx-auto max-w-7xl px-4 flex flex-col items-center gap-2 text-center text-xs text-slate-600 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {TOKEN_NAME}. All rights reserved.</p>
          <p>
            Swaps powered by{" "}
            <a href="https://jup.ag" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">Jupiter</a>
            {" "}· Built on{" "}
            <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">Solana</a>
          </p>
          <p className="text-slate-700">DYOR · Not financial advice</p>
        </div>
      </footer>
    </div>
  );
}
