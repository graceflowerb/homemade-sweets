"use client";

import React, { useState, useEffect } from "react";
import { CartProvider } from "@/context/CartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render children directly during server prerender/SSR pass
    // to prevent CLIENT_HOOK_DYNAMIC static bailout checks
    return <>{children}</>;
  }

  return <CartProvider>{children}</CartProvider>;
}
