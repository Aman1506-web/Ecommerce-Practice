"use client";

import { useUserRole } from "@/lib/useUserRole";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const { isLoaded, isSignedIn } = useUser();
  const role = useUserRole();
  const router = useRouter();

  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    // isLoaded ye batata h ki clerk ka data loaded h ya nhi bcoz jab data clerk ka data jab loaded hota h tabhi pata lagta h ki user sign in h ya nhi role kya h user ka etc..
    if (isLoaded) {
      if (!isSignedIn) {
        router.replace("/sign-in"); // replace ki wajah se user wpas se back krke user page pr nhi jaa paaega
      } else if (role !== "user") {
        router.replace("/unauthorized");
      } else {
        setCheckingAccess(false);
      }
    }
  }, [isLoaded, isSignedIn, role,router]);


  if (checkingAccess) {
    return (
      <div className="text-center mt-10 text-gray-500">
        <h1>Checking Access...</h1>
      </div>
    );
  }

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">User Dashboard 🙋‍♂️</h1>
    </div>
  );
}

// usestate we use bcoz useState pure page ke content ko conditional bana deta h ki agar check access true h toh ye text aagyega and agar false h toh yeh text aayega
