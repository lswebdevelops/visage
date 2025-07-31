// sendEmail.js
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // ex: smtp.gmail.com
    port: process.env.EMAIL_PORT, // ex: 587
    secure: false, // This should be true for port 465 (SMTPS) or false for 587 (STARTTLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Visage" <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log("Email enviado: ", info.messageId); // THIS IS NOT BEING LOGGED!
  } catch (error) {
    console.error("Erro no envio do email:", error); // THIS IS LIKELY BEING LOGGED!
    throw error;
  }
};

export default sendEmail;