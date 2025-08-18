"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import SkeletonLoader from "@/component/SkeletonLoader";
import { useCart } from "@/context/CartContext";

interface Ticket {
  type: string;
  price: number;
  quantity: number;
  sold: number;
}

interface Event {
  slug: string;
  title: string;
  details: string;
  location: string;
  image: string;
  date: string;
  organizer: string;
  tickets: Ticket[];
  id: string;
}

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

const EventPage = ({ params }: EventPageProps) => {
  const { slug } = use(params);
  const { addToCart } = useCart();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://funnabparty-backend.vercel.app/api/events/${slug}`
        );
        setEvent(res.data.event);
      } catch (err) {
        console.error(err);
        setError("Event not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setQuantity(1);
  };

  const handleQuantityChange = (delta: number) => {
    if (!selectedTicket) return;
    const maxQty = selectedTicket.quantity - selectedTicket.sold;
    const newQuantity = Math.max(1, Math.min(quantity + delta, maxQty));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (!event || !selectedTicket) return;
    const cartItem = {
      id: `${event.id}-${selectedTicket.type}`, // Use event.id for consistency
      name: `${event.title} - ${selectedTicket.type}`,
      price: selectedTicket.price,
      quantity,
      image: event.image,
      eventId: event.id,
      organizer: event.organizer,
    };
    addToCart(cartItem);
  };

  if (loading) {
    return (
      <div className="transition-opacity duration-500 bg-black min-h-screen">
        <SkeletonLoader />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white bg-black">
        {error || "Event not found."}
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(event.date));

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <section className="relative max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,128,0.2),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,255,255,0.2),transparent)]" />

        <div className="relative z-10">
          <Link
            href="/events"
            className="flex items-center mb-6 text-pink-400 hover:text-pink-300 transition-all duration-300"
            aria-label="Back to events"
          >
            <ArrowLeft className="w-6 h-6 mr-2" /> Back to Events
          </Link>

          <div className="flex flex-col md:grid md:grid-cols-3 md:gap-8 animate-slide-up">
            <div className="md:col-span-1 mb-8 md:mb-0">
              <div className="relative rounded-xl overflow-hidden border border-gray-700/50 hover:border-pink-400/50 hover:shadow-[0_0_10px_rgba(255,0,128,0.3)] transition-all duration-300 glow-effect">
                <Image
                  src={event.image || "/fallback-party.jpg"}
                  alt={event.title}
                  width={800}
                  height={400}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
            </div>

            <article className="md:col-span-2 bg-white/3 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-white">
                {event.title}
              </h1>
              <div className="space-y-2 mb-6">
                <p className="text-cyan-300 font-semibold text-sm sm:text-base md:text-lg flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {event.location}
                </p>
                <time
                  dateTime={event.date}
                  className="text-purple-300 font-semibold text-sm sm:text-base md:text-lg flex items-center"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {formattedDate}
                </time>
                <p className="text-gray-100 text-sm sm:text-base md:text-lg leading-relaxed">
                  {event.details}
                </p>
                <p className="text-gray-100 text-sm sm:text-base md:text-lg">
                  Organizer: {event.organizer}
                </p>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Select Your Ticket
              </h2>
              <ul className="space-y-4 mb-6">
                {event.tickets.map((ticket, idx) => (
                  <li
                    key={idx}
                    className={`p-4 rounded-lg flex justify-between items-center cursor-pointer bg-white/5 backdrop-blur-xl border transition-all duration-300 ${
                      selectedTicket?.type === ticket.type
                        ? "border-pink-400 bg-gray-800 shadow-[0_0_10px_rgba(255,0,128,0.3)]"
                        : "border-gray-700 hover:border-pink-400/50 hover:bg-gray-900 hover:scale-102"
                    }`}
                    onClick={() => handleSelectTicket(ticket)}
                    role="button"
                    aria-label={`Select ${ticket.type} ticket`}
                  >
                    <div>
                      <span className="font-semibold text-white">
                        {ticket.type}
                      </span>
                      <p className="text-gray-400 text-sm">
                        {ticket.quantity - ticket.sold} tickets left
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-pink-400">
                        ₦{ticket.price.toLocaleString()}
                      </span>
                      {selectedTicket?.type === ticket.type && (
                        <div className="mt-2 flex items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(-1);
                            }}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-l-md text-white font-semibold"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-1 bg-gray-800 text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(1);
                            }}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-r-md text-white font-semibold"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          {selectedTicket && (
            <div className="w-full bg-white/5 backdrop-blur-xl rounded-lg p-6 border border-gray-700/50 mt-8 animate-slide-up">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Order Summary
              </h3>
              <p className="text-gray-100 mb-2 text-sm sm:text-base">
                <strong>Ticket:</strong> {selectedTicket.type}
              </p>
              <p className="text-gray-100 mb-2 text-sm sm:text-base">
                <strong>Quantity:</strong> {quantity}
              </p>
              <p className="text-gray-100 mb-4 text-sm sm:text-base">
                <strong>Total:</strong> ₦
                {(selectedTicket.price * quantity).toLocaleString()}
              </p>
              <Link href={`/event/${slug}/checkout`}>
                <button
                  onClick={handleAddToCart}
                  className="w-full px-6 py-3 bg-gradient-to-r from-pink-400 to-cyan-400 text-white font-semibold rounded-lg hover:bg-gradient-to-r hover:from-cyan-400 hover:to-pink-400 transition-all duration-300 hover:scale-105 glow-button flex items-center justify-center"
                  aria-label="Add to cart and proceed to checkout"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart & Proceed to Checkout
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .animate-slide-up {
          opacity: 0;
          transform: translateY(20px);
          animation: slide-up 0.6s ease-out forwards;
        }
        @keyframes slide-up {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .glow-button {
          box-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
        }
        .glow-button:hover {
          box-shadow: 0 0 15px rgba(255, 105, 180, 0.5);
        }
        .glow-effect:hover {
          box-shadow: 0 0 10px rgba(255, 0, 128, 0.3);
        }
      `}</style>
    </div>
  );
};

export default EventPage;
