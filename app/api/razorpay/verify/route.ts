// this file is our backend route

import crypto from "crypto"
import { NextResponse } from "next/server"

export async function POST(req: Request){

  // frontend req convert to json
  const body = await req.json()
  console.log("Received Body:", body)

  // destructure payemnt_id, order_id, signature 
  const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = body;

  // env
  const secret = process.env.RAZORPAY_KEY_SECRET!;

  // Make expected signature
  const expectedSignature = await crypto.createHmac("sha256", secret).update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex")

  // compare both signatures
  if(expectedSignature === razorpay_signature){
    return NextResponse.json({success: true, message: "Payment verified ✅"})
  }else{
    return NextResponse.json({success: false, message: "Fraud Payment"}, {status: 400})
  }

}