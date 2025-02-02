"use client";
import { useState } from "react";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    await fetch("/api/stk-push", {
      method: "POST",
      body: JSON.stringify({ phone, amount }),
    });
    alert("STK Push sent!");
  };

  return (
    <div>
      <input placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} />
      <input placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
}
