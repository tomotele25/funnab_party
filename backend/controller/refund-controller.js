const axios = require("axios");
const Transaction = require("../models/transaction");
const Ticket = require("../models/purchasedTicket");

const initiateRefund = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    if (transaction.status !== "success") {
      return res.status(400).json({
        message: `Cannot refund a transaction with status "${transaction.status}".`,
      });
    }

    await axios.post(
      "https://api.paystack.co/refund",
      { transaction: transaction.paystackReference },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    transaction.status = "refunded";
    await transaction.save();

    await Ticket.updateMany(
      { paymentRef: transaction.paystackReference },
      { $set: { status: "cancelled" } }
    );

    return res.status(200).json({ message: "Refund initiated.", transaction });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({
      message: "Failed to initiate refund.",
      error: error.response?.data?.message || error.message,
    });
  }
};

module.exports = { initiateRefund };
