import { NextResponse } from "next/server";

const MPESA_AUTH_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;

// Variable to store token and its expiration time
let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

const TOKEN_EXPIRATION_TIME = 3600 * 1000; // 1 hour in milliseconds

// Function to fetch a new token from MPESA
async function fetchToken() {
  try {
    const credentials = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");

    const response = await fetch(MPESA_AUTH_URL, {
      method: "GET",
      headers: { Authorization: `Basic ${credentials}` },
    });

    const data = await response.json();
    if (data.access_token && data.expires_in) {
      cachedToken = data.access_token;
      tokenExpiration = Date.now() + data.expires_in * 1000; // Store expiration time
      return cachedToken;
    } else {
      throw new Error("Failed to get valid token.");
    }
  } catch (error) {
    console.error("Error fetching token:", error);
    throw new Error("Failed to get token");
  }
}

// Function to get the current token, refreshing it if expired
async function getToken() {
  if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
    // Token is still valid
    return cachedToken;
  } else {
    // Token has expired or doesn't exist, fetch a new one
    return await fetchToken();
  }
}

export async function GET() {
  try {
    const token = await getToken(); // Get the token (either cached or freshly generated)

    return NextResponse.json({ access_token: token });
  } catch (error: unknown) {
    console.error("Error in token retrieval:", error);
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }
}
