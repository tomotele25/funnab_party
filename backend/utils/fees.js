// Payment gateway cost, charged to the customer on top of the ticket price: ₦200 + 1.5%.
const calculateGatewayFee = (ticketSubtotal) => {
  if (ticketSubtotal <= 0) return 0;
  return Math.round(ticketSubtotal * 0.015) + 200;
};

// Platform's own commission — deducted from the organizer's payout, not
// charged to the customer. Defaults to 4.5% (see PlatformSettings).
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

// Customer pays: ticket price + gateway fee only.
// Organizer receives: ticket price - platform service fee.
const calculateCheckoutTotals = (ticketSubtotal, settings) => {
  const serviceFee = Math.round(calculateServiceFee(ticketSubtotal, settings));
  const gatewayFee = calculateGatewayFee(ticketSubtotal);
  const total = ticketSubtotal + gatewayFee;
  const organizerAmount = ticketSubtotal - serviceFee;
  return { ticketSubtotal, serviceFee, gatewayFee, total, organizerAmount };
};

module.exports = { calculateGatewayFee, calculateServiceFee, calculateCheckoutTotals };