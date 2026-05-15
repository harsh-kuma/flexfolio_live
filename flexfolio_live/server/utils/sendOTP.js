const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"Flexfolio Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Flexfolio Verification Code",
    html: `
      <div style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
        
        <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <div style="background:#111827;padding:20px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:20px;letter-spacing:1px;">
              Flexfolio
            </h1>
          </div>

          <!-- Body -->
          <div style="padding:30px;text-align:center;">
            
            <h2 style="color:#111827;margin-bottom:10px;">
              Verify Your Email
            </h2>

            <p style="color:#6b7280;font-size:14px;margin-bottom:25px;">
              Use the OTP below to complete your verification. This code is valid for <b>10 minutes</b>.
            </p>

            <!-- OTP Box -->
            <div style="display:inline-block;padding:15px 30px;font-size:28px;letter-spacing:8px;font-weight:bold;background:#f3f4f6;border:1px dashed #d1d5db;border-radius:10px;color:#111827;">
              ${otp}
            </div>

            <p style="margin-top:25px;font-size:12px;color:#9ca3af;">
              If you did not request this, you can safely ignore this email.
            </p>

          </div>

          <!-- Footer -->
          <div style="background:#f9fafb;padding:15px;text-align:center;font-size:11px;color:#9ca3af;">
            © ${new Date().getFullYear()} Flexfolio. All rights reserved.
          </div>

        </div>
      </div>
    `,
  });
};