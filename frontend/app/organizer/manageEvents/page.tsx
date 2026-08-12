"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { MapPin, Calendar as CalendarIcon, Plus } from "lucide-react";
import Loader from "@/component/Loader";
import toast from "react-hot-toast";
import { optimizedImage } from "@/lib/cloudinaryUrl";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface TicketTier {
  type: string;
  price: number;
  quantity: number;
  sold: number;
}

interface EventRow {
  _id: string;
  title: string;
  location: string;
  date: string;
  image: string;
  status: string;
  tickets: TicketTier[];
}

const statusStyles: Record<string, string> = {
  draft: "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]",
  published: "bg-[var(--color-success)]/15 text-[var(--color-success)]",
  cancelled: "bg-[var(--color-error)]/15 text-[var(--color-error)]",
  completed: "bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]",
};

export default function EventManagerPage() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  const fetchEvents = useCallback(() => {
    if (!session?.user?.accessToken) return;
    axios
      .get(`${BACKENDURL}/api/my-events`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      })
      .then((res) => setEvents(res.data.events))
      .catch((err) => console.error(err))
      .finally(() => setEventsLoading(false));
  }, [session]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // form state
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState(""); // ✅ new state
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // tickets state
  const [tickets, setTickets] = useState<
    { type: string; price: string; quantity: string; deadline: string }[]
  >([{ type: "", price: "", quantity: "", deadline: "" }]);

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const banks = [
    { name: "Access Bank", code: "044" },
    { name: "EcoBank", code: "050" },
    { name: "Fidelity Bank", code: "070" },
    { name: "First Bank", code: "011" },
    { name: "Guaranty Trust Bank", code: "058" },
    { name: "Kuda Microfinance Bank", code: "50211" },
    { name: "Moniepoint MFB", code: "50515" },
    { name: "Opay Digital Services Limited (OPay)", code: "999991" },
    { name: "Palmpay", code: "999992" },
    { name: "Stanbic IBTC Bank", code: "221" },
    { name: "UBA", code: "033" },
    { name: "Union Bank", code: "032" },
    { name: "Zenith Bank", code: "057" },
  ];

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

  const handleSubmit = async (
    e: React.FormEvent,
    status: "draft" | "published" = "published"
  ) => {
    e.preventDefault();
    setLoading(true);

    if (!session?.user?.accessToken) {
      toast.error("You must be logged in to create an event.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("details", details);
    formData.append("startDate", startDate);
    formData.append("startTime", startTime); // ✅ send start time
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

    formData.append("bankName", bankName);
    formData.append("accountNumber", accountNumber);
    formData.append("status", status);

    try {
      await axios.post(`${BACKENDURL}/api/create-event`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      toast.success("Event created successfully 🎉");
      fetchEvents();

      // Reset form
      setTitle("");
      setLocation("");
      setDetails("");
      setStartDate("");
      setStartTime(""); // ✅ reset
      setDate("");
      setImage(null);
      setTickets([{ type: "", price: "", quantity: "", deadline: "" }]);
      setBankName("");
      setAccountNumber("");
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
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="px-2">
        <section className="mb-10">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Your Events
          </h2>

          {eventsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-surface h-64 animate-pulse" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="card-surface p-10 text-center">
              <CalendarIcon className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-muted)]" />
              <p className="text-[var(--color-text-muted)] mb-4">You haven&apos;t created any events yet.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 btn-aurora font-medium"
              >
                <Plus className="w-4 h-4" />
                Create your first event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev) => {
                const sold = ev.tickets.reduce((s, t) => s + t.sold, 0);
                const capacity = ev.tickets.reduce((s, t) => s + t.quantity, 0);
                return (
                  <div
                    key={ev._id}
                    className="card-surface overflow-hidden hover:shadow-md transition"
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={optimizedImage(ev.image, "card")}
                        alt={ev.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span
                        className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-[var(--radius-pill)] font-medium ${
                          statusStyles[ev.status] || statusStyles.published
                        }`}
                      >
                        {ev.status}
                      </span>
                      <h3 className="absolute bottom-3 left-3 text-white text-lg font-bold drop-shadow-lg truncate right-3">
                        {ev.title}
                      </h3>
                    </div>
                    <div className="p-4">
                      <p className="text-[var(--color-text)] flex items-center gap-1.5 text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        {ev.location}
                      </p>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1 flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {new Date(ev.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-2">
                        {sold} / {capacity} tickets sold
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Floating create button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 btn-aurora rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-3xl"
      >
        +
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
          <div className="card-surface w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              ✕
            </button>

            <h2
              className="text-xl font-bold mb-4"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Create New Event
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title"
                  className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter event location"
                  className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                  required
                />
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                  Details
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Enter event details"
                  className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                  required
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                  required
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                  required
                />
              </div>

              {/* Tickets */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
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
                      className="border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text)] p-2 rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={ticket.price}
                      onChange={(e) =>
                        handleTicketChange(index, "price", e.target.value)
                      }
                      className="border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text)] p-2 rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={ticket.quantity}
                      onChange={(e) =>
                        handleTicketChange(index, "quantity", e.target.value)
                      }
                      className="border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text)] p-2 rounded"
                      required
                    />
                    <input
                      type="date"
                      placeholder="Deadline"
                      value={ticket.deadline}
                      onChange={(e) =>
                        handleTicketChange(index, "deadline", e.target.value)
                      }
                      className="border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text)] p-2 rounded"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeTicket(index)}
                        className="col-span-1 text-[var(--color-error)] font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTicket}
                  className="text-sm text-[var(--color-secondary)] hover:underline"
                >
                  + Add Ticket
                </button>
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                  Bank Name
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                  required
                >
                  <option value="">Select Bank</option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.name}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter account number"
                  className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                  Event Image
                </label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="w-full border border-[var(--color-border)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] bg-[var(--color-surface-2)] file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0 file:text-sm file:font-semibold
                  file:bg-[var(--color-primary)] file:text-white hover:file:bg-[var(--color-primary-dark)]"
                  required
                />
              </div>

              {/* Submit buttons with Loader + Toast */}
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={(e) => handleSubmit(e, "draft")}
                  className="flex-1 bg-[var(--color-surface-2)] text-[var(--color-text)] py-3 rounded-[var(--radius-btn)] font-medium hover:brightness-125 transition flex items-center justify-center"
                >
                  {loading ? <Loader /> : "Save as Draft"}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-aurora py-3 font-medium flex items-center justify-center"
                >
                  {loading ? <Loader /> : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
