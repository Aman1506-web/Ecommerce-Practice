"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function GuestCartPage() {
  const { isLoaded, isSignedIn } = useUser();
  // items from usecartStore
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  //router
  const router = useRouter();

  // total price of items using array reduce function
  // reduce(callback function, initial value)
  const total = items.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/cart");
    }
  }, [isLoaded, isSignedIn, router]);

  if (isLoaded && isSignedIn) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🛒 Guest Cart</h1>
      {items.map((item) => (
        <div
          key={item._id}
          className="border p-4 rounded flex items-center gap-4"
        >
          {/* Left side: Image */}
          <Image
            src={item.image}
            alt={item.title}
            width={80}
            height={80}
            className="object-cover rounded"
          />

          {/*  Right side: Title, Quantity, Price */}
          <div className="flex justify-between w-full">
            <div>
              <h2 className="font-bold">{item.title}</h2>
              <p>Quantity: {item.quantity}</p>
            </div>

            <div className="font-bold text-green-600">
              ₹{item.price * (item.quantity || 1)}
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => decreaseQuantity(item._id)}>-</Button>
              <span>{item.quantity}</span>
              <Button onClick={() => increaseQuantity(item._id)}>+</Button>
            </div>
          </div>
        </div>
      ))}
      <div className="text-right mt-4">
        <p className="text-xl font-bold text-green-600">Total : ₹{total}</p>
      </div>
      <Button
        className="mt-2 font-xl w-full bg-green-600"
        onClick={() => router.push("/sign-in")}
      >
        Checkout
      </Button>
    </div>
  );
}
