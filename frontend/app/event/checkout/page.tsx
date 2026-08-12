"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ShoppingCart,
  User,
  Mail,
  Minus,
  Plus,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "@/component/Loader";
const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
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
      toast.error("Your cart is empty");
      return;
    }

    const payload = {
      email: formData.email,
      userName: formData.name,
      amount: totalPrice,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        eventId: item.eventId,
        organizer: item.organizer,
        ticketType: item.ticketType,
      })),
    };

    setIsProcessingPayment(true);
    try {
      const response = await axios.post(
        `${BACKENDURL}/api/payment/initialize`,
        payload
      );
      router.push(response.data.authorization_url);
    } catch (err: unknown) {
      console.error("Payment error:", err);
      toast.error("Payment initiation failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-4 text-[var(--color-text)] sm:px-6">
        <div className="card-surface p-6 text-center">
          <p className="flex items-center justify-center gap-2 text-lg font-medium">
            <ShoppingCart className="h-5 w-5 text-[var(--color-accent)]" />
            Your cart is empty.
          </p>
          <button
            onClick={() => router.push("/")}
            className="btn-aurora mt-6 px-6 py-3 font-semibold"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] font-sans text-[var(--color-text)]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4 backdrop-blur-xl sm:p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--color-accent)] transition-colors duration-300 hover:text-[var(--color-primary)]"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>
        <h1
          className="flex-1 text-center text-xl font-bold sm:text-2xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <span className="gradient-text-aurora">Checkout</span>
        </h1>
      </div>

      <div className="mx-auto w-full max-w-3xl flex-1 space-y-6 p-4 sm:p-6">
        {/* Cart Items */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
            <ShoppingCart className="h-5 w-5 text-[var(--color-accent)]" />
            Your Tickets
          </h2>
          <ul className="space-y-4">
            {cart.map((item, index) => (
              <li key={`${item.id}-${index}`} className="card-surface p-4 sm:p-5">
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-[var(--radius-btn)] border border-[var(--color-border)] object-cover"
                      />
                    )}
                    <div>
                      <p className="text-base font-semibold sm:text-lg">
                        {item.name}
                      </p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        ₦{item.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                    <div className="flex items-center overflow-hidden rounded-[var(--radius-btn)] border border-[var(--color-border)]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="bg-[var(--color-surface-2)] px-2.5 py-1.5 transition hover:bg-white/10"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[2rem] px-3 py-1.5 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="bg-[var(--color-surface-2)] px-2.5 py-1.5 transition hover:bg-white/10"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="min-w-[4.5rem] text-right text-sm font-semibold text-[var(--color-accent)]">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove ticket"
                      className="rounded-[var(--radius-btn)] bg-[var(--color-error)]/80 p-2 text-white transition-colors duration-300 hover:bg-[var(--color-error)]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <div className="card-surface p-4 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold sm:text-2xl">
            <User className="h-5 w-5 text-[var(--color-secondary)]" />
            Your Details
          </h2>
          <form className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)]">
                <User className="h-4 w-4 text-[var(--color-accent)]" />
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 text-[var(--color-text)] outline-none transition-all duration-300 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/40"
                placeholder="Enter your name"
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-[var(--color-error)]">
                  {formErrors.name}
                </p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)]">
                <Mail className="h-4 w-4 text-[var(--color-secondary)]" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 text-[var(--color-text)] outline-none transition-all duration-300 focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/40"
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-[var(--color-error)]">
                  {formErrors.email}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Trust signal */}
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <ShieldCheck className="h-4 w-4 text-[var(--color-success)]" />
          Payments are secured and processed by Paystack.
        </div>

        {/* Total */}
        <div className="flex items-center justify-between text-lg font-semibold sm:text-xl">
          <span>Total</span>
          <span className="text-[var(--color-accent)]">
            ₦{totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 mx-auto w-full max-w-3xl border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 p-4 backdrop-blur-xl sm:p-6">
        <button
          onClick={handleCheckout}
          disabled={isProcessingPayment}
          className={`btn-aurora flex w-full items-center justify-center px-4 py-3 font-bold ${
            isProcessingPayment ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isProcessingPayment ? <Loader /> : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
