// we want ki after sign in jo zustand ka cart tha vo pura cart convex mein aa jaae toh ye page usi cart ko bhejne ka kaam krega.
// zustand ka cart global store ke items mein saved h hme vo items ko convex mein add krna h 
//

"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useCartStore } from "@/lib/store/cart-store"
import { useRouter } from "next/navigation"

export default function SyncCartPage(){

  const {user, isLoaded, isSignedIn} = useUser()
  const router = useRouter()

  // convex access on frontend using useMutation 
  const addToCart = useMutation(api.cart.addToCart)

  // zustand functions
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  

  // for adding items to db we call for loop or map but map function ke saath async call nhi kr sakte 
 useEffect(()=> {

  console.log("user", user)
  console.log("isLoaded", isLoaded);
  console.log("isSignedIn", isSignedIn)

  if(!isLoaded || !isSignedIn) return;
  // iska matlb h ki agar clerk abhi tak load nhi hua ya user signed in nhi h toh aage ka code mat chala

  // syncCart function mein sabse pele add hoga , clearCart(), and then route change

  const syncCart = async() => {
    if(items.length > 0){
      for(const item of items){
        await addToCart({
          userId: user.id,
          productId: item._id,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity || 1,
        })
        console.log("syncing", item)
      }
      clearCart();
    }
    router.replace("/cart")
    // ye if se bahr h bcoz agar guest ne item add nhi bhi kiye toh bhi vo sign in ke baad cart pr redirect hoga bcoz agar andar rkhte toh toh user toh aajata but agar item nhi hote toh if condition nhi chlti h and bs loader aa raa hota neeche ka 
  }
  syncCart()
 }, [isLoaded,isSignedIn,user, items, addToCart, clearCart, router])

 // dependecny array mein vo sab functions aate h jo useEffect ke andar use ho re h according to react rules



 return (
  <div className="p-10 text-center flex flex-col items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
    <p className="text-lg text-gray-700 font-semibold">
      Preparing your cart...
    </p>
    <p className="text-sm text-gray-500 mt-1">
      Just a moment! We are setting things up for you 🛍️
    </p>
  </div>
);

}