"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export default function HomePage() {
  // Clerk Auth
  const { isSignedIn, user } = useUser();

  // Convex data & mutations
  const products = useQuery(api.products.getAllProducts);
  const convexCart = useQuery(
    api.cart.getUserCart,
    isSignedIn ? { userId: user.id } : "skip"
  );
  const addToCart = useMutation(api.cart.addToCart);
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const remove = useMutation(api.cart.removeFromcart);

  // Zustand for guest users
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🛍️ Products</h1>

      {!products ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => {
            // itemInCart logic
            const itemInCart = isSignedIn
              ? convexCart?.find((i) => i.productId === product._id)
              : items.find((i) => i._id === product._id);

            return (
              <Card key={product._id} className="hover:shadow-lg transition p-2">
                <CardHeader>
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="rounded-md object-cover w-full h-full"
                    />
                  </AspectRatio>
                </CardHeader>
                <CardContent className="space-y-2 pt-2">
                  <h2 className="text-xl font-semibold">{product.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                  <p className="font-bold text-green-600 text-lg">
                    ₹{product.price}
                  </p>
                </CardContent>

                {/* Conditional Cart UI */}
                {!itemInCart ? (
                  <Button
                    className="bg-green-500"
                    onClick={() => {
                      if (isSignedIn) {
                        addToCart({
                          userId: user.id,
                          productId: product._id,
                          title: product.title,
                          price: product.price,
                          image: product.image,
                          quantity: 1,
                        });
                      } else {
                        addItem(product);
                      }
                    }}
                  >
                    Add to Cart 🛒
                  </Button>
                ) : (
                  <div className="flex gap-2 items-center justify-center py-2">
                    <Button
                      className="bg-red-500"
                      onClick={() => {
                        if (isSignedIn) {
                          if (itemInCart.quantity === 1) {
                            remove({ id: itemInCart._id });
                          } else {
                            updateQuantity({
                              id: itemInCart._id,
                              quantity: itemInCart.quantity - 1,
                            });
                          }
                          
                        } else {
                          decreaseQuantity(product._id);
                        }
                      }}
                    >
                      -
                    </Button>
                    <span className="px-2 font-semibold">
                      {itemInCart.quantity}
                    </span>
                    <Button
                      className="bg-green-500"
                      onClick={() => {
                        if (isSignedIn) {
                          updateQuantity({
                            id: itemInCart._id,
                            quantity: itemInCart.quantity + 1,
                          });
                        } else {
                          increaseQuantity(product._id);
                        }
                      }}
                    >
                      +
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}





/// itemInCart is jo check krta h ki product pehle se cart mein h ya nhi AND AGAR H TOH USE RETURN KRTA H 