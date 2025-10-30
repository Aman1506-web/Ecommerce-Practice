"use client";

import { useUser } from "@clerk/nextjs";
import { useUserRole } from "@/lib/useUserRole";

const ProfilePage = () => {
  const { isSignedIn, user } = useUser();
  const role = useUserRole();

  const email = user?.emailAddresses?.[0]?.emailAddress;

 
  if(!isSignedIn){
    return (
      <div className="text-center font-bold">
        <h1 className="text-xl font-bold"><code>You are not signed in</code></h1>
      </div>
    )
  }

  return (
    <div className="text-center font-bold">
      <h1 className="text-xl font-bold"><code>Your email id is : {email}</code></h1>
      <h2 className="text-xl font-bold"><code>Your role is : {role}</code></h2>
    </div>
  )
};

export default ProfilePage;
