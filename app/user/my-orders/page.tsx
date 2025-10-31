"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";

type Product = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  userId: string;
  paymentId: string;
  products: Product[];
  amount: number;
  timestamp: number;
};

export default function MyOrdersPage() {
  const { user } = useUser();
  const orders = useQuery(api.orders.getUserOrders, user ? { userId: user.id } : "skip");

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">🧾 My Orders</h1>

      {!user ? (
        <p>Please sign in to view your orders.</p>
      ) : !orders ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order: Order) => (
            <div
              key={order._id}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              <p className="font-semibold">
                Payment ID: <span className="text-gray-600">{order.paymentId}</span>
              </p>
              <p>Amount: ₹{order.amount}</p>
              <p>
                Date:{" "}
                {new Date(order.timestamp).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>

              <div className="mt-3">
                <p className="font-medium mb-2">Products:</p>
                <ul className="list-disc ml-5 text-sm text-gray-700">
                  {order.products.map((p: Product, i: number) => (
                    <li key={i}>
                      {p.title} — ₹{p.price} × {p.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
