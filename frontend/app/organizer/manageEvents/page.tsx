"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { MapPin, Calendar as CalendarIcon, Plus, Link2, ArrowLeft, ScanLine } from "lucide-react";
import Loader from "@/component/Loader";
import toast from "react-hot-toast";
import { optimizedImage } from "@/lib/cloudinaryUrl";
import { EVENT_THEMES } from "@/lib/eventThemes";
import { EVENT_TEMPLATES, EventTemplate } from "@/lib/eventTemplates";
import EventStaffModal from "@/component/EventStaffModal";

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
  slug: string;
  customSlug?: string;
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
  const [modalStep, setModalStep] = useState<"template" | "form">("template");
  const [staffModalEvent, setStaffModalEvent] = useState<EventRow | null>(null);
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
  const [startTime, setStartTime] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // tickets state
  const [tickets, setTickets] = useState<
    { type: string; price: string; quantity: string; deadline: string }[]
  >([{ type: "", price: "", quantity: "", deadline: "" }]);

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // customization state
  const [customSlug, setCustomSlug] = useState("");
  const [theme, setTheme] = useState<(typeof EVENT_THEMES)[number]["value"]>(
    "classic"
  );
  const [customFields, setCustomFields] = useState<
    { label: string; type: string; required: boolean }[]
  >([]);
  const [confirmationSubject, setConfirmationSubject] = useState("");
  const [confirmationBody, setConfirmationBody] = useState("");

  const applyTemplate = (template: EventTemplate) => {
    setTickets(template.tickets.map((t) => ({ ...t })));
    setTheme(template.theme);
    setCustomFields(template.customFields.map((f) => ({ ...f })));
    setModalStep("form");
  };

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      { label: "", type: "text", required: false },
    ]);
  };

  const updateCustomField = (
    index: number,
    key: "label" | "type" | "required",
    value: string | boolean
  ) => {
    setCustomFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [key]: value } : f))
    );
  };

  const removeCustomField = (index: number) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
  };

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

  const resetForm = () => {
    setTitle("");
    setLocation("");
    setDetails("");
    setStartDate("");
    setStartTime("");
    setDate("");
    setImage(null);
    setTickets([{ type: "", price: "", quantity: "", deadline: "" }]);
    setBankName("");
    setAccountNumber("");
    setCustomSlug("");
    setTheme("classic");
    setCustomFields([]);
    setConfirmationSubject("");
    setConfirmationBody("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalStep("template");
    resetForm();
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
    formData.append("startTime", startTime);
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

    if (customSlug.trim()) formData.append("customSlug", customSlug.trim());
    formData.append("theme", theme);
    formData.append(
      "customFields",
      JSON.stringify(customFields.filter((f) => f.label.trim()))
    );
    formData.append("confirmationSubject", confirmationSubject);
    formData.append("confirmationBody", confirmationBody);

    try {
      await axios.post(`${BACKENDURL}/api/create-event`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      toast.success("Event created successfully 🎉");
      fetchEvents();
      closeModal();
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
                      <button
                        type="button"
                        onClick={() => {
                          const link = `${window.location.origin}/event/${
                            ev.customSlug || ev.slug
                          }`;
                          navigator.clipboard.writeText(link);
                          toast.success("Event link copied");
                        }}
                        className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-secondary)] hover:underline"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        Copy event link
                      </button>
                      <button
                        type="button"
                        onClick={() => setStaffModalEvent(ev)}
                        className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-secondary)] hover:underline"
                      >
                        <ScanLine className="w-3.5 h-3.5" />
                        Manage scan staff
                      </button>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50 p-4">
          <div className="card-surface w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              aria-label="Close"
            >
              ✕
            </button>

            {modalStep === "template" ? (
              <>
                <h2
                  className="text-xl font-bold mb-1"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Create New Event
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] mb-5">
                  Pick a starting point — you can still change anything
                  afterward.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EVENT_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      className="text-left p-4 rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-primary)] transition"
                    >
                      <span className="text-2xl">{template.emoji}</span>
                      <p className="mt-2 font-semibold text-sm">
                        {template.label}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        {template.description}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setModalStep("template")}
                  className="flex items-center gap-1.5 text-xs text-[var(--color-secondary)] hover:underline mb-3"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Change template
                </button>

                <h2
                  className="text-xl font-bold mb-4"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Create New Event
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Section: Basics */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-text)]">
                        📋 Event Basics
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        What is it, and where does it happen?
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Event Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Freshers Welcome Party"
                        className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. FUNAAB Main Auditorium"
                        className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Details
                      </label>
                      <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Tell people what to expect — vibe, dress code, performers..."
                        className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Section: Date & Time */}
                  <div className="space-y-4 pt-2 border-t border-[var(--color-border)]">
                    <div className="pt-4">
                      <h3 className="text-sm font-bold text-[var(--color-text)]">
                        🗓️ Date &amp; Time
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        When does it start, and when should ticket sales stop?
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Ticket Sales End Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Section: Tickets */}
                  <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-text)]">
                        🎟️ Tickets
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Add one row per ticket type. Deadline is optional —
                        leave blank to sell until the event starts.
                      </p>
                    </div>
                    {tickets.map((ticket, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-center"
                      >
                        <input
                          type="text"
                          placeholder="Type (e.g. VIP)"
                          value={ticket.type}
                          onChange={(e) =>
                            handleTicketChange(index, "type", e.target.value)
                          }
                          className="border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text)] p-2 rounded col-span-2 sm:col-span-1"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Price (₦)"
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
                        <div className="flex items-center gap-1">
                          <input
                            type="date"
                            value={ticket.deadline}
                            onChange={(e) =>
                              handleTicketChange(index, "deadline", e.target.value)
                            }
                            className="border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text)] p-2 rounded w-full"
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeTicket(index)}
                              className="shrink-0 text-[var(--color-error)] font-bold px-1"
                              aria-label="Remove ticket type"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTicket}
                      className="text-sm text-[var(--color-secondary)] hover:underline"
                    >
                      + Add Ticket Type
                    </button>
                  </div>

                  {/* Section: Payout */}
                  <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-text)]">
                        🏦 Payout Details
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Where your share of ticket sales gets sent.
                      </p>
                    </div>

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
                  </div>

                  {/* Section: Customization */}
                  <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-text)]">
                        🎨 Customization (optional)
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Fine-tune the link, look, and checkout questions for
                        this event.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Custom Event Link
                      </label>
                      <div className="flex items-center rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-surface-2)] overflow-hidden">
                        <span className="pl-3 text-sm text-[var(--color-text-muted)] whitespace-nowrap">
                          /event/
                        </span>
                        <input
                          type="text"
                          value={customSlug}
                          onChange={(e) => setCustomSlug(e.target.value)}
                          placeholder="your-custom-link"
                          className="w-full bg-transparent p-3 pl-1 text-[var(--color-text)] focus:outline-none min-w-0"
                        />
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        Leave blank to auto-generate from the title.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                        Event Theme
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {EVENT_THEMES.map((t) => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => setTheme(t.value)}
                            className={`flex flex-col items-center gap-1.5 py-2 rounded-[var(--radius-btn)] border transition ${
                              theme === t.value
                                ? "border-[var(--color-primary)]"
                                : "border-[var(--color-border)]"
                            }`}
                          >
                            <span
                              className="w-6 h-6 rounded-full"
                              style={{
                                background: `linear-gradient(135deg, ${t.primary}, ${t.accent})`,
                              }}
                            />
                            <span className="text-[10px] text-[var(--color-text-muted)]">
                              {t.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-2">
                        Custom Checkout Questions
                      </label>
                      <p className="text-xs text-[var(--color-text-muted)] mb-2">
                        Extra questions ticket buyers answer at checkout
                        (e.g. dietary needs). Your template pre-filled some —
                        add, edit, or remove as needed.
                      </p>
                      <div className="space-y-2">
                        {customFields.map((field, index) => (
                          <div
                            key={index}
                            className="flex flex-wrap items-center gap-2 p-2 rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-surface-2)]"
                          >
                            <input
                              type="text"
                              placeholder="Field label (e.g. T-shirt size)"
                              value={field.label}
                              onChange={(e) =>
                                updateCustomField(index, "label", e.target.value)
                              }
                              className="flex-1 min-w-[140px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] p-2 rounded"
                            />
                            <select
                              value={field.type}
                              onChange={(e) =>
                                updateCustomField(index, "type", e.target.value)
                              }
                              className="border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] p-2 rounded text-sm"
                            >
                              <option value="text">Text</option>
                              <option value="email">Email</option>
                              <option value="phone">Phone</option>
                              <option value="number">Number</option>
                              <option value="textarea">Long text</option>
                              <option value="checkbox">Checkbox</option>
                            </select>
                            <label className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) =>
                                  updateCustomField(
                                    index,
                                    "required",
                                    e.target.checked
                                  )
                                }
                                className="accent-[var(--color-primary)]"
                              />
                              Required
                            </label>
                            <button
                              type="button"
                              onClick={() => removeCustomField(index)}
                              className="text-[var(--color-error)] font-bold px-1"
                              aria-label="Remove question"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={addCustomField}
                        className="text-sm text-[var(--color-secondary)] hover:underline mt-2"
                      >
                        + Add Question
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Confirmation Email Subject
                      </label>
                      <input
                        type="text"
                        value={confirmationSubject}
                        onChange={(e) => setConfirmationSubject(e.target.value)}
                        placeholder="Your ticket for {{eventTitle}} is confirmed!"
                        className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
                        Confirmation Email Message
                      </label>
                      <textarea
                        value={confirmationBody}
                        onChange={(e) => setConfirmationBody(e.target.value)}
                        placeholder="Hi {{buyerName}}, thanks for grabbing a {{ticketType}} ticket..."
                        rows={3}
                        className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                      />
                      <p className="text-xs text-[var(--color-text-muted)] mt-1 break-words">
                        Placeholders: {"{{buyerName}}"}, {"{{eventTitle}}"},{" "}
                        {"{{eventDate}}"}, {"{{eventLocation}}"},{" "}
                        {"{{ticketType}}"}, {"{{ticketId}}"}
                      </p>
                    </div>
                  </div>

                  {/* Section: Image */}
                  <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-text)]">
                        🖼️ Event Image
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Shown on event cards and as the cover image.
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                      className="w-full border border-[var(--color-border)] p-3 rounded-[var(--radius-btn)] text-[var(--color-text)] bg-[var(--color-surface-2)] file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0 file:text-sm file:font-semibold
                      file:bg-[var(--color-primary)] file:text-white hover:file:bg-[var(--color-primary-dark)]"
                      required
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-3 pt-2">
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
              </>
            )}
          </div>
        </div>
      )}

      {staffModalEvent && (
        <EventStaffModal
          eventId={staffModalEvent._id}
          eventTitle={staffModalEvent.title}
          onClose={() => setStaffModalEvent(null)}
        />
      )}
    </div>
  );
}
