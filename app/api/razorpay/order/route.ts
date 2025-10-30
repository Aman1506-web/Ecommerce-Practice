// app/api/razorpay/order/route.ts
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

// RAzorpay instance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// POST req export 
export async function POST(req: Request) {
  try {

  const body = await req.json();
  const { amount } = body;
  
  console.log("🔥 Received amount from frontend:", amount)

  // define options for order creation (amount,  currency , receipt)
  const options = {
    amount: amount, // Razorpay works in paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  console.log("📦 Order Options:", options)
  
  // create order 

    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay Order Created:", order);
    // return to frontend
    return NextResponse.json(order);
  } catch (err) {
    console.error("Razorpay Order Error ❌", err)
    return NextResponse.json({error: 'Failed to create order'}, {status: 500});
  }
}


// What are server actions?
// Server Actions are asynchronous functions that run on the server.
// They are primarily used for handling:
// Form submissions
// Data mutations (e.g., updating, creating, deleting data in a database)
// Authentication and authorization
// Other server-side tasks like sending emails 

// Key characteristics
// Asynchronous: Server Actions must be asynchronous functions.
// "use server" directive: You mark a function as a Server Action by adding the "use server" directive at the top of the function body or at the top of the file to mark all exports within that file as Server Actions.
// No API Routes needed for mutations: Server Actions can simplify data mutations by removing the need for separate API routes and client-side state management for these operations.
// Integration with form elements: Server Actions can be directly invoked using the action attribute on HTML <form> elements or formAction on <button> elements.
// Reduced client-side JavaScript: By moving server-side logic from the client to the server, Server Actions reduce the amount of JavaScript that needs to be sent to the browser, potentially improving initial load times and overall performance.
// Enhanced security: Sensitive logic and data remain on the server, making it more secure than fetching data directly from the client. 
