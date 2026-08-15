const Event = require("../models/events");
const User = require("../models/user");
const EventStaff = require("../models/eventStaff");
const axios = require("axios");
const { getOrCreateSettings } = require("./admin-controller");

const BANK_CODES = {
  "Access Bank": "044",
  EcoBank: "050",
  "Fidelity Bank": "070",
  "First Bank": "011",
  "Guaranty Trust Bank": "058",
  "Kuda Microfinance Bank": "50211",
  "Moniepoint MFB": "50515",
  "Opay Digital Services Limited (OPay)": "999991",
  Paycom: "999991",
  Palmpay: "999992",
  "Stanbic IBTC Bank": "221",
  UBA: "033",
  "Union Bank": "032",
  "Zenith Bank": "057",
};

const getBankCode = (bankName) => BANK_CODES[bankName] || null;

const createEvent = async (req, res) => {
  try {
    const {
      title,
      date,
      startTime,
      location,
      details,
      tickets,
      accountNumber,
      bankName,
      status,
      customSlug,
      theme,
      customFields,
      confirmationSubject,
      confirmationBody,
    } = req.body;

    if (
      !title ||
      !date ||
      !startTime ||
      !location ||
      !details ||
      !tickets ||
      !accountNumber ||
      !bankName
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const bankCode = getBankCode(bankName);
    if (!bankCode) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid bank selected" });
    }

    let ticketsArray = [];
    const parsedTickets =
      typeof tickets === "string" ? JSON.parse(tickets) : tickets;

    ticketsArray = parsedTickets.map((t) => {
      const formatted = {
        type: t.type,
        price: Number(t.price),
        quantity: Number(t.quantity),
      };
      if (t.deadline) formatted.deadline = new Date(t.deadline);
      return formatted;
    });

    const imageUrl = req.file?.path || req.body.image;

    let customFieldsArray = [];
    if (customFields) {
      const parsedCustomFields =
        typeof customFields === "string" ? JSON.parse(customFields) : customFields;
      customFieldsArray = parsedCustomFields
        .filter((f) => f.label && f.label.trim())
        .map((f) => ({
          label: f.label.trim(),
          type: f.type || "text",
          required: Boolean(f.required),
        }));
    }

    if (customSlug !== undefined && customSlug !== "") {
      const existing = await Event.findOne({ customSlug: customSlug.toLowerCase().trim() });
      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: "That custom event link is already taken." });
      }
    }

    const settings = await getOrCreateSettings();

    const paystackRes = await axios.post(
      "https://api.paystack.co/subaccount",
      {
        business_name: title,
        settlement_bank: bankCode,
        account_number: accountNumber,
        percentage_charge: settings.percentageValue,
      },
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    const subaccountId = paystackRes.data.data.subaccount_code;

    const newEvent = new Event({
      title,
      location,
      details,
      date,
      startTime,
      image: imageUrl,
      tickets: ticketsArray,
      organizer: req.user.id,
      accountNumber,
      bankName,
      subaccountId,
      status: status === "draft" ? "draft" : "published",
      customSlug: customSlug ? customSlug.toLowerCase().trim() : undefined,
      theme: theme || "classic",
      customFields: customFieldsArray,
      confirmationEmail: {
        subject: confirmationSubject || "",
        body: confirmationBody || "",
      },
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      newEvent,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.response?.data || error.message,
    });
  }
};

const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id }).sort({
      createdAt: -1,
    });

    const totalEvents = events.length;
    const totalTicketsSold = events.reduce(
      (sum, ev) => sum + ev.tickets.reduce((s, t) => s + t.sold, 0),
      0
    );
    const totalRevenue = events.reduce(
      (sum, ev) =>
        sum + ev.tickets.reduce((s, t) => s + t.sold * t.price, 0),
      0
    );

    res.status(200).json({
      success: true,
      events,
      totals: { totalEvents, totalTicketsSold, totalRevenue },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};

const addEventStaff = async (req, res) => {
  try {
    const { eventId, email } = req.body;

    if (!eventId || !email) {
      return res
        .status(400)
        .json({ success: false, message: "eventId and email are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (String(event.organizer) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ success: false, message: "You do not own this event" });
    }

    const staffUser = await User.findOne({ email });
    if (!staffUser) {
      return res.status(404).json({
        success: false,
        message: "No account found for that email. Ask them to sign up first.",
      });
    }

    const staff = await EventStaff.findOneAndUpdate(
      { event: event._id, user: staffUser._id },
      { event: event._id, user: staffUser._id },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, staff });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Failed to add staff" });
  }
};

const listEventStaff = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (String(event.organizer) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ success: false, message: "You do not own this event" });
    }

    const staff = await EventStaff.find({ event: eventId }).populate(
      "user",
      "fullname email"
    );

    res.status(200).json({ success: true, staff });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Failed to fetch staff" });
  }
};

module.exports = { createEvent, getMyEvents, addEventStaff, listEventStaff };
