"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";

export default function CartPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const cart = useQuery(
    api.cart.getUserCart,
    user ? { userId: user.id } : "skip"
  );

  const updateQuantity = useMutation(api.cart.updateQuantity);
  const remove = useMutation(api.cart.removeFromcart);
  const total = cart?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // ✅ Redirect only inside useEffect
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // ✅ Loading or redirect state: show nothing
  if (!isLoaded || !isSignedIn) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🛒 Your Cart</h1>
      {!cart ? (
        <h1>Loading...</h1>
      ) : cart.length === 0 ? (
        <p>Your cart is Empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between border p-4 rounded"
            >
              <div>
                <h2 className="font-bold">{item.title}</h2>
                <p>Quantity: {item.quantity}</p>
              </div>
              <div>
                <p className="text-green-600 font-bold">
                  ₹{item.price * item.quantity}
                </p>

                <Button
                  onClick={() =>
                    item.quantity === 1
                      ? remove({ id: item._id })
                      : updateQuantity({
                          id: item._id,
                          quantity: item.quantity - 1,
                        })
                  }
                  variant="destructive"
                >
                  -
                </Button>
                <span>{item.quantity}</span>
                <Button
                  onClick={() =>
                    updateQuantity({
                      id: item._id,
                      quantity: item.quantity + 1,
                    })
                  }
                  className="bg-green-500"
                >
                  +
                </Button>
              </div>
            </div>
          ))}
          <p className="text-right text-xl font-bold mt-4 text-green-700 ">
            Total: ₹{total}
          </p>
          {/* ✅ Razorpay Checkout */}
          {typeof total === "number" && total > 0 && (
            <div className="mt-4 ">
              <RazorpayCheckoutButton cart={cart} total={total} user={user} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// hmne useEffect mein isliye rkha h bcoz render ke time hm router.push nhi kr sakte isiliye useEffect mein rkhte h ki it will run after render - this is best practice

// ✅ Conclusion: Remember These 5 Golden Rules
// Hooks always at top-level

// Never call hooks inside if/loop

// Data inside hooks can be conditional

// useEffect() is for side-effects (router, fetch, timers...)

// Never change state (router.push, setState) during render
