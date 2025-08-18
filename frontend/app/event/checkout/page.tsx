"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ShoppingCart, User, Mail } from "lucide-react";
import axios from "axios";
import Loader from "@/component/Loader";
const BACKENDURL = "https://funnabparty-backend.vercel.app";

export default function CheckoutPage() {
  const { cart, removeFromCart, totalPrice } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [formErrors, setFormErrors] = useState({ name: "", email: "" });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { name: "", email: "" };
    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const payload = {
      email: formData.email,
      amount: totalPrice,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        eventId: item.eventId,
        organizer: item.organizer,
      })),
    };

    console.log("Payment payload:", payload);

    setIsProcessingPayment(true);
    try {
      const response = await axios.post(
        `${BACKENDURL}/api/payment/initialize`,
        payload
      );
      router.push(response.data.authorization_url);
    } catch (err: unknown) {
      console.error("Payment error:", err);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 text-center">
          <p className="text-lg font-medium flex items-center justify-center gap-2">
            <ShoppingCart className="w-5 h-5 text-pink-400" />
            Your cart is empty.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-400 to-cyan-400 text-white font-semibold rounded-lg hover:bg-gradient-to-r hover:from-cyan-400 hover:to-pink-400 transition-all duration-300 hover:scale-105 glow-button"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 sm:p-6 border-b border-gray-800 bg-white/5 backdrop-blur-xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold flex-1 text-center bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
          Checkout
        </h1>
      </div>

      <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-3xl mx-auto w-full">
        {/* Cart Items */}
        <div className="space-y-6 ml-4 mr-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-pink-400" />
            Your Tickets
          </h2>
          <ul className="space-y-6">
            {cart.map((item, index) => (
              <li
                key={`${item.id}-${index}`}
                className="relative bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-gray-600/50 hover:border-pink-400/50 transition-all duration-300 ticket-item shadow-lg"
                style={{
                  clipPath:
                    "polygon(5% 0%, 95% 0%, 100% 10%, 100% 90%, 95% 100%, 5% 100%, 0% 90%, 0% 10%)",
                }}
              >
                {/* Perforated Edge Effect */}
                <div className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-4 h-4 bg-black rounded-full border border-gray-600/50"></div>
                <div className="absolute right-[-8px] top-1/2 transform -translate-y-1/2 w-4 h-4 bg-black rounded-full border border-gray-600/50"></div>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-700/50 border-r border-dashed border-gray-500"></div>
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-700/50 border-l border-dashed border-gray-500"></div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 to-cyan-400/10 opacity-50 rounded-xl"></div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10">
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={70}
                        height={70}
                        className="object-cover rounded-lg border border-pink-400/30 shadow-sm"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-base sm:text-lg text-white bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                        {item.name}
                      </p>
                      <p className="text-gray-300 text-sm">
                        {item.quantity} × ₦{item.price.toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Organizer: {item.organizer}
                      </p>
                      <p className="text-xs text-cyan-400 mt-1 italic">
                        Ticket #{(index + 1).toString().padStart(4, "0")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-4 sm:mt-0 px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium text-white transition-all duration-300 w-full sm:w-auto shadow-md hover:shadow-lg"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-gray-700/50">
          <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-cyan-400" />
            Your Details
          </h2>
          <form className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                <User className="w-4 h-4 text-pink-400" />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 outline-none transition-all duration-300"
                placeholder="Enter your name"
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                <Mail className="w-4 h-4 text-cyan-400" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 outline-none transition-all duration-300"
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
              )}
            </div>
          </form>
        </div>

        {/* Total */}
        <div className="text-lg sm:text-xl font-semibold flex justify-between items-center">
          <span className="text-white">Total</span>
          <span className="text-pink-400">₦{totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="p-4 sm:p-6 border-t border-gray-800 bg-black/95 backdrop-blur-xl sticky bottom-0 max-w-3xl mx-auto w-full">
        <button
          onClick={handleCheckout}
          disabled={isProcessingPayment}
          className={`w-full px-4 py-3 bg-gradient-to-r from-pink-400 to-cyan-400 text-white font-bold rounded-lg hover:bg-gradient-to-r hover:from-cyan-400 hover:to-pink-400 transition-all duration-300 hover:scale-105 glow-button flex items-center justify-center ${
            isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {isProcessingPayment ? <Loader /> : "Pay Now"}
        </button>
      </div>

      <style jsx>{`
        .ticket-item {
          box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05)
          );
        }
        .ticket-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
        }
        .glow-button {
          box-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
        }
        .glow-button:hover:not(:disabled) {
          box-shadow: 0 0 15px rgba(255, 105, 180, 0.5);
        }
      `}</style>
    </div>
  );
}
