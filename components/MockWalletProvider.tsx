"use client";

import { createContext, useContext, ReactNode } from "react";
import { PublicKey } from "@solana/web3.js";

const MOCK_ADDRESS = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";

interface MockWallet {
  connected: boolean;
  publicKey: PublicKey;
  connecting: boolean;
  shortAddress: string;
}

const MockWalletContext = createContext<MockWallet>({
  connected: true,
  publicKey: new PublicKey(MOCK_ADDRESS),
  connecting: false,
  shortAddress: `${MOCK_ADDRESS.slice(0, 4)}...${MOCK_ADDRESS.slice(-4)}`,
});

export function useMockWallet() {
  return useContext(MockWalletContext);
}

export default function MockWalletProvider({ children }: { children: ReactNode }) {
  const wallet: MockWallet = {
    connected: true,
    publicKey: new PublicKey(MOCK_ADDRESS),
    connecting: false,
    shortAddress: `${MOCK_ADDRESS.slice(0, 4)}...${MOCK_ADDRESS.slice(-4)}`,
  };

  return (
    <MockWalletContext.Provider value={wallet}>
      {children}
    </MockWalletContext.Provider>
  );
}
