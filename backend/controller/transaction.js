require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");
const QRCode = require("qrcode");
const Transaction = require("../models/transaction");
const Ticket = require("../models/purchasedTicket");
const Event = require("../models/events");
const { sendTicketEmail } = require("../utils/mailer");
const { getOrCreateSettings } = require("./admin-controller");
const { calculateCheckoutTotals, calculateServiceFee } = require("../utils/fees");

const signQrToken = (qrToken) =>
  crypto
    .createHmac("sha256", process.env.QR_SECRET)
    .update(qrToken)
    .digest("hex");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatEventDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(date))
    : "";

const getPaymentQuote = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const ticketSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (ticketSubtotal <= 0) {
      return res.status(400).json({ message: "Invalid ticket subtotal." });
    }

    const settings = await getOrCreateSettings();
    const quote = calculateCheckoutTotals(ticketSubtotal, settings);

    return res.status(200).json({ quote });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to calculate quote." });
  }
};

const initializePayment = async (req, res) => {
  try {
    const { email, items, userName, accountNo, customFieldResponses } = req.body;

    if (
      !email ||
      !userName ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    const ticketSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (ticketSubtotal <= 0) {
      return res.status(400).json({ message: "Invalid ticket subtotal." });
    }

    const settings = await getOrCreateSettings();
    const { gatewayFee, total } = calculateCheckoutTotals(
      ticketSubtotal,
      settings
    );

    const transactions = await Promise.all(
      items.map((item) => {
        if (!item.eventId || !item.organizer || !item.ticketType) {
          throw new Error("Item is missing eventId, organizer or ticketType");
        }

        return Transaction.create({
          eventId: item.eventId,
          organizer: item.organizer,
          ticketType: item.ticketType,
          amount: item.price * item.quantity,
          expectedAmount: item.price * item.quantity,
          userName,
          userEmail: email,
          paystackReference: `TRX-${Date.now()}-${item.eventId}`,
          customFieldResponses: Array.isArray(customFieldResponses)
            ? customFieldResponses
            : [],
        });
      })
    );

    const firstTransaction = transactions[0];
    firstTransaction.ticketSubtotal = ticketSubtotal;
    firstTransaction.gatewayFee = gatewayFee;
    firstTransaction.expectedAmount = total;
    await firstTransaction.save();

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: total * 100,
        reference: firstTransaction.paystackReference,
        callback_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/event/payment`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      authorization_url: paystackRes.data.data.authorization_url,
      reference: firstTransaction.paystackReference,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ message: "Payment initialization failed." });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({ message: "Reference is required." });
    }

    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { status: paymentStatus, amount, currency } = paystackRes.data.data;

    const transaction = await Transaction.findOneAndUpdate(
      { paystackReference: reference },
      { status: paymentStatus === "success" ? "success" : "failed" },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    if (transaction.expectedAmount * 100 !== amount || currency !== "NGN") {
      return res.status(400).json({ message: "Payment details mismatch." });
    }

    if (paymentStatus === "success") {
      const event = await Event.findOne({ slug: transaction.eventId });

      if (!event) {
        return res
          .status(404)
          .json({ message: "Event for this transaction was not found." });
      }

      const qrToken = crypto.randomBytes(24).toString("hex");

      const newTicket = new Ticket({
        ticketId: `TCK-${Date.now()}-${transaction._id}`,
        event: event._id,
        buyerName: transaction.userName,
        buyerEmail: transaction.userEmail,
        ticketType: transaction.ticketType,
        pricePaid: transaction.amount,
        paymentRef: transaction.paystackReference,
        qrToken,
        qrSignature: signQrToken(qrToken),
        customFieldResponses: transaction.customFieldResponses || [],
      });

      await newTicket.save();

      await Event.updateOne(
        { slug: transaction.eventId, "tickets.type": transaction.ticketType },
        { $inc: { "tickets.$.sold": 1 } }
      );

      // The customer paid the gateway fee on top of the ticket price at
      // checkout (Paystack's cost), but the platform's own commission
      // (default 4.5%) comes out of the organizer's share of the ticket
      // price — computed per line item so multi-item carts split correctly.
      const settings = await getOrCreateSettings();
      const platformFee = Math.round(
        calculateServiceFee(transaction.amount, settings)
      );
      transaction.splitDetails = {
        organizerAmount: transaction.amount - platformFee,
        platformFee,
        gatewayFee: transaction.gatewayFee || 0,
      };
      await transaction.save();

      try {
        const qrImage = await QRCode.toDataURL(qrToken);

        const placeholders = {
          "{{buyerName}}": newTicket.buyerName,
          "{{eventTitle}}": event.title,
          "{{eventDate}}": formatEventDate(event.date),
          "{{eventLocation}}": event.location,
          "{{ticketType}}": newTicket.ticketType,
          "{{ticketId}}": newTicket.ticketId,
        };
        const applyPlaceholders = (str) =>
          Object.entries(placeholders).reduce(
            (acc, [key, value]) => acc.split(key).join(value || ""),
            str
          );

        const customSubject = event.confirmationEmail?.subject
          ? applyPlaceholders(event.confirmationEmail.subject)
          : undefined;
        const customMessage = event.confirmationEmail?.body
          ? applyPlaceholders(event.confirmationEmail.body)
          : undefined;

        await sendTicketEmail({
          to: newTicket.buyerEmail,
          buyerName: newTicket.buyerName,
          eventTitle: event.title,
          eventDate: event.date,
          eventStartTime: event.startTime,
          eventLocation: event.location,
          ticketType: newTicket.ticketType,
          ticketId: newTicket.ticketId,
          pricePaid: newTicket.pricePaid,
          qrImage,
          customSubject,
          customMessage,
        });
      } catch (emailError) {
        console.error("Failed to send ticket email:", emailError.message);
      }

      return res.status(200).json({
        message: "Payment verified & ticket generated",
        transaction,
        ticket: newTicket,
      });
    }

    return res.status(400).json({ message: "Payment failed." });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ message: "Payment verification failed." });
  }
};

module.exports = {
  getPaymentQuote,
  initializePayment,
  verifyPayment,
};
