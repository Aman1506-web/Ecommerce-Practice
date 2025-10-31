import { mutation, query } from "./_generated/server";
import { v } from "convex/values"

// SAVE ORDER IN DB AFTER PAYMENT
export const saveOrder = mutation({

  args: {
    userId: v.string(), // clerk id 
    paymentId: v.string(),  // razorpay payment id
    products: v.array( 
      v.object({
        productId: v.id("cart"),  // product id
        title: v.string(), 
        price: v.number(),
        quantity: v.number(),
      })
    ),  
    amount: v.number(),  // total amount paid
    timestamp: v.number(), // Date.now() frontend pr wahnse aayega
  },


  handler: async(ctx, args) => {
    // Insert order into order table
    await ctx.db.insert("orders", {
      userId: args.userId,
      paymentId: args.paymentId,
      products: args.products,
      amount: args.amount,
      timestamp: args.timestamp,
    })

    // Successfully inserted
    return {success: true};
  },

})

// GET ORDERS FOR A USER
export const getUserOrders = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .order("desc") // latest first
      .collect();
    return orders;
  },
});

// get order by payment id - to verify that the payment id in URL belongs to logged-in uer
// export const getOrderByPaymentId = query({
//   args:{
//     paymentId: v.string()
//   },

//   handler: async(ctx, args) => {

//   }


// })













// 💥 Why it’s important:
// In Future  "My Orders" page.

// Admin dashboard contains order analytics.

