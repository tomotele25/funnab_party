const Event = require("../models/events");
const axios = require("axios");

const BANK_CODES = {
  "Access Bank": "044",
  EcoBank: "050",
  "Fidelity Bank": "070",
  "First Bank": "011",
  "Guaranty Trust Bank": "058",
  "Kuda Microfinance Bank": "50211",
  "Moniepoint MFB": "50515",
  "Opay Digital Services Limited (OPay)": "999991",
  Paycom: "999991",
  Palmpay: "999992",
  "Stanbic IBTC Bank": "221",
  UBA: "033",
  "Union Bank": "032",
  "Zenith Bank": "057",
};

const getBankCode = (bankName) => BANK_CODES[bankName] || null;

const createEvent = async (req, res) => {
  try {
    const { title, date, location, details, tickets, accountNumber, bankName } =
      req.body;

    if (
      !title ||
      !date ||
      !location ||
      !details ||
      !tickets ||
      !accountNumber ||
      !bankName
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const bankCode = getBankCode(bankName);
    if (!bankCode)
      return res
        .status(400)
        .json({ success: false, message: "Invalid bank selected" });

    let ticketsArray = [];
    if (typeof tickets === "string") {
      ticketsArray = JSON.parse(tickets).map((t) => ({
        type: t.type,
        price: Number(t.price),
        quantity: Number(t.quantity),
        deadline: t.deadline ? new Date(t.deadline) : undefined,
      }));
    } else {
      ticketsArray = tickets.map((t) => ({
        type: t.type,
        price: Number(t.price),
        quantity: Number(t.quantity),
        deadline: t.deadline ? new Date(t.deadline) : undefined,
      }));
    }

    const imageUrl = req.file?.path || req.body.image;

    // Create Paystack subaccount
    const paystackRes = await axios.post(
      "https://api.paystack.co/subaccount",
      {
        business_name: title,
        settlement_bank: bankCode,
        account_number: accountNumber,
        percentage_charge: 10,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const subaccountId = paystackRes.data.data.subaccount_code;

    const newEvent = new Event({
      title,
      location,
      details,
      date,
      image: imageUrl,
      tickets: ticketsArray,
      organizer: req.user.id,
      accountNumber,
      bankName,
      subaccountId,
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      newEvent,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = createEvent;
