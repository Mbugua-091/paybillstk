import { NextResponse } from "next/server";

const MPESA_AUTH_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;

export async function GET() {
  try {
    const credentials = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");

    const response = await fetch(MPESA_AUTH_URL, {
      method: "GET",
      headers: { Authorization: `Basic ${credentials}` },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error:unknown) {
    console.error("Unknown error:", error);
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }
}
