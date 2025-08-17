const Event = require("../models/events");

const getUpcomingEvent = async (req, res) => {
  try {
    const now = new Date();

    const events = await Event.find({ date: { $gte: now } })
      .select("slug title location date image details tickets organizer ")
      .sort({ date: 1 });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No upcoming events found." });
    }

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTodaysEvents = async (req, res) => {
  try {
    const now = new Date();

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );

    const events = await Event.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .select("slug title location date details image tickets organizer ")
      .sort({ date: 1 });

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events today." });
    }

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching today's events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

getEventBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const event = await Event.findOne({ slug });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTodaysEvents, getUpcomingEvent, getEventBySlug };
