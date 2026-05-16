const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4 // <-- Perfect implementation of the IPv4 fix
});

exports.sendOTP = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Flexfolio Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Flexfolio Verification Code",
      html: `
        <div style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
            
            <div style="background:#111827;padding:20px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:20px;letter-spacing:1px;">
                Flexfolio
              </h1>
            </div>

            <div style="padding:30px;text-align:center;">
              <h2 style="color:#111827;margin-bottom:10px;">
                Verify Your Email
              </h2>
              <p style="color:#6b7280;font-size:14px;margin-bottom:25px;">
                Use the OTP below to complete your verification. This code is valid for <b>10 minutes</b>.
              </p>

              <div style="display:inline-block;padding:15px 30px;font-size:28px;letter-spacing:8px;font-weight:bold;background:#f3f4f6;border:1px dashed #d1d5db;border-radius:10px;color:#111827;">
                ${otp}
              </div>

              <p style="margin-top:25px;font-size:12px;color:#9ca3af;">
                If you did not request this, you can safely ignore this email.
              </p>
            </div>

            <div style="background:#f9fafb;padding:15px;text-align:center;font-size:11px;color:#9ca3af;">
              © ${new Date().getFullYear()} Flexfolio. All rights reserved.
            </div>

          </div>
        </div>
      `,
    });
    
    // Optional: Log success in your Render console
    console.log(`OTP sent successfully to ${email}. Message ID: ${info.messageId}`);
    return true; 

  } catch (error) {
    // Prevent the API route from crashing if email fails to send
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send verification email. Please try again later.");
  }
};