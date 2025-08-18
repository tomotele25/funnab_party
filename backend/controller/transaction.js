require("dotenv").config();
const axios = require("axios");
const Transaction = require("../models/transaction");

// Initialize Paystack payment
const initializePayment = async (req, res) => {
  try {
    const { email, amount, items } = req.body;

    if (
      !email ||
      !amount ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Create transactions for each item
    const transactions = await Promise.all(
      items.map((item) => {
        if (!item.eventId || !item.organizer) {
          throw new Error("Item is missing eventId or organizer");
        }

        return Transaction.create({
          eventId: item.eventId,
          organizer: item.organizer,
          amount: item.price * item.quantity,
          paystackRefrence: `TRX-${Date.now()}-${item.id}`,
        });
      })
    );

    const firstTransaction = transactions[0];

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        reference: firstTransaction.paystackRefrence,
        callback_url: "https://funnabparty.vercel.app/event/payment",
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
      reference: firstTransaction.paystackRefrence,
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

    const { status, amount, customer } = paystackRes.data.data;

    const transaction = await Transaction.findOneAndUpdate(
      { paystackReference: reference },
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
