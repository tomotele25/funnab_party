const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const sendTicketEmail = async ({
  to,
  buyerName,
  eventTitle,
  eventDate,
  eventStartTime,
  eventLocation,
  ticketType,
  ticketId,
  pricePaid,
  qrImage,
}) => {
  const qrCid = "ticket-qr";
  const base64Data = qrImage.split(",")[1];
  const formattedDate = formatDate(eventDate);
  const formattedPrice =
    typeof pricePaid === "number" ? `₦${pricePaid.toLocaleString()}` : "";

  const html = `
  <!doctype html>
  <html>
    <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#111111;border-radius:16px;overflow:hidden;border:1px solid #2a2a2a;">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#f472b6,#22d3ee);background-color:#ec4899;padding:28px 24px;text-align:center;">
                  <p style="margin:0;font-size:13px;letter-spacing:2px;color:#ffffffcc;text-transform:uppercase;font-weight:600;">FUNAABPARTY</p>
                  <p style="margin:8px 0 0;font-size:22px;font-weight:800;color:#ffffff;">You're going! 🎉</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:28px 24px 8px;">
                  <p style="margin:0 0 4px;font-size:14px;color:#9ca3af;">Hi ${buyerName},</p>
                  <h1 style="margin:0 0 20px;font-size:20px;color:#ffffff;font-weight:700;">${eventTitle}</h1>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;margin-bottom:24px;">
                    ${
                      formattedDate
                        ? `<tr>
                      <td style="padding:14px 16px;border-bottom:1px solid #2a2a2a;font-size:13px;color:#9ca3af;">Date</td>
                      <td style="padding:14px 16px;border-bottom:1px solid #2a2a2a;font-size:13px;color:#ffffff;text-align:right;">${formattedDate}${
                            eventStartTime ? ` · ${eventStartTime}` : ""
                          }</td>
                    </tr>`
                        : ""
                    }
                    ${
                      eventLocation
                        ? `<tr>
                      <td style="padding:14px 16px;border-bottom:1px solid #2a2a2a;font-size:13px;color:#9ca3af;">Location</td>
                      <td style="padding:14px 16px;border-bottom:1px solid #2a2a2a;font-size:13px;color:#ffffff;text-align:right;">${eventLocation}</td>
                    </tr>`
                        : ""
                    }
                    <tr>
                      <td style="padding:14px 16px;border-bottom:1px solid #2a2a2a;font-size:13px;color:#9ca3af;">Ticket Type</td>
                      <td style="padding:14px 16px;border-bottom:1px solid #2a2a2a;font-size:13px;color:#ffffff;text-align:right;">${ticketType}</td>
                    </tr>
                    <tr>
                      <td style="padding:14px 16px;${formattedPrice ? "border-bottom:1px solid #2a2a2a;" : ""}font-size:13px;color:#9ca3af;">Ticket ID</td>
                      <td style="padding:14px 16px;${formattedPrice ? "border-bottom:1px solid #2a2a2a;" : ""}font-size:12px;color:#ffffff;text-align:right;font-family:monospace;">${ticketId}</td>
                    </tr>
                    ${
                      formattedPrice
                        ? `<tr>
                      <td style="padding:14px 16px;font-size:13px;color:#9ca3af;">Amount Paid</td>
                      <td style="padding:14px 16px;font-size:14px;color:#f472b6;text-align:right;font-weight:700;">${formattedPrice}</td>
                    </tr>`
                        : ""
                    }
                  </table>

                  <!-- QR -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;margin-bottom:20px;">
                    <tr>
                      <td style="padding:20px;text-align:center;">
                        <img src="cid:${qrCid}" alt="Ticket QR code" width="200" height="200" style="display:block;margin:0 auto;width:200px;height:200px;" />
                        <p style="margin:12px 0 0;font-size:12px;color:#6b7280;">Show this QR code at the entrance</p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 24px;font-size:12px;line-height:1.6;color:#6b7280;text-align:center;">
                    This ticket is valid for one entry only. Please don't share this QR code with anyone else.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:16px 24px 24px;text-align:center;border-top:1px solid #2a2a2a;">
                  <p style="margin:16px 0 0;font-size:11px;color:#4b5563;">Powered by Chowspace</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  await transporter.sendMail({
    from: `"FUNAABParty" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your ticket for ${eventTitle}`,
    html,
    attachments: [
      {
        filename: "ticket-qr.png",
        content: base64Data,
        encoding: "base64",
        cid: qrCid,
      },
    ],
  });
};

module.exports = { sendTicketEmail };
