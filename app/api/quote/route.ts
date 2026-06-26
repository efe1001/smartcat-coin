import { NextRequest, NextResponse } from "next/server";
import { JUPITER_QUOTE_API } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params = new URLSearchParams({
    inputMint: searchParams.get("inputMint") ?? "",
    outputMint: searchParams.get("outputMint") ?? "",
    amount: searchParams.get("amount") ?? "",
    slippageBps: searchParams.get("slippageBps") ?? "50",
  });

  try {
    const res = await fetch(`${JUPITER_QUOTE_API}?${params.toString()}`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.error ?? "Quote failed" }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to reach Jupiter API" }, { status: 502 });
  }
}
