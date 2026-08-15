import type { EventTheme } from "./eventThemes";

export interface EventTemplateField {
  label: string;
  type: "text" | "email" | "phone" | "number" | "textarea" | "checkbox";
  required: boolean;
}

export interface EventTemplateTicket {
  type: string;
  price: string;
  quantity: string;
  deadline: string;
}

export interface EventTemplate {
  id: string;
  emoji: string;
  label: string;
  description: string;
  theme: EventTheme["value"];
  tickets: EventTemplateTicket[];
  customFields: EventTemplateField[];
}

export const EVENT_TEMPLATES: EventTemplate[] = [
  {
    id: "party",
    emoji: "🎉",
    label: "Party / Nightlife",
    description: "General admission + VIP, no extra questions at checkout.",
    theme: "sunset",
    tickets: [
      { type: "General Admission", price: "", quantity: "", deadline: "" },
      { type: "VIP", price: "", quantity: "", deadline: "" },
    ],
    customFields: [],
  },
  {
    id: "concert",
    emoji: "🎤",
    label: "Concert / Live Show",
    description: "General, VIP and Backstage tiers.",
    theme: "midnight",
    tickets: [
      { type: "General", price: "", quantity: "", deadline: "" },
      { type: "VIP", price: "", quantity: "", deadline: "" },
      { type: "Backstage Pass", price: "", quantity: "", deadline: "" },
    ],
    customFields: [],
  },
  {
    id: "conference",
    emoji: "🎓",
    label: "Conference / Seminar",
    description: "Standard + student pricing, asks for company and dietary needs.",
    theme: "classic",
    tickets: [
      { type: "Standard", price: "", quantity: "", deadline: "" },
      { type: "Student", price: "", quantity: "", deadline: "" },
    ],
    customFields: [
      { label: "Organization / Company Name", type: "text", required: false },
      { label: "Dietary Restrictions", type: "textarea", required: false },
    ],
  },
  {
    id: "blank",
    emoji: "⚪",
    label: "Start from Blank",
    description: "Build everything yourself, one ticket tier to start.",
    theme: "classic",
    tickets: [{ type: "", price: "", quantity: "", deadline: "" }],
    customFields: [],
  },
];
