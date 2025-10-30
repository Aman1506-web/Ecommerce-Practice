import { create } from "zustand";
import { persist } from "zustand/middleware"; //  import persist middleware

// shape of product stored in items
type Product = {
  _id: string;
  title: string;
  price: number;
  image: string;
  quantity?: number;
};

// shape for global store
type CartState = {
  items: Product[];
  addItem: (product: Product) => void;
  clearCart: () => void;
  increaseQuantity: (productId: Product["_id"]) => void;
  decreaseQuantity: (productId: Product["_id"]) => void;
};

// 👇 use persist middleware to wrap your store logic
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const existing = get().items.find((item) => item._id === product._id);

        if (existing) {
          set({
            items: get().items.map((item) =>
              item._id === product._id
                ? { ...item, quantity: (item.quantity || 1) + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...get().items, { ...product, quantity: 1 }],
          });
        }
      },

      increaseQuantity: (productId) => {
        // pura items array update ho jaaega : jis pr productid match hogi uski quantity increase and baaki decrease
        set({
          items: get().items.map((item) =>
            item._id === productId
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          ),
        });
      },

      decreaseQuantity: (productId) => {
        const updatedItems = get()
          .items.map((item) =>
            item._id === productId
              ? { ...item, quantity: (item.quantity || 1) - 1 }
              : item
          )
          .filter((item) => item.quantity && item.quantity > 0); // remove if qty becomes 0

        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage", // 👈 localStorage key
    }
  )
);
