import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Career Platform" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html: message,
    });

    console.log("📧 Email sent to:", to);
  } catch (err) {
    console.error("Email sending failed:", err);
  }
};
