import { NextRequest, NextResponse } from "next/server";

const MPESA_STK_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
const MPESA_PASSKEY = process.env.MPESA_PASSKEY!;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE!;
const MPESA_ACCESS_TOKEN = process.env.MPESA_ACCESS_TOKEN!;
const CALLBACK_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa-confirmation`;

export async function POST(req: NextRequest) {
  const { phone, amount } = await req.json();

  const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString("base64");

  const response = await fetch(MPESA_STK_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MPESA_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: CALLBACK_URL,
      AccountReference: "KCB-PayBill",
      TransactionDesc: "Payment",
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
