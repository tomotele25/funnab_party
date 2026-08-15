const Transaction = require("../models/transaction");
const Payout = require("../models/payout");
const Event = require("../models/events");

const getOrganizerWallet = async (req, res) => {
  try {
    const organizerId = req.user._id;

    const transactions = await Transaction.find({
      organizer: organizerId,
      status: "success",
    }).sort({ createdAt: -1 });

    const totalEarned = transactions.reduce(
      (sum, t) => sum + (t.splitDetails?.organizerAmount || 0),
      0
    );
    const paidOut = transactions
      .filter((t) => t.payoutStatus === "paid")
      .reduce((sum, t) => sum + (t.splitDetails?.organizerAmount || 0), 0);
    const pending = totalEarned - paidOut;

    const eventSlugs = [...new Set(transactions.map((t) => t.eventId))];
    const events = await Event.find({ slug: { $in: eventSlugs } }).select(
      "slug title"
    );
    const eventTitleMap = new Map(events.map((e) => [e.slug, e.title]));

    const recentTransactions = transactions.slice(0, 30).map((t) => ({
      _id: t._id,
      eventTitle: eventTitleMap.get(t.eventId) || t.eventId,
      ticketType: t.ticketType,
      quantity: t.quantity || 1,
      amount: t.splitDetails?.organizerAmount || 0,
      payoutStatus: t.payoutStatus,
      createdAt: t.createdAt,
    }));

    const payoutHistory = await Payout.find({ organizer: organizerId })
      .sort({ createdAt: -1 })
      .select("amount note createdAt");

    res.status(200).json({
      totalEarned,
      paidOut,
      pending,
      recentTransactions,
      payoutHistory,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch wallet." });
  }
};

module.exports = { getOrganizerWallet };
