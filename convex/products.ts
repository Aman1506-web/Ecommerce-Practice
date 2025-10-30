import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// MUTATION: Create product in table
export const createProduct = mutation({
  args: {
    title: v.string(),
    price: v.number(),
    description: v.string(),
    image: v.string(),
  },

  handler: async (ctx, args) => {
    await ctx.db.insert("products", args);
  },
});

// QUERY: For fetching products
export const getAllProducts = query({
  handler: async(ctx) => {
    return await ctx.db.query("products").collect()
    // it will return a array of objects example array of products where each product detail is stored in a separate object in an array.
  }
})

// v stands for values like kis type ka data expect krna h from frontend
