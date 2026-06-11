import nodemailer from "nodemailer";

console.log({
  host: process.env.BREVO_SMTP_HOST,
  port: process.env.BREVO_SMTP_PORT,
  user: process.env.BREVO_SMTP_USER,
  pass: process.env.BREVO_SMTP_PASS,
});

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: process.env.BREVO_SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export const sendMail = (to, subject, text, html) => transporter.sendMail({ from: '"Ezulix here" <ezulix.here@gmail.com>', to, subject, text, html });
