const axios = require("axios");
const Transaction = require("../models/transaction");

// Initialize Paystack payment
const initializePayment = async (req, res) => {
  try {
    const { eventId, organizer, email, amount } = req.body;

    if (!eventId || !organizer || !email || !amount) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Create transaction in DB
    const transaction = await Transaction.create({
      eventId,
      organizer,
      amount,
      paystackRefrence: `TRX-${Date.now()}`,
    });

    // Initialize Paystack transaction
    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Paystack expects kobo
        reference: transaction.paystackRefrence,
        callback_url: "https://funnabparty.vercel.app/event/payment", // Update to your live URL
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
      reference: transaction.paystackRefrence,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ message: "Payment initialization failed." });
  }
};

// Verify Paystack payment
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

    const { status, amount, customer } = paystackRes.data.data;

    // Update transaction status in DB
    const transaction = await Transaction.findOneAndUpdate(
      { paystackRefrence: reference },
      { status: status === "success" ? "success" : "failed" },
      { new: true }
    );

    return res.status(200).json({
      message: "Payment verified",
      transaction,
      paystackData: { status, amount, customer },
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ message: "Payment verification failed." });
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
};
