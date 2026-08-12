const Event = require("../models/events");
const Organizer = require("../models/organizer");
const Transaction = require("../models/transaction");
const Ticket = require("../models/purchasedTicket");
const PlatformSettings = require("../models/platformSettings");

const getOrCreateSettings = async () => {
  let settings = await PlatformSettings.findOne();
  if (!settings) {
    settings = await PlatformSettings.create({});
  }
  return settings;
};

const paginationParams = (req) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const listEvents = async (req, res) => {
  try {
    const { page, limit, skip } = paginationParams(req);
    const [events, total] = await Promise.all([
      Event.find()
        .populate("organizer", "fullname email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Event.countDocuments(),
    ]);
    res.status(200).json({ events, total, page, limit });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch events." });
  }
};

const listOrganizers = async (req, res) => {
  try {
    const { page, limit, skip } = paginationParams(req);
    const [organizers, total] = await Promise.all([
      Organizer.find().sort({ _id: -1 }).skip(skip).limit(limit),
      Organizer.countDocuments(),
    ]);
    res.status(200).json({ organizers, total, page, limit });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch organizers." });
  }
};

const listTransactions = async (req, res) => {
  try {
    const { page, limit, skip } = paginationParams(req);
    const [transactions, total] = await Promise.all([
      Transaction.find()
        .populate("organizer", "fullname email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(),
    ]);
    res.status(200).json({ transactions, total, page, limit });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch transactions." });
  }
};

const getPlatformTotals = async (req, res) => {
  try {
    const [revenueAgg, eventCount, ticketCount] = await Promise.all([
      Transaction.aggregate([
        { $match: { status: "success" } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
            totalPlatformFee: { $sum: "$splitDetails.platformFee" },
            successfulTransactions: { $sum: 1 },
          },
        },
      ]),
      Event.countDocuments(),
      Ticket.countDocuments(),
    ]);

    const totals = revenueAgg[0] || {
      totalRevenue: 0,
      totalPlatformFee: 0,
      successfulTransactions: 0,
    };

    res.status(200).json({
      totalRevenue: totals.totalRevenue,
      totalPlatformFee: totals.totalPlatformFee,
      successfulTransactions: totals.successfulTransactions,
      totalEvents: eventCount,
      totalTickets: ticketCount,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch platform totals." });
  }
};

const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["draft", "published", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ event });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to update event status." });
  }
};

const getPlatformSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({ settings });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch platform settings." });
  }
};

const updatePlatformSettings = async (req, res) => {
  try {
    const { feeType, percentageValue, flatValue } = req.body;

    if (feeType && !["flat", "percentage", "hybrid"].includes(feeType)) {
      return res.status(400).json({ message: "Invalid feeType." });
    }

    const settings = await getOrCreateSettings();
    if (feeType !== undefined) settings.feeType = feeType;
    if (percentageValue !== undefined) settings.percentageValue = Number(percentageValue);
    if (flatValue !== undefined) settings.flatValue = Number(flatValue);
    await settings.save();

    res.status(200).json({ settings });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to update platform settings." });
  }
};

module.exports = {
  getOrCreateSettings,
  listEvents,
  listOrganizers,
  listTransactions,
  getPlatformTotals,
  updateEventStatus,
  getPlatformSettings,
  updatePlatformSettings,
};
