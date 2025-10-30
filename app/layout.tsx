import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Script from "next/script"; // ✅ Razorpay script loader

export const metadata = {
  title: "My Store",
  description: "A simple e-commerce app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Load Razorpay checkout script here */}
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive"
          />
        </head>
        <body className="min-h-screen bg-gray-100">
          <Providers>
            <Navbar />
            <main className="p-4">{children}</main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

// FINAL FLOW :
// user app kholta h 
// sabe pehle clerk auth and convex database connect ho jaate h 
// poora app ab authorized + backend connected ho gya h 
// ab hm useMutation and useQuery ko khin bhi use kr sakte h poori app mein