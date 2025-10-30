"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {isLoaded, isSignedIn} = useUser();

  const [valid, setValid] = useState(false);
  const [paymentId, setPaymentId] = useState("");


  useEffect(() => {
    const id = searchParams.get("paymentId");
    if (!id) {
      notFound(); // Show 404 if no payment ID
    } else {
      setPaymentId(id);
      setValid(true);
    }
  }, [searchParams, isLoaded, isSignedIn]);

    // FIX: wait until clerk is fully loaded
  if(!isLoaded) return null;
  if(!isSignedIn) return notFound();
  if (!valid) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center animate-fade-in-up">
        <div className="text-green-600 text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-800">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">
          Your payment has been processed successfully.
        </p>
        <div className="bg-gray-100 text-gray-800 font-mono rounded-xl py-2 px-4 mt-4 text-sm break-words">
          Payment ID: <br />
          <span className="text-blue-600">{paymentId}</span>
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 px-6 rounded-xl"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
