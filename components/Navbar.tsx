"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { useCartStore } from "@/lib/store/cart-store";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Navbar() {
  const { isSignedIn, user } = useUser();

  const items = useCartStore((state) => state.items);
  const cart = useQuery(
    api.cart.getUserCart,
    user ? { userId: user.id } : "skip"
  );

  return (
    <nav className="bg-white shadow p-4 flex justify-between text-black font-bold">
      <div className="text-lg font-bold">🛍️ My Store</div>
      <ul className="flex space-x-4">
        <li>
          <Link href="/">🏡Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <Link
            href={isSignedIn ? "/cart" : "/guest-cart"}
            className="relative"
          >
            🛒 Cart
            {(isSignedIn ? cart?.length || 0 : items.length) > 0 && (
              <span className="absolute -top-2 -right-3 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {isSignedIn ? (typeof window !== "undefined" && cart ? cart.length : 0) : items.length}

              </span>
            )}
          </Link>
        </li>
        <li>
          <Link href="/user">User</Link>
        </li>
        <li>
          <Link href="/admin">Admin</Link>
        </li>
        {!isSignedIn ? (
          <>
            <li>
              <Link href="/sign-in">Login</Link>
            </li>
            <li>
              <Link href="/sign-up">Register</Link>
            </li>
          </>
        ) : (
          <UserButton />
        )}
      </ul>
    </nav>
  );
}
