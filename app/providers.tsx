"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
// "!"" typescript ko batate h ki process.env.NEXT_PUBLIC_CONVEX_URL undefined nhi hoga

export function Providers({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
} 

// convex provider : convex ko inject krta h poori app mein
// ConvexReactClient: connection establish krta h between frontend and backend
// ReactNode : children component ka type

// so ye file convex se connection establish krke frontend ka uske baad poori file mein convex ke functions ko access krwaati h
