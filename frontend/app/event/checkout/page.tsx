"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function CheckoutPage() {
  const { cart, totalPrice } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Checkout Data:", { ...form, cart, totalPrice });
    alert("✅ Order submitted successfully!");
  };

  return (
    <div className="bg-black text-white min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Page Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Checkout
        </h1>

        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
          {/* User Details */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-2xl font-semibold mb-6 text-pink-400">
              Your Details
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-cyan-400">
              <ShoppingCart className="w-6 h-6 mr-2" />
              Order Summary
            </h2>

            {cart.length === 0 ? (
              <p className="text-gray-400">Your cart is empty.</p>
            ) : (
              <ul className="space-y-6">
                {cart.map((item, idx) => (
                  <li
                    key={idx}
                    className="relative bg-gray-900 rounded-2xl border border-dashed border-pink-400 p-4 shadow-md"
                  >
                    {/* Ticket tear circles */}
                    <span className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-black border border-pink-400 rounded-full"></span>
                    <span className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-black border border-pink-400 rounded-full"></span>

                    <div className="flex justify-between items-center">
                      {/* Ticket Info */}
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-xl object-cover border border-gray-700"
                          />
                        )}
                        <div>
                          <p className="font-bold text-lg text-white">
                            {item.name}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {item.quantity} × ₦{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <p className="font-extrabold text-xl text-pink-400">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {/* Divider line (tear line effect) */}
                    <div className="mt-4 border-t border-dashed border-gray-600"></div>

                    {/* Ticket Footer */}
                    <div className="flex justify-between mt-3 text-sm text-gray-400">
                      <span>Admit One</span>
                      <span>🎟️ Ticket</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-between font-bold text-xl mt-6">
              <span>Total:</span>
              <span className="text-cyan-400">
                ₦{totalPrice.toLocaleString()}
              </span>
            </div>

            {cart.length > 0 && (
              <button
                type="submit"
                className="mt-6 w-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Place Order
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
