const axios = require("axios");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const initializePayment = async ({
  email,
  amount,
  reference,
  callback_url,
}) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount,
        reference,
        callback_url,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw new Error("Paystack initialization failed.");
  }
};

const verifyPayment = async (reference) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    return response.data.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw new Error("Paystack verification failed.");
  }
};

module.exports = { initializePayment, verifyPayment };
