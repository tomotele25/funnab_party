"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

import { useRouter } from "next/navigation";
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
import { optimizedImage } from "@/lib/cloudinaryUrl";

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
  tickets: Ticket[];
  organizer: string;
}

interface EventPageClientProps {
  slug: string;
}

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const EventPageClient = ({ slug }: EventPageClientProps) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKENDURL}/api/events/${slug}`);
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
    setQuantity(Math.max(1, Math.min(quantity + delta, maxQty)));
  };

  const handleCheckout = () => {
    if (!event || !selectedTicket) return;

    addToCart({
      id: `${event.slug}-${selectedTicket.type}`,
      name: `${event.title} - ${selectedTicket.type}`,
      price: selectedTicket.price,
      quantity,
      image: event.image,
      eventId: event.slug,
      organizer: event.organizer,
      ticketType: selectedTicket.type,
    });

    router.push("/event/checkout");
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
      <section className="relative mx-auto py-1 px-4 sm:px-6 lg:px-8 pb-24">
        <button
          onClick={() => router.back()}
          className="flex items-center mb-6 pt-5 text-pink-400 hover:text-pink-300 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="relative z-10 flex flex-col md:grid md:grid-cols-3 md:gap-8">
          <div className="md:col-span-1 mb-8 md:mb-0">
            <div className="relative rounded-xl overflow-hidden border border-gray-700/50">
              <Image
                src={optimizedImage(event.image, "hero") || "/fallback-party.jpg"}
                alt={event.title}
                width={800}
                height={400}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
              />
            </div>
          </div>

          <article className="md:col-span-2 bg-white/3 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            <div className="space-y-2 mb-6">
              <p className="text-cyan-300 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {event.location}
              </p>
              <time
                dateTime={event.date}
                className="text-purple-300 flex items-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {formattedDate}
              </time>
              <p className="text-gray-100">{event.details}</p>
            </div>

            <h2 className="text-xl font-semibold mb-4">Select Your Ticket</h2>
            <ul className="space-y-4 mb-6">
              {event.tickets.map((ticket, idx) => (
                <li
                  key={idx}
                  className={`p-4 rounded-lg flex justify-between items-center cursor-pointer border ${
                    selectedTicket?.type === ticket.type
                      ? "border-pink-400 bg-gray-800"
                      : "border-gray-700 hover:border-pink-400/50 hover:bg-gray-900"
                  }`}
                  onClick={() => handleSelectTicket(ticket)}
                >
                  <div>
                    <span className="font-semibold">{ticket.type}</span>
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
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-l-md"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-1 bg-gray-800">
                          {quantity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(1);
                          }}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-r-md"
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
          <div className="w-full bg-white/5 backdrop-blur-xl rounded-lg p-6 border border-gray-700/50 mt-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Order Summary
            </h3>
            <p className="text-gray-100 mb-2">
              <strong>Ticket:</strong> {selectedTicket.type}
            </p>
            <p className="text-gray-100 mb-2">
              <strong>Quantity:</strong> {quantity}
            </p>
            <p className="text-gray-100 mb-4">
              <strong>Total:</strong> ₦
              {(selectedTicket.price * quantity).toLocaleString()}
            </p>

            <button
              onClick={handleCheckout}
              className="hidden md:flex w-full px-6 py-3 bg-gradient-to-r from-pink-400 to-cyan-400 text-white font-semibold rounded-lg hover:scale-105 transition-all items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </button>
          </div>
        )}
      </section>

      {selectedTicket && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-t border-gray-700/50 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">{selectedTicket.type} × {quantity}</p>
            <p className="text-pink-400 font-bold text-lg">
              ₦{(selectedTicket.price * quantity).toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleCheckout}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-400 to-cyan-400 text-white font-semibold rounded-lg flex items-center justify-center"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default EventPageClient;
