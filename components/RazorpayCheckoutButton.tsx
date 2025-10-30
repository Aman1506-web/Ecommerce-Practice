"use client";

import { Button } from "./ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import type { UserResource } from "@clerk/types";

/* ------------------------------------------------------ */
/* 🔹 Razorpay Type Declarations                          */
/* ------------------------------------------------------ */

interface RazorpayWindow extends Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}
declare const window: RazorpayWindow;

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme?: {
    color: string;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/* ------------------------------------------------------ */
/* 🔹 Data Types                                           */
/* ------------------------------------------------------ */

interface CartItem {
  _id: Id<"cart">;
  title: string;
  price: number;
  quantity: number;
}

type RazorpayButtonProps = {
  total: number;
  user: UserResource | null; // ✅ matches Clerk's real user type
  cart: CartItem[];
};

/* ------------------------------------------------------ */
/* 🔹 Component                                            */
/* ------------------------------------------------------ */

export default function RazorpayCheckoutButton({
  total,
  user,
  cart,
}: RazorpayButtonProps) {
  const router = useRouter();

  // convex mutations
  const saveOrder = useMutation(api.orders.saveOrder);
  const clearCart = useMutation(api.cart.clearCart);

  // main checkout handler
  const handleCheckout = async () => {
    // create Razorpay order via backend route
    const res = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(Number(total) * 100) }),
    });

    const data = await res.json();
    console.log("🧾 Razorpay Order Response:", data);

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
      amount: data.amount,
      currency: data.currency,
      name: "MY Store",
      description: "Order Payment",
      order_id: data.id,

      handler: async (response: RazorpayResponse) => {
        alert("🎉 Payment Successful!");
        console.log(response);

        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyRes.json();
        console.log("Verification result", verifyData);

        if (verifyData.success) {
          alert("✅ Payment Verified Successfully!");

          // save order in DB
          await saveOrder({
            userId: user?.id || "guest", // ✅ safe fallback
            paymentId: response.razorpay_payment_id,
            amount: total,
            timestamp: Date.now(),
            products: cart.map((item) => ({
              productId: item._id,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
            })),
          });

          alert("🧾 Order Saved Successfully!");
          await clearCart({ userId: user?.id || "guest" });
          alert("🛒 Cart Cleared!");
          router.push(`/success?paymentId=${response.razorpay_payment_id}`);
        } else {
          alert("❌ Payment Verification Failed");
        }
      },

      prefill: {
        name: user?.fullName ?? "Guest",
        email: user?.primaryEmailAddress?.emailAddress ?? "",
      },

      theme: {
        color: "#22c55e",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <Button
      onClick={handleCheckout}
      className="bg-green-600 hover:bg-green-800 text-white w-full text-center rounded-2xl font-bold"
    >
      Pay ₹{total}
    </Button>
  );
}
