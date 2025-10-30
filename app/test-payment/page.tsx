"use client"

export default function TestPaymentPage(){
  console.log(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">
          Test payment page 💳
      </h1>
      <p>Open dev console to see razorpage key log</p>
    </div>
  )
}