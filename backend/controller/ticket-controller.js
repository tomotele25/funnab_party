const QRCode = require("qrcode");
const Ticket = require("../models/purchasedTicket");
require("../models/events");

const lookupTickets = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const escaped = String(email).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const tickets = await Ticket.find({
      buyerEmail: { $regex: `^${escaped}$`, $options: "i" },
    })
      .populate("event", "title slug date location image")
      .sort({ createdAt: -1 });

    return res.status(200).json({ tickets });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Failed to look up tickets." });
  }
};

const getTicketQR = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    const qrImage = await QRCode.toDataURL(ticket.qrToken);

    return res.status(200).json({ qrImage, ticket });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Failed to generate ticket QR." });
  }
};

module.exports = { getTicketQR, lookupTickets };
