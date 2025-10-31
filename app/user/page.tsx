"use client";

import { useUserRole } from "@/lib/useUserRole";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserPage() {
  const { isLoaded, isSignedIn } = useUser();
  const role = useUserRole();
  const router = useRouter();

  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.replace("/sign-in");
      } else if (role !== "user") {
        router.replace("/unauthorized");
      } else {
        setCheckingAccess(false);
      }
    }
  }, [isLoaded, isSignedIn, role, router]);

  if (checkingAccess) {
    return (
      <div className="text-center mt-10 text-gray-500">
        <h1>Checking Access...</h1>
      </div>
    );
  }

  return (
    <div className="text-center mt-10 space-y-6">
      <h1 className="text-2xl font-bold">User Dashboard 🙋‍♂️</h1>

      <p className="text-gray-600">
        Welcome to your dashboard! You can view your recent orders below.
      </p>

      <Link
        href="/user/my-orders"
        className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        View My Orders 🧾
      </Link>
    </div>
  );
}
