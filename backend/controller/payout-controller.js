const mongoose = require("mongoose");
const Transaction = require("../models/transaction");
const Payout = require("../models/payout");
const User = require("../models/user");

const getPayoutSummary = async (req, res) => {
  try {
    const owed = await Transaction.aggregate([
      { $match: { status: "success", payoutStatus: "unpaid" } },
      {
        $group: {
          _id: "$organizer",
          amountOwed: { $sum: "$splitDetails.organizerAmount" },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { amountOwed: -1 } },
    ]);

    const organizerIds = owed.map((o) => o._id).filter(Boolean);
    const users = await User.find({ _id: { $in: organizerIds } }).select(
      "fullname email"
    );
    const userMap = new Map(users.map((u) => [String(u._id), u]));

    const summary = owed.map((o) => ({
      organizerId: o._id,
      organizer: userMap.get(String(o._id)) || null,
      amountOwed: o.amountOwed || 0,
      transactionCount: o.transactionCount,
    }));

    res.status(200).json({ summary });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch payout summary." });
  }
};

const listPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find()
      .populate("organizer", "fullname email")
      .populate("paidBy", "fullname email")
      .sort({ createdAt: -1 });

    res.status(200).json({ payouts });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch payouts." });
  }
};

const createPayout = async (req, res) => {
  try {
    const { organizerId, note } = req.body;

    if (!organizerId || !mongoose.isValidObjectId(organizerId)) {
      return res.status(400).json({ message: "Valid organizerId is required." });
    }

    const outstandingTransactions = await Transaction.find({
      organizer: organizerId,
      status: "success",
      payoutStatus: "unpaid",
    });

    if (outstandingTransactions.length === 0) {
      return res
        .status(400)
        .json({ message: "No outstanding balance for this organizer." });
    }

    const amount = outstandingTransactions.reduce(
      (sum, t) => sum + (t.splitDetails?.organizerAmount || 0),
      0
    );

    const payout = await Payout.create({
      organizer: organizerId,
      amount,
      transactions: outstandingTransactions.map((t) => t._id),
      note: note || "",
      paidBy: req.user.id,
    });

    await Transaction.updateMany(
      { _id: { $in: outstandingTransactions.map((t) => t._id) } },
      { payoutStatus: "paid", payout: payout._id }
    );

    res.status(201).json({ payout });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to record payout." });
  }
};

module.exports = { getPayoutSummary, listPayouts, createPayout };
