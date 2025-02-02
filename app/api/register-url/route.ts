import { NextResponse } from "next/server";

const MPESA_REGISTER_URL = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
const MPESA_ACCESS_TOKEN = process.env.MPESA_ACCESS_TOKEN!;
const SHORTCODE = process.env.MPESA_SHORTCODE!;
const CONFIRMATION_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa-confirmation`;

export async function GET() {
  try {
    const response = await fetch(MPESA_REGISTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MPESA_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ShortCode: SHORTCODE,
        ResponseType: "Completed", // Ensures transactions complete even if the confirmation URL is unreachable
        ConfirmationURL: CONFIRMATION_URL, 
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to register URL" }, { status: 500 });
  }
}
