import { NextResponse } from "next/server";

const MPESA_REGISTER_URL = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
const SHORTCODE = process.env.MPESA_SHORTCODE!;
const CONFIRMATION_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/mpesa-confirmation`;

// Fetch the MPESA token from the /api/get-token endpoint
async function fetchMpesaAccessToken() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-token`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch MPESA access token");
    }

    const data = await response.json();
    return data.access_token; // Assuming the response contains the access token
  } catch (error) {
    console.error("Error fetching MPESA access token:", error);
    throw new Error("Failed to fetch MPESA access token");
  }
}

export async function GET() {
  try {
    // Dynamically fetch the access token from the get-token API
    const mpesaAccessToken = await fetchMpesaAccessToken();

    // Make the request to register the URL
    const response = await fetch(MPESA_REGISTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mpesaAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ShortCode: SHORTCODE,
        ResponseType: "Completed", // Ensures transactions complete even if the confirmation URL is unreachable
        ConfirmationURL: CONFIRMATION_URL, // Only provide the confirmation URL
        // Removed ValidationURL completely
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Unknown error:", error);
    return NextResponse.json({ error: "Failed to register URL" }, { status: 500 });
  }
}
