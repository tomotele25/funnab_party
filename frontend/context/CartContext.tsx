"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// --- Types ---
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  eventId?: string; // optional, but can be used
  organizer?: string; // optional, but can be used
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

// --- Context ---
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Provider ---
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add item or increment quantity if already exists
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  // Remove item
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Update quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Clear cart
  const clearCart = () => setCart([]);

  // Calculate total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// --- Hook to use cart ---
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
