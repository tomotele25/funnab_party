const mongoose = require("mongoose");
const slugify = require("slugify");

const ticketSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  deadline: {
    type: Date,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

const customFieldSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "email", "phone", "number", "textarea", "checkbox"],
      default: "text",
    },
    required: { type: Boolean, default: false },
  },
  { _id: false }
);

const EVENT_THEMES = ["classic", "midnight", "sunset", "mono"];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    customSlug: {
      type: String,
      unique: true,
      sparse: true,
    },
    details: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      enum: EVENT_THEMES,
      default: "classic",
    },
    customFields: {
      type: [customFieldSchema],
      default: [],
    },
    confirmationEmail: {
      subject: { type: String, default: "" },
      body: { type: String, default: "" },
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tickets: [ticketSchema],
    accountNumber: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    subaccountId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "published",
    },
  },
  { timestamps: true }
);

eventSchema.index({ date: 1, status: 1 });

eventSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified("customSlug")) {
    this.customSlug = this.customSlug
      ? slugify(this.customSlug, { lower: true, strict: true })
      : undefined;
  }
  next();
});

module.exports = mongoose.model("Event", eventSchema);
module.exports.EVENT_THEMES = EVENT_THEMES;
