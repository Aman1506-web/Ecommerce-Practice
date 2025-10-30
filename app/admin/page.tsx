"use client";
import { useUser } from "@clerk/nextjs";
import { useUserRole } from "@/lib/useUserRole";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AdminPage() {
  // clerk user info
  const { isSignedIn, isLoaded } = useUser();
  const role = useUserRole();
  const router = useRouter();

  // page load pr checking dikhane ke liye
  const [checkingAccess, setCheckingAccess] = useState(true);

  // convex mutation hook
  const createProduct = useMutation(api.products.createProduct);

  // form input states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  // Access control logic
  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn) {
        router.replace("/sign-in");
      } else if (role !== "admin") {
        router.replace("/unauthorized");
      } else {
        setCheckingAccess(false);
      }
    }
  }, [isSignedIn, isLoaded, role, router]);

  // form submission handle
  const handleSubmit = async (e: React.FormEvent) => {
    // page reload na ho after submission
    e.preventDefault();

    // storing value on DB
    try {
      console.log("Form Submitted");
      await createProduct({
        title,
        price: Number(price),
        description,
        image,
      });

      console.log("✅ Product sent to Convex DB");
      alert("✅ Product Added!");

      // reset form to empyt value
      setTitle("");
      setPrice("");
      setDescription("");
      setImage("");
    } catch (err) {
      console.log("Product add error", err);
      alert("Error adding product . Please try again");
    }
  };

  // access check condition of page when user not signed in or role check
  if (checkingAccess) {
    return (
      <div className="text-center mt-10 text-gray-500">
        <h1>Checking Access...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard 👑</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Product Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Product Image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 w-full">
          Add Product
        </button>
      </form>
    </div>
  );
}

// useEffect component render hone ke baad chlta h toh usse pehle user ko jhalak dikh sakti h admin page ki isliye we are adding this line:

// if (isSignedIn === undefined || role === undefined) {
//     return <div className="text-center mt-10">Loading...</div>;

// after useEffect
// ki jab tak data undefined h tab tak render nhi hoga

// api.products.createProduct

// api is convex ka auto generated api functiion ka object . Jab hum koi function define krte h convex ke backend mein toh convex automatic ek object bna deta h api naam se and isme wo saare fuctions hote h

// api.products.createProduct
// toh yahn hum bol re h ki bhyi convexx hme wo function de jo api object mein products mein createProduct ke naam se bna h
