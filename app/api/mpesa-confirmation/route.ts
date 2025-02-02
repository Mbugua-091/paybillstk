import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log("Payment Confirmation:", data);

  return NextResponse.json({ message: "Confirmation Received" });
}
