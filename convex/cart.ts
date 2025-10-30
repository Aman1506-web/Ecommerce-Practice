// ye convex ka cart h

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

//This Mutation Purpose: increase existing product quantity or add new product
export const addToCart = mutation({
  args: {
    userId: v.string(),
    productId: v.string(),
    title: v.string(),
    price: v.number(),
    image: v.string(),
    quantity: v.number(),
  },

  handler: async (ctx, args) => {
    // check whether product exist or not
    // for reading data:  query function
    // filtered that object in cart where userId and productId equal to waht received in args.
    const existing = await ctx.db
      .query("cart")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();
    // first returns single object

    if (existing) {
      // quantity update
      // existing wo object h and ._id convex mein hoti h pehle se jo wo bnata h
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + args.quantity,
      });
    } else {
      // if no existing then add new record in databse
      await ctx.db.insert("cart", args);
    }
  },
});

// fetch out all products based on particular userId
export const getUserCart = query({
  args: { userId: v.string() },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("cart")
      .filter((q) => q.eq(q.field("userId"), args.userId)) // vo items chahiye jiski userId clerk ki user id means jo signedin h uski userid se mil jaae
      .collect();
    // returns array of objects
  },
});

// Remove product from cart using id of partcular product in database
export const removeFromcart = mutation({
  args: { id: v.id("cart") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// update quantity
export const updateQuantity = mutation({
  args: {
    id: v.id("cart"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { quantity: args.quantity });
  },
});

// clear cart mutation after payment
export const clearCart = mutation({
  args: {
    userId: v.string(),
  },

  handler: async (ctx, args) => {
    // fetch alll items jisme given userId = args ki userID
    const items = await ctx.db
      .query("cart")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    // collct return krega array of objects jo items mein store ho jaaenge

    // delete one by one
    for (const item of items) {
      await ctx.db.delete(item._id);
    }

    return { success: true, deleted: items.length}
  },
});
