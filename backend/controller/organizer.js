const Event = require("../models/events");

const createEvent = async (req, res) => {
  try {
    const { title, date, location, details, tickets } = req.body;

    if (!title || !date || !location || !details || !tickets) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Parse tickets from JSON string if it's a string
    let ticketsArray = [];
    if (typeof tickets === "string") {
      ticketsArray = JSON.parse(tickets).map((t) => ({
        type: t.type,
        price: Number(t.price),
        quantity: Number(t.quantity),
        deadline: t.deadline ? new Date(t.deadline) : undefined,
      }));
    } else {
      ticketsArray = tickets;
    }

    // Handle image if uploaded via multer
    const imageUrl = req.file?.path || req.body.image;

    const newEvent = new Event({
      title,
      location,
      details,
      date,
      image: imageUrl,
      tickets: ticketsArray,
      organizer: req.user.id,
    });

    await newEvent.save();

    res
      .status(201)
      .json({ success: true, message: "Event created successfully", newEvent });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = createEvent;
