import { NextRequest, NextResponse } from "next/server";

const SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();

    if (!address || typeof address !== "string") {
      return NextResponse.json({ ok: false, error: "Wallet address is required." }, { status: 400 });
    }

    if (!SOLANA_ADDRESS.test(address.trim())) {
      return NextResponse.json({ ok: false, error: "Invalid Solana wallet address." }, { status: 400 });
    }

    // In mock mode: validate only, no DB storage yet
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}
