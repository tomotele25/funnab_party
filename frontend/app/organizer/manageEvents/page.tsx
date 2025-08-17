"use client";

import axios from "axios";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/component/Loader";
import toast from "react-hot-toast";

const BACKENDURL = "http://localhost:2005";
export default function EventManagerPage() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // tickets state (array)
  const [tickets, setTickets] = useState<
    { type: string; price: string; quantity: string; deadline: string }[]
  >([{ type: "", price: "", quantity: "", deadline: "" }]);

  const handleTicketChange = (index: number, field: string, value: string) => {
    const newTickets = [...tickets];
    newTickets[index][field as keyof (typeof newTickets)[0]] = value;
    setTickets(newTickets);
  };

  const addTicket = () => {
    setTickets([
      ...tickets,
      { type: "", price: "", quantity: "", deadline: "" },
    ]);
  };

  const removeTicket = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!session?.user?.accessToken) {
      alert("You must be logged in to create an event.");
      setLoading(false);
      return;
    }

    // FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("details", details);
    formData.append("date", date);
    if (image) formData.append("image", image);
    formData.append(
      "tickets",
      JSON.stringify(
        tickets.map((t) => ({
          type: t.type,
          price: Number(t.price),
          quantity: Number(t.quantity),
          deadline: t.deadline ? new Date(t.deadline) : undefined,
        }))
      )
    );

    try {
      const res = await axios.post(`${BACKENDURL}/api/create-event`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      if (res) toast.success("Event created successfully");

      // Reset form
      setTitle("");
      setLocation("");
      setDetails("");
      setDate("");
      setImage(null);
      setTickets([{ type: "", price: "", quantity: "", deadline: "" }]);
      setIsModalOpen(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong. Try again."
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Page content */}
      <div className="px-2">
        {/* Upcoming Events */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Event Card */}
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition">
              <div className="relative h-48 w-full">
                <img
                  src="https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1500&q=80"
                  alt="Event"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <button className="absolute top-3 right-3 bg-white/90 text-sm px-3 py-1 rounded-full shadow hover:bg-white">
                  Edit
                </button>
                <h3 className="absolute bottom-3 left-3 text-white text-xl font-bold drop-shadow-lg">
                  Summer Beats Festival
                </h3>
              </div>
              <div className="p-4">
                <p className="text-gray-700 flex items-center gap-1">
                  📍 <span>Lagos, Nigeria</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">📅 Aug 28, 2025</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Create Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition text-3xl"
      >
        +
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-md z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Create New Event</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title"
                  className="w-full border border-gray-300 p-3 rounded-lg text-black focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter event location"
                  className="w-full border border-gray-300 p-3 rounded-lg text-black focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Enter event details"
                  className="w-full border border-gray-300 p-3 rounded-lg text-black focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg text-black focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>

              {/* Tickets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tickets
                </label>
                {tickets.map((ticket, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Type"
                      value={ticket.type}
                      onChange={(e) =>
                        handleTicketChange(index, "type", e.target.value)
                      }
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={ticket.price}
                      onChange={(e) =>
                        handleTicketChange(index, "price", e.target.value)
                      }
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={ticket.quantity}
                      onChange={(e) =>
                        handleTicketChange(index, "quantity", e.target.value)
                      }
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="date"
                      placeholder="Deadline"
                      value={ticket.deadline}
                      onChange={(e) =>
                        handleTicketChange(index, "deadline", e.target.value)
                      }
                      className="border p-2 rounded"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeTicket(index)}
                        className="col-span-1 text-red-500 font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTicket}
                  className="text-sm text-blue-500 hover:underline"
                >
                  + Add Ticket
                </button>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Image
                </label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 p-3 rounded-lg text-black bg-gray-50 file:mr-4 file:py-2 file:px-4 
                  file:rounded-full file:border-0 file:text-sm file:font-semibold 
                  file:bg-black file:text-white hover:file:bg-gray-800"
                  required
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                {loading ? <Loader /> : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
