// Paystack Nigeria local-card pricing: 1.5% + ₦100 (waived under ₦2,500), capped at ₦2,000.
const calculateGatewayFee = (amount) => {
  if (amount <= 0) return 0;
  let fee = amount * 0.015;
  if (amount >= 2500) fee += 100;
  return Math.min(Math.round(fee), 2000);
};

const calculateServiceFee = (ticketSubtotal, settings) => {
  if (settings.feeType === "percentage") {
    return ticketSubtotal * (settings.percentageValue / 100);
  }
  if (settings.feeType === "flat") {
    return settings.flatValue;
  }
  return (
    ticketSubtotal * (settings.percentageValue / 100) + settings.flatValue
  );
};

// Customer pays: ticket price + service fee (platform's cut) + gateway fee (Paystack's cut).
// Organizer receives the full ticket price; nothing is deducted from their side.
const calculateCheckoutTotals = (ticketSubtotal, settings) => {
  const serviceFee = Math.round(calculateServiceFee(ticketSubtotal, settings));
  const gatewayFee = calculateGatewayFee(ticketSubtotal + serviceFee);
  const total = ticketSubtotal + serviceFee + gatewayFee;
  return { ticketSubtotal, serviceFee, gatewayFee, total };
};

module.exports = { calculateGatewayFee, calculateServiceFee, calculateCheckoutTotals };
