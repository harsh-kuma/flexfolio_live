const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send contact form verification / enable email
 * Used when portfolio contact form is enabled via email verification
 */
exports.sendContactVerificationEmail = async (email, otp, portfolioName) => {
  await resend.emails.send({
    from: "Flexfolio Contact <security@flexfolio.online>",
    to: email,
    subject: `Enable Contact Form for ${portfolioName || "Your Portfolio"}`,

    html: `
      <div style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
        
        <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
          
          <!-- HEADER -->
          <div style="background:#0f172a;padding:20px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:20px;">
              Flexfolio Contact System
            </h1>
          </div>

          <!-- BODY -->
          <div style="padding:30px;text-align:center;">
            
            <h2 style="color:#111827;margin-bottom:10px;">
              Enable Contact Form
            </h2>

            <p style="color:#6b7280;font-size:14px;margin-bottom:25px;">
              We received a request to enable the contact form for your portfolio.
              Use the OTP below to verify and activate it.
            </p>

            <!-- OTP BOX -->
            <div style="display:inline-block;padding:15px 30px;font-size:28px;letter-spacing:8px;font-weight:bold;background:#f3f4f6;border:1px dashed #d1d5db;border-radius:10px;color:#111827;">
              ${otp}
            </div>

            <p style="margin-top:20px;font-size:13px;color:#6b7280;">
              Portfolio: <b>${portfolioName || "N/A"}</b>
            </p>

            <p style="margin-top:25px;font-size:12px;color:#9ca3af;">
              This code will expire in 10 minutes. If you did not request this, ignore this email.
            </p>

          </div>

          <!-- FOOTER -->
          <div style="background:#f9fafb;padding:15px;text-align:center;font-size:11px;color:#9ca3af;">
            © ${new Date().getFullYear()} Flexfolio. All rights reserved.
          </div>

        </div>
      </div>
    `,
  });
};