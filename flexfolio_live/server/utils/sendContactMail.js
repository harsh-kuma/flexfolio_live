const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendContactMail = async ({
  ownerEmail,
  ownerName,
  senderName,
  senderEmail,
  message,
}) => {

  await transporter.sendMail({
    from: `"Flexfolio Contact" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    replyTo: senderEmail,
    subject: `New Portfolio Message from ${senderName}`,

    html: `
      <div style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">

        <div style="max-width:620px;margin:40px auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <div style="background:#0f172a;padding:24px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:1px;">
              Flexfolio
            </h1>

            <p style="margin-top:6px;color:#cbd5e1;font-size:13px;">
              Portfolio Contact Notification
            </p>
          </div>

          <!-- BODY -->
          <div style="padding:32px;">

            <h2 style="margin-top:0;color:#111827;font-size:22px;">
              Hello ${ownerName || "there"} 👋
            </h2>

            <p style="color:#4b5563;font-size:15px;line-height:1.7;">
              You received a new contact message from your portfolio.
            </p>

            <!-- MESSAGE CARD -->
            <div style="margin-top:24px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:22px;">

              <div style="margin-bottom:18px;">
                <p style="margin:0;font-size:12px;color:#6b7280;">
                  Sender Name
                </p>

                <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#111827;">
                  ${senderName}
                </p>
              </div>

              <div style="margin-bottom:18px;">
                <p style="margin:0;font-size:12px;color:#6b7280;">
                  Sender Email
                </p>

                <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#2563eb;">
                  ${senderEmail}
                </p>
              </div>

              <div>
                <p style="margin:0;font-size:12px;color:#6b7280;">
                  Message
                </p>

                <div style="margin-top:8px;background:#ffffff;border-radius:10px;padding:16px;border:1px solid #e5e7eb;">
                  <p style="margin:0;color:#374151;font-size:14px;line-height:1.8;white-space:pre-line;">
                    ${message}
                  </p>
                </div>
              </div>

            </div>

            <!-- CTA -->
            <div style="margin-top:28px;text-align:center;">

              <a
                href="mailto:${senderEmail}"
                style="
                  display:inline-block;
                  background:#2563eb;
                  color:#ffffff;
                  text-decoration:none;
                  padding:12px 24px;
                  border-radius:10px;
                  font-size:14px;
                  font-weight:600;
                "
              >
                Reply to ${senderName}
              </a>

            </div>

            <p style="margin-top:30px;color:#9ca3af;font-size:12px;text-align:center;">
              This message was sent through your Flexfolio portfolio contact form.
            </p>

          </div>

          <!-- FOOTER -->
          <div style="background:#f9fafb;padding:18px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:11px;color:#9ca3af;">
              © ${new Date().getFullYear()} Flexfolio. All rights reserved.
            </p>
          </div>

        </div>

      </div>
    `,
  });

};