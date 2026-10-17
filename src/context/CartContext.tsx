"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  unit_type: string;
  quantity: number;
  image_url: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Safely load cart from localStorage only after client mounts
  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem("sweet_bites_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart state updates
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sweet_bites_cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const addToCart = (product: any, quantity: number) => {
    setCart((prev: CartItem[]) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          unit_type: product.unit_type || "pcs",
          quantity,
          image_url: product.image_url,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev: CartItem[]) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev: CartItem[]) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => setCart([]);

  // Use empty defaults during SSR/prerender to satisfy strict caching rules
  const activeCart = mounted ? cart : [];
  const totalPrice = activeCart.reduce((sum: number, item: CartItem) => {
    return sum + item.price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart: activeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
