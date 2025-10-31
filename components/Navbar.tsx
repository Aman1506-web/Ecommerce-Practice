"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { useCartStore } from "@/lib/store/cart-store";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Menu, X } from "lucide-react"; // for hamburger icons

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const items = useCartStore((state) => state.items);
  const cart = useQuery(
    api.cart.getUserCart,
    user ? { userId: user.id } : "skip"
  );

  const cartCount = isSignedIn
    ? (typeof window !== "undefined" && cart ? cart.length : 0)
    : items.length;

  return (
    <nav className="bg-white shadow p-4 text-black font-bold">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/"><div className="text-lg font-bold">🛍️ My Store</div></Link>
        

        {/* Hamburger button for mobile */}
        <button
          className="md:hidden block"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4 items-center">
          <li>
            <Link href="/">🏡 Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/profile">Profile</Link>
          </li>
          <li className="relative">
            <Link href={isSignedIn ? "/cart" : "/guest-cart"}>
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
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
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <ul className="mt-4 flex flex-col space-y-3 md:hidden font-semibold">
          <li>
            <Link href="/" onClick={() => setMenuOpen(false)}>
              🏡 Home
            </Link>
          </li>
          <li>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link href="/profile" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
          </li>
          <li className="relative">
            <Link
              href={isSignedIn ? "/cart" : "/guest-cart"}
              onClick={() => setMenuOpen(false)}
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 left-14 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link href="/user" onClick={() => setMenuOpen(false)}>
              User
            </Link>
          </li>
          <li>
            <Link href="/admin" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          </li>
          {!isSignedIn ? (
            <>
              <li>
                <Link href="/sign-in" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/sign-up" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          ) : (
            <UserButton />
          )}
        </ul>
      )}
    </nav>
  );
}
