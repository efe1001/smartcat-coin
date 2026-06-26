import type { Metadata } from "next";
import "./globals.css";
import MockWalletProvider from "@/components/MockWalletProvider";

export const metadata: Metadata = {
  title: "Smartcat Coin | Buy & Sell SMCAT",
  description: "The official trading page for Smartcat Coin (SMCAT) on Solana.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-50">
        <MockWalletProvider>{children}</MockWalletProvider>
      </body>
    </html>
  );
}
