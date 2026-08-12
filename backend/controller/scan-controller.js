const crypto = require("crypto");
const Ticket = require("../models/purchasedTicket");
const Event = require("../models/events");
const EventStaff = require("../models/eventStaff");

const signQrToken = (qrToken) =>
  crypto
    .createHmac("sha256", process.env.QR_SECRET)
    .update(qrToken)
    .digest("hex");

const validateTicket = async (req, res) => {
  try {
    const { qrToken } = req.body;

    if (!qrToken) {
      return res.status(400).json({ success: false, message: "qrToken is required." });
    }

    const ticket = await Ticket.findOne({ qrToken });
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Invalid ticket." });
    }

    const expectedSignature = signQrToken(qrToken);
    if (expectedSignature !== ticket.qrSignature) {
      return res
        .status(400)
        .json({ success: false, message: "Tampered or invalid QR code." });
    }

    const event = await Event.findById(ticket.event);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    const isOwner = String(event.organizer) === String(req.user._id);
    const isStaff = isOwner
      ? false
      : await EventStaff.exists({ event: event._id, user: req.user._id });

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: "This ticket does not belong to one of your events.",
      });
    }

    const updated = await Ticket.findOneAndUpdate(
      { qrToken, status: "valid" },
      { $set: { status: "used", scannedAt: new Date(), scannedBy: req.user._id } },
      { new: true }
    );

    if (!updated) {
      const current = await Ticket.findOne({ qrToken });
      return res.status(409).json({
        success: false,
        message:
          current?.status === "used"
            ? "Ticket already scanned."
            : `Ticket not valid (status: ${current?.status}).`,
        status: current?.status,
        scannedAt: current?.scannedAt,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket valid — checked in.",
      ticket: updated,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: "Scan failed." });
  }
};

module.exports = { validateTicket };
