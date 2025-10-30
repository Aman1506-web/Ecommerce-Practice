import { Button } from "./ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

type Props = {
  total: number;
  user: any; // clerk user
  cart: any[];
};


export default function RazorpayCheckoutButton({ total, user, cart }: Props) {

  //router
  const router = useRouter();

  // convex functions
  const saveOrder = useMutation(api.orders.saveOrder);
  const clearCart = useMutation(api.cart.clearCart);

  // handleCheckout : main function which contains all
  const handleCheckout = async () => {
    // handle POST req for order creation and give amount to backend and gets back order and order_id
    const res = await fetch("api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(Number(total) * 100) }),
    });

    // res obj from bckend
    const data = await res.json();
    console.log("🧾 Razorpay Order Response:", data);

    // create Options for checkout ui
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "MY Store",
      description: "Order Payment",
      order_id: data.id,

      // handler function: runs after payment
      handler: async function (response: any) {
        alert("🎉 Payment Successful!");
        console.log(response);
        console.log("payment_id:", response.razorpay_payment_id);
        console.log("order_id:", response.razorpay_order_id);
        console.log("razorpay signature:", response.razorpay_signature);

        //handle POST req for payment verification
        const verifyRes = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        // get res in json
        const verifyData = await verifyRes.json();
        console.log("Verification result", verifyData);

        //alert message if success true
        if (verifyData.success) {
          console.log("✅ Payment verified server-side.");
          alert("✅ Payment Verified Successfully!");

          // call mutation to save this order in database
          await saveOrder({
            userId: user.id,
            paymentId: response.razorpay_payment_id,
            amount:total,
            timestamp: Date.now(),
            products: cart.map((item:any) => ({
              productId: item._id,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
            }))
          })

          alert("🧾 Order Saved Successfully!")

          // Clear Cart after payment
          await clearCart({userId: user.id})

          alert("🛒 Cart cleared!");

          // take to success route
          router.push(`/success?paymentId=${response.razorpay_payment_id}`)

        } else {
          console.warn("❌ Signature mismatch detected.");
          alert("❌ Payment Verification Failed");
        }
      },

      // prefill details like name and email
      prefill: {
        name: user?.fullName || "Guest",
        email: user?.primaryEmailAddress?.emailAddress || "",
      },

      // theme like color
      theme: {
        color: "#22c55e",
      },
    };

    // open rzrpay checkout window using options
    const razor = new (window as any).Razorpay(options);
    razor.open();
  };

  return (
    <Button
      onClick={handleCheckout}
      className="bg-green-600 hover:bg-green-800 text-white w-full text-center rounded-2xlfont-bold"
    >
      Pay ₹{total}
    </Button>
  );
}
